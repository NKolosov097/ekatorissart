// Mirrors the shape of [locale]/not-found.tsx. Without this file the segment
// falls back to [locale]/loading.tsx — the homepage skeleton — which flashes
// on every unknown URL before the 404 renders.
export default function NotFoundLoading() {
  return (
    <section className="container-prose py-32 flex flex-col items-center text-center">
      <div className="skeleton h-3 w-10" />
      <div className="skeleton mt-4 h-10 w-64 max-w-full md:h-12" />
      <div className="skeleton mt-7 h-4 w-96 max-w-full" />
      <div className="skeleton mt-10 h-12 w-44" />
    </section>
  );
}
