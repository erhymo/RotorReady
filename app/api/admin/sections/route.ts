import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

export async function GET(_req: Request) {
  const file = path.join(process.cwd(), "public", "quiz-data", "index.json");
  if (!fs.existsSync(file)) return NextResponse.json({ sections: [] });
  let data: any = { sections: [] };
  try {
    const raw = fs.readFileSync(file, "utf-8");
    data = JSON.parse(raw);
    if (!data || typeof data !== "object" || !Array.isArray((data as any).sections)) {
      data = { sections: [] };
    }
  } catch {
    data = { sections: [] };
  }
  return NextResponse.json(data);
}
