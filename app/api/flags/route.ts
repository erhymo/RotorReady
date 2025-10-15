import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

const FILE = path.join(process.cwd(), "public", "quiz-data", "flags.json");

function ensureDir() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

type Flag = {
  id: string;
  section: string;
  sectionId?: string;
  questionId: string;
  dataSource?: "sections" | "all-questions";
  dataFile?: string | null;
  snapshot?: {
    question?: string;
    options?: string[];
    explanation?: string;
    references?: string[];
    answer?: number[];
  };
  reason?: string;
  userId: string; // 'guest' eller faktisk id senere
  createdAt: string;
  status: "open"|"reviewed-OK"|"rejected";
};

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null) as Partial<Flag> | null;
  if (!payload || typeof payload !== 'object' || !payload.section || !payload.questionId) {
    return NextResponse.json({ error: 'Missing section or questionId' }, { status: 400 });
  }

  // Try persistent Firestore write first (same as admin endpoint)
  try {
    const { addFlag } = await import('@/lib/server/flags/firestoreFlagsStore');
    const saved = await addFlag(payload as any);
    return NextResponse.json({ ok: true, id: saved.id, flag: saved });
  } catch (err) {
    // Fallback: local file append (dev only)
    try {
      const now = new Date().toISOString();
      const id = `${payload.section}:${payload.questionId}:${Date.now()}`;
      let arr: any[] = [];
      if (fs.existsSync(FILE)) {
        try { arr = JSON.parse(fs.readFileSync(FILE, 'utf-8')).flags ?? []; } catch {}
      }
      const flag = {
        id,
        status: 'open',
        createdAt: now,
        ...payload,
      };
      const out = { flags: [flag, ...arr] };
      ensureDir();
      fs.writeFileSync(FILE, JSON.stringify(out, null, 2));
      return NextResponse.json({ ok: true, id, flag, devWarning: 'Persisted to local file fallback (dev only)' });
    } catch (e) {
      return NextResponse.json({ error: 'Failed to persist flag' }, { status: 500 });
    }
  }
}
