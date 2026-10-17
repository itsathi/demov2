export type ServiceSection =
  | "hero"
  | "overview"
  | "specifications"
  | "applications"
  | "process"
  | "trust"
  | "cta";

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  capacity: string;
  series: string[];
  standards: string[];
  applications: string[];
  features: string[];
  image: string;
  svg?: string;
  sectionOrder: ServiceSection[];
  featured?: boolean;
};

export type ContactData = {
  email: string;
  address: string;
  phone?: string;
  tollFree?: string;
};

export type SocialProof = {
  googleRating: number;
  reviewCount: number;
  keywords: string[];
};

export type ProjectAsset = {
  name: string;
  location: string;
  img: string;
};

/* ------------------------------------------------------------------ */
/* Industry layer                                                      */
/* ------------------------------------------------------------------ */

/**
 * Which industry generator produced a prospect config. `hvac` is the original
 * (and default) generator, so any prospect without a confident real-estate
 * signal keeps its exact existing output.
 */
export type IndustryKey = "hvac" | "real_estate" | "generic";

/* ------------------------------------------------------------------ */
/* Real-estate property model                                          */
/* ------------------------------------------------------------------ */

export type PropertyStatus =
  | "sale"
  | "rent"
  | "off-plan"
  | "investment"
  | "commercial"
  | "managed";

export type PropertyAvailability =
  | "available"
  | "coming-soon"
  | "sold"
  | "let"
  | "unknown";

/**
 * A single property. Every factual field (price, beds, area, availability,
 * agent) is optional and only ever populated from verified source data — the
 * renderer falls back to a clearly-labelled "to be confirmed" state otherwise.
 */
export type PropertyListing = {
  id: string;
  slug: string;
  title: string;
  status: PropertyStatus;
  propertyType: string;
  reference?: string;
  priceLabel?: string;
  currency?: string;
  priceValue?: number;
  rentalPeriod?: "monthly" | "yearly";
  bedrooms?: number;
  bathrooms?: number;
  areaLabel?: string;
  location?: string;
  community?: string;
  tenure?: string;
  description?: string;
  highlights: string[];
  features: string[];
  images: string[];
  availability: PropertyAvailability;
  agent?: { name: string; title?: string };
  /** True when this is an illustrative example, not verified agency inventory. */
  illustrative: boolean;
  sourceUrl?: string;
};

export type RealEstateDesignDirection =
  | "luxury"
  | "contemporary"
  | "development"
  | "investment";

export type PropertyEnquiryIntent =
  | "details"
  | "viewing"
  | "agent"
  | "availability"
  | "sell"
  | "development";

export type Branding = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tintColor: string;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/* ------------------------------------------------------------------ */
/* Prospect research & real-asset pipeline                             */
/* ------------------------------------------------------------------ */

export type AssetCategory =
  | "logo"
  | "favicon"
  | "hero"
  | "service"
  | "team"
  | "project"
  | "gallery"
  | "testimonial"
  | "background"
  | "icon"
  | "unknown";

export type AssetStatus =
  | "valid"
  | "invalid"
  | "unreachable"
  | "non_image"
  | "too_small"
  | "blocked"
  | "unchecked";

/** Structured metadata for a single image discovered on a prospect's site. */
export type AssetRecord = {
  originalUrl: string;
  resolvedUrl: string;
  sourcePage: string;
  category: AssetCategory;
  alt?: string;
  width?: number | null;
  height?: number | null;
  aspectRatio?: number | null;
  fileType?: string;
  bytes?: number | null;
  /** HTTP status observed during validation (e.g. 206 partial-range success). */
  httpStatus?: number | null;
  /** 0..1 suitability signal — higher is a better hero/section candidate. */
  quality: number;
  status: AssetStatus;
  failureReason?: string;
  checkedAt?: string;
  usedInDemo: boolean;
  manualReview?: boolean;
};

export type ResearchStatus =
  | "research_pending"
  | "research_in_progress"
  | "research_complete"
  | "partially_researched"
  | "assets_ready"
  | "assets_partial"
  | "manual_review_required"
  | "ready_for_demo"
  | "published"
  | "research_failed";

export type ResearchColors = {
  primary?: string;
  secondary?: string;
  accent?: string;
  tint?: string;
};

export type ResearchContact = {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
};

/**
 * One normalized, verified research profile per prospect. This is the single
 * source of truth produced by `scripts/research-prospect.mjs`. Optional fields
 * are only ever populated from verified, publicly available source data.
 */
export type ProspectResearch = {
  slug: string;
  sourceUrl: string;
  /** Final URL after redirects. */
  resolvedUrl?: string;
  status: ResearchStatus;
  researchedAt: string;
  researchVersion: string;
  pagesCrawled: string[];
  /** Verified fields that could NOT be found — explicit, never invented. */
  missingFields: string[];
  /** Sections/assets currently using a controlled fallback. */
  fallbacks: string[];
  assets: AssetRecord[];
  businessName?: string;
  legalName?: string;
  description?: string;
  services: string[];
  serviceAreas: string[];
  contact: ResearchContact;
  ctas: string[];
  trustSignals: string[];
  colors?: ResearchColors;
  logo?: string;
  favicon?: string;
  heroImage?: string;
  serviceImages: Record<string, string>;
  projectImages: string[];
  /** Fields that require a human to confirm before publishing. */
  manualReview: string[];
};

export type ResearchSummary = {
  status: ResearchStatus;
  researchedAt: string;
  assetsDiscovered: number;
  assetsValidated: number;
  assetsRendered: number;
  assetsFailed: number;
  fallbacks: string[];
  missingFields: string[];
  manualReview: string[];
  verified: boolean;
  safeToPublish: boolean;
  logoVerified: boolean;
};

export type ProspectConfig = {
  slug: string;
  companyName: string;
  displayName: string;
  industry: string;
  established: number;
  location: string;
  slogan: string;
  metaRole?: string;
  voice?: DeepPartial<VoiceCopy>;
  hero: {
    kicker: string;
    headlineTop: string;
    headlineAccent: string;
    headlineBottom: string;
    subline: string;
  };
  branding: Branding;
  contact: ContactData;
  socialProof: SocialProof;
  certifications: string[];
  markets: string[];
  facilities: string[];
  images: Record<string, string>;
  projects: ProjectAsset[];
  services: Service[];
  featuredServiceSlug: string;
  designDirection: DesignDirection;
  automation: string[];
  cta: {
    heading: string;
    body: string;
  };
  /** Verified logo asset from the prospect's own website, when available. */
  logo?: string;
  /** Normalized research output for this prospect, when research has run. */
  research?: ProspectResearch;
  /** Derived status summary for the internal review workflow. */
  researchSummary?: ResearchSummary;
  /** Which industry generator produced this config. */
  industryKey?: IndustryKey;
  /** Property inventory — present only for real-estate prospects. */
  listings?: PropertyListing[];
  /** High-level property categories the agency deals in (Buy, Rent, …). */
  propertyCategories?: string[];
  /** Art-direction variant chosen for a real-estate prospect. */
  realEstateDirection?: RealEstateDesignDirection;
  /** Markets/cities the agency serves, when verified. */
  serviceAreas?: string[];
};

export type DesignDirection = {
  theme: "light-technical" | "dark-technical" | string;
  navbar: string;
  hero: string;
  serviceLayout: string;
  trustLayout: string;
  processLayout: string;
  ctaLayout: string;
  imageTreatment: string;
  animationLevel: "low" | "medium" | "high";
  useSvgScenes: boolean;
};

export type CapabilityPoint = {
  icon: "factory" | "rnd" | "award" | "shield" | "handshake" | "users" | "wrench";
  text: string;
};

export type CapabilityStat = { value: string; label: string };

export type ProcessStep = { step: string; title: string; body: string };

export type RegionGroup = { title: string; items: string[] };

export type AssistantAction = { id: string; label: string; reply: string };

export type VoiceCopy = {
  brand: { initial: string; line1: string; line2: string };
  nav: {
    productsLabel: string;
    servicesAllLabel: string;
    projectsLabel: string;
    companyLabel: string;
    contactLabel: string;
    quoteLabel: string;
    homeBack: string;
  };
  hero: {
    primaryCta: string;
    secondaryCta: string;
    heroImageAlt: string;
    ghostText: string;
    stats: { value: string; label: string }[];
    contactCardLabel: string;
    chipsHeading: string;
    scrollCue: string;
  };
  trustLines: string[];
  servicesKicker: string;
  servicesHomeHeading: string;
  servicesHomeBlurb: string;
  servicesIndexHeading: string;
  servicesIndexBlurb: string;
  servicesIndexMetaTitle: string;
  servicesIndexMetaDescription: string;
  capability: {
    kicker: string;
    headline: string;
    body: string;
    points: CapabilityPoint[];
    stats: CapabilityStat[];
    showSvg: boolean;
    svg: string;
    mediaImageKey: string;
    ctaLabel: string;
    bandImageKey: string;
    bandKicker: string;
    bandHeadline: string;
    bandBody: string;
  };
  process: {
    kicker: string;
    headline: string;
    body: string;
    steps: ProcessStep[];
  };
  regions: {
    kicker: string;
    headline: string;
    body: string;
    groups: RegionGroup[];
  };
  projectsIntro: { kicker: string; headline: string; body: string; footer: string };
  serviceDetail: {
    overviewHeadingPrefix: string;
    figureCaptionSuffix: string;
    badge: string;
    footnote: string;
    specsHeading: string;
    applicationsKicker: string;
    applicationsHeading: string;
  };
  ctaFeatures: { iconKey: "mouse" | "chart" | "chat" | "bell"; title: string; body: string }[];
  footer: { blurb: string };
  assistant: {
    name: string;
    greeting: string;
    placeholder: string;
    fallbackEmail: string;
    actions: AssistantAction[];
    leadTitle: string;
    leadBody: string;
    routed: string;
    followUp: string;
  };
  formNote: string;
};