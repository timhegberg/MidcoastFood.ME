import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="font-display text-6xl font-semibold text-brand-navy/30">
        404
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-base text-brand-ink/70">
        This page doesn't exist — or maybe it never did. Try the map instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/resources"
          className="rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white"
        >
          Open the map
        </Link>
        <Link
          href="/"
          className="rounded-full border border-brand-rule bg-white px-5 py-3 text-sm font-medium hover:bg-brand-cream"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
