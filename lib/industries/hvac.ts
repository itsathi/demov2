import type { IndustryDefinition } from "./types";
import { prospectHaystack, countTermHits } from "./types";
import { transformRawProspect } from "../prospectGenerator";

/** Trades / building-services vocabulary — the platform's original default. */
const HVAC_TERMS = [
  "hvac",
  "air condition",
  "air-condition",
  "aircon",
  "chiller",
  "ventilation",
  "duct",
  "refrigeration",
  "amc",
  "annual maintenance",
  "maintenance",
  "repair",
  "installation",
  "servicing",
  "plumbing",
  "electrical",
  "handyman",
  "painting",
  "carpentry",
  "facilities management",
  "facility management",
  "mep",
  "contracting",
  "fit-out",
  "fit out",
  "pest control",
  "cleaning",
  "water tank",
  "landscaping",
  "technical services",
  "building services",
];

/**
 * The original generator. Always carries a positive baseline so it remains the
 * default whenever no other industry scores higher — preserving the exact
 * existing output for every HVAC / trades / facilities prospect.
 */
export const hvacIndustry: IndustryDefinition = {
  key: "hvac",
  label: "HVAC & Building Services",
  score: (raw) => {
    const hay = prospectHaystack(raw);
    const hits = countTermHits(hay, HVAC_TERMS);
    return Math.min(1, 0.2 + hits * 0.05);
  },
  transform: transformRawProspect,
};
