import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Load local env (Neon connection string pulled via `vercel env pull`).
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
