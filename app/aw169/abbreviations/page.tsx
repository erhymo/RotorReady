"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function AW169AbbreviationsPage() {
  const { variant } = useActiveModelVariant();
  const isEnhancedPerformance = variant?.id === "AW169_EP";
  return (
    <AbbreviationsPage
      title={isEnhancedPerformance ? "AW169 EP ABBREVIATIONS" : "AW169 ABBREVIATIONS"}
      variantId={isEnhancedPerformance ? "AW169_EP" : "AW169"}
    />
  );
}
