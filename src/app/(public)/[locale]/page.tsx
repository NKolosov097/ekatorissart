import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { listFeaturedArtworks } from "@/lib/artworks";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/config";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const title = `${site.artistName} — ${t("tagline")}`;
  return {
    title,
    description: t("description"),
    openGraph: { title, description: t("description") },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const featured = await listFeaturedArtworks();
  const hero = featured[0];

  return (
    <>
      {hero && (
        <section className="container-wide pt-10 md:pt-16">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="eyebrow mb-6">
                {t("eyebrow", { artist: site.artistName })}
              </div>
              <h1 className="font-serif text-4xl md:text-6xl leading-[1.05]">
                {t("headline_line1")}
                <br />
                {t("headline_line2")}
              </h1>
              <p className="mt-6 text-lg text-muted max-w-md">{t("intro")}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary">
                  {t("shop_button")}
                </Link>
                <Link href="/about" className="btn-outline">
                  {t("about_button")}
                </Link>
              </div>
            </div>

            <Link
              href={`/shop/${hero.slug}`}
              className="order-1 md:order-2 block group"
              aria-label={hero.title}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={hero.primaryImage}
                  alt={hero.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={`object-cover transition duration-700 group-hover:scale-[1.02] ${hero.status === "SOLD" ? "opacity-80" : ""}`}
                  priority
                />
                {hero.status === "SOLD" && (
                  <span className="absolute start-4 top-4 bg-ink text-bone px-3 py-1 text-[10px] uppercase tracking-widest">
                    {t("sold_badge")}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="eyebrow">{t("featured")}</div>
                  <div className="font-serif text-xl mt-1">{hero.title}</div>
                </div>
                <div className="text-sm text-muted">
                  {hero.widthCm} × {hero.heightCm} cm
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="container-wide mt-24 md:mt-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="eyebrow">{t("selected_eyebrow")}</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-2">{t("selected_title")}</h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline text-xs uppercase tracking-widest link-quiet"
          >
            {t("view_all")} →
          </Link>
        </div>
        <ArtworkGrid artworks={featured.slice(0, 6)} />
        <div className="mt-12 text-center md:hidden">
          <Link href="/shop" className="btn-outline">
            {t("view_all_originals")}
          </Link>
        </div>
      </section>

      <section className="container-wide mt-32 mb-10 border-t border-line pt-16">
        <div className="grid gap-10 md:grid-cols-3 text-sm">
          <div>
            <div className="eyebrow mb-3">{t("values.from_life_title")}</div>
            <p className="text-muted">{t("values.from_life_body")}</p>
          </div>
          <div>
            <div className="eyebrow mb-3">{t("values.archival_title")}</div>
            <p className="text-muted">{t("values.archival_body")}</p>
          </div>
          <div>
            <div className="eyebrow mb-3">{t("values.shipping_title")}</div>
            <p className="text-muted">{t("values.shipping_body")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
