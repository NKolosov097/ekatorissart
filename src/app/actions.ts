"use server";

// Server actions backed by the Neon serverless driver, as recommended in the
// Neon Next.js quickstart. The rest of the codebase queries through Drizzle
// (see src/db/index.ts) for typed queries — both drivers share the same Neon
// HTTP connection under the hood, so use whichever fits the task:
//   - Drizzle: typed inserts/updates with schema validation
//   - neon(): one-off raw SQL when you need full control

import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import type { Artwork } from "@/lib/types";

function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (url === undefined || url.length === 0) {
    throw new Error(
      "DATABASE_URL is not set. Configure it in .env.local before calling server actions.",
    );
  }
  return neon(url);
}

interface ArtworkRow {
  id: string;
  slug: string;
  title: string;
  year: number;
  price_cents: number;
  currency: string;
  status: "AVAILABLE" | "SOLD";
  primary_image: string;
  width_cm: number;
  height_cm: number;
}

function rowToArtwork(row: ArtworkRow): Pick<
  Artwork,
  "id" | "slug" | "title" | "year" | "priceCents" | "currency" | "status" | "primaryImage" | "widthCm" | "heightCm"
> {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    year: row.year,
    priceCents: row.price_cents,
    currency: row.currency,
    status: row.status,
    primaryImage: row.primary_image,
    widthCm: row.width_cm,
    heightCm: row.height_cm,
  };
}

function isArtworkRow(value: unknown): value is ArtworkRow {
  if (typeof value !== "object" || value === null) return false;
  return (
    "id" in value &&
    "slug" in value &&
    "title" in value &&
    "status" in value &&
    "primary_image" in value
  );
}

export async function getRecentArtworks(limit = 6) {
  const sql = getSql();
  const rows = await sql`
    SELECT id, slug, title, year, price_cents, currency, status,
           primary_image, width_cm, height_cm
    FROM artworks
    WHERE status <> 'SOLD'
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT ${limit}
  `;
  return rows.filter(isArtworkRow).map(rowToArtwork);
}
