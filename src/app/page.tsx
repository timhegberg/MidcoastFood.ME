import Link from "next/link";
import { resources } from "@/lib/resources";
import { CATEGORIES, CATEGORY_COLOR, CATEGORY_LABEL } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";

const towns = new Set(resources.map((r) => r.city).filter(Boolean));
const verifiedCount = resources.filter(
  (r) => r.verifiedStatus === "Verified",
).length;

const STEPS = [
  {
    n: "01",
    eyebrow: "Search",
    title: "Find resources near you",
    body:
      "Filter food pantries, fridges, and meal programs by category, county, accessibility, and open access. Our map updates in real time as you refine.",
    cta: { href: "/resources", label: "Open the map" },
  },
  {
    n: "02",
    eyebrow: "Connect",
    title: "Reach out directly",
    body:
      "Each listing includes phone, email, website, hours, and turn-by-turn directions in Google or Apple Maps. No login, no questions asked.",
    cta: { href: "/share-your-resources", label: "Share resources" },
  },
  {
    n: "03",
    eyebrow: "Contribute",
    title: "Help your community stay fed",
    body:
      "List a pantry, fix a typo, volunteer to verify a location, or partner with us. Every listing makes the next neighbor's search easier.",
    cta: { href: "/get-involved", label: "Get involved" },
  },
];

const PILLARS = [
  {
    title: "Find food resources",
    body: "Locate meals and pantries near you quickly and easily.",
    href: "/resources",
  },
  {
    title: "Share what you have",
    body: "Add a sharing table, free pantry, farm, or mutual-aid program.",
    href: "/share-your-resources",
  },
  {
    title: "List your business",
    body:
      "Restaurants and businesses with ongoing food programs — get on the map.",
    href: "/forms/list-your-business",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Beta banner */}
      <div className="border-b border-brand-rule bg-brand-cream/50">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs text-brand-ink/70 sm:px-6">
          We just launched. Bear with us while we work out the bugs 🐻
        </p>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold tracking-wider text-brand-navy">
              FREE FOOD, NEAR YOU
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Find food near you.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-brand-ink/75">
              Everyone deserves good food. We connect neighbors with free and
              local food resources across Maine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/resources"
                className="rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white shadow-card hover:shadow-cardHover"
              >
                Open the map
              </Link>
              <Link
                href="/share-your-resources"
                className="rounded-full border border-brand-rule bg-white px-5 py-3 text-sm font-medium hover:bg-brand-cream"
              >
                Share your resources
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 text-left">
              <div>
                <dt className="text-xs uppercase tracking-wider text-brand-ink/55">
                  Listings
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">
                  {resources.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-brand-ink/55">
                  Maine towns
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">
                  {towns.size}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-brand-ink/55">
                  Verified
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold">
                  {verifiedCount}
                </dd>
              </div>
            </dl>
          </div>

          {/* Category preview grid (animated-feeling without JS) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {CATEGORIES.map((c) => {
              const count = resources.filter((r) => r.category === c).length;
              return (
                <Link
                  key={c}
                  href={`/resources?category=${c}`}
                  className="rounded-2xl p-5 text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover"
                  style={{ background: CATEGORY_COLOR[c] }}
                >
                  <div className="flex items-start justify-between">
                    <div className="font-display text-3xl font-semibold">
                      {count}
                    </div>
                    <CategoryIcon
                      category={c}
                      size={36}
                      className="ring-2 ring-white/40"
                    />
                  </div>
                  <div className="mt-1 text-sm opacity-90">
                    {CATEGORY_LABEL[c]}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map section blurb */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border border-brand-rule bg-white p-8 shadow-card sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-ink/55">
                Community response to hunger
              </span>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Explore the Midcoast Food map
              </h2>
              <p className="mt-4 max-w-lg text-base text-brand-ink/75">
                Use our interactive map to find food pantries, community
                fridges, and meal programs near you. Filter by category, county,
                and accessibility to find what's in your community.
              </p>
              <Link
                href="/resources"
                className="mt-6 inline-flex rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white"
              >
                Explore the map →
              </Link>
            </div>
            <div className="grid gap-3">
              {PILLARS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-brand-rule p-5 transition hover:border-brand-navy hover:bg-brand-cream/40"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-brand-ink/65">{p.body}</p>
                  </div>
                  <span
                    className="mt-1 shrink-0 text-brand-ink/40 transition group-hover:translate-x-0.5 group-hover:text-brand-navy"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three steps */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Take action now
          </h2>
          <p className="mt-4 text-base text-brand-ink/75">
            Every contribution matters. Help us support communities facing food
            insecurity across Maine.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col rounded-2xl border border-brand-rule bg-white p-6 shadow-card"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-semibold text-brand-navy/30">
                  {s.n}
                </span>
                <span className="text-xs uppercase tracking-wider text-brand-ink/55">
                  {s.eyebrow}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-brand-ink/70">{s.body}</p>
              <Link
                href={s.cta.href}
                className="mt-5 inline-flex w-fit rounded-full border border-brand-rule px-4 py-2 text-sm font-medium hover:bg-brand-cream"
              >
                {s.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-24 max-w-7xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-brand-navy p-10 text-white sm:p-16">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Be the change your community needs.
          </h2>
          <p className="mt-4 max-w-xl text-base text-white/80">
            Join hundreds of pantries, businesses, and volunteers supporting
            families during economic challenges.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/forms/list-your-resource"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-brand-navy hover:bg-brand-cream"
            >
              List a resource
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
