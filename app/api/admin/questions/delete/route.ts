import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

function sectionFile(section: string) {
  return path.join(process.cwd(), "public", "quiz-data", "sections", `${section}.json`);
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null) as { section: string; id: string } | null;
  if (!body?.section || !body?.id) return NextResponse.json({ error: "Bad body" }, { status: 400 });

  const file = sectionFile(body.section);
  if (!fs.existsSync(file)) return NextResponse.json({ error: "Section not found" }, { status: 404 });

  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  const before = data.items?.length ?? 0;
  data.items = (data.items || []).filter((x: any) => x.id !== body.id);
  const after = data.items.length;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true, removed: before - after });
}

