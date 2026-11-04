/**
 * Demo Generator 2.0 — engine data model.
 *
 * Everything here is derived from the canonical registry
 * (`data/generated/companies.json`) plus verified research profiles
 * (`lib/research/data/*.json`). No company fact is invented in this layer.
 */

import type { ProspectResearch } from "@/lib/types";

export type IndustryFamily =
  | "real_estate"
  | "hvac"
  | "construction"
  | "facilities"
  | "manufacturing"
  | "interior"
  | "home_services"
  | "professional"
  | "healthcare"
  | "education"
  | "hospitality"
  | "retail"
  | "other";

export type Eligibility = {
  eligible: boolean;
  exclusionReasons: string[];
  needsReview: boolean;
  reviewReasons: string[];
  dataGaps: string[];
  confidence: number;
};

export type CompanyRecord = {
  companyId: string;
  crmCompanyId: string | null;
  canonicalKey: string;
  sourceIndex: number;
  legalName: string | null;
  displayName: string | null;
  domain: string;
  website: string | null;
  industryRaw: string | null;
  categoryRaw: string | null;
  websiteType: string | null;
  industryFamily: IndustryFamily;
  industryFamilyLabel: string;
  templateId: string;
  templateVersion: string;
  location: {
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    countryCode: string | null;
  };
  contact: { phone: string | null; email: string | null };
  branding: {
    primaryColor: string | null;
    secondaryColor: string | null;
    logoUrl: string | null;
    source: string;
  };
  socialProof: {
    googleRating: number | null;
    reviewCount: number | null;
    keywords: string[];
  };
  decisionMakers: Array<{ name?: string | null; title?: string | null; email?: string | null }>;
  content: {
    summary: string | null;
    personalizationHook: string | null;
    websiteTitle: string | null;
    websiteDescription: string | null;
  };
  audit: {
    sourceQuery: string | null;
    provider: string | null;
    crawlStatus: string | null;
    researchStatus: string | null;
    scoring: Record<string, unknown> | null;
  };
  research: { profileAvailable: boolean; profilePath: string | null };
  eligibility: Eligibility;
  identity: {
    demoId: string;
    slug: string;
    urlPath: string;
    batchId: string;
    registryVersion: string;
    generationStatus: string;
    deploymentStatus: string;
    version: number;
  };
};

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

export type DemoTheme = {
  key: IndustryFamily;
  mode: "light" | "dark";
  paper: string;
  card: string;
  ink: string;
  inkMuted: string;
  line: string;
  brand: string;
  brandStrong: string;
  brandTint: string;
  accent: string;
  displayFont: string;
  bodyFont: string;
  radius: string;
  /** Small uppercase label used for eyebrow copy. */
  eyebrow: string;
  /** Short art-direction note for admin review. */
  artDirection: string;
};

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

export type ServiceItem = {
  name: string;
  blurb: string;
  /** True when the service name came from a verified source (site/CRM). */
  verified: boolean;
};

export type GalleryItem = {
  src: string;
  alt: string;
  /** True when this is licensed stock, not the company's own project imagery. */
  concept: boolean;
};

export type DemoStat = { value: string; label: string; verified: boolean };

export type DemoContent = {
  brandName: string;
  shortName: string;
  initials: string;
  legalName: string;
  domain: string;
  industryLabel: string;
  locationLabel: string;
  city: string | null;
  country: string | null;
  category: string | null;
  keywords: string[];
  hero: {
    kicker: string;
    headlineTop: string;
    headlineAccent: string;
    headlineBottom: string;
    subline: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
    imageVerified: boolean;
    imageAlt: string;
  };
  about: {
    heading: string;
    body: string;
    verified: boolean;
    facts: Array<{ label: string; value: string }>;
  };
  services: ServiceItem[];
  servicesConcept: boolean;
  areas: string[];
  process: Array<{ step: string; title: string; body: string }>;
  stats: DemoStat[];
  rating: { value: number; count: number | null } | null;
  contact: {
    phone: string | null;
    email: string | null;
    address: string | null;
    whatsapp: string | null;
  };
  gallery: GalleryItem[];
  galleryConcept: boolean;
  logo: string | null;
  note: string;
};

/* ------------------------------------------------------------------ */
/* Recipe / page composition                                           */
/* ------------------------------------------------------------------ */

export type HeroVariant = "editorial" | "split" | "fullbleed" | "minimal";
export type SectionKey =
  | "services"
  | "statement"
  | "process"
  | "areas"
  | "gallery"
  | "trust"
  | "contact";

export type DemoRecipe = {
  heroVariant: HeroVariant;
  sections: SectionKey[];
  /** Label for the services section. */
  servicesLabel: string;
  /** Heading for the services section (distinct from the about heading). */
  servicesTitle: string;
  /** Label for the areas section. */
  areasLabel: string;
  /** Narrative order for the process section. */
  processTitle: string;
};

export type DemoConfig = {
  company: CompanyRecord;
  research: ProspectResearch | null;
  theme: DemoTheme;
  content: DemoContent;
  recipe: DemoRecipe;
};
