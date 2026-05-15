import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Privacy policy — Midcoast Food",
  description:
    "We value real privacy, so we put this here so you know exactly what you're getting into.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="LEGAL"
        title="Privacy policy"
        body="We value real privacy, so we put this here so you know exactly what you're getting into."
      />

      <article className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <p className="text-xs text-brand-ink/55">Last updated: October 29, 2025</p>

        <Section title="Who we are">
          <p>
            MidcoastFood.ME is operated by community volunteers from{" "}
            <a
              className="underline"
              href={SITE.founderUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Midcoast Solidarity
            </a>
            , a grassroots network supporting food security and mutual aid in
            Maine.
          </p>
          <p>
            Contact:{" "}
            <a className="underline" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>
          </p>
        </Section>

        <Section title="What we collect">
          <p>We keep data collection to the absolute minimum.</p>
          <h3>Automatically (anonymous)</h3>
          <ul>
            <li>Which pages are visited most often</li>
            <li>General location (city or region, not precise GPS)</li>
            <li>Device type and browser</li>
            <li>Approximate time spent on the site</li>
          </ul>
          <p>
            This data is anonymized and cannot identify you personally. We do
            not collect personal names, IP addresses, or any identifying
            metadata.
          </p>
          <h3>Voluntarily submitted</h3>
          <p>
            If you submit a new resource, correction, or feedback through a
            form, we collect only what you provide, for verification purposes.
            We do not sell, rent, or share this information with third parties.
          </p>
        </Section>

        <Section title="Cookies & analytics">
          <p>
            MidcoastFood.ME uses privacy-respecting analytics with IP
            anonymization enabled. Your IP address is shortened before being
            stored, and no personally identifying data is ever saved.
          </p>
        </Section>

        <Section title="Data storage">
          <p>
            The site is hosted on infrastructure that provides secure, encrypted
            (HTTPS) hosting. Anonymized request logs may be temporarily stored
            for performance and security purposes.
          </p>
        </Section>

        <Section title="Links to other sites">
          <p>
            Listings link to external websites operated by the resource owners.
            We are not responsible for the content or privacy practices of
            those sites.
          </p>
        </Section>

        <Section title="Children's privacy">
          <p>
            MidcoastFood.ME is an informational resource for all ages and does
            not knowingly collect personal information from children under 13.
          </p>
        </Section>

        <Section title="Your rights">
          <p>You can:</p>
          <ul>
            <li>Request a copy of any data you've submitted</li>
            <li>Request deletion of any data you've submitted</li>
            <li>Opt out of analytics tracking</li>
          </ul>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this privacy policy as the project evolves. Material
            changes will be reflected in the &ldquo;last updated&rdquo; date
            above.
          </p>
        </Section>

        <Section title="Our philosophy">
          <p>
            We believe privacy is part of food security. People should be able
            to find help without being tracked, profiled, or surveilled.
          </p>
        </Section>
      </article>
    </>
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
    <section className="prose prose-sm mt-8 max-w-none text-brand-ink/85 prose-headings:font-display prose-headings:text-brand-ink prose-h3:text-base">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
