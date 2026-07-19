export type Locale = "en" | "ru" | "ar";

export const locales: readonly Locale[] = ["en", "ru", "ar"];

export const defaultLocale: Locale = "en";

// Set only when the user picks a language in LocaleSwitcher; the middleware
// follows the browser's Accept-Language unless this cookie is present.
export const LOCALE_CHOICE_COOKIE = "locale_choice";

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
