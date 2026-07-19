import { ArtworkGridSkeleton } from "@/components/skeletons/ArtworkGridSkeleton";

export default function HomeLoading() {
  return (
    <>
      <section className="container-wide pt-6 md:pt-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="skeleton h-3 w-48 mb-6" />
            <div className="space-y-3">
              <div className="skeleton h-12 md:h-16 w-5/6" />
              <div className="skeleton h-12 md:h-16 w-3/4" />
            </div>
            <div className="mt-6 space-y-2 max-w-md">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-11/12" />
              <div className="skeleton h-4 w-2/3" />
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="skeleton h-12 w-44" />
              <div className="skeleton h-12 w-44" />
            </div>
          </div>

          <div className="order-1 md:order-2 mx-auto w-full md:w-[calc((100svh_-_14rem)*4/5)] md:max-w-full">
            <div className="skeleton relative aspect-[4/5] w-full" />
            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-6 w-2/3" />
              </div>
              <div className="skeleton h-4 w-24" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide mt-24 md:mt-32">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-9 w-64" />
          </div>
          <div className="hidden md:block skeleton h-3 w-20" />
        </div>
        <ArtworkGridSkeleton columns={3} count={6} />
      </section>

      <section className="container-wide mt-32 mb-10 border-t border-line pt-16">
        <div className="grid gap-10 md:grid-cols-3 text-sm">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton h-3 w-32 mb-3" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-11/12" />
                <div className="skeleton h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
