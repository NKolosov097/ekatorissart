import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "admin_not_configured", message: "Set ADMIN_PASSWORD in .env." },
      { status: 503 },
    );
  }
  const form = await req.formData();
  const provided = String(form.get("password") ?? "");
  if (provided !== expected) {
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), 303);
  }
  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  res.cookies.set("admin_session", "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
