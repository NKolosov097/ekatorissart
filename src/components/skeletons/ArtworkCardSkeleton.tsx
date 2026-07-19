export function ArtworkCardSkeleton() {
  return (
    <div className="block">
      <div className="skeleton relative aspect-[4/5] w-full" />
      <div className="mt-5 space-y-2">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-1/3 mt-2" />
      </div>
    </div>
  );
}
