import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = { title: "Reset your password — Midcoast Food" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Use a recovery code, or ask a community approver for help."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
