"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { submitListingAction } from "@/lib/listing-actions";
import { counties, languages } from "@/lib/resources";
import { CATEGORIES, CATEGORY_LABEL, AMENITY_LABEL } from "@/lib/types";
import type { ResourcePayload } from "@/db/schema";
import LocationPicker from "@/components/account/LocationPicker";

const INPUT =
  "w-full rounded-xl border border-brand-rule bg-white px-3.5 py-2 text-sm outline-none placeholder:text-brand-ink/40 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/15";

type Props = {
  // Present when editing an existing listing.
  resourceId?: string;
  initial?: Partial<ResourcePayload>;
  // Copy varies between volunteer "add a listing" and business "your profile".
  submitLabel?: string;
  successTitle?: string;
};

const ELIGIBILITY_OPTS: { value: string; label: string }[] = [
  { value: "openAccess", label: "Open access — no requirements to receive food" },
  { value: "income", label: "Income verification required" },
  { value: "residency", label: "Residency requirement" },
  { value: "documentation", label: "Documentation required" },
];

export default function ListingForm({
  resourceId,
  initial,
  submitLabel = "Submit for review",
  successTitle = "Submitted for review",
}: Props) {
  const [state, setState] = useState<"form" | "submitting" | "done">("form");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await submitListingAction(fd);
    if (res.ok) {
      setState("done");
    } else {
      setError(res.error);
      setState("form");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-6 text-center">
        <h2 className="font-display text-xl font-semibold text-brand-green">
          {successTitle}
        </h2>
        <p className="mt-2 text-sm text-brand-ink/75">
          A community approver will review this before it goes live. You can
          track its status under My submissions.
        </p>
        <Link
          href="/account/submissions"
          className="mt-5 inline-flex rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
        >
          View my submissions
        </Link>
      </div>
    );
  }

  const a = initial?.amenities;
  const e = initial?.eligibility;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-7">
      {resourceId && <input type="hidden" name="resourceId" value={resourceId} />}

      <Section title="Basics">
        <Field label="Name" required>
          <input
            name="name"
            required
            defaultValue={initial?.name ?? ""}
            className={INPUT}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Category" required>
            <select
              name="category"
              required
              defaultValue={initial?.category ?? ""}
              className={INPUT}
            >
              <option value="" disabled>
                Select…
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Type" hint="e.g. Community/Non-profit, Religious Food Pantry">
            <input
              name="type"
              defaultValue={initial?.type ?? ""}
              className={INPUT}
            />
          </Field>
        </div>
        <Field label="Description" hint="What it offers, who runs it, anything helpful.">
          <textarea
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
            className={INPUT}
          />
        </Field>
      </Section>

      <Section title="Location">
        <Field label="Street address">
          <input
            name="address"
            defaultValue={initial?.address ?? ""}
            className={INPUT}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Town / city">
            <input
              name="city"
              defaultValue={initial?.city ?? ""}
              className={INPUT}
            />
          </Field>
          <Field label="ZIP">
            <input
              name="zip"
              defaultValue={initial?.zip ?? ""}
              className={INPUT}
            />
          </Field>
          <Field label="County">
            <select
              name="county"
              defaultValue={initial?.county ?? ""}
              className={INPUT}
            >
              <option value="">—</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div>
          <span className="text-sm font-medium text-brand-ink/85">
            Map location
          </span>
          <div className="mt-1">
            <LocationPicker
              initialLat={initial?.lat}
              initialLng={initial?.lng}
              formRef={formRef}
            />
          </div>
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Phone">
            <input
              name="phone"
              defaultValue={initial?.phone ?? ""}
              className={INPUT}
            />
          </Field>
          <Field label="Email">
            <input
              name="email"
              type="email"
              defaultValue={initial?.email ?? ""}
              className={INPUT}
            />
          </Field>
        </div>
        <Field label="Website">
          <input
            name="website"
            defaultValue={initial?.website ?? ""}
            className={INPUT}
          />
        </Field>
        <Field label="Hours" hint="When can people get food here?">
          <textarea
            name="hours"
            rows={2}
            defaultValue={initial?.hours ?? ""}
            className={INPUT}
          />
        </Field>
      </Section>

      <Section title="Access & amenities">
        <CheckGroup
          name="amenity"
          options={(
            Object.keys(AMENITY_LABEL) as (keyof typeof AMENITY_LABEL)[]
          ).map((k) => ({
            value: k,
            label: AMENITY_LABEL[k],
            checked: !!a?.[k],
          }))}
        />
        <Field label="How is food distributed?">
          <select
            name="distribution"
            defaultValue={initial?.distribution ?? ""}
            className={INPUT}
          >
            <option value="">—</option>
            <option value="Client Choice">Client Choice — pick your own</option>
            <option value="Pre-Packed">Pre-Packed — bag or box</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </Field>
        {languages.length > 0 && (
          <Field label="Languages served">
            <CheckGroup
              name="language"
              options={languages.map((l) => ({
                value: l,
                label: l,
                checked: !!initial?.languages?.includes(l),
              }))}
            />
          </Field>
        )}
      </Section>

      <Section title="Eligibility">
        <CheckGroup
          name="eligibility"
          options={ELIGIBILITY_OPTS.map((o) => ({
            value: o.value,
            label: o.label,
            checked: !!e?.[o.value as keyof typeof e],
          }))}
        />
        <Field label="Eligibility notes" hint="Anything else people should know before visiting.">
          <input
            name="eligibilityNotes"
            defaultValue={e?.notes ?? ""}
            className={INPUT}
          />
        </Field>
      </Section>

      {error && (
        <p className="rounded-lg border border-brand-accent/30 bg-brand-accent/5 px-4 py-3 text-sm text-brand-accent">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {state === "submitting" ? "Submitting…" : submitLabel}
        </button>
        <Link
          href="/account"
          className="text-sm text-brand-ink/60 hover:text-brand-ink"
        >
          Cancel
        </Link>
      </div>
    </form>
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
    <section className="space-y-3">
      <h3 className="font-display text-base font-semibold text-brand-ink">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-brand-ink/85">
        {label}
        {required && <span className="ml-0.5 text-brand-accent">*</span>}
      </span>
      {hint && <span className="block text-xs text-brand-ink/55">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function CheckGroup({
  name,
  options,
}: {
  name: string;
  options: { value: string; label: string; checked: boolean }[];
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => (
        <label
          key={o.value}
          className="flex items-center gap-2 rounded-lg border border-brand-rule bg-white px-3 py-2 text-sm"
        >
          <input
            type="checkbox"
            name={name}
            value={o.value}
            defaultChecked={o.checked}
            className="h-4 w-4 accent-brand-navy"
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
