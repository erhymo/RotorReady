// The actual topic content used to live here as hardcoded arrays (VFR_TOPICS/IFR_TOPICS),
// compiled straight into the JS bundle. That meant a new topic or a fixed number only ever
// reached the native app on the next store release, never on a plain commit + push, because
// the native shell has no server.url and just runs whatever JS it was bundled with (see
// capacitor.config.ts). The content now lives in public/ifr-vfr/ifr.json and vfr.json, fetched
// at runtime the same way public/audio/*/index.json is (lib/contentUrl.ts) — this file keeps
// only the shared types and the lookup helper.
export type RuleGroup = {
  heading?: string;
  bullets: string[];
};

export type RuleTopic = {
  slug: string;
  title: string;
  intro?: string;
  groups: RuleGroup[];
  reference: string;
};

export function findTopic(topics: RuleTopic[], slug: string): RuleTopic | undefined {
  return topics.find((t) => t.slug === slug);
}
