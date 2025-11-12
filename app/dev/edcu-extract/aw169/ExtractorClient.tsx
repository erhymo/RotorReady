"use client";

import React, { useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - use legacy build namespace to avoid bundler type issues
import * as pdfjsLib from "pdfjs-dist/build/pdf";

type SaveName = "home" | "fuel" | "lts";

export default function ExtractorClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.5);
  const [status, setStatus] = useState<string>("");
  const [sel, setSel] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [ovSize, setOvSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    // Use CDN worker to simplify setup in dev-only tool
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.js";

    (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument("/api/dev/edcu-extract/pdf");
        const doc = await loadingTask.promise;
        setPdf(doc);
        setPageCount(doc.numPages || 0);
        setPageNum(1);
        setLoading(false);
      } catch (e: any) {
        setError("Failed to load PDF");
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const render = async () => {
      if (!pdf || !canvasRef.current) return;
      setStatus("Rendering page...");
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const renderContext = {
        canvasContext: ctx,
        viewport,
      };
      await page.render(renderContext).promise;
      const cw = canvas.clientWidth || canvas.width;
      const ch = canvas.clientHeight || canvas.height;
      setOvSize({ w: cw, h: ch });
      setSel(null);
      setStatus("");
    };
    render();
  }, [pdf, pageNum, scale]);

  const changePage = (delta: number) => {
    setPageNum((p) => Math.min(Math.max(p + delta, 1), pageCount || 1));
  };

  const saveAs = async (name: SaveName) => {
    if (!canvasRef.current) return;
    try {
      setStatus(`Saving ${name.toUpperCase()}...`);
      const canvas = canvasRef.current;
      let dataUrl = "";
      if (sel && sel.w > 4 && sel.h > 4) {
        const scaleX = canvas.width / (canvas.clientWidth || canvas.width);
        const scaleY = canvas.height / (canvas.clientHeight || canvas.height);
        const sx = Math.round(sel.x * scaleX);
        const sy = Math.round(sel.y * scaleY);
        const sw = Math.round(sel.w * scaleX);
        const sh = Math.round(sel.h * scaleY);
        const out = document.createElement("canvas");
        out.width = sw;
        out.height = sh;
        const octx = out.getContext("2d");
        const ictx = canvas.getContext("2d");
        if (!octx || !ictx) return;
        // Draw selected rect from source canvas into output canvas
        octx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
        dataUrl = out.toDataURL("image/png");
      } else {
        dataUrl = canvas.toDataURL("image/png");
      }
      const res = await fetch("/api/dev/edcu-extract/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dataUrl }),
      });
      if (!res.ok) throw new Error("Save failed");
      const json = await res.json();
      setStatus(`Saved → ${json.path}`);
    } catch (e) {
      setStatus("Save failed");
    }
  };

  if (loading) return <div className="text-sm text-neutral-400">Loading PDF…</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <button
          className="rounded border px-2 py-1 hover:bg-neutral-800"
          onClick={() => changePage(-1)}
          disabled={pageNum <= 1}
        >
          Prev
        </button>
        <span>
          Page {pageNum} / {pageCount}
        </span>
        <button
          className="rounded border px-2 py-1 hover:bg-neutral-800"
          onClick={() => changePage(1)}
          disabled={pageNum >= pageCount}
        >
          Next
        </button>
        <div className="ml-4 flex items-center gap-2">
          <label className="text-neutral-400">Scale</label>
          <input
            type="number"
            className="w-20 rounded bg-neutral-900 border border-white/10 px-2 py-1"
            value={scale}
            step={0.25}
            min={0.5}
            max={4}
            onChange={(e) => setScale(parseFloat(e.target.value) || 1.5)}
          />
        </div>
        <div className="ml-auto text-xs text-neutral-400">{status}</div>
      </div>

      <div className="rounded-lg border border-white/10 overflow-auto bg-black">
        <div className="relative inline-block">
          <canvas ref={canvasRef} className="block" />
          {/* Selection overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 cursor-crosshair"
            style={{ width: ovSize.w, height: ovSize.h }}
            onMouseDown={(e) => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              setDrag({ x, y });
              setSel({ x, y, w: 0, h: 0 });
            }}
            onMouseMove={(e) => {
              if (!drag) return;
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const cx = e.clientX - rect.left;
              const cy = e.clientY - rect.top;
              const x = Math.min(drag.x, cx);
              const y = Math.min(drag.y, cy);
              const w = Math.abs(cx - drag.x);
              const h = Math.abs(cy - drag.y);
              setSel({ x, y, w, h });
            }}
            onMouseUp={() => setDrag(null)}
            onMouseLeave={() => setDrag(null)}
          >
            {sel && sel.w > 1 && sel.h > 1 && (
              <div
                className="absolute border border-emerald-400/80 bg-emerald-400/10"
                style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-neutral-400 mr-2">Save current page as:</span>
        <button
          className="rounded border px-2 py-1 hover:bg-neutral-800"
          onClick={() => saveAs("home")}
        >
          HOME
        </button>
        <button
          className="rounded border px-2 py-1 hover:bg-neutral-800"
          onClick={() => saveAs("fuel")}
        >
          FUEL
        </button>
        <button
          className="rounded border px-2 py-1 hover:bg-neutral-800"
          onClick={() => saveAs("lts")}
        >
          LTS (LIGHTS)
        </button>
        <button
          className="rounded border px-2 py-1 hover:bg-neutral-800 ml-4"
          onClick={() => setSel(null)}
        >
          Clear selection
        </button>
      </div>

      <div className="text-xs text-neutral-500">
        Tip: Box-select the exact EDCU area on the page before saving. If no selection, the whole page is saved.
        Files are written to public/model-data/AW169/training/edcu/screens/.
      </div>
    </div>
  );
}

