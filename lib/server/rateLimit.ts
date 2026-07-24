import { NextResponse } from "next/server";

// Simple in-memory, per-IP fixed-window rate limiter for public API routes.
//
// This is intentionally lightweight (no Redis/KV dependency): on serverless
// platforms each warm lambda instance keeps its own bucket map, so this does
// NOT enforce a hard global limit across all instances. It still meaningfully
// blocks the common case — a single client (script, bot, runaway retry loop)
// hammering an endpoint from one connection — which is what actually burns
// through paid upstream API quotas (CheckWX) or gets our IP blocked by
// scraped sources (Avinor AIP).
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanupExpired(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function checkRateLimit(
  req: Request,
  opts: { bucket: string; limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const key = `${opts.bucket}:${getClientIp(req)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= opts.limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
