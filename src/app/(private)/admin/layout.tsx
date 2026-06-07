// Nested admin layout — chrome around dashboard pages.
// Auth is enforced in src/middleware.ts; the login page renders without chrome.

import Link from "next/link";
import { headers } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-bone">
      <div className="border-b border-line">
        <div className="container-wide flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-serif text-xl">
              Studio
            </Link>
            <nav className="hidden md:flex gap-6 text-xs uppercase tracking-widest">
              <Link href="/admin/artworks" className="hover:text-accent">Artworks</Link>
              <Link href="/admin/orders" className="hover:text-accent">Orders</Link>
            </nav>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="text-xs uppercase tracking-widest text-muted hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <div className="container-wide py-10">{children}</div>
    </div>
  );
}
