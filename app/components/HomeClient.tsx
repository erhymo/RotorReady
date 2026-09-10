"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { BoltIcon, BookIcon, DownloadIcon, HeadphonesIcon, MessageIcon } from "@/components/Icons";
import { shouldShowNorwayTools } from "@/lib/geo/norwayToolsVisibility";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelRoutes } from "@/lib/models/catalog";
import { openLiveOnlyLink } from "@/lib/liveOnlyLinks";

function Bar(props: { href: string; title: string; description: string; tone?: "blue"|"amber"|"slate"|"emerald"; icon?: React.ReactNode; liveOnly?: boolean }) {
  const tones: Record<string, string> = {
    blue: "border-blue-600 bg-blue-50/40 hover:bg-blue-50 dark:border-blue-400 dark:bg-blue-900/40 dark:hover:bg-blue-900/60",
    amber: "border-amber-500 bg-amber-50/40 hover:bg-amber-50 dark:border-amber-400 dark:bg-amber-900/40 dark:hover:bg-amber-900/60",
    slate: "border-slate-500 bg-slate-50/40 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800/60 dark:hover:bg-zinc-700/80",
    emerald: "border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60",
  };
  const tone = tones[props.tone || "slate"];
  const className = `group w-full rounded-xl border-l-4 ${tone} transition block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900`;
  const content = (
    <div className="px-5 py-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {props.icon && <span className="inline-grid place-items-center h-8 w-8 rounded-lg bg-white/70 text-slate-700 dark:bg-zinc-900/80 dark:text-zinc-100">{props.icon}</span>}
        <div>
          <div className="font-semibold text-slate-900 dark:text-zinc-100">{props.title}</div>
          <div className="text-sm text-slate-600 dark:text-zinc-300 mt-0.5">{props.description}</div>
        </div>
      </div>
      <div className="text-slate-400 text-xl transition-transform group-hover:translate-x-0.5 dark:text-zinc-400">›</div>
    </div>
  );

  // Needs a live server (weather/airport data) — not part of the native app's
  // bundled local shell, so it navigates to the live site instead of a dead
  // client-side route. See lib/liveOnlyLinks.ts.
  if (props.liveOnly) {
    return (
      <button type="button" onClick={() => openLiveOnlyLink(props.href)} className={`${className} w-full`}>
        {content}
      </button>
    );
  }

  return (
    <Link href={props.href} prefetch={false} className={className}>
      {content}
    </Link>
  );
}

	export default function HomeClient() {
	  const [ver, setVer] = useState<any>(null);
		  const [showNorwayTools, setShowNorwayTools] = useState(false);
	  const { variant: rawActiveVariant, loading: variantLoading } = useActiveModelVariant();
	  // Suppress model-specific bars until the real stored variant is known —
	  // otherwise every existing `activeVariant?.id === "..."` check below
	  // would briefly match the hardcoded default (AW169) on first paint.
	  const activeVariant = variantLoading ? undefined : rawActiveVariant;
	  const features = activeVariant?.features;
	  const routes = activeVariant ? modelRoutes(activeVariant) : null;

	  useEffect(() => {
	    fetch("/quiz-data/versions/data-version.json")
	      .then((r) => r.json())
	      .then(setVer)
	      .catch(() => {});
	  }, []);

		  useEffect(() => {
		    const timer = window.setTimeout(() => {
		      setShowNorwayTools(shouldShowNorwayTools());
		    }, 0);
		    return () => window.clearTimeout(timer);
		  }, []);

		  const showCalculations = true;
		  const showPlanningTools = showNorwayTools || showCalculations;

		  return (
		    <div className="max-w-5xl mx-auto p-6 space-y-8">
			      <header className="flex items-start justify-between gap-4">
			        <div className="min-w-0">
		          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">RotorReady</h1>
		          <p className="mt-2 text-slate-600 dark:text-zinc-300">
		            Train smarter with fast repetition, quick references and planning tools for rotorwing operations.
		          </p>
		        </div>
			        <Link
			          href="/feedback"
			          prefetch={false}
			          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:border-blue-500/40 dark:bg-blue-950/60 dark:text-blue-200 dark:hover:bg-blue-900/70"
			          aria-label="Send feedback to RotorReady admin"
			        >
			          <MessageIcon className="h-4 w-4" />
			          <span className="hidden sm:inline">Feedback</span>
			        </Link>
		      </header>

		      <section className="space-y-3">
		        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">Training</h2>
		        {(!activeVariant || features?.lights) && (
		        <Bar
		          href="/training/lights"
		          title="Emergency & Malfunction"
		          description="Practice lights, memory items and emergency/malfunction procedures."
		          tone="amber"
		          icon={<BoltIcon className="h-4 w-4" />}
		        />
		        )}
		        <Bar
		          href="/quiz"
		          title="Quiz"
		          description="Train limitations, systems, procedures and model-specific knowledge."
		          tone="blue"
		          icon={<BookIcon className="h-4 w-4" />}
		        />
		        {features?.audio && (
          <Bar
            href="/audio"
            title="Audio"
            description="Deep-dive study podcasts you can listen to on the go."
            tone="blue"
            icon={<HeadphonesIcon className="h-4 w-4" />}
          />
        )}
        {activeVariant && features?.procedures && routes && (
	          <Bar
	            href={routes.trainingProcedures}
	            title="Procedures"
	            description={activeVariant.proceduresDescription ?? `Browse ${activeVariant.shortLabel} procedures and training checklists.`}
	            tone="emerald"
	            icon={<BookIcon className="h-4 w-4" />}
	          />
	        )}
		      </section>

		      <section className="space-y-3">
		        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">Reference</h2>
		        <Bar
		          href="/ifr-vfr"
		          title="IFR - VFR"
		          description="EASA instrument and visual flight rules, as a reference to keep fresh."
		          tone="slate"
		          icon={<BookIcon className="h-4 w-4" />}
		        />
	        {activeVariant && features?.quickReference && routes && (
	          <Bar
	            href={routes.quickReference}
	            title="Quick Reference"
	            description={activeVariant.quickReferenceDescription ?? `Key ${activeVariant.shortLabel}${activeVariant.docLabel ? " " + activeVariant.docLabel : ""} limitations and numbers.`}
	            tone="slate"
	            icon={<BookIcon className="h-4 w-4" />}
	          />
	        )}
	        {activeVariant && features?.systemNotes && routes && (
	          <Bar
	            href={routes.systemNotes}
	            title="System Notes"
	            description={`Written deep-dives on ${activeVariant.shortLabel} systems — how they work, and the numbers to know.`}
	            tone="slate"
	            icon={<BookIcon className="h-4 w-4" />}
	          />
	        )}
	        {/* Exterior Map: work in progress, deliberately not linked from Home yet.
	            Route/component/data stay in the repo — reachable directly at
	            /aw169/exterior-map for local iteration — until it's ready to re-link. */}
		      </section>

		      {showPlanningTools && (
		        <section className="space-y-3">
		          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">Planning & Tools</h2>
		          {showNorwayTools && (
		            <>
		              <Bar
		                href="/weather"
		                title="Weather planning"
		                description="Nearest ICAO airports with METAR/TAF and alternates."
		                tone="slate"
		                liveOnly
		              />
		              <Bar
		                href="/airports"
		                title="Airports"
		                description="Browse Avinor AIS airports, ATS and fuel opening hours."
		                tone="slate"
		                liveOnly
		              />
		            </>
		          )}
		          {showCalculations && (
		            <Bar
		              href="/calculations"
		              title="Calculations"
		              description="TAS and unit conversions for quick planning."
		              tone="slate"
		            />
		          )}
		        </section>
		      )}

	      <section className="space-y-3">
	        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-zinc-200">Offline & App</h2>
	        <Bar
	          href="/offline"
	          title="Offline Packages"
	          description="Download chapters locally for use without network coverage."
	          tone="emerald"
	          icon={<DownloadIcon className="h-4 w-4" />}
	        />
	        <Bar
	          href="/account"
		          title="Settings"
		          description="Choose aircraft model, theme and local preferences."
	        />
	      </section>

		      {ver && (
		        <footer className="pt-2 text-xs text-slate-500 dark:text-zinc-400">
		          <div>
		            Data: {String(ver.version).slice(0, 10)} — QRH: {ver.qrhVersion} — RFM: {ver.rfmVersion}
		          </div>
		        </footer>
		      )}
		    </div>
		  );
	}

