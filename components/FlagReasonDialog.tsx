"use client";

import * as React from "react";
import type { FlagPayload } from "@/lib/flags";

type Props = {
  payload: FlagPayload | null;
  onComplete: (payload: FlagPayload) => void;
};

export default function FlagReasonDialog({ payload, onComplete }: Props) {
  const [text, setText] = React.useState("");

  // Reset text each time a new payload is shown
  React.useEffect(() => {
    if (payload) setText("");
  }, [payload]);

  if (!payload) return null;

  function handleSend() {
    const reason = text.trim();
    const finalPayload: FlagPayload = reason ? { ...payload, reason } : payload;
    onComplete(finalPayload);
  }

  function handleSkip() {
    onComplete(payload);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg dark:bg-zinc-900 dark:text-zinc-100">
        <h2 className="mb-2 text-sm font-semibold">Why did you flag this question?</h2>
        <p className="mb-2 text-xs text-gray-600 dark:text-zinc-300">
          Optional: Briefly describe what is wrong or unclear about this question.
        </p>
        <textarea
          className="w-full rounded border px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          placeholder="Example: Wrong answer, unclear wording, not relevant for this model."
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleSkip}
            className="rounded border px-3 py-1 text-sm text-gray-700 dark:border-zinc-700 dark:text-zinc-100"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

