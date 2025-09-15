import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

const FILE = path.join(process.cwd(), "public", "quiz-data", "flags.json");

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null) as { id: string; status: "reviewed-OK"|"rejected" } | null;
  if (!body?.id || !body?.status) return NextResponse.json({ error: "Bad body" }, { status: 400 });
  let store = { flags: [] as any[] };
  if (fs.existsSync(FILE)) store = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  store.flags = (store.flags || []).map((f: any) => f.id === body.id ? { ...f, status: body.status } : f);
  fs.writeFileSync(FILE, JSON.stringify(store, null, 2));
  return NextResponse.json({ ok: true });
}

