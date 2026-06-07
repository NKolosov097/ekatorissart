"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { defaultLocale, locales, localeNames, type Locale } from "@/i18n/config";
import { useTransition } from "react";

function toLocale(value: string, fallback: Locale): Locale {
  return locales.find((l) => l === value) ?? fallback;
}

export function LocaleSwitcher() {
  const currentRaw = useLocale();
  const current = toLocale(currentRaw, defaultLocale);
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <label className="relative inline-flex items-center text-xs uppercase tracking-widest">
      <span className="sr-only">Language</span>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = toLocale(e.target.value, current);
          startTransition(() => {
            router.replace(pathname, { locale: next });
          });
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
