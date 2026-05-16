import { requireUser } from "@/lib/session";
import { logOutAction } from "@/lib/auth-actions";
import AccountNav from "@/components/account/AccountNav";
import type { Role } from "@/db/schema";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<Role, string> = {
  volunteer: "Volunteer",
  business: "Business",
  approver: "Approver",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-rule pb-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-brand-ink/55">
            Account
          </p>
          <h1 className="font-display text-2xl font-semibold">
            {user.displayName || user.username}
          </h1>
          <span className="mt-1 inline-block rounded-full bg-brand-cream px-2.5 py-0.5 text-xs font-medium text-brand-navy">
            {ROLE_LABEL[user.role]}
          </span>
        </div>
        <form action={logOutAction}>
          <button
            type="submit"
            className="rounded-full border border-brand-rule bg-white px-4 py-2 text-sm font-medium hover:bg-brand-cream"
          >
            Log out
          </button>
        </form>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside>
          <AccountNav role={user.role} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
