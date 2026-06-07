"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/store/cart";
import type { Artwork } from "@/lib/types";
import { useState } from "react";

export function AddToCart({ artwork }: { artwork: Artwork }) {
  const t = useTranslations("artwork");
  const add = useCart((s) => s.add);
  const has = useCart((s) => s.has(artwork.id));
  const [justAdded, setJustAdded] = useState(false);

  if (artwork.status === "SOLD") {
    return (
      <button disabled className="btn-outline opacity-60 cursor-not-allowed">
        {t("sold_button")}
      </button>
    );
  }

  if (has || justAdded) {
    return (
      <a href="/cart" className="btn-primary">
        {t("view_cart")}
      </a>
    );
  }

  return (
    <button
      onClick={() => {
        add({
          artworkId: artwork.id,
          slug: artwork.slug,
          title: artwork.title,
          priceCents: artwork.priceCents,
          currency: artwork.currency,
          image: artwork.primaryImage,
        });
        setJustAdded(true);
      }}
      className="btn-primary"
    >
      {t("add_to_cart")}
    </button>
  );
}
