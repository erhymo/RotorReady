"use client";

import AbbreviationsPage from "@/app/components/AbbreviationsPage";
import H145D3_ABBREVIATIONS from "@/data/h145d3/abbreviations";

export default function H145D3AbbreviationsPage() {
  return <AbbreviationsPage title="H145 D3 ABBREVIATIONS" data={H145D3_ABBREVIATIONS} />;
}
