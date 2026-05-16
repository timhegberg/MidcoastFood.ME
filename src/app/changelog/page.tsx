import Link from "next/link";
import PageHero from "@/components/PageHero";
import changelogs from "@/data/changelogs.json";

export const metadata = {
  title: "Changelog — Midcoast Food",
  description:
    "For maximum transparency, every change we make to the website is listed here.",
};

type Entry = {
  name: string;
  slug: string;
  publishedOn: string;
  changesHtml: string;
  beta?: boolean;
};

function BetaBadge() {
  return (
    <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
      In beta
    </span>
  );
}

export default function ChangelogPage() {
  const entries = (changelogs as Entry[]).sort((a, b) =>
    b.publishedOn.localeCompare(a.publishedOn),
  );

  return (
    <>
      <PageHero
        eyebrow="CHANGELOG"
        title="What we've changed"
        body="For maximum transparency, every change we make to the website is listed here."
      />

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <ol className="space-y-6">
          {entries.map((e) => (
            <li
              key={e.slug}
              className="rounded-2xl border border-brand-rule bg-white p-6 shadow-card"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Link
                    href={`/changelog/${e.slug}`}
                    className="font-display text-xl font-semibold hover:text-brand-navy"
                  >
                    {e.name}
                  </Link>
                  {e.beta && <BetaBadge />}
                </span>
                <time
                  dateTime={e.publishedOn}
                  className="text-xs text-brand-ink/55"
                >
                  {formatDate(e.publishedOn)}
                </time>
              </div>
              <div
                className="prose prose-sm mt-3 max-w-none text-brand-ink/80"
                dangerouslySetInnerHTML={{ __html: e.changesHtml }}
              />
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
