import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, users, type Role, type UserRow } from "@/db/schema";
import { randomToken } from "./password";

const COOKIE = "mcf_session";
const SESSION_DAYS = 30;

export async function createSession(userId: string): Promise<void> {
  const db = getDb();
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.insert(sessions).values({ id: token, userId, expiresAt });

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await getDb().delete(sessions).where(eq(sessions.id, token));
    jar.delete(COOKIE);
  }
}

// Resolve the signed-in user for the current request. Cached so multiple
// callers in one render don't re-query. Returns null when signed out.
export const getCurrentUser = cache(async (): Promise<UserRow | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const db = getDb();
  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  const user = rows[0]?.user ?? null;
  if (!user || user.status === "suspended") return null;
  return user;
});

export async function requireUser(): Promise<UserRow> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Approvers implicitly satisfy any volunteer-level requirement.
export async function requireRole(...allowed: Role[]): Promise<UserRow> {
  const user = await requireUser();
  const ok =
    allowed.includes(user.role) ||
    (user.role === "approver" && allowed.includes("volunteer"));
  if (!ok) redirect("/account");
  return user;
}

export function isApprover(user: UserRow | null): boolean {
  return user?.role === "approver";
}

// Volunteers and approvers can both work the listing tools.
export function canEditListings(user: UserRow | null): boolean {
  return user?.role === "volunteer" || user?.role === "approver";
}
