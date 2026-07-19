import { useTranslations } from "next-intl";
import type { Artwork } from "@/lib/types";
import { ArtworkCard } from "./ArtworkCard";

interface Props {
  artworks: Artwork[];
  columns?: 3 | 4;
}

export function ArtworkGrid({ artworks, columns = 3 }: Props) {
  const t = useTranslations("shop");
  if (artworks.length === 0) {
    return <p className="py-24 text-center text-muted">{t("empty")}</p>;
  }
  const lgCols = columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <div
      className={`grid grid-cols-1 gap-10 sm:grid-cols-2 ${lgCols} lg:gap-x-8 lg:gap-y-16`}
    >
      {artworks.map((a, i) => (
        <ArtworkCard key={a.id} artwork={a} priority={i < columns} />
      ))}
    </div>
  );
}
