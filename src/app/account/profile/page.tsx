import { requireRole } from "@/lib/session";
import { getResourceOwnedBy, countMyPendingSubmissions } from "@/lib/db-account";
import ListingForm from "@/components/account/ListingForm";
import type { ResourcePayload } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function BusinessProfilePage() {
  const user = await requireRole("business");
  const owned = await getResourceOwnedBy(user.id);
  const pending = await countMyPendingSubmissions(user.id);

  const initial: Partial<ResourcePayload> = owned
    ? {
        name: owned.name,
        type: owned.type,
        category: owned.category,
        address: owned.address,
        city: owned.city,
        state: owned.state,
        zip: owned.zip,
        county: owned.county,
        lat: owned.lat,
        lng: owned.lng,
        phone: owned.phone,
        email: owned.email,
        website: owned.website,
        hours: owned.hours,
        description: owned.description,
        amenities: owned.amenities ?? undefined,
        eligibility: owned.eligibility ?? undefined,
        distribution: owned.distribution as ResourcePayload["distribution"],
        languages: owned.languages ?? [],
      }
    : { name: user.displayName ?? "", category: "Business" };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">
          {owned ? "Your profile" : "Create your profile"}
        </h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          {owned
            ? "Update your food program's details. Changes go through community verification before they appear on the map."
            : "Tell the community about your food program. Once you submit, a volunteer will verify it and add it to the map."}
        </p>
      </div>

      {pending > 0 && (
        <p className="rounded-lg border border-brand-rule bg-brand-cream/40 px-4 py-3 text-sm text-brand-ink/75">
          You have {pending} change{pending === 1 ? "" : "s"} awaiting
          verification. Submitting again will add another item to the queue.
        </p>
      )}

      <ListingForm
        resourceId={owned?.id}
        initial={initial}
        submitLabel={owned ? "Submit changes" : "Submit for verification"}
        successTitle={
          owned ? "Changes submitted" : "Profile submitted for verification"
        }
      />
    </div>
  );
}
