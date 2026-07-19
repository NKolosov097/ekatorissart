export default function CartLoading() {
  return (
    <section className="container-wide py-14 md:py-20">
      <header className="mb-10">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-12 md:h-14 w-64 mt-3" />
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <li
              key={i}
              className="flex gap-6 border-b border-line pb-8 last:border-b-0"
            >
              <div className="skeleton aspect-[4/5] w-28 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="skeleton h-6 w-2/3" />
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-4 w-40" />
                <div className="skeleton h-3 w-16 mt-2" />
              </div>
              <div className="text-end space-y-3">
                <div className="skeleton h-5 w-20 ml-auto" />
              </div>
            </li>
          ))}
        </ul>

        <aside className="border border-line p-8 h-fit space-y-5">
          <div className="skeleton h-3 w-32" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <div className="skeleton h-4 w-20" />
              <div className="skeleton h-4 w-20" />
            </div>
            <div className="flex justify-between border-t border-line pt-4">
              <div className="skeleton h-5 w-16" />
              <div className="skeleton h-5 w-24" />
            </div>
          </div>
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-3 w-5/6" />
        </aside>
      </div>
    </section>
  );
}
