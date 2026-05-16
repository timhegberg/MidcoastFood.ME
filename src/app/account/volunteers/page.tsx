import { requireRole } from "@/lib/session";
import { listManageableUsers } from "@/lib/db-account";
import VolunteerManager, {
  type ManagedUser,
} from "@/components/account/VolunteerManager";

export const dynamic = "force-dynamic";

export default async function VolunteersPage() {
  const me = await requireRole("approver");
  const rows = await listManageableUsers();
  const users: ManagedUser[] = rows.map((r) => ({
    id: r.id,
    username: r.username,
    displayName: r.displayName,
    role: r.role,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Volunteers</h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          Promote trusted volunteers to approver, or suspend accounts. Approvers
          can review the queue, manage volunteers, and handle password resets.
        </p>
      </div>
      <VolunteerManager users={users} currentUserId={me.id} />
    </div>
  );
}
