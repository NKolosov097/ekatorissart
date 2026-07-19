import { ArtworkCardSkeleton } from "./ArtworkCardSkeleton";

interface Props {
  columns?: 3 | 4;
  count?: number;
}

export function ArtworkGridSkeleton({ columns = 3, count }: Props) {
  const items = count ?? (columns === 4 ? 8 : 6);
  const lgCols = columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <div
      className={`grid grid-cols-1 gap-10 sm:grid-cols-2 ${lgCols} lg:gap-x-8 lg:gap-y-16`}
    >
      {Array.from({ length: items }).map((_, i) => (
        <ArtworkCardSkeleton key={i} />
      ))}
    </div>
  );
}
