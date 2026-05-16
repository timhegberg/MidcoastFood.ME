"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/db/schema";

type Item = { href: string; label: string };

// Navigation shown to each role. Approvers see everything volunteers see,
// plus the review/management tools.
const VOLUNTEER: Item[] = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/listings", label: "Browse listings" },
  { href: "/account/listings/new", label: "Add a listing" },
  { href: "/account/submissions", label: "My submissions" },
];

const BUSINESS: Item[] = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/profile", label: "My profile" },
  { href: "/account/submissions", label: "My submissions" },
];

const APPROVER_EXTRA: Item[] = [
  { href: "/account/queue", label: "Review queue" },
  { href: "/account/volunteers", label: "Volunteers" },
  { href: "/account/resets", label: "Password resets" },
];

export function navForRole(role: Role): Item[] {
  if (role === "business") return BUSINESS;
  if (role === "approver") return [...VOLUNTEER, ...APPROVER_EXTRA];
  return VOLUNTEER;
}

export default function AccountNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navForRole(role);

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const active =
          item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-brand-navy text-white"
                : "text-brand-ink/70 hover:bg-brand-cream"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
