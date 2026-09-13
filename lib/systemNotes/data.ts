// The note content used to live as hardcoded arrays in data/<model>/systemNotes.ts,
// compiled straight into the JS bundle — so a new or corrected note only reached the
// native app on the next store release, never on a plain commit + push (the native
// shell has no server.url and runs whatever JS it was bundled with; see
// capacitor.config.ts). Content now lives in public/system-notes/<variantId>.json and
// is fetched at runtime through lib/contentUrl.ts, the same way audio and IFR/VFR are.
// This file keeps only the shared types and the lookup helper.
export type SystemNoteSection = {
  heading?: string;
  paragraphs?: string[];
  table?: {
    caption?: string;
    columns: string[];
    rows: (string | number)[][];
  };
  note?: string;
};

export type SystemNote = {
  slug: string;
  title: string;
  subtitle?: string;
  rfmReference: string;
  sections: SystemNoteSection[];
};

export function systemNotesPath(variantId: string): string {
  return `/system-notes/${variantId}.json`;
}

export function findSystemNote(notes: SystemNote[], slug: string): SystemNote | undefined {
  return notes.find((n) => n.slug === slug);
}
