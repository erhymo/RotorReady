"use client";

import { createElement, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { BackButton } from "@/app/components/BackButton";
import { fetchContentJson } from "@/lib/contentUrl";
import { useActiveModelVariant } from "@/lib/models/hooks";

type AW169Procedure = { slug: string; title: string; mainClass: string; html: string };

// The AW169 procedures are typeset documents rather than a list of steps — each
// one has its own mix of leader tables, figures, notes and caution panels. Their
// markup is stored as content and rebuilt here through this whitelist, element by
// element: nothing is ever handed to dangerouslySetInnerHTML, and anything not on
// the list is dropped rather than rendered.
const ALLOWED_TAGS = new Set([
  "header", "section", "footer", "div", "p", "h1", "h2", "ul", "ol", "li", "span", "sub", "b", "img", "br",
]);

function toReact(node: ChildNode, key: number): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tag)) return null;

  const props: Record<string, unknown> = { key };
  const className = el.getAttribute("class");
  if (className) props.className = className;
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) props["aria-label"] = ariaLabel;

  if (tag === "br") return <br key={key} />;

  if (tag === "img") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={key}
        className={className ?? undefined}
        src={el.getAttribute("src") ?? ""}
        alt={el.getAttribute("alt") ?? ""}
        // Same behaviour the hand-written pages had: a figure that fails to load
        // is hidden rather than left as a broken-image icon.
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  if (tag === "ol") {
    const start = el.getAttribute("start");
    if (start) props.start = Number(start);
  }

  const children = Array.from(el.childNodes).map((child, i) => toReact(child, i));
  return createElement(tag, props, children);
}

function RenderStoredMarkup({ html }: { html: string }) {
  const nodes = useMemo(() => {
    if (typeof window === "undefined") return null;
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const root = doc.body.firstElementChild;
    if (!root) return null;
    return Array.from(root.childNodes).map((n, i) => toReact(n, i));
  }, [html]);

  return <>{nodes}</>;
}

export default function AW169ProcedureDetailPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const { variant } = useActiveModelVariant();
  const variantId = variant?.id === "AW169_EP" ? "AW169_EP" : "AW169";
  const slug = sp.get("slug") ?? "";

  const cwp = sp.get("cwp");
  const plist = sp.get("plist");
  const compactCWP = !!cwp && cwp !== "0" && cwp !== "false";
  const compactList = !!plist && plist !== "0" && plist !== "false";
  const compact = compactCWP || compactList;

  const [procedures, setProcedures] = useState<AW169Procedure[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setProcedures(null);
    });
    fetchContentJson<{ procedures?: AW169Procedure[] }>(`/procedures/${variantId}.json`)
      .then((json) => {
        if (!cancelled) setProcedures(Array.isArray(json?.procedures) ? json.procedures : []);
      })
      .catch(() => {
        if (!cancelled) setProcedures([]);
      });
    return () => {
      cancelled = true;
    };
  }, [variantId]);

  const procedure = procedures?.find((p) => p.slug === slug);

  // The return destination is fully known from this page's own query params, so
  // there is no need to gamble on router.back() having completed within some
  // arbitrary timeout (that race lost on slower devices).
  const handleClose = () => {
    if (compactList) {
      router.push("/training/procedures/aw169");
      return;
    }
    const v = sp.get("v") || "";
    const light = sp.get("light") || "";
    const mem = sp.get("mem") || "0";
    router.push(
      `/training/lights?resume=1&v=${encodeURIComponent(v)}&light=${encodeURIComponent(light)}&mem=${encodeURIComponent(mem)}&cwp=1`
    );
  };

  // Each procedure carries the spacing its own page used, so nothing shifts.
  const content = (
    <main className={procedure?.mainClass ?? "mx-auto max-w-3xl p-6 space-y-6"}>
      {procedures === null && <p className="text-sm text-slate-500 dark:text-zinc-400">Loading…</p>}
      {procedures !== null && !procedure && (
        <div className="rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-4">
          <div className="text-slate-900 dark:text-zinc-100 font-semibold mb-2">Procedure not found</div>
          <p className="text-sm text-slate-700 dark:text-zinc-300">Use the RFM directly for reference.</p>
        </div>
      )}
      {procedure && <RenderStoredMarkup html={procedure.html} />}
    </main>
  );

  if (compact) {
    return (
      <div
        className="fixed left-0 right-0 bottom-0 top-0 z-40 bg-white dark:bg-zinc-900 cursor-pointer"
        role="button"
        aria-label="Close procedure"
        onClick={handleClose}
      >
        <div
          className="h-full w-full overflow-y-auto"
          onClickCapture={(e) => {
            const t = e.target as HTMLElement;
            if (t && t.closest("a,button,input,textarea,select,[data-prevent-back]")) e.stopPropagation();
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <div
        className="sticky z-10 bg-white/80 dark:bg-zinc-900/90 backdrop-blur border-b dark:border-zinc-700"
        style={{ top: "4rem" }}
      >
        <div className="mx-auto max-w-3xl px-6 py-3">
          <BackButton label="Procedures" to="/training/procedures/aw169" />
        </div>
      </div>
      {content}
    </div>
  );
}
