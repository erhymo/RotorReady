import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { signAdminToken, SESSION_TTL_SECONDS } from "@/lib/auth/token-sign-node";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { username?: string; password?: string } | null;
  if (!body?.username || !body?.password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

	  const isProd = process.env.NODE_ENV === "production";

	  let username = process.env.ADMIN_USERNAME;
	  let password = process.env.ADMIN_PASSWORD;
	  if (!username || !password) {
	    if (isProd) {
	      return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 });
	    }
	    // Non-production only: fall back to default dev credentials to avoid local lockout.
	    username = username || "admin";
	    password = password || "rotorready2025";
	  }

	  if (body.username !== username || body.password !== password) {
	    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	  }

	  const secret = process.env.ADMIN_SESSION_SECRET;
	  if (!secret) {
	    if (isProd) {
	      return NextResponse.json({ error: "Admin session secret not configured" }, { status: 500 });
	    }
	    // Non-production: allow a legacy unsigned session cookie for convenience.
	    const headers = new Headers();
	    const secure = isProd ? "Secure; " : "";
	    headers.set("Set-Cookie", `${SESSION_COOKIE}=ok; Path=/; HttpOnly; SameSite=Strict; ${secure}Max-Age=${SESSION_TTL_SECONDS}`);
	    return new NextResponse(JSON.stringify({ ok: true, mode: "legacy-dev" }), { status: 200, headers });
	  }

	  const now = Math.floor(Date.now() / 1000);
	  const token = await signAdminToken({ sub: "admin", iat: now, exp: now + SESSION_TTL_SECONDS }, secret);
	  const headers = new Headers();
	  const secure = isProd ? "Secure; " : "";
	  headers.set("Set-Cookie", `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; ${secure}Max-Age=${SESSION_TTL_SECONDS}`);
	  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers });
}

