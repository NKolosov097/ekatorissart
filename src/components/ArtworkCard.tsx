import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Artwork } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface Props {
  artwork: Artwork;
  priority?: boolean;
}

export function ArtworkCard({ artwork, priority }: Props) {
  const t = useTranslations("artwork");
  const locale = useLocale();
  const isSold = artwork.status === "SOLD";

  return (
    <Link
      href={`/shop/${artwork.slug}`}
      className="group block"
      aria-label={`${artwork.title}, ${formatPrice(
        artwork.priceCents,
        artwork.currency,
        locale,
      )}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        <Image
          src={artwork.primaryImage}
          alt={artwork.title}
          fill
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 95vw"
          className={`object-cover transition duration-700 group-hover:scale-[1.02] ${isSold ? "opacity-80" : ""}`}
          priority={priority}
        />
        {isSold && (
          <span className="absolute start-4 top-4 bg-ink text-bone px-3 py-1 text-[10px] uppercase tracking-widest">
            {t("status.sold")}
          </span>
        )}
      </div>

      <div className="mt-5">
        <h3 className="font-serif text-xl leading-snug">{artwork.title}</h3>
        <div className="mt-1 text-sm text-muted">
          {artwork.widthCm} × {artwork.heightCm} cm · {artwork.year}
        </div>
        <div className="mt-2 text-sm">
          {isSold ? (
            <span className="text-muted">{t("status.sold")}</span>
          ) : (
            <span>{formatPrice(artwork.priceCents, artwork.currency, locale)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
