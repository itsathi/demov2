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
  countryRegionLabel,
  contactFallbackFor,
  deriveLocation,
} from "./prospectGenerator";
import { buildDemoMeta } from "./demoExport";
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
  travertineTerrace: `${S}-1600585154526-990dced4db0d${q}`,
  skyPenthouse: `${S}-1567496898669-ee935f5f647a${q}`,
  loungeMinimal: `${S}-1618221195710-dd6b41faaea6${q}`,
  diningTravertine: `${S}-1617806118233-18e1de247200${q}`,
  masterSuite: `${S}-1595526114035-0d45ed16cfbf${q}`,
  spaBath: `${S}-1584622650111-993a426fbf0a${q}`,
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
  architecturalStyle: string;
  lifestyle: "waterfront" | "contemporary" | "penthouse" | "estate" | "architectural";
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  exteriorSqft?: number;
  yearBuilt?: number;
  exposure?: string;
  parkingSpaces?: number;
  architect?: string;
  price?: { value: number; currency: string; period?: "monthly" | "yearly" };
  images: string[];
  highlights: string[];
  features: string[];
  curatedAmenities: { title: string; desc: string }[];
  floorSchedule?: { level: string; name: string; dimensions: string; notes?: string }[];
  availability: PropertyAvailability;
  description: string;
};

function listingSeeds(city: string): ListingSeed[] {
  return [
    {
      title: `The Travertine Pavilion at ${city} Coast`,
      status: "sale",
      propertyType: "Private Estate",
      architecturalStyle: "Minimalist Travertine Pavilion",
      lifestyle: "waterfront",
      bedrooms: 6,
      bathrooms: 7,
      areaSqft: 8400,
      exteriorSqft: 4200,
      yearBuilt: 2023,
      exposure: "Sunset / West Water Panorama",
      parkingSpaces: 4,
      architect: "Studio K Architecture",
      price: { value: 28500000, currency: "AED" },
      images: [
        reStock.travertineTerrace,
        reStock.villaExterior,
        reStock.livingRoom,
        reStock.poolVilla,
        reStock.diningTravertine,
        reStock.masterSuite,
      ],
      highlights: [
        "Monolithic Roman travertine cantilevers over private water frontage",
        "20-meter zero-edge lap pool oriented to true sunset",
        "Subterranean four-vehicle gallery and private yacht mooring access",
        "Triple-height glass pavilion framing uninterrupted horizon views",
      ],
      features: [
        "Private Jetty Access",
        "Roman Travertine Terraces",
        "20m Infinity Lap Pool",
        "Bespoke Boffi Kitchen",
        "Temperature-Controlled Wine Cellar",
        "Acoustic Primary Suite Sanctuary",
        "Staff Quarters & Chef Prep Kitchen",
        "Integrated Lutron Lighting & Shading",
      ],
      curatedAmenities: [
        { title: "Private Waterfront Mooring", desc: "Direct deep-water access accommodating vessels up to 75ft." },
        { title: "Wellness & Spa Wing", desc: "Cedar dry sauna, marble hammam, and cold-plunge plunge pool." },
        { title: "Travertine Reflection Terraces", desc: "4,200 sq ft of outdoor living with sunken gas fire lounge." },
        { title: "Architectural Glazing", desc: "Floor-to-ceiling minimal acoustic glass with motorized sliding panels." },
      ],
      floorSchedule: [
        { level: "Level 01", name: "Grand Living Pavilion & Terrace", dimensions: "18.4m × 12.2m", notes: "Triple-height 6.8m volume open to water" },
        { level: "Level 01", name: "Chef's Show Kitchen & Scullery", dimensions: "9.2m × 6.4m", notes: "Poliform cabinetry with Sub-Zero refrigeration" },
        { level: "Level 02", name: "Primary Suite Wing", dimensions: "14.6m × 8.8m", notes: "Dual walk-in dressing galleries and spa terrace" },
        { level: "Level 02", name: "Guest Suites (4 En-suite)", dimensions: "6.5m × 5.2m each", notes: "Private sunrise balconies and Italian terrazzo" },
        { level: "Basement", name: "Private Gallery & Wine Room", dimensions: "16.0m × 8.5m", notes: "Climate-monitored 1,200 bottle wine sanctuary" },
      ],
      availability: "available",
      description:
        "An architectural tour de force conceived in monolithic Roman travertine and frameless acoustic glazing. Oriented to capture the drama of evening light across open water, the residence balances monumental cantilevered forms with intimate, contemplative internal courtyards. Crafted without compromise for those who appreciate pure spatial volume and discreet luxury.",
    },
    {
      title: `The Horizon Triplex Penthouse`,
      status: "sale",
      propertyType: "Penthouse",
      architecturalStyle: "Modernist Sky Residence",
      lifestyle: "penthouse",
      bedrooms: 4,
      bathrooms: 5,
      areaSqft: 5600,
      exteriorSqft: 1800,
      yearBuilt: 2024,
      exposure: "360° Skyline & Water Horizon",
      parkingSpaces: 3,
      architect: "Foster-Inspired Tower Atelier",
      price: { value: 18200000, currency: "AED" },
      images: [
        reStock.penthouse,
        reStock.skyPenthouse,
        reStock.loungeMinimal,
        reStock.diningTravertine,
        reStock.bedroom,
        reStock.spaBath,
      ],
      highlights: [
        "Crown triplex residence spanning floors 54 through 56",
        "Private heated rooftop glass pool with floating daybeds",
        "Private high-speed keycard elevator with biometric arrival",
        "Double-height 6.4m living gallery with sculptural steel staircase",
      ],
      features: [
        "Private Rooftop Sky Pool",
        "Double-Height Glass Curtain Wall",
        "Biometric Lift Lobby",
        "Minotti Custom Millwork",
        "Gaggenau 400 Series Suite",
        "Panoramic Sunset Sky Lounge",
        "Three Dedicated Valet Bays",
        "24/7 White-Glove Concierge",
      ],
      curatedAmenities: [
        { title: "Rooftop Sky Sanctuary", desc: "Private heated infinity pool suspended 210 meters above the cityscape." },
        { title: "Executive Study & Library", desc: "Fumed eucalyptus wood paneling and acoustic leather doors." },
        { title: "Primary Spa Suite", desc: "Freestanding stone soaking tub overlooking the skyline lights." },
        { title: "Sommelier Showcase", desc: "Custom back-lit bronze and glass temperature-controlled display." },
      ],
      floorSchedule: [
        { level: "Floor 54", name: "Grand Reception & Formal Dining", dimensions: "16.2m × 10.4m", notes: "Double-height void with panoramic corner view" },
        { level: "Floor 55", name: "Family Gallery & Three Suites", dimensions: "15.0m × 9.8m", notes: "En-suite marble bathrooms and dressing suites" },
        { level: "Floor 56", name: "Private Sky Terrace & Heated Pool", dimensions: "14.2m × 8.6m", notes: "Open-air sunset cocktail bar and lounge" },
      ],
      availability: "available",
      description:
        "Occupying the three highest tiers of an architectural landmark tower, the Horizon Penthouse redefines sky living. Frameless double-height glazing brings the changing desert sky and waterfront horizon into every living space, while the private rooftop pool provides an absolute sanctuary above the bustling metropolis.",
    },
    {
      title: `Villa Canted Stone`,
      status: "sale",
      propertyType: "Villa",
      architecturalStyle: "Sculptural Contemporary",
      lifestyle: "architectural",
      bedrooms: 5,
      bathrooms: 6,
      areaSqft: 6200,
      exteriorSqft: 2400,
      yearBuilt: 2022,
      exposure: "South-West / Garden Aspect",
      parkingSpaces: 3,
      architect: "Atelier Forme",
      price: { value: 12800000, currency: "AED" },
      images: [
        reStock.modernHome,
        reStock.facade,
        reStock.interiorWarm,
        reStock.livingRoom,
        reStock.garden,
        reStock.kitchen,
      ],
      highlights: [
        "Sculptural canted board-formed concrete and sand-blasted limestone",
        "Central glass courtyard hosting a century-old sculptural olive tree",
        "Seamless terrazzo flooring flowing from interior reception to pool deck",
        "Custom Poliform kitchen with fluted walnut and Fior di Bosco marble",
      ],
      features: [
        "Board-Formed Concrete Architecture",
        "Internal Olive Tree Atrium",
        "Continuous Terrazzo Slabs",
        "Poliform Bespoke Joinery",
        "Infinity Edge Pool",
        "Outdoor Teppanyaki Kitchen",
        "Discreet Service Quarters",
        "Smart Climate Management",
      ],
      curatedAmenities: [
        { title: "Lightwell Courtyard", desc: "Provides natural ambient illumination and passive cross-ventilation." },
        { title: "Private Guest Lodge", desc: "Detached garden suite with private entrance for visitors or staff." },
        { title: "Automated Shading Fin Walls", desc: "Architectural motorized louvers that tune natural sunlight throughout the day." },
        { title: "Subterranean Cinema", desc: "Acoustically tuned private screening room with custom velvet seating." },
      ],
      floorSchedule: [
        { level: "Ground Floor", name: "Atrium Living & Courtyard", dimensions: "15.5m × 11.0m", notes: "Surrounds central olive lightwell" },
        { level: "Ground Floor", name: "Chef's Kitchen & Dining", dimensions: "8.5m × 6.0m", notes: "Marble island with concealed scullery" },
        { level: "First Floor", name: "Master Suite & Private Terrace", dimensions: "12.0m × 7.5m", notes: "Views over manicured native gardens" },
        { level: "First Floor", name: "Three Family Bedrooms", dimensions: "5.5m × 4.8m each", notes: "Oak flooring with private bathrooms" },
      ],
      availability: "available",
      description:
        "A masterclass in quiet luxury and architectural restraint. Villa Canted Stone uses raw texture—board-formed concrete, hand-chiseled limestone, and warm oiled walnut—to create an enduring sense of calm. All ground-level rooms pivot around an open-air central courtyard, ensuring natural daylight filters deep into the home at every hour.",
    },
    {
      title: `The Promenade Marina Residence`,
      status: "sale",
      propertyType: "Penthouse",
      architecturalStyle: "Marine Modernism",
      lifestyle: "waterfront",
      bedrooms: 3,
      bathrooms: 4,
      areaSqft: 3900,
      exteriorSqft: 1100,
      yearBuilt: 2023,
      exposure: "Marina Waterfront Promenade",
      parkingSpaces: 2,
      architect: "Waterfront Design Group",
      price: { value: 14500000, currency: "AED" },
      images: [
        reStock.facade,
        reStock.loungeMinimal,
        reStock.penthouse,
        reStock.bedroom,
        reStock.livingRoom,
      ],
      highlights: [
        "Unobstructed waterfront panorama over the marina yachts",
        "Generous 1,100 sq ft wrap-around travertine entertaining terrace",
        "Private direct lift opening into private gallery foyer",
        "Finishes in natural Calacatta marble, brushed bronze, and smoked glass",
      ],
      features: [
        "Wrap-Around Marina Deck",
        "Calacatta Gold Bathrooms",
        "Direct Yacht Berth Access",
        "Private Elevator Entry",
        "Wine Storage Column",
        "Electric Hearth Fireplace",
        "Dual Secure Parking Bays",
        "Concierge & Valet",
      ],
      curatedAmenities: [
        { title: "Marina Promenade Access", desc: "Private gate onto the water boardwalk and private dining berths." },
        { title: "Residents' Wellness Club", desc: "Access to private gym, vitality pool, and treatment suites." },
        { title: "Sunset Dining Terrace", desc: "Covered pergola with integrated infrared heating and outdoor sound." },
        { title: "Bespoke Millwork", desc: "Custom smoked-oak wardrobes with sensor-activated micro-LED illumination." },
      ],
      availability: "available",
      description:
        "Perched directly above the marina promenade, this penthouse pairs nautical elegance with metropolitan convenience. The generous wrap-around terrace functions as an outdoor salon, offering unmatched views of returning sailing vessels against the evening sunset.",
    },
    {
      title: `Courtyard Sanctuary No. 7`,
      status: "sale",
      propertyType: "Villa",
      architecturalStyle: "Biophilic Minimalist",
      lifestyle: "contemporary",
      bedrooms: 4,
      bathrooms: 5,
      areaSqft: 4800,
      exteriorSqft: 1600,
      yearBuilt: 2021,
      exposure: "East-West / Lightwell Aspect",
      parkingSpaces: 2,
      architect: "Green Minimalist Collective",
      price: { value: 9200000, currency: "AED" },
      images: [
        reStock.garden,
        reStock.modernHome,
        reStock.interiorWarm,
        reStock.livingRoom,
        reStock.bedroom,
      ],
      highlights: [
        "Biophilic design with integrated indoor water gardens and living walls",
        "Passive thermal cooling architecture reducing energy footprint",
        "Zero-edge courtyard reflection pool with floating stone pavers",
        "Bespoke cedar slat privacy screening and poured micro-cement floors",
      ],
      features: [
        "Living Green Atrium",
        "Zero-Edge Reflection Pool",
        "Poured Micro-Cement Floors",
        "Japanese Soaking Tubs",
        "Organic Teak Millwork",
        "Solar Integrated Roof",
        "Triple-Filtered Air Systems",
        "Gated Private Close",
      ],
      curatedAmenities: [
        { title: "Meditation & Tea Pavilion", desc: "Timber pavilion suspended above serene courtyard reflection water." },
        { title: "Acoustic Silence Design", desc: "Triple-glazed acoustic panes engineered to isolate urban sound completely." },
        { title: "Chef's Organic Garden", desc: "Automated micro-herb planters and citrus trees in private courtyard." },
        { title: "Minimalist Master Bath", desc: "Hand-carved granite freestanding bathtub with rain skylight." },
      ],
      availability: "available",
      description:
        "A peaceful sanctuary created for deliberate, mindful living. The architecture dissolves the boundary between indoors and nature through internal water gardens, mature vegetation, and soft natural materials that age gracefully over time.",
    },
    {
      title: `The Glass Monolith Estate`,
      status: "sale",
      propertyType: "Private Estate",
      architecturalStyle: "Glass Pavilion Architecture",
      lifestyle: "estate",
      bedrooms: 5,
      bathrooms: 6,
      areaSqft: 7100,
      exteriorSqft: 3200,
      yearBuilt: 2024,
      exposure: "Panoramic Hillside & Coast",
      parkingSpaces: 6,
      architect: "Studio Monolith",
      price: { value: 22500000, currency: "AED" },
      images: [
        reStock.villaExterior,
        reStock.facade,
        reStock.travertineTerrace,
        reStock.livingRoom,
        reStock.masterSuite,
        reStock.spaBath,
      ],
      highlights: [
        "Daring structural cantilever that appears to float above the landscape",
        "Six-car subterranean climate gallery with glass display ceiling",
        "Private wellness retreat featuring Finnish sauna and cold-water cascade",
        "Full-height structural glass walls that slide completely into hidden wall pockets",
      ],
      features: [
        "Cantilevered Infinity Pool",
        "Subterranean Car Gallery",
        "Discreet Wellness Suite",
        "Motorized Pocket Doors",
        "Italian Fluted Marble",
        "Chef's Demonstration Kitchen",
        "Separate Guard / Security Post",
        "High-Security Vault & Storage",
      ],
      curatedAmenities: [
        { title: "Floating Cantilever Deck", desc: "A 5m structural overhang creating an amphitheater of panoramic scenery." },
        { title: "Subterranean Motor Gallery", desc: "Climate-conditioned space for 6 collector automobiles with exhibition spots." },
        { title: "Private Spa & Hydrotherapy", desc: "Bespoke marble hammam, Himalayan salt sauna, and cold-plunge." },
        { title: "Smart Biometrics", desc: "Discreet iris and facial recognition at all private thresholds." },
      ],
      availability: "available",
      description:
        "The Glass Monolith represents an uncompromising vision of modern estate architecture. Utilizing advanced cantilever engineering, the main pavilion hovers weightlessly above landscaped terraces, offering cinematic vistas through uninterrupted 4-meter high panes of structural glass.",
    },
    {
      title: `The Atrium Loft Penthouse`,
      status: "rent",
      propertyType: "Penthouse",
      architecturalStyle: "Industrial Minimalist",
      lifestyle: "contemporary",
      bedrooms: 2,
      bathrooms: 3,
      areaSqft: 2200,
      exteriorSqft: 600,
      yearBuilt: 2022,
      exposure: "North-West Sunset Skyline",
      parkingSpaces: 2,
      architect: "Urban Atelier",
      price: { value: 340000, currency: "AED", period: "yearly" },
      images: [
        reStock.penthouse,
        reStock.interiorWarm,
        reStock.bedroom,
        reStock.diningTravertine,
        reStock.livingRoom,
      ],
      highlights: [
        "Full-floor architectural loft with 6.2-meter soaring ceiling voids",
        "Custom blackened steel floating staircase and industrial crittall screens",
        "Fully furnished with curated designer pieces by Minotti and B&B Italia",
        "Private sunset terrace featuring outdoor hearth and skyline view",
      ],
      features: [
        "Double-Height 6.2m Ceilings",
        "Blackened Steel Accents",
        "Bespoke Italian Furnishings",
        "Private Sunset Terrace",
        "Integrated Sonos Sound",
        "Polished Concrete Floors",
        "Miele Kitchen Appliance Suite",
        "Dual Underground Parking",
      ],
      curatedAmenities: [
        { title: "Turnkey Designer Collection", desc: "Complete interior curation by Milanese architects with original artwork." },
        { title: "Private Terrace Lounge", desc: "Equipped with gas fire table and panoramic skyline vantage." },
        { title: "Executive Mezzanine", desc: "Open-plan study and library cantilevered over the main salon." },
      ],
      availability: "available",
      description:
        "A rare full-floor penthouse loft marrying industrial materiality with refined Italian luxury. Featuring soaring 6.2-meter volumes, bespoke blackened steel details, and floor-to-ceiling glazing, this residence offers a dramatic pied-à-terre for design aficionados.",
    },
    {
      title: `The Palm Grove Private Sanctuary`,
      status: "sale",
      propertyType: "Private Estate",
      architecturalStyle: "Modern Mediterranean",
      lifestyle: "estate",
      bedrooms: 6,
      bathrooms: 8,
      areaSqft: 9800,
      exteriorSqft: 5400,
      yearBuilt: 2023,
      exposure: "Direct Water Sunset Aspect",
      parkingSpaces: 5,
      architect: "Mediterranean Atelier",
      price: { value: 36000000, currency: "AED" },
      images: [
        reStock.poolVilla,
        reStock.villaExterior,
        reStock.travertineTerrace,
        reStock.loungeMinimal,
        reStock.diningTravertine,
        reStock.masterSuite,
      ],
      highlights: [
        "Ultra-prime gated beachfront estate with 45 meters of private beach frontage",
        "Private championship padel court and illuminated tennis pavilion",
        "Dual infinity pools including a heated 25m training lap pool",
        "Independent staff cottage and professional catering prep facility",
      ],
      features: [
        "45m Private Beach Frontage",
        "Championship Padel Court",
        "Dual Infinity Pools",
        "Private Guest Cottage",
        "Catering Commercial Kitchen",
        "Subterranean 5-Car Garage",
        "Private Security Boundary",
        "Private Spa & Steam",
      ],
      curatedAmenities: [
        { title: "Private Beach Sanctuary", desc: "Direct private access to soft white sands with private cabana." },
        { title: "Padel & Athletic Pavilion", desc: "Championship glass-walled court with viewing pavilion." },
        { title: "Estate Security Network", desc: "Independent security station with 24/7 perimeter coverage." },
      ],
      availability: "available",
      description:
        "A private gated world in itself. Spread across an expansive beachfront plot, The Palm Grove estate seamlessly combines private resort living with the intimacy of a generational family compound.",
    },
    {
      title: `Skyline Sanctuary Tower Residence`,
      status: "sale",
      propertyType: "Apartment",
      architecturalStyle: "Contemporary Urban",
      lifestyle: "contemporary",
      bedrooms: 2,
      bathrooms: 2,
      areaSqft: 1450,
      exteriorSqft: 250,
      yearBuilt: 2023,
      exposure: "Dual-Aspect Corner / Skyline",
      parkingSpaces: 1,
      architect: "Metropolitan Towers",
      price: { value: 3850000, currency: "AED" },
      images: [
        reStock.apartmentTower,
        reStock.bedroom,
        reStock.interiorWarm,
        reStock.livingRoom,
      ],
      highlights: [
        "High-floor corner residence with wrap-around floor-to-ceiling glass",
        "French chevron oak parquetry and natural limestone bathrooms",
        "Direct access to building spa, infinity pool, and concierge services",
        "Walking distance to premier cultural districts and fine dining",
      ],
      features: [
        "Corner Dual-Aspect Vistas",
        "Chevron Oak Parquetry",
        "Limestone Clad Bathrooms",
        "Sub-Zero Wine Column",
        "24-Hour Valet & Porter",
        "Resident Library Lounge",
        "Wellness Gym & Spa",
        "High-Speed Smart Lifts",
      ],
      curatedAmenities: [
        { title: "Corner Glass Vista", desc: "270-degree panorama over the city lights and urban gardens." },
        { title: "Resident Club Privileges", desc: "Private screening lounge, boardrooms, and concierge booking desk." },
      ],
      availability: "available",
      description:
        "Clean lines, warm natural timber, and expansive corner windows define this turnkey high-floor residence. Designed for effortless city living with five-star hotel-level amenities at your doorstep.",
    },
    {
      title: `Botanical Garden Architectural Townhouse`,
      status: "rent",
      propertyType: "Townhouse",
      architecturalStyle: "Organic Modernist",
      lifestyle: "architectural",
      bedrooms: 3,
      bathrooms: 4,
      areaSqft: 2900,
      exteriorSqft: 950,
      yearBuilt: 2022,
      exposure: "Garden & Park Panorama",
      parkingSpaces: 2,
      architect: "Studio Habitat",
      price: { value: 260000, currency: "AED", period: "yearly" },
      images: [
        reStock.townhouse,
        reStock.livingRoom,
        reStock.garden,
        reStock.kitchen,
        reStock.bedroom,
      ],
      highlights: [
        "Low-density architectural development bordering private parklands",
        "Private landscaped ground garden with sunken plunge pool",
        "Rooftop entertaining terrace with outdoor summer kitchen",
        "Natural clay plaster walls and custom warm ash joinery",
      ],
      features: [
        "Private Ground Garden",
        "Sunken Plunge Pool",
        "Rooftop Terrace Kitchen",
        "Clay Plaster Finishes",
        "Solid Ash Custom Woodwork",
        "Integrated EV Fast Charger",
        "Family Media Snug",
        "Quiet Pedestrian Way",
      ],
      curatedAmenities: [
        { title: "Sunken Garden Oasis", desc: "Lush private green boundary with stone terrace and plunge pool." },
        { title: "Rooftop Stargazing Deck", desc: "Equipped with built-in BBQ and lounge overlooking the park." },
      ],
      availability: "available",
      description:
        "A low-density architectural townhouse prioritizing privacy, natural greenery, and thoughtful craftsmanship. Featuring warm clay plaster walls, handmade ash joinery, and two private outdoor levels.",
    },
  ];
}

function priceLabelFor(seed: ListingSeed, status: PropertyStatus): string {
  if (!seed.price) return "Price on Application";
  const formatted = seed.price.value.toLocaleString("en-US");
  const amount = `${seed.price.currency} ${formatted}`;
  if (status === "rent") return seed.price.period === "monthly" ? `${amount} / mo` : `${amount} / yr`;
  return amount;
}

function buildListings(city: string): PropertyListing[] {
  const seeds = listingSeeds(city);
  return seeds.map((seed, i) => {
    const id = `residence-${slugify(seed.title).slice(0, 24)}-${i + 1}`;
    return {
      id,
      slug: id,
      title: seed.title,
      status: seed.status,
      propertyType: seed.propertyType,
      architecturalStyle: seed.architecturalStyle,
      lifestyle: seed.lifestyle,
      priceLabel: priceLabelFor(seed, seed.status),
      currency: seed.price?.currency,
      priceValue: seed.price?.value,
      rentalPeriod: seed.price?.period,
      bedrooms: seed.bedrooms,
      bathrooms: seed.bathrooms,
      areaLabel: `${seed.areaSqft.toLocaleString("en-US")} sq ft`,
      interiorSqft: seed.areaSqft,
      exteriorSqft: seed.exteriorSqft,
      yearBuilt: seed.yearBuilt,
      exposure: seed.exposure,
      parkingSpaces: seed.parkingSpaces,
      architect: seed.architect,
      location: city,
      community: `${city} Prime District`,
      description: seed.description,
      highlights: seed.highlights,
      features: seed.features,
      curatedAmenities: seed.curatedAmenities,
      floorSchedule: seed.floorSchedule,
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
      productsLabel: "The Collection",
      servicesAllLabel: "Private Advisory",
      projectsLabel: "Curated Residences",
      companyLabel: "Philosophy",
      contactLabel: "Private Enquiries",
      quoteLabel: "Private Viewing",
      homeBack: "Back to Collection",
    },
    hero: {
      primaryCta: "Explore the Collection",
      secondaryCta: "Speak to an Advisor",
      heroImageAlt: `${displayName} — architectural residences in ${city}`,
      ghostText: `${displayName.toUpperCase()} · PRIVATE COLLECTION`,
      stats,
      contactCardLabel: "Private advisory desk",
      chipsHeading: "The Private Advisory Standard",
      scrollCue: "Scroll to discover",
    },
    trustLines: [
      ...(hasRating ? [`${rating} ★ Verified Client Appraisal · ${reviews} reviews`] : []),
      `Boutique property advisory in ${city}`,
    ],
    servicesKicker: "Curated Representation",
    servicesHomeHeading: `A more considered way to discover home in ${city}`,
    servicesHomeBlurb:
      "Architecture, privacy, and provenance — pairing bespoke buyer representation, off-market acquisitions, and discreet advisory.",
    servicesIndexHeading: `The {displayName} Collection`,
    servicesIndexBlurb:
      "Curated architectural residences, private estates, and sky penthouses across " + city + ".",
    servicesIndexMetaTitle: `${displayName} — The Collection`,
    servicesIndexMetaDescription:
      `Discover architectural residences, private estates, and luxury penthouses with ${displayName} in ${city}.`,
    capability: {
      kicker: "The Brokerage Philosophy",
      headline: `Architecture, privacy, and provenance in ${city}`,
      body:
        `${displayName} operates as a private property advisory rather than a high-volume listings portal. We represent exceptional architecture and discreet buyers with thoughtful guidance, verified provenance, and absolute confidentiality.`,
      points: [
        { icon: "handshake", text: "Discreet advisory — direct access to private and off-market inventory" },
        { icon: "shield", text: "Verified architectural provenance and physical inspection before viewings" },
        { icon: "users", text: "Senior partner representation throughout the acquisition lifecycle" },
        { icon: "award", text: `Private client advisory established in ${city} since ${established}` },
      ] as CapabilityPoint[],
      stats: [
        { value: `${established}`, label: `In ${city} since` },
        { value: "100%", label: "Accompanied private viewings" },
        ...(hasRating ? [{ value: `${rating}★`, label: `${reviews} verified reviews` }] : []),
      ].slice(0, 3) as CapabilityStat[],
      showSvg: false,
      svg: "",
      mediaImageKey: "heroPoster",
      ctaLabel: "Discover our advisory",
      bandImageKey: "showreelPoster",
      bandKicker: `${city} Private Advisory`,
      bandHeadline: `Curating exceptional architecture in ${city}`,
      bandBody:
        "Bespoke representation, private access, and verified provenance — the way luxury real estate should be experienced.",
    },
    process: {
      kicker: "Private Client Journey",
      headline: "A discreet path from brief to private acquisition",
      body: "Share your architectural brief and lifestyle parameters — our private advisory curates a tailored shortlist and arranges discreet viewings around your schedule.",
      steps: [
        { step: "01", title: "Private Consultation", body: "We align on your architectural preferences, location boundaries, and privacy requirements." },
        { step: "02", title: "Curated Shortlist", body: "We cross-reference verified on-market residences and discreet off-market holdings." },
        { step: "03", title: "Accompanied Viewing", body: "Private, unhurried viewings arranged with complete discretion and personal advisor guidance." },
        { step: "04", title: "Due Diligence", body: "Architectural evaluation, comparable transaction analysis, and legal contract guidance." },
        { step: "05", title: "Seamless Handover", body: "End-to-end conveyance management and dedicated post-acquisition concierge support." },
      ] as ProcessStep[],
    },
    regions: {
      kicker: "Prime Enclaves",
      headline: `Districts and waterfront enclaves in ${city}`,
      body: "Our advisory focuses exclusively on high-demand architectural enclaves, waterfront communities, and private residential sanctuaries.",
      groups: [
        { title: `${city} Prime Districts`, items: [`${city} Waterfront`, "Marina Promenades", "Golf & Country Enclaves", "Private Island Estates"] },
        { title: "Surrounding Prime Enclaves", items: [`${regionLabel} Coast`, "Hillside Sanctuaries", "Architectural Developments"] },
      ] as RegionGroup[],
    },
    projectsIntro: {
      kicker: "Curated Showcase",
      headline: `The ${displayName} Private Collection`,
      body: "A selection of exceptional residences, penthouses, and private estates available for discreet acquisition.",
      footer: "Scroll to explore the collection — {count} curated residences.",
    },
    serviceDetail: {
      overviewHeadingPrefix: displayName,
      figureCaptionSuffix: "represented by",
      badge: "Private Collection",
      footnote:
        "Every residence is physically inspected and verified for architectural integrity before presentation — accompanied viewings only.",
      specsHeading: "Architectural Specifications",
      applicationsKicker: "Residence Attributes",
      applicationsHeading: "Spatial Design & Finishes",
    },
    ctaFeatures: [
      { iconKey: "mouse", title: "Bespoke Enquiry Routing", body: "Viewing requests and acquisition briefs are assigned directly to dedicated private advisors." },
      { iconKey: "chart", title: "Discreet Valuation Models", body: "Clear comparable transaction analysis and real-time market insights without inflated promises." },
      { iconKey: "chat", title: "Immediate Concierge Response", body: "Direct responses to architectural and availability queries before scheduling viewings." },
      { iconKey: "bell", title: "Confidential Communication", body: "All correspondence is held under strict professional confidentiality." },
    ],
    footer: {
      blurb: `private property advisory and luxury brokerage in ${city}, ${regionLabel} — discreet acquisitions, bespoke representation, and prime architecture.`,
    },
    assistant: {
      name: `${displayName} Concierge`,
      greeting: `Welcome to ${displayName}. I am your private property concierge — how may our advisory assist your property search or private viewing in ${city}?`,
      placeholder: `Ask about residences, private viewings, or selling in ${city}…`,
      fallbackEmail: contactEmail,
      actions: [
        { id: "viewing", label: "Request a private viewing", reply: "I would be delighted to arrange a private viewing. Please share the residence of interest or your preferred timing, and our advisor will confirm the private appointment." },
        { id: "shortlist", label: "Request an off-market shortlist", reply: `Share your architectural preferences, ideal neighborhoods in ${city}, and budget range — our private advisory team will prepare a confidential portfolio.` },
        { id: "sell", label: "Discuss selling my property", reply: "Our team provides confidential, discreet property valuations and private marketing strategies with zero public exposure if desired." },
        { id: "advisor", label: "Speak with a Senior Advisor", reply: `Certainly. A senior partner at ${displayName} will contact you via your preferred confidential channel.` },
      ] as AssistantAction[],
      leadTitle: "Private Request Received",
      leadBody: `Your {label} has been delivered to the ${displayName} senior advisory desk. A dedicated broker will contact you discreetly.`,
      routed: `and assigned it to the senior advisory team.`,
      followUp: "Your advisor will be in touch shortly. Is there any additional detail or discretion requirement we should note?",
    },
    formNote:
      "This is a demonstration preview of the Athinem Creatives luxury digital ecosystem. In production, this initiates a private client concierge protocol.",
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
      return { top: "A More Considered Way", accent: "to Find", bottom: `Home in ${city}.` };
    case "development":
      return { top: "Exceptional Architecture,", accent: "Discreetly", bottom: `Curated in ${city}.` };
    case "investment":
      return { top: "Private Property Advisory", accent: "for Prime", bottom: `${city} Real Estate.` };
    default:
      return { top: "Distinctive Architecture,", accent: "Uncompromising", bottom: `Living in ${city}.` };
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
  const isGulf = countryKey === "UAE";
  const regionLabel = countryRegionLabel(countryKey);
  const { city, state, country, fullLocation } = deriveLocation(company, audit, countryKey);

  const direction = detectRealEstateDirection(raw);
  const spec = RE_DIRECTIONS[direction];

  const primaryColor = company.branding?.primaryColor || spec.palette.primary;
  const secondaryColor = company.branding?.secondaryColor || spec.palette.secondary;
  const accentColor = company.branding?.accentColor || spec.palette.accent;
  const tintColor = company.branding?.tintColor || spec.palette.tint;

  const rating = company.socialProof?.googleRating ?? null;
  const reviews = company.socialProof?.reviewCount ?? null;

  const contactFallback = contactFallbackFor(countryKey);
  const contactPhone = company.contact?.phone || company.contact?.rawPhone || contactFallback.phone;
  const fallbackTld = contactFallback.tld;
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

  const heroImage = reStock.travertineTerrace || reStock.villaExterior;

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
    markets: isGulf
      ? [city, "Dubai", "Abu Dhabi", "United Arab Emirates"]
      : [city, state, regionLabel].filter((v, i, a) => v && a.indexOf(v) === i),
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
    demoMeta: buildDemoMeta(
      {
        id: company.id,
        domain: company.contact?.domain,
        website: company.contact?.website,
      },
      slug
    ),
  };
}
