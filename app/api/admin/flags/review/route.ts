import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

import { updateFlagStatus } from "@/lib/server/flags/firestoreFlagsStore";

const FILE = path.join(process.cwd(), "public", "quiz-data", "flags.json");

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null) as { id: string; status: "reviewed-OK"|"rejected" } | null;
  if (!body?.id || !body?.status) return NextResponse.json({ error: "Bad body" }, { status: 400 });

  // Try Firestore first
  try {
    await updateFlagStatus(body.id, body.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Fallback to file for local/dev
    try {
      let store = { flags: [] as any[] };
      if (fs.existsSync(FILE)) store = JSON.parse(fs.readFileSync(FILE, "utf-8"));
      store.flags = (store.flags || []).map((f: any) => f.id === body.id ? { ...f, status: body.status } : f);
      fs.writeFileSync(FILE, JSON.stringify(store, null, 2));
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ error: "Failed to update flag status" }, { status: 500 });
    }
  }
}
