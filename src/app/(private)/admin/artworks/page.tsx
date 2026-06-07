import Link from "next/link";
import Image from "next/image";
import { listArtworks } from "@/lib/artworks";
import { formatPrice } from "@/lib/format";

export default async function AdminArtworks() {
  const artworks = await listArtworks();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl">Artworks</h1>
        <Link href="/admin/artworks/new" className="btn-primary">
          New
        </Link>
      </div>

      <div className="border border-line">
        <table className="w-full text-sm">
          <thead className="bg-bone border-b border-line">
            <tr className="text-start text-xs uppercase tracking-widest text-muted">
              <th className="px-4 py-3 text-start">Image</th>
              <th className="px-4 py-3 text-start">Title</th>
              <th className="px-4 py-3 text-start">Size</th>
              <th className="px-4 py-3 text-start">Price</th>
              <th className="px-4 py-3 text-start">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((a) => (
              <tr key={a.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="relative w-14 h-16 overflow-hidden bg-line">
                    <Image src={a.primaryImage} alt={a.title} fill sizes="56px" className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3 font-serif">{a.title}</td>
                <td className="px-4 py-3 text-muted">{a.widthCm}×{a.heightCm} cm</td>
                <td className="px-4 py-3">{formatPrice(a.priceCents, a.currency)}</td>
                <td className="px-4 py-3 text-xs uppercase tracking-widest">
                  {a.status.toLowerCase()}
                </td>
                <td className="px-4 py-3 text-end">
                  <Link href={`/shop/${a.slug}`} className="text-xs uppercase tracking-widest link-quiet">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
