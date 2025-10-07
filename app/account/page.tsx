"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toggleTheme as toggleThemeLib, setThemeSource as setThemeSourceLib, getEffectiveTheme as getEffectiveThemeLib, onThemeChange as onThemeChangeLib, applyTheme as applyThemeLib } from "@/lib/theme";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { auth, db } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { listVariantsByProduct } from "@/lib/models/catalog";
import { getStoredActiveModelVariantId, storeActiveModelVariantId, modelScopedKey } from "@/lib/models/storage";

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
      console.warn(`Could not parse stored data for ${key}`, error);
      localStorage.removeItem(key);
      return null;
    }
  }

  function findWrongSession(): { data: WrongSession; sectionId: string } | null {
    if (typeof window === "undefined") return null;
    const seen = new Set<string>();
    const variantId = getStoredActiveModelVariantId();
    const modelPrefix = modelScopedKey("rr_progress_last_wrong", variantId);
    const legacyPrefix = "rr_progress_last_wrong";

    const candidateSections = [
      "limitations",
      "LIMITATIONS",
      ...history.map((h) => h.section),
      ...history.map((h) => h.section?.toLowerCase?.()).filter(Boolean) as string[],
    ];

    const candidateKeys: string[] = [
      ...candidateSections.map((section) => `${modelPrefix}:${section}`),
      ...candidateSections.map((section) => `${legacyPrefix}:${section}`),
    ];

    const storedKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith(`${modelPrefix}:`) || key.startsWith(`${legacyPrefix}:`)
    );
    candidateKeys.push(...storedKeys);

    for (const key of candidateKeys) {
      if (seen.has(key)) continue;
      seen.add(key);
      const parsed = parseLocalStorage<WrongSession>(key);
      if (!parsed) continue;

      let sectionId = parsed.section || "limitations";
      if (key.startsWith(`${modelPrefix}:`)) {
        sectionId = key.substring((`${modelPrefix}:`).length) || sectionId;
      } else if (key.startsWith(`${legacyPrefix}:`)) {
        sectionId = key.substring((`${legacyPrefix}:`).length) || sectionId;
      }
      return { data: parsed, sectionId };
    }
    return null;
  }

  function routeForWrongSession(sectionId: string): string | null {
    // Deprecated: My Page now launches a mixed cross-section practice via generic ClientQuiz
    const normalized = sectionId.toLowerCase();
    if (normalized === "limitations") return "/limitations-quiz/1";
    return null;
  }

  function startWrongOnly() {
    // Build a mixed set across ALL sections for the active model variant
    const variantId = getStoredActiveModelVariantId();
    const modelWrongPrefix = modelScopedKey("rr_progress_last_wrong", variantId) + ":";
    const modelHistPrefix = modelScopedKey("rr_wrong_history", variantId) + ":";
    const useLegacy = variantId === "AW169";
    const legacyWrongPrefix = useLegacy ? "rr_progress_last_wrong:" : null; // only for AW169 legacy

    const unique: Record<string, any> = {};

    // 1) Collect from rolling histories per section (prefer)
    try {
      for (const key of Object.keys(localStorage)) {
        if (!key.startsWith(modelHistPrefix)) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          for (const sess of arr) {
            if (Array.isArray(sess?.items)) {
              for (const it of sess.items) {
                if (it?.id && !unique[it.id]) unique[it.id] = it;
              }
            }
          }
        }
      }
    } catch {}

    // 2) Collect from last-wrong per section (fallback)
    try {
      for (const key of Object.keys(localStorage)) {
        if (!(key.startsWith(modelWrongPrefix) || (legacyWrongPrefix && key.startsWith(legacyWrongPrefix)))) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const sess = JSON.parse(raw);
        if (Array.isArray(sess?.items)) {
          for (const it of sess.items) {
            if (it?.id && !unique[it.id]) unique[it.id] = it;
          }
        }
      }
    } catch {}

    const items = Object.values(unique) as any[];
    if (!items.length) {
      alert("No wrong-answer set available. Complete a quiz first.");
      return;
    }

    // Normalize minimal shape for ClientQuiz
    const normalizedItems = items.map((it) => {
      const answer = Array.isArray(it?.answer) ? it.answer : (typeof it?.answer === "number" ? [it.answer] : []);
      const type = Array.isArray(answer) && answer.length > 1 ? "multi" : "single";
      const section = (typeof it?.section === "string" && it.section) ? it.section : "mixed";
      return {
        id: String(it.id),
        section,
        type,
        question: String(it.question || "Question"),
        options: Array.isArray(it.options) ? it.options.map(String) : [],
        answer,
        explanation: it.explanation,
        references: Array.isArray(it.references) ? it.references.map(String) : undefined,
        __file: it.__file,
      };
    }).filter((it) => it.options.length >= 2 && it.answer.length >= 1);

    if (!normalizedItems.length) {
      alert("Found wrong answers, but they were not usable. Try retaking a quiz.");
      return;
    }

    // Use generic ClientQuiz override session under a virtual section id
    const virtualSection = "all_wrong";
    try {
      const overrideKey = `${modelScopedKey("quiz_session_override", variantId)}:${virtualSection}`;
      sessionStorage.setItem(overrideKey, JSON.stringify({ items: normalizedItems }));
      window.location.href = `/quiz/${encodeURIComponent(virtualSection)}/all`;
    } catch (e) {
      console.warn("Could not start mixed wrong-only session", e);
      alert("Could not start practice. Please try again.");
    }
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
      setConversationError(error?.message || "Could not load messages");
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
    // Load quiz history (prefer model-scoped; fallback to legacy)
    const variantId = getStoredActiveModelVariantId();
    const modelKey = modelScopedKey("rr_progress", variantId);
    const modelHistory = parseLocalStorage<Summary[]>(modelKey);
    const legacyHistory = parseLocalStorage<Summary[]>("rr_progress");
    const picked = modelHistory || legacyHistory || null;
    if (picked) setHistory(picked);

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
    return <div className="p-8 text-center text-lg text-slate-700 dark:text-zinc-200">Loading…</div>;
  }
  if (!loggedIn) {
    return <div className="p-8 text-center text-lg text-slate-700 dark:text-zinc-200">Redirecting to login…</div>;
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
    try {
      localStorage.removeItem('rr_theme');
      localStorage.removeItem('theme');
    } catch {}
    const next = getEffectiveThemeLib();
    applyThemeLib(next);
    setThemePref('system');
    setEffectiveTheme(next);
  };

  const themeDescription = themePref === 'system'
    ? `Following system (${effectiveTheme === 'dark' ? 'dark' : 'light'})`
    : themePref === 'dark'
      ? 'Manual dark'
      : 'Manual light';

  const themeIcon = effectiveTheme === 'dark' ? '☀️' : '🌙';
  const themeButtonLabel = effectiveTheme === 'dark' ? 'Light theme' : 'Dark theme';

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
      console.warn("Could not update active model on server", e);
    } finally {
      if (typeof window !== "undefined") window.location.reload();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <BackButton className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl mb-2" />
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Page</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-2">Your access and progress in RotorReady.</p>
      </header>

      <section className="space-y-3">
        <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/40 dark:border-amber-400 dark:bg-amber-900/40 px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-slate-900 dark:text-zinc-100">Theme</div>
            <div className="text-sm text-slate-700 dark:text-zinc-300 mt-0.5">{themeDescription}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTheme}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
              aria-label={`Switch to ${themeButtonLabel.toLowerCase()}`}
            >
              <span className="text-lg" aria-hidden>{themeIcon}</span>
              <span>{themeButtonLabel}</span>
            </button>
            {themePref !== 'system' && (
              <button
                onClick={followSystem}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Follow system
              </button>
            )}
          </div>
        </div>
        <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50/40 dark:border-emerald-400 dark:bg-emerald-900/40 px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="font-semibold text-slate-900 dark:text-zinc-100">Access</div>
            <div className="text-sm text-slate-700 dark:text-zinc-300 mt-0.5">
              {loggedIn ? "Logged in" : <span><a href="/login" className="underline">Log in</a> to view your active subscription.</span>}
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
                        Coming soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">Purchases are activated via Stripe Checkout (see Paywall) or by an admin.</p>
          </div>
          {loggedIn && (
            <button
              className="px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-900 mt-2"
              onClick={async () => {
                await import("firebase/auth").then(({ getAuth, signOut }) => signOut(getAuth(auth.app)));
                window.location.href = "/";
              }}

            >
              Log out
            </button>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/40 dark:border-blue-400 dark:bg-blue-900/40 px-5 py-4">
          <div className="font-semibold text-slate-900 dark:text-zinc-100">Progress</div>
          {attempts === 0 ? (
            <p className="text-gray-600 dark:text-zinc-300">No completed quizzes yet.</p>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-slate-900 dark:text-zinc-100">Attempts: <b>{attempts}</b></div>
              {last && <div className="text-sm text-slate-900 dark:text-zinc-100">Last: {formatSection(last.section)} — {last.correct}/{last.total} ({Math.round(last.percent)}%)</div>}
              {best && <div className="text-sm text-slate-900 dark:text-zinc-100">Best: {formatSection(best.section)} — {best.correct}/{best.total} ({Math.round(best.percent)}%)</div>}
              <details className="mt-2">
                <summary className="cursor-pointer text-slate-900 dark:text-white">Show history</summary>
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
              <div className="font-semibold text-white dark:text-zinc-100">Practice wrong answers only</div>
              <div className="text-sm text-gray-300 dark:text-zinc-300">Builds a set of questions you recently got wrong.</div>
            </div>
            <button onClick={startWrongOnly} className="px-4 py-2 rounded-lg border bg-slate-900 text-white dark:bg-zinc-900 dark:text-zinc-100">Start</button>
          </div>
        </div>
      </section>


      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact RotorReady</h2>
            <p className="text-sm text-slate-600 dark:text-zinc-300">Ask questions or share feedback directly with us.</p>
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
            Refresh
          </button>
        </div>

        {conversationError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
            {conversationError}
          </div>
        )}

        {conversationLoading ? (
          <p className="text-sm text-slate-600 dark:text-zinc-300">Loading messages…</p>
        ) : sortedMessages.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-zinc-300">No messages yet. Send us feedback below.</p>
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
                      {isAdmin ? "RotorReady" : "You"} — {new Date(msg.createdAt).toLocaleString()}
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
            placeholder="Write your message…"
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
              {sendingMessage ? "Sending…" : "Send message"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">About the app and disclaimer</h2>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-zinc-300 space-y-1">
          <li>This app is under active development and may be updated frequently.</li>
          <li>RotorReady is an independent training application. It is not an officially approved trainer.</li>
          <li>Always use the QRH/AFM and your operator's procedures as the primary source. Do not make operational decisions based on the app alone.</li>
        </ul>
        <div>
          <a className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800" href="https://github.com/erhymo/RotorReady#readme" target="_blank" rel="noreferrer">
            Read the README (details on usage, privacy, and technical)
          </a>
        </div>
      </section>

    </div>
  );
}
