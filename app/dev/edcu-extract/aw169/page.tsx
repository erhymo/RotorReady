import React from "react";
import ExtractorClient from "./ExtractorClient";

function devEnabled(): boolean {
  const v = String(process.env.DEV_TOOLS_ENABLED ?? process.env.DEV_TOOLS_ENABLE ?? "").toLowerCase();
  if (process.env.NODE_ENV === "development") return true; // allow in dev
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export const metadata = {
  title: "EDCU Extractor (AW169)",
};

export default function Page() {
  if (!devEnabled()) {
    return (
      <div className="p-6 text-sm text-neutral-400">
        Dev tools are disabled. Set DEV_TOOLS_ENABLED=1 in .env.local and restart dev server.
      </div>
    );
  }
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">EDCU Extractor (AW169)</h1>
      <ol className="list-decimal pl-6 text-sm text-neutral-300 space-y-1">
        <li>Use Prev/Next to find the exact EDCU pages in the RFM.</li>
        <li>Adjust Scale until the image is crisp (no blurring).</li>
        <li>Click Save as HOME/FUEL/LTS to write PNGs into public/model-data/AW169/training/edcu/screens/.</li>
        <li>Open /training/edcu/aw169?cal=1 to verify hot-zones match; we will fine-tune layout after images are in place.</li>
      </ol>
      <ExtractorClient />
    </div>
  );
}

