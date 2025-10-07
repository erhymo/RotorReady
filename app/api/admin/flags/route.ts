import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

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
  const store = readStore();
  return NextResponse.json({ flags: store.flags });
}

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Bad body" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const store = readStore();
  const flag = {
    id,
    status: "open",
    createdAt: now,
    ...payload,
  };
  ensureDir();
  const next = { flags: [...store.flags, flag] };
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2));
  return NextResponse.json({ ok: true, flag });
}
