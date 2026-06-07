// Drizzle client. Picks driver by environment:
//   - In Vercel / Edge / Neon: uses @neondatabase/serverless (HTTP, no pool).
//   - Otherwise (local dev, VPS): uses postgres.js with a small pool.
//
// The app can run without a database at all — see src/data/artworks.ts.
// Pages call `getDb()` lazily so we don't crash when DATABASE_URL is unset.

import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

type DrizzleClient =
  | ReturnType<typeof drizzleNeon<typeof schema>>
  | ReturnType<typeof drizzlePg<typeof schema>>;

let cached: DrizzleClient | null = null;

export function getDb(): DrizzleClient {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. The site can run with sample data — see src/data/artworks.ts.",
    );
  }

  if (url.includes("neon.tech")) {
    const sql = neon(url);
    cached = drizzleNeon(sql, { schema });
  } else {
    const client = postgres(url, { max: 5, prepare: false });
    cached = drizzlePg(client, { schema });
  }
  return cached;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export { schema };
