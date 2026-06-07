"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "@/store/cart";

export function CartButton() {
  const t = useTranslations("nav");
  const count = useCart((s) => s.items.length);
  return (
    <Link
      href="/cart"
      className="relative text-xs uppercase tracking-widest text-ink hover:text-accent transition"
    >
      {t("cart")}
      {count > 0 && (
        <span className="ms-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink text-bone text-[10px] px-1">
          {count}
        </span>
      )}
    </Link>
  );
}
