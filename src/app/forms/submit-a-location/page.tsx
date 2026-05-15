import PageHero from "@/components/PageHero";
import IntakeForm, { type FieldSpec } from "@/components/IntakeForm";

export const metadata = {
  title: "List a food pantry — Midcoast Food",
  description:
    "Help us build the most comprehensive map of every food pantry in Maine.",
};

const FIELDS: FieldSpec[] = [
  { kind: "text", name: "pantryName", label: "Food pantry name", required: true },
  { kind: "text", name: "address", label: "Address", required: true },
  { kind: "text", name: "city", label: "City", required: true },
  { kind: "text", name: "zip", label: "Zip code", required: true },
  { kind: "email", name: "email", label: "Email" },
  { kind: "tel", name: "phone", label: "Phone number" },
  {
    kind: "checkboxes",
    name: "amenities",
    label: "Which of these apply to the food pantry?",
    options: [
      "Wheelchair Accessible",
      "Year-Round Program",
      "Service Animals Allowed",
      "Restrooms Available to the Public",
      "Multi-Lingual Staff",
    ],
  },
  {
    kind: "checkboxes",
    name: "languages",
    label: "Which languages does it serve?",
    options: ["English", "Spanish", "French", "Arabic"],
  },
  {
    kind: "text",
    name: "otherLanguages",
    label: "Other languages",
    placeholder: "Comma-separated",
  },
  {
    kind: "textarea",
    name: "details",
    label: "Details",
    helpText:
      "Anything we should know — eligibility, distribution method, special programs?",
    rows: 5,
  },
  { kind: "url", name: "website", label: "Website" },
  { kind: "text", name: "hours", label: "Hours", required: true },
];

export default function SubmitLocationPage() {
  return (
    <>
      <PageHero
        eyebrow="SHARE"
        title="List a food pantry"
        body="We really tried, but we can't catch 'em all. Help us build the most comprehensive map of every food pantry in Maine."
      />
      <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <IntakeForm formName="submit-a-location" fields={FIELDS} />
      </section>
    </>
  );
}
