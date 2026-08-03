"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import AW169_ABBREVIATIONS from "@/data/aw169/abbreviations";

export default function AW169AbbreviationsPage() {
  return <AbbreviationsPage title="AW169 ABBREVIATIONS" data={AW169_ABBREVIATIONS} />;
}
