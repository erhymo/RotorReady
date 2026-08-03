"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import AW139_ABBREVIATIONS from "@/data/aw139/abbreviations";

export default function AW139AbbreviationsPage() {
  return <AbbreviationsPage title="AW139 ABBREVIATIONS" data={AW139_ABBREVIATIONS} />;
}
