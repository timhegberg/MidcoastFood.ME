import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazy singleton. The client is created on first use rather than at import
// time, so building the app without DATABASE_URL set never crashes — only
// code paths that actually query the database require it.
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Provision Neon Postgres in the Vercel " +
        "dashboard, then run `vercel env pull .env.local` for local dev.",
    );
  }
  _db = drizzle(neon(url), { schema });
  return _db;
}

export { schema };
