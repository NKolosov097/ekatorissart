# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (`packageManager: pnpm@9.14.4`). Use it, not npm/yarn.

- `pnpm dev` — Next.js dev server (port 3000)
- `pnpm build` / `pnpm start` — production build / serve
- `pnpm lint` — `next lint` (ESLint, `eslint-config-next`)
- `pnpm db:generate` — generate Drizzle migration SQL from `src/db/schema.ts` into `src/db/migrations/`
- `pnpm db:migrate` — apply migrations
- `pnpm db:push` — **do not run on the current Neon DB.** Neon uses Postgres 17+, where every NOT NULL is stored as a named constraint, but the installed drizzle-kit only emits unnamed `NOT NULL` columns. The diff is therefore never empty — it always proposes dropping ~32 `*_not_null` constraints, and the transaction fails with `42P16` on the three primary-key columns (`id` PKs can't have NOT NULL dropped). Schema changes: edit `src/db/schema.ts`, run `pnpm db:generate`, review the SQL, apply it manually (raw `neon()` script or `psql`). The schema is already in sync semantically — `notNull()` is enforced in the DB; the constraint *names* are just cosmetic noise drizzle-kit can't ignore.
- `pnpm db:studio` — Drizzle Studio
- `pnpm db:seed` — `tsx scripts/seed.ts`; idempotent (slug conflicts ignored), reads `src/data/artworks.ts`

No test runner is configured.

## Architecture

Next.js 14 App Router e-commerce site for selling original artworks. Three locales (`en`, `ru`, `ar` — Arabic is RTL), Stripe checkout, Drizzle ORM on Postgres.

### Route groups split public vs admin

`src/app/` uses two route groups with **fundamentally different routing semantics**:

- `src/app/(public)/[locale]/…` — locale-prefixed, i18n via `next-intl`. `localePrefix: "as-needed"` (English is unprefixed; `/ru`, `/ar` are prefixed).
- `src/app/(private)/admin/…` — **no locale segment**, English-only, password-gated by cookie.

`src/middleware.ts` branches on `/admin` vs everything else:
- For `/admin/*` it checks the `admin_session=ok` cookie (set by `src/app/api/admin/login/route.ts`) and redirects to `/admin/login` if missing. **It does not invoke next-intl.**
- For all other paths it delegates to `createIntlMiddleware(routing)`, with a twist: the browser's `Accept-Language` wins on **every** visit (fallback `en`), not just the first. next-intl would persist even the auto-detected locale in `NEXT_LOCALE`, so the middleware ignores/strips that cookie unless the `locale_choice` cookie (set only by `LocaleSwitcher`, name in `src/i18n/config.ts`) marks an explicit user choice — only then is `NEXT_LOCALE` honored.
- Both branches set an `x-pathname` response header so server layouts can read the current path (used in `src/app/(public)/layout.tsx` to derive the locale for `<html lang dir>` and in `(private)/admin/layout.tsx` to detect the login page and skip chrome).

When adding a new public page, place it under `(public)/[locale]/…` and read params with `params: Promise<{ locale: Locale }>` (Next 14 async params). Admin pages must **not** include `[locale]`.

### Data access has a database-optional fallback

`src/lib/artworks.ts` is the read API for the public site. It:
1. Returns `src/data/artworks.ts` (bundled sample data) when `DATABASE_URL` is unset, **and**
2. **Catches DB errors and falls back to sample data** with a one-time warning, so a dev who copies `.env.example` without running Postgres still sees a working site.

Don't bypass this layer in public pages — go through `listArtworks`, `listAvailableArtworks`, `listFeaturedArtworks`, `getArtwork`. The admin and API routes can call `getDb()` from `src/db/index.ts` directly when they require a live DB.

`src/db/index.ts` picks the driver at runtime: `@neondatabase/serverless` (HTTP) if `DATABASE_URL` contains `neon.tech`, otherwise `postgres.js` with a small pool. Both share `src/db/schema.ts`. There is also `src/app/actions.ts` which uses raw `neon()` SQL tagged templates for server actions — Drizzle and `neon()` coexist by design (Drizzle for typed queries, raw `neon()` for one-off SQL). Pick whichever fits; don't replace one with the other wholesale.

### Checkout flow

`src/store/cart.ts` is a Zustand store persisted to `localStorage` under `ekatorissart-cart` (items only — derived state is excluded via `partialize`). Client adds items via `AddToCart`; on checkout, `src/components/CartView.tsx` posts to `/api/checkout`.

`src/app/api/checkout/route.ts` **re-validates each line against the database server-side** (`getArtwork(slug)`, filter out `SOLD`) before creating the Stripe session — never trust client cart prices. Both checkout and the webhook check `isStripeConfigured()` and return a soft `200` (not `5xx`) when Stripe env vars are missing, so the dev UI can show a friendly message without breaking.

`src/app/api/webhooks/stripe/route.ts` handles `checkout.session.completed`: it persists an `Order`/`OrderItem` row (idempotent via the unique index on `stripe_session_id` + `onConflictDoNothing`), marks artworks `SOLD`, and emails the owner via `sendOrderNotification()` from `src/lib/email.ts` (Resend REST API over plain `fetch`, no SDK; skipped with a warning when `RESEND_API_KEY` is unset, and it never throws — an email failure must not 500 the webhook). `checkout.session.expired` is a no-op until stock holds exist.

### i18n details

- `src/i18n/config.ts` defines `locales`, RTL set (`ar`), and `getDir()`. Use `Locale` type everywhere, not `string`.
- `src/i18n/routing.ts` exports the typed `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `createNavigation(routing)` — **use these instead of `next/link` / `next/navigation` for locale-aware URLs.**
- Messages live in `src/i18n/messages/{en,ru,ar}.json`. When you add a translation key, add it to **all three** files.
- The public root layout (`(public)/layout.tsx`) sets `<html lang dir>` from `x-pathname` and loads Arabic web fonts only for `ar` — keep this logic in mind when changing the layout.

### Conventions

- Path alias: `@/*` → `src/*`.
- TypeScript is `strict`. Use the `Artwork` / `CartLine` types from `src/lib/types.ts` (the runtime/DB-agnostic shape), not the Drizzle inferred types, on the public side. `rowToArtwork()` in `src/lib/artworks.ts` is the boundary converter.
- Money is integer **cents** (`priceCents`, `subtotalCents`, …); format via helpers in `src/lib/format.ts`.
- IDs are generated by `createId()` in `src/lib/id.ts` via Drizzle's `$defaultFn`.
- Tailwind uses a custom palette (`bone`, `ink`, `muted`, `accent`, `line`) and serif/sans/arabic font stacks defined in `tailwind.config.ts`.

### Env vars

`.env.example` lists everything. Notable: the app boots without `DATABASE_URL`, `STRIPE_*`, or `R2_*` — features degrade rather than crash. `ADMIN_PASSWORD` gates `/admin`; the cookie is the plain string `admin_session=ok` (MVP-grade auth, not for production secrets).
