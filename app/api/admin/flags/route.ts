import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isProduction } from "@/lib/env";
export const runtime = "nodejs";

// Firestore-based store (production/persistent)
import { addFlag, listFlags } from "@/lib/server/flags/firestoreFlagsStore";

// File-based fallback (local dev without Firestore)
const FILE = path.join(process.cwd(), "public", "quiz-data", "flags.json");

function ensureDir() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readStore(): { flags: any[] } {
  try {
    if (!fs.existsSync(FILE)) return { flags: [] };
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    if (Array.isArray(parsed)) return { flags: parsed }; // backward compatibility
    if (parsed && Array.isArray(parsed.flags)) return { flags: parsed.flags };
    return { flags: [] };
  } catch {
    return { flags: [] };
  }
}

export async function GET() {
  // Try Firestore first
  try {
    const flags = await listFlags();
    // Dedupe: some clients may have produced duplicates when both client-Firestore and API were used
    const seen = new Set<string>();
    const deduped = flags.filter((f: any) => {
      const key = [f.questionId || "", f.section || "", f.userId || "", f.createdAt || ""].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return NextResponse.json({ flags: deduped });
  } catch (err) {
    // In production, surface a clear warning so the UI can indicate misconfiguration
    if (isProduction) {
      return NextResponse.json({ flags: [], error: "Firestore admin not configured or unreachable; returning empty list." }, { status: 200 });
    }
    // Fallback for local/dev
    const store = readStore();
    return NextResponse.json({ flags: store.flags, devWarning: "Using local file fallback for flags" });
  }
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }

  // Try persistent Firestore write first
  try {
    const saved = await addFlag(payload);
    return NextResponse.json({ ok: true, flag: saved });
  } catch (err) {
    // In production, do not silently fall back; indicate misconfiguration
    if (isProduction) {
      return NextResponse.json({ error: "Firestore admin not configured; cannot persist flag in production." }, { status: 500 });
    }
    // Fallback: local file append (dev only)
    try {
      const now = new Date().toISOString();
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      const store = readStore();
      const flag = { id, status: "open", createdAt: now, ...payload };
      ensureDir();
      const next = { flags: [...store.flags, flag] };
      fs.writeFileSync(FILE, JSON.stringify(next, null, 2));
      return NextResponse.json({ ok: true, flag, devWarning: "Persisted to local file fallback (dev only)" });
    } catch (e) {
      return NextResponse.json({ error: "Failed to persist flag" }, { status: 500 });
    }
  }
}
