"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import R22_ABBREVIATIONS from "@/data/r22/abbreviations";

export default function R22AbbreviationsPage() {
  return <AbbreviationsPage title="R22 ABBREVIATIONS" data={R22_ABBREVIATIONS} />;
}
