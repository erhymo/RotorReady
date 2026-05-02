import React from "react";
import { notFound } from "next/navigation";

import ExtractorClient from "./ExtractorClient";

function devEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

export const metadata = {
  title: "EDCU Extractor (AW169)",
};

export default function Page() {
  if (!devEnabled()) {
    notFound();
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

