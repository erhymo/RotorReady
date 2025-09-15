import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SectionFileSchema } from "@/lib/validators/section";
export const runtime = "nodejs";

const SEC_FILE = path.join(process.cwd(), "public", "quiz-data", "sections", "qrh.json");
const VER_FILE = path.join(process.cwd(), "public", "quiz-data", "versions", "data-version.json");

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null) as { version?: string; section?: unknown } | null;
  if (!body?.version || !body.section) return NextResponse.json({ error: "version og section kreves" }, { status: 400 });
  const parsed = SectionFileSchema.safeParse(body.section);
  if (!parsed.success) return NextResponse.json({ error: "Ugyldig section schema", details: parsed.error.flatten() }, { status: 400 });

  const incoming = parsed.data;
  const current = fs.existsSync(SEC_FILE) ? JSON.parse(fs.readFileSync(SEC_FILE, "utf-8")) : { items: [] };
  const curMap = new Map((current.items||[]).map((i:any)=>[i.id,i]));
  const nextMap = new Map((incoming.items||[]).map((i:any)=>[i.id,i]));

  let add = 0, remove = 0, update = 0;
  (incoming.items||[]).forEach((n:any) => {
    const c = curMap.get(n.id);
    if (!c) add++; else if (JSON.stringify(c) !== JSON.stringify(n)) update++;
  });
  (current.items||[]).forEach((c:any) => { if (!nextMap.has(c.id)) remove++; });

  fs.writeFileSync(SEC_FILE, JSON.stringify(incoming, null, 2));

  const ver = fs.existsSync(VER_FILE) ? JSON.parse(fs.readFileSync(VER_FILE, "utf-8")) : {};
  ver.qrhVersion = body.version;
  ver.changelog = Array.isArray(ver.changelog) ? [`QRH oppdatert til ${body.version} (+${add}/-${remove}/~${update})`, ...ver.changelog] : [`QRH oppdatert til ${body.version} (+${add}/-${remove}/~${update})`];
  ver.version = new Date().toISOString();
  fs.writeFileSync(VER_FILE, JSON.stringify(ver, null, 2));

  return NextResponse.json({ ok: true, summary: `QRH=${body.version} (+${add}/-${remove}/~${update})` });
}

