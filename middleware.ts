//
// Admin authentication logic:
// - In development (NODE_ENV=development): No authentication required for /admin/* or /api/admin/*
// - In production: Requires signed HttpOnly cookie rr_session; legacy "ok" value is no longer accepted
//
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "./lib/auth/session";
import { verifyAdminToken } from "./lib/auth/token-verify-edge";

export const config = {
  matcher: ["/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow PWA service worker and related assets on all hosts without
  // canonical-domain redirect. Service workers must be served directly
  // from the origin without a cross-origin redirect, otherwise browsers
  // will refuse to register them and offline mode will not work.
  if (
    pathname === "/sw.js" ||
    pathname.startsWith("/workbox-") ||
    pathname.startsWith("/fallback-")
  ) {
    return NextResponse.next();
  }

  const isDevOnlyRoute =
    pathname.startsWith("/dev") ||
    pathname.startsWith("/api/dev") ||
    pathname === "/env-dump" ||
    pathname === "/env-test" ||
    pathname === "/firebase-check";
  if (isDevOnlyRoute && process.env.NODE_ENV !== "development") {
    if (pathname.startsWith("/api/")) {
      return new NextResponse(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }
    return new NextResponse(null, { status: 404 });
  }

  // Canonical domain redirect (production only)
  try {
    const host = req.headers.get("host") || "";
    if (process.env.VERCEL_ENV === "production") {
      const CANON = "rotor-ready.com";
      const redirectHosts = new Set([
        "rotorready.vercel.app",
        "www.rotorready.com",
        "rotorready.com",
        "www.rotor-ready.com",
      ]);
      if (redirectHosts.has(host)) {
        const url = req.nextUrl.clone();
        url.host = CANON;
        url.protocol = "https";
        return NextResponse.redirect(url, 308);
      }
    }
  } catch {}

  // Always allow auth endpoints and the login page
  if (pathname.startsWith("/api/auth/") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Only guard admin pages and admin API
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  // E2E runs use a local production server for stability. Allow admin probes there,
  // but never bypass auth on Vercel production if the env var is accidentally set.
  if (process.env.E2E_BYPASS_ADMIN_AUTH === "1" && process.env.VERCEL_ENV !== "production") {
    return NextResponse.next();
  }

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

