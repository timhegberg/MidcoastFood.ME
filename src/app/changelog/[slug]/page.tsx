import Link from "next/link";
import { notFound } from "next/navigation";
import changelogs from "@/data/changelogs.json";

type Entry = {
  name: string;
  slug: string;
  publishedOn: string;
  changesHtml: string;
};

const entries = changelogs as Entry[];

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = entries.find((x) => x.slug === slug);
  if (!e) return {};
  return {
    title: `${e.name} — Changelog — Midcoast Food`,
  };
}

export default async function ChangelogEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href="/changelog"
        className="text-sm text-brand-ink/60 hover:text-brand-ink"
      >
        ← Back to changelog
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {entry.name}
      </h1>
      <p className="mt-2 text-sm text-brand-ink/60">
        Published{" "}
        <time dateTime={entry.publishedOn}>
          {new Date(entry.publishedOn).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </p>
      <div
        className="prose prose-sm mt-8 max-w-none text-brand-ink/85"
        dangerouslySetInnerHTML={{ __html: entry.changesHtml }}
      />
    </article>
  );
}
