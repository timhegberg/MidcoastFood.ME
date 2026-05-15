"use client";

import Link from "next/link";
import type { Resource } from "@/lib/types";
import { CATEGORY_COLOR, CATEGORY_LABEL } from "@/lib/types";

type Props = {
  resource: Resource;
  distanceMi?: number;
  hovered?: boolean;
  onHover?: (slug: string | null) => void;
};

export default function ResourceCard({
  resource,
  distanceMi,
  hovered,
  onHover,
}: Props) {
  const r = resource;
  return (
    <Link
      href={`/resources/${r.slug}`}
      onMouseEnter={() => onHover?.(r.slug)}
      onMouseLeave={() => onHover?.(null)}
      className={`group block rounded-2xl border bg-white p-4 transition ${
        hovered
          ? "border-brand-navy shadow-cardHover"
          : "border-brand-rule shadow-card hover:shadow-cardHover"
      }`}
    >
      <div className="flex gap-4">
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white"
          style={{ background: CATEGORY_COLOR[r.category] }}
          aria-hidden
        >
          <span className="font-display text-xl font-semibold">
            {r.name[0]}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-display text-base font-semibold leading-tight">
              {r.name}
            </h3>
            <div className="flex shrink-0 items-center gap-1.5">
              {r.verifiedStatus === "Verified" && (
                <span
                  title="Verified by Midcoast Food"
                  aria-label="Verified"
                  className="text-brand-green"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m23 12l-2.44-2.79l.34-3.69l-3.61-.82l-1.89-3.2L12 2.96L8.6 1.5L6.71 4.69L3.1 5.5l.34 3.7L1 12l2.44 2.79l-.34 3.7l3.61.82L8.6 22.5l3.4-1.47l3.4 1.46l1.89-3.19l3.61-.82l-.34-3.69zm-12.91 4.72l-3.8-3.81l1.48-1.48l2.32 2.33l5.85-5.87l1.48 1.48z" />
                  </svg>
                </span>
              )}
              {distanceMi !== undefined && (
                <span className="text-xs text-brand-ink/60">
                  {distanceMi < 0.1 ? "<0.1" : distanceMi.toFixed(1)} mi
                </span>
              )}
            </div>
          </div>
          <p className="mt-0.5 truncate text-sm text-brand-ink/70">
            {r.type ?? CATEGORY_LABEL[r.category]}
          </p>
          <p className="mt-1 truncate text-sm text-brand-ink/60">
            {[r.address, r.city].filter(Boolean).join(" · ") || r.county}
          </p>
          {r.hours && (
            <p className="mt-1 line-clamp-1 text-xs text-brand-ink/55">
              {r.hours}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
              style={{ background: CATEGORY_COLOR[r.category] }}
            >
              {CATEGORY_LABEL[r.category]}
            </span>
            {r.eligibility.openAccess && (
              <span className="rounded-full bg-brand-green/10 px-2 py-0.5 text-[10px] font-medium text-brand-green">
                Open access
              </span>
            )}
            {r.amenities.wheelchairAccessible && (
              <span className="rounded-full bg-brand-cream px-2 py-0.5 text-[10px] font-medium text-brand-ink/70">
                ♿︎ Accessible
              </span>
            )}
            {r.distribution === "Client Choice" && (
              <span className="rounded-full bg-brand-cream px-2 py-0.5 text-[10px] font-medium text-brand-ink/70">
                Client choice
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
