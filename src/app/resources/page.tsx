import ResourceDirectory from "@/components/ResourceDirectory";
import { getPublishedResources } from "@/lib/db-resources";

export const metadata = {
  title: "Find food — Midcoast Food",
  description:
    "Search and filter food pantries, community fridges, soup kitchens, and meal programs across Maine.",
};

// Listings change as volunteers edit and approvers publish — always read fresh.
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await getPublishedResources();
  return <ResourceDirectory resources={resources} />;
}
