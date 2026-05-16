"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { resources, submissions, type ResourcePayload } from "@/db/schema";
import { CATEGORIES } from "@/lib/types";
import { requireUser, requireRole } from "@/lib/session";
import { getResourceRowById } from "@/lib/db-resources";
import { getResourceOwnedBy } from "@/lib/db-account";
import { geocodeAddress } from "@/lib/geocode";

type Result = { ok: true } | { ok: false; error: string };

// ── Geocoding (for the listing editor's map picker) ─────────────────────────
// Wraps the server-side Nominatim lookup so the client can resolve an address
// to coordinates. Requires a signed-in user so it isn't an open proxy.

export async function geocodeAddressAction(
  address: string,
  city: string,
  state: string,
  zip: string,
): Promise<{ lat: number; lng: number } | null> {
  await requireUser();
  return geocodeAddress({ address, city, state, zip });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "resource";
  const db = getDb();
  let slug = base;
  let n = 1;
  // Loop until a free slug is found — collisions are rare.
  while (true) {
    const hit = await db
      .select({ id: resources.id })
      .from(resources)
      .where(eq(resources.slug, slug))
      .limit(1);
    if (hit.length === 0) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function parsePayload(fd: FormData): ResourcePayload {
  const amenity = new Set(fd.getAll("amenity").map(String));
  const elig = new Set(fd.getAll("eligibility").map(String));
  const languages = fd.getAll("language").map(String).filter(Boolean);
  const lat = Number(fd.get("lat"));
  const lng = Number(fd.get("lng"));

  return {
    name: str(fd, "name") ?? "",
    type: str(fd, "type"),
    category: str(fd, "category") ?? "Other",
    address: str(fd, "address"),
    city: str(fd, "city"),
    state: str(fd, "state") ?? "ME",
    zip: str(fd, "zip"),
    county: str(fd, "county"),
    lat: Number.isFinite(lat) ? lat : 0,
    lng: Number.isFinite(lng) ? lng : 0,
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    website: str(fd, "website"),
    hours: str(fd, "hours"),
    description: str(fd, "description"),
    amenities: {
      wheelchairAccessible: amenity.has("wheelchairAccessible"),
      onSiteParking: amenity.has("onSiteParking"),
      restrooms: amenity.has("restrooms"),
      serviceAnimals: amenity.has("serviceAnimals"),
      yearRound: amenity.has("yearRound"),
    },
    eligibility: {
      openAccess: elig.has("openAccess"),
      income: elig.has("income"),
      residency: elig.has("residency"),
      documentation: elig.has("documentation"),
      notes: str(fd, "eligibilityNotes"),
    },
    distribution: (str(fd, "distribution") as ResourcePayload["distribution"]) ?? null,
    languages,
  };
}

// ── Submit a listing (volunteer add/edit, or business profile) ──────────────

export async function submitListingAction(fd: FormData): Promise<Result> {
  const user = await requireUser();
  const payload = parsePayload(fd);

  if (!payload.name) return { ok: false, error: "A name is required." };
  if (!CATEGORIES.includes(payload.category as (typeof CATEGORIES)[number])) {
    return { ok: false, error: "Pick a category." };
  }

  let targetResourceId = str(fd, "resourceId");
  let kind: "new" | "edit" = targetResourceId ? "edit" : "new";

  // Ownership / target checks.
  if (targetResourceId) {
    const target = await getResourceRowById(targetResourceId);
    if (!target) return { ok: false, error: "That listing no longer exists." };
    if (user.role === "business" && target.ownerUserId !== user.id) {
      return { ok: false, error: "You can only edit your own profile." };
    }
  } else if (user.role === "business") {
    // A business gets exactly one listing — edit it instead of making another.
    const owned = await getResourceOwnedBy(user.id);
    if (owned) {
      kind = "edit";
      targetResourceId = owned.id;
      payload.lat = payload.lat || owned.lat;
      payload.lng = payload.lng || owned.lng;
    }
  }

  // Fill coordinates: keep entered values, else geocode, else keep existing.
  if (!payload.lat || !payload.lng) {
    const geo = await geocodeAddress(payload);
    if (geo) {
      payload.lat = geo.lat;
      payload.lng = geo.lng;
    } else if (targetResourceId) {
      const existing = await getResourceRowById(targetResourceId);
      if (existing) {
        payload.lat = existing.lat;
        payload.lng = existing.lng;
      }
    }
  }
  if (!payload.lat || !payload.lng) {
    // Maine-center fallback — an approver corrects it during review.
    payload.lat = 44.8;
    payload.lng = -69.4;
  }

  await getDb()
    .insert(submissions)
    .values({
      kind,
      resourceId: targetResourceId ?? null,
      payload,
      submittedBy: user.id,
      submitterRole: user.role,
      status: "pending",
    });

  return { ok: true };
}

// ── Approve / reject (approver only) ────────────────────────────────────────

export async function approveSubmissionAction(fd: FormData): Promise<Result> {
  const approver = await requireRole("approver");
  const id = Number(fd.get("submissionId"));
  if (!Number.isInteger(id)) return { ok: false, error: "Invalid submission." };

  const db = getDb();
  const rows = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);
  const sub = rows[0];
  if (!sub) return { ok: false, error: "Submission not found." };
  if (sub.status !== "pending") {
    return { ok: false, error: "This submission was already reviewed." };
  }

  // Corrections are free-text reports — there's nothing to publish.
  // "Approving" one just marks it resolved (the approver fixes the listing
  // separately via the editor if needed).
  if (sub.kind === "correction") {
    await db
      .update(submissions)
      .set({
        status: "approved",
        reviewedBy: approver.id,
        reviewedAt: new Date(),
      })
      .where(eq(submissions.id, id));
    return { ok: true };
  }

  const p = sub.payload as ResourcePayload;

  if (sub.kind === "new") {
    await db.insert(resources).values({
      id: randomUUID(),
      slug: await uniqueSlug(p.name),
      name: p.name,
      type: p.type,
      category: p.category,
      verified: sub.submitterRole !== "business", // volunteer-added = verified
      verifiedStatus: sub.submitterRole === "business" ? "Unverified" : "Verified",
      address: p.address,
      city: p.city,
      state: p.state,
      zip: p.zip,
      county: p.county,
      lat: p.lat,
      lng: p.lng,
      phone: p.phone,
      email: p.email,
      website: p.website,
      hours: p.hours,
      description: p.description,
      amenities: p.amenities,
      eligibility: p.eligibility,
      distribution: p.distribution,
      languages: p.languages,
      status: "published",
      // A business's own submission, once approved, is owned by that business.
      ownerUserId: sub.submitterRole === "business" ? sub.submittedBy : null,
    });
  } else {
    if (!sub.resourceId) {
      return { ok: false, error: "Edit submission has no target listing." };
    }
    await db
      .update(resources)
      .set({
        name: p.name,
        type: p.type,
        category: p.category,
        address: p.address,
        city: p.city,
        state: p.state,
        zip: p.zip,
        county: p.county,
        lat: p.lat,
        lng: p.lng,
        phone: p.phone,
        email: p.email,
        website: p.website,
        hours: p.hours,
        description: p.description,
        amenities: p.amenities,
        eligibility: p.eligibility,
        distribution: p.distribution,
        languages: p.languages,
        updatedAt: new Date(),
      })
      .where(eq(resources.id, sub.resourceId));
  }

  await db
    .update(submissions)
    .set({ status: "approved", reviewedBy: approver.id, reviewedAt: new Date() })
    .where(eq(submissions.id, id));

  return { ok: true };
}

export async function rejectSubmissionAction(fd: FormData): Promise<Result> {
  const approver = await requireRole("approver");
  const id = Number(fd.get("submissionId"));
  const note = str(fd, "reviewNote");
  if (!Number.isInteger(id)) return { ok: false, error: "Invalid submission." };

  const db = getDb();
  const rows = await db
    .select({ status: submissions.status })
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);
  if (!rows[0]) return { ok: false, error: "Submission not found." };
  if (rows[0].status !== "pending") {
    return { ok: false, error: "This submission was already reviewed." };
  }

  await db
    .update(submissions)
    .set({
      status: "rejected",
      reviewNote: note,
      reviewedBy: approver.id,
      reviewedAt: new Date(),
    })
    .where(eq(submissions.id, id));

  return { ok: true };
}
