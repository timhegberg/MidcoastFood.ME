import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/session";
import { getResourceRowById } from "@/lib/db-resources";
import ListingForm from "@/components/account/ListingForm";
import type { ResourcePayload } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("volunteer");
  const { id } = await params;
  const row = await getResourceRowById(id);
  if (!row) notFound();

  const initial: Partial<ResourcePayload> = {
    name: row.name,
    type: row.type,
    category: row.category,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    county: row.county,
    lat: row.lat,
    lng: row.lng,
    phone: row.phone,
    email: row.email,
    website: row.website,
    hours: row.hours,
    description: row.description,
    amenities: row.amenities ?? undefined,
    eligibility: row.eligibility ?? undefined,
    distribution: row.distribution as ResourcePayload["distribution"],
    languages: row.languages ?? [],
  };

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/account/listings"
          className="text-sm text-brand-ink/60 hover:text-brand-ink"
        >
          ← Back to listings
        </Link>
        <h2 className="mt-2 font-display text-xl font-semibold">
          Edit: {row.name}
        </h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          Propose changes to this listing. They go to the review queue — the
          live listing won't change until an approver accepts them.
        </p>
      </div>
      <ListingForm
        resourceId={row.id}
        initial={initial}
        submitLabel="Submit changes"
        successTitle="Changes submitted"
      />
    </div>
  );
}
