import type { IndustryDefinition } from "./types";
import { prospectHaystack, countTermHits } from "./types";
import { transformRawRealEstateProspect } from "../realEstateGenerator";

/** Unambiguous property vocabulary. */
const RE_STRONG = [
  "real estate",
  "realestate",
  "real-estate",
  "realty",
  "realtor",
  "estate agent",
  "estate agents",
  "property brokerage",
  "real estate broker",
  "real estate agency",
  "real estate agent",
  "real estate company",
  "real estate group",
  "real estate developer",
  "property developer",
  "property group",
  "property consultants",
  "real estate consultants",
  "properties for sale",
  "properties for rent",
  "property for sale",
  "houses for sale",
  "homes for sale",
  "villa for sale",
  "apartment for sale",
  "off-plan",
  "off plan",
  "freehold",
  "lettings",
];

/** Supporting property vocabulary (ambiguous on its own). */
const RE_MEDIUM = [
  "property",
  "properties",
  "villa",
  "villas",
  "apartment",
  "apartments",
  "penthouse",
  "townhouse",
  "residential",
  "homes",
  "leasing",
  "landlord",
  "tenant",
  "tenancy",
  "mortgage",
  "escrow",
  "residences",
  "waterfront",
  "community living",
  "listing",
  "listings",
];

/** Building-services vocabulary that pulls a prospect away from real estate. */
const FM_TERMS = [
  "facilities management",
  "facility management",
  "facilities maintenance",
  "facility maintenance",
  "pest control",
  "cleaning services",
  "cleaning company",
  "handyman",
  "plumbing",
  "carpentry",
  "hvac",
  "air conditioning",
  "electrical services",
  "mep",
  "maintenance services",
  "maintenance company",
  "property maintenance",
  "building maintenance",
  "technical services",
  "business directory",
  "directory",
  "marketplace",
  "aggregator",
  "find the best",
];

/**
 * Listings portals, marketplaces and directories use property vocabulary but
 * are not agencies or brokerages — they must never receive a real-estate demo.
 * A single hit here vetoes the whole industry score. Keep these phrases
 * unambiguous: words like "directory" or "find the best" appear on legitimate
 * agency pages too (type === "marketplace" already catches real portals).
 */
const PORTAL_VETO = [
  "marketplace",
  "classifieds",
  "classified ads",
  "pardon our interruption",
  "property portal",
  "listing portal",
  "listings portal",
  "real estate portal",
  "business directory",
  "aggregator",
];

/**
 * Editorial content (listicles, investment guides) that got crawled as a
 * "company". These titles are article headlines, not business names, so no
 * agency demo should be fabricated from them.
 */
const EDITORIAL_NAME =
  /^(top|best)\s*\d|\b\d+\s+(best|top)\b|areas to invest|places to (buy|invest)/i;

/**
 * Company-level verticals that disqualify a prospect from real estate, even
 * when property vocabulary appears. These describe the *business itself* —
 * a marketing/technology/e-commerce/FM company is not a brokerage.
 */
const NON_RE_INDUSTRY = new RegExp(
  [
    "facilities management",
    "facility management",
    "facilities",
    "cleaning",
    "pest control",
    "handyman",
    "technology",
    "software",
    "information technology",
    "it services",
    "e-commerce",
    "ecommerce",
    "retail",
    "clothing",
    "apparel",
    "fashion",
    "marketing",
    "advertising",
    "digital",
    "media",
    "construction",
  ].join("|")
);

/**
 * Real estate. Returns 0 unless property signals clearly outweigh building-
 * services signals, so facilities / maintenance businesses stay on the default
 * generator. Portals, marketplaces and non-property industries are vetoed
 * outright.
 */
export const realEstateIndustry: IndustryDefinition = {
  key: "real_estate",
  label: "Real Estate",
  score: (raw) => {
    const company = raw.company;
    const industry = (company.industry ?? "").toLowerCase();
    const category = (company.category ?? "").toLowerCase();
    const siteType = (raw.audit?.websiteDetails?.type ?? "").toLowerCase();
    const hay = prospectHaystack(raw);

    // A listings portal / marketplace is never an agency demo.
    if (siteType === "marketplace" || siteType === "classifieds") return 0;
    if (countTermHits(hay, PORTAL_VETO) > 0) return 0;

    // Editorial/listicle titles are article headlines, not businesses.
    if (EDITORIAL_NAME.test(company.name ?? "")) return 0;

    // A non-property vertical in the company's own classification disqualifies.
    if (NON_RE_INDUSTRY.test(industry)) return 0;

    const strong = countTermHits(hay, RE_STRONG);
    const medium = countTermHits(hay, RE_MEDIUM);
    const negative = countTermHits(hay, FM_TERMS);

    let score = strong * 0.4 + medium * 0.12 - negative * 0.3;

    // An explicit real-estate industry/category is a strong, trustworthy signal
    // (e.g. brokerage homepages whose page title reads like a blog headline).
    if (/real estate|realty|property/.test(industry)) score += 0.5;
    if (
      /real estate (agency|agent|broker|brokerage|consultant|consultancy|company|group)|property (management|investment) company|commercial real estate/.test(
        category
      )
    ) {
      score += 0.3;
    }

    return Math.max(0, Math.min(1, score));
  },
  transform: transformRawRealEstateProspect,
};
