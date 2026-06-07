import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/config";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("eyebrow"),
    description: t("p1"),
    alternates: {
      canonical: locale === "en" ? `${site.url}/about` : `${site.url}/${locale}/about`,
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <article className="container-prose py-14 md:py-24">
      <div className="eyebrow">{t("eyebrow")}</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3 mb-10">{site.artistName}</h1>

      <div className="space-y-6 text-lg leading-relaxed">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>
          {t("p4_lead")}{" "}
          <a href={`mailto:${site.email}`} className="link-quiet">
            {site.email}
          </a>
          {t("p4_trail")}
        </p>
      </div>
    </article>
  );
}
