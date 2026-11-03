import type { RawProspectData } from "./rawProspectTypes";
import curated from "./data/prospects-2026-11-02-curated.json";
import classification from "./data/prospects-2026-11-02-classification.json";

type CuratedBatch = {
  realEstate: RawProspectData[];
  hvac: RawProspectData[];
};

type ClassificationEntry = {
  index: number;
  name: string;
  domain: string;
  category: "real_estate" | "hvac" | "exclude";
  reason?: string;
  demoSlug?: string;
};

type ClassificationReport = {
  source: string;
  counts: {
    total: number;
    realEstate: number;
    hvac: number;
    excluded: number;
  };
  excludedByReason: Record<string, number>;
  entries: ClassificationEntry[];
};

const batch = curated as unknown as CuratedBatch;
const report = classification as unknown as ClassificationReport;

export const realEstateBatch3List: RawProspectData[] = batch.realEstate;
export const hvacBatch3List: RawProspectData[] = batch.hvac;

export const batch20261102Classification = report.entries;
export const batch20261102Summary = report.counts;
export const batch20261102ExcludedByReason = report.excludedByReason;
export const batch20261102Excluded = report.entries.filter(
  (entry) => entry.category === "exclude"
);
