import { NextResponse } from "next/server";
import { isProduction } from "@/lib/env";

import {
  listConversations,
  markRead,
  upsertAdminMessage,
} from "@/lib/server/messages/firestoreMessagesStore";

export const runtime = "nodejs";

export async function GET() {
  try {
    const conversations = await listConversations();
    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error("Could not list conversations", error);
    if (!isProduction) {
      return NextResponse.json({ conversations: [], devWarning: "Firestore admin not configured in dev; returning empty list." }, { status: 200 });
    }
    return NextResponse.json({ error: error?.message || "Failed to list conversations" }, { status: 500 });
  }
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
    if (!isProduction) {
      return NextResponse.json({ conversation: null, devWarning: "Firestore admin not configured in dev; reply not stored (noop)." }, { status: 200 });
    }
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
    if (!isProduction) {
      return NextResponse.json({ conversation: null, devWarning: "Firestore admin not configured in dev; noop." }, { status: 200 });
    }
    return NextResponse.json({ error: error?.message || "Failed to update conversation" }, { status: 500 });
  }
}
