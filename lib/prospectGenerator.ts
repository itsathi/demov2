import type { RawProspectData, RawCompany } from "./rawProspectTypes";
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
} from "./types";

const S = "https://images.unsplash.com/photo";
const stock = {
  factory: `${S}-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop&q=80`,
  workshop: `${S}-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop&q=80`,
  plant: `${S}-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop&q=80`,
  building: `${S}-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=80`,
  restaurant: `${S}-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop&q=80`,
  food: `${S}-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop&q=80`,
  catering: `${S}-1482049016688-2d3e1b311543?w=1920&h=1080&fit=crop&q=80`,
  cityscape: `${S}-1473448912268-2022ce9509d8?w=1920&h=1080&fit=crop&q=80`,
  urban: `${S}-1497366216548-37526070297c?w=1920&h=1080&fit=crop&q=80`,
  office: `${S}-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop&q=80`,
  city: `${S}-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop&q=80`,
  home: `${S}-1513475382585-d06e58bcb0e0?w=1920&h=1080&fit=crop&q=80`,
  duct: `${S}-1581092160607-ee22621dd758?w=1920&h=1080&fit=crop&q=80`,
  clean: `${S}-1581578731548-c64695cc6952?w=1920&h=1080&fit=crop&q=80`,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractDisplayName(fullName: string): string {
  // Removes subtitles like "– AC & Villa Maintenance Abu Dhabi", "LLC", "Building Maintenance"
  let clean = fullName.split(/[–—\-|:]/)[0].trim();
  // Strip common corporate suffixes for display badge
  clean = clean.replace(/\b(LLC|L\.L\.C\.|FZE|FZC|Co\.|Company|Corporation|Services|Group)\b/gi, "").trim();
  return clean || fullName.split(/[–—\-|:]/)[0].trim();
}

function extractCompanyName(fullName: string): string {
  const parts = fullName.split(/[–—|]/);
  return parts[0].trim();
}

function deriveSlug(raw: RawProspectData): string {
  if (raw.company.contact?.domain) {
    const domainPart = raw.company.contact.domain
      .toLowerCase()
      .replace(/^www\./, "")
      .replace(/\.(com|ae|org|net|io|co|uae)(\.ae)?$/gi, "")
      .replace(/uae$/gi, "");
    if (domainPart.length >= 3) {
      return slugify(domainPart);
    }
  }
  const display = extractDisplayName(raw.company.name);
  return slugify(display);
}

function deriveInitials(displayName: string): string {
  const words = displayName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function deriveEstablished(company: RawCompany): number {
  if (company.established && typeof company.established === "number") {
    return company.established;
  }
  if (company.businessMaturity === "Established") return 2012;
  if (company.businessMaturity === "Veteran") return 1998;
  return 2018;
}

function deriveLocation(company: RawCompany): {
  city: string;
  state: string;
  country: string;
  fullLocation: string;
} {
  const city = company.location?.city || "Abu Dhabi";
  const state = company.location?.state || city;
  const country = company.location?.country || "United Arab Emirates";
  return {
    city,
    state,
    country,
    fullLocation: `${city}, ${country}`,
  };
}

function pickImageForService(slug: string): string {
  if (slug.includes("clean") || slug.includes("sanit")) return stock.clean;
  if (slug.includes("duct") || slug.includes("vent")) return stock.duct;
  if (slug.includes("install") || slug.includes("chiller")) return stock.plant;
  if (slug.includes("maintain") || slug.includes("repair")) return stock.workshop;
  if (slug.includes("villa") || slug.includes("home")) return stock.home;
  return stock.building;
}

type ServiceTemplateData = {
  tagline: string;
  summary: string;
  capacity: string;
  series: string[];
  standards: string[];
  applications: string[];
  features: string[];
};

const serviceKnowledgeBase: Record<string, ServiceTemplateData> = {
  "ac-installation": {
    tagline: "New split, ducted and central AC systems designed and installed to exact room loads.",
    summary:
      "Expert installation of residential and commercial air conditioning — from inverter split units to ducted and central systems. Correctly calculated cooling loads, premium copper piping, clean aesthetics, and same-day commissioning.",
    capacity: "Residential & Commercial",
    series: [
      "Inverter Wall-Mounted Split Systems",
      "Concealed Ducted Split Units",
      "Packaged & Rooftop Units",
      "Chilled Water FCU Systems",
    ],
    standards: ["AHRI Certified", "Abu Dhabi QCC Compliant", "ISO 9001:2015"],
    applications: ["Luxury Villas", "Apartments & Penthouses", "Offices & Retail", "Restaurants & Cafes"],
    features: [
      "Accurate heat load calculation before installation",
      "Genuine brand equipment with manufacturer warranty",
      "Vibration isolation and whisper-quiet operation",
      "Pressure-tested refrigerant piping and clean handover",
    ],
  },
  maintenance: {
    tagline: "Preventive and breakdown maintenance that preserves cooling efficiency and cuts utility bills.",
    summary:
      "Comprehensive AC maintenance visits covering coil chemical cleaning, gas pressure diagnostics, motor lubrication, electrical checks, and drain flushing to prevent water leaks and unexpected summer failures.",
    capacity: "One-Off & Annual AMC Plans",
    series: [
      "Comprehensive Annual Maintenance Contracts (AMC)",
      "Pre-Summer Deep Servicing & Health Check",
      "Coil Jet Washing & Chemical Cleaning",
      "Refrigerant Diagnostics & Gas Top-Up",
    ],
    standards: ["ASHRAE Standards", "ISO 14001 Compliant"],
    applications: ["Residential Villas", "Residential Towers", "Commercial Properties", "Labor & Staff Accommodations"],
    features: [
      "2-hour scheduled appointment windows",
      "Certified AC technicians with digital sign-off reports",
      "Emergency breakdown response priority for AMC clients",
      "Eco-friendly coil cleaning solutions",
    ],
  },
  "duct-cleaning": {
    tagline: "Rotary brush and sanitisation duct cleaning for pure, allergen-free indoor air.",
    summary:
      "Advanced HVAC duct inspection, robotic brushing, HEPA vacuum extraction, and antimicrobial fogging that eliminates accumulated dust, mould, allergens, and microbial buildup inside villa and building ductwork.",
    capacity: "Full HVAC Ductwork & Grilles",
    series: [
      "Rotary Brush Mechanical Cleaning",
      "HEPA-Filtered Negative Air Extraction",
      "Antimicrobial & Antifungal Fogging",
      "Video Borescope Inspection & Certification",
    ],
    standards: ["NADCA Standards (ACR 2021)", "IAQ Certified"],
    applications: ["Villas & Townhouses", "Office Floors", "Medical Clinics & Schools", "Hotels & Restaurants"],
    features: [
      "High-definition camera inspection before and after cleaning",
      "Hospital-grade disinfectants certified safe for families",
      "Protects furniture and interiors with zero dust escape",
      "Reduces musty AC odours and relieves respiratory allergies",
    ],
  },
  "hvac-solutions": {
    tagline: "End-to-end HVAC engineering, air quality audits and tailored climate control.",
    summary:
      "Complete climate engineering for challenging Gulf temperatures — combining smart thermostat integration, airflow balancing, zoning, and energy-optimised cooling design for villas, offices, and commercial facilities.",
    capacity: "Turnkey HVAC Contracting",
    series: [
      "Smart HVAC Automation & Thermostat Controls",
      "Airflow Balancing & CFM Optimization",
      "VAV & Multi-Zone Climate Systems",
      "Energy Efficiency Audits & Retrofits",
    ],
    standards: ["ASHRAE 62.1", "Estidama Pearl Rating Ready"],
    applications: ["Private Residences", "Commercial Buildings", "Warehouses & Showrooms", "Educational Facilities"],
    features: [
      "Custom airflow engineering for multi-story villas",
      "Smart phone app temperature and humidity controls",
      "Up to 30% reduction in air conditioning power draw",
      "Rapid diagnostic turnaround with verified warranties",
    ],
  },
  "villa-maintenance": {
    tagline: "Complete residential property upkeep — AC, plumbing, electrical and civil maintenance.",
    summary:
      "All-in-one villa maintenance solutions tailored for homeowners and estate managers. Seamless preventive servicing and reactive support keeping your property in peak condition all year round.",
    capacity: "Complete Villa Packages",
    series: [
      "Comprehensive Villa AMC Plans",
      "AC & Indoor Air Quality Management",
      "Plumbing, Water Pumps & Tank Cleaning",
      "Electrical & Lighting Maintenance",
    ],
    standards: ["Municipality Approved", "Quality Verified"],
    applications: ["Standalone Villas", "Gated Communities", "Townhouses", "Holiday Homes"],
    features: [
      "Dedicated account manager and single point of contact",
      "Scheduled preventive audits every quarter",
      "Transparent pricing with no hidden spare-part surcharges",
      "24/7 priority emergency dispatch",
    ],
  },
  "emergency-ac-repair": {
    tagline: "Rapid response cooling diagnostics and emergency repairs across the city.",
    summary:
      "Fast troubleshooting for water leaks, compressor trips, fan motor failures, and thermostat faults. Equipped vans arrive on-site with essential OEM replacement parts to restore cool air immediately.",
    capacity: "Same-Day Emergency Dispatch",
    series: [
      "Compressor & Capacitor Replacement",
      "Drain Pan Unclogging & Leak Repair",
      "Thermostat & PCB Troubleshooting",
      "Emergency Gas Leak Detection & Repair",
    ],
    standards: ["OEM Approved Parts"],
    applications: ["Homes & Apartments", "Commercial Outlets", "Offices", "Server Rooms"],
    features: [
      "Rapid arrival window across municipal districts",
      "Transparent diagnostics explained before any work begins",
      "Genuine OEM replacement components",
      "Comprehensive repair warranty",
    ],
  },
};

function buildServiceConfig(
  rawKeyword: string,
  index: number,
  displayName: string,
  city: string
): Service {
  const slug = slugify(rawKeyword);
  const matchedKey =
    Object.keys(serviceKnowledgeBase).find(
      (k) => slug.includes(k) || k.includes(slug)
    ) || (index === 0 ? "ac-installation" : index === 1 ? "maintenance" : index === 2 ? "duct-cleaning" : "hvac-solutions");

  const kb = serviceKnowledgeBase[matchedKey] || serviceKnowledgeBase["hvac-solutions"];

  const cleanName = rawKeyword
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const shortName =
    cleanName.length <= 14
      ? cleanName
      : cleanName.replace(/installation/i, "Install").replace(/maintenance/i, "Maintain").replace(/solutions/i, "HVAC").replace(/cleaning/i, "Clean").slice(0, 12);

  return {
    slug,
    name: cleanName,
    shortName,
    tagline: kb.tagline,
    summary: `${displayName} provides premium ${cleanName.toLowerCase()} in ${city} and surrounding areas. ${kb.summary}`,
    capacity: kb.capacity,
    series: kb.series,
    standards: kb.standards,
    applications: kb.applications,
    features: kb.features,
    image: pickImageForService(slug),
    sectionOrder: ["hero", "overview", "specifications", "applications", "process", "trust", "cta"],
    featured: index < 3,
  };
}

export function transformRawProspect(raw: RawProspectData): ProspectConfig {
  const company = raw.company;
  const audit = raw.audit;

  const displayName = extractDisplayName(company.name);
  const companyName = extractCompanyName(company.name);
  const slug = deriveSlug(raw);
  const established = deriveEstablished(company);
  const { city, state, country, fullLocation } = deriveLocation(company);

  // Branding
  const primaryColor = company.branding?.primaryColor || "#0052FF";
  const secondaryColor = company.branding?.secondaryColor || "#003DCC";
  const accentColor = company.branding?.accentColor || "#0EA5E9";
  const tintColor = company.branding?.tintColor || "#EAF2FF";

  // Social Proof
  const googleRating = company.socialProof?.googleRating || 4.9;
  const reviewCount = company.socialProof?.reviewCount || 35;
  const rawKeywords =
    company.socialProof?.topKeywords && company.socialProof.topKeywords.length > 0
      ? company.socialProof.topKeywords
      : ["AC Installation", "AC Maintenance", "Duct Cleaning", "HVAC Solutions"];

  // Ensure we have at least 4 services
  const keywordList = [...rawKeywords];
  if (!keywordList.some((k) => k.toLowerCase().includes("duct"))) {
    keywordList.push("Duct Cleaning");
  }
  if (!keywordList.some((k) => k.toLowerCase().includes("villa") || k.toLowerCase().includes("maintenance"))) {
    keywordList.push("Villa Maintenance");
  }
  if (!keywordList.some((k) => k.toLowerCase().includes("emergency") || k.toLowerCase().includes("repair"))) {
    keywordList.push("Emergency AC Repair");
  }

  const services: Service[] = keywordList.map((kw, i) =>
    buildServiceConfig(kw, i, displayName, city)
  );

  const featuredServiceSlug = services[0]?.slug || "ac-installation";

  // Contact
  const contactPhone = company.contact?.phone || company.contact?.rawPhone || "+971 50 123 4567";
  const contactEmail = company.contact?.email || `info@${company.contact?.domain || slugify(displayName) + ".ae"}`;
  const contactAddress =
    company.location?.address || `${city}, ${country}`;

  // Hero Copy
  const categoryTitle = company.category || company.industry || "Air Conditioning & Property Maintenance";
  const heroKicker = `Est. ${established} · ${city}, UAE · ${categoryTitle}`;
  const headlineTop = "Engineered AC &";
  const headlineAccent = "property care —";
  const headlineBottom = `trusted across ${city}.`;

  const heroSubline =
    audit?.summary ||
    audit?.websiteDetails?.description ||
    `${displayName} delivers reliable HVAC installation, scheduled maintenance, and duct cleaning across ${city} villas, towers, and commercial properties. Prompt scheduling, transparent pricing, and warranted workmanship.`;

  const slogan =
    audit?.personalizationHook ||
    "Do the job right, charge a fair price, and keep your property cool year-round.";

  // Projects
  const projects = [
    {
      name: `Luxury Villa AC & Duct Overhaul`,
      location: `${company.location?.address?.split("-")[0]?.trim() || city}, UAE`,
      img: stock.home,
    },
    {
      name: `Central Air Duct Sanitisation & Cleaning`,
      location: `${city}, UAE`,
      img: stock.clean,
    },
    {
      name: `High-Efficiency Ducted AC Installation`,
      location: `${city} Corniche, UAE`,
      img: stock.workshop,
    },
    {
      name: `Annual Cooling Maintenance Contract (AMC)`,
      location: `${city} Sector Development, UAE`,
      img: stock.plant,
    },
    {
      name: `Commercial Fit-Out Air Conditioning`,
      location: `${city} Business District, UAE`,
      img: stock.building,
    },
    {
      name: `Preventive HVAC Diagnostics & Servicing`,
      location: `${city}, UAE`,
      img: stock.factory,
    },
  ];

  // Voice Copy & Assistant Actions
  const assistantActions: AssistantAction[] = [
    {
      id: "quote",
      label: "Get a free quote",
      reply: `Send your property type, number of units and location in ${city} — the ${displayName} team will return an itemised, fair quote within hours.`,
    },
    {
      id: "maintenance",
      label: "Book an AC service visit",
      reply: `We offer 2-hour appointment windows across ${city}. Let us know your preferred morning or afternoon slot and we will confirm the technician.`,
    },
    {
      id: "duct",
      label: "Duct cleaning & sanitisation",
      reply: `Our duct cleaning includes rotary brushing, HEPA vacuuming, and antimicrobial misting. Share your villa or apartment size for an exact quote.`,
    },
    {
      id: "emergency",
      label: "Emergency — AC not cooling",
      reply: `For urgent cooling issues in ${city}, our rapid dispatch van will arrive with diagnostic gauges and key spare parts. Call ${contactPhone} or leave your number.`,
    },
    {
      id: "amc",
      label: "Annual Maintenance Contract (AMC)",
      reply: `AMC packages bundle quarterly deep cleans, priority breakdown call-outs, and discounted parts. Would you like a brochure for your villa?`,
    },
  ];

  const capabilityPoints: CapabilityPoint[] = [
    { icon: "award", text: `Proven expertise across ${city} since ${established}` },
    { icon: "shield", text: "Honest, itemised pricing with zero hidden surcharges" },
    { icon: "wrench", text: "100% in-house certified technicians — no subcontracting" },
    { icon: "handshake", text: "Guaranteed workmanship and genuine OEM components" },
  ];

  const capabilityStats: CapabilityStat[] = [
    { value: `${reviewCount}+`, label: "Verified 5-star reviews" },
    { value: "2 hr", label: "Appointment arrival window" },
    { value: "100%", label: "Workmanship warranty" },
    { value: "24/7", label: "Emergency support availability" },
  ];

  const processSteps: ProcessStep[] = [
    {
      step: "01",
      title: "Reach out",
      body: "Call, WhatsApp, or submit an enquiry — our smart dispatch logs your property details and symptoms immediately.",
    },
    {
      step: "02",
      title: "Survey & diagnosis",
      body: "Our certified technician conducts an honest on-site inspection using precision gauges, without guesswork.",
    },
    {
      step: "03",
      title: "Transparent quote",
      body: "You receive an itemised estimate with clear parts and labour costs before any repair or install starts.",
    },
    {
      step: "04",
      title: "Clean execution",
      body: "Work is carried out cleanly, respecting your home interiors, tested for airflow and temperature delta.",
    },
    {
      step: "05",
      title: "Warranty & follow-up",
      body: "Digital sign-off report provided and automatic reminders scheduled to keep your system healthy.",
    },
  ];

  const regionGroups: RegionGroup[] = [
    {
      title: `${city} & Municipal Sectors`,
      items: [
        company.location?.address?.split("-")[0]?.trim() || `${city} Center`,
        `${city} Residential Sectors`,
        "Khalifa City · MBZ · Al Raha",
        "Yas Island · Saadiyat Island",
      ],
    },
    {
      title: "Wider Emirates & Northern Regions",
      items: ["Abu Dhabi Mainland", "Dubai & Suburbs", "Commercial & Villa Developments"],
    },
  ];

  const voice: VoiceCopy = {
    brand: {
      initial: deriveInitials(displayName),
      line1: displayName.toUpperCase(),
      line2: `Est. ${established} · ${city}`,
    },
    nav: {
      productsLabel: "Services",
      servicesAllLabel: "All services",
      projectsLabel: "Portfolio",
      companyLabel: "Why Us",
      contactLabel: "Contact",
      quoteLabel: "Get a free quote",
      homeBack: "Back to overview",
    },
    hero: {
      primaryCta: "Get a free quote",
      secondaryCta: "Explore our services",
      heroImageAlt: `${displayName} — ${categoryTitle} in ${city}`,
      ghostText: `${displayName.toUpperCase()} · ${city.toUpperCase()}`,
      stats: [
        { value: `${established}`, label: `Serving ${city} since` },
        { value: `${googleRating}`, label: `${reviewCount} Google reviews` },
        { value: `${services.length}`, label: "Specialised service areas" },
        { value: "100%", label: "In-house certified crew" },
      ],
      contactCardLabel: "Call or WhatsApp — rapid reply",
      chipsHeading: "Verified Quality",
      scrollCue: "Our story & capability",
    },
    trustLines: [
      `${googleRating} ★ Rated on Google · ${reviewCount} Reviews`,
      `${city} Municipal Approved & Compliant`,
    ],
    servicesKicker: "Our services",
    servicesHomeHeading: `High-performance cooling & maintenance for ${city}`,
    servicesHomeBlurb:
      `From precision AC installation and duct sanitisation to turnkey annual contracts — carried out by ${displayName}'s trained in-house team.`,
    servicesIndexHeading: `The complete {displayName} service range`,
    servicesIndexBlurb:
      `{count} dedicated service lines across ${city} — honest pricing, 2-hour appointment windows, and backed by a comprehensive warranty.`,
    servicesIndexMetaTitle: `${displayName} — Services & Solutions`,
    servicesIndexMetaDescription:
      `Explore ${displayName}'s full range of AC installation, duct cleaning, maintenance, and villa repair services in ${city}.`,
    capability: {
      kicker: "Why Choose Us",
      headline: `The trusted choice for villa & commercial cooling in ${city}`,
      body:
        `${displayName} was founded on a simple principle: do the job right the first time and charge a fair, honest price. Our in-house technicians arrive on time, use genuine parts, and ensure your home stays cool and energy-efficient.`,
      points: capabilityPoints,
      stats: capabilityStats,
      showSvg: false,
      svg: "",
      mediaImageKey: "showreelPoster",
      ctaLabel: "Explore all services",
      bandImageKey: "heroPoster",
      bandKicker: "The Team",
      bandHeadline: `Dedicated technicians across ${city}`,
      bandBody:
        `Every job is carried out by our own staff — giving you peace of mind, punctuality, and accountability from first call to final sign-off.`,
    },
    process: {
      kicker: "How We Work",
      headline: "From your initial message to a cool home in 5 simple steps",
      body: "Fast response, digital appointment tracking, and no unexpected surprises on your bill.",
      steps: processSteps,
    },
    regions: {
      kicker: "Coverage Areas",
      headline: `Serving ${city} and neighbouring communities`,
      body: `Our mobile service vans operate daily across all major residential sectors, villa communities, and commercial districts.`,
      groups: regionGroups,
    },
    projectsIntro: {
      kicker: "Recent Work",
      headline: `Recent projects delivered across ${city}`,
      body: `A snapshot of villa overhauls, duct cleanings, and commercial installations completed with pride.`,
      footer: "Scroll to view recent installations and service contracts across the region.",
    },
    serviceDetail: {
      overviewHeadingPrefix: displayName,
      figureCaptionSuffix: "installed and serviced by",
      badge: "Warranted service",
      footnote:
        `Every ${displayName} job is executed to international HVAC standards, checked for air quality and pressure balance, and guaranteed with our direct warranty.`,
      specsHeading: "Scope & Specifications",
      applicationsKicker: "Where Applied",
      applicationsHeading: "Property Types We Service",
    },
    ctaFeatures: [
      {
        iconKey: "mouse",
        title: "Fast quote response",
        body: "Submit your details and get an upfront, itemised quote without waiting days.",
      },
      {
        iconKey: "chart",
        title: "Transparent pricing",
        body: "Clear breakdown of parts, labour, and preventive maintenance intervals.",
      },
      {
        iconKey: "chat",
        title: "AI & WhatsApp booking",
        body: "Schedule appointment slots instantly through our automated qualification flow.",
      },
      {
        iconKey: "bell",
        title: "Real-time dispatch alert",
        body: "Your request routes directly to the nearest duty technician.",
      },
    ],
    footer: {
      blurb: `specialists in air conditioning, duct sanitisation, and villa maintenance in ${city}, UAE.`,
    },
    assistant: {
      name: `${displayName} Assistant`,
      greeting: `Hi! I'm the ${displayName} assistant — here to help with AC installation, maintenance, duct cleaning, or a free quote for your ${city} property.`,
      placeholder: `Ask anything about AC services in ${city}…`,
      fallbackEmail: contactEmail,
      actions: assistantActions,
      leadTitle: "Enquiry logged",
      leadBody: `Your {label} request is with the ${displayName} dispatch team. A technician will follow up shortly.`,
      routed: `and assigned it to the ${displayName} team.`,
      followUp: "One of our team members will contact you with a time slot. Anything else I can assist with?",
    },
    formNote:
      `Our intelligent dispatch routes your requirement directly to our ${city} field team for rapid scheduling.`,
  };

  const designDirection: DesignDirection = {
    theme: "light-technical",
    navbar: "NavbarTransparent",
    hero: "HeroEngineered",
    serviceLayout: "ServiceEditorial",
    trustLayout: "TrustRating",
    processLayout: "ProcessManufacture",
    ctaLayout: "CtaEngineered",
    imageTreatment: "PhotoCover",
    animationLevel: "high",
    useSvgScenes: false,
  };

  return {
    slug,
    companyName,
    displayName,
    industry: company.industry || "HVAC Services",
    established,
    location: fullLocation,
    slogan,
    metaRole: `${categoryTitle} specialists`,
    hero: {
      kicker: heroKicker,
      headlineTop,
      headlineAccent,
      headlineBottom,
      subline: heroSubline,
    },
    branding: {
      primaryColor,
      secondaryColor,
      accentColor,
      tintColor,
    },
    contact: {
      email: contactEmail,
      address: contactAddress,
      phone: contactPhone,
    },
    socialProof: {
      googleRating,
      reviewCount,
      keywords: rawKeywords,
    },
    certifications: [
      `${googleRating} ★ Google Reviews (${reviewCount})`,
      `${city} Municipality Approved`,
      "Certified HVAC Technicians",
    ],
    markets: [
      city,
      "Abu Dhabi Emirate",
      "Dubai",
      "Sharjah",
      "United Arab Emirates",
    ],
    facilities: [
      `Main Service Hub — ${city}, UAE`,
      `Mobile Service Fleet servicing ${city} & suburbs`,
      `100% In-House Trained Technicians`,
    ],
    images: {
      officeBanner: stock.building,
      aerial: stock.cityscape,
      factorySharjah: stock.workshop,
      heroPoster: stock.home,
      showreelPoster: stock.clean,
    },
    projects,
    services,
    featuredServiceSlug,
    designDirection,
    automation: [
      "Enquiry received",
      "AI qualification",
      "Service & location matched",
      "Technician slot scheduled",
      "Client confirmed via WhatsApp",
      "Follow-up reminder set",
    ],
    cta: {
      heading: `Get a free, honest quote from ${displayName}.`,
      body: `Tell us what your property needs — an urgent AC repair, a duct deep clean, a new installation, or an annual plan — and our team will get back to you with a clear price and available slots.`,
    },
    voice,
  };
}

export function transformRawProspects(rawList: RawProspectData[]): ProspectConfig[] {
  return rawList.map(transformRawProspect);
}
