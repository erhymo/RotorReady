"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toggleTheme as toggleThemeLib, setThemeSource as setThemeSourceLib, getEffectiveTheme as getEffectiveThemeLib, onThemeChange as onThemeChangeLib } from "@/lib/theme";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { listVariantsByProduct } from "@/lib/models/catalog";
import { getStoredActiveModelVariantId, storeActiveModelVariantId } from "@/lib/models/storage";

type Summary = { section: string; total: number; correct: number; percent: number; at: string };
type WrongSession = { section?: string; createdAt?: string | number; items?: unknown[] };

type ConversationMessage = {
  id: string;
  from: "user" | "admin";
  body: string;
  createdAt: string;
  readByAdmin: boolean;
  readByUser: boolean;
};

type ConversationThread = {
  userId: string;
  userEmail?: string | null;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  unreadForAdmin: number;
  unreadForUser: number;
};

export default function AccountPage() {
  function parseLocalStorage<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`Kunne ikke tolke lagrede data for ${key}`, error);
      localStorage.removeItem(key);
      return null;
    }
  }

  function findWrongSession(): { data: WrongSession; sectionId: string } | null {
    if (typeof window === "undefined") return null;
    const seen = new Set<string>();
    const candidateSections = [
      "limitations",
      "LIMITATIONS",
      ...history.map((h) => h.section),
      ...history.map((h) => h.section?.toLowerCase?.()).filter(Boolean) as string[],
    ];
    const candidateKeys = candidateSections
      .map((section) => `rr_progress_last_wrong:${section}`)
      .filter((key) => Boolean(key));

    const storedKeys = Object.keys(localStorage).filter((key) => key.startsWith("rr_progress_last_wrong:"));
    candidateKeys.push(...storedKeys);

    for (const key of candidateKeys) {
      if (seen.has(key)) continue;
      seen.add(key);
      const parsed = parseLocalStorage<WrongSession>(key);
      if (!parsed) continue;
      const sectionId = key.split(":").slice(1).join(":") || parsed.section || "limitations";
      return { data: parsed, sectionId };
    }
    return null;
  }

  function routeForWrongSession(sectionId: string): string | null {
    const normalized = sectionId.toLowerCase();
    if (normalized === "limitations") return "/limitations-quiz/1";
    return null;
  }

  function startWrongOnly() {
    const found = findWrongSession();
    if (!found) {
      alert("Ingen feilsett tilgjengelig. Fullfør en quiz først.");
      return;
    }

    const route = routeForWrongSession(found.sectionId);
    if (!route) {
      alert("Fant et feilsett, men det støttes ikke fra denne snarveien ennå.");
      return;
    }

    sessionStorage.setItem("limq_session", JSON.stringify(found.data));
    window.location.href = route;
  }
  const router = useRouter();
  const [history, setHistory] = useState<Summary[]>([]);
  const [ents, setEnts] = useState<{AW169?:boolean; AW189?:boolean; AW139?:boolean; H125?:boolean}>({});
  const [email, setEmail] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [themePref, setThemePref] = useState<'system'|'light'|'dark'>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light'|'dark'>(() => (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [userUid, setUserUid] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationThread | null>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);


  const loadConversation = useCallback(async (uid: string) => {
    setConversationLoading(true);
    setConversationError(null);
    try {
      const res = await fetch(`/api/messages?uid=${encodeURIComponent(uid)}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setConversation(data?.conversation || null);
    } catch (error: any) {
      setConversationError(error?.message || "Kunne ikke laste meldinger");
    } finally {
      setConversationLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initialize from global theme state
    const source = (localStorage.getItem('rr_theme_source') || 'system') as 'manual'|'system';
    if (source === 'manual') {
      const stored = localStorage.getItem('rr_theme');
      if (stored === 'dark' || stored === 'light') setThemePref(stored);
      else setThemePref('light');
    } else {
      setThemePref('system');
    }

    setEffectiveTheme(getEffectiveThemeLib());
    const unsub = onThemeChangeLib((payload: { theme: 'light'|'dark'; source: 'manual'|'system' }) => setEffectiveTheme(payload.theme));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    const storedHistory = parseLocalStorage<Summary[]>("rr_progress");
    if (storedHistory) setHistory(storedHistory);

    if (!auth) {
      setAuthChecked(true);
      setLoggedIn(false);
      return;
    }

    let cancelled = false;
    let resolved = false;

    const applyState = (user: typeof auth.currentUser, entitlements?: Record<string, unknown>) => {
      if (cancelled) return;
      setEmail(user?.email || null);
      setUserUid(user?.uid || null);
      setLoggedIn(Boolean(user));
      if (entitlements) {
        setEnts(entitlements as {AW169?:boolean; AW189?:boolean; AW139?:boolean; H125?:boolean});
      } else {
        setEnts({});
      }
      resolved = true;
      setAuthChecked(true);
    };

    const loadEntitlements = async (user: typeof auth.currentUser) => {
      if (!user || !db) return {} as Record<string, unknown>;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        return snap.data()?.entitlements || {};
      } catch {
        return {} as Record<string, unknown>;
      }
    };

    const handleUser = async (user: typeof auth.currentUser) => {
      applyState(user);
      if (user) {
        const entitlements = await loadEntitlements(user);
        if (!cancelled) {
          setEnts(entitlements as {AW169?:boolean; AW189?:boolean; AW139?:boolean; H125?:boolean});
        }
      } else {
        setConversation(null);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      handleUser(user);
    });

    if (auth.currentUser) {
      handleUser(auth.currentUser);
    }

    const fallbackTimer = setTimeout(() => {
      if (!resolved && !cancelled) {
        setAuthChecked(true);
      }
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authChecked || loggedIn) return;
    if (typeof window !== "undefined") {
      router.replace(`/login?next=${encodeURIComponent("/account")}`);
    }
  }, [authChecked, loggedIn, router]);

  useEffect(() => {
    if (!userUid) {
      setConversation(null);
      return;
    }
    loadConversation(userUid).catch(() => {});
  }, [userUid, loadConversation]);

  const sortedMessages = useMemo(() => {
    if (!conversation?.messages) return [] as ConversationMessage[];
    return [...conversation.messages].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  }, [conversation]);

  const handleSendMessage = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userUid) {
      setConversationError("Du må være innlogget for å sende meldinger.");
      return;
    }
    const trimmed = messageText.trim();
    if (!trimmed) return;
    setSendingMessage(true);
    setConversationError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userUid, email, message: trimmed }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Kunne ikke sende melding");
      }
      const data = await res.json();
      setConversation(data?.conversation || null);
      setMessageText("");
    } catch (error: any) {
      setConversationError(error?.message || "Kunne ikke sende melding");
    } finally {
      setSendingMessage(false);
    }
  }, [email, messageText, userUid]);

  const unreadUserMessages = conversation?.messages?.filter((msg) => msg.from === "admin" && !msg.readByUser).length ?? 0;

  if (!authChecked) {
    return <div className="p-8 text-center text-lg text-slate-700 dark:text-zinc-200">Laster…</div>;
  }
  if (!loggedIn) {
    return <div className="p-8 text-center text-lg text-slate-700 dark:text-zinc-200">Viderekobler til innlogging…</div>;
  }

  const attempts = history.length;
  const formatSection = (value: string) => {
    if (!value) return "";
    const lower = value.toLowerCase();
    if (lower === "limitations") return "Limitations";
    return value;
  };

  const last = attempts ? history[attempts - 1] : null;
  const best = attempts ? history.reduce((a,b)=> (b.percent > a.percent ? b : a)) : null;

  const handleToggleTheme = () => {
    const next: 'light'|'dark' = toggleThemeLib();
    setThemePref(next);
    setEffectiveTheme(next);
  };

  const followSystem = () => {
    setThemeSourceLib('system');
    setThemePref('system');
    setEffectiveTheme(getEffectiveThemeLib());
  };

  const themeDescription = themePref === 'system'
    ? `Følger system (${effectiveTheme === 'dark' ? 'mørk' : 'lys'})`
    : themePref === 'dark'
      ? 'Manuelt mørk'
      : 'Manuelt lys';

  const themeIcon = effectiveTheme === 'dark' ? '☀️' : '🌙';
  const themeButtonLabel = effectiveTheme === 'dark' ? 'Lyst tema' : 'Mørkt tema';

  const h125Variants = listVariantsByProduct("H125");
  const activeVariantId = getStoredActiveModelVariantId();
  const selectVariant = async (id: string) => {
    // Lagre lokalt umiddelbart for sømløs opplevelse
    try { storeActiveModelVariantId(id); } catch {}
    // Forsøk å lagre på server dersom bruker er innlogget, med ID-token
    try {
      const user = auth?.currentUser;
      if (user) {
        const token = await user.getIdToken();
        await fetch("/api/account/model", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ variantId: id }),
          cache: "no-store",
        }).catch(() => {});
      }
    } catch (e) {
      // Ikke forstyrr brukeren – vi har allerede lagret lokalt
      console.warn("Kunne ikke oppdatere aktiv modell på server", e);
    } finally {
      if (typeof window !== "undefined") window.location.reload();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <BackButton className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl mb-2" />
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Min side</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-2">Din tilgang og progresjon i RotorReady.</p>
      </header>

      <section className="space-y-3">
        <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/40 dark:border-amber-400 dark:bg-amber-900/40 px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-slate-900 dark:text-zinc-100">Tema</div>
            <div className="text-sm text-slate-700 dark:text-zinc-300 mt-0.5">{themeDescription}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTheme}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              aria-label={`Bytt til ${themeButtonLabel.toLowerCase()}`}
            >
              <span className="text-lg" aria-hidden>{themeIcon}</span>
              <span>{themeButtonLabel}</span>
            </button>
            {themePref !== 'system' && (
              <button
                onClick={followSystem}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Følg system
              </button>
            )}
          </div>
        </div>
        <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-slate-900 dark:text-zinc-100">Tilgang</div>
            <div className="text-sm text-slate-700 dark:text-zinc-300 mt-0.5">
              {loggedIn ? "Innlogget" : <span><a href="/login" className="underline">Logg inn</a> for å se aktivt abonnement.</span>}
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <button
                type="button"
                key="AW169"
                onClick={() => selectVariant("AW169")}
                className={`px-3 py-1 rounded-lg border text-sm transition ${
                  activeVariantId === "AW169"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "bg-white dark:bg-zinc-900 dark:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-600"
                }`}
              >
                AW169 {ents.AW169 ? "✓" : ""}
              </button>

              {h125Variants.map((v) => {
                const coming = v.status === "coming_soon";
                const hasH125 = Boolean(ents.H125);
                const isActive = activeVariantId === v.id;
                const label = v.label.replace("H125 / ", "AS350 ");
                return (
                  <button
                    type="button"
                    key={v.id}
                    disabled={coming}
                    onClick={() => !coming && selectVariant(v.id)}
                    className={`px-3 py-1 rounded-lg border text-sm transition ${
                      isActive
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "bg-white dark:bg-zinc-900 dark:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-600"
                    } ${coming ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {label} {!coming && hasH125 ? "✓" : ""}
                    {coming && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-amber-400/70 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/30 dark:text-amber-200">
                        Kommer
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">Kjøp aktiveres via Stripe Checkout (se Paywall) eller av admin.</p>
          </div>
          {loggedIn && (
            <button
              className="px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-900 mt-2"
              onClick={async () => {
                await import("firebase/auth").then(({ getAuth, signOut }) => signOut(getAuth(auth.app)));
                window.location.href = "/";
              }}

            >
              Logg ut
            </button>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 px-5 py-4">
          <div className="font-semibold text-slate-900 dark:text-zinc-100">Progresjon</div>
          {attempts === 0 ? (
            <p className="text-gray-600 dark:text-zinc-300">Ingen gjennomførte quizer enda.</p>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-slate-900 dark:text-zinc-100">Antall forsøk: <b>{attempts}</b></div>
              {last && <div className="text-sm text-slate-900 dark:text-zinc-100">Sist: {formatSection(last.section)} — {last.correct}/{last.total} ({Math.round(last.percent)}%)</div>}
              {best && <div className="text-sm text-slate-900 dark:text-zinc-100">Best: {formatSection(best.section)} — {best.correct}/{best.total} ({Math.round(best.percent)}%)</div>}
              <details className="mt-2">
                <summary className="cursor-pointer text-slate-900 dark:text-white">Vis historikk</summary>
                <ul className="list-disc ml-5 text-sm text-slate-900 dark:text-zinc-100">
                  {history.map((h,i)=>(
                    <li key={i}>{new Date(h.at).toLocaleString()} — {formatSection(h.section)}: {h.correct}/{h.total} ({Math.round(h.percent)}%)</li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>
        <div className="bg-slate-900 dark:bg-zinc-900 dark:border-zinc-700 border rounded-xl p-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-white dark:text-zinc-100">Øv kun på feil</div>
              <div className="text-sm text-gray-300 dark:text-zinc-300">Bygger et sett av spørsmålene du nylig hadde feil.</div>
            </div>
            <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg border bg-slate-900 text-white dark:bg-zinc-900 dark:text-zinc-100">Start</button>
          </div>
        </div>
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Kontakt RotorReady</h2>
            <p className="text-sm text-slate-600 dark:text-zinc-300">Still spørsmål eller del tilbakemeldinger direkte med oss.</p>
            {unreadUserMessages > 0 && (
              <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">
                {unreadUserMessages} ulest{unreadUserMessages > 1 ? "e" : ""} svar fra oss.
              </p>

            )}
          </div>
          <button
            onClick={() => userUid && loadConversation(userUid)}
            disabled={conversationLoading}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Oppdater
          </button>
        </div>

        {conversationError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
            {conversationError}
          </div>
        )}

        {conversationLoading ? (
          <p className="text-sm text-slate-600 dark:text-zinc-300">Laster meldinger…</p>
        ) : sortedMessages.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-zinc-300">Ingen meldinger ennå. Send oss en tilbakemelding nedenfor.</p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {sortedMessages.map((msg) => {
              const isAdmin = msg.from === "admin";
              return (
                <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow ${
                      isAdmin
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.body}</div>
                    <div className={`mt-2 text-xs ${isAdmin ? "text-blue-100" : "text-slate-500 dark:text-zinc-400"}`}>
                      {isAdmin ? "RotorReady" : "Deg"} — {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="space-y-3">
          <textarea
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
            placeholder="Skriv meldingen din…"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            minLength={1}
            rows={4}
          />
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={sendingMessage || !messageText.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {sendingMessage ? "Sender…" : "Send melding"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Om appen og ansvarsfraskrivelse</h2>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-zinc-300 space-y-1">
          <li>Denne appen er under aktiv utvikling og kan oppdateres hyppig.</li>
          <li>RotorReady er en uavhengig treningsapplikasjon. Den er ikke en offisielt godkjent trener.</li>
          <li>Bruk alltid QRH/AFM og operatørens prosedyrer som primær kilde. Ikke ta operative beslutninger basert på appen alene.</li>
        </ul>
        <div>
          <a className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800" href="https://github.com/erhymo/RotorReady#readme" target="_blank" rel="noreferrer">
            Les README (detaljer om bruk, personvern og teknisk)
          </a>
        </div>
      </section>

    </div>
  );
}
