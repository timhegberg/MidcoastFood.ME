"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import {
  users,
  sessions,
  recoveryCodes,
  passwordResetRequests,
} from "@/db/schema";
import {
  hashPassword,
  verifyPassword,
  generateRecoveryCodes,
  hashRecoveryCode,
} from "./password";
import { createSession, destroySession } from "./session";

const USERNAME_RE = /^[a-zA-Z0-9._-]{3,32}$/;

type ActionError = { ok: false; error: string };

function fail(error: string): ActionError {
  return { ok: false, error };
}

// ── Sign up ─────────────────────────────────────────────────────────────────
// Self-service signup for volunteers and businesses only. Approver is an
// elevated role that an existing approver must grant — never self-selected.

export async function signUpAction(
  formData: FormData,
): Promise<{ ok: true; recoveryCodes: string[] } | ActionError> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const role = String(formData.get("role") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim() || null;

  if (!USERNAME_RE.test(username)) {
    return fail(
      "Username must be 3–32 characters: letters, numbers, dots, dashes, underscores.",
    );
  }
  if (password.length < 8) {
    return fail("Password must be at least 8 characters.");
  }
  if (password !== confirm) {
    return fail("Passwords don't match.");
  }
  if (role !== "volunteer" && role !== "business") {
    return fail("Pick whether you're a volunteer or a business.");
  }

  const db = getDb();
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);
  if (existing.length > 0) {
    return fail("That username is taken — try another.");
  }

  const id = randomUUID();
  const passwordHash = await hashPassword(password);
  const { plain, hashes } = generateRecoveryCodes(8);

  try {
    await db.insert(users).values({
      id,
      username: username.toLowerCase(),
      passwordHash,
      role,
      displayName,
    });
  } catch {
    return fail("That username is taken — try another.");
  }
  await db
    .insert(recoveryCodes)
    .values(hashes.map((codeHash) => ({ userId: id, codeHash })));

  await createSession(id);
  return { ok: true, recoveryCodes: plain };
}

// ── Log in ──────────────────────────────────────────────────────────────────

export async function logInAction(
  formData: FormData,
): Promise<ActionError | never> {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) return fail("Enter your username and password.");

  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  const user = rows[0];

  // Same generic message whether the username or the password is wrong.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return fail("Incorrect username or password.");
  }
  if (user.status === "suspended") {
    return fail("This account is suspended. Contact an approver.");
  }

  await createSession(user.id);
  redirect("/account");
}

// ── Log out ─────────────────────────────────────────────────────────────────

export async function logOutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

// ── Recovery: one-time code ─────────────────────────────────────────────────

export async function recoverWithCodeAction(
  formData: FormData,
): Promise<{ ok: true } | ActionError> {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const code = String(formData.get("code") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!username || !code) return fail("Enter your username and a recovery code.");
  if (password.length < 8) return fail("New password must be at least 8 characters.");
  if (password !== confirm) return fail("Passwords don't match.");

  const db = getDb();
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  const user = rows[0];
  if (!user) return fail("No account matches that username and code.");

  const codeHash = hashRecoveryCode(code);
  const match = await db
    .select()
    .from(recoveryCodes)
    .where(
      and(
        eq(recoveryCodes.userId, user.id),
        eq(recoveryCodes.codeHash, codeHash),
        isNull(recoveryCodes.usedAt),
      ),
    )
    .limit(1);
  if (match.length === 0) {
    return fail("No account matches that username and code.");
  }

  const passwordHash = await hashPassword(password);
  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
  await db
    .update(recoveryCodes)
    .set({ usedAt: new Date() })
    .where(eq(recoveryCodes.id, match[0].id));
  // Force re-login everywhere after a password change.
  await db.delete(sessions).where(eq(sessions.userId, user.id));

  return { ok: true };
}

// ── Recovery: Community Password Reset request ──────────────────────────────
// Filed for an approver to handle out-of-band. Returns a generic success so
// the form never reveals whether a username exists.

export async function requestCommunityResetAction(
  formData: FormData,
): Promise<{ ok: true } | ActionError> {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase();
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!username) return fail("Enter your username.");

  const db = getDb();
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (rows[0]) {
    await db.insert(passwordResetRequests).values({ userId: rows[0].id, note });
  }
  return { ok: true };
}
