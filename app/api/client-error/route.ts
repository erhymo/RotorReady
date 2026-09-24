import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { isProduction } from "@/lib/env";
import { adminDb, isFirebaseAdminUnavailableError } from "@/lib/firebase/admin";
import { handleNativeCorsPreflight, withNativeCors } from "@/lib/server/nativeCors";
import { checkRateLimit, rateLimitResponse } from "@/lib/server/rateLimit";

export const runtime = "nodejs";

// Receives crash reports from lib/clientErrors.ts, on the web and in the
// native app. Reports are grouped: one Firestore document per distinct error
// (same kind, message and top stack frame), with a count and the most recent
// sample, so a crash that hits every user shows up as one line with a big
// number rather than burying everything else.

const COLLECTION = "clientErrors";
const MAX_BODY_BYTES = 16 * 1024;
const KINDS = new Set(["error", "unhandledrejection", "boundary"]);
const PLATFORMS = new Set(["web", "ios", "android"]);

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function postHandler(req: Request) {
  const limit = checkRateLimit(req, { bucket: "client-error", limit: 30, windowMs: 10 * 60_000 });
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);

  const raw = await req.text().catch(() => "");
  if (!raw || raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Invalid report" }, { status: 400 });
  }
  let body: Record<string, unknown> | null = null;
  try {
    body = JSON.parse(raw);
  } catch {}
  const message = text(body?.message, 500);
  if (!body || !message) {
    return NextResponse.json({ error: "Invalid report" }, { status: 400 });
  }

  const kind = KINDS.has(String(body.kind)) ? String(body.kind) : "error";
  const platform = PLATFORMS.has(String(body.platform)) ? String(body.platform) : "web";
  const stack = text(body.stack, 4000);
  const topFrame = stack.split("\n").find((line) => /\bat\b|@/.test(line))?.trim() || "";
  const id = createHash("sha1").update(`${kind}|${message}|${topFrame}`).digest("hex").slice(0, 32);

  const nowIso = new Date().toISOString();
  const sample = {
    stack,
    path: text(body.path, 200),
    platform,
    appVersion: text(body.appVersion, 40),
    digest: text(body.digest, 80),
    userAgent: text(req.headers.get("user-agent"), 300),
    at: nowIso,
  };

  try {
    const ref = adminDb.collection(COLLECTION).doc(id);
    await adminDb.runTransaction(async (tx: any) => {
      const snap = await tx.get(ref);
      const platforms: string[] = snap.exists && Array.isArray(snap.get("platforms")) ? snap.get("platforms") : [];
      tx.set(ref, {
        kind,
        message,
        count: (Number(snap.exists ? snap.get("count") : 0) || 0) + 1,
        firstSeenAt: (snap.exists && snap.get("firstSeenAt")) || nowIso,
        lastSeenAt: nowIso,
        platforms: platforms.includes(platform) ? platforms : [...platforms, platform],
        last: sample,
      });
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Failed to record client error", error);
    if (isFirebaseAdminUnavailableError(error) && !isProduction) {
      return NextResponse.json({ ok: true, devWarning: "Client error ignored in dev without Firebase Admin." });
    }
    return NextResponse.json({ error: "Could not record error" }, { status: 500 });
  }
}

export const POST = withNativeCors(postHandler);
export const OPTIONS = handleNativeCorsPreflight;
