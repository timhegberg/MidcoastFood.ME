import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ResourceCard from "@/components/ResourceCard";
import { counties } from "@/lib/resources";
import { getPublishedResources } from "@/lib/db-resources";

export const dynamic = "force-dynamic";

// Slugify county names so /county/[slug] is canonical (e.g. "York" → "york").
function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const county = counties.find((c) => slugify(c) === slug);
  if (!county) return {};
  return {
    title: `${county} County food resources — Midcoast Food`,
    description: `Food pantries, fridges, and meal programs in ${county} County, Maine.`,
  };
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const county = counties.find((c) => slugify(c) === slug);
  if (!county) notFound();
  const all = await getPublishedResources();
  const matches = all
    .filter((r) => r.county === county)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <PageHero
        eyebrow={`${county.toUpperCase()} COUNTY`}
        title={`Food resources in ${county} County`}
        body={`${matches.length} pantries, fridges, and meal programs in ${county} County, Maine.`}
      />
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="mb-6 text-center">
          <Link
            href="/resources"
            className="rounded-full border border-brand-rule bg-white px-4 py-2 text-sm font-medium hover:bg-brand-cream"
          >
            ← All counties on the map
          </Link>
        </div>
        <div className="grid gap-3">
          {matches.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-brand-rule bg-white p-10 text-center text-sm text-brand-ink/60">
              No resources listed in {county} County yet.
            </p>
          ) : (
            matches.map((r) => <ResourceCard key={r.slug} resource={r} />)
          )}
        </div>
      </section>
    </>
  );
}
