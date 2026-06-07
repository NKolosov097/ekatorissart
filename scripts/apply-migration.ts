// Apply a hand-written SQL migration against the configured DATABASE_URL.
// Uses postgres.js (already a dependency) because it supports executing a
// full multi-statement SQL file via `sql.unsafe()` in one transaction —
// the Neon HTTP driver's tagged-template API isn't a good fit for that.
//
// Usage:
//   pnpm db:apply                                   # applies the latest file
//   pnpm db:apply 0001_artwork_kind_and_drop_reserved.sql

import "dotenv/config";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import postgres from "postgres";

const MIGRATIONS_DIR = resolve(__dirname, "../src/db/migrations");

function pickMigration(): string {
  const requested = process.argv[2];
  if (requested !== undefined && requested.length > 0) {
    return join(MIGRATIONS_DIR, requested);
  }
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const last = files[files.length - 1];
  if (last === undefined) {
    throw new Error(`No .sql files in ${MIGRATIONS_DIR}`);
  }
  return join(MIGRATIONS_DIR, last);
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (url === undefined || url.length === 0) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local first.");
  }

  const path = pickMigration();
  const sqlText = readFileSync(path, "utf8");
  console.log(`Applying migration: ${path}`);

  const sql = postgres(url, { max: 1, prepare: false });
  try {
    await sql.unsafe(sqlText);
    console.log("Migration applied successfully.");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
