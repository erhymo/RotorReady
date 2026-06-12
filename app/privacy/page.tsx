import Link from "next/link";

export const metadata = {
  title: "Privacy Policy – RotorReady",
  description: "Privacy policy for RotorReady.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6 text-slate-800 dark:text-zinc-100">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-sm text-slate-600 dark:text-zinc-300">Last updated: 12 June 2026</p>
      </header>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p>
          RotorReady is designed as a training aid. The app does not require an account and does not sell personal data.
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Data stored on your device</h2>
        <p>
          RotorReady may store training preferences, selected aircraft model, offline packages and local progress on your
          device so the app can work offline and remember your settings.
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Support contact</h2>
        <p>
          If you contact support, the information you choose to send may be used only to respond to your request.
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Basic app usage metrics</h2>
        <p>
          RotorReady may record a random local visitor ID and app-open timestamps to understand recent usage, such as
          activity during the last 30 days, 7 days and 24 hours. These basic metrics are used to improve the app and do
          not require an account.
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Safety disclaimer</h2>
        <p>
          RotorReady is not approved operational documentation. Always use official manuals, approved checklists,
          operator procedures and instructor guidance for real operations.
        </p>
      </section>

      <p>
        <Link className="text-blue-600 underline dark:text-blue-400" href="/support">Back to support</Link>
      </p>
    </div>
  );
}