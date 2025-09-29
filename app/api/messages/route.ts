import { NextResponse } from "next/server";

import {
  getConversation,
  markRead,
  upsertUserMessage,
} from "@/lib/server/messagesStore";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("uid");
  if (!userId) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }
  const conversation = markRead({ userId, target: "user" }) || getConversation(userId);
  return NextResponse.json({ conversation: conversation || null });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as {
    uid?: string;
    email?: string | null;
    message?: string;
  } | null;
  if (!body?.uid || !body?.message) {
    return NextResponse.json({ error: "Missing uid or message" }, { status: 400 });
  }
  const trimmed = body.message.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }
  const conversation = upsertUserMessage({
    userId: body.uid,
    userEmail: body.email,
    body: trimmed,
  });
  return NextResponse.json({ conversation });
}
