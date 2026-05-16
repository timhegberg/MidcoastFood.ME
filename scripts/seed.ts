// Seeds the `resources` table from the Webflow snapshot in src/data.
// Run with: npm run db:seed   (after db:push has created the tables)
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { resources } from "../src/db/schema";
import data from "../src/data/resources.json";
import type { Resource } from "../src/lib/types";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set — run `vercel env pull .env.local`.");

  const db = drizzle(neon(url), { schema: { resources } });
  const items = data as Resource[];

  const rows = items.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    type: r.type,
    category: r.category,
    verified: r.verified,
    verifiedStatus: r.verifiedStatus,
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
    description: r.description ?? null,
    descriptionHtml: r.descriptionHtml ?? null,
    amenities: r.amenities,
    eligibility: r.eligibility,
    distribution: r.distribution,
    languages: r.languages,
    status: "published" as const,
  }));

  // Insert in chunks — the neon-http driver caps statement size.
  let inserted = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50);
    const res = await db
      .insert(resources)
      .values(chunk)
      .onConflictDoNothing({ target: resources.id })
      .returning({ id: resources.id });
    inserted += res.length;
  }
  console.log(`Seeded ${inserted} resources (${rows.length} in snapshot).`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
