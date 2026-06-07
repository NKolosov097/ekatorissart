import { useTranslations } from "next-intl";
import type { Artwork } from "@/lib/types";
import { ArtworkCard } from "./ArtworkCard";

interface Props {
  artworks: Artwork[];
}

export function ArtworkGrid({ artworks }: Props) {
  const t = useTranslations("shop");
  if (artworks.length === 0) {
    return <p className="py-24 text-center text-muted">{t("empty")}</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
      {artworks.map((a, i) => (
        <ArtworkCard key={a.id} artwork={a} priority={i < 3} />
      ))}
    </div>
  );
}
