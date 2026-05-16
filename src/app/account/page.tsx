import Link from "next/link";
import { requireUser } from "@/lib/session";
import {
  countMyPendingSubmissions,
  countPendingResets,
  countPendingSubmissions,
  getResourceOwnedBy,
} from "@/lib/db-account";

export const dynamic = "force-dynamic";

export default async function AccountDashboard() {
  const user = await requireUser();

  if (user.role === "business") {
    const listing = await getResourceOwnedBy(user.id);
    const pending = await countMyPendingSubmissions(user.id);
    return (
      <div className="space-y-6">
        <Intro
          heading="Your business account"
          body="Create and maintain your food program's listing. Every change is reviewed by a community volunteer before it goes live."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Card
            title={listing ? "Your listing is live" : "No listing yet"}
            body={
              listing
                ? `"${listing.name}" is published. Edit it any time — changes go back through review.`
                : "Set up your profile to get listed on the map. It'll enter the verification queue for a volunteer to check."
            }
            href="/account/profile"
            cta={listing ? "Edit my profile" : "Create my profile"}
          />
          <Card
            title="Submissions in review"
            body={
              pending > 0
                ? `You have ${pending} change${pending === 1 ? "" : "s"} waiting for a volunteer to verify.`
                : "Nothing waiting for review right now."
            }
            href="/account/submissions"
            cta="View my submissions"
          />
        </div>
      </div>
    );
  }

  // volunteer or approver
  const myPending = await countMyPendingSubmissions(user.id);
  return (
    <div className="space-y-6">
      <Intro
        heading={
          user.role === "approver" ? "Approver tools" : "Volunteer tools"
        }
        body="Keep the Midcoast Food map accurate. Add new resources and fix existing ones — your changes are reviewed before publishing."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          title="Add a listing"
          body="Found a pantry, fridge, or meal program that isn't on the map? Add it."
          href="/account/listings/new"
          cta="Add a listing"
        />
        <Card
          title="Fix a listing"
          body="Browse every resource and propose edits — hours, address, contact, anything."
          href="/account/listings"
          cta="Browse listings"
        />
        <Card
          title="My submissions"
          body={
            myPending > 0
              ? `${myPending} of your submissions ${myPending === 1 ? "is" : "are"} still pending review.`
              : "Track the status of everything you've submitted."
          }
          href="/account/submissions"
          cta="View my submissions"
        />
        {user.role === "approver" && <ApproverCard />}
      </div>
    </div>
  );
}

async function ApproverCard() {
  const [queue, resets] = await Promise.all([
    countPendingSubmissions(),
    countPendingResets(),
  ]);
  return (
    <div className="rounded-2xl border border-brand-navy/30 bg-brand-navy/5 p-5">
      <h3 className="font-display text-lg font-semibold">Approver queue</h3>
      <p className="mt-1 text-sm text-brand-ink/70">
        {queue} submission{queue === 1 ? "" : "s"} awaiting review
        {resets > 0
          ? ` · ${resets} password reset${resets === 1 ? "" : "s"} to handle`
          : ""}
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/account/queue"
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-medium text-white"
        >
          Review queue
        </Link>
        <Link
          href="/account/volunteers"
          className="rounded-full border border-brand-rule bg-white px-4 py-2 text-sm font-medium"
        >
          Volunteers
        </Link>
      </div>
    </div>
  );
}

function Intro({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">{heading}</h2>
      <p className="mt-1 max-w-2xl text-sm text-brand-ink/70">{body}</p>
    </div>
  );
}

function Card({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-brand-rule bg-white p-5 shadow-card">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 flex-1 text-sm text-brand-ink/70">{body}</p>
      <Link
        href={href}
        className="mt-4 inline-flex w-fit rounded-full border border-brand-rule px-4 py-2 text-sm font-medium hover:bg-brand-cream"
      >
        {cta}
      </Link>
    </div>
  );
}
