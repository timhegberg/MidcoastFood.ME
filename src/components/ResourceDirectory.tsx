"use client";

import { useEffect, useMemo, useState } from "react";
import FilterBar, { Filters } from "@/components/FilterBar";
import ResourceCard from "@/components/ResourceCard";
import ResourceMap from "@/components/ResourceMap";
import { counties } from "@/lib/resources";
import { type Category, type Resource } from "@/lib/types";
import { distanceMi, makeFuse, search as fuseSearch } from "@/lib/search";

const initialFilters: Filters = {
  query: "",
  categories: new Set<Category>(),
  county: "all",
  openAccessOnly: false,
  verifiedOnly: false,
  wheelchairOnly: false,
  yearRoundOnly: false,
  sort: "name",
  useLocation: false,
};

export default function ResourceDirectory({
  resources,
}: {
  resources: Resource[];
}) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [hovered, setHovered] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<"off" | "asking" | "on" | "denied">("off");

  const fuse = useMemo(() => makeFuse(resources), [resources]);

  // Geolocation flow
  useEffect(() => {
    if (!filters.useLocation) {
      setUserLocation(null);
      if (geoState === "on") setGeoState("off");
      return;
    }
    if (!("geolocation" in navigator)) {
      setGeoState("denied");
      return;
    }
    setGeoState("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("on");
        setFilters((f) => (f.sort === "name" ? { ...f, sort: "nearest" } : f));
      },
      () => setGeoState("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600_000 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.useLocation]);

  const filtered = useMemo(() => {
    let list = fuseSearch(fuse, filters.query, resources);

    if (filters.categories.size > 0) {
      list = list.filter((r) => filters.categories.has(r.category));
    }
    if (filters.county !== "all") {
      list = list.filter((r) => r.county === filters.county);
    }
    if (filters.openAccessOnly) {
      list = list.filter((r) => r.eligibility.openAccess);
    }
    if (filters.verifiedOnly) {
      list = list.filter((r) => r.verifiedStatus === "Verified");
    }
    if (filters.wheelchairOnly) {
      list = list.filter((r) => r.amenities.wheelchairAccessible);
    }
    if (filters.yearRoundOnly) {
      list = list.filter((r) => r.amenities.yearRound);
    }

    // Sort
    if (filters.sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sort === "verified") {
      list = [...list].sort((a, b) => {
        const av = a.verifiedStatus === "Verified" ? 0 : 1;
        const bv = b.verifiedStatus === "Verified" ? 0 : 1;
        return av - bv || a.name.localeCompare(b.name);
      });
    } else if (filters.sort === "nearest" && userLocation) {
      list = [...list].sort(
        (a, b) => distanceMi(userLocation, a) - distanceMi(userLocation, b),
      );
    }
    return list;
  }, [filters, fuse, userLocation]);

  const counts = useMemo(() => {
    const c: Record<Category, number> = {
      Government: 0,
      Community: 0,
      WCB: 0,
      LFFP: 0,
      Religious: 0,
      Business: 0,
      Other: 0,
    };
    for (const r of resources) c[r.category]++;
    return c;
  }, [resources]);

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden">
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        counts={counts}
        counties={counties}
        total={resources.length}
        shown={filtered.length}
        geoState={geoState}
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="min-h-0 overflow-y-auto px-4 pb-12 pt-4 sm:px-6">
          <div className="mx-auto grid grid-cols-1 max-w-3xl gap-3">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-brand-rule bg-white p-10 text-center">
                <p className="font-display text-lg font-medium">
                  No resources match these filters.
                </p>
                <p className="mt-2 text-sm text-brand-ink/60">
                  Try clearing a chip or widening your search.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters(initialFilters)}
                  className="mt-4 rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filtered.map((r) => (
                <ResourceCard
                  key={r.slug}
                  resource={r}
                  hovered={hovered === r.slug}
                  onHover={setHovered}
                  distanceMi={userLocation ? distanceMi(userLocation, r) : undefined}
                />
              ))
            )}
          </div>
        </section>
        <aside className="relative hidden min-h-0 lg:block">
          <div className="absolute inset-0">
            <ResourceMap
              resources={filtered}
              hovered={hovered}
              onHover={setHovered}
              userLocation={userLocation}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
