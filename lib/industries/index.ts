import type { RawProspectData } from "../rawProspectTypes";
import type { IndustryKey, ProspectConfig } from "../types";
import type { IndustryDefinition } from "./types";
import { hvacIndustry } from "./hvac";
import { realEstateIndustry } from "./realEstate";

export type { IndustryDefinition } from "./types";

/** Minimum confidence before a non-default industry may take over. */
export const INDUSTRY_THRESHOLD = 0.34;

/**
 * Registered industries, highest priority first. The default (`hvac`) is the
 * fallback and therefore last.
 */
export const industries: IndustryDefinition[] = [realEstateIndustry, hvacIndustry];

export const defaultIndustry: IndustryDefinition = hvacIndustry;

/** Highest-scoring industry for a raw prospect, with a safe default. */
export function resolveIndustry(raw: RawProspectData): IndustryDefinition {
  const ranked = industries
    .map((industry) => ({ industry, score: industry.score(raw) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (best && best.industry !== defaultIndustry && best.score >= INDUSTRY_THRESHOLD) {
    return best.industry;
  }
  return defaultIndustry;
}

export function detectIndustryKey(raw: RawProspectData): IndustryKey {
  return resolveIndustry(raw).key;
}

/** Transform one raw prospect using the industry the detector selects. */
export function transformRawProspectByIndustry(raw: RawProspectData): ProspectConfig {
  return resolveIndustry(raw).transform(raw);
}

/** Transform a batch, preserving order. */
export function transformRawProspectsByIndustry(list: RawProspectData[]): ProspectConfig[] {
  return list.map(transformRawProspectByIndustry);
}

export { prospectHaystack, countTermHits } from "./types";
