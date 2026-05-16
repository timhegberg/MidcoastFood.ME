import Link from "next/link";
import Image from "next/image";
import { FOOTER_LINKS, NAV, SITE } from "@/lib/site";
import BetaLink from "@/components/BetaLink";

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-rule bg-brand-paper">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/logo.avif"
            alt="Midcoast Food"
            width={893}
            height={327}
            className="h-8 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm text-brand-ink/65">
            {SITE.mission}
          </p>
          <blockquote className="mt-5 border-l-2 border-brand-rule pl-4 text-sm italic text-brand-ink/70">
            &ldquo;{SITE.motto}&rdquo;
            <footer className="mt-1 text-xs not-italic text-brand-ink/55">
              — {SITE.mottoAuthor}
            </footer>
          </blockquote>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-ink/55">
            Explore
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-ink/80 hover:text-brand-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-ink/55">
            Legal & updates
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-ink/80 hover:text-brand-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="text-brand-ink/80 hover:text-brand-navy"
              >
                {SITE.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-rule">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-brand-ink/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-2">
            <a
              href={SITE.founderUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Midcoast Solidarity"
              className="shrink-0"
            >
              <Image
                src="/midcoast-solidarity.avif"
                alt="Midcoast Solidarity"
                width={600}
                height={600}
                className="h-7 w-7 rounded-full"
              />
            </a>
            <span>
              © {new Date().getFullYear()} Created with care by{" "}
              <a
                href={SITE.founderUrl}
                className="underline hover:text-brand-navy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Midcoast Solidarity
              </a>
              . Code modified from{" "}
              <a
                href={SITE.codeOriginUrl}
                className="underline hover:text-brand-navy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sunshinehouse.xyz
              </a>
              .
            </span>
          </p>
          <div className="flex items-center gap-3">
            <BetaLink />
            <p>
              {SITE.version} · {SITE.versionTag}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
