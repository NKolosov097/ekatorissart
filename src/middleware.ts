import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export const config = {
  // Skip /api (route handlers manage themselves) and Next.js internals.
  matcher: ["/((?!api|_next|_vercel|favicon\\.ico|.*\\..*).*)"],
};

function withPath(req: NextRequest, res: NextResponse): NextResponse {
  res.headers.set("x-pathname", req.nextUrl.pathname);
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Admin: auth gate, no locale routing ---
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return withPath(req, NextResponse.next());
    }
    const authed = req.cookies.get("admin_session")?.value === "ok";
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return withPath(req, NextResponse.next());
  }

  // --- Public site: hand off to next-intl for locale negotiation, then attach pathname ---
  const intlResponse = intlMiddleware(req);
  return withPath(req, intlResponse);
}
