import { NextResponse } from "next/server";
import { isProduction } from "@/lib/env";

import {
	  getConversation,
	  markRead,
	  upsertUserMessage,
} from "@/lib/server/messages/firestoreMessagesStore";
import { requireIdToken } from "@/lib/server/auth/verifyIdToken";

export const runtime = "nodejs";

export async function GET(req: Request) {
	  let userId: string;
	  try {
	    const user = await requireIdToken(req);
	    userId = user.uid;
	  } catch {
	    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	  }
	  try {
	    const conversation = (await markRead({ userId, target: "user" })) || (await getConversation(userId));
	    return NextResponse.json({ conversation: conversation || null });
	  } catch (error: any) {
	    console.error("Could not load conversation", error);
	    // Be lenient for GET: don't surface transient errors in UI; return empty conversation
	    return NextResponse.json({ conversation: null }, { status: 200 });
	  }
}

export async function POST(req: Request) {
	  let userId: string;
	  let tokenEmail: string | undefined;
	  try {
	    const user = await requireIdToken(req);
	    userId = user.uid;
	    tokenEmail = user.email;
	  } catch {
	    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	  }
	  const body = (await req.json().catch(() => null)) as {
	    // uid is intentionally ignored server-side; identity comes from the verified token
	    uid?: string;
	    email?: string | null;
	    message?: string;
	  } | null;
	  if (!body?.message) {
	    return NextResponse.json({ error: "Missing message" }, { status: 400 });
	  }
	  const trimmed = body.message.trim();
	  if (!trimmed) {
	    return NextResponse.json({ error: "Empty message" }, { status: 400 });
	  }
	  const resolvedEmail = tokenEmail || body.email || null;
	  try {
	    const conversation = await upsertUserMessage({
	      userId,
	      userEmail: resolvedEmail,
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
