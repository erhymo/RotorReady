"use client";

import QuickReferencePage from "@/app/components/QuickReferencePage";
import { useActiveModelVariant } from "@/lib/models/hooks";

export default function AW169QuickReferencePage() {
  const { variant } = useActiveModelVariant();
  return <QuickReferencePage variantId={variant?.id === "AW169_EP" ? "AW169_EP" : "AW169"} />;
}
