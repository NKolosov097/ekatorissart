import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { listArtworks } from "@/lib/artworks";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import {
  ShopFilters,
  type KindFilter,
  type StatusFilter,
} from "@/components/ShopFilters";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/config";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ kind?: string; status?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });
  return {
    title: t("meta_title"),
    description: t("meta_description", { artist: site.artistName }),
    alternates: {
      canonical:
        locale === "en" ? `${site.url}/shop` : `${site.url}/${locale}/shop`,
    },
  };
}

export const revalidate = 300;

function parseKind(raw: string | undefined): KindFilter {
  return raw === "originals" || raw === "prints" ? raw : "all";
}

function parseStatus(raw: string | undefined): StatusFilter {
  return raw === "available" || raw === "sold" ? raw : "all";
}

export default async function ShopPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { kind: kindRaw, status: statusRaw } = await searchParams;
  const kind = parseKind(kindRaw);
  const status = parseStatus(statusRaw);

  const t = await getTranslations({ locale, namespace: "shop" });
  const all = await listArtworks();

  const filtered = all.filter((a) => {
    if (kind === "originals" && a.kind !== "ORIGINAL") return false;
    if (kind === "prints" && a.kind !== "PRINT") return false;
    if (status === "available" && a.status === "SOLD") return false;
    if (status === "sold" && a.status !== "SOLD") return false;
    return true;
  });

  // Sort: available first, sold last; within each group, newest first.
  const sorted = [...filtered].sort((a, b) => {
    const aSold = a.status === "SOLD" ? 1 : 0;
    const bSold = b.status === "SOLD" ? 1 : 0;
    if (aSold !== bSold) return aSold - bSold;
    const aDate = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bDate = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bDate - aDate;
  });

  return (
    <section className="container-wide py-14 md:py-20">
      <header className="mb-12 md:mb-16 max-w-2xl">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="font-serif text-4xl md:text-5xl mt-3">{t("title")}</h1>
        <p className="mt-5 text-muted">{t("intro")}</p>
      </header>

      <ShopFilters kind={kind} status={status} />

      <ArtworkGrid artworks={sorted} />
    </section>
  );
}
