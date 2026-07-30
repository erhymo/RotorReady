"use client";

import { useRef, useState } from "react";

/**
 * Wraps a QRH/FLM page image (or SVG crop) so it can be tapped to zoom in on mobile,
 * where the image is otherwise too small to read. Tap zooms in centered on the tap
 * point; while zoomed, drag/scroll pans around; tap again to zoom back out.
 */
export default function ZoomableImage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.closest("a,button,input,textarea,select,[data-prevent-back]")) return;

    const container = containerRef.current;
    if (!container) return;

    if (!zoomed) {
      const rect = container.getBoundingClientRect();
      const tapXRatio = (e.clientX - rect.left) / rect.width;
      const tapYRatio = (e.clientY - rect.top) / rect.height;
      setZoomed(true);
      requestAnimationFrame(() => {
        const el = containerRef.current;
        if (!el) return;
        el.scrollLeft = tapXRatio * el.scrollWidth - el.clientWidth / 2;
        el.scrollTop = tapYRatio * el.scrollHeight - el.clientHeight / 2;
      });
    } else {
      setZoomed(false);
      container.scrollLeft = 0;
      container.scrollTop = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleTap}
      className={`relative touch-pan-x touch-pan-y ${zoomed ? "overflow-auto" : "overflow-hidden"} ${className}`}
    >
      <div className={zoomed ? "w-[220%] max-w-none" : "w-full"}>{children}</div>
      {!zoomed && (
        <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
          Tap to zoom
        </span>
      )}
    </div>
  );
}
