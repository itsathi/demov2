export type NicheKey = "all" | "real_estate" | "hvac" | "other";

export const NICHE_TABS: { key: NicheKey; label: string }[] = [
  { key: "all", label: "All industries" },
  { key: "real_estate", label: "Real estate" },
  { key: "hvac", label: "HVAC" },
  { key: "other", label: "Other" },
];

const HVAC_INDUSTRY =
  /hvac|air[-\s]?condition|aircon|air con|\bac\b|climat|\bair\b|heating|ventilation|cooling|refrigeration|plumbing|electrical|maintenance|facilities|facility|mep|technical services|mechanical/i;
const RE_INDUSTRY = /real estate|real-estate|realestate|realty|realtor|property|properties|broker|brokerage|listings|off-plan/i;

type Categorizable = {
  displayName: string;
  slug: string;
  industry?: string;
  industryKey?: string;
};

/** The prospect's stated business industry, independent of the demo template. */
export function nicheOf(prospect: Categorizable): Exclude<NicheKey, "all"> {
  if (prospect.industryKey === "real_estate") return "real_estate";
  const hay = `${prospect.displayName} ${prospect.slug} ${prospect.industry ?? ""}`;
  if (RE_INDUSTRY.test(hay)) return "real_estate";
  if (prospect.industryKey === "hvac" || HVAC_INDUSTRY.test(hay)) return "hvac";
  return "other";
}
