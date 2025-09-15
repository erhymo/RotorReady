import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SectionFileSchema } from "@/lib/validators/section";
export const runtime = "nodejs";

const GEN_FILE = path.join(process.cwd(), "public", "quiz-data", "generated", "qrh_batch.json");
const DEST_FILE = path.join(process.cwd(), "public", "quiz-data", "sections", "qrh.json");

function readGen() {
  if (!fs.existsSync(GEN_FILE)) return { items: [] };
  try { return JSON.parse(fs.readFileSync(GEN_FILE, "utf-8")); } catch { return { items: [] }; }
}
function readDest() {
  if (!fs.existsSync(DEST_FILE)) return { items: [] };
  try { return JSON.parse(fs.readFileSync(DEST_FILE, "utf-8")); } catch { return { items: [] }; }
}

export async function GET() {
  return NextResponse.json(readGen());
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null) as { action: "approve"|"reject"; id: string } | null;
  if (!body?.action || !body?.id) return NextResponse.json({ error: "Bad body" }, { status: 400 });

  const gen = readGen();
  const idx = gen.items.findIndex((x: any) => x.id === body.id);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const item = gen.items[idx];

  if (body.action === "approve") {
    const dest = readDest();
    dest.items = [item, ...(dest.items||[])];
    const parsed = SectionFileSchema.safeParse(dest);
    if (!parsed.success) return NextResponse.json({ error: "Dest schema error", details: parsed.error.flatten() }, { status: 500 });
    fs.writeFileSync(DEST_FILE, JSON.stringify(parsed.data, null, 2));
    // remove from generated
    gen.items.splice(idx, 1);
    fs.writeFileSync(GEN_FILE, JSON.stringify(gen, null, 2));
    return NextResponse.json({ ok: true, moved: item.id });
  } else {
    // reject: hard delete from generated
    gen.items.splice(idx, 1);
    fs.writeFileSync(GEN_FILE, JSON.stringify(gen, null, 2));
    return NextResponse.json({ ok: true, removed: body.id });
  }
}
