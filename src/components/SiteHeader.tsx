"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV } from "@/lib/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-rule bg-brand-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" aria-label="Midcoast Food — home">
          <Image
            src="/logo.avif"
            alt="Midcoast Food"
            width={893}
            height={327}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            // Find food — prominent, underlined primary CTA.
            if (item.href === "/resources") {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mr-1 rounded-full bg-brand-navy px-5 py-2 text-[15px] font-semibold text-white underline decoration-2 underline-offset-4 hover:bg-brand-navy/90"
                >
                  {item.label}
                </Link>
              );
            }
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand-cream text-brand-ink"
                    : "text-brand-ink/75 hover:bg-brand-cream hover:text-brand-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full border border-brand-rule md:hidden"
        >
          <span aria-hidden className="block">
            <span className="block h-0.5 w-4 bg-brand-ink" />
            <span className="mt-1 block h-0.5 w-4 bg-brand-ink" />
            <span className="mt-1 block h-0.5 w-4 bg-brand-ink" />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-rule bg-brand-paper md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) =>
              item.href === "/resources" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-brand-navy px-3 py-2.5 text-[15px] font-semibold text-white underline decoration-2 underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-cream"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
