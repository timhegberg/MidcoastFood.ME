"use client";

import { CATEGORIES, CATEGORY_LABEL } from "@/lib/types";
import type { Category } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";

export type Filters = {
  query: string;
  categories: Set<Category>;
  county: string | "all";
  openAccessOnly: boolean;
  verifiedOnly: boolean;
  wheelchairOnly: boolean;
  yearRoundOnly: boolean;
  sort: "nearest" | "name" | "verified";
  useLocation: boolean;
};

type Props = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  counts: Record<Category, number>;
  counties: string[];
  total: number;
  shown: number;
  geoState: "off" | "asking" | "on" | "denied";
};

export default function FilterBar({
  filters,
  setFilters,
  counts,
  counties,
  total,
  shown,
  geoState,
}: Props) {
  function toggleCategory(c: Category) {
    const next = new Set(filters.categories);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    setFilters({ ...filters, categories: next });
  }

  return (
    <div className="relative z-30 shrink-0 border-b border-brand-rule bg-brand-paper">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Row 1: search + sort */}
        <div className="flex flex-wrap items-center gap-2 py-3">
          <div className="relative min-w-0 flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21l-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder="Search pantries, towns, ZIP codes, services…"
              value={filters.query}
              onChange={(e) =>
                setFilters({ ...filters, query: e.target.value })
              }
              className="w-full rounded-full border border-brand-rule bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none placeholder:text-brand-ink/40 focus:border-brand-navy"
            />
          </div>
          <select
            value={filters.county}
            onChange={(e) =>
              setFilters({ ...filters, county: e.target.value as Filters["county"] })
            }
            className="rounded-full border border-brand-rule bg-white px-3 py-2 text-sm"
          >
            <option value="all">All counties</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters({
                ...filters,
                sort: e.target.value as Filters["sort"],
              })
            }
            className="rounded-full border border-brand-rule bg-white px-3 py-2 text-sm"
          >
            <option value="nearest" disabled={geoState !== "on"}>
              Nearest first {geoState !== "on" ? "(needs location)" : ""}
            </option>
            <option value="name">Name A–Z</option>
            <option value="verified">Verified first</option>
          </select>
          <button
            type="button"
            onClick={() =>
              setFilters({ ...filters, useLocation: !filters.useLocation })
            }
            className={`rounded-full border px-3 py-2 text-sm ${
              filters.useLocation
                ? "border-brand-navy bg-brand-navy text-white"
                : "border-brand-rule bg-white"
            }`}
          >
            {geoState === "asking"
              ? "Locating…"
              : geoState === "on" && filters.useLocation
                ? "Using my location"
                : geoState === "denied"
                  ? "Location denied"
                  : "Use my location"}
          </button>
        </div>

        {/* Row 2: category chips (horizontal scroll on mobile) */}
        <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => {
            const active = filters.categories.has(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                aria-pressed={active}
                className={`flex shrink-0 flex-col items-center gap-1.5 border-b-2 px-3 pb-2.5 pt-2 text-xs font-medium transition ${
                  active
                    ? "border-brand-ink text-brand-ink"
                    : "border-transparent text-brand-ink/60 hover:text-brand-ink"
                }`}
              >
                <CategoryIcon category={c} size={28} />
                <span className="whitespace-nowrap">
                  {CATEGORY_LABEL[c].replace(" / ", "/")}
                </span>
                <span
                  className={`text-[10px] ${active ? "text-brand-ink/70" : "text-brand-ink/40"}`}
                >
                  {counts[c] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Row 3: toggle pills + result count */}
        <div className="flex flex-wrap items-center gap-2 pb-3">
          <TogglePill
            active={filters.openAccessOnly}
            onClick={() =>
              setFilters({ ...filters, openAccessOnly: !filters.openAccessOnly })
            }
          >
            Open access only
          </TogglePill>
          <TogglePill
            active={filters.verifiedOnly}
            onClick={() =>
              setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })
            }
          >
            Verified
          </TogglePill>
          <TogglePill
            active={filters.wheelchairOnly}
            onClick={() =>
              setFilters({ ...filters, wheelchairOnly: !filters.wheelchairOnly })
            }
          >
            ♿︎ Wheelchair accessible
          </TogglePill>
          <TogglePill
            active={filters.yearRoundOnly}
            onClick={() =>
              setFilters({ ...filters, yearRoundOnly: !filters.yearRoundOnly })
            }
          >
            Year-round
          </TogglePill>
          <span className="ml-auto text-xs text-brand-ink/55">
            Showing <strong className="text-brand-ink/80">{shown}</strong> of {total}
          </span>
        </div>
      </div>
    </div>
  );
}

function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-brand-ink bg-brand-ink text-white"
          : "border-brand-rule bg-white text-brand-ink/75 hover:border-brand-ink/40"
      }`}
    >
      {children}
    </button>
  );
}
