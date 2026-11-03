import type { ProspectConfig, PropertyListing } from "./types";

/**
 * Deterministic, clearly-fictional demo dataset for the Real Estate command
 * centre modules. Everything here is derived from the prospect's own listing
 * inventory plus a seeded pseudo-random generator so:
 *  - the same prospect always renders the same coherent dataset across modules
 *  - dashboard metrics always match the underlying records
 *  - nothing here is presented as a real client, transaction or valuation
 *
 * `demo: true` is carried on every generated record.
 */

export type RegionKey = "UAE" | "AU" | "CA" | "US";

export type DemoAgent = {
  id: string;
  demo: true;
  name: string;
  title: string;
  email: string;
  phone: string;
  initials: string;
  focus: string;
  joined: string;
  languages: string[];
};

export type LeadStage =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Viewing Scheduled"
  | "Negotiation"
  | "Offer Submitted"
  | "Won"
  | "Lost";

export type DemoLead = {
  id: string;
  demo: true;
  name: string;
  email: string;
  phone: string;
  country: string;
  source: string;
  interestType: "Buyer" | "Seller" | "Investor" | "Rental" | "Commercial";
  budgetLabel: string;
  budgetValue: number;
  preferredLocation: string;
  requirements: string;
  agentId: string;
  priority: "High" | "Medium" | "Low";
  stage: LeadStage;
  createdAt: string;
  lastInteraction: string;
  nextFollowUp: string;
  notes: string;
  propertyId?: string;
  tags: string[];
};

export type DealStage =
  | "New Opportunity"
  | "Qualification"
  | "Viewing"
  | "Negotiation"
  | "Offer"
  | "Reservation"
  | "Agreement"
  | "Closed Won"
  | "Closed Lost";

export type DemoDeal = {
  id: string;
  demo: true;
  leadId: string;
  propertyId: string;
  agentId: string;
  stage: DealStage;
  value: number;
  probability: number;
  expectedClose: string;
  nextAction: string;
  createdAt: string;
  notes: string;
};

export type DemoViewing = {
  id: string;
  demo: true;
  propertyId: string;
  leadId: string;
  agentId: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  time: string;
  durationMinutes: number;
  status: "Scheduled" | "Completed" | "Cancelled";
  notes: string;
};

export type DemoOwner = {
  id: string;
  demo: true;
  name: string;
  email: string;
  phone: string;
  type: "Private Owner" | "Investor" | "Developer" | "Family Trust";
  propertyIds: string[];
  agreement: "Exclusive" | "Open" | "Off-market";
  since: string;
  notes: string;
};

export type DemoDocumentCategory =
  | "Listing Agreement"
  | "Sale Agreement"
  | "Rental Agreement"
  | "Offer"
  | "Ownership Record"
  | "Identity Document"
  | "Floor Plan"
  | "Brochure"
  | "Internal";

export type DemoDocument = {
  id: string;
  demo: true;
  name: string;
  category: DemoDocumentCategory;
  entityType: "Property" | "Lead" | "Deal" | "Owner";
  entityId: string;
  entityLabel: string;
  version: string;
  sizeLabel: string;
  updatedAt: string;
  status: "Draft" | "In review" | "Signed" | "Archived";
};

export type DemoTask = {
  id: string;
  demo: true;
  title: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  relatedType: "Lead" | "Deal" | "Property" | "Viewing";
  relatedId: string;
  relatedLabel: string;
  agentId: string;
  done: boolean;
};

export type DemoActivity = {
  id: string;
  demo: true;
  type: "enquiry" | "viewing" | "offer" | "document" | "status" | "note";
  title: string;
  detail: string;
  createdAt: string;
  agentId: string;
};

export type MarketArea = {
  area: string;
  listings: number;
  avgPrice: number;
  demand: number;
  avgDaysOnMarket: number;
  type: string;
};

export type RealEstateDemoData = {
  region: RegionKey;
  currency: string;
  locale: string;
  dateFormat: string;
  agents: DemoAgent[];
  leads: DemoLead[];
  deals: DemoDeal[];
  viewings: DemoViewing[];
  owners: DemoOwner[];
  documents: DemoDocument[];
  tasks: DemoTask[];
  activities: DemoActivity[];
  marketAreas: MarketArea[];
  metrics: {
    totalProperties: number;
    availableInventory: number;
    underOffer: number;
    soldLet: number;
    newEnquiries: number;
    qualifiedLeads: number;
    activeOpportunities: number;
    pipelineValue: number;
    closedDeals: number;
    upcomingViewings: number;
    avgDaysOnMarket: number;
    totalLeads: number;
  };
  leadSourcePerformance: { source: string; leads: number; won: number }[];
  inventoryDistribution: { type: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
};

/* ------------------------------------------------------------------ */
/* Deterministic RNG                                                   */
/* ------------------------------------------------------------------ */

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = () => number;
const pick = <T,>(rng: Rng, arr: T[]): T => arr[Math.floor(rng() * arr.length) % arr.length];
const between = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

/* ------------------------------------------------------------------ */
/* Region & formatting                                                 */
/* ------------------------------------------------------------------ */

export function detectRegion(prospect: ProspectConfig): RegionKey {
  const hay = `${prospect.location} ${(prospect.markets ?? []).join(" ")}`.toLowerCase();
  if (/australia|sydney|melbourne|brisbane|perth|queensland|new south wales|victoria/.test(hay))
    return "AU";
  if (/canada|toronto|vancouver|calgary|montreal|ontario|british columbia|alberta|quebec/.test(hay))
    return "CA";
  if (/united arab emirates|dubai|abu dhabi|sharjah|uae|ajman|ras al khaimah|fujairah/.test(hay))
    return "UAE";
  return "UAE";
}

export const REGION_CONFIG: Record<
  RegionKey,
  { currency: string; locale: string; dateFormat: string; unit: string; dial: string }
> = {
  UAE: { currency: "AED", locale: "en-AE", dateFormat: "dd MMM yyyy", unit: "sq ft", dial: "+971" },
  AU: { currency: "AUD", locale: "en-AU", dateFormat: "dd MMM yyyy", unit: "m²", dial: "+61" },
  CA: { currency: "CAD", locale: "en-CA", dateFormat: "MMM d, yyyy", unit: "sq ft", dial: "+1" },
  US: { currency: "USD", locale: "en-US", dateFormat: "MMM d, yyyy", unit: "sq ft", dial: "+1" },
};

export function formatCurrency(value: number, region: RegionKey): string {
  const { currency, locale } = REGION_CONFIG[region];
  const compact = Math.abs(value) >= 1_000_000;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: compact ? 1 : 0,
    notation: "compact",
  }).format(value);
}

export function formatMoneyExact(value: number, region: RegionKey): string {
  const { currency, locale } = REGION_CONFIG[region];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

/* ------------------------------------------------------------------ */
/* Fictional identity pools                                            */
/* ------------------------------------------------------------------ */

const NAMES: Record<RegionKey, string[]> = {
  UAE: [
    "Amira Al Mansoori", "Daniel Whitfield", "Priya Raghavan", "Omar Haddad",
    "Sofia Marchetti", "Khalid Al Suwaidi", "Grace Thompson", "Yusuf Demir",
    "Isabelle Fournier", "Arjun Mehta", "Layla Rahman", "Thomas Bergström",
  ],
  AU: [
    "Harriet Campbell", "Liam O'Connor", "Priya Raman", "Noah Fitzgerald",
    "Charlotte Nguyen", "Ethan Brooks", "Amelia Watts", "Oliver Reid",
    "Zara Haddad", "Jack Sullivan", "Mia Kowalski", "Samuel Patel",
  ],
  CA: [
    "Olivia Tremblay", "Lucas Martin", "Emma Gagnon", "Jacob Wong",
    "Sophie Bouchard", "Noah Singh", "Ava Leblanc", "William Chen",
    "Chloe Dubois", "Benjamin Roy", "Isla Macdonald", "Nathan Park",
  ],
  US: [
    "Ava Sinclair", "Marcus Chen", "Helena Ross", "James Whitaker",
    "Nadia Karim", "Ethan Caldwell", "Priya Shah", "Lucas Moreau",
  ],
};

const AGENT_NAMES: Record<RegionKey, string[]> = {
  UAE: ["Reem Al Zahra", "James Calloway", "Fatima Noor", "Alexander Reed", "Sana Qureshi"],
  AU: ["Georgia Hayes", "Marcus Ellery", "Nadia Bishop", "Daniel Cho", "Ella Fitzgerald"],
  CA: ["Sophie Lavoie", "Michael Grant", "Aisha Rahman", "Thomas Bell", "Claire Dubois"],
  US: ["Jordan Ellis", "Priya Nair", "Cameron Ford", "Riley Brooks", "Maya Chen"],
};

const COUNTRIES: Record<RegionKey, string[]> = {
  UAE: ["United Arab Emirates", "United Kingdom", "India", "Saudi Arabia", "Russia", "France"],
  AU: ["Australia", "New Zealand", "United Kingdom", "Singapore", "China", "United States"],
  CA: ["Canada", "United States", "United Kingdom", "India", "Germany", "Hong Kong"],
  US: ["United States", "Canada", "United Kingdom", "Mexico", "Germany"],
};

const SOURCES = ["Website", "Portal", "Referral", "Social", "Walk-in", "Agent network"];
const TAGS_POOL = ["Cash buyer", "Mortgage pre-approved", "Off-market", "Relocating", "Investor", "First viewing", "Repeat client"];

const DOC_CATEGORIES: DemoDocumentCategory[] = [
  "Listing Agreement", "Sale Agreement", "Rental Agreement", "Offer",
  "Ownership Record", "Identity Document", "Floor Plan", "Brochure", "Internal",
];

const AREA_SUFFIX = ["Coast", "Marina", "Hills", "Gardens", "Central", "Waterfront", "Park", "Harbour"];

/* ------------------------------------------------------------------ */
/* Date helpers (deterministic relative to a fixed "today")            */
/* ------------------------------------------------------------------ */

function isoDate(daysFromNow: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function monthDay(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */

export function buildRealEstateDemo(prospect: ProspectConfig): RealEstateDemoData {
  const region = detectRegion(prospect);
  const listings: PropertyListing[] = prospect.listings ?? [];
  const cfg = REGION_CONFIG[region];
  const rng = mulberry32(hashSeed(prospect.slug || prospect.displayName));

  const names = NAMES[region];
  const countries = COUNTRIES[region];

  const city = (prospect.serviceAreas?.[0] || prospect.location.split(",")[0] || "the city").trim();

  /* Agents */
  const agentNames = AGENT_NAMES[region];
  const focusPool = ["Prime residential", "Waterfront & marina", "New developments", "Investment advisory", "Commercial"];
  const agents: DemoAgent[] = agentNames.map((name, i) => ({
    id: `agent-${i + 1}`,
    demo: true,
    name,
    title: ["Senior Partner", "Sales Director", "Property Consultant", "Associate Director", "Leasing Specialist"][i % 5],
    email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@${prospect.slug}.demo`,
    phone: `${cfg.dial} ${between(rng, 10, 99)} ${between(rng, 100, 999)} ${between(rng, 1000, 9999)}`,
    initials: name.split(" ").map((n) => n[0]).slice(0, 2).join(""),
    focus: focusPool[i % focusPool.length],
    joined: String(2016 + between(rng, 0, 7)),
    languages: region === "UAE"
      ? ["English", "Arabic", ...(i % 2 ? ["French"] : ["Hindi"])]
      : region === "CA"
        ? ["English", "French"]
        : ["English"],
  }));

  const agentId = (i: number) => agents[i % agents.length].id;

  /* Areas */
  const areaNames = Array.from(
    new Set(
      listings
        .map((l) => l.community || l.location)
        .filter((v): v is string => Boolean(v))
    )
  );
  while (areaNames.length < 4) {
    areaNames.push(`${city} ${AREA_SUFFIX[areaNames.length % AREA_SUFFIX.length]}`);
  }

  /* Owners */
  const ownerTypes: DemoOwner["type"][] = ["Private Owner", "Investor", "Developer", "Family Trust"];
  const owners: DemoOwner[] = Array.from({ length: Math.min(5, Math.max(3, Math.ceil(listings.length / 2))) }).map(
    (_, i) => {
      const name = names[(i + 2) % names.length];
      const ownedIds = listings.filter((_, li) => li % 5 === i % 5).map((l) => l.id);
      return {
        id: `owner-${i + 1}`,
        demo: true,
        name,
        email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@owner.demo`,
        phone: `${cfg.dial} ${between(rng, 10, 99)} ${between(rng, 100, 999)} ${between(rng, 1000, 9999)}`,
        type: ownerTypes[i % ownerTypes.length],
        propertyIds: ownedIds.length ? ownedIds : [listings[0]?.id].filter(Boolean),
        agreement: (["Exclusive", "Open", "Off-market"] as const)[i % 3],
        since: String(2018 + between(rng, 0, 6)),
        notes: "Fictional demo owner profile — not a real client record.",
      };
    }
  );

  /* Leads */
  const interestTypes: DemoLead["interestType"][] = ["Buyer", "Investor", "Rental", "Seller", "Commercial", "Buyer", "Buyer"];
  const leadStages: LeadStage[] = [
    "New", "Contacted", "Qualified", "Viewing Scheduled", "Negotiation",
    "Offer Submitted", "Won", "Lost", "Qualified", "Contacted",
  ];
  const priorities: DemoLead["priority"][] = ["High", "Medium", "High", "Low", "Medium"];

  const leads: DemoLead[] = Array.from({ length: 12 }).map((_, i) => {
    const name = names[i % names.length];
    const listing = listings[i % Math.max(1, listings.length)];
    const baseBudget = listing?.priceValue ?? between(rng, 8, 40) * 100_000;
    const interestType = interestTypes[i % interestTypes.length];
    const budgetMultiplier = interestType === "Rental" ? 0.02 : 1 + (rng() - 0.5) * 0.3;
    const budgetValue = Math.round((baseBudget * budgetMultiplier) / 1000) * 1000;
    const stage = leadStages[i % leadStages.length];
    return {
      id: `lead-${i + 1}`,
      demo: true,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.demo`,
      phone: `${cfg.dial} ${between(rng, 10, 99)} ${between(rng, 100, 999)} ${between(rng, 1000, 9999)}`,
      country: pick(rng, countries),
      source: pick(rng, SOURCES),
      interestType,
      budgetLabel: interestType === "Rental"
        ? `${formatCurrency(budgetValue, region)} / yr`
        : formatCurrency(budgetValue, region),
      budgetValue,
      preferredLocation: pick(rng, areaNames),
      requirements:
        interestType === "Seller"
          ? "Considering a confidential sale — requesting a valuation and representation proposal."
          : `${between(rng, 2, 5)} bed ${interestType === "Commercial" ? "commercial space" : "home"}, ${pick(rng, ["waterfront views", "private garden", "high floor", "close to schools", "turnkey finish"])}, ready to move within ${between(rng, 1, 6)} months.`,
      agentId: agentId(i),
      priority: priorities[i % priorities.length],
      stage,
      createdAt: isoDate(-between(rng, 3, 45)),
      lastInteraction: monthDay(-between(rng, 0, 6)),
      nextFollowUp: isoDate(between(rng, 0, 7)),
      notes:
        stage === "Won"
          ? "Fictional demo lead — marked as won to illustrate reporting."
          : stage === "Lost"
            ? "Fictional demo lead — lost to a competing agency (illustrative)."
            : "Fictional demo lead record used to demonstrate the working pipeline.",
      propertyId: interestType === "Seller" ? undefined : listing?.id,
      tags: [pick(rng, TAGS_POOL), pick(rng, TAGS_POOL)].filter((v, idx, arr) => arr.indexOf(v) === idx),
    };
  });

  /* Deals — only leads that progressed beyond contact */
  const dealStages: DealStage[] = [
    "New Opportunity", "Qualification", "Viewing", "Negotiation", "Offer",
    "Reservation", "Agreement", "Closed Won", "Closed Lost",
  ];
  const dealLeads = leads.filter((l) =>
    ["Qualified", "Viewing Scheduled", "Negotiation", "Offer Submitted", "Won", "Lost"].includes(l.stage)
  );

  const deals: DemoDeal[] = dealLeads.map((lead, i) => {
    const stagePool: DealStage[] =
      lead.stage === "Won"
        ? ["Closed Won"]
        : lead.stage === "Lost"
          ? ["Closed Lost"]
          : ["New Opportunity", "Qualification", "Viewing", "Negotiation", "Offer", "Reservation", "Agreement"];
    const stage = stagePool[i % stagePool.length];
    const property = listings.find((l) => l.id === lead.propertyId) ?? listings[i % Math.max(1, listings.length)];
    const probability =
      stage === "Closed Won" ? 100
        : stage === "Closed Lost" ? 0
          : {
              "New Opportunity": 20, Qualification: 35, Viewing: 50, Negotiation: 65,
              Offer: 75, Reservation: 85, Agreement: 95,
            }[stage] ?? 40;
    return {
      id: `deal-${i + 1}`,
      demo: true,
      leadId: lead.id,
      propertyId: property?.id ?? "",
      agentId: lead.agentId,
      stage,
      value: lead.budgetValue,
      probability,
      expectedClose: isoDate(between(rng, 5, 60)),
      nextAction: pick(rng, [
        "Send updated comparables",
        "Confirm viewing slot with owner",
        "Prepare reservation form",
        "Chase signed offer",
        "Schedule negotiation call",
        "Collect proof of funds",
      ]),
      createdAt: isoDate(-between(rng, 2, 30)),
      notes: "Fictional demo opportunity — value and dates are illustrative.",
    };
  });

  /* Viewings */
  const viewingTargets = leads.filter((l) => l.interestType !== "Seller").slice(0, 8);
  const viewings: DemoViewing[] = viewingTargets.map((lead, i) => {
    const property = listings.find((l) => l.id === lead.propertyId) ?? listings[i % Math.max(1, listings.length)];
    const dayOffset = i < 3 ? i : i < 5 ? i - 5 : -(i - 4);
    const status: DemoViewing["status"] = dayOffset < 0 ? "Completed" : "Scheduled";
    return {
      id: `viewing-${i + 1}`,
      demo: true,
      propertyId: property?.id ?? "",
      leadId: lead.id,
      agentId: lead.agentId,
      date: isoDate(dayOffset),
      time: ["10:00", "11:30", "14:00", "15:30", "17:00", "09:00", "12:30", "16:00"][i % 8],
      durationMinutes: 45,
      status,
      notes: status === "Scheduled" ? "Accompanied viewing arranged with the listing agent." : "Completed — follow-up notes pending.",
    };
  });

  /* Documents */
  const documents: DemoDocument[] = [];
  listings.slice(0, 6).forEach((l, i) => {
    const cat = DOC_CATEGORIES[i % DOC_CATEGORIES.length];
    documents.push({
      id: `doc-${i + 1}`,
      demo: true,
      name: `${l.title} — ${cat}`,
      category: cat,
      entityType: "Property",
      entityId: l.id,
      entityLabel: l.title,
      version: `v${1 + (i % 3)}.${i % 4}`,
      sizeLabel: `${between(rng, 120, 4200)} KB`,
      updatedAt: monthDay(-between(rng, 1, 40)),
      status: (["Draft", "In review", "Signed", "Archived"] as const)[i % 4],
    });
  });
  deals.slice(0, 4).forEach((d, i) => {
    documents.push({
      id: `doc-deal-${i + 1}`,
      demo: true,
      name: `Offer pack — ${deals[i].id.replace("deal-", "DEAL-")}`,
      category: "Offer",
      entityType: "Deal",
      entityId: d.id,
      entityLabel: `Deal ${d.id.replace("deal-", "DEAL-")}`,
      version: `v1.${i}`,
      sizeLabel: `${between(rng, 90, 900)} KB`,
      updatedAt: monthDay(-between(rng, 1, 20)),
      status: (["Draft", "In review", "Signed"] as const)[i % 3],
    });
  });

  /* Tasks */
  const tasks: DemoTask[] = Array.from({ length: 8 }).map((_, i) => {
    const lead = leads[i % leads.length];
    const deal = deals[i % Math.max(1, deals.length)];
    const related: DemoTask["relatedType"] = i % 2 === 0 ? "Lead" : "Deal";
    const titlePool = [
      "Follow up on viewing feedback",
      "Send shortlist of matching properties",
      "Prepare reservation paperwork",
      "Confirm owner availability",
      "Call to qualify budget and timeline",
      "Share updated price guidance",
      "Chase proof of funds",
      "Book accompanied second viewing",
    ];
    return {
      id: `task-${i + 1}`,
      demo: true,
      title: titlePool[i % titlePool.length],
      due: isoDate(between(rng, -1, 4)),
      priority: (["High", "Medium", "Low"] as const)[i % 3],
      relatedType: related,
      relatedId: related === "Lead" ? lead.id : deal?.id ?? "",
      relatedLabel: related === "Lead" ? lead.name : deal ? `Deal ${deal.id.replace("deal-", "DEAL-")}` : "—",
      agentId: lead.agentId,
      done: i > 5,
    };
  });

  /* Activity feed */
  const activities: DemoActivity[] = [
    ...viewings.slice(0, 3).map((v, i) => ({
      id: `act-v-${i}`,
      demo: true as const,
      type: "viewing" as const,
      title: "Viewing scheduled",
      detail: `${leads.find((l) => l.id === v.leadId)?.name ?? "Client"} · ${listings.find((l) => l.id === v.propertyId)?.title ?? "Property"}`,
      createdAt: monthDay(-i),
      agentId: v.agentId,
    })),
    ...deals.slice(0, 3).map((d, i) => ({
      id: `act-d-${i}`,
      demo: true as const,
      type: "offer" as const,
      title: `Deal moved to ${d.stage}`,
      detail: `${leads.find((l) => l.id === d.leadId)?.name ?? "Client"} · ${formatCurrency(d.value, region)}`,
      createdAt: monthDay(-(i + 1)),
      agentId: d.agentId,
    })),
    ...documents.slice(0, 2).map((doc, i) => ({
      id: `act-doc-${i}`,
      demo: true as const,
      type: "document" as const,
      title: "Document updated",
      detail: doc.name,
      createdAt: monthDay(-(i + 2)),
      agentId: agentId(i),
    })),
    {
      id: "act-enq-1",
      demo: true as const,
      type: "enquiry" as const,
      title: "New enquiry received",
      detail: `${leads[0]?.name ?? "Client"} · ${leads[0]?.interestType ?? "Buyer"} enquiry`,
      createdAt: monthDay(0),
      agentId: leads[0]?.agentId ?? agents[0].id,
    },
  ].slice(0, 9);

  /* Market areas */
  const marketAreas: MarketArea[] = Array.from(new Set(areaNames))
    .slice(0, 6)
    .map((area) => {
      const areaListings = listings.filter((l) => (l.community || l.location) === area);
      const prices = areaListings.map((l) => l.priceValue).filter((v): v is number => typeof v === "number");
      return {
        area,
        listings: areaListings.length || between(rng, 1, 6),
        avgPrice: prices.length
          ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          : Math.round(between(rng, 15, 120) * 100_000),
        demand: between(rng, 12, 96),
        avgDaysOnMarket: between(rng, 18, 90),
        type: pick(rng, ["Villas", "Apartments", "Mixed", "Penthouses", "Townhouses"]),
      };
    });

  /* Metrics computed from the generated records */
  const totalProperties = listings.length;
  const availableInventory = listings.filter((l) => l.availability === "available").length;
  const underOffer = deals.filter((d) =>
    ["Offer", "Reservation", "Agreement", "Negotiation"].includes(d.stage)
  ).length;
  const soldLet = deals.filter((d) => d.stage === "Closed Won").length;
  const newEnquiries = leads.filter((l) => l.stage === "New").length;
  const qualifiedLeads = leads.filter((l) =>
    ["Qualified", "Viewing Scheduled", "Negotiation", "Offer Submitted"].includes(l.stage)
  ).length;
  const activeOpportunities = deals.filter(
    (d) => !["Closed Won", "Closed Lost"].includes(d.stage)
  ).length;
  const pipelineValue = deals
    .filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0);
  const closedDeals = deals.filter((d) => d.stage === "Closed Won").length;
  const upcomingViewings = viewings.filter((v) => v.status === "Scheduled").length;
  const avgDaysOnMarket = Math.round(
    marketAreas.reduce((sum, a) => sum + a.avgDaysOnMarket, 0) / Math.max(1, marketAreas.length)
  );

  const leadSourcePerformance = SOURCES.map((source) => ({
    source,
    leads: leads.filter((l) => l.source === source).length,
    won: leads.filter((l) => l.source === source && l.stage === "Won").length,
  })).filter((s) => s.leads > 0);

  const inventoryDistribution = Object.entries(
    listings.reduce<Record<string, number>>((acc, l) => {
      const t = l.propertyType || "Other";
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ type, count }));

  const statusDistribution = Object.entries(
    listings.reduce<Record<string, number>>((acc, l) => {
      const s = l.availability || l.status || "unknown";
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count }));

  return {
    region,
    currency: cfg.currency,
    locale: cfg.locale,
    dateFormat: cfg.dateFormat,
    agents,
    leads,
    deals,
    viewings,
    owners,
    documents,
    tasks,
    activities,
    marketAreas,
    metrics: {
      totalProperties,
      availableInventory,
      underOffer,
      soldLet,
      newEnquiries,
      qualifiedLeads,
      activeOpportunities,
      pipelineValue,
      closedDeals,
      upcomingViewings,
      avgDaysOnMarket,
      totalLeads: leads.length,
    },
    leadSourcePerformance,
    inventoryDistribution,
    statusDistribution,
  };
}

/* ------------------------------------------------------------------ */
/* Lookup helpers (used across modules in client components)           */
/* ------------------------------------------------------------------ */

export function agentName(demo: RealEstateDemoData, id: string): string {
  return demo.agents.find((a) => a.id === id)?.name ?? "Unassigned";
}

export function leadName(demo: RealEstateDemoData, id: string): string {
  return demo.leads.find((l) => l.id === id)?.name ?? "Unknown lead";
}

export function propertyById(
  listings: PropertyListing[],
  id?: string
): PropertyListing | undefined {
  return listings.find((l) => l.id === id);
}

export const LEAD_STAGES: LeadStage[] = [
  "New",
  "Contacted",
  "Qualified",
  "Viewing Scheduled",
  "Negotiation",
  "Offer Submitted",
  "Won",
  "Lost",
];

export const DEAL_STAGES: DealStage[] = [
  "New Opportunity",
  "Qualification",
  "Viewing",
  "Negotiation",
  "Offer",
  "Reservation",
  "Agreement",
  "Closed Won",
  "Closed Lost",
];
