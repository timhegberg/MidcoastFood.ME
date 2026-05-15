import PageHero from "@/components/PageHero";
import IntakeForm, { type FieldSpec } from "@/components/IntakeForm";

export const metadata = {
  title: "Submit a correction — Midcoast Food",
  description:
    "See something out of date on a listing? Tell us and we'll fix it within a few days.",
};

const FIELDS: FieldSpec[] = [
  {
    kind: "text",
    name: "resourceName",
    label: "Which listing needs a correction?",
    required: true,
    placeholder: "Name of the pantry, pantry, or program",
  },
  {
    kind: "url",
    name: "resourceUrl",
    label: "Listing URL (if you have it)",
    placeholder: "https://midcoastfood.me/resources/...",
  },
  {
    kind: "select",
    name: "correctionType",
    label: "What's wrong?",
    required: true,
    options: [
      "Hours are out of date",
      "Address is wrong",
      "Phone or email is wrong",
      "Resource is closed",
      "Other",
    ],
  },
  {
    kind: "textarea",
    name: "details",
    label: "Details",
    required: true,
    helpText: "What should the correct info be? How did you find out?",
    rows: 5,
  },
  { kind: "text", name: "contactName", label: "Your name" },
  { kind: "email", name: "email", label: "Email (so we can follow up)" },
];

export default function CorrectionPage() {
  return (
    <>
      <PageHero
        eyebrow="HELP IMPROVE"
        title="Submit a correction"
        body="See something out of date on a listing? Tell us and we'll fix it within a few days."
      />
      <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <IntakeForm
          formName="submit-a-correction"
          fields={FIELDS}
          submitLabel="Send correction"
          successMessage="Thanks — we'll review and update soon."
        />
      </section>
    </>
  );
}
