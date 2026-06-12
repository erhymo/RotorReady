import { NextResponse } from "next/server";
import { isProduction } from "@/lib/env";
import { upsertUserMessage } from "@/lib/server/messages/firestoreMessagesStore";

export const runtime = "nodejs";

function sanitizeText(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function sanitizeVisitorId(value: unknown) {
  const raw = sanitizeText(value, 80).replace(/[^a-zA-Z0-9_-]/g, "");
  return raw || `anon-${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    message?: string;
    email?: string;
    visitorId?: string;
    page?: string;
    honeypot?: string;
  } | null;

  if (body?.honeypot) return NextResponse.json({ ok: true });

  const message = sanitizeText(body?.message, 2000);
  if (message.length < 5) {
    return NextResponse.json({ error: "Message is too short" }, { status: 400 });
  }

  const email = sanitizeText(body?.email, 180) || null;
  const page = sanitizeText(body?.page, 240);
  const visitorId = sanitizeVisitorId(body?.visitorId);
  const context = page ? `\n\n---\nPage: ${page}` : "";

  try {
    const conversation = await upsertUserMessage({
      userId: `guest-${visitorId}`,
      userEmail: email,
      body: `${message}${context}`,
    });
    return NextResponse.json({ ok: true, conversation });
  } catch (error: any) {
    console.error("Could not store public feedback", error);
    if (!isProduction) {
      return NextResponse.json({ ok: true, devWarning: "Feedback not stored in dev without Firestore admin." });
    }
    return NextResponse.json({ error: error?.message || "Could not send feedback" }, { status: 500 });
  }
}