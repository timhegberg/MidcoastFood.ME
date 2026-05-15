export type Category =
  | "Government"
  | "Community"
  | "WCB"
  | "LFFP"
  | "Religious"
  | "Business"
  | "Other";

export type Distribution = "Client Choice" | "Pre-Packed" | "Hybrid" | null;
export type VerifiedStatus = "Verified" | "Unverified" | "Left Voicemail" | null;

export type Amenities = {
  wheelchairAccessible: boolean;
  onSiteParking: boolean;
  restrooms: boolean;
  serviceAnimals: boolean;
  yearRound: boolean;
};

export type Eligibility = {
  openAccess: boolean;
  income: boolean;
  residency: boolean;
  documentation: boolean;
  notes: string | null;
};

export type Resource = {
  id: string;
  slug: string;
  name: string;
  type: string | null;
  category: Category;
  verified: boolean;
  verifiedStatus: VerifiedStatus;

  address: string | null;
  city: string | null;
  state: string;
  zip: string | null;
  county: string | null;

  lat: number;
  lng: number;

  phone: string | null;
  email: string | null;
  website: string | null;
  googleMaps: string | null;
  appleMaps: string | null;

  hours: string | null;
  description: string | null;
  descriptionHtml: string | null;

  amenities: Amenities;
  eligibility: Eligibility;
  distribution: Distribution;
  languages: string[];
};

export const CATEGORIES: Category[] = [
  "Community",
  "Religious",
  "WCB",
  "LFFP",
  "Government",
  "Business",
];

export const CATEGORY_LABEL: Record<Category, string> = {
  Government: "Government",
  Community: "Community / Non-profit",
  WCB: "Waldo County Bounty",
  LFFP: "Little Free Pantry",
  Religious: "Religious",
  Business: "Business",
  Other: "Other",
};

export const CATEGORY_SHORT: Record<Category, string> = {
  Government: "Gov",
  Community: "Community",
  WCB: "WCB",
  LFFP: "Little Free",
  Religious: "Religious",
  Business: "Business",
  Other: "Other",
};

export const CATEGORY_BLURB: Record<Category, string> = {
  Government: "State, federal, and municipal food programs",
  Community: "Independent non-profits and community food banks",
  WCB: "Waldo County Bounty network",
  LFFP: "Take what you need, leave what you can",
  Religious: "Faith-based pantries and meal programs",
  Business: "Restaurants and businesses sharing food",
  Other: "Other resources",
};

export const CATEGORY_COLOR: Record<Category, string> = {
  Government: "#5B6B82",
  Community: "#2F6F4E",
  WCB: "#B5651D",
  LFFP: "#D94F2D",
  Religious: "#8B5A8C",
  Business: "#0F2A4A",
  Other: "#94A3B8",
};

export const AMENITY_LABEL: Record<keyof Amenities, string> = {
  wheelchairAccessible: "Wheelchair accessible",
  onSiteParking: "On-site parking",
  restrooms: "Restrooms",
  serviceAnimals: "Service animals welcome",
  yearRound: "Open year-round",
};
