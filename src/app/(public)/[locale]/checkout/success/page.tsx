import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return {
    title: t("success_title"),
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutSuccessPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });

  return (
    <section className="container-prose py-32 text-center">
      <ClearCartOnMount />
      <div className="eyebrow">{t("success_eyebrow")}</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">{t("success_title")}</h1>
      <p className="mt-6 text-muted max-w-md mx-auto">{t("success_body")}</p>
      <Link href="/" className="btn-outline mt-10">
        {t("continue")}
      </Link>
    </section>
  );
}
