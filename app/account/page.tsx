"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toggleTheme as toggleThemeLib, setThemeSource as setThemeSourceLib, getEffectiveTheme as getEffectiveThemeLib, onThemeChange as onThemeChangeLib, applyTheme as applyThemeLib } from "@/lib/theme";
import AppTopBar from "@/components/AppTopBar";
import { listVariantsByProduct } from "@/lib/models/catalog";
import { getStoredActiveModelVariantId, storeActiveModelVariantId, modelScopedKey } from "@/lib/models/storage";
import { writeQuizOverrideSession } from "@/lib/quiz/overrideSession";
import { tryUnlockCode } from "@/lib/unlockCodes";

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

type Entitlements = { AW169?: boolean; AW169_EP?: boolean; AW189?: boolean; AW139?: boolean; H125?: boolean; R44_II?: boolean };

const ACCOUNT_FEATURES_ENABLED = false;
const OPEN_ACCESS_ENTITLEMENTS: Entitlements = {
  AW169: true,
  AW169_EP: true,
  AW189: true,
  AW139: true,
  H125: true,
  R44_II: true,
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
      writeQuizOverrideSession(variantId, virtualSection, normalizedItems);
      window.location.href = `/quiz/${encodeURIComponent(virtualSection)}/all`;
    } catch (e) {
      console.warn("Could not start mixed wrong-only session", e);
      alert("Could not start practice. Please try again.");
    }
  }
  const [history, setHistory] = useState<Summary[]>([]);
  const [ents, setEnts] = useState<Entitlements>(OPEN_ACCESS_ENTITLEMENTS);
  const [email, setEmail] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(true);
  const [themePref, setThemePref] = useState<'system'|'light'|'dark'>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light'|'dark'>(() => (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [userUid, setUserUid] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationThread | null>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [supportTapCount, setSupportTapCount] = useState(0);
  const [showUnlockField, setShowUnlockField] = useState(false);
  const [unlockCode, setUnlockCode] = useState("");
  const [unlockStatus, setUnlockStatus] = useState<"idle" | "error" | "success">("idle");

  const handleSupportTap = useCallback(() => {
    setSupportTapCount((n) => {
      const next = n + 1;
      if (next >= 2) {
        setShowUnlockField(true);
        return 0;
      }
      return next;
    });
  }, []);

  const handleUnlockSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (tryUnlockCode(unlockCode)) {
      setUnlockStatus("success");
      setUnlockCode("");
    } else {
      setUnlockStatus("error");
    }
  }, [unlockCode]);
  const [sendingMessage, setSendingMessage] = useState(false);


		  const loadConversation = useCallback(async (uid: string) => {
	    setConversationLoading(true);
	    setConversationError(null);
	    try {
	      const headers: Record<string, string> = {};
	      try {
	        const { auth } = await import("@/lib/firebase/client");
	        const user = auth?.currentUser;
	        if (user && user.uid === uid) {
	          const token = await user.getIdToken().catch(() => null);
	          if (token) {
	            headers.Authorization = `Bearer ${token}`;
	          }
	        }
	      } catch {
	        // If we cannot obtain a token, the API will return 401 and we surface a friendly error.
	      }
		      const res = await fetch(`/api/messages`, { cache: "no-store", headers });
		      if (!res.ok) {
		        if (res.status === 401) {
		          throw new Error("You are no longer signed in. Reload the page and sign in again.");
		        }
		        throw new Error(`HTTP ${res.status}`);
		      }
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

    if (!ACCOUNT_FEATURES_ENABLED) {
      setEnts(OPEN_ACCESS_ENTITLEMENTS);
      setAuthChecked(true);
      return;
    }

    let cancelled = false;
    let resolved = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        const [{ onAuthStateChanged }, { auth, db }] = await Promise.all([
          import("firebase/auth"),
          import("@/lib/firebase/client"),
        ]);

        if (!auth) {
          if (!cancelled) {
            setAuthChecked(true);
            setLoggedIn(false);
          }
          return;
        }

        const applyState = (user: any, entitlements?: Record<string, unknown>) => {
          if (cancelled) return;
          setEmail(user?.email || null);
          setUserUid(user?.uid || null);
          setLoggedIn(Boolean(user));
          if (entitlements) {
            setEnts(entitlements as Entitlements);
          } else {
            setEnts({});
          }
          resolved = true;
          setAuthChecked(true);
        };

        const loadEntitlements = async (user: any) => {
          if (!user || !db) return {} as Record<string, unknown>;
          try {
            const { doc, getDoc } = await import("firebase/firestore/lite");
            const snap = await getDoc(doc(db, "users", user.uid));
            return snap.data()?.entitlements || {};
          } catch {
            return {} as Record<string, unknown>;
          }
        };

        const handleUser = async (user: any) => {
          applyState(user);
          if (user) {
            const entitlements = await loadEntitlements(user);
            if (!cancelled) {
              setEnts(entitlements as Entitlements);
            }
          } else {
            setConversation(null);
          }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          handleUser(user as any);
        });

        if (auth.currentUser) {
          handleUser(auth.currentUser);
        }

        const fallbackTimer = setTimeout(() => {
          if (!resolved && !cancelled) {
            setAuthChecked(true);
          }
        }, 5000);

        cleanup = () => {
          cancelled = true;
          clearTimeout(fallbackTimer);
          try { unsubscribe(); } catch {}
        };
      } catch (e) {
        if (!cancelled) {
          setAuthChecked(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      try { cleanup?.(); } catch {}
    };
  }, []);

  useEffect(() => {
    if (!ACCOUNT_FEATURES_ENABLED) return;
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
		      setConversationError("You must be signed in to send messages.");
		      return;
		    }
		    const trimmed = messageText.trim();
		    if (!trimmed) return;
		    let token: string | null = null;
	    try {
	      const { auth } = await import("@/lib/firebase/client");
	      const user = auth?.currentUser;
	      if (!user || user.uid !== userUid) {
	        setConversationError("You are no longer signed in. Reload the page and sign in again.");
	        return;
	      }
	      token = await user.getIdToken().catch(() => null);
	      if (!token) {
	        setConversationError("Couldn't obtain a login token. Reload the page and try again.");
	        return;
	      }
	    } catch (error: any) {
	      setConversationError(error?.message || "Couldn't prepare login for messaging.");
	      return;
	    }
	    setSendingMessage(true);
	    setConversationError(null);
	    try {
	      const headers: Record<string, string> = {
	        "Content-Type": "application/json",
	        Authorization: `Bearer ${token!}`,
	      };
	      const res = await fetch("/api/messages", {
	        method: "POST",
	        headers,
	        body: JSON.stringify({ email, message: trimmed }),
	      });
	      if (!res.ok) {
	        const text = await res.text();
	        throw new Error(text || "Couldn't send message");
	      }
	      const data = await res.json();
	      setConversation(data?.conversation || null);
	      setMessageText("");
	    } catch (error: any) {
	      setConversationError(error?.message || "Couldn't send message");
	    } finally {
	      setSendingMessage(false);
	    }
	  }, [email, messageText, userUid]);

  const unreadUserMessages = conversation?.messages?.filter((msg) => msg.from === "admin" && !msg.readByUser).length ?? 0;

	  if (!authChecked) {
	    return <div className="p-8 text-center text-lg text-slate-700 dark:text-zinc-200">Loading…</div>;
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
    try {
      const root = document.documentElement;
      if (next === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
      const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (meta) meta.content = next === 'dark' ? '#0b0f19' : '#f8fafc';
    } catch {}
  };

  const followSystem = () => {
    setThemeSourceLib('system');
    try {
      localStorage.removeItem('rr_theme');
      localStorage.removeItem('theme');
    } catch {}
    const next = getEffectiveThemeLib();
    applyThemeLib(next);
    try {
      const root = document.documentElement;
      if (next === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
      const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
      if (meta) meta.content = next === 'dark' ? '#0b0f19' : '#f8fafc';
    } catch {}
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

  const aw169Variants = listVariantsByProduct("AW169");
  const h125Variants = listVariantsByProduct("H125");
  const h135t3Variants = listVariantsByProduct("H135_T3");
  const h145d2Variants = listVariantsByProduct("H145_D2");
  const h145d3Variants = listVariantsByProduct("H145_D3");
  const activeVariantId = getStoredActiveModelVariantId();
  const selectVariant = (id: string) => {
    // Store locally immediately for a seamless experience
    try { storeActiveModelVariantId(id); } catch {}
    if (typeof window !== "undefined") window.location.reload();
  };

  return (
    <>
      <AppTopBar title="Settings" backHref="/" backLabel="Home" />
      <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-zinc-300 mt-2">Choose aircraft model, theme and local preferences.</p>
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
              RotorReady is free and open. No login is required for training, quizzes, procedures or offline packages.
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/70 p-1 dark:border-zinc-700 dark:bg-zinc-950/40">
                <span className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">AW169</span>
                {aw169Variants.map((v) => {
                  const isActive = activeVariantId === v.id;
                  const label = v.id === "AW169_EP" ? "EP" : "Standard";
                  return (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => selectVariant(v.id)}
                      className={`rounded-lg px-3 py-1 text-sm transition ${
                        isActive
                          ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-300 dark:bg-zinc-800 dark:text-emerald-200 dark:ring-emerald-700/70"
                          : "text-slate-600 hover:bg-white/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>


              <button
                type="button"
                key="AW139"
                onClick={() => selectVariant("AW139")}
                className={`px-3 py-1 rounded-lg border text-sm transition ${
                  activeVariantId === "AW139"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "bg-white dark:bg-zinc-900 dark:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-600"
                }`}
              >
                AW139
              </button>

              <button
                type="button"
                key="AW189"
                onClick={() => selectVariant("AW189")}
                className={`px-3 py-1 rounded-lg border text-sm transition ${
                  activeVariantId === "AW189"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "bg-white dark:bg-zinc-900 dark:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-600"
                }`}
              >
                AW189
              </button>

              <button
                type="button"
                key="R44_II"
                onClick={() => selectVariant("R44_II")}
                className={`px-3 py-1 rounded-lg border text-sm transition ${
                  activeVariantId === "R44_II"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "bg-white dark:bg-zinc-900 dark:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-600"
                }`}
              >
                R44 II Raven
              </button>

              <button
                type="button"
                key="S92"
                onClick={() => selectVariant("S92")}
                className={`px-3 py-1 rounded-lg border text-sm transition ${
                  activeVariantId === "S92"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "bg-white dark:bg-zinc-900 dark:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-600"
                }`}
              >
                S-92
              </button>

              {h125Variants.map((v) => {
                const coming = v.status === "coming_soon";
                const isActive = activeVariantId === v.id;
                const label = v.label.includes("/") ? v.label.split("/")[1].trim() : v.label;
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
                    {label}
                    {coming && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-amber-400/70 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/30 dark:text-amber-200">
                        Coming soon
                      </span>
                    )}
                  </button>
                );
              })}

              {h135t3Variants.map((v) => {
                const coming = v.status === "coming_soon";
                const isActive = activeVariantId === v.id;
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
                    {v.label}
                    {coming && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-amber-400/70 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/30 dark:text-amber-200">
                        Coming soon
                      </span>
                    )}
                  </button>
                );
              })}

              {h145d2Variants.map((v) => {
                const coming = v.status === "coming_soon";
                const isActive = activeVariantId === v.id;
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
                    {v.label}
                    {coming && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-amber-400/70 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/30 dark:text-amber-200">
                        Coming soon
                      </span>
                    )}
                  </button>
                );
              })}

              {h145d3Variants.map((v) => {
                const coming = v.status === "coming_soon";
                const isActive = activeVariantId === v.id;
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
                    {v.label}
                    {coming && (
                      <span className="ml-2 inline-flex items-center rounded-full border border-amber-400/70 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/30 dark:text-amber-200">
                        Coming soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">Training access is free while RotorReady is in active development.</p>
          </div>
          {loggedIn && (
            <button
              className="px-4 py-2 rounded bg-gray-800 text-white text-sm hover:bg-gray-900 mt-2"
              onClick={async () => {
                const [{ signOut }, { auth }] = await Promise.all([
                  import("firebase/auth"),
                  import("@/lib/firebase/client"),
                ]);
                await signOut(auth!);
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

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-3">
        <h2
          className="text-lg font-semibold text-slate-900 dark:text-white select-none"
          onClick={handleSupportTap}
        >
          Support
        </h2>
        <p className="text-sm text-slate-700 dark:text-zinc-300">
          For support, correction requests or feedback, use the public support page. No account is required.
        </p>
        <a href="/support" className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          Open support
        </a>
        {showUnlockField && (
          <form onSubmit={handleUnlockSubmit} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={unlockCode}
              onChange={(e) => { setUnlockCode(e.target.value); setUnlockStatus("idle"); }}
              placeholder="Enter code"
              autoComplete="off"
              autoCapitalize="characters"
              className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Unlock
            </button>
            {unlockStatus === "error" && (
              <span className="text-sm text-red-600 dark:text-red-400">Wrong code</span>
            )}
            {unlockStatus === "success" && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400">Unlocked</span>
            )}
          </form>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">About the app and disclaimer</h2>
        <ul className="list-disc ml-5 text-sm text-slate-700 dark:text-zinc-300 space-y-1">
          <li>This app is under active development and may be updated frequently.</li>
          <li>RotorReady is an independent training application. It is not an officially approved trainer.</li>
          <li>Always use the QRH/AFM and your operator&apos;s procedures as the primary source. Do not make operational decisions based on the app alone.</li>
        </ul>
      </section>
    </div>
    </>
  );
}
