"use client";

import { useState } from "react";
import { setUserRoleAction, setUserStatusAction } from "@/lib/admin-actions";
import type { Role, UserStatus } from "@/db/schema";

export type ManagedUser = {
  id: string;
  username: string;
  displayName: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
};

export default function VolunteerManager({
  users: initial,
  currentUserId,
}: {
  users: ManagedUser[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeRole(id: string, role: Role) {
    setBusyId(id);
    setError(null);
    const fd = new FormData();
    fd.set("userId", id);
    fd.set("role", role);
    const res = await setUserRoleAction(fd);
    setBusyId(null);
    if (res.ok) {
      setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
    } else {
      setError(res.error);
    }
  }

  async function changeStatus(id: string, status: UserStatus) {
    setBusyId(id);
    setError(null);
    const fd = new FormData();
    fd.set("userId", id);
    fd.set("status", status);
    const res = await setUserStatusAction(fd);
    setBusyId(null);
    if (res.ok) {
      setUsers((u) => u.map((x) => (x.id === id ? { ...x, status } : x)));
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg border border-brand-accent/30 bg-brand-accent/5 px-4 py-3 text-sm text-brand-accent">
          {error}
        </p>
      )}
      <ul className="divide-y divide-brand-rule overflow-hidden rounded-2xl border border-brand-rule bg-white">
        {users.map((u) => {
          const self = u.id === currentUserId;
          const busy = busyId === u.id;
          return (
            <li
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {u.displayName || u.username}
                  {self && (
                    <span className="ml-2 text-xs text-brand-ink/45">
                      (you)
                    </span>
                  )}
                </p>
                <p className="flex items-center gap-2 text-xs text-brand-ink/55">
                  <span className="rounded-full bg-brand-cream px-2 py-0.5 capitalize text-brand-navy">
                    {u.role}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 capitalize ${
                      u.status === "suspended"
                        ? "bg-brand-accent/10 text-brand-accent"
                        : "bg-brand-green/10 text-brand-green"
                    }`}
                  >
                    {u.status}
                  </span>
                </p>
              </div>
              {!self && (
                <div className="flex flex-wrap gap-2">
                  {u.role === "volunteer" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => changeRole(u.id, "approver")}
                      className="rounded-full border border-brand-rule px-3 py-1.5 text-xs font-medium hover:bg-brand-cream disabled:opacity-50"
                    >
                      Make approver
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => changeRole(u.id, "volunteer")}
                      className="rounded-full border border-brand-rule px-3 py-1.5 text-xs font-medium hover:bg-brand-cream disabled:opacity-50"
                    >
                      Make volunteer
                    </button>
                  )}
                  {u.status === "active" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => changeStatus(u.id, "suspended")}
                      className="rounded-full border border-brand-accent/40 px-3 py-1.5 text-xs font-medium text-brand-accent hover:bg-brand-accent/5 disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => changeStatus(u.id, "active")}
                      className="rounded-full border border-brand-green/40 px-3 py-1.5 text-xs font-medium text-brand-green hover:bg-brand-green/5 disabled:opacity-50"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
