import type { MetadataRoute } from "next";
import { listArtworks } from "@/lib/artworks";
import { site } from "@/lib/site";
import { routing } from "@/i18n/routing";

// Localized sitemap. For each route we emit:
//   - the default-locale URL (no prefix)
//   - one entry per non-default locale (with prefix)
// Google reads each as a distinct, indexable page.

function localized(path: string, lastModified: Date, changeFreq: "daily" | "weekly" | "monthly", priority: number): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url:
      locale === routing.defaultLocale
        ? `${site.url}${path}`
        : `${site.url}/${locale}${path}`,
    lastModified,
    changeFrequency: changeFreq,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? `${site.url}${path}` : `${site.url}/${l}${path}`,
        ]),
      ),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artworks = await listArtworks();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    ...localized("", now, "weekly", 1),
    ...localized("/shop", now, "daily", 0.9),
    ...localized("/about", now, "monthly", 0.6),
    ...localized("/contact", now, "monthly", 0.5),
  ];

  const artworkRoutes: MetadataRoute.Sitemap = artworks.flatMap((a) =>
    localized(
      `/shop/${a.slug}`,
      a.publishedAt ? new Date(a.publishedAt) : now,
      "weekly",
      a.status === "SOLD" ? 0.4 : 0.8,
    ),
  );

  return [...staticRoutes, ...artworkRoutes];
}
