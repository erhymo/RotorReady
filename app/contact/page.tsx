"use client";
import * as React from "react";
import Link from "next/link";

export default function ContactPage() {
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length === 0) return;
    const prev = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    prev.push({ message, date: new Date().toLocaleString() });
    localStorage.setItem("contactMessages", JSON.stringify(prev));
    setSent(true);
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-xl p-6 min-h-[60vh] w-full space-y-4">
      <Link href="/support" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800">
        <span aria-hidden>←</span> Support
      </Link>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-800 dark:border-zinc-700 border rounded-2xl p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Contact Admin</h1>
        <textarea
          className="border rounded px-3 py-2 min-h-[120px] dark:bg-zinc-800 dark:border-zinc-700"
          placeholder="Write your message here..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700" type="submit" disabled={sent || message.trim().length === 0}>
          {sent ? "Message sent!" : "Send"}
        </button>
        {sent && <div className="text-green-600 text-sm">Your message has been sent to admin.</div>}
      </form>
    </div>
  );
}
