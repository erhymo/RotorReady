"use client";

import { useRouter } from "next/navigation";
import React from "react";

export function BackButton({ className, label, to }: { className?: string; label?: string; to?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (to) {
          router.push(to);
          return;
        }
        try {
          const sp = new URLSearchParams(window.location.search);
          const resume = sp.get("resume");
          const v = sp.get("v");
          const light = sp.get("light");
          const mem = sp.get("mem");
          if (resume && v && light) {
            const qs = new URLSearchParams({ resume: "1", v, light });
            if (mem) qs.set("mem", mem);
            router.push(`/training/lights?${qs.toString()}`);
            return;
          }
        } catch {}
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

