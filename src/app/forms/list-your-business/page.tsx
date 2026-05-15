import PageHero from "@/components/PageHero";
import IntakeForm, { type FieldSpec } from "@/components/IntakeForm";

export const metadata = {
  title: "List your business — Midcoast Food",
  description:
    "Does your business have an ongoing program to help with food security in Maine? List it here so more people can know about it.",
};

const FIELDS: FieldSpec[] = [
  { kind: "text", name: "businessName", label: "Business name", required: true },
  { kind: "text", name: "address", label: "Business address", required: true },
  { kind: "text", name: "city", label: "City", required: true },
  { kind: "text", name: "zip", label: "Zip code", required: true },
  { kind: "email", name: "email", label: "Email", required: true },
  { kind: "tel", name: "phone", label: "Phone number", required: true },
  {
    kind: "checkboxes",
    name: "amenities",
    label: "Which of these apply to your business?",
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
    label: "Which languages do you serve?",
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
    name: "programDetails",
    label: "Program details",
    helpText: "What food do you offer, who can access it, and how does it work?",
    rows: 5,
  },
  { kind: "url", name: "website", label: "Business website" },
  {
    kind: "text",
    name: "hours",
    label: "Business hours",
    placeholder: "e.g. Mon–Fri 9am–5pm",
  },
];

export default function ListBusinessPage() {
  return (
    <>
      <PageHero
        eyebrow="SHARE"
        title="List your business"
        body="Does your business have an ongoing program to help with food security in Maine? List it here so more people can know about it."
      />
      <section className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
        <IntakeForm formName="list-your-business" fields={FIELDS} />
      </section>
    </>
  );
}
