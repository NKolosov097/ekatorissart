import { ArtworkCardSkeleton } from "@/components/skeletons/ArtworkCardSkeleton";

export default function ArtworkLoading() {
  return (
    <article className="container-wide py-10 md:py-16">
      <nav className="mb-8 flex items-center gap-2">
        <div className="skeleton h-3 w-12" />
        <span className="text-muted">/</span>
        <div className="skeleton h-3 w-12" />
        <span className="text-muted">/</span>
        <div className="skeleton h-3 w-32" />
      </nav>

      <div className="grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <div className="skeleton relative aspect-[4/5] w-full" />
          <div className="mt-4 flex gap-3">
            <div className="skeleton h-16 w-16" />
            <div className="skeleton h-16 w-16" />
            <div className="skeleton h-16 w-16" />
          </div>
        </div>

        <div className="md:pt-4">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-12 md:h-14 w-3/4 mt-3" />

          <dl className="mt-8 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-4 w-48" />
              </div>
            ))}
          </dl>

          <div className="mt-10 flex items-baseline gap-3">
            <div className="skeleton h-10 w-40" />
            <div className="skeleton h-3 w-32" />
          </div>

          <div className="mt-8">
            <div className="skeleton h-12 w-full max-w-xs" />
          </div>

          <div className="mt-10 space-y-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-11/12" />
            <div className="skeleton h-4 w-10/12" />
            <div className="skeleton h-4 w-9/12" />
          </div>

          <div className="mt-8 border-t border-line pt-8 space-y-2">
            <div className="skeleton h-3 w-28 mb-3" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-11/12" />
            <div className="skeleton h-4 w-3/4" />
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <div className="skeleton h-6 w-16" />
            <div className="skeleton h-6 w-20" />
            <div className="skeleton h-6 w-14" />
          </div>
        </div>
      </div>

      <section className="mt-32 border-t border-line pt-16">
        <div className="skeleton h-3 w-40 mb-8" />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ArtworkCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </article>
  );
}
