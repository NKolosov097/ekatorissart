export type Locale = "en" | "ru" | "ar";

export const locales: readonly Locale[] = ["en", "ru", "ar"];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  ar: "العربية",
};

const rtlLocaleSet: ReadonlySet<Locale> = new Set(["ar"]);

export function isRtl(locale: Locale): boolean {
  return rtlLocaleSet.has(locale);
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}
