"use client";

export const dynamic = "force-dynamic";


import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore/lite";

type AdminFlag = {
  id: string;
  section: string;
  sectionId?: string;
  questionId: string;
  dataSource?: "sections" | "all-questions";
  dataFile?: string | null;
  snapshot?: {
    question?: string;
    options?: string[];
    explanation?: string;
    references?: string[];
    answer?: number[];
  };
  reason?: string;
  userId?: string;
  email?: string;
  name?: string;
  createdAt: string;
  status: "open" | "reviewed-OK" | "rejected";
};

type AdminConversationMessage = {
  id: string;
  from: "user" | "admin";
  body: string;
  createdAt: string;
  readByAdmin: boolean;
  readByUser: boolean;
};

type AdminConversation = {
  userId: string;
  userEmail?: string | null;
  messages: AdminConversationMessage[];
  createdAt: string;
  updatedAt: string;
  unreadForAdmin: number;
  unreadForUser: number;
};

type SubscriptionMetrics = {
  totalUsers: number;
  totals: {
    active: number;
    trials: number;
    pastDue: number;
  };
  perModel: Record<string, {
    active: number;
    trials: number;
    pastDue: number;
  }>;
};

type TrafficMetrics = {
  totalTrackedUsers: number;
  activeLast7Days: number;
  activeLast30Days: number;
  activeToday: number;
};

export default function AdminPage() {
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [flags, setFlags] = useState<AdminFlag[]>([]);
  const [flagsLoading, setFlagsLoading] = useState(true);
  const [flagsError, setFlagsError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SubscriptionMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [trafficMetrics, setTrafficMetrics] = useState<TrafficMetrics | null>(null);
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [trafficError, setTrafficError] = useState<string | null>(null);
  const [trafficRange, setTrafficRange] = useState<"7d" | "30d" | "all">("7d");
  const [clientFallback, setClientFallback] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);


	  const refreshMessages = useCallback(async () => {
    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const res = await fetch("/api/admin/messages", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      const list: AdminConversation[] = Array.isArray(data?.conversations) ? data.conversations : [];
      setConversations(list);
      setMessagesError(data?.error || data?.devWarning || null);
      setSelectedUserId((prev) => prev && list.some((conv) => conv.userId === prev) ? prev : (list[0]?.userId ?? null));
	    } catch (error: any) {
	      setMessagesError(error?.message || "Could not fetch messages");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  async function refreshFlags() {
    setFlagsLoading(true);
    setFlagsError(null);
    try {
      const res = await fetch("/api/admin/flags", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      const serverFlags = Array.isArray(data?.flags) ? data.flags : [];
      if (res.ok && !data?.error && serverFlags.length > 0) {
        setFlags(serverFlags);
        setClientFallback(false);
        return;
      }
      // Fallback: try client Firestore (no Vercel env needed)
      if (db) {
        try {
          const coll = collection(db as any, 'flags');
          const snap = await getDocs(coll);
          const list = snap.docs.map((d) => {
            const doc: any = d.data();
            const created = typeof doc.createdAt === 'string'
              ? doc.createdAt
              : (doc.createdAt?.toDate ? doc.createdAt.toDate().toISOString() : new Date().toISOString());
            return {
              id: d.id,
              section: String(doc.section || ''),
              sectionId: doc.sectionId || undefined,
              questionId: String(doc.questionId || ''),
              dataSource: doc.dataSource,
              dataFile: doc.dataFile ?? null,
              snapshot: doc.snapshot || undefined,
              reason: doc.reason || undefined,
              userId: doc.userId || undefined,
              email: doc.email || undefined,
              createdAt: created,
              status: (doc.status as AdminFlag['status']) || 'open',
            } as AdminFlag;
          });
          list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
          setFlags(list);
          setClientFallback(true);
          setFlagsError(data?.error || null);
          return;
        } catch (e: any) {
          setFlags(serverFlags);
          setFlagsError(data?.error || e?.message || 'Kunne ikke hente flagg');
        }
      } else {
        setFlags(serverFlags);
        setFlagsError(data?.error || 'Kunne ikke hente flagg (Firebase-klient mangler)');
      }
	    } catch (error: any) {
	      setFlagsError(error?.message || 'Could not fetch flagged questions');
    } finally {
      setFlagsLoading(false);
    }
  }

  const refreshMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const res = await fetch("/api/admin/subscriptions", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setMetrics(data?.metrics ?? null);
	      setMetricsError(data?.error || data?.devWarning || null);
	    } catch (error: any) {
	      setMetricsError(error?.message || "Could not fetch subscription metrics");
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMessages();
  }, [refreshMessages]);

  useEffect(() => {
    refreshFlags();
  }, []);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  const refreshTraffic = useCallback(async () => {
    setTrafficLoading(true);
    setTrafficError(null);
    try {
      const res = await fetch("/api/admin/traffic", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      const metrics: TrafficMetrics | null = data?.metrics ?? null;
      setTrafficMetrics(metrics);
	      setTrafficError(data?.error || data?.devWarning || null);
	    } catch (error: any) {
	      setTrafficError(error?.message || "Could not fetch traffic statistics");
    } finally {
      setTrafficLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTraffic();
  }, [refreshTraffic]);

  async function reviewFlag(id: string, status: "reviewed-OK" | "rejected") {
	    const res = await fetch("/api/admin/flags/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
	    });
	    if (!res.ok) throw new Error("Could not update flag status");
  }

  async function handleKeep(flag: AdminFlag) {
    setActionId(flag.id);
    try {
      await reviewFlag(flag.id, "reviewed-OK");
      setFlags((prev) => prev.map((f) => (f.id === flag.id ? { ...f, status: "reviewed-OK" } : f)));
	    } catch (error: any) {
	      setFlagsError(error?.message || "Could not mark question as kept");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(flag: AdminFlag) {
    setActionId(flag.id);
    try {
      const res = await fetch("/api/admin/questions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: flag.sectionId || flag.section || "all-questions",
          id: flag.questionId,
          dataSource: flag.dataSource,
          dataFile: flag.dataFile,
        }),
      });
	      if (!res.ok) {
	        const text = await res.text();
	        throw new Error(text || "Could not delete question");
	      }
      await reviewFlag(flag.id, "rejected");
      setFlags((prev) => prev.map((f) => (f.id === flag.id ? { ...f, status: "rejected" } : f)));
	    } catch (error: any) {
	      setFlagsError(error?.message || "Could not delete question");
    } finally {
      setActionId(null);
    }
  }

  const openFlags = useMemo(
    () => flags.filter((flag) => flag.status === "open").sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [flags],
  );

  const unreadMessages = useMemo(
    () => conversations.reduce((sum, conv) => sum + (conv.unreadForAdmin ?? 0), 0),
    [conversations],
  );

  const selectedConversation = useMemo(() => {
    if (!selectedUserId) return null;
    return conversations.find((conv) => conv.userId === selectedUserId) || null;
  }, [conversations, selectedUserId]);

  const markConversationRead = useCallback(async (userId: string) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, target: "admin" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.conversation) {
          setConversations((prev) => {
            const updated = prev.map((conv) => (conv.userId === userId ? data.conversation : conv));
            return updated.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
          });
        }
      }
	    } catch (error) {
	      console.warn("Could not mark messages as read", error);
    }
  }, []);

  const handleSelectConversation = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const handleReply = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedConversation) return;
    const trimmed = replyText.trim();
    if (!trimmed) return;
    setReplying(true);
    setMessagesError(null);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedConversation.userId, message: trimmed }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Kunne ikke sende svar");
      }
      const data = await res.json();
      if (data?.conversation) {
        setConversations((prev) => {
          const updated = prev.map((conv) => (conv.userId === data.conversation.userId ? data.conversation : conv));
          return updated.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
        });
        setReplyText("");
        setSelectedUserId(data.conversation.userId);
      }
	    } catch (error: any) {
	      setMessagesError(error?.message || "Could not send reply");
    } finally {
      setReplying(false);
    }
  }, [replyText, selectedConversation]);

  useEffect(() => {
    if (!selectedUserId) return;
    const convo = conversations.find((conv) => conv.userId === selectedUserId);
    if (convo && convo.unreadForAdmin > 0) {
      markConversationRead(selectedUserId);
    }
  }, [selectedUserId, conversations, markConversationRead]);

  useEffect(() => {
    setReplyText("");
  }, [selectedUserId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12 px-4">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin</h1>
          <p className="text-sm text-slate-600 dark:text-zinc-300">
	            Review messages from users, reply directly, and handle flagged questions.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
	            <div>
	              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Subscriptions</h2>
	              <p className="text-xs text-slate-500 dark:text-zinc-400">
	                Total users: {metrics?.totalUsers ?? 0}
	              </p>
              {metrics && (
                <div className="mt-1 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-zinc-400">
	                  <div>
	                    <div className="font-semibold text-slate-800 dark:text-zinc-100">Subscribers (active)</div>
	                    <div>{metrics.totals.active}</div>
	                  </div>
	                  <div>
	                    <div className="font-semibold text-slate-800 dark:text-zinc-100">Subscriptions (total)</div>
	                    <div>{metrics.totals.active + metrics.totals.trials + metrics.totals.pastDue}</div>
	                  </div>
                </div>
              )}
            </div>
            <button
              onClick={refreshMetrics}
              disabled={metricsLoading}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
	              Refresh
            </button>
          </div>

          {metricsError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
              {metricsError}
            </div>
          )}

	          {metricsLoading ? (
	            <p className="text-sm text-slate-600 dark:text-zinc-300">Loading subscription metrics…</p>
	          ) : metrics ? (
            <div className="space-y-4">
	              <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-700 dark:text-zinc-300">
	                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
	                  Active: {metrics.totals.active}
	                </span>
	                <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
	                  Trial period: {metrics.totals.trials}
	                </span>
	                <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
	                  Payment failed: {metrics.totals.pastDue}
	                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(metrics.perModel).map(([modelId, counts]) => (
                  <div
                    key={modelId}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900/60"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{modelId}</span>
	                    <span className="text-xs text-slate-600 dark:text-zinc-400">
	                      Active {counts.active} • Trials {counts.trials} • Failed {counts.pastDue}
	                    </span>
                  </div>
                ))}
              </div>
            </div>
	          ) : (
	            <p className="text-sm text-slate-600 dark:text-zinc-300">No subscription metrics available.</p>
	          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
	            <div>
	              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Traffic</h2>
	              <p className="text-xs text-slate-500 dark:text-zinc-400">
	                Unique users last week vs. 30 days and total traffic into the app.
	              </p>
            </div>
	            <button
	              onClick={refreshTraffic}
	              disabled={trafficLoading}
	              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
	            >
	              Refresh
	            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setTrafficRange("7d")}
              className={`rounded-full px-3 py-1 border text-[11px] font-medium transition ${trafficRange === "7d" ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-100" : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}
	            >
	              Last 7 days
	            </button>
            <button
              type="button"
              onClick={() => setTrafficRange("30d")}
              className={`rounded-full px-3 py-1 border text-[11px] font-medium transition ${trafficRange === "30d" ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-100" : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}
	            >
	              Last 30 days
	            </button>
            <button
              type="button"
              onClick={() => setTrafficRange("all")}
              className={`rounded-full px-3 py-1 border text-[11px] font-medium transition ${trafficRange === "all" ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-100" : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}
            >
              All time
            </button>
          </div>

          {trafficError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
              {trafficError}
            </div>
          )}

	          {trafficLoading ? (
	            <p className="text-sm text-slate-600 dark:text-zinc-300">Loading traffic statistics…</p>
	          ) : !trafficMetrics ? (
	            <p className="text-sm text-slate-600 dark:text-zinc-300">No traffic data available yet.</p>
	          ) : (
            <div className="grid gap-4 md:grid-cols-3 mt-2">
              <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900/70">
	                <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">Total tracked</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {trafficMetrics.totalTrackedUsers}
                </div>
	                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">Users we have seen at least once.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900/70">
	                <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">Active last 7 days</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {trafficMetrics.activeLast7Days}
                </div>
	                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">Unique users who have visited in the last week.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 p-4 text-sm dark:border-zinc-700 dark:bg-zinc-900/70">
	                <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-400">Active last 30 days</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                  {trafficMetrics.activeLast30Days}
                </div>
	                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">Gives you a broader picture of traffic into the app.</p>
              </div>
            </div>
          )}
        </section>

	        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 space-y-4">
	          <div className="flex flex-wrap items-center justify-between gap-3">
	            <div>
	              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Messages</h2>
	              <p className="text-xs text-slate-500 dark:text-zinc-400">Unread messages: {unreadMessages}</p>
	            </div>
	            <button
	              onClick={refreshMessages}
	              disabled={messagesLoading}
	              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
	            >
	              Refresh
	            </button>
	          </div>

          {messagesError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
              {messagesError}
            </div>
          )}

	          {messagesLoading ? (
	            <p className="text-sm text-slate-600 dark:text-zinc-300">Loading messages…</p>
	          ) : conversations.length === 0 ? (
	            <p className="text-sm text-slate-600 dark:text-zinc-300">No messages submitted yet.</p>
	          ) : (
            <div className="grid gap-4 lg:grid-cols-[260px,1fr]">
              <div className="space-y-2">
                {conversations.map((conv) => {
                  const isSelected = conv.userId === selectedUserId;
                  const unread = conv.unreadForAdmin ?? 0;
                  const lastMessage = conv.messages?.[conv.messages.length - 1];
                  return (
                    <button
                      key={conv.userId}
                      onClick={() => handleSelectConversation(conv.userId)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30"
                          : "border-slate-200 bg-white hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {conv.userEmail || conv.userId}
                        </div>
                        {unread > 0 && (
                          <span className="inline-flex min-w-[1.5rem] justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                            {unread}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
	                      <div className="mt-1 text-xs text-slate-500 dark:text-zinc-400 truncate">
	                        {lastMessage.from === "admin" ? "You: " : "User: "}
	                        {lastMessage.body.slice(0, 60)}{lastMessage.body.length > 60 ? "…" : ""}
	                      </div>
                      )}
                      <div className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
                        {new Date(conv.updatedAt).toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70">
                {selectedConversation ? (
                  <div className="flex h-full flex-col gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {selectedConversation.userEmail || selectedConversation.userId}
                      </div>
	                      <div className="text-xs text-slate-500 dark:text-zinc-400">
	                        Updated {new Date(selectedConversation.updatedAt).toLocaleString()}
	                      </div>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                      {selectedConversation.messages.map((msg) => {
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
	                                {isAdmin ? "RotorReady" : "User"} — {new Date(msg.createdAt).toLocaleString()}
	                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <form onSubmit={handleReply} className="space-y-3">
	                      <textarea
	                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400 dark:focus:ring-blue-900/60"
	                        placeholder="Write your reply…"
	                        value={replyText}
	                        onChange={(event) => setReplyText(event.target.value)}
	                        rows={4}
	                        disabled={replying}
	                      />
	                      <div className="flex items-center justify-end gap-2">
	                        <button
	                          type="submit"
	                          disabled={replying || !replyText.trim() || !selectedConversation}
	                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
	                        >
	                          {replying ? "Sending…" : "Send reply"}
	                        </button>
	                      </div>
                    </form>
                  </div>
                ) : (
	                  <p className="text-sm text-slate-600 dark:text-zinc-300">Select a conversation to read and reply.</p>
                )}
              </div>
            </div>
          )}
        </section>

	        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
	          <div className="flex items-center justify-between gap-3">
	            <div>
	              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Flagged questions</h2>
	              <p className="text-xs text-slate-500 dark:text-zinc-400">Questions flagged from quizzes are shown here for manual review.</p>
	            </div>
	              {clientFallback && (
	                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
	                  Temporary display via Firebase client (without server credentials). Admin actions are disabled.
	                </p>
	              )}

	            <button
	              onClick={refreshFlags}
	              disabled={flagsLoading}
	              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
	            >
	              Refresh
	            </button>
	          </div>

          {flagsError && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-200">
              {flagsError}
            </div>
          )}

	          {flagsLoading ? (
	            <p className="mt-6 text-sm text-slate-600 dark:text-zinc-300">Loading flagged questions …</p>
	          ) : openFlags.length === 0 ? (
	            <p className="mt-6 text-sm text-slate-600 dark:text-zinc-300">No open flags right now.</p>
	          ) : (
            <ul className="mt-6 space-y-4">
              {openFlags.map((flag) => {
                const snapshot = flag.snapshot || {};
                const answers = snapshot.answer || [];
                return (
                  <li
                    key={flag.id}
                    className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/70"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">{flag.section}</div>
                        <button onClick={() => { try { navigator.clipboard?.writeText(flag.questionId); setCopiedId(flag.id); window.setTimeout(() => setCopiedId(null), 1200); } catch {} }}
                                title="Click to copy ID"
                                className="text-sm font-mono text-slate-600 hover:text-slate-800 dark:text-zinc-300 dark:hover:text-zinc-100">
                          ID: {flag.questionId}{copiedId === flag.id ? " \u2713" : ""}
                        </button>
                      </div>
                      <div className="text-xs text-slate-400 dark:text-zinc-500">
                        {new Date(flag.createdAt).toLocaleString()}
                      </div>
                    </div>
	                    <div className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
	                      {snapshot.question || "(Question text missing)"}
	                    </div>
                    {snapshot.options && snapshot.options.length > 0 && (
                      <ul className="mt-3 space-y-1 text-sm">
                        {snapshot.options.map((option, index) => {
                          const isCorrect = answers.includes(index);
                          return (
                            <li
                              key={index}
                              className={`rounded-lg border px-3 py-2 ${
                                isCorrect
                                  ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-100"
                                  : "border-slate-200 text-slate-700 dark:border-zinc-700 dark:text-zinc-200"
                              }`}
                            >
                              <span className="mr-2 text-xs font-semibold opacity-60">{index + 1}.</span>
                              {option}
                            </li>
                          );
                        })}
                      </ul>
                    )}
	                    {snapshot.explanation && (
	                      <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">
	                        Explanation: {snapshot.explanation}
	                      </p>
	                    )}
	                    {flag.reason && (
	                      <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">User comment: {flag.reason}</p>
	                    )}
	                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
	                      <span>Source: {flag.dataSource === "all-questions" ? "Master (all-questions)" : (flag.sectionId || flag.section)}</span>
	                      {(flag.name || flag.email || flag.userId) && <span>• Reported by: {flag.name || flag.email || flag.userId}</span>}
	                      {flag.dataFile && <span>• File: {flag.dataFile}</span>}
	                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
	                      <button
	                        onClick={() => handleKeep(flag)}
	                        disabled={actionId === flag.id || clientFallback}
	                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
	                      >
	                        Keep
	                      </button>
	                      <button
	                        onClick={() => handleDelete(flag)}
	                        disabled={actionId === flag.id || clientFallback}
	                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
	                      >
	                        Delete from database
	                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Hurtigtilgang</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-zinc-300">
            <li>• Oppdater quiz-innhold og seksjoner</li>
            <li>• Se brukers tilbakemeldinger og flagg</li>
            <li>• Administrer Stripe/tilgang og nedlastinger</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Login information</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">
          Admin username and password are configured via the server environment variables <span className="font-mono">ADMIN_USERNAME</span> and <span className="font-mono">ADMIN_PASSWORD</span>.
        </p>
        <p className="mt-3 text-xs text-slate-500 dark:text-zinc-400">
          In development you can use the default user <span className="font-mono">admin</span> / <span className="font-mono">rotorready2025</span> if custom variables are not set.
        </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
          <button
            onClick={() => { window.location.href = "/admin/users"; }}
            className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-left transition hover:bg-slate-100 dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:bg-zinc-800"
            aria-label="Open user list (email)"
          >
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Brukere (e-post)</div>
              <div className="text-xs text-slate-600 dark:text-zinc-400">Click to open the full overview at the bottom of the page</div>
            </div>
            <span className="text-slate-400">›</span>
          </button>
        </section>

        <footer className="text-xs text-slate-500 dark:text-zinc-400">
          More tools and panels will be added here over time.
        </footer>
      </div>
    </div>
  );
}
