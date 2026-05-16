import {
  pgTable,
  text,
  doublePrecision,
  boolean,
  jsonb,
  timestamp,
  serial,
  index,
} from "drizzle-orm/pg-core";
import type { Amenities, Eligibility } from "@/lib/types";

// ── Accounts ────────────────────────────────────────────────────────────────
// Pseudonymous accounts: username + password only. No email is stored — there
// is no email verification and recovery is via one-time codes or an
// approver-assisted "Community Password Reset".

export const ROLES = ["business", "volunteer", "approver"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["active", "suspended"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const users = pgTable("users", {
  id: text("id").primaryKey(), // crypto.randomUUID()
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<Role>().notNull().default("volunteer"),
  status: text("status").$type<UserStatus>().notNull().default("active"),
  // Display label only — optional, set by businesses for their listing contact.
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Server-side sessions. The cookie holds only the random session id.
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // random 32-byte token, hex
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// One-time recovery codes, issued at signup. Only sha256 hashes are stored.
export const recoveryCodes = pgTable(
  "recovery_codes",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    codeHash: text("code_hash").notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
  },
  (t) => [index("recovery_codes_user_idx").on(t.userId)],
);

// "Community Password Reset" requests — handled by an approver out-of-band.
export const RESET_STATUSES = ["pending", "completed", "denied"] as const;
export type ResetStatus = (typeof RESET_STATUSES)[number];

export const passwordResetRequests = pgTable("password_reset_requests", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: text("status").$type<ResetStatus>().notNull().default("pending"),
  note: text("note"), // free-text context the requester provides
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  handledBy: text("handled_by").references(() => users.id),
  handledAt: timestamp("handled_at", { withTimezone: true }),
});

// ── Resources (the food directory) ──────────────────────────────────────────
// Single source of truth for published listings, seeded from the Webflow
// snapshot. Volunteer/business changes never write here directly — they go
// through `submissions` and an approver applies them.

export const RESOURCE_STATUSES = ["published", "hidden"] as const;
export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];

export const resources = pgTable(
  "resources",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    type: text("type"),
    category: text("category").notNull(),
    verified: boolean("verified").notNull().default(false),
    verifiedStatus: text("verified_status"),

    address: text("address"),
    city: text("city"),
    state: text("state").notNull().default("ME"),
    zip: text("zip"),
    county: text("county"),

    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),

    phone: text("phone"),
    email: text("email"),
    website: text("website"),
    googleMaps: text("google_maps"),
    appleMaps: text("apple_maps"),

    hours: text("hours"),
    description: text("description"),
    descriptionHtml: text("description_html"),

    amenities: jsonb("amenities").$type<Amenities>(),
    eligibility: jsonb("eligibility").$type<Eligibility>(),
    distribution: text("distribution"),
    languages: jsonb("languages").$type<string[]>().notNull().default([]),

    status: text("status")
      .$type<ResourceStatus>()
      .notNull()
      .default("published"),
    // Set when a business account owns/manages this listing.
    ownerUserId: text("owner_user_id").references(() => users.id),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("resources_category_idx").on(t.category),
    index("resources_county_idx").on(t.county),
    index("resources_owner_idx").on(t.ownerUserId),
  ],
);

// ── Submissions / review queue ──────────────────────────────────────────────
// Every volunteer edit/addition and every business profile lands here as a
// pending submission. An approver applies or rejects it.

export const SUBMISSION_KINDS = ["new", "edit"] as const;
export type SubmissionKind = (typeof SUBMISSION_KINDS)[number];

export const SUBMISSION_STATUSES = ["pending", "approved", "rejected"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

// The editable shape of a resource — what a submission's payload carries.
export type ResourcePayload = {
  name: string;
  type: string | null;
  category: string;
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
  hours: string | null;
  description: string | null;
  amenities: Amenities;
  eligibility: Eligibility;
  distribution: string | null;
  languages: string[];
};

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    kind: text("kind").$type<SubmissionKind>().notNull(),
    // null for kind = "new"; the target listing for kind = "edit".
    resourceId: text("resource_id").references(() => resources.id, {
      onDelete: "cascade",
    }),
    payload: jsonb("payload").$type<ResourcePayload>().notNull(),
    submittedBy: text("submitted_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    submitterRole: text("submitter_role").$type<Role>().notNull(),
    status: text("status")
      .$type<SubmissionStatus>()
      .notNull()
      .default("pending"),
    reviewNote: text("review_note"),
    reviewedBy: text("reviewed_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (t) => [
    index("submissions_status_idx").on(t.status),
    index("submissions_submitter_idx").on(t.submittedBy),
  ],
);

export type UserRow = typeof users.$inferSelect;
export type ResourceRow = typeof resources.$inferSelect;
export type SubmissionRow = typeof submissions.$inferSelect;
export type ResetRequestRow = typeof passwordResetRequests.$inferSelect;
