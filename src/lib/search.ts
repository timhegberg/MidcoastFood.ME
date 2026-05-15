import Fuse from "fuse.js";
import type { Resource } from "./types";

export function makeFuse(resources: Resource[]) {
  return new Fuse(resources, {
    includeScore: true,
    threshold: 0.34,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: "name", weight: 0.4 },
      { name: "city", weight: 0.2 },
      { name: "county", weight: 0.1 },
      { name: "type", weight: 0.1 },
      { name: "description", weight: 0.08 },
      { name: "address", weight: 0.06 },
      { name: "zip", weight: 0.06 },
    ],
  });
}

export function search(
  fuse: Fuse<Resource>,
  query: string,
  fallback: Resource[],
): Resource[] {
  const q = query.trim();
  if (!q) return fallback;
  return fuse.search(q).map((r) => r.item);
}

// Haversine — miles
export function distanceMi(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
