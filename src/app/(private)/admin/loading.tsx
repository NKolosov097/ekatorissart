export default function AdminHomeLoading() {
  return (
    <div>
      <div className="skeleton h-9 w-64 mb-2" />
      <div className="skeleton h-4 w-80 mb-10" />

      <div className="grid gap-6 md:grid-cols-4 mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-line p-6">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-10 w-16 mt-3" />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="skeleton h-12 w-44" />
        <div className="skeleton h-12 w-52" />
      </div>
    </div>
  );
}
