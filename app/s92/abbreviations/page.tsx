"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import S92_ABBREVIATIONS from "@/data/s92/abbreviations";

export default function S92AbbreviationsPage() {
  return <AbbreviationsPage title="S-92 ABBREVIATIONS" data={S92_ABBREVIATIONS} />;
}
