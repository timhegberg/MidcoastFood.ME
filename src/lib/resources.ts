import meta from "@/data/meta.json";

// Static lookup data. The 16 Maine counties and the language/type vocabularies
// don't change, so they stay as build-time constants. Live listing data now
// comes from the database — see src/lib/db-resources.ts.

export const counties: string[] = meta.counties;
export const languages: string[] = meta.languages;
export const resourceTypes: string[] = meta.resourceTypes;
