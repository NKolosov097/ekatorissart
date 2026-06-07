import "dotenv/config";
import { getDb, schema } from "../src/db";

async function main(): Promise<void> {
  const db = getDb();
  const orders = await db.select().from(schema.orders);
  const items = await db.select().from(schema.orderItems);
  console.log("Orders:");
  console.table(
    orders.map((o) => ({
      id: o.id,
      email: o.email,
      status: o.status,
      total: o.totalCents,
      stripe: o.stripeSessionId,
      name: o.shippingName,
      city: o.shippingCity,
      country: o.shippingCountry,
    })),
  );
  console.log("\nOrder items:");
  console.table(items);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
