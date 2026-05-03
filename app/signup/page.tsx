import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-xl p-6">
      <div className="space-y-4 rounded-2xl border-l-4 border-emerald-600 bg-emerald-50/40 p-6 dark:border-emerald-400 dark:bg-emerald-900/40">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">No account required</h1>
        <p className="text-slate-700 dark:text-zinc-300">
          Account creation is disabled for this release. RotorReady is free and fully available without sign-up.
        </p>
        <Link href="/" className="inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
          Continue to RotorReady
        </Link>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
