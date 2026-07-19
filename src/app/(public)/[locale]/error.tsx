"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-prose py-32 text-center">
      <div className="eyebrow">500</div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3">{t("title")}</h1>
      <p className="mt-6 text-muted">{t("body")}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={reset} className="btn-primary">
          {t("retry")}
        </button>
        <Link href="/" className="btn-outline">
          {t("back")}
        </Link>
      </div>
    </section>
  );
}
