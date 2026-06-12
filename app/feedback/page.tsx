"use client";

import { useEffect, useMemo, useState } from "react";
import AppTopBar from "@/components/AppTopBar";
import { MessageIcon } from "@/components/Icons";

function getVisitorId() {
  const key = "rr_feedback_visitor_id";
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const next = crypto.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, next);
    return next;
  } catch {
    return `anon-${Date.now().toString(36)}`;
  }
}

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState("/");

  useEffect(() => {
    setPage(document.referrer || window.location.href);
  }, []);

  const canSend = useMemo(() => message.trim().length >= 5 && !sending, [message, sending]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email, page, visitorId: getVisitorId(), honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setSent(true);
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Could not send feedback. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <AppTopBar title="Feedback" backHref="/" backLabel="Home" />
      <div className="mx-auto max-w-2xl p-6 text-slate-800 dark:text-zinc-100">
        <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              <MessageIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Send feedback</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                Tell us what can be improved in RotorReady. Your message goes to the admin review inbox.
              </p>
            </div>
          </div>

          <input className="hidden" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

          <label className="block space-y-2">
            <span className="text-sm font-semibold">Message</span>
            <textarea
              className="min-h-36 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-950"
              placeholder="Example: I found an unclear question, missing procedure, typo, or something that would make the app better…"
              value={message}
              maxLength={2000}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold">Email (optional)</span>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-950"
              placeholder="Only if you want a reply"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {sent && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-950/40 dark:text-emerald-200">Thanks — your feedback has been sent.</p>}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-700/50 dark:bg-red-950/40 dark:text-red-200">{error}</p>}

          <button type="submit" disabled={!canSend} className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {sending ? "Sending…" : "Send to admin"}
          </button>
        </form>
      </div>
    </>
  );
}