"use client";

import { useEffect, useRef, useState } from "react";
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

// Whole-of-Maine fallback view, used until resources resolve.
const MAINE_CENTER: [number, number] = [44.8, -69.4];

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

  // Latest props mirrored into refs so the ResizeObserver callback — which is
  // created once — can always re-fit against current data.
  const resourcesRef = useRef(resources);
  const userLocationRef = useRef(userLocation);
  resourcesRef.current = resources;
  userLocationRef.current = userLocation;

  // Re-fit the viewport to the current resource set. Leaflet computes the fit
  // from the container's pixel size, so this must run only after the container
  // has a real size (see the ResizeObserver below).
  function fitToResources() {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;
    const rs = resourcesRef.current;
    const points: [number, number][] = rs.map((r) => [r.lat, r.lng]);
    const loc = userLocationRef.current;
    if (loc) points.push([loc.lat, loc.lng]);
    if (points.length === 0) {
      map.setView(MAINE_CENTER, 7);
      return;
    }
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
  }

  // Init map once. A ResizeObserver keeps Leaflet's internal size in sync with
  // the container — fixing the "map centered on the wrong region" bug that
  // happens when fitBounds runs before the flex/grid layout has sized the pane.
  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | null = null;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;
      const map = L.map(containerRef.current, {
        center: MAINE_CENTER,
        zoom: 7,
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

      // When the container's box changes (initial layout, window resize,
      // sidebar toggling), tell Leaflet and re-fit so the view stays correct.
      let firstFitDone = false;
      observer = new ResizeObserver(() => {
        const m = mapRef.current;
        if (!m) return;
        const { width, height } = containerRef.current!.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        m.invalidateSize({ animate: false });
        if (!firstFitDone) {
          firstFitDone = true;
          fitToResources();
        }
      });
      observer.observe(containerRef.current);
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync markers with the filtered resource set, then re-fit.
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !ready) return;
    const current = markersRef.current;
    const seen = new Set<string>();

    for (const r of resources) {
      seen.add(r.slug);
      if (!current.has(r.slug)) {
        const m = L.marker([r.lat, r.lng], {
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
    fitToResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
