import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

function sectionFile(section: string) {
  return path.join(process.cwd(), "public", "quiz-data", "sections", `${section}.json`);
}

function allQuestionsDir() {
  return path.join(process.cwd(), "public", "quiz-data", "all-questions");
}

function removeFromMaster(id: string) {
  const masterFile = path.join(process.cwd(), "public", "quiz-data", "all-questions.json");
  if (!fs.existsSync(masterFile)) return 0;
  const master = JSON.parse(fs.readFileSync(masterFile, "utf-8"));
  if (!Array.isArray(master.questions)) return 0;
  const before = master.questions.length;
  master.questions = master.questions.filter((q: any) => q?.id !== id);
  if (master.questions.length === before) return 0;
  fs.writeFileSync(masterFile, JSON.stringify(master, null, 2));
  return before - master.questions.length;
}

function deleteFromAllQuestions(id: string, fileHint?: string | null) {
  const dir = allQuestionsDir();
  if (!fs.existsSync(dir)) return { removed: 0, filesUpdated: [] as string[] };

  const candidates = fileHint
    ? [fileHint]
    : fs.readdirSync(dir).filter((file) => file.endsWith(".json"));

  let removed = 0;
  const filesUpdated: string[] = [];

  for (const file of candidates) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!Array.isArray(data)) continue;
    const before = data.length;
    const filtered = data.filter((entry: any) => entry?.id !== id);
    if (filtered.length === before) continue;
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
    removed += before - filtered.length;
    filesUpdated.push(file);
  }

  removed += removeFromMaster(id);

  return { removed, filesUpdated };
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null) as { section: string; id: string; dataSource?: "sections" | "all-questions"; dataFile?: string | null } | null;
  if (!body?.section || !body?.id) return NextResponse.json({ error: "Bad body" }, { status: 400 });

  if (body.dataSource === "all-questions") {
    const { removed, filesUpdated } = deleteFromAllQuestions(body.id, body.dataFile || undefined);
    return NextResponse.json({ ok: true, removed, filesUpdated });
  }

  const file = sectionFile(body.section);
  if (!fs.existsSync(file)) return NextResponse.json({ error: "Section not found" }, { status: 404 });

  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  const before = data.items?.length ?? 0;
  data.items = (data.items || []).filter((x: any) => x.id !== body.id);
  const after = data.items.length;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true, removed: before - after, filesUpdated: [path.basename(file)] });
}
