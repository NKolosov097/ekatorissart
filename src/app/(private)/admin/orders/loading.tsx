export default function AdminOrdersLoading() {
  return (
    <div>
      <div className="skeleton h-9 w-40 mb-2" />
      <div className="space-y-2 mb-10">
        <div className="skeleton h-4 w-full max-w-xl" />
        <div className="skeleton h-4 w-3/4 max-w-md" />
      </div>
      <div className="border border-line p-16 flex justify-center">
        <div className="skeleton h-5 w-40" />
      </div>
    </div>
  );
}
