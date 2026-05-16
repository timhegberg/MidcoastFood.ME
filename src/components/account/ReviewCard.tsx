"use client";

import { useState } from "react";
import Link from "next/link";
import {
  approveSubmissionAction,
  rejectSubmissionAction,
} from "@/lib/listing-actions";
import type {
  ResourcePayload,
  CorrectionPayload,
  SubmissionPayload,
} from "@/db/schema";

type Props = {
  id: number;
  kind: "new" | "edit" | "correction";
  payload: SubmissionPayload;
  submitter: string | null;
  submitterRole: string | null;
  submitterContact: string | null;
  createdAt: string;
  resourceSlug: string | null;
};

export default function ReviewCard({
  id,
  kind,
  payload,
  submitter,
  submitterRole,
  submitterContact,
  createdAt,
  resourceSlug,
}: Props) {
  const [outcome, setOutcome] = useState<"open" | "approved" | "rejected">(
    "open",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const isCorrection = kind === "correction";
  const title = isCorrection
    ? (payload as CorrectionPayload).resourceName
    : (payload as ResourcePayload).name;

  async function approve() {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("submissionId", String(id));
    const res = await approveSubmissionAction(fd);
    setBusy(false);
    if (res.ok) setOutcome("approved");
    else setError(res.error);
  }

  async function reject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("submissionId", String(id));
    const res = await rejectSubmissionAction(fd);
    setBusy(false);
    if (res.ok) setOutcome("rejected");
    else setError(res.error);
  }

  if (outcome !== "open") {
    const word =
      outcome === "rejected"
        ? isCorrection
          ? "dismissed."
          : "rejected."
        : isCorrection
          ? "marked resolved."
          : kind === "new"
            ? "approved and published."
            : "approved.";
    return (
      <li
        className={`rounded-2xl border p-4 text-sm ${
          outcome === "approved"
            ? "border-brand-green/30 bg-brand-green/5 text-brand-green"
            : "border-brand-accent/30 bg-brand-accent/5 text-brand-accent"
        }`}
      >
        <span className="font-medium">{title}</span> — {word}
      </li>
    );
  }

  const kindLabel = {
    new: "New listing",
    edit: "Edit",
    correction: "Correction",
  }[kind];

  return (
    <li className="rounded-2xl border border-brand-rule bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            isCorrection
              ? "bg-brand-accent/10 text-brand-accent"
              : "bg-brand-cream text-brand-navy"
          }`}
        >
          {kindLabel}
        </span>
        {submitterRole && (
          <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs font-medium capitalize text-brand-ink/70">
            {submitterRole}
          </span>
        )}
      </div>

      <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
      <p className="text-xs text-brand-ink/55">
        {submitter ? `by ${submitter}` : "public submission"} ·{" "}
        {new Date(createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
        {kind === "edit" && resourceSlug && (
          <>
            {" · "}
            <Link
              href={`/resources/${resourceSlug}`}
              target="_blank"
              className="text-brand-navy underline"
            >
              view current listing
            </Link>
          </>
        )}
      </p>
      {submitterContact && (
        <p className="mt-0.5 text-xs text-brand-ink/55">
          Contact: {submitterContact}
        </p>
      )}

      {isCorrection ? (
        <CorrectionBody payload={payload as CorrectionPayload} />
      ) : (
        <ResourceBody payload={payload as ResourcePayload} />
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-brand-accent/30 bg-brand-accent/5 px-3 py-2 text-sm text-brand-accent">
          {error}
        </p>
      )}

      {rejecting ? (
        <form onSubmit={reject} className="mt-4 space-y-2">
          <textarea
            name="reviewNote"
            rows={2}
            placeholder={
              isCorrection
                ? "Optional note about why this is being dismissed"
                : "Why is this being rejected? (shown to the submitter)"
            }
            className="w-full rounded-xl border border-brand-rule bg-white px-3 py-2 text-sm outline-none focus:border-brand-navy"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isCorrection ? "Confirm dismiss" : "Confirm reject"}
            </button>
            <button
              type="button"
              onClick={() => setRejecting(false)}
              className="rounded-full border border-brand-rule px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={approve}
            disabled={busy}
            className="rounded-full bg-brand-green px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {busy
              ? "Working…"
              : isCorrection
                ? "Mark resolved"
                : kind === "new"
                  ? "Approve & publish"
                  : "Approve changes"}
          </button>
          {isCorrection && resourceSlugFromPayload(payload) && (
            <Link
              href={resourceSlugFromPayload(payload)!}
              target="_blank"
              className="rounded-full border border-brand-rule px-4 py-2 text-sm font-medium hover:bg-brand-cream"
            >
              Open listing
            </Link>
          )}
          <button
            type="button"
            onClick={() => setRejecting(true)}
            disabled={busy}
            className="rounded-full border border-brand-rule px-4 py-2 text-sm font-medium hover:bg-brand-cream"
          >
            {isCorrection ? "Dismiss" : "Reject"}
          </button>
        </div>
      )}
    </li>
  );
}

// If the correction reporter pasted a listing URL, surface it as a link.
function resourceSlugFromPayload(p: SubmissionPayload): string | null {
  const url = (p as CorrectionPayload).resourceUrl;
  return url && url.trim() ? url.trim() : null;
}

function CorrectionBody({ payload }: { payload: CorrectionPayload }) {
  return (
    <div className="mt-3 space-y-2 text-sm">
      <p>
        <span className="text-brand-ink/55">What&apos;s wrong: </span>
        <span className="font-medium">{payload.correctionType}</span>
      </p>
      <p className="rounded-lg bg-brand-cream/50 px-3 py-2 text-brand-ink/80">
        {payload.details}
      </p>
    </div>
  );
}

function ResourceBody({ payload }: { payload: ResourcePayload }) {
  const amenities = Object.entries(payload.amenities)
    .filter(([, v]) => v)
    .map(([k]) => k);
  const eligibility = Object.entries(payload.eligibility)
    .filter(([k, v]) => k !== "notes" && v)
    .map(([k]) => k);

  return (
    <>
      <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <Row label="Category" value={payload.category} />
        <Row label="Type" value={payload.type} />
        <Row
          label="Address"
          value={[payload.address, payload.city, payload.zip]
            .filter(Boolean)
            .join(", ")}
        />
        <Row label="County" value={payload.county} />
        <Row label="Phone" value={payload.phone} />
        <Row label="Email" value={payload.email} />
        <Row label="Website" value={payload.website} />
        <Row label="Hours" value={payload.hours} />
        <Row label="Distribution" value={payload.distribution} />
        <Row
          label="Coordinates"
          value={`${payload.lat.toFixed(4)}, ${payload.lng.toFixed(4)}`}
        />
      </dl>
      {payload.description && (
        <p className="mt-2 text-sm text-brand-ink/75">{payload.description}</p>
      )}
      {(amenities.length > 0 || eligibility.length > 0) && (
        <p className="mt-2 text-xs text-brand-ink/55">
          {amenities.length > 0 && `Amenities: ${amenities.join(", ")}. `}
          {eligibility.length > 0 && `Eligibility: ${eligibility.join(", ")}.`}
        </p>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-brand-ink/55">{label}:</dt>
      <dd className="min-w-0 break-words">{value}</dd>
    </div>
  );
}
