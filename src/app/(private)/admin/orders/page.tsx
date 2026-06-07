export default function AdminOrders() {
  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Orders</h1>
      <p className="text-sm text-muted mb-10">
        Stripe sessions land here once you configure the webhook secret. Wiring
        is stubbed in <code className="text-ink">src/app/api/webhooks/stripe/route.ts</code>.
      </p>
      <div className="border border-line p-16 text-center text-muted">No orders yet.</div>
    </div>
  );
}
