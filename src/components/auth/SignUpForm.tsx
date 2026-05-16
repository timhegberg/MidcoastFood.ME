"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpAction } from "@/lib/auth-actions";

const INPUT =
  "w-full rounded-xl border border-brand-rule bg-white px-4 py-2.5 text-sm outline-none placeholder:text-brand-ink/40 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15";

export default function SignUpForm({
  defaultRole = "volunteer",
}: {
  defaultRole?: "volunteer" | "business";
}) {
  const router = useRouter();
  const [role, setRole] = useState<"volunteer" | "business">(defaultRole);
  const [state, setState] = useState<"form" | "submitting" | "codes">("form");
  const [error, setError] = useState<string | null>(null);
  const [codes, setCodes] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("role", role);
    const res = await signUpAction(fd);
    if (res.ok) {
      setCodes(res.recoveryCodes);
      setState("codes");
    } else {
      setError(res.error);
      setState("form");
    }
  }

  if (state === "codes") {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/5 p-5">
          <h2 className="font-display text-lg font-semibold">
            Save your recovery codes
          </h2>
          <p className="mt-1 text-sm text-brand-ink/70">
            These are the only way to reset your password yourself — we don't
            use email. Store them somewhere safe. Each works once. You won't see
            them again.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2">
          {codes.map((c) => (
            <li
              key={c}
              className="rounded-lg border border-brand-rule bg-brand-cream/50 px-3 py-2 text-center font-mono text-sm tracking-wide"
            >
              {c}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(codes.join("\n"))}
          className="text-sm text-brand-navy underline"
        >
          Copy all codes
        </button>
        <button
          type="button"
          onClick={() => router.push("/account")}
          className="w-full rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white"
        >
          I've saved them — continue
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <span className="block text-sm font-medium text-brand-ink/85">
          I'm signing up as a…
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <RoleButton
            active={role === "volunteer"}
            onClick={() => setRole("volunteer")}
            title="Volunteer"
            body="Help keep listings accurate — add and edit food resources."
          />
          <RoleButton
            active={role === "business"}
            onClick={() => setRole("business")}
            title="Business"
            body="List your own food program for the verification queue."
          />
        </div>
      </div>

      <Field label="Username" hint="Pick a pseudonym — no real name needed.">
        <input name="username" required autoComplete="username" className={INPUT} />
      </Field>

      {role === "business" && (
        <Field
          label="Business / program name"
          hint="Shown on your listing once approved."
        >
          <input name="displayName" className={INPUT} />
        </Field>
      )}

      <Field label="Password" hint="At least 8 characters.">
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          className={INPUT}
        />
      </Field>
      <Field label="Confirm password">
        <input
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          className={INPUT}
        />
      </Field>

      {error && (
        <p className="rounded-lg border border-brand-accent/30 bg-brand-accent/5 px-4 py-3 text-sm text-brand-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
      >
        {state === "submitting" ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-brand-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-navy underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

function RoleButton({
  active,
  onClick,
  title,
  body,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border p-3 text-left transition ${
        active
          ? "border-brand-navy bg-brand-navy/5"
          : "border-brand-rule bg-white hover:border-brand-ink/30"
      }`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className="mt-0.5 block text-xs text-brand-ink/60">{body}</span>
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-brand-ink/85">
        {label}
      </span>
      {hint && <span className="block text-xs text-brand-ink/55">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
