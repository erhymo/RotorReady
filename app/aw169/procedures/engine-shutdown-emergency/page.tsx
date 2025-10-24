
import Link from "next/link";
import { BackButton } from "@/app/components/BackButton";


export const metadata = {
  title: "AW169 – Engine Shutdown in Emergency",
};

export default function EngineShutdownEmergencyPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const cwp = (searchParams?.cwp as string | undefined) ?? undefined;
  const v = (searchParams?.v as string | undefined) ?? "";
  const light = (searchParams?.light as string | undefined) ?? "";
  const mem = (searchParams?.mem as string | undefined) ?? "0";
  const compact = !!cwp && cwp !== "0" && cwp !== "false";

  function Content() {
    return (
      <main className="mx-auto max-w-3xl p-6 space-y-6">
        <header className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">ENGINE SHUTDOWN IN EMERGENCY</h1>
          <p className="mt-2 text-sm text-slate-700 dark:text-zinc-300">
            Use this procedure to shut down an engine promptly when required by an emergency or malfunction.
          </p>
        </header>

        <section className="space-y-3">
          <div className="rounded-xl border-l-4 border-amber-500/60 bg-amber-50 dark:bg-zinc-900/70 p-3 text-sm dark:text-zinc-100">
            <div className="font-semibold mb-1">CAUTION</div>
            Failure to follow the aborted engine restart procedure may cause damage to the engine.
          </div>
        </section>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Monitor engine indications. If any of the following occur, shut down the engine:</div>
          <ul className="list-disc pl-6 text-sm text-slate-800 dark:text-zinc-100">
            <li>No light‑up within 10 seconds of ENG MODE knob to IDLE</li>
            <li>ITT increases beyond engine limits</li>
            <li>ITT invalid (X or blank)</li>
            <li>Engine hangs (NG stagnation below 60%)</li>
            <li>Starter fails to disengage by 54% NG</li>
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-sm text-slate-800 dark:text-zinc-100">Shut down engine as follows:</div>
          <ol className="list-decimal pl-6 text-sm text-slate-800 dark:text-zinc-100">
            <li>ENG MODE knob — <span className="font-semibold">OFF</span>.</li>
            <li>FUEL ENG SOV (EDCU, FUEL page) — <span className="font-semibold">CLOSE</span>.</li>
          </ol>
        </section>

        <footer className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
          AW169 training reference. For training use only.
        </footer>
      </main>
    );
  }

  if (compact) {
    return (
      <Link
        href={{ pathname: "/training/lights", query: { resume: "1", v, light, mem, cwp: "1" } }}
        className="fixed left-0 right-0 bottom-0 top-0 z-40 bg-white dark:bg-zinc-900 cursor-pointer block"
        role="button"
        aria-label="Close procedure"
      >
        <div className="h-full w-full overflow-y-auto">
          <Content />
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700">
        <div className="mx-auto max-w-3xl px-6 py-3">
          <BackButton label="Back to procedure" />
        </div>
      </div>
      <Content />
    </div>
  );
}

