import { NextResponse } from "next/server";
import { isProduction } from "@/lib/env";

import {
  getConversation,
  markRead,
  upsertUserMessage,
} from "@/lib/server/messages/firestoreMessagesStore";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("uid");
  if (!userId) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }
  try {
    const conversation = await markRead({ userId, target: "user" }) || await getConversation(userId);
    return NextResponse.json({ conversation: conversation || null });
  } catch (error: any) {
    console.error("Could not load conversation", error);
    if (!isProduction) {
      return NextResponse.json({ conversation: null, devWarning: "Firestore admin not configured in dev; returning empty conversation." }, { status: 200 });
    }
    return NextResponse.json({ error: error?.message || "Failed to load conversation" }, { status: 500 });
  }
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
  try {
    const conversation = await upsertUserMessage({
      userId: body.uid,
      userEmail: body.email,
      body: trimmed,
    });
    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error("Could not store user message", error);
    if (!isProduction) {
      return NextResponse.json({ conversation: null, devWarning: "Firestore admin not configured in dev; message not stored (noop)." }, { status: 200 });
    }
    return NextResponse.json({ error: error?.message || "Failed to store message" }, { status: 500 });
  }
}
