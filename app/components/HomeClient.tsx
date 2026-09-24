"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

import { BoltIcon, BookIcon, DownloadIcon, HeadphonesIcon, MessageIcon } from "@/components/Icons";
import { shouldShowNorwayTools } from "@/lib/geo/norwayToolsVisibility";
import { useActiveModelVariant } from "@/lib/models/hooks";
import { modelRoutes } from "@/lib/models/catalog";
import { contentUrl, fetchContentJson } from "@/lib/contentUrl";

function Bar(props: { href: string; title: string; description: string; tone?: "blue"|"amber"|"slate"|"emerald"; icon?: React.ReactNode; pending?: boolean }) {
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

  // The model-specific bars below can only resolve their destination once the
  // stored model has been read from localStorage, which happens at hydration.
  // They used to be omitted entirely until then, so they dropped into the page
  // a beat after everything else and pushed the rest down. Rendering the same
  // box, sized identically and with its (static) title already showing, keeps
  // the layout still; only the link and the model-specific line arrive late.
  if (props.pending) {
    return (
      <div className={`${className} cursor-default`} aria-hidden="true">
        {content}
      </div>
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

	  // Whether to offer Audio is decided by whether this model actually has
	  // episodes, not by a flag in the code: several models carry the feature but
	  // no recordings yet, and a bar leading to "no audio content" is a promise
	  // the app does not keep. Reading it from the same index the audio page uses
	  // also means the bar appears on its own the day episodes are published, with
	  // no app release involved.
	  // null = not answered yet. The bar's slot is held open while that is true,
	  // so the answer arriving does not shove everything below it down the page;
	  // 10 of the 12 models have episodes, so holding the space is right far more
	  // often than not, and the two without simply collapse it once known.
	  const [hasAudio, setHasAudio] = useState<boolean | null>(null);

	  useEffect(() => {
	    const variantId = activeVariant?.id;
	    let cancelled = false;
	    if (!variantId || !features?.audio) {
	      queueMicrotask(() => {
	        if (!cancelled) setHasAudio(variantId ? false : null);
	      });
	      return () => {
	        cancelled = true;
	      };
	    }
	    // Answer from the bundled copy first. It is already on the device, so it
	    // renders the bar immediately, and it is never wrong about a model that
	    // had episodes at the last native build. The live index then corrects it,
	    // which is what still makes the bar appear on its own for a model whose
	    // first episodes were published since. Before this the bar waited only on
	    // the live fetch, so on a weak connection it could stay hidden for many
	    // seconds even though the answer was sitting in the app bundle.
	    const hasItems = (data: { items?: unknown[] } | null | undefined) =>
	      Array.isArray(data?.items) && data.items.length > 0;
	    let liveAnswered = false;

	    // Deliberately the bundled copy: it answers instantly and works offline, and
	    // the fetchContentJson call right below overrides it with the live answer.
	    // content-fetch-ok: bundled-first on purpose, corrected by the live fetch below
	    fetch(`/audio/${variantId}/index.json`)
	      .then((res) => (res.ok ? res.json() : null))
	      .then((data: { items?: unknown[] } | null) => {
	        // Never let the bundled answer overwrite a live one that already landed.
	        if (!cancelled && !liveAnswered && data) setHasAudio(hasItems(data));
	      })
	      .catch(() => {});

	    fetchContentJson<{ items?: unknown[] }>(`/audio/${variantId}/index.json`)
	      .then((data) => {
	        if (cancelled) return;
	        liveAnswered = true;
	        setHasAudio(hasItems(data));
	      })
	      .catch(() => {});
	    return () => {
	      cancelled = true;
	    };
	  }, [activeVariant?.id, features?.audio]);

	  useEffect(() => {
	    fetch(contentUrl("/quiz-data/versions/data-version.json"))
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
		        {hasAudio === null ? (
          <Bar pending href="" title="Audio" description="Deep-dive study podcasts you can listen to on the go." tone="blue" icon={<HeadphonesIcon className="h-4 w-4" />} />
        ) : features?.audio && hasAudio ? (
          <Bar
            href="/audio"
            title="Audio"
            description="Deep-dive study podcasts you can listen to on the go."
            tone="blue"
            icon={<HeadphonesIcon className="h-4 w-4" />}
          />
        ) : null}
        {!activeVariant ? (
	          <Bar pending href="" title="Procedures" description="Browse normal, emergency and engine-failure procedures." tone="emerald" icon={<BookIcon className="h-4 w-4" />} />
	        ) : features?.procedures && routes ? (
	          <Bar
	            href={routes.trainingProcedures}
	            title="Procedures"
	            description={activeVariant.proceduresDescription ?? `Browse ${activeVariant.shortLabel} procedures and training checklists.`}
	            tone="emerald"
	            icon={<BookIcon className="h-4 w-4" />}
	          />
	        ) : null}
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
	        {!activeVariant ? (
	          <Bar pending href="" title="Quick Reference" description="Key limitations and numbers to have at hand." tone="slate" icon={<BookIcon className="h-4 w-4" />} />
	        ) : features?.quickReference && routes ? (
	          <Bar
	            href={routes.quickReference}
	            title="Quick Reference"
	            description={activeVariant.quickReferenceDescription ?? `Key ${activeVariant.shortLabel}${activeVariant.docLabel ? " " + activeVariant.docLabel : ""} limitations and numbers.`}
	            tone="slate"
	            icon={<BookIcon className="h-4 w-4" />}
	          />
	        ) : null}
	        {!activeVariant ? (
	          <Bar pending href="" title="System Notes" description="Written deep-dives on the systems — how they work, and the numbers to know." tone="slate" icon={<BookIcon className="h-4 w-4" />} />
	        ) : features?.systemNotes && routes ? (
	          <Bar
	            href={routes.systemNotes}
	            title="System Notes"
	            description={`Written deep-dives on ${activeVariant.shortLabel} systems — how they work, and the numbers to know.`}
	            tone="slate"
	            icon={<BookIcon className="h-4 w-4" />}
	          />
	        ) : null}
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
		              />
		              <Bar
		                href="/airports"
		                title="Airports"
		                description="Browse Avinor AIS airports, ATS and fuel opening hours."
		                tone="slate"
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

