import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Share your resources — Midcoast Food",
  description:
    "Pick the category that matches you and we'll point you to the right intake form. Once submitted, a volunteer verifies your info before publishing.",
};

const ROUTES = [
  {
    title: "Food Pantries & Non-Profits",
    body: "A clear process to get your pantry, soup kitchen, or non-profit program listed and visible to neighbors who need it.",
    actions: [
      { href: "/forms/submit-a-location", label: "Add a food pantry", primary: true },
      { href: "/forms/submit-a-correction", label: "Update a listing" },
    ],
  },
  {
    title: "Sharing Tables & Free Little Food Pantries",
    body: "Got a take-what-you-need cabinet, sharing table, or community fridge? Add it here so neighbors can find you on the map.",
    actions: [
      { href: "/forms/list-your-resource", label: "List your resource", primary: true },
    ],
  },
  {
    title: "Local Businesses",
    body: "Restaurants, farms, co-ops, and businesses with ongoing food programs — get on the map and let your community know you're there.",
    actions: [
      { href: "/forms/list-your-business", label: "List your business", primary: true },
    ],
  },
];

export default function SharePage() {
  return (
    <>
      <PageHero
        eyebrow="SHARE YOUR RESOURCES"
        title="Share your food."
        body="Help your community by registering your business, pantry, or program as a free food resource for those facing hunger and economic hardship."
      />

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          List your food resource
        </h2>
        <p className="mt-3 max-w-2xl text-base text-brand-ink/75">
          Pick the category that fits best and we'll point you to the right
          intake form. A volunteer will reach out to verify your info before
          your listing goes live.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {ROUTES.map((r) => (
            <div
              key={r.title}
              className="flex flex-col rounded-2xl border border-brand-rule bg-white p-6 shadow-card"
            >
              <h3 className="font-display text-xl font-semibold">{r.title}</h3>
              <p className="mt-2 flex-1 text-sm text-brand-ink/70">{r.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {r.actions.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className={
                      a.primary
                        ? "rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
                        : "rounded-full border border-brand-rule px-4 py-2 text-sm font-medium hover:bg-brand-cream"
                    }
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl border border-brand-rule bg-brand-cream/40 p-8 sm:p-12">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Help us verify locations
          </h2>
          <p className="mt-3 max-w-2xl text-base text-brand-ink/75">
            We need volunteers to find, verify, and update listings across Maine.
            If you can help, send us a note.
          </p>
          <a
            href="mailto:info@sunshinehouse.xyz?subject=I%20want%20to%20help%20verify%20listings"
            className="mt-5 inline-flex rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
          >
            Email the team
          </a>
        </div>
      </section>
    </>
  );
}
