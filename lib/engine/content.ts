import type { ProspectResearch } from "@/lib/types";
import type {
  CompanyRecord,
  DemoContent,
  GalleryItem,
  IndustryFamily,
  ServiceItem,
} from "./types";
import { stockAt, stockFor } from "./stock";

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

const FAMILY_LABEL: Record<IndustryFamily, string> = {
  real_estate: "Real estate",
  hvac: "HVAC & cooling",
  construction: "Construction",
  facilities: "Facilities & building services",
  manufacturing: "Manufacturing & distribution",
  interior: "Interior design",
  home_services: "Home & trade services",
  professional: "Professional services",
  healthcare: "Healthcare",
  education: "Education",
  hospitality: "Hospitality",
  retail: "Retail",
  other: "Business",
};

const NAV_JUNK =
  /^(main|home|menu|more|other|hard|soft|services?|products?|about|contact|read more|learn more|view all|next|previous|skip|search|login|sign in|enquire|quote|book now)$/i;

function cleanText(value: string | null | undefined): string | null {
  if (!value) return null;
  const text = value
    .replace(/\s+/g, " ")
    .replace(/^[\s|•·\-–—:]+|[\s|•·\-–—:]+$/g, "")
    .trim();
  return text.length ? text : null;
}

function sentence(value: string): string {
  const text = value.trim();
  if (!text) return text;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

const CTA_TEXT =
  /\b(get a quote|request a quote|get in touch|contact us( today)?|call us( today)?|book (now|online|today|a service)|enquire( now| today)?|learn more|read more|find out more|shop now|view (our|all)|sign up|subscribe)\b/gi;

const THIRD_PARTY_COPY =
  /\b(ranked by|top \d+ .*companies|best .*companies|list of .*companies|discover .* (top|best)|directory of|near me)\b/i;

function stripTitlePrefix(value: string): string {
  if (!value.includes("|")) return value;
  const [first, ...rest] = value.split("|");
  if (first.trim().split(/\s+/).length < 7) return rest.join("|").trim();
  return value;
}

/**
 * Research descriptions are scraped, so they can contain title duplication,
 * bullet-separated CTA fragments and truncated sentences. Keep only complete,
 * descriptive sentences; never carry third-party editorial copy.
 */
function cleanDescription(value: string | null | undefined): string | null {
  let text = cleanText(value);
  if (!text) return null;
  text = text.replace(/<img[^>]*>/gi, "").trim();
  if (!text) return null;
  if (THIRD_PARTY_COPY.test(text)) return null;

  text = stripTitlePrefix(text).replace(CTA_TEXT, " ").replace(/\s+/g, " ").trim();

  const segments = text
    .split(/\s*[•|·]\s*|\s+[–—]\s+/)
    .map((segment) => cleanText(segment))
    .filter((segment): segment is string => Boolean(segment))
    .filter((segment) => segment.split(/\s+/).length >= 3)
    .filter((segment) => !/^[A-Z\s&]+$/.test(segment));

  if (!segments.length) return null;

  const sentences: string[] = [];
  for (const segment of segments) {
    const parts = segment.split(/(?<=[.!?])\s+/).filter(Boolean);
    for (const part of parts) {
      const value = part.trim();
      if (!value) continue;
      const complete = /[.!?]$/.test(value) || value.split(/\s+/).length >= 6;
      if (!complete) continue;
      if (value.split(/\s+/).length < 3) continue;
      sentences.push(value);
    }
  }

  if (!sentences.length) return null;

  const first = sentence(sentences[0]);
  const second = sentences[1] ? sentence(sentences[1]) : null;
  const combined = second && first.length + second.length <= 320 ? `${first} ${second}` : first;
  return combined.slice(0, 340).trim();
}

function firstSentence(value: string): string {
  const match = value.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : value).trim();
}

/** "Perth City Air are Expert Installers" → "Expert installers". */
function polishDescription(value: string, brandName: string): string {
  const name = cleanText(brandName);
  if (!name) return value;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^${escaped}\\s+(are|is)\\s+`, "i");
  if (!pattern.test(value)) return value;
  const rest = value.replace(pattern, "").trim();
  if (!rest) return value;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

const FAMILY_ABOUT_TAIL: Record<IndustryFamily, string> = {
  real_estate: "Enquiries are handled directly, with the brief and next steps confirmed up front.",
  interior: "Project scope and next steps are confirmed directly with the studio.",
  hvac: "Requirements and availability are confirmed directly with the team.",
  facilities: "Service scope and coverage are confirmed directly with the team.",
  construction: "Scope and programme are confirmed directly before work begins.",
  manufacturing: "Specification and lead times are confirmed directly on enquiry.",
  home_services: "Scope and timing are confirmed directly before work starts.",
  professional: "Engagement scope and deliverables are confirmed directly.",
  healthcare: "Availability and next steps are confirmed directly with the practice.",
  education: "Entry requirements and next steps are confirmed directly.",
  hospitality: "Availability and details are confirmed directly with the venue.",
  retail: "Availability and details are confirmed directly with the store.",
  other: "Scope and next steps are confirmed directly on enquiry.",
};

function titleise(value: string): string {
  const text = value.trim();
  if (!text) return text;
  const letters = text.replace(/[^a-z]/gi, "");
  if (letters && letters === letters.toUpperCase()) {
    return text
      .toLowerCase()
      .replace(/\b([a-z])([a-z'’-]*)/g, (_, a: string, b: string) => a.toUpperCase() + b);
  }
  return text;
}

export function deriveShortName(name: string | null): string {
  const cleaned = cleanText(name) ?? "Company";
  const primary = cleaned.split(/\s+[|—–]\s+|\s*[|—–]\s*/)[0]?.trim() || cleaned;
  return primary.length > 64 ? `${primary.slice(0, 61).trim()}…` : primary;
}

function deriveInitials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

function cleanServiceName(value: string | null | undefined): string | null {
  const text = cleanText(value);
  if (!text) return null;
  if (text.length < 3 || text.length > 64) return null;
  if (NAV_JUNK.test(text)) return null;
  if (/https?:\/\/|@|\b\d{6,}\b/.test(text)) return null;
  if (/[.!?]$/.test(text) && text.split(/\s+/).length > 10) return null;
  const open = (text.match(/\(/g) ?? []).length;
  const close = (text.match(/\)/g) ?? []).length;
  if (open !== close) return null;
  return titleise(text);
}

function dedupeNames(values: Array<string | null>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const key = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

/** Treat "Plumbing" and "Plumbing services" as the same service. */
function dedupeServiceNames(values: Array<string | null>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const key = value
      .toLowerCase()
      .replace(/\b(services?|solutions?|products?)\s*$/i, "")
      .replace(/[^a-z0-9]/g, "");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

const FAMILY_FALLBACK_SERVICES: Record<IndustryFamily, string[]> = {
  real_estate: ["Buyer representation", "Seller advisory", "Property management", "Investment advisory"],
  interior: ["Interior design", "Space planning", "Furniture & finishes", "Turnkey delivery"],
  hvac: ["Installation", "Servicing & maintenance", "Repairs & diagnostics", "Residential & commercial"],
  facilities: ["Hard services", "Soft services", "Planned maintenance", "Specialist works"],
  construction: ["New build", "Fit-out & refurbishment", "Project management", "Maintenance"],
  manufacturing: ["Product supply", "Specification support", "Installation", "Aftercare"],
  home_services: ["Installation", "Repairs", "Maintenance", "Emergency call-outs"],
  professional: ["Advisory", "Strategy & planning", "Delivery support", "Ongoing partnership"],
  healthcare: ["Consultation", "Treatment", "Preventive care", "Follow-up"],
  education: ["Programmes", "Admissions", "Student support", "Campus life"],
  hospitality: ["Guest experience", "Dining", "Events", "Bookings"],
  retail: ["Collections", "Personal service", "Delivery", "Aftercare"],
  other: ["Consultation", "Delivery", "Support", "Ongoing service"],
};

const FAMILY_PRIMARY_BLURB: Record<IndustryFamily, string> = {
  real_estate: "Advisory and representation shaped around your brief, with scope confirmed on enquiry.",
  interior: "A considered scope developed from the brief, the site and the agreed budget.",
  hvac: "Assessment, specification and scheduling confirmed after a site review.",
  facilities: "Scope and service levels agreed around the building and its occupants.",
  construction: "Scope, programme and responsibilities agreed before work begins.",
  manufacturing: "Specification, availability and lead times confirmed on enquiry.",
  home_services: "Requirements confirmed first, with a clear scope before work starts.",
  professional: "Engagement scope and deliverables agreed with you up front.",
  healthcare: "Availability and next steps confirmed by the practice.",
  education: "Entry requirements and next steps confirmed by the institution.",
  hospitality: "Availability and details confirmed directly with the venue.",
  retail: "Availability and details confirmed directly with the store.",
  other: "Scope and next steps confirmed on enquiry.",
};

const GENERIC_BLURBS = [
  "Handled with a clear brief, a named contact and a documented plan.",
  "Delivered around the space, the constraints and the agreed programme.",
  "Coordinated with the right specialists and a single point of contact.",
  "Planned around access, timing and the way the site needs to operate.",
  "Reviewed at each stage, with decisions recorded as they happen.",
  "Supported after handover, with the detail needed for what comes next.",
];

function serviceBlurb(family: IndustryFamily, index: number): string {
  if (index === 0) return FAMILY_PRIMARY_BLURB[family];
  return GENERIC_BLURBS[(index - 1) % GENERIC_BLURBS.length];
}

function buildServices(company: CompanyRecord, research: ProspectResearch | null): {
  items: ServiceItem[];
  concept: boolean;
} {
  const verifiedNames = dedupeServiceNames([
    ...(research?.services ?? []).map(cleanServiceName),
    ...(research?.serviceImages ? Object.keys(research.serviceImages).map(cleanServiceName) : []),
    ...company.socialProof.keywords.map(cleanServiceName),
    cleanServiceName(company.categoryRaw),
  ]).slice(0, 8);

  const items: ServiceItem[] = verifiedNames.map((name, index) => ({
    name,
    blurb: serviceBlurb(company.industryFamily, index),
    verified: true,
  }));

  let concept = false;
  if (items.length < 3) {
    const fillers = FAMILY_FALLBACK_SERVICES[company.industryFamily];
    for (const name of fillers) {
      if (items.length >= 4) break;
      if (items.some((item) => item.name.toLowerCase() === name.toLowerCase())) continue;
      const index = items.length;
      items.push({ name, blurb: serviceBlurb(company.industryFamily, index), verified: false });
      concept = true;
    }
  }

  return { items: items.slice(0, 6), concept };
}

/* ------------------------------------------------------------------ */
/* Imagery                                                             */
/* ------------------------------------------------------------------ */

function isBadPhoto(url: string | null | undefined): boolean {
  if (!url) return true;
  return /logo|favico|favicon|icon|sprite|placeholder|\.ico($|\?)/i.test(url);
}

function pickHero(company: CompanyRecord, research: ProspectResearch | null): { src: string; verified: boolean } {
  const asset = research?.assets?.find(
    (a) => a.category === "hero" && a.status === "valid" && (a.width ?? 0) >= 900
  );
  if (asset?.resolvedUrl) return { src: asset.resolvedUrl, verified: true };
  if (research?.heroImage && !isBadPhoto(research.heroImage) && research.heroImage.includes("unsplash.com")) {
    return { src: research.heroImage, verified: true };
  }
  return { src: stockAt(company.industryFamily, 0), verified: false };
}

function pickLogo(company: CompanyRecord, research: ProspectResearch | null): string | null {
  const asset = research?.assets?.find(
    (a) => a.category === "logo" && a.status === "valid" && (a.width ?? 0) >= 60
  );
  if (asset?.resolvedUrl && !/\.ico($|\?)/i.test(asset.resolvedUrl)) return asset.resolvedUrl;
  if (research?.logo && !/\.ico($|\?)/i.test(research.logo) && !/parastorage/i.test(research.logo)) {
    return research.logo;
  }
  if (company.branding.logoUrl) return company.branding.logoUrl;
  return null;
}

function buildGallery(
  company: CompanyRecord,
  research: ProspectResearch | null,
  heroSrc: string
): { items: GalleryItem[]; concept: boolean } {
  const verified = dedupeNames([
    ...(research?.projectImages ?? []),
    ...(research?.assets ?? [])
      .filter(
        (a) =>
          a.status === "valid" &&
          ["project", "gallery", "service", "background"].includes(a.category) &&
          (a.width ?? 0) >= 700
      )
      .map((a) => a.resolvedUrl),
  ]).filter(
    (src) =>
      /^https?:\/\//.test(src) &&
      !isBadPhoto(src) &&
      src !== heroSrc &&
      (src.startsWith("https://images.unsplash.com/") ||
        src.startsWith("https://source.unsplash.com/"))
  );

  const items: GalleryItem[] = verified.slice(0, 4).map((src) => ({
    src,
    alt: `${company.displayName ?? "Company"} — imagery from the company website`,
    concept: false,
  }));

  let concept = false;
  if (items.length < 3) {
    const stock = stockFor(company.industryFamily);
    for (let i = 0; items.length < 3 && i < stock.length; i++) {
      const src = stock[i];
      if (src === heroSrc || items.some((item) => item.src === src)) continue;
      items.push({
        src,
        alt: "Concept imagery — licensed stock, not a company project",
        concept: true,
      });
      concept = true;
    }
  }

  return { items, concept };
}

/* ------------------------------------------------------------------ */
/* Headlines & narrative                                               */
/* ------------------------------------------------------------------ */

type Headline = { top: string; accent: string; bottom: string };

function headlineFor(family: IndustryFamily, city: string | null): Headline {
  const place = city ? `in ${city}` : null;
  switch (family) {
    case "real_estate":
      return { top: "A considered", accent: "address", bottom: place ? `${place}.` : "for every move." };
    case "interior":
      return { top: "Spaces with", accent: "a point of view", bottom: "" };
    case "hvac":
      return { top: "Cooling,", accent: "engineered", bottom: place ? `for ${city}.` : "for the way you live." };
    case "facilities":
      return { top: "Buildings run", accent: "better", bottom: "with the right partner." };
    case "construction":
      return { top: "Built with", accent: "intent.", bottom: place ? `Across ${city}.` : "Delivered with care." };
    case "manufacturing":
      return { top: "Specified", accent: "for performance.", bottom: "" };
    case "home_services":
      return { top: "Done properly,", accent: "first time.", bottom: place ? `Serving ${city}.` : "" };
    case "professional":
      return { top: "Clear thinking,", accent: "better outcomes.", bottom: "" };
    case "healthcare":
      return { top: "Care that", accent: "listens.", bottom: "" };
    case "education":
      return { top: "Learn with", accent: "purpose.", bottom: "" };
    case "hospitality":
      return { top: "Stay a little", accent: "longer.", bottom: "" };
    case "retail":
      return { top: "Chosen with", accent: "intention.", bottom: "" };
    default:
      return { top: "A clearer", accent: "digital presence.", bottom: "" };
  }
}

function sublineFor(
  company: CompanyRecord,
  research: ProspectResearch | null,
  family: IndustryFamily,
  city: string | null
): { text: string; verified: boolean } {
  const brandName = cleanText(company.displayName) ?? cleanText(company.legalName);
  const fromResearch = cleanDescription(research?.description);
  if (fromResearch) {
    return {
      text: firstSentence(polishDescription(fromResearch, brandName ?? "")),
      verified: true,
    };
  }
  const fromSite = cleanDescription(company.content.websiteDescription);
  if (fromSite) {
    return {
      text: firstSentence(polishDescription(fromSite, brandName ?? "")),
      verified: true,
    };
  }

  const place = city ?? company.location.country;
  const label = place ? ` in ${place}` : "";
  const neutral: Record<IndustryFamily, string> = {
    real_estate: `Considered property guidance${label}, built around the people and the brief.`,
    interior: `An interior design studio${label}, focused on materials, light and the way a space is lived in.`,
    hvac: `Air conditioning and cooling work${label}, planned around the space and the people in it.`,
    facilities: `Facilities and building services${label}, coordinated around the people who use the space.`,
    construction: `Construction and contracting${label}, delivered around a clear brief and programme.`,
    manufacturing: `Products and systems${label}, specified around the requirement.`,
    home_services: `Trade and home services${label}, handled with a clear scope and a tidy finish.`,
    professional: `Advisory and delivery support${label}, shaped around the decision in front of you.`,
    healthcare: `Care and clinical services${label}, built around clear communication.`,
    education: `Learning and development${label}, built around curiosity and progress.`,
    hospitality: `A hospitality experience${label}, built around the guest.`,
    retail: `A considered retail experience${label}, built around the product.`,
    other: `A clearer digital presence${label}, built around the business and its customers.`,
  };
  return { text: neutral[family], verified: false };
}

function aboutHeadingFor(family: IndustryFamily, shortName: string): string {
  const headings: Record<IndustryFamily, string> = {
    real_estate: "Property, presented with clarity.",
    interior: "A studio led by detail.",
    hvac: "Comfort, without the guesswork.",
    facilities: "A steadier hand for your buildings.",
    construction: "Built around the brief.",
    manufacturing: "Engineered to specification.",
    home_services: "Work done properly.",
    professional: "Advisory with a clear point of view.",
    healthcare: "Care with clear communication.",
    education: "Learning with purpose.",
    hospitality: "An experience worth staying for.",
    retail: "Chosen with intention.",
    other: `About ${shortName}`,
  };
  return headings[family];
}

function processFor(family: IndustryFamily): Array<{ step: string; title: string; body: string }> {
  const shared = [
    { step: "01", title: "Brief", body: "We start with the requirement, the constraints and what a good outcome looks like." },
    { step: "02", title: "Scope", body: "A clear scope, programme and point of contact — agreed before anything moves." },
    { step: "03", title: "Delivery", body: "The work is coordinated around the agreed plan, with decisions documented as they happen." },
    { step: "04", title: "Handover", body: "A straightforward close-out, with the detail you need for what happens next." },
  ];
  if (family === "real_estate") {
    return [
      { step: "01", title: "Brief", body: "We listen to what you need — buying, selling, renting or investing — and define the brief." },
      { step: "02", title: "Curate", body: "A focused shortlist and a clear view of the options that genuinely fit." },
      { step: "03", title: "Viewings", body: "Viewings arranged around your schedule, with the right questions asked." },
      { step: "04", title: "Represent", body: "Support through offer, negotiation and the steps that follow." },
    ];
  }
  if (family === "interior") {
    return [
      { step: "01", title: "Brief", body: "We understand the space, the people and the way it needs to work." },
      { step: "02", title: "Concept", body: "A clear design direction, palette and material story." },
      { step: "03", title: "Detail", body: "Drawings, schedules and specifications developed with care." },
      { step: "04", title: "Delivery", body: "Coordination through to installation and handover." },
    ];
  }
  return shared;
}

function statsFor(
  company: CompanyRecord,
  content: { services: ServiceItem[]; areas: string[] }
): DemoContent["stats"] {
  const stats: DemoContent["stats"] = [];
  if (company.socialProof.googleRating) {
    stats.push({
      value: `${company.socialProof.googleRating.toFixed(1)}★`,
      label: company.socialProof.reviewCount
        ? `${company.socialProof.reviewCount} Google reviews`
        : "Google rating",
      verified: true,
    });
  }
  if (content.services.length >= 3) {
    stats.push({ value: `${content.services.length}`, label: "Services listed", verified: true });
  }
  if (content.areas.length >= 2) {
    stats.push({ value: `${content.areas.length}`, label: "Areas served", verified: true });
  }
  return stats.slice(0, 3);
}

/* ------------------------------------------------------------------ */
/* Contact & location                                                  */
/* ------------------------------------------------------------------ */

function cleanPhone(value: string | null | undefined): string | null {
  const text = cleanText(value);
  if (!text) return null;
  const compact = text.replace(/[^\d+()\s-]/g, "").trim();
  const digits = compact.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 16) return null;
  return compact;
}

function cleanAddress(value: string | null | undefined): string | null {
  const text = cleanText(value);
  if (!text) return null;
  if (text.length < 8 || text.length > 160) return null;
  if (/^(address|location)\s*:?/i.test(text) && text.length < 12) return null;
  if (/according to|recent statistics|predicted|%/.test(text)) return null;
  return text;
}

function buildAreas(company: CompanyRecord, research: ProspectResearch | null, city: string | null): string[] {
  const values = dedupeNames([
    ...(research?.serviceAreas ?? []).map((v) => cleanText(v)),
    city ? cleanText(city) : null,
  ])
    .filter((v) => v.length >= 2 && v.length <= 48 && !NAV_JUNK.test(v))
    .map(titleise);

  const country = company.location.country;
  if (country && !values.some((v) => v.toLowerCase() === country.toLowerCase())) {
    values.push(country);
  }
  return values.slice(0, 8);
}

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */

export function buildContent(company: CompanyRecord, research: ProspectResearch | null): DemoContent {
  const family = company.industryFamily;
  const brandName = cleanText(company.displayName) ?? cleanText(company.legalName) ?? "Company";
  const shortName = deriveShortName(brandName);
  const initials = deriveInitials(shortName);

  const researchCity = (research?.serviceAreas ?? []).find((v) => cleanText(v));
  const city = cleanText(company.location.city) ?? cleanText(researchCity);
  const country = cleanText(company.location.country);
  const locationLabel =
    [city, country].filter(Boolean).join(", ") || country || "Location to be confirmed";

  const hero = pickHero(company, research);
  const logo = pickLogo(company, research);
  const gallery = buildGallery(company, research, hero.src);
  const services = buildServices(company, research);
  const areas = buildAreas(company, research, city);
  const subline = sublineFor(company, research, family, city);
  const headline = headlineFor(family, city);

  const rawDescription =
    cleanDescription(research?.description) ??
    cleanDescription(company.content.websiteDescription);
  const description = rawDescription ? polishDescription(rawDescription, brandName) : null;
  const first = description ? firstSentence(description) : null;
  const hasMore = Boolean(description && first && description.length > first.length + 12);
  const aboutBody = description
    ? hasMore
      ? description
      : `${first} ${FAMILY_ABOUT_TAIL[family]}`
    : null;
  const aboutVerified = Boolean(description);
  const aboutCopy = aboutBody ?? subline.text;

  const phone = cleanPhone(research?.contact?.phone) ?? cleanPhone(company.contact.phone);
  const email = cleanText(research?.contact?.email) ?? cleanText(company.contact.email);
  const address = cleanAddress(research?.contact?.address) ?? cleanAddress(company.location.address);
  const whatsapp = cleanPhone(research?.contact?.whatsapp);

  const facts: Array<{ label: string; value: string }> = [];
  if (company.categoryRaw) facts.push({ label: "Focus", value: company.categoryRaw });
  if (city) facts.push({ label: "Based in", value: city });
  if (areas.length > 1) facts.push({ label: "Coverage", value: `${areas.length} areas` });
  if (research?.pagesCrawled?.length) {
    facts.push({ label: "Source", value: new URL(company.website ?? `https://${company.domain}`).hostname });
  }

  const primaryCta =
    family === "real_estate"
      ? "Arrange a conversation"
      : family === "interior"
        ? "Discuss a project"
        : family === "facilities"
          ? "Request a site review"
          : family === "construction"
            ? "Discuss your project"
            : family === "hospitality" || family === "retail"
              ? "Enquire"
              : "Start an enquiry";

  const content: DemoContent = {
    brandName,
    shortName,
    initials,
    legalName: cleanText(company.legalName) ?? brandName,
    domain: company.domain,
    industryLabel: FAMILY_LABEL[family],
    locationLabel,
    city,
    country,
    category: cleanText(company.categoryRaw),
    keywords: dedupeNames(
      company.socialProof.keywords
        .map(cleanText)
        .filter((value): value is string => {
          if (!value) return false;
          return (
            value.length >= 3 &&
            value.length <= 28 &&
            (value.match(/\(/g) ?? []).length === (value.match(/\)/g) ?? []).length &&
            !NAV_JUNK.test(value)
          );
        })
    ).slice(0, 8),
    hero: {
      kicker: `${FAMILY_LABEL[family]} · ${locationLabel}`,
      headlineTop: headline.top,
      headlineAccent: headline.accent,
      headlineBottom: headline.bottom,
      subline: subline.text,
      primaryCta,
      secondaryCta: "Explore services",
      image: hero.src,
      imageVerified: hero.verified,
      imageAlt: hero.verified
        ? `${brandName} — imagery from the company website`
        : "Concept imagery — licensed stock",
    },
    about: {
      heading: aboutHeadingFor(family, shortName),
      body: aboutCopy,
      verified: aboutVerified || subline.verified,
      facts,
    },
    services: services.items,
    servicesConcept: services.concept,
    areas,
    process: processFor(family),
    stats: [],
    rating: company.socialProof.googleRating
      ? { value: company.socialProof.googleRating, count: company.socialProof.reviewCount }
      : null,
    contact: { phone, email, address, whatsapp },
    gallery: gallery.items,
    galleryConcept: gallery.concept,
    logo,
    note: `Concept website for ${brandName}. Content is drawn from publicly available company information; imagery marked “concept” is licensed stock.`,
  };

  content.stats = statsFor(company, { services: content.services, areas: content.areas });
  return content;
}
