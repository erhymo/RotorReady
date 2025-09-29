import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

const FILE = path.join(process.cwd(), "public", "quiz-data", "flags.json");

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
  const payload = await req.json().catch(()=>null) as Partial<Flag> | null;
  if (!payload || !payload.section || !payload.questionId) {
    return NextResponse.json({ error: "Missing section or questionId" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const id = `${payload.section}:${payload.questionId}:${Date.now()}`;
  let arr: Flag[] = [];
  if (fs.existsSync(FILE)) {
    try { arr = JSON.parse(fs.readFileSync(FILE, "utf-8")).flags ?? []; } catch {}
  }
  const flag: Flag = {
    id,
    section: payload.section,
    sectionId: payload.sectionId,
    questionId: payload.questionId,
    dataSource: payload.dataSource || "sections",
    dataFile: payload.dataFile ?? null,
    snapshot: payload.snapshot,
    reason: (payload.reason || "").slice(0, 400),
    userId: (payload.userId || "guest"),
    createdAt: now,
    status: "open",
  };
  const out = { flags: [flag, ...arr] };
  fs.writeFileSync(FILE, JSON.stringify(out, null, 2));
  return NextResponse.json({ ok: true, id });
}
