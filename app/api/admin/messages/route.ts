import { NextResponse } from "next/server";

import {
  listConversations,
  markRead,
  upsertAdminMessage,
} from "@/lib/server/messagesStore";

export const runtime = "nodejs";

export async function GET() {
  const conversations = listConversations();
  return NextResponse.json({ conversations });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as {
    userId?: string;
    message?: string;
  } | null;
  if (!body?.userId || !body?.message) {
    return NextResponse.json({ error: "Missing userId or message" }, { status: 400 });
  }
  const trimmed = body.message.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }
  const conversation = upsertAdminMessage({ userId: body.userId, body: trimmed });
  return NextResponse.json({ conversation });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null) as {
    userId?: string;
    target?: "admin" | "user";
  } | null;
  if (!body?.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const conversation = markRead({ userId: body.userId, target: body.target || "admin" });
  return NextResponse.json({ conversation });
}
