import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Events — Midcoast Food",
  description:
    "Community food events, pop-ups, food drives, and volunteer days across Maine.",
};

export default function EventsPage() {
  // Events collection is currently empty — render a friendly placeholder.
  // When CMS items are populated, replace this with the items list.
  return (
    <>
      <PageHero
        eyebrow="EVENTS"
        title="Community events"
        body="Pop-ups, food drives, volunteer days, and gatherings across Maine."
      />
      <section className="mx-auto max-w-2xl px-4 pb-24 text-center sm:px-6">
        <div className="rounded-2xl border border-dashed border-brand-rule bg-white p-10">
          <p className="font-display text-lg font-semibold">
            No events on the calendar yet.
          </p>
          <p className="mt-2 text-sm text-brand-ink/65">
            Hosting one? We'd love to feature it.
          </p>
          <Link
            href="/get-involved"
            className="mt-5 inline-flex rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
          >
            Tell us about it
          </Link>
        </div>
      </section>
    </>
  );
}
