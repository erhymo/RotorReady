//
// Admin authentication logic:
// - In development (NODE_ENV=development): No authentication required for /admin/* or /api/admin/*
// - In production: Requires signed HttpOnly cookie rr_session; legacy fallback accepts value "ok" if no secret configured
//
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/auth/session";
import { verifyAdminToken } from "./lib/auth/token-verify-edge";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow auth endpoints and the login page
  if (pathname.startsWith("/api/auth/") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Only guard admin pages and admin API
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // Disable authentication in development for stability
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;

  let ok = false;
  if (secret && token) {
    const v = await verifyAdminToken(token, secret);
    ok = v.valid;
  } else if (token === "ok") {
    // Legacy fallback when secret not set (prevents lockout)
    ok = true;
  }

  if (!ok) {
    if (isAdminApi) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

