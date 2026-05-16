import { requireRole } from "@/lib/session";
import { getPendingResetRequests } from "@/lib/db-account";
import ResetRequestCard from "@/components/account/ResetRequestCard";

export const dynamic = "force-dynamic";

export default async function ResetsPage() {
  await requireRole("approver");
  const requests = await getPendingResetRequests();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">
          Community Password Resets
        </h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          People who lost their recovery codes. Verify their identity through
          the community, then issue a temporary password to share with them
          directly — we never send it by email.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-rule bg-white p-10 text-center">
          <p className="text-sm text-brand-ink/65">
            No password reset requests right now.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => (
            <ResetRequestCard
              key={r.request.id}
              id={r.request.id}
              username={r.displayName || r.username}
              role={r.role}
              note={r.request.note}
              createdAt={r.request.createdAt.toISOString()}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
