import data from "@/data/resources.json";
import meta from "@/data/meta.json";
import type { Resource } from "./types";

export const resources: Resource[] = data as Resource[];

export const counties: string[] = meta.counties;
export const languages: string[] = meta.languages;
export const resourceTypes: string[] = meta.resourceTypes;

export function getResource(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export function townOptions(): string[] {
  const set = new Set(resources.map((r) => r.city).filter(Boolean) as string[]);
  return [...set].sort((a, b) => a.localeCompare(b));
}
