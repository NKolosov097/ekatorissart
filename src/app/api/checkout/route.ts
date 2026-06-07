import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getArtwork } from "@/lib/artworks";
import { site } from "@/lib/site";
import type { CartLine } from "@/lib/types";

export const runtime = "nodejs";

interface CheckoutBody {
  items: CartLine[];
  locale?: string;
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const required = ["artworkId", "slug", "title", "priceCents", "currency", "image"];
  for (const key of required) {
    if (!(key in value)) return false;
  }
  return true;
}

function isCheckoutBody(value: unknown): value is CheckoutBody {
  if (typeof value !== "object" || value === null || !("items" in value)) {
    return false;
  }
  if (!Array.isArray(value.items)) return false;
  return value.items.every(isCartLine);
}

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error: "stripe_not_configured",
        message:
          "Stripe is not configured. Set STRIPE_SECRET_KEY in .env to enable real checkout.",
      },
      { status: 200 },
    );
  }

  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!isCheckoutBody(parsed)) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (parsed.items.length === 0) {
    return NextResponse.json({ error: "cart_empty" }, { status: 400 });
  }

  // Re-validate prices and availability server-side. Never trust the client.
  const validated = await Promise.all(
    parsed.items.map(async (line) => {
      const artwork = await getArtwork(line.slug);
      if (!artwork || artwork.status === "SOLD") return null;
      return artwork;
    }),
  );

  const available = validated.flatMap((a) => (a === null ? [] : [a]));
  if (available.length === 0) {
    return NextResponse.json({ error: "items_unavailable" }, { status: 409 });
  }

  const stripe = getStripe();
  if (stripe === null) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: available.map((a) => ({
      price_data: {
        currency: a.currency.toLowerCase(),
        unit_amount: a.priceCents,
        product_data: {
          name: a.title,
          description: `${a.widthCm} × ${a.heightCm} cm · ${a.year}`,
          images: [a.primaryImage],
          metadata: { artworkId: a.id, slug: a.slug },
        },
      },
      quantity: 1,
    })),
    shipping_address_collection: {
      allowed_countries: [
        "US", "CA", "GB", "DE", "FR", "IT", "ES", "NL", "BE", "CH",
        "AT", "SE", "NO", "DK", "FI", "IE", "PT", "AU", "NZ", "JP",
        "AE", "SA", "KW", "QA", "BH", "OM",
      ],
    },
    success_url: `${site.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/cart`,
    metadata: {
      artworkIds: available.map((a) => a.id).join(","),
    },
  });

  return NextResponse.json({ url: session.url });
}
