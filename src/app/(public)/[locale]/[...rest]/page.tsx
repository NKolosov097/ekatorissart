import { notFound } from "next/navigation";

// Catch-all for URLs no other route matches. Without it, unmatched paths
// bypass [locale]/not-found.tsx and render Next's default unstyled 404 —
// not-found.tsx alone only handles explicit notFound() calls.

// notFound() must also fire here: metadata resolves before the response
// starts streaming, which is what makes the HTTP status a real 404 (the
// [locale]/loading.tsx Suspense boundary would otherwise flush a 200 shell
// before the page component runs).
export function generateMetadata(): never {
  notFound();
}

export default function CatchAllPage(): never {
  notFound();
}
