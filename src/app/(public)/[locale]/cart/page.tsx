import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartView } from "@/components/CartView";
import type { Locale } from "@/i18n/config";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });

  return (
    <section className="container-wide py-14 md:py-20">
      <header className="mb-10">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1 className="font-serif text-4xl md:text-5xl mt-3">{t("title")}</h1>
      </header>
      <CartView />
    </section>
  );
}
