#!/usr/bin/env node
/**
 * Build the canonical company registry from the supplied prospect dataset.
 *
 * Stage 2/3 of the Demo Generator 2.0 pipeline:
 *   raw prospect JSON -> normalize -> canonical identity -> industry family
 *   -> eligibility -> stable demo id / slug -> registry + classification report.
 *
 * This script never invents company facts. It only normalizes, classifies and
 * derives deterministic identifiers. Missing facts stay missing.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "data/source/prospect-demos-207-leads-2026-11-04.json");
const OUT_DIR = path.join(ROOT, "data/generated");
const OLD_CLASSIFICATION = path.join(ROOT, "lib/data/prospects-2026-11-02-classification.json");
const RESEARCH_DIR = path.join(ROOT, "lib/research/data");
const BATCH_ID = "batch-2026-11-04";
const REGISTRY_VERSION = "2.0.0";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

/* ------------------------------------------------------------------ */
/* Hard non-business domains (portals, directories, editorial, social) */
/* ------------------------------------------------------------------ */
const PORTALS = new Set([
  "property.ca", "zolo.ca", "lamudi.com.ph", "properties.lefigaro.com",
  "dotproperty.com.ph", "phrealestate.com", "realtor.com", "emirates.estate",
  "propertyfinder.ae", "dubai.dubizzle.com", "themegahub.in", "hvaclocals.com",
  "hipages.com.au", "airtasker.com", "reachuae.com", "ensun.io",
  "hvacinformed.com", "gotoprated.com", "network.procore.com", "knightfrank.com",
  "remax.ca", "remax.ph", "daikin.com.my",
]);
const DIRECTORIES = new Set([
  "yelp.com", "m.yelp.com", "houzz.com", "wa.me", "globalpropertyguide.com",
  "bestrealtor.ph", "condodevelopers.ca",
]);
const EDITORIAL = new Set([
  "news.dupontregistry.com", "moneysense.ca", "investasian.com",
  "metrobank.com.ph", "condoarena.com", "propertychat.com.au",
  "globalmediainsight.com", "topluxuryproperty.com", "luxuryresidences.in",
]);
const SOCIAL = new Set(["wa.me", "yelp.com", "m.yelp.com", "houzz.com", "facebook.com", "instagram.com"]);
const LEGAL = new Set(["realestatelawyers.ca"]);

/* Old 99-lead audit is an authoritative seed for records it already reviewed. */
const SEED_REASON_MAP = {
  "editorial-blog": "editorial_content",
  "portal-marketplace": "portal_marketplace",
  "directory-forum": "directory_aggregator",
  "test-data": "test_data",
  "legal-services": "legal_services",
  "other-vertical": "unsupported_vertical",
};
const seedByDomain = (() => {
  const map = new Map();
  if (!fs.existsSync(OLD_CLASSIFICATION)) return map;
  const old = readJson(OLD_CLASSIFICATION);
  for (const e of old.entries ?? []) {
    if (e.category === "exclude") {
      const reason = e.reason || "excluded";
      map.set(e.domain.toLowerCase(), SEED_REASON_MAP[reason] ?? reason);
    }
  }
  return map;
})();

/* ------------------------------------------------------------------ */
/* Normalizers                                                         */
/* ------------------------------------------------------------------ */
function normalizeDomain(company) {
  let host = (company?.contact?.domain || "").trim().toLowerCase();
  if (!host && company?.contact?.website) {
    try { host = new URL(company.contact.website).hostname.toLowerCase(); } catch {}
  }
  return host.replace(/^www\./, "").replace(/^m\./, "").replace(/[./]+$/, "");
}

function slugFromDomain(domain) {
  return domain
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\.(co\.uk|org\.uk|com\.au|com\.ph|com\.my|co\.nz|com\.sa|com\.ng|co\.za)$/i, "")
    .replace(/\.[a-z]{2,6}$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "company";
}

const COUNTRY_MAP = {
  canada: { name: "Canada", code: "CA" },
  ph: { name: "Philippines", code: "PH" },
  philippines: { name: "Philippines", code: "PH" },
  australia: { name: "Australia", code: "AU" },
  "united arab emirates": { name: "United Arab Emirates", code: "AE" },
  uae: { name: "United Arab Emirates", code: "AE" },
  usa: { name: "United States", code: "US" },
  "united states": { name: "United States", code: "US" },
  "united states of america": { name: "United States", code: "US" },
  india: { name: "India", code: "IN" },
  "saudi arabia": { name: "Saudi Arabia", code: "SA" },
  sa: { name: "Saudi Arabia", code: "SA" },
  ng: { name: "Nigeria", code: "NG" },
  nigeria: { name: "Nigeria", code: "NG" },
  malaysia: { name: "Malaysia", code: "MY" },
  my: { name: "Malaysia", code: "MY" },
};

function normalizeCountry(raw) {
  if (!raw) return { name: null, code: null };
  return COUNTRY_MAP[String(raw).trim().toLowerCase()] ?? { name: String(raw).trim(), code: null };
}

/* ------------------------------------------------------------------ */
/* Industry classification                                             */
/* ------------------------------------------------------------------ */
const FAMILIES = {
  real_estate: "Real Estate",
  hvac: "HVAC & Cooling",
  construction: "Construction & Contracting",
  facilities: "Facilities & Building Services",
  manufacturing: "Manufacturing & Distribution",
  interior: "Interior Design",
  home_services: "Home & Trade Services",
  professional: "Professional Services",
  healthcare: "Healthcare",
  education: "Education",
  hospitality: "Hospitality",
  retail: "Retail & Commerce",
  other: "Other",
};

function classifyFamily(raw) {
  const c = raw.company ?? {};
  const a = raw.audit ?? {};
  const hay = [
    c.name, c.industry, c.category, c.businessSize,
    a.summary, a.websiteDetails?.title, a.websiteDetails?.description,
    (c.socialProof?.topKeywords ?? []).join(" "),
  ].filter(Boolean).join(" ").toLowerCase();

  const has = (re) => re.test(hay);

  // Priority: explicit business model first, then trade vocabulary.
  if (has(/\b(facilit(y|ies) management|facility maintenance|facilities maintenance|building services|technical services|property maintenance|building maintenance|home maintenance|handyman|general maintenance|mep & facility)\b/)) return "facilities";
  if (has(/\b(interior design|interior designer|interiors|decor|décor)\b/)) return "interior";
  if (has(/\b(real estate|realtor|realty|estate agent|estate agents|brokerage|property management|property developer|real estate developer|real estate consultant|property investment|residential property)\b/)) return "real_estate";
  if (has(/\b(manufactur|supplier|distributor|distribution|dealer|showroom|trading co|trading company|system supplier|air conditioning store)\b/)) return "manufacturing";
  if (has(/\b(hvac|air[ -]?condition|aircon|air con|refrigerat|heating|ventilation|cooling|duct cleaning|chiller|ac repair|ac service)\b/)) return "hvac";
  if (has(/\b(education|institute|school|college|university|academy|educational institution)\b/)) return "education";
  if (has(/\b(healthcare|health care|medical|clinic|dental|hospital)\b/)) return "healthcare";
  if (has(/\b(construction|contracting|contractor|mep|mechanical|electro[ -]?mechanical|fit[ -]?out|engineering & construction|engineering and construction|general contract)\b/)) return "construction";
  if (has(/\b(plumbing|electrical|electrician|home services|repair service|cleaning|pest control|landscap)\b/)) return "home_services";
  if (has(/\b(consult|engineering|architecture|accounting|financial|finance|legal|law|software|technology|it services|marketing|advisory)\b/)) return "professional";
  if (has(/\b(hotel|restaurant|cafe|hospitality|tourism|resort)\b/)) return "hospitality";
  if (has(/\b(retail|shop|store|e-commerce|ecommerce)\b/)) return "retail";
  return "other";
}

/* Family -> template family. Multiple raw families may share a template. */
function templateForFamily(family) {
  switch (family) {
    case "real_estate": return "real-estate";
    case "hvac": return "hvac";
    case "construction": return "construction";
    case "facilities": return "facilities";
    case "manufacturing": return "manufacturing";
    case "interior": return "interior-design";
    case "home_services": return "home-services";
    case "professional": return "professional-services";
    case "healthcare": return "healthcare";
    case "education": return "education";
    case "hospitality": return "hospitality";
    case "retail": return "retail";
    default: return "professional-services";
  }
}

/* ------------------------------------------------------------------ */
/* Eligibility                                                         */
/* ------------------------------------------------------------------ */
function assessEligibility(raw, domain, family) {
  const c = raw.company ?? {};
  const a = raw.audit ?? {};
  const name = String(c.name ?? "");
  const type = String(a.websiteDetails?.type ?? "").toLowerCase();
  const reasons = [];
  const review = [];

  if (/athinem\s*test|test\s*lead/i.test(name) || domain.includes("athinem-test")) {
    reasons.push("test_data");
  }
  if (SOCIAL.has(domain) || domain === "wa.me") reasons.push("social_or_messaging");
  if (LEGAL.has(domain) || family === "professional" && /legal services/i.test(String(c.industry ?? ""))) reasons.push("legal_services");
  if (PORTALS.has(domain) || type === "marketplace") reasons.push("portal_marketplace");
  if (DIRECTORIES.has(domain) || type === "online directory") reasons.push("directory_aggregator");
  if (EDITORIAL.has(domain)) reasons.push("editorial_content");
  if (type === "e-commerce") reasons.push("ecommerce_storefront");
  const seeded = seedByDomain.get(domain);
  if (seeded) reasons.push(seeded);

  if (!c.contact?.website && !c.contact?.domain) reasons.push("missing_website");
  if (!c.name) reasons.push("missing_company_name");

  // Data gaps are tracked separately from identity review. A missing rating does
  // not block a demo; it simply means the demo must not display a rating.
  const dataGaps = [];
  if (!c.location?.city) dataGaps.push("city");
  if (!normalizeCountry(c.location?.country).code) dataGaps.push("country");
  if (!(c.socialProof?.googleRating)) dataGaps.push("rating");
  if (!(c.socialProof?.topKeywords ?? []).length) dataGaps.push("service_keywords");
  if (!c.contact?.phone && !c.contact?.rawPhone) dataGaps.push("phone");
  if (!c.contact?.email) dataGaps.push("email");
  if (!c.branding?.logoUrl) dataGaps.push("logo");

  const uniqueReasons = [...new Set(reasons)];
  const unclear = family === "other";
  return {
    eligible: uniqueReasons.length === 0,
    exclusionReasons: uniqueReasons,
    needsReview: uniqueReasons.length === 0 && unclear,
    reviewReasons: unclear ? ["unclear_industry"] : [],
    dataGaps,
    confidence: uniqueReasons.length ? 0 : Math.max(0.35, 1 - dataGaps.length * 0.08 - (unclear ? 0.25 : 0)),
  };
}

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */
const source = readJson(SOURCE);
const usedSlugs = new Map();

const companies = source.map((raw, index) => {
  const c = raw.company ?? {};
  const a = raw.audit ?? {};
  const domain = normalizeDomain(c);
  const baseSlug = slugFromDomain(domain);
  const count = usedSlugs.get(baseSlug) ?? 0;
  usedSlugs.set(baseSlug, count + 1);
  const slug = count === 0 ? baseSlug : `${baseSlug}-${sha(domain).slice(0, 5)}`;

  const family = classifyFamily(raw);
  const eligibility = assessEligibility(raw, domain, family);
  const country = normalizeCountry(c.location?.country);
  const hash = sha(domain).slice(0, 8);

  const researchPath = path.join(RESEARCH_DIR, `${slug}.json`);
  const hasResearch = fs.existsSync(researchPath);

  return {
    companyId: `co_${hash}`,
    crmCompanyId: c.id ?? null,
    canonicalKey: `domain:${domain}`,
    sourceIndex: index,
    legalName: c.name ?? null,
    displayName: c.name ?? null,
    domain,
    website: c.contact?.website ?? (domain ? `https://${domain}` : null),
    industryRaw: c.industry ?? null,
    categoryRaw: c.category ?? null,
    websiteType: a.websiteDetails?.type ?? null,
    industryFamily: family,
    industryFamilyLabel: FAMILIES[family],
    templateId: templateForFamily(family),
    templateVersion: "0.1.0",
    location: {
      address: c.location?.address ?? null,
      city: c.location?.city ?? null,
      state: c.location?.state ?? null,
      country: country.name,
      countryCode: country.code,
    },
    contact: {
      phone: c.contact?.phone ?? c.contact?.rawPhone ?? null,
      email: c.contact?.email ?? null,
    },
    branding: {
      primaryColor: c.branding?.primaryColor ?? null,
      secondaryColor: c.branding?.secondaryColor ?? null,
      logoUrl: c.branding?.logoUrl ?? null,
      source: c.branding?.primaryColor ? "crm" : "none",
    },
    socialProof: {
      googleRating: c.socialProof?.googleRating ?? null,
      reviewCount: c.socialProof?.reviewCount ?? null,
      keywords: c.socialProof?.topKeywords ?? [],
    },
    decisionMakers: (c.decisionMakers ?? []).map((dm) =>
      typeof dm === "string" ? { name: dm } : dm
    ),
    content: {
      summary: a.summary ?? null,
      personalizationHook: a.personalizationHook ?? null,
      websiteTitle: a.websiteDetails?.title ?? null,
      websiteDescription: a.websiteDetails?.description ?? null,
    },
    audit: {
      sourceQuery: a.sourceQuery ?? null,
      provider: a.provider ?? null,
      crawlStatus: a.crawlStatus ?? null,
      researchStatus: a.researchStatus ?? null,
      scoring: a.scoring ?? null,
    },
    research: {
      profileAvailable: hasResearch,
      profilePath: hasResearch ? `lib/research/data/${slug}.json` : null,
    },
    eligibility,
    identity: {
      demoId: `demo_${slug}_${hash}`,
      slug,
      urlPath: `/${slug}`,
      batchId: BATCH_ID,
      registryVersion: REGISTRY_VERSION,
      generationStatus: "not_generated",
      deploymentStatus: "not_deployed",
      version: 0,
    },
  };
});

/* Duplicate company detection (never merge on name alone). */
const byName = new Map();
for (const co of companies) {
  const key = `${(co.legalName ?? "").trim().toLowerCase()}|${co.location.countryCode ?? ""}`;
  if (!byName.has(key)) byName.set(key, []);
  byName.get(key).push(co);
}
const duplicateNameGroups = [...byName.entries()]
  .filter(([, list]) => list.length > 1 && list[0].legalName)
  .map(([, list]) => ({
    legalName: list[0].legalName,
    companyIds: list.map((c) => c.companyId),
    domains: list.map((c) => c.domain),
    action: "manual_review",
    note: "Same name, different domains — kept as distinct companies until verified.",
  }));

// Duplicate names require manual review, never automatic merging.
for (const group of duplicateNameGroups) {
  for (const id of group.companyIds) {
    const company = companies.find((c) => c.companyId === id);
    if (!company) continue;
    company.eligibility.needsReview = true;
    company.eligibility.reviewReasons = [...new Set([...company.eligibility.reviewReasons, "duplicate_company_name"])];
  }
}

const eligible = companies.filter((c) => c.eligibility.eligible);
const excluded = companies.filter((c) => !c.eligibility.eligible);
const byFamily = {};
for (const co of eligible) byFamily[co.industryFamily] = (byFamily[co.industryFamily] ?? 0) + 1;
const exclusionCounts = {};
for (const co of excluded) for (const r of co.eligibility.exclusionReasons) exclusionCounts[r] = (exclusionCounts[r] ?? 0) + 1;

/* ------------------------------------------------------------------ */
/* Pilot shortlist — 5 diverse, well-documented eligible companies     */
/* ------------------------------------------------------------------ */
const PILOT_FAMILIES = ["real_estate", "hvac", "facilities", "construction", "interior"];
function completenessScore(c) {
  let score = 0;
  if (c.research.profileAvailable) score += 5;
  if (c.socialProof.googleRating) score += 2;
  if (c.socialProof.reviewCount) score += 1;
  if (c.location.city) score += 2;
  if (c.location.countryCode) score += 1;
  if (c.decisionMakers.length) score += 1;
  score += Math.min(c.socialProof.keywords.length, 5);
  if (c.contact.phone) score += 1;
  if (c.contact.email) score += 1;
  if (c.branding.logoUrl) score += 2;
  return score;
}
const pilotShortlist = PILOT_FAMILIES.flatMap((family) => {
  const ranked = eligible
    .filter((c) => c.industryFamily === family)
    .sort((a, b) => completenessScore(b) - completenessScore(a));
  const top = ranked[0];
  if (!top) return [];
  return [{
    companyId: top.companyId,
    crmCompanyId: top.crmCompanyId,
    family,
    templateId: top.templateId,
    slug: top.identity.slug,
    demoId: top.identity.demoId,
    displayName: top.displayName,
    domain: top.domain,
    location: [top.location.city, top.location.country].filter(Boolean).join(", "),
    researchAvailable: top.research.profileAvailable,
    completenessScore: completenessScore(top),
    dataGaps: top.eligibility.dataGaps,
  }];
});

const report = {
  source: path.relative(ROOT, SOURCE),
  batchId: BATCH_ID,
  registryVersion: REGISTRY_VERSION,
  generatedAt: new Date().toISOString(),
  totals: {
    records: companies.length,
    uniqueCompanies: new Set(companies.map((c) => c.canonicalKey)).size,
    eligible: eligible.length,
    excluded: excluded.length,
    needsReview: eligible.filter((c) => c.eligibility.needsReview).length,
    withResearch: companies.filter((c) => c.research.profileAvailable).length,
  },
  eligibleByFamily: byFamily,
  eligibleByTemplate: Object.fromEntries(
    Object.entries(
      eligible.reduce((acc, c) => {
        acc[c.templateId] = (acc[c.templateId] ?? 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])
  ),
  exclusionReasons: exclusionCounts,
  duplicateNameGroups,
  pilotShortlist,
  excludedCompanies: excluded.map((c) => ({
    companyId: c.companyId,
    legalName: c.legalName,
    domain: c.domain,
    industryFamily: c.industryFamily,
    reasons: c.eligibility.exclusionReasons,
  })),
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "companies.json"), JSON.stringify(companies, null, 2));
fs.writeFileSync(path.join(OUT_DIR, "classification-report.json"), JSON.stringify(report, null, 2));

console.log("Registry written:", path.relative(ROOT, path.join(OUT_DIR, "companies.json")));
console.log("Report written:  ", path.relative(ROOT, path.join(OUT_DIR, "classification-report.json")));
console.log("\nTotals:", report.totals);
console.log("\nEligible by template:");
for (const [k, v] of Object.entries(report.eligibleByTemplate)) console.log(`  ${String(v).padStart(3)}  ${k}`);
console.log("\nExclusion reasons:");
for (const [k, v] of Object.entries(exclusionCounts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
