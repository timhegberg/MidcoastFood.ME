"use client";

import { useState } from "react";
import Link from "next/link";
import { logInAction } from "@/lib/auth-actions";

const INPUT =
  "w-full rounded-xl border border-brand-rule bg-white px-4 py-2.5 text-sm outline-none placeholder:text-brand-ink/40 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15";

export default function LoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    // On success the action redirects; on failure it returns an error.
    const res = await logInAction(fd);
    if (res && !res.ok) {
      setError(res.error);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="block text-sm font-medium text-brand-ink/85">
          Username
        </span>
        <input
          name="username"
          required
          autoComplete="username"
          className={`mt-1.5 ${INPUT}`}
        />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-brand-ink/85">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={`mt-1.5 ${INPUT}`}
        />
      </label>

      {error && (
        <p className="rounded-lg border border-brand-accent/30 bg-brand-accent/5 px-4 py-3 text-sm text-brand-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Logging in…" : "Log in"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-brand-navy underline">
          Forgot password?
        </Link>
        <Link href="/signup" className="text-brand-navy underline">
          Create an account
        </Link>
      </div>
    </form>
  );
}
