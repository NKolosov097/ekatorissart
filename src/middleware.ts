import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { locales, LOCALE_CHOICE_COOKIE, type Locale } from "@/i18n/config";

const intlMiddleware = createIntlMiddleware(routing);

function getExplicitLocale(req: NextRequest): Locale | undefined {
  const value = req.cookies.get(LOCALE_CHOICE_COOKIE)?.value;
  return locales.find((l) => l === value);
}

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
  // The browser's Accept-Language must win on every visit (default: en) unless
  // the user explicitly picked a locale via the switcher. next-intl persists
  // even the *auto-detected* locale in NEXT_LOCALE for a year, which would
  // freeze the first detection — so NEXT_LOCALE is only honored (and kept)
  // when it mirrors the explicit locale_choice cookie.
  const choice = getExplicitLocale(req);
  const hadStaleCookie = !choice && req.cookies.has("NEXT_LOCALE");
  if (choice) {
    req.cookies.set("NEXT_LOCALE", choice);
  } else {
    req.cookies.delete("NEXT_LOCALE");
  }

  const intlResponse = intlMiddleware(req);

  if (!choice) {
    // Drop next-intl's attempt to persist the auto-detected locale…
    intlResponse.headers.delete("set-cookie");
    // …and expire a leftover NEXT_LOCALE from before this scheme existed.
    if (hadStaleCookie) {
      intlResponse.cookies.delete("NEXT_LOCALE");
    }
  }
  return withPath(req, intlResponse);
}
