//
// Admin authentication logic:
// - In development (NODE_ENV=development): No authentication required for /admin/* or /api/admin/*
// - In production: Requires SESSION_COOKIE=ok, otherwise redirects to /admin/login or returns 401 for API
//
// To test admin locally, just visit /admin/login and proceed. In production, login is required.
//
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/auth/session";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};

export function middleware(req: NextRequest) {
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

  // Require SESSION_COOKIE=ok in production
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookie !== "ok") {
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

