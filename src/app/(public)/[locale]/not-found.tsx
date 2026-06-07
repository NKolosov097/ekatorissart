import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="container-prose py-32 text-center">
      <div className="eyebrow">404</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">{t("title")}</h1>
      <p className="mt-6 text-muted">{t("body")}</p>
      <Link href="/" className="btn-outline mt-10">
        {t("back")}
      </Link>
    </section>
  );
}
