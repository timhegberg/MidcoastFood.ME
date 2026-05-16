// Promotes an existing account to the "approver" role.
// Needed to bootstrap the first approver — after that, approvers promote
// each other from the Volunteers page.
//
//   npm run make-approver -- <username>
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { users } from "../src/db/schema";

async function main() {
  const username = process.argv[2]?.trim().toLowerCase();
  if (!username) {
    console.error("Usage: npm run make-approver -- <username>");
    process.exit(1);
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set.");

  const db = drizzle(neon(url), { schema: { users } });
  const updated = await db
    .update(users)
    .set({ role: "approver" })
    .where(eq(users.username, username))
    .returning({ username: users.username, role: users.role });

  if (updated.length === 0) {
    console.error(`No account found with username "${username}".`);
    process.exit(1);
  }
  console.log(`"${updated[0].username}" is now an approver.`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
