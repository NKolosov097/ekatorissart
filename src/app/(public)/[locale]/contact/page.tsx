import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/config";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("p1"),
    alternates: {
      canonical: locale === "en" ? `${site.url}/contact` : `${site.url}/${locale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <article className="container-prose py-14 md:py-24">
      <div className="eyebrow">{t("eyebrow")}</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3 mb-10">{t("title")}</h1>

      <div className="space-y-6 text-lg leading-relaxed">
        <p>{t("p1")}</p>
        <p>
          <a href={`mailto:${site.email}`} className="link-quiet text-xl">
            {site.email}
          </a>
        </p>
        <p>{t("p2")}</p>
        <p className="text-sm text-muted pt-6 border-t border-line">
          {t("follow_lead")}{" "}
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            Instagram
          </a>
          {t("follow_trail")}
        </p>
      </div>
    </article>
  );
}
