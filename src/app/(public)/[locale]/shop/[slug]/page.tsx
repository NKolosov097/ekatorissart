import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getArtwork, listArtworks, listAllSlugs } from "@/lib/artworks";
import { formatPrice, formatDimensions, mediumLabel } from "@/lib/format";
import { site } from "@/lib/site";
import { AddToCart } from "@/components/AddToCart";
import { ArtworkCard } from "@/components/ArtworkCard";
import { ArtworkLightbox } from "@/components/ArtworkLightbox";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await listAllSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

function artworkUrl(locale: Locale, slug: string): string {
  return locale === "en"
    ? `${site.url}/shop/${slug}`
    : `${site.url}/${locale}/shop/${slug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const artwork = await getArtwork(slug);
  if (!artwork) return { title: "Not found" };

  const med = mediumLabel(artwork.medium, locale);
  const title = `${artwork.title} — ${med}, ${artwork.widthCm}×${artwork.heightCm} cm`;
  const url = artworkUrl(locale, artwork.slug);
  const description =
    artwork.description ??
    `${artwork.title}, an original ${med.toLowerCase()} painting by ${site.artistName}.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${site.url}/shop/${artwork.slug}`,
        ru: `${site.url}/ru/shop/${artwork.slug}`,
        ar: `${site.url}/ar/shop/${artwork.slug}`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      images: [
        { url: artwork.primaryImage, width: 1600, height: 2000, alt: artwork.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [artwork.primaryImage],
    },
  };
}

export const revalidate = 300;

export default async function ArtworkPage({ params }: Props) {
  const { locale, slug } = await params;
  const artwork = await getArtwork(slug);
  if (!artwork) notFound();

  const t = await getTranslations({ locale, namespace: "artwork" });
  const all = await listArtworks();
  const related = all
    .filter((a) => a.id !== artwork.id && a.status !== "SOLD")
    .slice(0, 3);

  const isSold = artwork.status === "SOLD";
  const url = artworkUrl(locale, artwork.slug);

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: artwork.title,
    description: artwork.description ?? artwork.story ?? undefined,
    image: [artwork.primaryImage, ...artwork.images],
    sku: artwork.id,
    brand: { "@type": "Brand", name: site.artistName },
    category: "VisualArtwork",
    additionalProperty: [
      { "@type": "PropertyValue", name: "Medium", value: mediumLabel(artwork.medium, "en") },
      { "@type": "PropertyValue", name: "Surface", value: artwork.surface },
      { "@type": "PropertyValue", name: "Width", value: `${artwork.widthCm} cm` },
      { "@type": "PropertyValue", name: "Height", value: `${artwork.heightCm} cm` },
      { "@type": "PropertyValue", name: "Year", value: artwork.year },
    ],
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: artwork.currency,
      price: (artwork.priceCents / 100).toFixed(2),
      availability: isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Person", name: site.artistName },
    },
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumb_home"), item: site.url },
      { "@type": "ListItem", position: 2, name: t("breadcrumb_shop"), item: `${site.url}/shop` },
      { "@type": "ListItem", position: 3, name: artwork.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <article className="container-wide py-10 md:py-16">
        <nav className="mb-8 text-xs uppercase tracking-widest text-muted">
          <Link href="/" className="hover:text-ink">{t("breadcrumb_home")}</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-ink">{t("breadcrumb_shop")}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{artwork.title}</span>
        </nav>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <ArtworkLightbox
              images={[artwork.primaryImage, ...artwork.images]}
              alt={`${artwork.title} — ${mediumLabel(artwork.medium, locale)}`}
              primarySizes="(min-width: 768px) 50vw, 100vw"
              primaryPriority
            />
          </div>

          <div className="md:pt-4">
            <div className="eyebrow">{t("eyebrow", { year: artwork.year })}</div>
            <h1 className="font-serif text-3xl md:text-5xl mt-3">{artwork.title}</h1>

            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex gap-4">
                <dt className="w-28 text-muted">{t("labels.medium")}</dt>
                <dd>
                  {t("on_surface", {
                    medium: mediumLabel(artwork.medium, locale),
                    surface: artwork.surface.toLowerCase(),
                  })}
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-28 text-muted">{t("labels.size")}</dt>
                <dd>{formatDimensions(artwork.widthCm, artwork.heightCm, locale)}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-28 text-muted">{t("labels.frame")}</dt>
                <dd>{artwork.framed ? t("framed") : t("unframed")}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-28 text-muted">{t("labels.status")}</dt>
                <dd className="uppercase tracking-widest text-xs">
                  {artwork.status === "AVAILABLE"
                    ? t("status.available")
                    : t("status.sold")}
                </dd>
              </div>
            </dl>

            <div className="mt-10 flex items-baseline gap-3">
              <div className="font-serif text-3xl">
                {isSold ? t("status.sold") : formatPrice(artwork.priceCents, artwork.currency, locale)}
              </div>
              {!isSold && (
                <span className="text-xs text-muted uppercase tracking-widest">
                  {t("shipping_included")}
                </span>
              )}
            </div>

            <div className="mt-8">
              <AddToCart artwork={artwork} />
            </div>

            {artwork.description && (
              <p className="mt-10 text-base leading-relaxed">{artwork.description}</p>
            )}

            {artwork.story && (
              <div className="mt-8 border-t border-line pt-8">
                <div className="eyebrow mb-3">{t("from_studio")}</div>
                <p className="text-base leading-relaxed text-ink/90">{artwork.story}</p>
              </div>
            )}

            {artwork.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest border border-line px-3 py-1 text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-32 border-t border-line pt-16">
            <div className="eyebrow mb-8">{t("you_may_also_like")}</div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArtworkCard key={a.id} artwork={a} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
