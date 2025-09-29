import { NextResponse } from "next/server";

import {
  listConversations,
  markRead,
  upsertAdminMessage,
} from "@/lib/server/messages/firestoreMessagesStore";

export const runtime = "nodejs";

export async function GET() {
  const conversations = await listConversations();
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
  try {
    const conversation = await upsertAdminMessage({ userId: body.userId, body: trimmed });
    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error("Could not store admin reply", error);
    return NextResponse.json({ error: error?.message || "Failed to send reply" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null) as {
    userId?: string;
    target?: "admin" | "user";
  } | null;
  if (!body?.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  try {
    const conversation = await markRead({ userId: body.userId, target: body.target || "admin" });
    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error("Could not mark conversation as read", error);
    return NextResponse.json({ error: error?.message || "Failed to update conversation" }, { status: 500 });
  }
}
