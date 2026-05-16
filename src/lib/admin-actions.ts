"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  users,
  sessions,
  passwordResetRequests,
  ROLES,
  USER_STATUSES,
  type Role,
  type UserStatus,
} from "@/db/schema";
import { requireRole } from "@/lib/session";
import { hashPassword, generateTempPassword } from "@/lib/password";

type Result = { ok: true } | { ok: false; error: string };

// ── Volunteer / approver management ─────────────────────────────────────────

export async function setUserRoleAction(fd: FormData): Promise<Result> {
  const approver = await requireRole("approver");
  const userId = String(fd.get("userId") ?? "");
  const role = String(fd.get("role") ?? "") as Role;

  if (!ROLES.includes(role)) return { ok: false, error: "Invalid role." };
  if (role === "business") {
    return { ok: false, error: "Business is a self-serve account type." };
  }
  if (userId === approver.id) {
    return { ok: false, error: "You can't change your own role." };
  }

  const db = getDb();
  const target = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!target[0]) return { ok: false, error: "User not found." };
  if (target[0].role === "business") {
    return { ok: false, error: "Business accounts can't be reassigned." };
  }

  await db.update(users).set({ role }).where(eq(users.id, userId));
  return { ok: true };
}

export async function setUserStatusAction(fd: FormData): Promise<Result> {
  const approver = await requireRole("approver");
  const userId = String(fd.get("userId") ?? "");
  const status = String(fd.get("status") ?? "") as UserStatus;

  if (!USER_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }
  if (userId === approver.id) {
    return { ok: false, error: "You can't suspend your own account." };
  }

  const db = getDb();
  const target = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!target[0]) return { ok: false, error: "User not found." };

  await db.update(users).set({ status }).where(eq(users.id, userId));
  // Suspending someone ends their active sessions immediately.
  if (status === "suspended") {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }
  return { ok: true };
}

// ── Community Password Reset handling ───────────────────────────────────────

export async function completeResetAction(
  fd: FormData,
): Promise<{ ok: true; tempPassword: string } | { ok: false; error: string }> {
  const approver = await requireRole("approver");
  const requestId = Number(fd.get("requestId"));
  if (!Number.isInteger(requestId)) {
    return { ok: false, error: "Invalid request." };
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(passwordResetRequests)
    .where(eq(passwordResetRequests.id, requestId))
    .limit(1);
  const req = rows[0];
  if (!req) return { ok: false, error: "Request not found." };
  if (req.status !== "pending") {
    return { ok: false, error: "This request was already handled." };
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, req.userId));
  // End the account's sessions so the temp password must be used.
  await db.delete(sessions).where(eq(sessions.userId, req.userId));
  await db
    .update(passwordResetRequests)
    .set({
      status: "completed",
      handledBy: approver.id,
      handledAt: new Date(),
    })
    .where(eq(passwordResetRequests.id, requestId));

  // Returned once for the approver to read out to the person directly.
  return { ok: true, tempPassword };
}

export async function denyResetAction(fd: FormData): Promise<Result> {
  const approver = await requireRole("approver");
  const requestId = Number(fd.get("requestId"));
  if (!Number.isInteger(requestId)) {
    return { ok: false, error: "Invalid request." };
  }

  const db = getDb();
  const rows = await db
    .select({ status: passwordResetRequests.status })
    .from(passwordResetRequests)
    .where(eq(passwordResetRequests.id, requestId))
    .limit(1);
  if (!rows[0]) return { ok: false, error: "Request not found." };
  if (rows[0].status !== "pending") {
    return { ok: false, error: "This request was already handled." };
  }

  await db
    .update(passwordResetRequests)
    .set({
      status: "denied",
      handledBy: approver.id,
      handledAt: new Date(),
    })
    .where(eq(passwordResetRequests.id, requestId));
  return { ok: true };
}
