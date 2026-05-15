// Shared eyebrow/title/body header used at the top of marketing pages.

export default function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-20">
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-cream px-3 py-1 text-xs font-semibold tracking-wider text-brand-navy">
          {eyebrow}
        </span>
      )}
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      {body && (
        <p className="mt-5 text-lg text-brand-ink/75">{body}</p>
      )}
    </section>
  );
}
