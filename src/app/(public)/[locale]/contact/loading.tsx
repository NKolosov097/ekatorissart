export default function ContactLoading() {
  return (
    <article className="container-prose py-14 md:py-24">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-12 md:h-14 w-3/4 mt-3 mb-10" />

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-11/12" />
          <div className="skeleton h-5 w-3/4" />
        </div>

        <div className="skeleton h-7 w-72" />

        <div className="space-y-2">
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-2/3" />
        </div>

        <div className="pt-6 border-t border-line space-y-2">
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-3/5" />
        </div>
      </div>
    </article>
  );
}
