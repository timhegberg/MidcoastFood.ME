import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import FooterGate from "@/components/FooterGate";

export const metadata: Metadata = {
  title: "Midcoast Food — Find food near you in Maine",
  description:
    "An interactive directory of food pantries, community fridges, soup kitchens, and meal programs across Maine. Everyone deserves good food.",
  metadataBase: new URL("https://midcoastfood.me"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-brand-paper text-brand-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <FooterGate />
      </body>
    </html>
  );
}
