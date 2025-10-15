import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { signAdminToken, SESSION_TTL_SECONDS } from "@/lib/auth/token-sign-node";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { username?: string; password?: string } | null;
  if (!body?.username || !body?.password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const username = process.env.ADMIN_USERNAME || process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (!username || !password) {
    return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 });
  }

  if (body.username !== username || body.password !== password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Fallback to legacy cookie value if secret missing (to avoid lockout)
    const headers = new Headers();
    const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
    headers.set("Set-Cookie", `${SESSION_COOKIE}=ok; Path=/; HttpOnly; SameSite=Strict; ${secure}Max-Age=${SESSION_TTL_SECONDS}`);
    return new NextResponse(JSON.stringify({ ok: true, mode: "legacy" }), { status: 200, headers });
  }

  const now = Math.floor(Date.now() / 1000);
  const token = await signAdminToken({ sub: "admin", iat: now, exp: now + SESSION_TTL_SECONDS }, secret);
  const headers = new Headers();
  const secure = process.env.NODE_ENV === "production" ? "Secure; " : "";
  headers.set("Set-Cookie", `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; ${secure}Max-Age=${SESSION_TTL_SECONDS}`);
  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers });
}

