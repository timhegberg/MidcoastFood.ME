"use client";

import { useState } from "react";
import { completeResetAction, denyResetAction } from "@/lib/admin-actions";

type Props = {
  id: number;
  username: string;
  role: string;
  note: string | null;
  createdAt: string;
};

export default function ResetRequestCard({
  id,
  username,
  role,
  note,
  createdAt,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);

  async function issue() {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("requestId", String(id));
    const res = await completeResetAction(fd);
    setBusy(false);
    if (res.ok) setTempPassword(res.tempPassword);
    else setError(res.error);
  }

  async function deny() {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("requestId", String(id));
    const res = await denyResetAction(fd);
    setBusy(false);
    if (res.ok) setDenied(true);
    else setError(res.error);
  }

  if (denied) {
    return (
      <li className="rounded-2xl border border-brand-rule bg-brand-cream/40 p-4 text-sm text-brand-ink/60">
        Reset request from <span className="font-medium">{username}</span>{" "}
        denied.
      </li>
    );
  }

  if (tempPassword) {
    return (
      <li className="rounded-2xl border border-brand-green/30 bg-brand-green/5 p-5">
        <p className="text-sm font-medium text-brand-green">
          Temporary password issued for {username}
        </p>
        <p className="mt-2 rounded-lg border border-brand-rule bg-white px-4 py-3 text-center font-mono text-lg tracking-wider">
          {tempPassword}
        </p>
        <p className="mt-2 text-xs text-brand-ink/65">
          Give this to {username} directly — in person, by phone, however you
          verified them. It won't be shown again. They should log in and set a
          new password right away.
        </p>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-brand-rule bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display text-base font-semibold">{username}</p>
          <p className="text-xs text-brand-ink/55">
            <span className="capitalize">{role}</span> · requested{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
      {note && (
        <p className="mt-2 rounded-lg bg-brand-cream/50 px-3 py-2 text-sm text-brand-ink/75">
          &ldquo;{note}&rdquo;
        </p>
      )}
      <p className="mt-3 text-xs text-brand-ink/55">
        Verify this is really {username} through the community before issuing a
        password.
      </p>
      {error && (
        <p className="mt-3 rounded-lg border border-brand-accent/30 bg-brand-accent/5 px-3 py-2 text-sm text-brand-accent">
          {error}
        </p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={issue}
          disabled={busy}
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "Working…" : "Issue temporary password"}
        </button>
        <button
          type="button"
          onClick={deny}
          disabled={busy}
          className="rounded-full border border-brand-rule px-4 py-2 text-sm font-medium hover:bg-brand-cream disabled:opacity-60"
        >
          Deny
        </button>
      </div>
    </li>
  );
}
