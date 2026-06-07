import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { locales } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.find((l) => l === requested) ?? routing.defaultLocale;
  const messages = (await import(`./messages/${locale}.json`)).default;
  return { locale, messages };
});
