import type { RawProspectData } from "../rawProspectTypes";
import type { IndustryKey, ProspectConfig } from "../types";

/**
 * One pluggable industry. The generator engine looks up the highest-scoring
 * definition for a raw prospect and delegates transformation to it, so adding a
 * vertical never means editing a giant shared component.
 */
export type IndustryDefinition = {
  key: IndustryKey;
  /** Human label, e.g. "Real Estate". */
  label: string;
  /**
   * Confidence 0..1 that a raw prospect belongs to this industry. `undefined`
   * (no signal) is treated as 0. The registry picks the highest scorer and
   * falls back to the platform default when nothing is confident.
   */
  score: (raw: RawProspectData) => number;
  transform: (raw: RawProspectData) => ProspectConfig;
};

/** Build a single searchable lowercase haystack from every textual signal. */
export function prospectHaystack(raw: RawProspectData): string {
  const c = raw.company;
  const a = raw.audit;
  return [
    c.name,
    c.industry,
    c.category,
    c.businessSize,
    c.businessMaturity,
    c.location?.city,
    c.location?.state,
    c.location?.country,
    c.location?.address,
    c.contact?.website,
    c.contact?.domain,
    c.socialProof?.topKeywords?.join(" "),
    a?.sourceQuery,
    a?.summary,
    a?.personalizationHook,
    a?.websiteDetails?.title,
    a?.websiteDetails?.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/** Count how many of `terms` appear in `haystack` (whole-phrase, lowercased). */
export function countTermHits(haystack: string, terms: string[]): number {
  let hits = 0;
  for (const term of terms) {
    if (haystack.includes(term)) hits += 1;
  }
  return hits;
}
