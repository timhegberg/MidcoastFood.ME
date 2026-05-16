import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getMySubmissions } from "@/lib/db-account";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-brand-cream text-brand-navy",
  approved: "bg-brand-green/10 text-brand-green",
  rejected: "bg-brand-accent/10 text-brand-accent",
};

export default async function MySubmissionsPage() {
  const user = await requireUser();
  const subs = await getMySubmissions(user.id);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">My submissions</h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          Everything you've submitted and where it stands in review.
        </p>
      </div>

      {subs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-rule bg-white p-10 text-center">
          <p className="text-sm text-brand-ink/65">
            You haven't submitted anything yet.
          </p>
          <Link
            href={user.role === "business" ? "/account/profile" : "/account/listings/new"}
            className="mt-4 inline-flex rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
          >
            {user.role === "business" ? "Set up my profile" : "Add a listing"}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {subs.map((s) => (
            <li
              key={s.id}
              className="rounded-2xl border border-brand-rule bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base font-semibold">
                    {s.payload.name || "Untitled listing"}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-ink/55">
                    {s.kind === "new" ? "New listing" : "Edit to a listing"} ·
                    submitted{" "}
                    {new Date(s.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    STATUS_STYLE[s.status] ?? "bg-brand-cream"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              {s.status === "rejected" && s.reviewNote && (
                <p className="mt-2 rounded-lg bg-brand-accent/5 px-3 py-2 text-xs text-brand-ink/75">
                  <span className="font-medium">Reviewer note:</span>{" "}
                  {s.reviewNote}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
