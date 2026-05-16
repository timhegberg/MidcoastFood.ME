// Centered card layout shared by the sign-up / login / recovery pages.
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:py-20">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-brand-ink/65">{subtitle}</p>
        )}
      </div>
      <div className="mt-8 rounded-2xl border border-brand-rule bg-white p-6 shadow-card sm:p-8">
        {children}
      </div>
    </div>
  );
}
