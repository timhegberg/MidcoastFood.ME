import PageHero from "@/components/PageHero";
import IntakeForm, { type FieldSpec } from "@/components/IntakeForm";

export const metadata = {
  title: "List your resource — Midcoast Food",
  description:
    "Adding a sharing table, free little food pantry, community fridge, or mutual-aid program? List it here.",
};

const FIELDS: FieldSpec[] = [
  { kind: "text", name: "resourceName", label: "Resource name", required: true },
  {
    kind: "select",
    name: "resourceType",
    label: "What kind of resource is this?",
    required: true,
    options: [
      "Sharing Table",
      "Free Little Food Pantry",
      "Community Fridge",
      "Free Meal",
      "Mutual Aid Program",
      "Farm",
      "Other",
    ],
  },
  { kind: "text", name: "address", label: "Address", required: true },
  { kind: "text", name: "city", label: "City", required: true },
  { kind: "text", name: "zip", label: "Zip code", required: true },
  { kind: "text", name: "contactName", label: "Your name" },
  { kind: "email", name: "email", label: "Email" },
  { kind: "tel", name: "phone", label: "Phone number" },
  {
    kind: "textarea",
    name: "details",
    label: "Details",
    helpText:
      "Tell us about the resource — how does it work, when's it stocked, who runs it?",
    rows: 5,
  },
  { kind: "url", name: "website", label: "Website or social link" },
];

export default function ListResourcePage() {
  return (
    <>
      <PageHero
        eyebrow="SHARE"
        title="List your resource"
        body="Sharing table, free little food pantry, community fridge, or mutual-aid program — get it on the map."
      />
      <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <IntakeForm formName="list-your-resource" fields={FIELDS} />
      </section>
    </>
  );
}
