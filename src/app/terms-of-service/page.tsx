import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Terms of service — Midcoast Food",
  description:
    "Terms of service for MidcoastFood.ME, a community project helping people across Maine find food resources, community fridges, farms, and mutual-aid programs.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="LEGAL"
        title="Terms of service"
        body="A community project helping people across Maine find food resources, community fridges, farms, and mutual-aid programs."
      />

      <article className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <p className="text-xs text-brand-ink/55">Last updated: October 29, 2025</p>

        <Section title="Purpose of the site">
          <p>
            MidcoastFood.ME exists to help people find, share, and support food
            resources in Maine's Midcoast region. It operates as a community-built
            directory operated by volunteers — not a government or nonprofit
            entity. All content is provided for public good and informational
            purposes only.
          </p>
        </Section>

        <Section title="Acceptance of terms">
          <p>
            By accessing the website you agree to these Terms of Service and our
            Privacy Policy. We may update these terms occasionally to reflect
            new features or community feedback. Continued use indicates
            acceptance of any changes.
          </p>
        </Section>

        <Section title="Use of information">
          <h3>Permitted uses</h3>
          <ul>
            <li>Finding food resources or mutual-aid programs</li>
            <li>Sharing listings with others</li>
            <li>Submitting new or updated resource information</li>
          </ul>
          <h3>Prohibited uses</h3>
          <ul>
            <li>Using data for commercial resale or marketing</li>
            <li>Misrepresenting yourself as an official partner</li>
            <li>Scraping or republishing data without permission</li>
            <li>Posting false or harmful information</li>
          </ul>
        </Section>

        <Section title="Accuracy of listings">
          <p>
            We cannot guarantee that all information is up to date — details
            change frequently. Always contact organizations directly to confirm
            before visiting. Spot something wrong?{" "}
            <a className="underline" href="/forms/submit-a-correction">
              Send a correction
            </a>
            .
          </p>
        </Section>

        <Section title="User submissions">
          <p>
            By submitting a listing or correction, you confirm the information
            is accurate and grant MidcoastFood.ME permission to display, edit,
            and share your submission. You agree not to post content that is
            false, defamatory, discriminatory, or violates any law. All
            submissions undergo review before publishing.
          </p>
        </Section>

        <Section title="No warranty">
          <p>
            The site is provided &ldquo;as is&rdquo; and &ldquo;as
            available.&rdquo; We make no guarantees regarding availability,
            accuracy, or completeness, and disclaim liability for issues arising
            from reliance on information shown here.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            MidcoastFood.ME, its maintainers, contributors, or affiliated
            volunteers are not responsible for any losses or damages resulting
            from use of the site, including reliance on listings or errors. This
            project is meant to support, not replace, direct contact with food
            programs.
          </p>
        </Section>

        <Section title="Links to other sites">
          <p>
            External links are provided for convenience. We are not responsible
            for the content or privacy practices of external sites.
          </p>
        </Section>

        <Section title="Community guidelines">
          <p>
            Act respectfully toward others. Avoid discrimination or harassment.
            Support dignified food access. Violations may result in content
            removal or blocked access.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions? Email{" "}
            <a className="underline" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>{" "}
            or visit the <a className="underline" href="/about">About page</a>.
          </p>
        </Section>

        <Section title="Closing note">
          <p>
            These terms exist to protect trust and ensure the site remains a
            safe, accurate, and open resource for everyone.
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
