"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import type { Category } from "@/lib/types";

export type PickerItem = {
  id: string;
  name: string;
  city: string | null;
  category: Category;
  status: string;
};

export default function ListingPicker({ items }: { items: PickerItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(needle) ||
        (i.city ?? "").toLowerCase().includes(needle),
    );
  }, [q, items]);

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search listings by name or town…"
        className="w-full rounded-full border border-brand-rule bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-navy"
      />
      <p className="text-xs text-brand-ink/55">
        {filtered.length} of {items.length} listings
      </p>
      <ul className="divide-y divide-brand-rule overflow-hidden rounded-2xl border border-brand-rule bg-white">
        {filtered.slice(0, 100).map((i) => (
          <li key={i.id}>
            <Link
              href={`/account/listings/${i.id}/edit`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-cream/50"
            >
              <CategoryIcon category={i.category} size={36} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {i.name}
                </span>
                <span className="block truncate text-xs text-brand-ink/55">
                  {i.city ?? "Maine"}
                  {i.status !== "published" && ` · ${i.status}`}
                </span>
              </span>
              <span className="text-sm text-brand-ink/40">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length > 100 && (
        <p className="text-center text-xs text-brand-ink/55">
          Showing the first 100 — keep typing to narrow it down.
        </p>
      )}
    </div>
  );
}
