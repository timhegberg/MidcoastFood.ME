import "server-only";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  submissions,
  users,
  resources,
  passwordResetRequests,
} from "@/db/schema";

// ── Submissions ─────────────────────────────────────────────────────────────

export async function getMySubmissions(userId: string) {
  return getDb()
    .select()
    .from(submissions)
    .where(eq(submissions.submittedBy, userId))
    .orderBy(desc(submissions.createdAt));
}

export async function getPendingSubmissions() {
  return getDb()
    .select({
      submission: submissions,
      submitterUsername: users.username,
      submitterDisplayName: users.displayName,
      resourceSlug: resources.slug,
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.submittedBy, users.id))
    .leftJoin(resources, eq(submissions.resourceId, resources.id))
    .where(eq(submissions.status, "pending"))
    .orderBy(desc(submissions.createdAt));
}

export async function getSubmissionById(id: number) {
  const rows = await getDb()
    .select({
      submission: submissions,
      submitterUsername: users.username,
      submitterDisplayName: users.displayName,
    })
    .from(submissions)
    .innerJoin(users, eq(submissions.submittedBy, users.id))
    .where(eq(submissions.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function countPendingSubmissions(): Promise<number> {
  const r = await getDb()
    .select({ n: sql<number>`count(*)::int` })
    .from(submissions)
    .where(eq(submissions.status, "pending"));
  return r[0]?.n ?? 0;
}

// ── Business profile ────────────────────────────────────────────────────────
// A business account owns at most one listing.

export async function getResourceOwnedBy(userId: string) {
  const rows = await getDb()
    .select()
    .from(resources)
    .where(eq(resources.ownerUserId, userId))
    .limit(1);
  return rows[0] ?? null;
}

// ── Volunteer / user management ─────────────────────────────────────────────

export async function listManageableUsers() {
  // Everyone except businesses — approvers manage volunteers and each other.
  return getDb()
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(ne(users.role, "business"))
    .orderBy(desc(users.createdAt));
}

export async function getUserById(id: string) {
  const rows = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

// ── Password reset requests ─────────────────────────────────────────────────

export async function getPendingResetRequests() {
  return getDb()
    .select({
      request: passwordResetRequests,
      username: users.username,
      displayName: users.displayName,
      role: users.role,
    })
    .from(passwordResetRequests)
    .innerJoin(users, eq(passwordResetRequests.userId, users.id))
    .where(eq(passwordResetRequests.status, "pending"))
    .orderBy(desc(passwordResetRequests.createdAt));
}

export async function countPendingResets(): Promise<number> {
  const r = await getDb()
    .select({ n: sql<number>`count(*)::int` })
    .from(passwordResetRequests)
    .where(eq(passwordResetRequests.status, "pending"));
  return r[0]?.n ?? 0;
}

export async function countMyPendingSubmissions(userId: string): Promise<number> {
  const r = await getDb()
    .select({ n: sql<number>`count(*)::int` })
    .from(submissions)
    .where(
      and(
        eq(submissions.submittedBy, userId),
        eq(submissions.status, "pending"),
      ),
    );
  return r[0]?.n ?? 0;
}
