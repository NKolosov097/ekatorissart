import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // "as-needed": /en/... gets stripped to /..., other locales keep prefix.
  // Cleaner default-locale URLs are friendlier to SEO for the primary market.
  localePrefix: "as-needed",
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
