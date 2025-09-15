import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const runtime = "nodejs";

const FILE = path.join(process.cwd(), "public", "quiz-data", "messages.json");

export async function GET(req: Request) {
  // Midlertidig: fjern autentisering for lokal testing
  if (!fs.existsSync(FILE)) return NextResponse.json({ messages: [] });
  return NextResponse.json(JSON.parse(fs.readFileSync(FILE, "utf-8")));
}

export async function POST(req: Request) {
  // Midlertidig: fjern autentisering for lokal testing
  const body = await req.json().catch(() => ({}));
  fs.writeFileSync(FILE, JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}

