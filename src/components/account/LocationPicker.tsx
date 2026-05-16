"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, LeafletMouseEvent } from "leaflet";
import { geocodeAddressAction } from "@/lib/listing-actions";

type LeafletNs = typeof import("leaflet");
type Coords = { lat: number; lng: number };

const MAINE_CENTER: [number, number] = [44.8, -69.4];

function pinIcon(L: LeafletNs) {
  return L.divIcon({
    html: `<svg viewBox="0 0 24 32" width="34" height="34" aria-hidden="true">
      <path fill="#D94F2D" stroke="white" stroke-width="2" d="M12 1c5.5 0 10 4.4 10 9.9 0 7-10 20.1-10 20.1S2 17.9 2 10.9C2 5.4 6.5 1 12 1z"/>
      <circle cx="12" cy="10.5" r="3.4" fill="white"/>
    </svg>`,
    className: "mcf-pin-wrap",
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });
}

type Props = {
  initialLat?: number;
  initialLng?: number;
  // The listing form, so the picker can read the address fields to geocode.
  formRef: React.RefObject<HTMLFormElement | null>;
};

export default function LocationPicker({
  initialLat,
  initialLng,
  formRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const leafletRef = useRef<LeafletNs | null>(null);

  const hasInitial =
    typeof initialLat === "number" &&
    typeof initialLng === "number" &&
    initialLat !== 0 &&
    initialLng !== 0;

  const [coords, setCoords] = useState<Coords | null>(
    hasInitial ? { lat: initialLat!, lng: initialLng! } : null,
  );
  const [status, setStatus] = useState<
    "idle" | "looking" | "notfound" | "empty"
  >("idle");

  // Create or move the draggable marker.
  function placeMarker(L: LeafletNs, map: LeafletMap, c: Coords) {
    if (!markerRef.current) {
      const m = L.marker([c.lat, c.lng], {
        draggable: true,
        icon: pinIcon(L),
      }).addTo(map);
      m.on("dragend", () => {
        const ll = m.getLatLng();
        setCoords({ lat: ll.lat, lng: ll.lng });
      });
      markerRef.current = m;
    } else {
      markerRef.current.setLatLng([c.lat, c.lng]);
    }
  }

  // Init map once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const center = coords
        ? ([coords.lat, coords.lng] as [number, number])
        : MAINE_CENTER;
      const map = L.map(containerRef.current, {
        center,
        zoom: coords ? 15 : 7,
      });
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        },
      ).addTo(map);
      mapRef.current = map;

      // Clicking the map places / moves the pin.
      map.on("click", (e: LeafletMouseEvent) => {
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      if (coords) placeMarker(L, map, coords);
      // The form is visible on mount, but invalidate once to be safe.
      setTimeout(() => map.invalidateSize(), 80);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the marker in sync whenever coords change (drag, click, or lookup).
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !coords) return;
    placeMarker(L, map, coords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  async function lookUp() {
    const form = formRef.current;
    if (!form) return;
    const val = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? "";
    const address = val("address");
    const city = val("city");
    if (!address && !city) {
      setStatus("empty");
      return;
    }
    setStatus("looking");
    const found = await geocodeAddressAction(
      address,
      city,
      val("state") || "ME",
      val("zip"),
    );
    if (found) {
      setStatus("idle");
      setCoords(found);
      mapRef.current?.setView([found.lat, found.lng], 16);
    } else {
      setStatus("notfound");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={lookUp}
          disabled={status === "looking"}
          className="rounded-full border border-brand-rule bg-white px-3.5 py-1.5 text-sm font-medium hover:bg-brand-cream disabled:opacity-60"
        >
          {status === "looking" ? "Looking up…" : "Look up address on map"}
        </button>
        {coords && (
          <span className="text-xs text-brand-ink/55">
            Pin set to {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </span>
        )}
      </div>

      <div
        ref={containerRef}
        className="h-64 w-full overflow-hidden rounded-xl border border-brand-rule"
      />

      <p className="text-xs text-brand-ink/55">
        {status === "empty"
          ? "Enter a street address or town above first, then look it up."
          : status === "notfound"
            ? "Couldn't find that address — click the map to drop the pin manually."
            : "Look up the address, then drag the pin (or click the map) to set the exact spot."}
      </p>

      {/* Submitted with the form; blank values fall back to server-side geocoding. */}
      <input type="hidden" name="lat" value={coords?.lat ?? ""} />
      <input type="hidden" name="lng" value={coords?.lng ?? ""} />
    </div>
  );
}
