import Link from "next/link";

export const metadata = {
  title: "Support – RotorReady",
  description: "Support information for RotorReady.",
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6 text-slate-800 dark:text-zinc-100">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">RotorReady Support</h1>
        <p className="text-slate-600 dark:text-zinc-300">
          Help, troubleshooting and important safety information for RotorReady.
        </p>
      </header>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Getting help</h2>
        <p>
          For support, correction requests or feedback, contact the RotorReady maintainer at{" "}
          <a className="text-blue-600 underline dark:text-blue-400" href="mailto:support@rotor-ready.com">
            support@rotor-ready.com
          </a>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-50 space-y-3">
        <h2 className="text-lg font-semibold">Training aid only</h2>
        <p>
          RotorReady is a study and recurrent-training aid. It is not operational flight documentation and must not be
          used as a substitute for approved RFM, QRH, operator manuals, SOPs, training or pilot judgment.
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Useful links</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li><Link className="text-blue-600 underline dark:text-blue-400" href="/privacy">Privacy Policy</Link></li>
          <li><Link className="text-blue-600 underline dark:text-blue-400" href="/info">App information and disclaimers</Link></li>
          <li><Link className="text-blue-600 underline dark:text-blue-400" href="/">Return to RotorReady</Link></li>
        </ul>
      </section>
    </div>
  );
}