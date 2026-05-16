import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { resources as resourcesTable, type ResourceRow } from "@/db/schema";
import type { Resource, Category, Distribution, VerifiedStatus } from "./types";

const EMPTY_AMENITIES = {
  wheelchairAccessible: false,
  onSiteParking: false,
  restrooms: false,
  serviceAnimals: false,
  yearRound: false,
};

const EMPTY_ELIGIBILITY = {
  openAccess: false,
  income: false,
  residency: false,
  documentation: false,
  notes: null,
};

// Map a database row to the Resource shape the UI components expect.
export function rowToResource(r: ResourceRow): Resource {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    type: r.type,
    category: r.category as Category,
    verified: r.verified,
    verifiedStatus: r.verifiedStatus as VerifiedStatus,
    address: r.address,
    city: r.city,
    state: r.state,
    zip: r.zip,
    county: r.county,
    lat: r.lat,
    lng: r.lng,
    phone: r.phone,
    email: r.email,
    website: r.website,
    googleMaps: r.googleMaps,
    appleMaps: r.appleMaps,
    hours: r.hours,
    description: r.description,
    descriptionHtml: r.descriptionHtml,
    amenities: r.amenities ?? EMPTY_AMENITIES,
    eligibility: r.eligibility ?? EMPTY_ELIGIBILITY,
    distribution: r.distribution as Distribution,
    languages: r.languages ?? [],
  };
}

// All published listings, alphabetical — for the public directory.
export async function getPublishedResources(): Promise<Resource[]> {
  const rows = await getDb()
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.status, "published"))
    .orderBy(asc(resourcesTable.name));
  return rows.map(rowToResource);
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const rows = await getDb()
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.slug, slug))
    .limit(1);
  const row = rows[0];
  return row && row.status === "published" ? rowToResource(row) : null;
}

// Raw row by id — for volunteer/approver tooling (includes hidden listings).
export async function getResourceRowById(
  id: string,
): Promise<ResourceRow | null> {
  const rows = await getDb()
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllResourceRows(): Promise<ResourceRow[]> {
  return getDb()
    .select()
    .from(resourcesTable)
    .orderBy(asc(resourcesTable.name));
}
