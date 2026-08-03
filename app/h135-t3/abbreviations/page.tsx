"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import H135T3_ABBREVIATIONS from "@/data/h135t3/abbreviations";

export default function H135T3AbbreviationsPage() {
  return <AbbreviationsPage title="H135 T3 ABBREVIATIONS" data={H135T3_ABBREVIATIONS} />;
}
