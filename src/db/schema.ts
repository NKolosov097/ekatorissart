import {
  pgTable,
  pgEnum,
  text,
  integer,
  real,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createId } from "@/lib/id";

export const artworkStatus = pgEnum("artwork_status", [
  "AVAILABLE",
  "SOLD",
]);

export const artworkKind = pgEnum("artwork_kind", [
  "ORIGINAL",
  "PRINT",
]);

export const medium = pgEnum("medium", [
  "OIL",
  "ACRYLIC",
  "WATERCOLOR",
  "GOUACHE",
  "PASTEL",
  "MIXED",
]);

export const orderStatus = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export const artworks = pgTable(
  "artworks",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    year: integer("year").notNull(),
    medium: medium("medium").notNull(),
    surface: text("surface").notNull(),
    widthCm: real("width_cm").notNull(),
    heightCm: real("height_cm").notNull(),
    priceCents: integer("price_cents").notNull(),
    currency: text("currency").notNull().default("USD"),
    status: artworkStatus("status").notNull().default("AVAILABLE"),
    kind: artworkKind("kind").notNull().default("ORIGINAL"),
    description: text("description"),
    story: text("story"),
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    primaryImage: text("primary_image").notNull(),
    images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
    weightKg: real("weight_kg"),
    framed: boolean("framed").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    slugUnique: uniqueIndex("artworks_slug_unique").on(t.slug),
    statusPublishedIdx: index("artworks_status_published_idx").on(
      t.status,
      t.publishedAt,
    ),
    featuredIdx: index("artworks_featured_idx").on(t.featured),
    kindStatusIdx: index("artworks_kind_status_idx").on(t.kind, t.status),
  }),
);

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    email: text("email").notNull(),
    status: orderStatus("status").notNull().default("PENDING"),
    subtotalCents: integer("subtotal_cents").notNull(),
    shippingCents: integer("shipping_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    currency: text("currency").notNull().default("USD"),
    stripeSessionId: text("stripe_session_id"),
    stripePaymentId: text("stripe_payment_id"),
    shippingName: text("shipping_name"),
    shippingLine1: text("shipping_line1"),
    shippingLine2: text("shipping_line2"),
    shippingCity: text("shipping_city"),
    shippingRegion: text("shipping_region"),
    shippingPostal: text("shipping_postal"),
    shippingCountry: text("shipping_country"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    stripeSessionUnique: uniqueIndex("orders_stripe_session_unique").on(
      t.stripeSessionId,
    ),
    statusIdx: index("orders_status_idx").on(t.status),
    emailIdx: index("orders_email_idx").on(t.email),
  }),
);

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    artworkId: text("artwork_id")
      .notNull()
      .references(() => artworks.id),
    unitCents: integer("unit_cents").notNull(),
    titleSnapshot: text("title_snapshot").notNull(),
  },
  (t) => ({
    orderIdx: index("order_items_order_idx").on(t.orderId),
    artworkIdx: index("order_items_artwork_idx").on(t.artworkId),
  }),
);

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  artwork: one(artworks, {
    fields: [orderItems.artworkId],
    references: [artworks.id],
  }),
}));

export const artworksRelations = relations(artworks, ({ many }) => ({
  orderItems: many(orderItems),
}));

export type Artwork = typeof artworks.$inferSelect;
export type NewArtwork = typeof artworks.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
