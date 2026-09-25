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
        <p className="text-sm text-slate-600 dark:text-zinc-300">Last updated: 24 September 2026</p>
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
        <h2 className="text-lg font-semibold">Support contact and feedback</h2>
        <p>
          If you contact support or send feedback in the app, we receive your message, the page you sent it from and, if
          you choose to give it, your email address. This is used only to respond to you and improve the app.
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Location</h2>
        <p>
          Weather planning can show weather for the airports nearest to you. Only if you allow location access, your
          position is sent to our server and to our weather data provider to find those airports. It is used for that
          request only and is not saved; the server keeps the airport result, keyed to a rounded position, for about a
          minute so repeated requests are answered faster.
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Basic app usage metrics</h2>
        <p>
          RotorReady may record a random local visitor ID, app-open timestamps and the platform (web, iOS or Android) to
          understand recent usage, such as activity during the last 30 days, 7 days and 24 hours. These basic metrics are
          used to improve the app and do not require an account.
        </p>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <h2 className="text-lg font-semibold">Crash reports</h2>
        <p>
          If the app runs into a technical error, it sends a crash report so the problem can be found and fixed. A report
          contains the error message, where in the app&apos;s code it happened, the page you were on, the platform, the app
          version and your browser or device type. It does not contain your visitor ID, and your IP address is not stored
          with it. Crash reports are used only to fix errors.
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