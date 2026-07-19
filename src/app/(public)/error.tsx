"use client";

// Catches errors thrown above the [locale] segment (layout, Header/Footer,
// message loading) — [locale]/error.tsx can't see those. Renders inside the
// root layout, so global styles and fonts are available, but there is no
// NextIntlClientProvider here: strings come from a local map keyed by the
// locale route param instead of useTranslations.

import { useEffect } from "react";
import { useParams } from "next/navigation";

const strings = {
  en: {
    title: "A quiet hiccup.",
    body: "Something went wrong on our side. Please try again, or return to the homepage.",
    retry: "Try again",
    back: "Back to the studio",
  },
  ru: {
    title: "Что-то пошло не так.",
    body: "Произошла непредвиденная ошибка. Попробуйте ещё раз или вернитесь на главную.",
    retry: "Попробовать снова",
    back: "Вернуться в мастерскую",
  },
  ar: {
    title: "حدث خطأ ما.",
    body: "حدث خطأ غير متوقع من جانبنا. حاول مرة أخرى أو عد إلى الصفحة الرئيسية.",
    retry: "حاول مرة أخرى",
    back: "العودة إلى المرسم",
  },
} as const;

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: Props) {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "en";
  const t = strings[locale as keyof typeof strings] ?? strings.en;
  const home = locale === "en" ? "/" : `/${locale}`;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <section className="container-prose py-32 text-center">
        <div className="eyebrow">500</div>
        <h1 className="font-serif text-4xl md:text-5xl mt-3">{t.title}</h1>
        <p className="mt-6 text-muted">{t.body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={reset} className="btn-primary">
            {t.retry}
          </button>
          <a href={home} className="btn-outline">
            {t.back}
          </a>
        </div>
      </section>
    </main>
  );
}
