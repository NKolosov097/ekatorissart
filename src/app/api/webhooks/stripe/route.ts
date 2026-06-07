import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq, inArray } from "drizzle-orm";
import { getStripe } from "@/lib/stripe";
import { getDb, isDatabaseConfigured, schema } from "@/db";

export const runtime = "nodejs";

function constructEvent(
  stripe: Stripe,
  payload: string,
  signature: string,
  secret: string,
): Stripe.Event | null {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return null;
  }
}

interface ShippingSnapshot {
  name: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  region: string | null;
  postal: string | null;
  country: string | null;
}

function deriveShipping(session: Stripe.Checkout.Session): ShippingSnapshot {
  // `shipping_details` is present when `shipping_address_collection` was used.
  // Fall back to `customer_details` (billing) so we always have something.
  const sd = (session as unknown as { shipping_details?: Stripe.Checkout.Session.ShippingDetails | null })
    .shipping_details ?? null;
  const cd = session.customer_details;
  const name = sd?.name ?? cd?.name ?? null;
  const addr = sd?.address ?? cd?.address ?? null;
  return {
    name,
    line1: addr?.line1 ?? null,
    line2: addr?.line2 ?? null,
    city: addr?.city ?? null,
    region: addr?.state ?? null,
    postal: addr?.postal_code ?? null,
    country: addr?.country ?? null,
  };
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<void> {
  if (!isDatabaseConfigured()) {
    console.warn("[stripe webhook] DATABASE_URL unset — skipping order persistence");
    return;
  }

  const db = getDb();

  // Idempotency: Stripe retries failed deliveries, and `stripe listen` can replay events.
  // The unique index on stripe_session_id is the source of truth.
  const existing = await db
    .select({ id: schema.orders.id })
    .from(schema.orders)
    .where(eq(schema.orders.stripeSessionId, session.id))
    .limit(1);
  if (existing.length > 0) {
    console.log("[stripe webhook] order already exists for session", session.id);
    return;
  }

  const idsRaw = session.metadata?.artworkIds ?? "";
  const artworkIds = idsRaw.split(",").map((s) => s.trim()).filter(Boolean);
  if (artworkIds.length === 0) {
    console.warn("[stripe webhook] no artworkIds in session metadata", session.id);
    return;
  }

  // Re-retrieve the session to be sure we have shipping/customer details and the
  // payment intent id — webhook payloads occasionally arrive before these settle.
  const full = await stripe.checkout.sessions.retrieve(session.id);

  const artworks = await db
    .select()
    .from(schema.artworks)
    .where(inArray(schema.artworks.id, artworkIds));

  if (artworks.length === 0) {
    console.warn("[stripe webhook] artworks not found in DB", artworkIds);
    return;
  }

  const subtotalCents = artworks.reduce((s, a) => s + a.priceCents, 0);
  const shippingCents = full.shipping_cost?.amount_total ?? 0;
  const totalCents = full.amount_total ?? subtotalCents + shippingCents;
  const currency = (full.currency ?? "usd").toUpperCase();
  const email = full.customer_details?.email ?? full.customer_email ?? "";
  const paymentId =
    typeof full.payment_intent === "string"
      ? full.payment_intent
      : full.payment_intent?.id ?? null;
  const shipping = deriveShipping(full);

  // Use ON CONFLICT to make the insert itself idempotent — covers the race where
  // two webhook deliveries land concurrently.
  const inserted = await db
    .insert(schema.orders)
    .values({
      email,
      status: "PAID",
      subtotalCents,
      shippingCents,
      totalCents,
      currency,
      stripeSessionId: full.id,
      stripePaymentId: paymentId,
      shippingName: shipping.name,
      shippingLine1: shipping.line1,
      shippingLine2: shipping.line2,
      shippingCity: shipping.city,
      shippingRegion: shipping.region,
      shippingPostal: shipping.postal,
      shippingCountry: shipping.country,
    })
    .onConflictDoNothing({ target: schema.orders.stripeSessionId })
    .returning();

  const order = inserted[0];
  if (!order) {
    // Lost the race — another worker already inserted the order. Safe to bail.
    return;
  }

  await db.insert(schema.orderItems).values(
    artworks.map((a) => ({
      orderId: order.id,
      artworkId: a.id,
      unitCents: a.priceCents,
      titleSnapshot: a.title,
    })),
  );

  await db
    .update(schema.artworks)
    .set({ status: "SOLD", updatedAt: new Date() })
    .where(inArray(schema.artworks.id, artworkIds));

  console.log(
    `[stripe webhook] order ${order.id} created, marked ${artworks.length} artwork(s) SOLD`,
  );
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (stripe === null || secret === undefined) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (signature === null) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const payload = await req.text();
  const event = constructEvent(stripe, payload, signature, secret);
  if (event === null) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(stripe, event.data.object);
        break;
      }
      case "checkout.session.expired": {
        // No-op for now — we don't currently reserve stock on session creation,
        // so there's nothing to release. Hook the cleanup here once we add holds.
        break;
      }
    }
  } catch (err) {
    // Returning 500 makes Stripe retry — that's what we want for transient DB errors.
    console.error("[stripe webhook] handler failed:", err);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
