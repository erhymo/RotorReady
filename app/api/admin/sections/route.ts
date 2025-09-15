import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

export async function GET(req: Request) {
  // Midlertidig: fjern autentisering for lokal testing
  const file = path.join(process.cwd(), "public", "quiz-data", "index.json");
  if (!fs.existsSync(file)) return NextResponse.json({ sections: [] });
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  return NextResponse.json(data);
}

