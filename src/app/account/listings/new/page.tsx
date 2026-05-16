import { requireRole } from "@/lib/session";
import ListingForm from "@/components/account/ListingForm";

export const dynamic = "force-dynamic";

export default async function NewListingPage() {
  // Volunteers and approvers only.
  await requireRole("volunteer");
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">Add a listing</h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          Add a food resource that isn't on the map yet. It enters the review
          queue and an approver publishes it.
        </p>
      </div>
      <ListingForm submitLabel="Submit new listing" />
    </div>
  );
}
