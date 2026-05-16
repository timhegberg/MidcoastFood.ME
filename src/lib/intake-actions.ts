"use server";

// Public intake forms that feed the approver review queue (no account needed).
// Submissions land in the `submissions` table with submittedBy = null.

import { getDb } from "@/db";
import {
  submissions,
  type ResourcePayload,
  type CorrectionPayload,
} from "@/db/schema";
import { geocodeAddress } from "@/lib/geocode";

type Result = { ok: true } | { ok: false; error: string };

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

// The business form uses human-readable amenity labels; map them to keys.
const AMENITY_BY_LABEL: Record<string, keyof ResourcePayload["amenities"]> = {
  "Wheelchair Accessible": "wheelchairAccessible",
  "Year-Round Program": "yearRound",
  "Service Animals Allowed": "serviceAnimals",
  "Restrooms Available to the Public": "restrooms",
};

// ── Business listing → review queue (kind: "new") ───────────────────────────

export async function submitBusinessListingAction(
  _formName: string,
  fd: FormData,
): Promise<Result> {
  if (!fd.get("terms")) {
    return { ok: false, error: "Please accept the terms to submit." };
  }
  const name = str(fd, "businessName");
  if (!name) return { ok: false, error: "Business name is required." };

  const amenityLabels = new Set(fd.getAll("amenities").map(String));
  const amenities = {
    wheelchairAccessible: false,
    onSiteParking: false,
    restrooms: false,
    serviceAnimals: false,
    yearRound: false,
  };
  for (const label of amenityLabels) {
    const key = AMENITY_BY_LABEL[label];
    if (key) amenities[key] = true;
  }

  const languages = [
    ...fd.getAll("languages").map(String),
    ...(str(fd, "otherLanguages") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ];

  const address = str(fd, "address");
  const city = str(fd, "city");
  const zip = str(fd, "zip");
  const geo = await geocodeAddress({ address, city, state: "ME", zip });

  const payload: ResourcePayload = {
    name,
    type: "Local Business",
    category: "Business",
    address,
    city,
    state: "ME",
    zip,
    county: null,
    lat: geo?.lat ?? 44.8,
    lng: geo?.lng ?? -69.4,
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    website: str(fd, "website"),
    hours: str(fd, "hours"),
    description: str(fd, "programDetails"),
    amenities,
    eligibility: {
      openAccess: false,
      income: false,
      residency: false,
      documentation: false,
      notes: null,
    },
    distribution: null,
    languages,
  };

  const contact = [str(fd, "email"), str(fd, "phone")]
    .filter(Boolean)
    .join(" · ");

  await getDb().insert(submissions).values({
    kind: "new",
    resourceId: null,
    payload,
    submittedBy: null,
    submitterRole: "business",
    submitterContact: contact || null,
    status: "pending",
  });

  return { ok: true };
}

// ── Correction report → review queue (kind: "correction") ───────────────────

export async function submitCorrectionAction(
  _formName: string,
  fd: FormData,
): Promise<Result> {
  if (!fd.get("terms")) {
    return { ok: false, error: "Please accept the terms to submit." };
  }
  const resourceName = str(fd, "resourceName");
  const correctionType = str(fd, "correctionType");
  const details = str(fd, "details");
  if (!resourceName) return { ok: false, error: "Tell us which listing this is about." };
  if (!correctionType) return { ok: false, error: "Pick what's wrong." };
  if (!details) return { ok: false, error: "Add some details about the correction." };

  const payload: CorrectionPayload = {
    resourceName,
    resourceUrl: str(fd, "resourceUrl"),
    correctionType,
    details,
  };

  const contact = [str(fd, "contactName"), str(fd, "email")]
    .filter(Boolean)
    .join(" · ");

  await getDb().insert(submissions).values({
    kind: "correction",
    resourceId: null,
    payload,
    submittedBy: null,
    submitterRole: null,
    submitterContact: contact || null,
    status: "pending",
  });

  return { ok: true };
}
