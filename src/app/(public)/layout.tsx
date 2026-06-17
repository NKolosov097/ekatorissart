// Root layout for the public (locale-aware) section of the site.
// Renders <html lang dir> based on the URL — the per-locale [locale]/layout.tsx
// provides translations, header and footer.

import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { type Locale, locales, getDir, isRtl } from "@/i18n/config";
import { site } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

async function localeFromHeaders(): Promise<Locale> {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/";
  const first = pathname.split("/").filter(Boolean)[0];
  return locales.find((l) => l === first) ?? routing.defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await localeFromHeaders();
  const t = await getTranslations({ locale, namespace: "site" });
  const tagline = t("tagline");
  const description = t("description");
  const ogLocale =
    locale === "ar" ? "ar_SA" : locale === "ru" ? "ru_RU" : "en_US";

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${tagline}`,
      template: `%s — ${site.name}`,
    },
    description,
    applicationName: site.name,
    authors: [{ name: site.artistName }],
    creator: site.artistName,
    publisher: site.artistName,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} — ${tagline}`,
      description,
      url: site.url,
      locale: ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description,
    },
    alternates: {
      canonical:
        locale === routing.defaultLocale ? site.url : `${site.url}/${locale}`,
      languages: {
        en: site.url,
        ru: `${site.url}/ru`,
        ar: `${site.url}/ar`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f4ef",
  width: "device-width",
  initialScale: 1,
};

export default async function PublicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await localeFromHeaders();
  const dir = getDir(locale);
  const rtl = isRtl(locale);
  const arabicFont = rtl
    ? "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500&display=swap"
    : null;

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {arabicFont !== null && <link href={arabicFont} rel="stylesheet" />}
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
