export default function AboutLoading() {
  return (
    <article className="container-prose py-14 md:py-24">
      <div className="skeleton h-3 w-16" />
      <div className="skeleton h-12 md:h-14 w-2/3 mt-3 mb-10" />

      <div className="space-y-6">
        {[5, 4, 4, 3].map((lines, p) => (
          <div key={p} className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className={`skeleton h-5 ${
                  i === lines - 1 ? "w-2/3" : "w-full"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </article>
  );
}
