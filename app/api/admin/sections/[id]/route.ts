import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SectionFileSchema } from "@/lib/validators/section";
export const runtime = "nodejs";

function filePathFor(id: string) {
  return path.join(process.cwd(), "public", "quiz-data", "sections", `${id}.json`);
}

export async function GET(_: Request, { params }: any) {
  const file = filePathFor(params.id);
  if (!fs.existsSync(file)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(JSON.parse(fs.readFileSync(file, "utf-8")));
}

export async function POST(req: Request, { params }: any) {
  const payload = await req.json().catch(() => null);
  const parsed = SectionFileSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid schema", details: parsed.error.flatten() }, { status: 400 });
  }
  const file = filePathFor(params.id);
  fs.writeFileSync(file, JSON.stringify(parsed.data, null, 2));
  return NextResponse.json({ ok: true });
}
