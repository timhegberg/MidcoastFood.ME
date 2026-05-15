"use server";

// Server action invoked by every intake form. Builds a payload, sends an
// email via Resend, and returns a UI-friendly result.
//
// If RESEND_API_KEY isn't set the action logs the submission to the server
// console so the UX flow still works locally — the user still sees a success
// state. In production you must set RESEND_API_KEY (see src/lib/email.ts).

import { sendSubmissionEmail } from "./email";

type FieldValue = string | string[];

function parseFormData(fd: FormData): Record<string, FieldValue> {
  const out: Record<string, FieldValue> = {};
  for (const key of new Set(fd.keys())) {
    const values = fd.getAll(key).map((v) => (typeof v === "string" ? v : ""));
    out[key] = values.length === 1 ? values[0] : values;
  }
  return out;
}

export async function submitForm(
  formName: string,
  fd: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const data = parseFormData(fd);

  if (!data.terms) {
    return { ok: false, error: "Please accept the terms to submit." };
  }

  const payload = {
    formName,
    submittedAt: new Date().toISOString(),
    data,
  };

  const result = await sendSubmissionEmail(payload);

  if (result.ok) return { ok: true };

  if (result.reason === "not-configured") {
    // No API key set — log to console so devs can still test the flow
    // without configuring Resend. Treat as success for UX.
    // eslint-disable-next-line no-console
    console.log(
      "[form submission] RESEND_API_KEY not set — submission logged below:\n",
      JSON.stringify(payload, null, 2),
    );
    return { ok: true };
  }

  // Real failure (network or Resend rejection): surface a friendly error.
  // eslint-disable-next-line no-console
  console.error("[form submission] email failed", result);
  return {
    ok: false,
    error:
      result.reason === "network"
        ? "We couldn't reach our email service. Please try again in a moment."
        : "We received your submission but couldn't email the team. Please email us directly so it isn't lost.",
  };
}
