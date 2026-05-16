"use client";

import { useEffect, useState } from "react";

// Footer link between the stable site and the beta site. Renders the
// "try the beta" variant by default (matches SSR); once mounted, if we're
// already on the beta host it flips to a "back to stable" link instead.
export default function BetaLink() {
  const [onBeta, setOnBeta] = useState(false);

  useEffect(() => {
    setOnBeta(window.location.hostname.startsWith("beta."));
  }, []);

  const href = onBeta
    ? "https://midcoastfood.me"
    : "https://beta.midcoastfood.me";
  const label = onBeta
    ? "← Back to the stable site"
    : "Try the beta site";

  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand-rule bg-white px-3.5 py-1.5 text-xs font-medium text-brand-ink/80 transition hover:border-brand-navy hover:text-brand-navy"
    >
      {!onBeta && (
        <span
          aria-hidden
          className="inline-block rounded-sm bg-brand-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
        >
          Beta
        </span>
      )}
      {label}
    </a>
  );
}
