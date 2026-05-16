"use client";

import { useState } from "react";
import Link from "next/link";
import {
  recoverWithCodeAction,
  requestCommunityResetAction,
} from "@/lib/auth-actions";

const INPUT =
  "w-full rounded-xl border border-brand-rule bg-white px-4 py-2.5 text-sm outline-none placeholder:text-brand-ink/40 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15";

type Mode = "code" | "community";

export default function ForgotPasswordForm() {
  const [mode, setMode] = useState<Mode>("code");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<null | "code" | "community">(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res =
      mode === "code"
        ? await recoverWithCodeAction(fd)
        : await requestCommunityResetAction(fd);
    setSubmitting(false);
    if (res.ok) setDone(mode);
    else setError(res.error);
  }

  if (done === "code") {
    return (
      <Done
        title="Password reset"
        body="Your password has been updated and you've been logged out everywhere. Log in with your new password."
        cta={{ href: "/login", label: "Go to login" }}
      />
    );
  }
  if (done === "community") {
    return (
      <Done
        title="Request filed"
        body="A community approver will help you reset your password. Reach out through your usual community contact so they can verify it's really you."
        cta={{ href: "/login", label: "Back to login" }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2">
        <ModeTab
          active={mode === "code"}
          onClick={() => {
            setMode("code");
            setError(null);
          }}
          label="I have a recovery code"
        />
        <ModeTab
          active={mode === "community"}
          onClick={() => {
            setMode("community");
            setError(null);
          }}
          label="Community Password Reset"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-brand-ink/85">
            Username
          </span>
          <input name="username" required className={`mt-1.5 ${INPUT}`} />
        </label>

        {mode === "code" ? (
          <>
            <label className="block">
              <span className="block text-sm font-medium text-brand-ink/85">
                Recovery code
              </span>
              <span className="block text-xs text-brand-ink/55">
                One of the codes you saved at signup.
              </span>
              <input
                name="code"
                required
                placeholder="ABCDE-FGHIJ"
                className={`mt-1.5 font-mono ${INPUT}`}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-brand-ink/85">
                New password
              </span>
              <input
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className={`mt-1.5 ${INPUT}`}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-brand-ink/85">
                Confirm new password
              </span>
              <input
                name="confirm"
                type="password"
                required
                autoComplete="new-password"
                className={`mt-1.5 ${INPUT}`}
              />
            </label>
          </>
        ) : (
          <>
            <p className="text-sm text-brand-ink/65">
              No recovery codes? File a reset request. A community approver will
              verify who you are and set you a temporary password — we never use
              email for this.
            </p>
            <label className="block">
              <span className="block text-sm font-medium text-brand-ink/85">
                Anything that helps us recognize you{" "}
                <span className="text-brand-ink/45">(optional)</span>
              </span>
              <textarea
                name="note"
                rows={3}
                className={`mt-1.5 ${INPUT}`}
                placeholder="e.g. which pantry you volunteer with, who can vouch for you"
              />
            </label>
          </>
        )}

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
          {submitting
            ? "Working…"
            : mode === "code"
              ? "Reset password"
              : "File reset request"}
        </button>
      </form>

      <p className="text-center text-sm text-brand-ink/60">
        Remembered it?{" "}
        <Link href="/login" className="text-brand-navy underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
        active
          ? "border-brand-navy bg-brand-navy/5 text-brand-ink"
          : "border-brand-rule bg-white text-brand-ink/65 hover:border-brand-ink/30"
      }`}
    >
      {label}
    </button>
  );
}

function Done({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-6 text-center">
      <h2 className="font-display text-xl font-semibold text-brand-green">
        {title}
      </h2>
      <p className="mt-2 text-sm text-brand-ink/75">{body}</p>
      <Link
        href={cta.href}
        className="mt-5 inline-flex rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
      >
        {cta.label}
      </Link>
    </div>
  );
}
