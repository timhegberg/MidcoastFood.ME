"use client";

import Link from "next/link";
import { useState } from "react";
import { submitForm } from "@/lib/submit-form";

export type FieldSpec =
  | {
      kind: "text" | "email" | "tel" | "url";
      name: string;
      label: string;
      required?: boolean;
      placeholder?: string;
      helpText?: string;
    }
  | {
      kind: "textarea";
      name: string;
      label: string;
      required?: boolean;
      placeholder?: string;
      helpText?: string;
      rows?: number;
    }
  | {
      kind: "select";
      name: string;
      label: string;
      required?: boolean;
      options: string[];
      helpText?: string;
    }
  | {
      kind: "checkboxes";
      name: string;
      label: string;
      options: string[];
      helpText?: string;
    };

type Props = {
  formName: string;
  fields: FieldSpec[];
  submitLabel?: string;
  successMessage?: string;
};

export default function IntakeForm({
  formName,
  fields,
  submitLabel = "Submit",
  successMessage = "Thank you! Your submission has been received.",
}: Props) {
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);
    const result = await submitForm(formName, fd);
    if (result.ok) {
      setState("ok");
    } else {
      setState("error");
      setErrorMsg(result.error);
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-brand-green">
          {successMessage}
        </p>
        <p className="mt-3 text-sm text-brand-ink/70">
          A volunteer will reach out to verify your info before publishing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((f) => (
        <Field key={f.name} field={f} />
      ))}

      <label className="flex items-start gap-3 rounded-xl border border-brand-rule bg-white p-4 text-sm">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-navy"
        />
        <span>
          I accept the{" "}
          <Link className="underline" href="/terms-of-service">
            Terms of Service
          </Link>{" "}
          and confirm this information is accurate to the best of my knowledge.
        </span>
      </label>

      {state === "error" && errorMsg && (
        <p className="rounded-lg border border-brand-accent/30 bg-brand-accent/5 px-4 py-3 text-sm text-brand-accent">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}

function Field({ field }: { field: FieldSpec }) {
  const id = `field-${field.name}`;
  const baseInput =
    "w-full rounded-xl border border-brand-rule bg-white px-4 py-2.5 text-sm outline-none placeholder:text-brand-ink/40 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-brand-ink/85"
      >
        {field.label}
        {"required" in field && field.required && (
          <span className="ml-1 text-brand-accent" aria-hidden>
            *
          </span>
        )}
      </label>
      {field.helpText && (
        <p className="mt-1 text-xs text-brand-ink/55">{field.helpText}</p>
      )}
      <div className="mt-1.5">
        {field.kind === "textarea" ? (
          <textarea
            id={id}
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows ?? 4}
            className={baseInput}
          />
        ) : field.kind === "select" ? (
          <select
            id={id}
            name={field.name}
            required={field.required}
            defaultValue=""
            className={baseInput}
          >
            <option value="" disabled>
              Select…
            </option>
            {field.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : field.kind === "checkboxes" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {field.options.map((o) => (
              <label
                key={o}
                className="flex items-center gap-2 rounded-lg border border-brand-rule bg-white px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  name={field.name}
                  value={o}
                  className="h-4 w-4 accent-brand-navy"
                />
                <span>{o}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            id={id}
            type={field.kind}
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            className={baseInput}
          />
        )}
      </div>
    </div>
  );
}
