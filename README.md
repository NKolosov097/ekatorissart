# Ekatoris Art

A trilingual e-commerce storefront for an original-painting artist, built with the Next.js App Router. Visitors browse a catalog of originals and prints, check out through Stripe, and the site keeps working even when the database, payments, or email provider aren't configured yet.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript** (strict)
- **next-intl** for i18n — English, Russian, Arabic (with RTL layout)
- **Drizzle ORM** on Postgres (Neon serverless or any Postgres via `postgres.js`)
- **Stripe Checkout** + webhooks
- **Zustand** for cart state, persisted to `localStorage`
- **Tailwind CSS**
- **Resend** (REST API, no SDK) for order notification emails
- **Vercel Analytics**
- Cloudflare **R2** for image storage (configured, not yet wired into the admin upload flow — see [Roadmap](#roadmap))

## Features

- Storefront catalog with artwork detail pages, an image lightbox, and a persisted cart
- Stripe Checkout that **re-validates price and availability against the database** before creating a session — the client cart is never trusted
- Idempotent order persistence on the `checkout.session.completed` webhook (unique index on the Stripe session id), which also marks the purchased artwork(s) `SOLD` and emails the shop owner
- Three locales (`en`, `ru`, `ar`). The browser's `Accept-Language` decides the locale on every visit unless the visitor explicitly picks one via the switcher; Arabic renders right-to-left with its own font stack
- Cookie-gated admin area (`/admin`) — separate route group, no locale prefix — with a studio dashboard and an artwork list
- Degrades gracefully instead of crashing: no `DATABASE_URL` → serves bundled sample data, no Stripe keys → checkout returns a friendly message, no `RESEND_API_KEY` → email sending is a logged no-op

## Project structure

```
ekatorissart/
├── src/
│   ├── app/
│   │   ├── (public)/[locale]/     # storefront: shop, artwork detail, cart, about, contact
│   │   ├── (private)/admin/       # admin dashboard, no locale segment, cookie-gated
│   │   ├── api/
│   │   │   ├── checkout/          # creates the Stripe Checkout session
│   │   │   ├── webhooks/stripe/   # handles checkout.session.completed
│   │   │   └── admin/             # login / logout
│   │   └── actions.ts             # server actions using raw neon() SQL
│   ├── components/                # ArtworkGrid, ArtworkLightbox, CartView, Header, ...
│   ├── db/                        # Drizzle client (index.ts) + schema.ts
│   ├── i18n/                      # locale config, routing, messages/{en,ru,ar}.json
│   ├── lib/                       # artworks (data-access), stripe, email, format, types
│   ├── store/cart.ts              # Zustand cart store
│   ├── data/artworks.ts           # bundled sample data (DB-optional fallback)
│   └── middleware.ts              # branches on /admin vs. locale-aware routing
├── scripts/                       # seed.ts, check-db.ts, check-orders.ts, apply-migration.ts
└── drizzle.config.ts
```

## Data model

| Table        | Purpose                                                                 |
|--------------|--------------------------------------------------------------------------|
| `artworks`   | Title, medium, dimensions, price (cents), `status` (`AVAILABLE`/`SOLD`), `kind` (`ORIGINAL`/`PRINT`), images, tags |
| `orders`     | One row per paid Stripe session (idempotent via a unique index on `stripe_session_id`), totals, shipping snapshot |
| `order_items`| Line items per order, with a title/price snapshot taken at purchase time |

Money is always stored as integer cents; enums (`artwork_status`, `artwork_kind`, `medium`, `order_status`) are native Postgres enums via `pgEnum`.

## Getting started

### Prerequisites

- Node.js
- pnpm (`packageManager: pnpm@9.14.4`)

### Install & run

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The site runs at `http://localhost:3000` with **no further configuration** — without `DATABASE_URL` it serves the sample artworks bundled in `src/data/artworks.ts`, and without Stripe/Resend keys those integrations simply no-op.

### Database (optional)

```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/ekatorissart"
```

```bash
pnpm db:generate   # generate migration SQL from src/db/schema.ts
pnpm db:migrate    # apply migrations
pnpm db:seed       # load the sample artworks into the database
pnpm db:studio     # Drizzle Studio
```

> **Note:** avoid `pnpm db:push` against a Neon database — Neon runs Postgres 17+, which names every `NOT NULL` constraint, but the installed `drizzle-kit` emits unnamed ones. The diff is never empty (it keeps proposing to drop `id` primary-key constraints, which Postgres rejects). Prefer `db:generate` + review + apply manually.

### Stripe (optional)

```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Forward webhooks locally with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Order emails (optional)

```bash
# .env.local
RESEND_API_KEY=...
ORDER_NOTIFY_EMAIL=you@example.com
ORDER_EMAIL_FROM="Ekatoris Art <onboarding@resend.dev>"
```

`onboarding@resend.dev` only delivers to the Resend account owner's address — use a verified sending domain in production.

### Admin

```bash
# .env.local
ADMIN_PASSWORD=change-me
```

Sign in at `/admin/login`; the session is a plain `admin_session=ok` cookie (MVP-grade auth, not meant to gate production secrets).

## Available scripts

| Command | Description |
|---|---|
| `pnpm dev` / `build` / `start` | Next.js dev server / production build / production serve |
| `pnpm lint` | ESLint (`eslint-config-next`) |
| `pnpm db:generate` / `db:migrate` / `db:push` / `db:studio` | Drizzle Kit (see caveat above for `db:push`) |
| `pnpm db:seed` | Load sample artworks into the database |
| `pnpm db:apply` | Apply a migration file directly (`scripts/apply-migration.ts`) |

## Internationalization

- Locale strings live in `src/i18n/messages/{en,ru,ar}.json` — add a new key to **all three** files.
- Use the locale-aware `Link`, `redirect`, `usePathname`, `useRouter` exported from `src/i18n/routing.ts` instead of `next/link` / `next/navigation`.
- English is served unprefixed (`localePrefix: "as-needed"`); `/ru` and `/ar` keep their prefix.

## Roadmap

- Wire the "New artwork" admin form to an actual endpoint and upload images to R2 (currently posts to a route that doesn't exist yet)
- Build out the admin orders list — orders are already persisted by the Stripe webhook, but `/admin/orders` doesn't query them yet
- Release stock holds on `checkout.session.expired` once inventory reservation exists
- Add automated tests (none configured yet)
