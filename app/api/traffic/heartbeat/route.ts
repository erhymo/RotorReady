import { NextResponse } from "next/server";

import { isProduction } from "@/lib/env";
import { adminDb, isFirebaseAdminUnavailableError } from "@/lib/firebase/admin";

export const runtime = "nodejs";

const EVENT_COOLDOWN_MS = 30 * 60 * 1000;

function sanitizeVisitorId(value: unknown) {
  const clean = typeof value === "string" ? value.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80) : "";
  return clean || null;
}

function sanitizeText(value: unknown, max = 240) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function toDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value?.toDate === "function") return value.toDate();
  return null;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    visitorId?: string;
    path?: string;
    source?: string;
  } | null;

  const visitorId = sanitizeVisitorId(body?.visitorId);
  if (!visitorId) {
    return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const visitorRef = adminDb.collection("trafficVisitors").doc(visitorId);

  try {
    let recordedOpen = false;
    await adminDb.runTransaction(async (tx: any) => {
      const snap = await tx.get(visitorRef);
      const previousLastOpen = snap.exists ? toDate(snap.get("lastOpenAt")) : null;
      const shouldRecordOpen = !previousLastOpen || now.getTime() - previousLastOpen.getTime() >= EVENT_COOLDOWN_MS;

      tx.set(
        visitorRef,
        {
          firstSeenAt: snap.exists ? snap.get("firstSeenAt") || nowIso : nowIso,
          lastSeenAt: nowIso,
          updatedAt: nowIso,
          path: sanitizeText(body?.path),
          source: sanitizeText(body?.source || "web"),
          ...(shouldRecordOpen ? { lastOpenAt: nowIso, openCount: (Number(snap.get("openCount")) || 0) + 1 } : {}),
        },
        { merge: true },
      );

      if (shouldRecordOpen) {
        const eventRef = adminDb.collection("trafficEvents").doc();
        tx.set(eventRef, {
          visitorId,
          createdAt: nowIso,
          dayKey: nowIso.slice(0, 10),
          path: sanitizeText(body?.path),
          source: sanitizeText(body?.source || "web"),
        });
        recordedOpen = true;
      }
    });

    return NextResponse.json({ ok: true, recordedOpen });
  } catch (error: any) {
    console.error("Failed to record traffic heartbeat", error);
    if (isFirebaseAdminUnavailableError(error) && !isProduction) {
      return NextResponse.json({ ok: true, devWarning: "Traffic heartbeat ignored in dev without Firebase Admin." });
    }
    return NextResponse.json({ error: error?.message || "Could not record traffic" }, { status: 500 });
  }
}