// Sends form-submission emails via Resend's HTTP API (no SDK required).
//
// Required env vars:
//   RESEND_API_KEY   — get one free at https://resend.com (no card needed)
//
// Optional env vars (with sensible defaults):
//   RESEND_FROM      — "From" address. Default: "Midcoast Food <onboarding@resend.dev>".
//                      Resend's onboarding sender only delivers to the email you
//                      registered the Resend account with. To send from a custom
//                      address (e.g. forms@midcoastfood.me) verify midcoastfood.me
//                      in Resend → DNS, then set RESEND_FROM accordingly.
//   RESEND_TO        — recipient. Default: ren@sunshinehouse.xyz (per project owner).

import { SITE } from "./site";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const FORM_TITLES: Record<string, string> = {
  "list-your-business": "List your business",
  "list-your-resource": "List your resource",
  "submit-a-location": "List a food pantry",
  "submit-a-correction": "Submit a correction",
};

type Payload = {
  formName: string;
  submittedAt: string;
  data: Record<string, string | string[]>;
};

export type EmailResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "network" | "rejected"; detail?: string };

export async function sendSubmissionEmail(payload: Payload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "not-configured" };

  const from =
    process.env.RESEND_FROM ?? "Midcoast Food <onboarding@resend.dev>";
  const to = process.env.RESEND_TO ?? SITE.submissionsEmail;
  const friendlyName = FORM_TITLES[payload.formName] ?? payload.formName;
  const subject = `[Midcoast Food] New "${friendlyName}" submission`;

  // Allow direct reply to the submitter when they've provided an email.
  const submitterEmail =
    typeof payload.data.email === "string" ? payload.data.email : undefined;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        reply_to: submitterEmail,
        html: renderHtml(friendlyName, payload),
        text: renderText(friendlyName, payload),
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, reason: "rejected", detail: detail.slice(0, 500) };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "network",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  );
}

function fmtValue(v: string | string[]): string {
  if (Array.isArray(v)) return v.join(", ") || "—";
  return v.trim() || "—";
}

function humanizeKey(k: string): string {
  // camelCase → Title Case With Spaces
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function renderHtml(title: string, payload: Payload): string {
  const rows = Object.entries(payload.data)
    .filter(([k]) => k !== "terms")
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:8px 12px;background:#FAF7F2;border-bottom:1px solid #E5DFD4;color:#555;width:35%;vertical-align:top;font-size:13px">${escapeHtml(humanizeKey(k))}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E5DFD4;font-size:14px">${escapeHtml(fmtValue(v))}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#F6F2EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A1A1A">
  <table cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E5DFD4;border-radius:16px;overflow:hidden">
    <tr><td style="padding:24px 24px 0 24px">
      <div style="font-size:11px;letter-spacing:1px;color:#0F2A4A;font-weight:600">MIDCOASTFOOD.ME — FORM SUBMISSION</div>
      <h1 style="margin:8px 0 0;font-size:22px;color:#1A1A1A">${escapeHtml(title)}</h1>
      <div style="margin-top:6px;font-size:12px;color:#777">Received ${escapeHtml(new Date(payload.submittedAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" }))}</div>
    </td></tr>
    <tr><td style="padding:20px 24px 24px">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E5DFD4;border-radius:10px;overflow:hidden">
        ${rows}
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function renderText(title: string, payload: Payload): string {
  const lines = [
    `Midcoast Food — new ${title} submission`,
    `Received ${new Date(payload.submittedAt).toISOString()}`,
    "",
  ];
  for (const [k, v] of Object.entries(payload.data)) {
    if (k === "terms") continue;
    lines.push(`${humanizeKey(k)}: ${fmtValue(v)}`);
  }
  return lines.join("\n");
}
