export default function AdminArtworksLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="skeleton h-9 w-40" />
        <div className="skeleton h-10 w-20" />
      </div>

      <div className="border border-line">
        <div className="bg-bone border-b border-line grid grid-cols-[80px_1fr_120px_120px_120px_80px] gap-4 px-4 py-3">
          {["Image", "Title", "Size", "Price", "Status", ""].map((h, i) => (
            <div key={i} className="skeleton h-3 w-16" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-t border-line grid grid-cols-[80px_1fr_120px_120px_120px_80px] gap-4 px-4 py-3 items-center"
          >
            <div className="skeleton w-14 h-16" />
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-3 w-16" />
            <div className="skeleton h-3 w-10 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
