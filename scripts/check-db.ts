// Quick sanity check after seeding. Not part of the normal workflow —
// `pnpm exec tsx scripts/check-db.ts`.

import "dotenv/config";
import { getDb, schema } from "../src/db";

async function main(): Promise<void> {
  const db = getDb();
  const rows = await db
    .select({
      slug: schema.artworks.slug,
      title: schema.artworks.title,
      status: schema.artworks.status,
      priceCents: schema.artworks.priceCents,
      featured: schema.artworks.featured,
    })
    .from(schema.artworks);
  console.table(rows);
  console.log(`Total: ${rows.length} artworks`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
