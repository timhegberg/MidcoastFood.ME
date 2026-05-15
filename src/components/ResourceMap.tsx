"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, CircleMarker } from "leaflet";
import type { Resource } from "@/lib/types";
import { CATEGORY_COLOR } from "@/lib/types";

type LeafletNs = typeof import("leaflet");

type Props = {
  resources: Resource[];
  hovered: string | null;
  onHover: (slug: string | null) => void;
  userLocation: { lat: number; lng: number } | null;
};

function pinIcon(L: LeafletNs, color: string, active = false) {
  const size = active ? 36 : 28;
  return L.divIcon({
    html: `<div style="--c:${color};width:${size}px;height:${size}px" class="mcf-pin ${active ? "is-active" : ""}">
      <svg viewBox="0 0 24 32" width="${size}" height="${size}" aria-hidden="true">
        <path fill="${color}" stroke="white" stroke-width="2" d="M12 1c5.5 0 10 4.4 10 9.9 0 7-10 20.1-10 20.1S2 17.9 2 10.9C2 5.4 6.5 1 12 1z"/>
        <circle cx="12" cy="10.5" r="3.4" fill="white"/>
      </svg>
    </div>`,
    className: "mcf-pin-wrap",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
  });
}

export default function ResourceMap({
  resources,
  hovered,
  onHover,
  userLocation,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<LeafletNs | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const userMarkerRef = useRef<CircleMarker | null>(null);
  const [ready, setReady] = useState(false);

  const initialCenter: [number, number] = useMemo(() => {
    if (resources.length === 0) return [44.5, -69.5];
    const lat = resources.reduce((s, r) => s + r.lat, 0) / resources.length;
    const lng = resources.reduce((s, r) => s + r.lng, 0) / resources.length;
    return [lat, lng];
  }, [resources]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        center: initialCenter,
        zoom: 8,
        zoomControl: true,
        attributionControl: true,
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
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !ready) return;
    const current = markersRef.current;
    const seen = new Set<string>();

    for (const r of resources) {
      seen.add(r.slug);
      let m = current.get(r.slug);
      if (!m) {
        m = L.marker([r.lat, r.lng], {
          icon: pinIcon(L, CATEGORY_COLOR[r.category]),
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:inherit">
              <div style="font-weight:600">${escapeHtml(r.name)}</div>
              <div style="color:#6b6b6b;font-size:12px;margin-top:2px">${escapeHtml(r.type ?? "")}</div>
              <div style="margin-top:6px"><a href="/resources/${r.slug}" style="color:#0F2A4A;font-weight:500">More info →</a></div>
            </div>`,
          );
        m.on("mouseover", () => onHover(r.slug));
        m.on("mouseout", () => onHover(null));
        current.set(r.slug, m);
      }
    }
    for (const [slug, m] of current) {
      if (!seen.has(slug)) {
        map.removeLayer(m);
        current.delete(slug);
      }
    }
    if (resources.length > 0) {
      const bounds = L.latLngBounds(resources.map((r) => [r.lat, r.lng]));
      if (userLocation) bounds.extend([userLocation.lat, userLocation.lng]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [resources, onHover, userLocation, ready]);

  // Hover sync
  useEffect(() => {
    const L = leafletRef.current;
    if (!L) return;
    for (const [slug, m] of markersRef.current) {
      const r = resources.find((x) => x.slug === slug);
      if (!r) continue;
      m.setIcon(pinIcon(L, CATEGORY_COLOR[r.category], slug === hovered));
      m.setZIndexOffset(slug === hovered ? 1000 : 0);
    }
  }, [hovered, resources]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
    if (userLocation) {
      userMarkerRef.current = L.circleMarker(
        [userLocation.lat, userLocation.lng],
        {
          radius: 8,
          color: "#fff",
          weight: 3,
          fillColor: "#0F2A4A",
          fillOpacity: 1,
        },
      ).addTo(map);
    }
  }, [userLocation]);

  return <div ref={containerRef} className="h-full w-full" />;
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  );
}
