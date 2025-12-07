"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useActiveModelVariant } from "@/lib/models/hooks";
import { INFO_STORAGE_KEY, LATEST_INFO_VERSION } from "@/lib/info/infoConstants";

export default function InfoPage() {
  const { variant } = useActiveModelVariant();
	  const router = useRouter();

  useEffect(() => {
    try {
      window.localStorage.setItem(INFO_STORAGE_KEY, LATEST_INFO_VERSION);
    } catch {
      // ignore
    }
  }, []);

  const isAw169 = variant?.id === "AW169";

	  return (
	    <div
	      className="max-w-3xl mx-auto p-6 space-y-6 cursor-pointer"
	      onClick={() => {
	        router.push("/");
	      }}
	    >
	      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Information</h1>
          <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1">
            Latest notes and disclaimers for RotorReady.
          </p>
        </div>
	        <Link
	          href="/"
	          className="mr-10 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
	        >
          Home
        </Link>
      </header>

      {isAw169 && (
        <section className="rounded-xl border border-amber-400 bg-amber-50/70 p-4 text-sm text-amber-900 dark:border-amber-500 dark:bg-amber-900/40 dark:text-amber-50 space-y-2">
          <h2 className="text-sm font-semibold tracking-wide uppercase">AW169 trainer disclaimer</h2>
          <p>
            This page and the related AW169 features in RotorReady are intended purely as a training aid. The
            information may be incomplete or incorrect.
          </p>
          <p>
            Always use the official AW169 RFM and QRH, and your operator&apos;s procedures, as your primary references.
            Do not make operational decisions based on this app alone.
          </p>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-800 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-2">
        <h2 className="text-sm font-semibold tracking-wide uppercase">General information</h2>
        <p>
          RotorReady is under active development. Features, questions and limits may change as we refine the training
          material.
        </p>
        <p>
          Always verify critical values against the official QRH, RFM and your company&apos;s SOPs before use in real
          operations.
        </p>
      </section>
    </div>
  );
}

