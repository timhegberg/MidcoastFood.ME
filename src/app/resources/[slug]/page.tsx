import { notFound } from "next/navigation";
import Link from "next/link";
import DetailMap from "@/components/DetailMap";
import CategoryIcon from "@/components/CategoryIcon";
import { getResourceBySlug } from "@/lib/db-resources";
import {
  AMENITY_LABEL,
  CATEGORY_COLOR,
  CATEGORY_LABEL,
  type Amenities,
} from "@/lib/types";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const r = await getResourceBySlug(slug);
  if (!r) return {};
  return {
    title: `${r.name} — Midcoast Food`,
    description:
      r.description ??
      `${r.type ?? "Food resource"} in ${r.city ?? "Maine"}. ${r.address ?? ""}`,
  };
}

export default async function ResourceDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const r = await getResourceBySlug(slug);
  if (!r) notFound();

  const amenityRows = (Object.keys(r.amenities) as (keyof Amenities)[]).filter(
    (k) => r.amenities[k],
  );
  const restrictions: string[] = [];
  if (r.eligibility.income) restrictions.push("Income verification");
  if (r.eligibility.residency) restrictions.push("Residency requirement");
  if (r.eligibility.documentation) restrictions.push("Documentation required");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/resources"
        className="text-sm text-brand-ink/60 hover:text-brand-ink"
      >
        ← Back to all resources
      </Link>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          <CategoryIcon
            category={r.category}
            size={64}
            rounded="xl"
            className="hidden shrink-0 sm:block"
          />
          <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
              style={{ background: CATEGORY_COLOR[r.category] }}
            >
              {CATEGORY_LABEL[r.category]}
            </span>
            {r.verifiedStatus === "Verified" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 px-2.5 py-0.5 text-xs font-medium text-brand-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m23 12l-2.44-2.79l.34-3.69l-3.61-.82l-1.89-3.2L12 2.96L8.6 1.5L6.71 4.69L3.1 5.5l.34 3.7L1 12l2.44 2.79l-.34 3.7l3.61.82L8.6 22.5l3.4-1.47l3.4 1.46l1.89-3.19l3.61-.82l-.34-3.69zm-12.91 4.72l-3.8-3.81l1.48-1.48l2.32 2.33l5.85-5.87l1.48 1.48z" />
                </svg>
                Verified
              </span>
            )}
            {r.eligibility.openAccess && (
              <span className="rounded-full bg-brand-green/10 px-2.5 py-0.5 text-xs font-medium text-brand-green">
                Open access
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {r.name}
          </h1>
          {r.type && (
            <p className="mt-1 text-base text-brand-ink/70">{r.type}</p>
          )}
          <p className="mt-1 text-sm text-brand-ink/65">
            {[r.address, r.city, r.state, r.zip].filter(Boolean).join(", ")}
            {r.county && ` · ${r.county} County`}
          </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {r.phone && (
            <a
              href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}
              className="rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
            >
              Call {r.phone}
            </a>
          )}
          {r.website && (
            <a
              href={r.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-rule bg-white px-4 py-2 text-sm font-medium"
            >
              Visit website ↗
            </a>
          )}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <div className="space-y-8">
          {r.description && (
            <Section title="About">
              <div
                className="prose prose-sm max-w-none text-brand-ink/85"
                dangerouslySetInnerHTML={{ __html: r.descriptionHtml ?? "" }}
              />
            </Section>
          )}

          {r.hours && (
            <Section title="Hours & availability">
              <p className="whitespace-pre-line text-sm text-brand-ink/80">
                {r.hours}
              </p>
            </Section>
          )}

          <Section title="Who can use this resource">
            {r.eligibility.openAccess ? (
              <p className="text-sm text-brand-ink/80">
                <strong className="text-brand-green">Open to everyone</strong> — no income, residency, or documentation requirements.
              </p>
            ) : restrictions.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-brand-ink/80">
                {restrictions.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-brand-ink/60">
                Eligibility details not yet provided. Contact the resource directly.
              </p>
            )}
            {r.eligibility.notes && (
              <p className="mt-3 text-sm text-brand-ink/70">
                <span className="font-medium">Notes:</span> {r.eligibility.notes}
              </p>
            )}
            {r.distribution && (
              <p className="mt-3 text-sm text-brand-ink/80">
                <span className="font-medium">Distribution:</span> {r.distribution}
                {r.distribution === "Client Choice" &&
                  " — pick what you need from a stocked space."}
                {r.distribution === "Pre-Packed" &&
                  " — receive a pre-packed bag or box."}
              </p>
            )}
          </Section>

          <Section title="What this place offers">
            {amenityRows.length === 0 ? (
              <p className="text-sm text-brand-ink/60">
                Amenity details not yet provided.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {amenityRows.map((k) => (
                  <li
                    key={k}
                    className="flex items-center gap-2 rounded-lg border border-brand-rule bg-white px-3 py-2 text-sm"
                  >
                    <span className="text-brand-green" aria-hidden>
                      ✓
                    </span>
                    {AMENITY_LABEL[k]}
                  </li>
                ))}
              </ul>
            )}
            {r.languages.length > 0 && (
              <p className="mt-3 text-sm text-brand-ink/80">
                <span className="font-medium">Languages:</span>{" "}
                {r.languages.join(", ")}
              </p>
            )}
          </Section>

          <Section title="Contact">
            <ul className="space-y-2 text-sm">
              {r.phone && (
                <li>
                  <span className="font-medium">Phone:</span>{" "}
                  <a
                    className="text-brand-navy underline"
                    href={`tel:${r.phone.replace(/[^\d+]/g, "")}`}
                  >
                    {r.phone}
                  </a>
                </li>
              )}
              {r.email && (
                <li>
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    className="text-brand-navy underline"
                    href={`mailto:${r.email}`}
                  >
                    {r.email}
                  </a>
                </li>
              )}
              {r.website && (
                <li>
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    className="text-brand-navy underline"
                    href={r.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {r.website.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              )}
            </ul>
          </Section>
        </div>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-brand-rule">
            <div className="h-64 w-full">
              <DetailMap resource={r} />
            </div>
            <div className="space-y-2 border-t border-brand-rule bg-white p-4 text-sm">
              <p className="font-medium">Get directions</p>
              <div className="flex gap-2">
                <a
                  href={
                    r.googleMaps ??
                    `https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full border border-brand-rule px-3 py-1.5 text-center text-xs font-medium hover:bg-brand-cream"
                >
                  Google Maps
                </a>
                <a
                  href={
                    r.appleMaps ??
                    `http://maps.apple.com/?daddr=${r.lat},${r.lng}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full border border-brand-rule px-3 py-1.5 text-center text-xs font-medium hover:bg-brand-cream"
                >
                  Apple Maps
                </a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-brand-rule bg-brand-cream/40 p-4 text-xs text-brand-ink/65">
            Information out of date? Tell us — we re-verify resources continuously.
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-brand-rule pt-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
