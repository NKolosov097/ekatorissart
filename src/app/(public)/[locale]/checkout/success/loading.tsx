export default function CheckoutSuccessLoading() {
  return (
    <section className="container-prose py-32 text-center">
      <div className="skeleton h-3 w-32 mx-auto" />
      <div className="skeleton h-12 md:h-14 w-64 mx-auto mt-3" />
      <div className="mt-6 space-y-2 max-w-md mx-auto">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-11/12 mx-auto" />
        <div className="skeleton h-4 w-3/4 mx-auto" />
      </div>
      <div className="skeleton h-12 w-48 mx-auto mt-10" />
    </section>
  );
}
