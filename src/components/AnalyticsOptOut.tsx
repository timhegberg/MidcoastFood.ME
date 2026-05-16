"use client";

import { useEffect, useState } from "react";
import { GA_OPTOUT_KEY, GA_DISABLE_FLAG } from "@/lib/analytics";

// Opt-out toggle for the privacy policy page. The preference is stored in
// localStorage (per-browser); the page reloads so Google Analytics loads or
// unloads cleanly.
export default function AnalyticsOptOut() {
  const [optedOut, setOptedOut] = useState<boolean | null>(null);

  useEffect(() => {
    setOptedOut(localStorage.getItem(GA_OPTOUT_KEY) === "true");
  }, []);

  function toggle() {
    const next = !optedOut;
    const win = window as unknown as Record<string, boolean>;
    if (next) {
      localStorage.setItem(GA_OPTOUT_KEY, "true");
      win[GA_DISABLE_FLAG] = true;
    } else {
      localStorage.removeItem(GA_OPTOUT_KEY);
      win[GA_DISABLE_FLAG] = false;
    }
    // Reload so the analytics tag is fully loaded or removed.
    window.location.reload();
  }

  // Avoid a hydration mismatch — render only once the preference is known.
  if (optedOut === null) return null;

  return (
    <div className="not-prose mt-3 rounded-xl border border-brand-rule bg-brand-cream/40 p-4">
      <p className="text-sm text-brand-ink/80">
        Analytics are currently{" "}
        <strong>{optedOut ? "off" : "on"}</strong> for this browser.
      </p>
      <button
        type="button"
        onClick={toggle}
        className={`mt-3 rounded-full px-4 py-2 text-sm font-medium ${
          optedOut
            ? "bg-brand-navy text-white hover:bg-brand-navy/90"
            : "border border-brand-rule bg-white hover:bg-brand-cream"
        }`}
      >
        {optedOut ? "Turn analytics back on" : "Turn analytics off"}
      </button>
    </div>
  );
}
