import Link from "next/link";
import { listArtworks } from "@/lib/artworks";
import { isDatabaseConfigured } from "@/db";

export default async function AdminHome() {
  const artworks = await listArtworks();
  const available = artworks.filter((a) => a.status === "AVAILABLE").length;
  const originals = artworks.filter((a) => a.kind === "ORIGINAL").length;
  const prints = artworks.filter((a) => a.kind === "PRINT").length;
  const sold = artworks.filter((a) => a.status === "SOLD").length;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Studio overview</h1>
      <p className="text-sm text-muted mb-10">
        Source:{" "}
        <span className={isDatabaseConfigured() ? "text-ink" : "text-accent"}>
          {isDatabaseConfigured() ? "Database" : "Sample data (set DATABASE_URL to switch)"}
        </span>
      </p>

      <div className="grid gap-6 md:grid-cols-4 mb-12">
        <Stat label="Available" value={available} />
        <Stat label="Sold" value={sold} />
        <Stat label="Originals" value={originals} />
        <Stat label="Prints" value={prints} />
      </div>

      <div className="flex gap-4">
        <Link href="/admin/artworks/new" className="btn-primary">
          Add new artwork
        </Link>
        <Link href="/admin/artworks" className="btn-outline">
          Manage all artworks
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line p-6">
      <div className="eyebrow">{label}</div>
      <div className="mt-3 font-serif text-4xl">{value}</div>
    </div>
  );
}
