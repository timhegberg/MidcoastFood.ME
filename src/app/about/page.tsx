import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "About — Midcoast Food",
  description:
    "MidcoastFood.ME was built by Midcoast Solidarity to help our community stay fed and connected as SNAP funding runs out and uncertainty grows.",
};

const FAQS = [
  {
    q: "What is MidcoastFood.ME?",
    a: "MidcoastFood.ME is a volunteer-built map that connects people in the Midcoast region of Maine with free and low-barrier food resources.",
  },
  {
    q: "Why was this site created?",
    a: "Federal budget gridlock in October 2025 put SNAP funding at risk for millions of Americans. Rather than wait for politicians to rediscover a sense of duty, this project connects local food pantries, farms, and mutual-aid networks so communities can take care of one another directly.",
  },
  {
    q: "Who can use it?",
    a: "Anyone looking for food resources in the Midcoast region can use the site. There are no income limits, eligibility screenings, or requirements.",
  },
  {
    q: "How can I add a resource?",
    a: "Food resource managers can submit information via our intake forms. We review every submission and verify the details before listing.",
  },
  {
    q: "Does it cost anything to be listed?",
    a: "No. MidcoastFood.ME is entirely free to use and maintained by volunteers.",
  },
  {
    q: "Is this a government program?",
    a: "No. MidcoastFood.ME is an independent, community-organized project.",
  },
  {
    q: "How can I help?",
    a: "Volunteer to verify listings, share the site with someone who needs it, or list a resource you run or know about.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT"
        title="About MidcoastFood.ME"
        body="Built by Midcoast Solidarity to help our community stay fed and connected as SNAP funding runs out and uncertainty grows."
      />

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="prose prose-sm max-w-none text-brand-ink/85">
          <p className="text-lg">
            About one in eight Mainers depend on SNAP benefits, and many
            households are at immediate risk of losing support. We map free
            pantries, fridges, farms, mutual-aid programs, and community meals
            so neighbors can find help fast — and so anyone with food to share
            can get on the map.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Stat number="12%" label="Of Maine's population receives SNAP benefits" />
          <Stat
            number="1 in 5"
            label="Maine children live in food-insecure households — one of the highest rates in New England."
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          How to share your food resources
        </h2>
        <p className="mt-3 text-base text-brand-ink/75">
          A clear process to connect with the neighbors who need help.
        </p>
        <ol className="mt-6 space-y-3">
          {["Register your resource", "We verify your information", "Your listing goes live"].map(
            (step, i) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-xl border border-brand-rule bg-white p-4"
              >
                <span className="font-display text-xl font-semibold text-brand-navy/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pt-0.5 text-sm">{step}</span>
              </li>
            ),
          )}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">FAQs</h2>
        <p className="mt-3 text-base text-brand-ink/75">
          Common questions about the project and how to use it.
        </p>
        <dl className="mt-6 divide-y divide-brand-rule rounded-2xl border border-brand-rule bg-white">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="p-5">
              <dt className="font-display text-base font-semibold">{q}</dt>
              <dd className="mt-2 text-sm text-brand-ink/75">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-brand-navy p-10 text-white">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Be the change your community needs.
          </h2>
          <p className="mt-3 text-white/80">
            Join hundreds of businesses and volunteers supporting families
            during economic challenges.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/forms/list-your-resource"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-navy"
            >
              List a resource
            </Link>
            <Link
              href="/get-involved"
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium"
            >
              Get involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-brand-rule bg-white p-6 text-center">
      <div className="font-display text-4xl font-semibold text-brand-navy">
        {number}
      </div>
      <div className="mt-2 text-sm text-brand-ink/70">{label}</div>
    </div>
  );
}
