import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = { title: "Create an account — Midcoast Food" };
export const dynamic = "force-dynamic";

// Note: this page intentionally does NOT redirect logged-in users away.
// signUpAction sets the session cookie, which triggers a router refresh — if
// this page redirected on an active session, that refresh would navigate away
// and destroy the one-time recovery-codes screen before the user saw it.
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole = role === "business" ? "business" : "volunteer";
  return (
    <AuthShell
      title="Create an account"
      subtitle="For volunteers keeping listings accurate and businesses sharing food. No email required."
    >
      <SignUpForm defaultRole={defaultRole} />
    </AuthShell>
  );
}
