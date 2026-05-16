import Link from "next/link";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Get involved — Midcoast Food",
  description:
    "Volunteer to verify listings, host a food drive, or partner with us. Every action makes the next neighbor's search easier.",
};

type Cta = { href: string; label: string; primary?: boolean };
type Way = { title: string; body: string; ctas: Cta[] };

const WAYS: Way[] = [
  {
    title: "Volunteer",
    body:
      "Call pantries to verify hours, update addresses, transcribe info from physical bulletin boards. A few hours a week makes a huge difference.",
    ctas: [{ href: "/signup", label: "Create a Volunteer Account" }],
  },
  {
    title: "Host a food drive",
    body:
      "Mobilize your workplace, school, or congregation to collect non-perishables for a local pantry. We'll help you connect with one that needs your help.",
    ctas: [{ href: "/share-your-resources", label: "Find a pantry" }],
  },
  {
    title: "Partner with us",
    body:
      "Restaurants, farms, co-ops, and businesses with food to share — list your program and reach the community directly.",
    ctas: [
      {
        href: "/signup?role=business",
        label: "Create a Business Account",
        primary: true,
      },
      { href: "/forms/list-your-business", label: "List your business" },
    ],
  },
  {
    title: "Submit a correction",
    body:
      "See something out of date? Pantry hours wrong? An address that's moved? Tell us and we'll update it within a few days.",
    ctas: [{ href: "/forms/submit-a-correction", label: "Send a correction" }],
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="GET INVOLVED"
        title="Fight hunger together."
        body="When communities unite, no one goes hungry. Your action can transform lives and provide critical support during challenging times."
      />

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {WAYS.map((w) => (
            <div
              key={w.title}
              className="flex flex-col rounded-2xl border border-brand-rule bg-white p-6 shadow-card"
            >
              <h2 className="font-display text-xl font-semibold">{w.title}</h2>
              <p className="mt-2 flex-1 text-sm text-brand-ink/70">{w.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {w.ctas.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className={
                      c.primary
                        ? "inline-flex w-fit rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy/90"
                        : "inline-flex w-fit rounded-full border border-brand-rule px-4 py-2 text-sm font-medium hover:bg-brand-cream"
                    }
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="rounded-2xl border border-brand-rule bg-white p-8">
          <h2 className="font-display text-2xl font-semibold">Contact us</h2>
          <p className="mt-3 text-base text-brand-ink/75">
            Questions, ideas, or want to help? We read every message.
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-brand-ink/55">Email</dt>
              <dd>
                <a
                  className="text-brand-navy underline"
                  href={`mailto:${SITE.contactEmail}`}
                >
                  {SITE.contactEmail}
                </a>
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-brand-ink/55">Project</dt>
              <dd>
                <a
                  className="text-brand-navy underline"
                  href={SITE.founderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Midcoast Solidarity
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
