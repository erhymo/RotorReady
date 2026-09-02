"use client";

import AppTopBar from "@/components/AppTopBar";
import ExteriorMap from "@/components/ExteriorMap";
import { AW169_EXTERIOR_HOTSPOTS } from "@/data/aw169/exteriorHotspots";

export default function AW169ExteriorMapPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-900">
      <AppTopBar title="Exterior Map" backHref="/" backLabel="Home" />
      <main className="mx-auto max-w-3xl p-6 space-y-4">
        <header>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">AW169 Exterior Map</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
            Tap a marker on the airframe to identify visible antennas and equipment.
          </p>
        </header>

        <ExteriorMap
          imageSrc="/aw169/exterior-map/aw169-side-view.png"
          imageAlt="AW169 side profile, from RFM Figure I-1 Helicopter - Three Views"
          hotspots={AW169_EXTERIOR_HOTSPOTS}
          width={1270}
          height={690}
        />

        <p className="text-xs text-center text-slate-400 dark:text-zinc-500 pt-2">
          Side profile from RFM Figure I-1 (Helicopter — Three Views). For training use only.
        </p>
      </main>
    </div>
  );
}
