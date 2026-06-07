// Seed the database with the demo artworks bundled in src/data/artworks.ts.
// Idempotent — re-running won't create duplicates (conflict on slug is ignored).
//
// Usage:  pnpm db:seed

import "dotenv/config";
import { getDb, schema } from "../src/db";
import { artworks as sampleArtworks } from "../src/data/artworks";

async function main(): Promise<void> {
  if (process.env.DATABASE_URL === undefined) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local first.");
  }

  const db = getDb();

  const rows = sampleArtworks.map((a) => ({
    slug: a.slug,
    title: a.title,
    year: a.year,
    medium: a.medium,
    surface: a.surface,
    widthCm: a.widthCm,
    heightCm: a.heightCm,
    priceCents: a.priceCents,
    currency: a.currency,
    status: a.status,
    kind: a.kind,
    description: a.description ?? null,
    story: a.story ?? null,
    tags: a.tags,
    primaryImage: a.primaryImage,
    images: a.images,
    framed: a.framed,
    featured: a.featured,
    publishedAt: a.publishedAt !== null ? new Date(a.publishedAt) : null,
  }));

  const inserted = await db
    .insert(schema.artworks)
    .values(rows)
    .onConflictDoNothing()
    .returning();

  console.log(
    `Seeded ${inserted.length} new artworks (${rows.length - inserted.length} already existed).`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
