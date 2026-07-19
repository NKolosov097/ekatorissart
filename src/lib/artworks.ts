// Data-access layer. Reads from the database when DATABASE_URL is set,
// otherwise falls back to the bundled sample data. If the database is set
// but unreachable (typical when devs copy .env.example without running a
// local Postgres), we degrade to sample data and log a warning instead of
// crashing the request.

import { desc, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured, schema } from "@/db";
import { artworks as sampleArtworks } from "@/data/artworks";
import type { Artwork } from "@/lib/types";

function rowToArtwork(row: typeof schema.artworks.$inferSelect): Artwork {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    year: row.year,
    medium: row.medium,
    surface: row.surface,
    widthCm: row.widthCm,
    heightCm: row.heightCm,
    priceCents: row.priceCents,
    currency: row.currency,
    status: row.status,
    kind: row.kind,
    description: row.description ?? undefined,
    story: row.story ?? undefined,
    tags: row.tags,
    primaryImage: row.primaryImage,
    images: row.images,
    framed: row.framed,
    featured: row.featured,
    publishedAt: row.publishedAt?.toISOString() ?? null,
  };
}

let warnedAboutFallback = false;
function warnFallback(operation: string, error: unknown): void {
  if (!warnedAboutFallback) {
    warnedAboutFallback = true;
    console.warn(
      `[ekatorissart] Database is configured but unreachable (${operation}). ` +
        `Falling back to sample data. Remove DATABASE_URL from .env.local or ` +
        `start a real Postgres to use database-backed data.`,
    );
  }
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[ekatorissart] ${operation} error:`, error);
  }
}

function sortSampleByLatest(list: Artwork[]): Artwork[] {
  return [...list].sort((a, b) => {
    const aDate = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bDate = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bDate - aDate;
  });
}

export async function listArtworks(): Promise<Artwork[]> {
  if (!isDatabaseConfigured()) return sortSampleByLatest(sampleArtworks);
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.artworks)
      .orderBy(desc(schema.artworks.createdAt));
    return rows.map(rowToArtwork);
  } catch (e) {
    warnFallback("listArtworks", e);
    return sortSampleByLatest(sampleArtworks);
  }
}

export async function listAvailableArtworks(): Promise<Artwork[]> {
  const all = await listArtworks();
  return all.filter((a) => a.status !== "SOLD");
}

export async function listFeaturedArtworks(): Promise<Artwork[]> {
  const all = await listArtworks();
  return all.filter((a) => a.featured);
}

export async function getArtwork(slug: string): Promise<Artwork | null> {
  if (!isDatabaseConfigured()) {
    return sampleArtworks.find((a) => a.slug === slug) ?? null;
  }
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(schema.artworks)
      .where(eq(schema.artworks.slug, slug))
      .limit(1);
    return row ? rowToArtwork(row) : null;
  } catch (e) {
    warnFallback("getArtwork", e);
    return sampleArtworks.find((a) => a.slug === slug) ?? null;
  }
}

export async function listAllSlugs(): Promise<string[]> {
  const all = await listArtworks();
  return all.map((a) => a.slug);
}
