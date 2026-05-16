import "server-only";

// Best-effort address → coordinates via OpenStreetMap Nominatim (free, no key).
// Used when a volunteer submits a listing without explicit coordinates.
// Failure is non-fatal — the caller falls back and an approver can correct it.

export async function geocodeAddress(parts: {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}): Promise<{ lat: number; lng: number } | null> {
  const query = [parts.address, parts.city, parts.state || "Maine", parts.zip]
    .filter(Boolean)
    .join(", ");
  if (!query.trim()) return null;

  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=" +
      encodeURIComponent(query);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "MidcoastFood.ME/1.0 (https://midcoastfood.me)",
      },
      // Don't let a slow geocoder hang a form submission.
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { lat: string; lon: string }[];
    const hit = data[0];
    if (!hit) return null;
    const lat = Number(hit.lat);
    const lng = Number(hit.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}
