import { requireRole } from "@/lib/session";
import { getPendingSubmissions } from "@/lib/db-account";
import ReviewCard from "@/components/account/ReviewCard";

export const dynamic = "force-dynamic";

export default async function ReviewQueuePage() {
  await requireRole("approver");
  const pending = await getPendingSubmissions();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Review queue</h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          Volunteer edits and business profiles waiting for approval. Approving
          publishes the change to the live map.
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-rule bg-white p-10 text-center">
          <p className="text-sm text-brand-ink/65">
            The queue is empty — nothing to review right now.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {pending.map((row) => (
            <ReviewCard
              key={row.submission.id}
              id={row.submission.id}
              kind={row.submission.kind}
              payload={row.submission.payload}
              submitter={row.submitterDisplayName || row.submitterUsername}
              submitterRole={row.submission.submitterRole}
              submitterContact={row.submission.submitterContact}
              createdAt={row.submission.createdAt.toISOString()}
              resourceSlug={row.resourceSlug}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
