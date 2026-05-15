"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "./SiteFooter";

// The /resources directory is a full-viewport app pane (fixed height, its own
// internal scroll). A page-level footer there would force the whole page to
// scroll and fight the map. Everywhere else, render the footer normally.
export default function FooterGate() {
  const pathname = usePathname();
  if (pathname === "/resources") return null;
  return <SiteFooter />;
}
