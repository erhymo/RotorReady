"use client";

import { useRouter } from "next/navigation";
import React from "react";

export function BackButton({ className, label }: { className?: string; label?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        try {
          const raw = sessionStorage.getItem("lights:resume");
          if (raw) {
            router.push("/training/lights");
            return;
          }
        } catch {}
        router.back();
      }}
      className={className || "inline-flex items-center gap-2 rounded-lg px-3 py-2 border text-sm dark:border-zinc-700 dark:text-zinc-100"}
      aria-label={label || "Back"}
    >
      <span aria-hidden>←</span>
      <span>{label || "Back"}</span>
    </button>
  );
}

