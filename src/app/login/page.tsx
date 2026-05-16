import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Log in — Midcoast Food" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/account");
  return (
    <AuthShell title="Log in" subtitle="Welcome back.">
      <LoginForm />
    </AuthShell>
  );
}
