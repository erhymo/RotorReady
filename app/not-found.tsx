import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 flex items-center justify-center p-6">
      <div className="max-w-sm w-full rounded-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-8 text-center shadow-sm">
        <Logo className="h-12 w-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Page not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#2E6EA1] px-4 py-2 text-sm font-semibold text-white active:scale-95"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
