import { requireRole } from "@/lib/session";
import { getAllResourceRows } from "@/lib/db-resources";
import ListingPicker, {
  type PickerItem,
} from "@/components/account/ListingPicker";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BrowseListingsPage() {
  await requireRole("volunteer");
  const rows = await getAllResourceRows();
  const items: PickerItem[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    category: r.category as Category,
    status: r.status,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Browse listings</h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          Find a resource to fix. Your edits go to the review queue before they
          publish.
        </p>
      </div>
      <ListingPicker items={items} />
    </div>
  );
}
