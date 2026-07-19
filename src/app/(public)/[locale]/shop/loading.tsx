import { ArtworkGridSkeleton } from "@/components/skeletons/ArtworkGridSkeleton";

export default function ShopLoading() {
  return (
    <section className="container-wide py-14 md:py-20">
      <header className="mb-12 md:mb-16 max-w-2xl">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-12 md:h-14 w-3/4 mt-3" />
        <div className="mt-5 space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-11/12" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </header>

      <div className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-3 w-12" />
          <div className="flex gap-2">
            <div className="skeleton h-7 w-16" />
            <div className="skeleton h-7 w-20" />
            <div className="skeleton h-7 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="skeleton h-3 w-14" />
          <div className="flex gap-2">
            <div className="skeleton h-7 w-16" />
            <div className="skeleton h-7 w-24" />
            <div className="skeleton h-7 w-16" />
          </div>
        </div>
      </div>

      <ArtworkGridSkeleton columns={4} count={8} />
    </section>
  );
}
