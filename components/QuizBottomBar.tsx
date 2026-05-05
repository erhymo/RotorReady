"use client";

type QuizBottomBarProps = {
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
  progressText?: string;
};

export default function QuizBottomBar({
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  nextLabel = "Next",
  progressText,
}: QuizBottomBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 px-4 pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div
        className="mx-auto flex max-w-2xl items-center justify-between gap-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <button
          type="button"
          onClick={onPrevious}
          disabled={previousDisabled}
          className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition active:scale-[0.98] disabled:opacity-45 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          Previous
        </button>
        {progressText ? (
          <div className="min-w-0 truncate text-center text-xs font-medium text-slate-500 dark:text-zinc-400">
            {progressText}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="min-h-11 rounded-xl bg-[#2E6EA1] px-5 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-45"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
