"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
// B3e shares the H125 abbreviation set with the B3 (2B1) — the list is generic
// airframe/avionics terminology, nothing engine-variant specific.
import H125B32B1_ABBREVIATIONS from "@/data/h125-as350-b3-2b1/abbreviations";

export default function H125B3EAbbreviationsPage() {
  return <AbbreviationsPage title="H125 / AS350 B3e ABBREVIATIONS" data={H125B32B1_ABBREVIATIONS} />;
}
