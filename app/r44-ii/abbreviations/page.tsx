"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import R44_ABBREVIATIONS from "@/data/r44/abbreviations";

export default function R44AbbreviationsPage() {
  return <AbbreviationsPage title="R44 II ABBREVIATIONS" data={R44_ABBREVIATIONS} />;
}
