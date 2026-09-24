// The native app has no server of its own — it boots from the bundled shell in
// public-native/ (see capacitor.config.ts), so an /api/* path resolves against
// that bundle and 404s. Endpoints the app genuinely needs must therefore be
// called cross-origin at rotor-ready.com, and the browser inside the WebView
// enforces CORS on that.
//
// These are the WebView's own origins, not user-supplied ones. Note this adds
// no real attack surface: CORS is enforced by browsers only, and every route
// here is already reachable by any client that speaks HTTP. It exists to let
// the app's legitimate requests through, not to keep anything out — so the
// route's own validation stays the real protection.
const NATIVE_ORIGINS = new Set([
  "capacitor://localhost", // iOS
  "http://localhost",      // Android
  "https://localhost",
]);

export function nativeCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  if (!origin || !NATIVE_ORIGINS.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

// Answers the preflight the browser sends before a JSON POST.
export function handleNativeCorsPreflight(req: Request): Response {
  return new Response(null, { status: 204, headers: nativeCorsHeaders(req) });
}
