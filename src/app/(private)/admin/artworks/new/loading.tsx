export default function NewArtworkLoading() {
  return (
    <div className="max-w-2xl">
      <div className="skeleton h-9 w-56 mb-2" />
      <div className="space-y-2 mb-10">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
      </div>

      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-10 w-full" />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-10 w-full" />
            </div>
          ))}
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-10 w-full" />
          </div>
        ))}

        <div className="space-y-2">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-20 w-full" />
        </div>

        <div className="space-y-2">
          <div className="skeleton h-3 w-44" />
          <div className="skeleton h-32 w-full" />
        </div>

        <div className="space-y-2">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-10 w-64" />
        </div>

        <div className="flex items-center gap-3">
          <div className="skeleton h-4 w-4" />
          <div className="skeleton h-4 w-20" />
        </div>

        <div className="flex items-center gap-3">
          <div className="skeleton h-4 w-4" />
          <div className="skeleton h-4 w-48" />
        </div>

        <div className="skeleton h-12 w-44 mt-4" />
      </div>
    </div>
  );
}
