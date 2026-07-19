"use client";

import { useLocale } from "next-intl";
import { usePathname, getPathname } from "@/i18n/routing";
import {
  defaultLocale,
  locales,
  localeNames,
  LOCALE_CHOICE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { useState } from "react";

function toLocale(value: string, fallback: Locale): Locale {
  return locales.find((l) => l === value) ?? fallback;
}

export function LocaleSwitcher() {
  const currentRaw = useLocale();
  const current = toLocale(currentRaw, defaultLocale);
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  return (
    <label className="relative inline-flex items-center text-xs uppercase tracking-widest">
      <span className="sr-only">Language</span>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = toLocale(e.target.value, current);
          if (next === current) return;
          setPending(true);
          // Explicit choice overrides browser-language auto-detection
          // (the middleware only honors NEXT_LOCALE when this cookie exists).
          document.cookie = `${LOCALE_CHOICE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
          // Full navigation, not router.replace: <html lang dir> and the
          // conditional Arabic font links live in the root layout, which
          // client-side transitions never re-render — RTL would not apply.
          const target = getPathname({ href: pathname, locale: next });
          window.location.assign(
            `${target}${window.location.search}${window.location.hash}`,
          );
        }}
        className="bg-bone border border-line ps-3 pe-8 py-1 text-ink hover:border-ink transition cursor-pointer appearance-none"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute end-2 text-muted">
        ▾
      </span>
    </label>
  );
}
