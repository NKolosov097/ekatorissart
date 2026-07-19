import { formatPrice } from "@/lib/format";

// Order notification emails, sent via Resend's REST API with plain fetch —
// no SDK dependency. Follows the project's degrade-gracefully pattern:
// without RESEND_API_KEY sending becomes a logged no-op, never an error.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Where owner notifications go. Overridable, but defaults to the shop owner.
const NOTIFY_TO = process.env.ORDER_NOTIFY_EMAIL ?? "ekatorissart@outlook.com";

// Resend requires a verified sender. `onboarding@resend.dev` works out of the
// box but can only deliver to the Resend account's own email — replace with
// an address on a verified domain for production.
const NOTIFY_FROM =
  process.env.ORDER_EMAIL_FROM ?? "Ekatoris Art <onboarding@resend.dev>";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export interface OrderNotification {
  orderId: string;
  customerEmail: string;
  items: { title: string; unitCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  shipping: {
    name: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    region: string | null;
    postal: string | null;
    country: string | null;
  };
}

function shippingLines(s: OrderNotification["shipping"]): string[] {
  return [
    s.name,
    s.line1,
    s.line2,
    [s.postal, s.city].filter(Boolean).join(" "),
    [s.region, s.country].filter(Boolean).join(", "),
  ].flatMap((line) => (line ? [line] : []));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildText(o: OrderNotification): string {
  const price = (cents: number) => formatPrice(cents, o.currency);
  return [
    `New order ${o.orderId}`,
    "",
    "Items:",
    ...o.items.map((i) => `  - ${i.title} — ${price(i.unitCents)}`),
    "",
    `Subtotal: ${price(o.subtotalCents)}`,
    `Shipping: ${price(o.shippingCents)}`,
    `Total:    ${price(o.totalCents)}`,
    "",
    `Customer: ${o.customerEmail || "(no email)"}`,
    "Ship to:",
    ...shippingLines(o.shipping).map((l) => `  ${l}`),
  ].join("\n");
}

function buildHtml(o: OrderNotification): string {
  const price = (cents: number) => formatPrice(cents, o.currency);
  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 16px 4px 0">${escapeHtml(i.title)}</td>` +
        `<td align="right">${price(i.unitCents)}</td></tr>`,
    )
    .join("");
  const address = shippingLines(o.shipping).map(escapeHtml).join("<br>");
  return `
    <h2 style="margin:0 0 12px">New order</h2>
    <p style="margin:0 0 16px;color:#666">Order&nbsp;ID: ${escapeHtml(o.orderId)}</p>
    <table style="border-collapse:collapse">${rows}
      <tr><td style="padding:12px 16px 0 0;border-top:1px solid #ddd">Subtotal</td>
          <td align="right" style="padding-top:12px;border-top:1px solid #ddd">${price(o.subtotalCents)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0">Shipping</td><td align="right">${price(o.shippingCents)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0"><strong>Total</strong></td>
          <td align="right"><strong>${price(o.totalCents)}</strong></td></tr>
    </table>
    <p style="margin:16px 0 4px"><strong>Customer:</strong> ${escapeHtml(o.customerEmail || "(no email)")}</p>
    <p style="margin:0"><strong>Ship to:</strong><br>${address || "(no address)"}</p>
  `;
}

/**
 * Notify the shop owner about a new paid order. Never throws — an email
 * failure must not fail the Stripe webhook (a retry would hit the order
 * idempotency check and the email would be lost anyway).
 */
export async function sendOrderNotification(o: OrderNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY unset — skipping order notification for ${o.orderId}`,
    );
    return;
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_TO],
        // Let the owner hit "Reply" to answer the customer directly.
        ...(o.customerEmail ? { reply_to: o.customerEmail } : {}),
        subject: `New order — ${formatPrice(o.totalCents, o.currency)} (${o.items.length} item${o.items.length === 1 ? "" : "s"})`,
        text: buildText(o),
        html: buildHtml(o),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(
        `[email] Resend responded ${res.status} for order ${o.orderId}: ${body}`,
      );
      return;
    }
    console.log(`[email] order notification sent to ${NOTIFY_TO} for ${o.orderId}`);
  } catch (err) {
    console.error(`[email] failed to send order notification for ${o.orderId}:`, err);
  }
}
