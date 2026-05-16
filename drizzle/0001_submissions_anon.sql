ALTER TABLE "submissions" ALTER COLUMN "submitted_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ALTER COLUMN "submitter_role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "submitter_contact" text;