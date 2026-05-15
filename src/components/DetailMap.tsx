"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Resource } from "@/lib/types";
import { CATEGORY_COLOR } from "@/lib/types";

export default function DetailMap({ resource }: { resource: Resource }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, {
        center: [resource.lat, resource.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19 },
      ).addTo(map);

      const color = CATEGORY_COLOR[resource.category];
      L.marker([resource.lat, resource.lng], {
        icon: L.divIcon({
          html: `<svg viewBox="0 0 24 32" width="32" height="32"><path fill="${color}" stroke="white" stroke-width="2" d="M12 1c5.5 0 10 4.4 10 9.9 0 7-10 20.1-10 20.1S2 17.9 2 10.9C2 5.4 6.5 1 12 1z"/><circle cx="12" cy="10.5" r="3.4" fill="white"/></svg>`,
          className: "mcf-pin-wrap",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      }).addTo(map);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [resource]);

  return <div ref={ref} className="h-full w-full" />;
}
