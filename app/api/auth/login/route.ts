
import { NextResponse } from "next/server";
// Ikke bruk cookies() direkte, sett cookie på responsen
import { makeCookie } from "@/lib/auth/session";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { username, password } = body as { username?: string; password?: string };
  if (username === "admin" && password === "rotorready2025") {
    const res = NextResponse.json({ ok: true });
    const cookie = [
      `rr_session=ok`,
      `Path=/`,
      `HttpOnly`,
      `SameSite=Lax`,
      `Max-Age=${60 * 60 * 8}`,
      process.env.NODE_ENV === "production" ? `Secure` : null
    ].filter(Boolean).join('; ');
    res.headers.append("Set-Cookie", cookie);
    return res;
  }
  return NextResponse.json({ ok: false, error: "Bad credentials" }, { status: 401 });
}

