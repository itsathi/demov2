import type { RawProspectData, RawCompany, RawAudit } from "./rawProspectTypes";
import type {
  ProspectConfig,
  Service,
  DesignDirection,
  VoiceCopy,
  AssistantAction,
  CapabilityPoint,
  CapabilityStat,
  ProcessStep,
  RegionGroup,
  PropertyListing,
  PropertyStatus,
  PropertyAvailability,
  RealEstateDesignDirection,
} from "./types";
import {
  slugify,
  extractDisplayName,
  extractCompanyName,
  deriveSlug,
  deriveInitials,
  deriveEstablished,
  detectCountryKey,
  deriveLocation,
} from "./prospectGenerator";
import { prospectHaystack } from "./industries/types";

/**
 * Real-estate industry generator.
 *
 * Turns a raw prospect record (the same `{ company, audit }` shape used by the
 * HVAC generator) into a `ProspectConfig` whose vocabulary, services, editorial
 * structure and conversion paths belong to property — not air conditioning.
 *
 * Truthfulness rules (see brief §4, §8, §14):
 *  - Nothing factual is invented. Prices, addresses, dimensions, agent names,
 *    availability and certifications stay empty unless verified source data
 *    supplies them.
 *  - Property inventory that is not verified is generated as clearly-labelled
 *    illustrative examples (`illustrative: true`) and rendered with a visible
 *    "Example property — illustrative only" badge.
 */

const S = "https://images.unsplash.com/photo";
const q = "?w=1920&h=1280&fit=crop&q=80";

export const reStock = {
  villaExterior: `${S}-1613490493576-7fde63acd811${q}`,
  modernHome: `${S}-1600596542815-ffad4c1539a9${q}`,
  penthouse: `${S}-1600607687939-ce8a6c25118c${q}`,
  livingRoom: `${S}-1600566753086-00f18fb6b3ea${q}`,
  poolVilla: `${S}-1512917774080-9991f1c4c750${q}`,
  apartmentTower: `${S}-1545324418-cc1a3fa10c00${q}`,
  skyline: `${S}-1512453979798-5ea266f8880c${q}`,
  bedroom: `${S}-1560448204-e02f11c3d0e2${q}`,
  kitchen: `${S}-1556909212-d5b604d0c90d${q}`,
  office: `${S}-1497366216548-37526070297c${q}`,
  aerialCommunity: `${S}-1502005229762-cf1b2da7c5d6${q}`,
  offPlan: `${S}-1503387762-592deb58ef4e${q}`,
  townhouse: `${S}-1580587771525-78b9dba3b914${q}`,
  interiorWarm: `${S}-1560185007-cde436f6a4d0${q}`,
  facade: `${S}-1600585154340-be6161a56a0c${q}`,
  garden: `${S}-1600607687920-4e2a09cf159d${q}`,
};

/* ------------------------------------------------------------------ */
/* Art direction                                                       */
/* ------------------------------------------------------------------ */

export type RealEstateDirectionSpec = {
  theme: string;
  /** Light or dark editorial surface. */
  mode: "light" | "dark";
  /** Default palette overrides applied when the prospect supplies no colours. */
  palette: { primary: string; secondary: string; accent: string; tint: string };
  /** Human-readable art-direction notes (internal review). */
  notes: string;
};

export const RE_DIRECTIONS: Record<RealEstateDesignDirection, RealEstateDirectionSpec> = {
  luxury: {
    theme: "re-luxury",
    mode: "dark",
    palette: { primary: "#9c7c45", secondary: "#6f5630", accent: "#c9a86a", tint: "#f4efe6" },
    notes: "Deep charcoal + warm ivory, restrained bronze accent, monumental editorial type.",
  },
  contemporary: {
    theme: "re-contemporary",
    mode: "light",
    palette: { primary: "#0a1f33", secondary: "#123a5c", accent: "#3d7ea6", tint: "#eef2f5" },
    notes: "Clean neutral surfaces, strong type, precise grids, large photography.",
  },
  development: {
    theme: "re-development",
    mode: "dark",
    palette: { primary: "#1c1a17", secondary: "#3a352d", accent: "#b0895a", tint: "#efe9df" },
    notes: "Architectural project storytelling, cinematic imagery, material palettes.",
  },
  investment: {
    theme: "re-investment",
    mode: "light",
    palette: { primary: "#0b3d2e", secondary: "#146046", accent: "#c9a227", tint: "#eef4f0" },
    notes: "Clear fundamentals, location context, direct enquiry paths, uncluttered data.",
  },
};

export function detectRealEstateDirection(raw: RawProspectData): RealEstateDesignDirection {
  // Art direction is a presentation choice, not a factual claim. Strong signals
  // in the brand's own name win; otherwise a deterministic hash spreads the
  // agencies across looks so neighbouring demos never feel identical.
  const name = `${raw.company.name} ${raw.company.category ?? ""}`;
  if (/luxury|bespoke|exclusive|signature|prime|couture|prestige|fine homes/i.test(name))
    return "luxury";
  if (/investment|investor|capital|yield|\bfunds?\b|asset management/i.test(name))
    return "investment";
  if (/developer|development|off.?plan|master ?plan|realty|estates/i.test(name))
    return "development";

  const dirs: RealEstateDesignDirection[] = [
    "contemporary",
    "luxury",
    "development",
    "investment",
  ];
  const key = deriveSlug(raw);
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return dirs[(h >>> 0) % dirs.length];
}

/* ------------------------------------------------------------------ */
/* Property categories (rendered as the "what we do" service range)     */
/* ------------------------------------------------------------------ */

type CategoryTemplate = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  capacity: string;
  series: string[];
  applications: string[];
  features: string[];
  image: string;
};

const CATEGORY_LIBRARY: Record<string, CategoryTemplate> = {
  buy: {
    slug: "buy",
    name: "Buy",
    shortName: "Buy",
    tagline: "Homes to own — from first apartments to landmark villas and penthouses.",
    summary:
      "A curated acquisition service for buyers, covering ready and off-plan homes across the market. Every shortlist is matched to your brief, budget and location before a single viewing.",
    capacity: "Sales & Advisory",
    series: ["Ready homes", "Off-plan launches", "Villa & townhouse communities", "Apartments & penthouses"],
    applications: ["Villas", "Apartments", "Penthouses", "Townhouses", "Plots"],
    features: [
      "Brief-led shortlisting rather than endless listings",
      "Comparable-sales guidance to inform your offer",
      "Support through reservation and transfer",
      "Independent view of resale and rental potential where data exists",
    ],
    image: reStock.modernHome,
  },
  rent: {
    slug: "rent",
    name: "Rent",
    shortName: "Rent",
    tagline: "Long and short-term rentals, matched to how you actually want to live.",
    summary:
      "A leasing service for tenants, covering furnished and unfurnished homes. Availability is confirmed directly with landlords, and every viewing is arranged around your schedule.",
    capacity: "Leasing",
    series: ["Long-term leases", "Furnished rentals", "Serviced residences", "Relocation support"],
    applications: ["Apartments", "Villas", "Townhouses", "Serviced residences"],
    features: [
      "Confirmed availability before you travel to a viewing",
      "Clear move-in costs, disclosed up front",
      "Tenancy paperwork handled end to end",
      "Ongoing support for maintenance and renewals",
    ],
    image: reStock.penthouse,
  },
  sell: {
    slug: "sell",
    name: "Sell",
    shortName: "Sell",
    tagline: "A considered sale process — positioning, presentation and qualified buyers.",
    summary:
      "A seller-representation service that begins with positioning and pricing, then presents your property through considered photography and copy to a qualified buyer network. You see every enquiry and every viewing request.",
    capacity: "Seller Representation",
    series: ["Positioning & pricing guidance", "Photography & editorial presentation", "Qualified buyer outreach", "Viewings & negotiation"],
    applications: ["Villas", "Apartments", "Penthouses", "Townhouses"],
    features: [
      "Honest valuation before any commitment",
      "Presentation built around the property's real strengths",
      "Qualified-buyer screening, not open-door viewings",
      "Clear reporting on enquiries and interest",
    ],
    image: reStock.garden,
  },
  developments: {
    slug: "developments",
    name: "Developments",
    shortName: "New Build",
    tagline: "New-build and off-plan projects, presented with the detail they deserve.",
    summary:
      "Representation for developers and buyers of new-build projects — residence types, floor plates, amenities and the location story, presented without invented completion dates, returns or approval claims.",
    capacity: "Off-plan & New Build",
    series: ["Residence types", "Floor plans", "Amenities & specification", "Location & lifestyle"],
    applications: ["Off-plan residences", "Master-planned communities", "Branded residences", "Mixed-use projects"],
    features: [
      "Project storytelling grounded in documented detail",
      "Residence-type comparison and availability",
      "Registration-of-interest capture",
      "No invented completion dates or investment returns",
    ],
    image: reStock.offPlan,
  },
  commercial: {
    slug: "commercial",
    name: "Commercial",
    shortName: "Commercial",
    tagline: "Offices, retail and industrial space for occupiers and investors.",
    summary:
      "Commercial property advisory covering offices, retail units and industrial space — briefed around your operational needs, timing and budget, with transparent cost and lease comparisons.",
    capacity: "Commercial Advisory",
    series: ["Offices", "Retail units", "Industrial & warehousing", "Fit-out coordination"],
    applications: ["Offices", "Retail", "Warehousing", "Light industrial"],
    features: [
      "Requirement-led search rather than a listings dump",
      "Lease and total-occupancy-cost comparisons",
      "Landlord and developer liaison",
      "Handover and fit-out coordination",
    ],
    image: reStock.office,
  },
  investment: {
    slug: "investment",
    name: "Investment",
    shortName: "Invest",
    tagline: "Income and growth opportunities, presented on fundamentals — not hype.",
    summary:
      "An investment property service built around the fundamentals available in genuine source data: location context, property type and the questions worth asking before you commit. No promised yields or guaranteed returns.",
    capacity: "Investment Advisory",
    series: ["Income-focused apartments", "Capital-growth locations", "Portfolio building", "Exit & resale planning"],
    applications: ["Apartments", "Villas", "Commercial units", "Off-plan"],
    features: [
      "Comparable and location context where verifiable",
      "Costs and ownership considerations explained plainly",
      "Questions worth asking honestly flagged",
      "No invented yields, returns or guarantees",
    ],
    image: reStock.apartmentTower,
  },
  management: {
    slug: "property-management",
    name: "Property Management",
    shortName: "Manage",
    tagline: "Day-to-day care for owners and landlords, with clear reporting.",
    summary:
      "Property management for owners who want their asset cared for and their reporting clear — tenant liaison, maintenance coordination and transparent accounting for residential and commercial portfolios.",
    capacity: "Management & Lettings",
    series: ["Tenant sourcing & screening", "Rent collection & reporting", "Maintenance coordination", "Renewals & renewals"],
    applications: ["Villas", "Apartments", "Portfolios", "Commercial units"],
    features: [
      "Single point of contact for owners",
      "Clear statements and maintenance records",
      "Coordinated, in-house or vetted trades",
      "Renewal and re-letting handled proactively",
    ],
    image: reStock.livingRoom,
  },
};

function derivePropertyCategories(raw: RawProspectData): string[] {
  const hay = prospectHaystack(raw);
  const cats = new Set<string>(["buy", "rent", "sell"]);
  if (/investment|invest\b|investor|yield|returns?|portfolio/.test(hay)) cats.add("investment");
  if (/commercial|office|retail|warehouse|industrial|fit-?out/.test(hay)) cats.add("commercial");
  if (/off.?plan|development|developer|new build|new-build|handover|master ?plan|residences/.test(hay)) cats.add("developments");
  if (/manage|management|landlord|tenant|letting|rental collection|property care/.test(hay)) cats.add("management");
  return [...cats];
}

function buildCategoryService(
  key: string,
  index: number,
  displayName: string,
  city: string
): Service {
  const tpl = CATEGORY_LIBRARY[key] ?? CATEGORY_LIBRARY.buy;
  return {
    slug: tpl.slug,
    name: tpl.name,
    shortName: tpl.shortName,
    tagline: tpl.tagline,
    summary: `${displayName} — ${tpl.summary}`,
    capacity: tpl.capacity,
    series: tpl.series,
    standards: [],
    applications: tpl.applications.map((a) => `${a} in ${city}`),
    features: tpl.features,
    image: tpl.image,
    sectionOrder: ["hero", "overview", "applications", "trust", "cta"],
    featured: index < 4,
  };
}

/* ------------------------------------------------------------------ */
/* Illustrative property inventory                                     */
/* ------------------------------------------------------------------ */

type ListingSeed = {
  title: string;
  status: PropertyStatus;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  price: { value: number; currency: string; period?: "monthly" | "yearly" };
  images: string[];
  highlights: string[];
  features: string[];
  availability: PropertyAvailability;
};

function listingSeeds(city: string): ListingSeed[] {
  return [
    {
      title: `Contemporary garden villa in ${city}`,
      status: "sale",
      propertyType: "Villa",
      bedrooms: 5,
      bathrooms: 6,
      areaSqft: 6200,
      price: { value: 6200000, currency: "AED" },
      images: [reStock.villaExterior, reStock.livingRoom, reStock.kitchen, reStock.poolVilla],
      highlights: ["Private garden", "Double-height living space", "Covered parking for four"],
      features: ["Landscaped garden", "Guest suite", "Maid's room", "Private pool"],
      availability: "available",
    },
    {
      title: `Skyline apartment with panoramic views`,
      status: "sale",
      propertyType: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      areaSqft: 1350,
      price: { value: 1750000, currency: "AED" },
      images: [reStock.penthouse, reStock.interiorWarm, reStock.bedroom],
      highlights: ["Full-height glazing", "Concierge building", "Walk to retail and dining"],
      features: ["Balcony", "Built-in wardrobes", "Central A/C", "Gym & pool access"],
      availability: "available",
    },
    {
      title: `Furnished townhouse, ready to move in`,
      status: "rent",
      propertyType: "Townhouse",
      bedrooms: 3,
      bathrooms: 4,
      areaSqft: 2400,
      price: { value: 185000, currency: "AED", period: "yearly" },
      images: [reStock.townhouse, reStock.livingRoom, reStock.garden],
      highlights: ["Community living", "Landscaped frontage", "Near schools"],
      features: ["Furnished", "Garden", "Covered parking", "Community pool"],
      availability: "available",
    },
    {
      title: `Waterfront penthouse residence`,
      status: "sale",
      propertyType: "Penthouse",
      bedrooms: 4,
      bathrooms: 5,
      areaSqft: 4800,
      price: { value: 11500000, currency: "AED" },
      images: [reStock.facade, reStock.penthouse, reStock.bedroom, reStock.livingRoom],
      highlights: ["Private terrace", "Marina aspect", "Signature building"],
      features: ["Private lift lobby", "Roof terrace", "Smart home", "Two parking bays"],
      availability: "available",
    },
    {
      title: `New-build residences — register your interest`,
      status: "off-plan",
      propertyType: "Apartment",
      bedrooms: 3,
      bathrooms: 3,
      areaSqft: 1700,
      price: { value: 2400000, currency: "AED" },
      images: [reStock.offPlan, reStock.apartmentTower, reStock.interiorWarm],
      highlights: ["Range of residence types", "Amenity-led masterplan", "Early registrations open"],
      features: ["Choice of layouts", "Retail podium", "Landscaped podium", "Completion date on request"],
      availability: "coming-soon",
    },
    {
      title: `Investment apartment with strong rental demand`,
      status: "investment",
      propertyType: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      areaSqft: 780,
      price: { value: 980000, currency: "AED" },
      images: [reStock.apartmentTower, reStock.bedroom, reStock.livingRoom],
      highlights: ["Central location", "High occupancy area", "Managed letting available"],
      features: ["Pool & gym", "24/7 security", "Community retail", "Metro access"],
      availability: "available",
    },
  ];
}

function priceLabelFor(seed: ListingSeed, status: PropertyStatus): string | undefined {
  if (!seed.price) return undefined;
  const formatted = seed.price.value.toLocaleString("en-US");
  const amount = `${seed.price.currency} ${formatted}`;
  if (status === "rent") return seed.price.period === "monthly" ? `${amount} / month` : `${amount} / year`;
  return `From ${amount}`;
}

function buildListings(city: string): PropertyListing[] {
  const seeds = listingSeeds(city);
  return seeds.map((seed, i) => {
    const id = `example-${slugify(seed.propertyType)}-${i + 1}`;
    return {
      id,
      slug: id,
      title: seed.title,
      status: seed.status,
      propertyType: seed.propertyType,
      priceLabel: priceLabelFor(seed, seed.status),
      currency: seed.price?.currency,
      priceValue: seed.price?.value,
      rentalPeriod: seed.price?.period,
      bedrooms: seed.bedrooms,
      bathrooms: seed.bathrooms,
      areaLabel: `${seed.areaSqft.toLocaleString("en-US")} sq ft`,
      location: city,
      description: `Illustrative ${seed.propertyType.toLowerCase()} example, prepared to show how property detail, imagery and enquiry would be presented. Replace with a verified listing before publishing.`,
      highlights: seed.highlights,
      features: seed.features,
      images: seed.images,
      availability: seed.availability,
      illustrative: true,
    } satisfies PropertyListing;
  });
}

/* ------------------------------------------------------------------ */
/* Voice                                                               */
/* ------------------------------------------------------------------ */

function buildVoice(
  displayName: string,
  city: string,
  regionLabel: string,
  established: number,
  categories: Service[],
  contactEmail: string,
  rating: number | null,
  reviews: number | null
): VoiceCopy {
  const hasRating = rating !== null && reviews !== null;
  const stats = [
    { value: `${established}`, label: `Serving ${city} since` },
    { value: `${categories.length}`, label: "Ways we can help" },
    { value: city, label: "Primary market" },
    ...(hasRating ? [{ value: `${rating}`, label: `${reviews} Google reviews` }] : []),
  ].slice(0, 4);

  return {
    brand: { initial: deriveInitials(displayName), line1: displayName.toUpperCase(), line2: `Est. ${established} · ${city}` },
    nav: {
      productsLabel: "Properties",
      servicesAllLabel: "Our services",
      projectsLabel: "Portfolio",
      companyLabel: "About",
      contactLabel: "Contact",
      quoteLabel: "Book a viewing",
      homeBack: "Back to overview",
    },
    hero: {
      primaryCta: "Book a viewing",
      secondaryCta: "Explore properties",
      heroImageAlt: `${displayName} — property in ${city}`,
      ghostText: `${displayName.toUpperCase()} · ${city.toUpperCase()}`,
      stats,
      contactCardLabel: "Prefer to talk? Reach the team",
      chipsHeading: "Why buyers choose us",
      scrollCue: "Discover the portfolio",
    },
    trustLines: [
      ...(hasRating ? [`${rating} ★ Google rating · ${reviews} reviews`] : []),
      `Property advisory in ${city}`,
    ],
    servicesKicker: "How we help",
    servicesHomeHeading: `A considered approach to property in ${city}`,
    servicesHomeBlurb:
      "Buy, sell, rent and manage — with honest guidance, considered presentation and qualified enquiries rather than a listings dump.",
    servicesIndexHeading: `The complete {displayName} service`,
    servicesIndexBlurb:
      "{count} ways we help with property in " + city + " — from first viewings to managed portfolios.",
    servicesIndexMetaTitle: `${displayName} — Property services`,
    servicesIndexMetaDescription:
      `Buy, sell, rent and manage property with ${displayName} in ${city}. Considered presentation and qualified enquiries.`,
    capability: {
      kicker: "How we work",
      headline: `Property, presented the way it deserves in ${city}`,
      body:
        `${displayName} pairs considered presentation with straight talking. You see honest information, confirmed availability and qualifying questions up front — never invented figures or pressure.`,
      points: [
        { icon: "handshake", text: "Honest guidance — no invented prices or promised returns" },
        { icon: "shield", text: "Availability confirmed directly before viewings" },
        { icon: "users", text: "A local team that knows the communities it serves" },
        { icon: "award", text: `Serving ${city} since ${established}` },
      ] as CapabilityPoint[],
      stats: [
        { value: `${established}`, label: `In ${city} since` },
        { value: `${categories.length}`, label: "Property services" },
        ...(hasRating ? [{ value: `${rating}★`, label: `${reviews} Google reviews` }] : []),
      ].slice(0, 3) as CapabilityStat[],
      showSvg: false,
      svg: "",
      mediaImageKey: "heroPoster",
      ctaLabel: "See how we can help",
      bandImageKey: "showreelPoster",
      bandKicker: `${city}`,
      bandHeadline: `A local team for ${city} property`,
      bandBody:
        "Considered presentation, honest information and a qualified enquiry flow — the way property should be discovered.",
    },
    process: {
      kicker: "From enquiry to viewing",
      headline: "A clear path from first enquiry to a confirmed viewing",
      body: "Tell us what you're looking for — the team responds with relevant detail and a viewing that suits your schedule.",
      steps: [
        { step: "01", title: "Tell us your brief", body: "Share what you're looking for, where and your rough budget or requirement." },
        { step: "02", title: "We shortlist", body: "We match your brief against available property and confirm what is genuinely available." },
        { step: "03", title: "You view", body: "We arrange viewings around your schedule — no wasted trips to unavailable homes." },
        { step: "04", title: "We guide", body: "Comparable evidence, honest advice and answers to the questions that matter." },
        { step: "05", title: "We complete", body: "Support through offer, paperwork and handover with a single point of contact." },
      ] as ProcessStep[],
    },
    regions: {
      kicker: "Where we operate",
      headline: `Serving ${city} and the surrounding communities`,
      body: "We focus on the communities we know well, so the advice you get is grounded in the local market.",
      groups: [
        { title: `${city}`, items: [`${city} centre`, "Residential communities", "Waterfront & city districts", "Established suburbs"] },
        { title: "Surrounding areas", items: [`${regionLabel}`, "New communities", "Commercial districts"] },
      ] as RegionGroup[],
    },
    projectsIntro: {
      kicker: "Example properties",
      headline: `A sense of how property is presented`,
      body: "Illustrative examples showing the standard of presentation for property detail, imagery and enquiries. Replace with verified inventory before publishing.",
      footer: "Scroll to explore — {count} example property presentations.",
    },
    serviceDetail: {
      overviewHeadingPrefix: displayName,
      figureCaptionSuffix: "presented by",
      badge: "Considered presentation",
      footnote:
        "Every property is presented with honest information and confirmed availability — no invented figures, no pressure.",
      specsHeading: "What's included",
      applicationsKicker: "Where it applies",
      applicationsHeading: "Property types we work with",
    },
    ctaFeatures: [
      { iconKey: "mouse", title: "A qualified enquiry, not a missed call", body: "Every viewing request and enquiry is captured and routed to the right person." },
      { iconKey: "chart", title: "Demand you can see", body: "Understand which property types and locations attract genuine interest." },
      { iconKey: "chat", title: "Answers before a call-back", body: "Common questions are answered instantly, so conversations start further along." },
      { iconKey: "bell", title: "The team is notified live", body: "New enquiries land with the right agent immediately — no manual forwarding." },
    ],
    footer: {
      blurb: `property advisory in ${city}, ${regionLabel} — buy, sell, rent and manage with honest guidance.`,
    },
    assistant: {
      name: `${displayName} assistant`,
      greeting: `Hi — I'm the ${displayName} assistant. Ask about a property, arrange a viewing, or tell me what you're looking for in ${city}.`,
      placeholder: `Ask about property in ${city}…`,
      fallbackEmail: contactEmail,
      actions: [
        { id: "viewing", label: "Book a viewing", reply: "Happy to arrange a viewing. Tell me which property (or the type and area) and a preferred day, and the team will confirm availability and a slot." },
        { id: "buy", label: "Buying — help me shortlist", reply: `Share your budget, preferred areas in ${city}, and how many bedrooms — the team will shortlist what is genuinely available.` },
        { id: "rent", label: "Looking to rent", reply: "Tell me furnished or unfurnished, area and budget, and I'll have the leasing team confirm what's available this week." },
        { id: "sell", label: "I want to sell", reply: "We can talk you through positioning and pricing with no obligation. Share the property type and area to start." },
        { id: "agent", label: "Speak to an agent", reply: `Of course — the team can call or email. Share the best way and time to reach you at ${displayName}.` },
      ] as AssistantAction[],
      leadTitle: "Enquiry logged",
      leadBody: `Your {label} enquiry is with the ${displayName} team. Someone will follow up shortly with relevant detail.`,
      routed: `and routed it to the ${displayName} team.`,
      followUp: "One of the team will come back to you shortly. Anything else I can help with?",
    },
    formNote:
      "The assistant opens automatically — see how a property enquiry is captured, qualified and routed without a single manual step.",
  };
}

/* Headline varies with the chosen art direction so neighbouring demos do not
 * repeat one line. Direction is presentation only — no factual claim is made. */
function headlineFor(
  direction: RealEstateDesignDirection,
  city: string
): { top: string; accent: string; bottom: string } {
  switch (direction) {
    case "luxury":
      return { top: "Exceptional homes,", accent: "quietly", bottom: `presented in ${city}.` };
    case "development":
      return { top: `${city}'s new`, accent: "addresses,", bottom: "in one place." };
    case "investment":
      return { top: "Property in", accent: city + ",", bottom: "on the fundamentals." };
    default:
      return { top: "Find a place", accent: "that feels", bottom: `like yours in ${city}.` };
  }
}

/* ------------------------------------------------------------------ */
/* Transform                                                           */
/* ------------------------------------------------------------------ */

export function transformRawRealEstateProspect(raw: RawProspectData): ProspectConfig {
  const company: RawCompany = raw.company;
  const audit: RawAudit | null | undefined = raw.audit;

  const displayName = extractDisplayName(company.name);
  const companyName = extractCompanyName(company.name);
  const slug = deriveSlug(raw);
  const established = deriveEstablished(company);
  const countryKey = detectCountryKey(company, audit);
  const isAustralia = countryKey === "AU";
  const regionLabel = isAustralia ? "Australia" : "UAE";
  const { city, state, country, fullLocation } = deriveLocation(company, audit, countryKey);

  const direction = detectRealEstateDirection(raw);
  const spec = RE_DIRECTIONS[direction];

  const primaryColor = company.branding?.primaryColor || spec.palette.primary;
  const secondaryColor = company.branding?.secondaryColor || spec.palette.secondary;
  const accentColor = company.branding?.accentColor || spec.palette.accent;
  const tintColor = company.branding?.tintColor || spec.palette.tint;

  const rating = company.socialProof?.googleRating ?? null;
  const reviews = company.socialProof?.reviewCount ?? null;

  const fallbackPhone = isAustralia ? "+61 1300 000 000" : "+971 50 123 4567";
  const contactPhone = company.contact?.phone || company.contact?.rawPhone || fallbackPhone;
  const fallbackTld = isAustralia ? ".com.au" : ".ae";
  const contactEmail = company.contact?.email || `info@${company.contact?.domain || slugify(displayName) + fallbackTld}`;
  const contactAddress = company.location?.address || `${city}, ${country}`;

  const categoryTitle = company.category || company.industry || "Real Estate";
  const metaRole = categoryTitle;

  const categoriesKeys = derivePropertyCategories(raw);
  const categoryServices = categoriesKeys.map((k, i) =>
    buildCategoryService(k, i, displayName, city)
  );
  const featuredServiceSlug = categoryServices[0]?.slug || "buy";

  const heroSubline =
    audit?.summary ||
    audit?.websiteDetails?.description ||
    `${displayName} helps buyers, sellers, landlords and tenants across ${city} — with considered presentation, honest guidance and qualified enquiries.`;

  const slogan =
    audit?.personalizationHook ||
    `Property in ${city}, presented honestly and thoughtfully.`;

  const listings = buildListings(city);

  const heroImage = reStock.skyline;

  const voice = buildVoice(
    displayName,
    city,
    regionLabel,
    established,
    categoryServices,
    contactEmail,
    rating,
    reviews
  );

  const designDirection: DesignDirection = {
    theme: spec.theme,
    navbar: "NavbarTransparent",
    hero: "HeroResidences",
    serviceLayout: "ServiceEditorial",
    trustLayout: "TrustRating",
    processLayout: "ProcessEditorial",
    ctaLayout: "CtaEngineered",
    imageTreatment: "ImageFullBleed",
    animationLevel: "high",
    useSvgScenes: false,
  };

  const projects = listings.slice(0, 6).map((l) => ({
    name: l.title,
    location: l.location || city,
    img: l.images[0],
  }));

  const headline = headlineFor(direction, city);

  return {
    slug,
    companyName,
    displayName,
    industry: company.industry || "Real Estate",
    established,
    location: fullLocation,
    slogan,
    metaRole,
    hero: {
      kicker: `Est. ${established} · ${city}, ${regionLabel} · Property`,
      headlineTop: headline.top,
      headlineAccent: headline.accent,
      headlineBottom: headline.bottom,
      subline: heroSubline,
    },
    branding: { primaryColor, secondaryColor, accentColor, tintColor },
    contact: { email: contactEmail, address: contactAddress, phone: contactPhone },
    socialProof: {
      googleRating: rating ?? 0,
      reviewCount: reviews ?? 0,
      keywords: company.socialProof?.topKeywords ?? categoryServices.map((s) => s.name),
    },
    certifications: [],
    markets: isAustralia
      ? [city, state, "Australia"].filter((v, i, a) => v && a.indexOf(v) === i)
      : [city, "Dubai", "Abu Dhabi", "United Arab Emirates"],
    facilities: [
      `Advisory team — ${city}, ${regionLabel}`,
      `Buyer, seller and tenant representation`,
    ],
    images: {
      officeBanner: reStock.office,
      aerial: reStock.aerialCommunity,
      factorySharjah: reStock.facade,
      heroPoster: heroImage,
      showreelPoster: reStock.livingRoom,
      interior: reStock.interiorWarm,
    },
    projects,
    services: categoryServices,
    featuredServiceSlug,
    designDirection,
    automation: [
      "Enquiry received",
      "AI qualification",
      "Property shortlist matched",
      "Buyer profile created in CRM",
      "Agent notified with slot",
      "Viewing follow-up scheduled",
    ],
    cta: {
      heading: `Let's find the right property.`,
      body: `Tell us what you're looking for — buying, renting, selling or investing — and the ${displayName} team will respond with relevant detail and a viewing that suits you.`,
    },
    voice,
    industryKey: "real_estate",
    listings,
    propertyCategories: categoriesKeys,
    realEstateDirection: direction,
    serviceAreas: [city],
  };
}
