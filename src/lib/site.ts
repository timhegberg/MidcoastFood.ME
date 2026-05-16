// Centralised site-level constants. One source of truth for the version tag,
// contact email, mission line, and the social/external links — so when the
// project releases a new "name" we update it here and it flows everywhere.

export const SITE = {
  name: "Midcoast Food",
  domain: "midcoastfood.me",
  version: "v1.1",
  versionTag: "Rockland — Rising Tide",
  tagline: "Find food near you.",
  mission:
    "Everyone deserves good food. We connect neighbors with free and local food resources across Maine.",
  contactEmail: "info@sunshinehouse.xyz",
  submissionsEmail: "ren@sunshinehouse.xyz",
  founderUrl: "https://www.midcoastsolidarity.org/",
  codeOriginUrl: "https://www.sunshinehouse.xyz",
  motto: "We are all responsible for all.",
  mottoAuthor: "Dostoevsky",
} as const;

export const NAV = [
  { href: "/resources", label: "Find food" },
  { href: "/share-your-resources", label: "Share" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/forms/list-your-resource", label: "List a resource" },
  { href: "/about", label: "About" },
  { href: "/account", label: "Login" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms-of-service", label: "Terms of service" },
  { href: "/changelog", label: "Changelog" },
] as const;
