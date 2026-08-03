"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import AW189_ABBREVIATIONS from "@/data/aw189/abbreviations";

export default function AW189AbbreviationsPage() {
  return <AbbreviationsPage title="AW189 ABBREVIATIONS" data={AW189_ABBREVIATIONS} />;
}
