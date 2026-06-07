"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const subtotalCents = useCart((s) => s.subtotalCents());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted">{t("empty")}</p>
        <Link href="/shop" className="mt-6 inline-block btn-outline">
          {t("browse")}
        </Link>
      </div>
    );
  }

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message ?? "Stripe is not configured yet.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-12 md:grid-cols-3">
      <ul className="md:col-span-2 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.artworkId} className="flex gap-6 py-6">
            <Link
              href={`/shop/${item.slug}`}
              className="relative aspect-[4/5] w-24 md:w-32 shrink-0 overflow-hidden bg-line"
            >
              <Image src={item.image} alt={item.title} fill sizes="128px" className="object-cover" />
            </Link>
            <div className="flex-1">
              <Link href={`/shop/${item.slug}`} className="font-serif text-xl">
                {item.title}
              </Link>
              <div className="mt-1 text-sm text-muted">{t("original_painting")}</div>
              <button
                onClick={() => remove(item.artworkId)}
                className="mt-3 text-xs uppercase tracking-widest text-muted hover:text-ink"
              >
                {t("remove")}
              </button>
            </div>
            <div className="text-end font-serif text-lg">
              {formatPrice(item.priceCents, item.currency, locale)}
            </div>
          </li>
        ))}
      </ul>

      <aside className="md:ps-6">
        <div className="border border-line p-6">
          <div className="eyebrow mb-4">{t("summary")}</div>
          <div className="flex justify-between text-sm mb-2">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(subtotalCents, "USD", locale)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted mb-6">
            <span>{t("shipping")}</span>
            <span>{t("shipping_included")}</span>
          </div>
          <div className="flex justify-between font-serif text-xl border-t border-line pt-4">
            <span>{t("total")}</span>
            <span>{formatPrice(subtotalCents, "USD", locale)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full mt-6 disabled:opacity-60"
          >
            {loading ? t("loading") : t("proceed")}
          </button>
          {error && <p className="mt-4 text-xs text-accent">{error}</p>}
          <p className="mt-4 text-xs text-muted">{t("secure")}</p>
        </div>
      </aside>
    </div>
  );
}
