
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
};
import type { ProspectConfig, Service, DesignDirection, VoiceCopy } from "./types";
import { sharjahBatch } from "./prospectsBatch";
import { rawProspectsList } from "./rawProspects";
import { transformRawProspects } from "./prospectGenerator";

const BASE = "https://www.skmaircon.com";

const img = (path: string) => new URL(path, BASE).href;

const wix = (uri: string, w: number, h: number) =>
  `https://static.wixstatic.com/media/${uri}/v1/fill/w_${w},h_${h},al_c,q_90/${uri}`;

const designDirection: DesignDirection = {
  theme: "light-technical",
  navbar: "NavbarTransparent",
  hero: "HeroEngineered",
  serviceLayout: "ServiceEditorial",
  trustLayout: "TrustRating",
  processLayout: "ProcessManufacture",
  ctaLayout: "CtaEngineered",
  imageTreatment: "ImageFullBleed",
  animationLevel: "high",
  useSvgScenes: true,
};

export const services: Service[] = [
  {
    slug: "air-handling-units",
    name: "Air Handling Units",
    shortName: "AHU",
    tagline: "Modular and hygienic air handling units — engineered to the room, not just the spec.",
    summary:
      "SKM Air Handling Units are designed to meet the heating, ventilation and air conditioning demand of a space while consuming less energy and generating less noise. Built in two series — Modular (MAH) and Hygienic Modular (HMAH) — they suit indoor and outdoor installation across a wide range of commercial and institutional applications.",
    capacity: "1,000 – 60,950 CFM",
    series: [
      "MAH — Modular Air Handling Units · 25 models · 1,000–60,000 CFM nominal · up to 8.0 inWG (2,000 Pa) static pressure",
      "HMAH — Hygienic Modular Air Handling Units · 21 models · 1,000–42,500 CFM nominal · up to 8.0 inWG (2,000 Pa) static pressure",
    ],
    standards: ["EN 1886", "EN 13053", "AHRI 430", "AHRI 410", "TÜV SÜD · VDI 6022", "DIN 1946"],
    applications: [
      "Schools",
      "Commercial & residential buildings",
      "Hospitals",
      "Factories",
      "Hotels & restaurants",
      "Cinemas",
      "Mosques",
      "Supermarkets",
    ],
    features: [
      "Manufactured from modular sections in many configurations",
      "Thermal break system applied to panels and frames",
      "Varied sectional arrangements and fan discharge positions to suit site constraints",
      "Hygienic series tested for hospitals, pharmaceuticals, laboratories, food industry, electronics and clean-room applications",
      "Certified per EN 1886 & EN 13053; coil performance per AHRI 410",
    ],
    image: stock.plant,
    svg: "Air Purification Engineering.svg",
    sectionOrder: ["hero", "overview", "specifications", "applications", "process", "trust", "cta"],
    featured: true,
  },
  {
    slug: "chillers",
    name: "Chillers",
    shortName: "Chillers",
    tagline: "Air-cooled, water-cooled and centrifugal chillers built for Gulf ambient conditions.",
    summary:
      "SKM air-cooled packaged chillers are available from 8 TR to 520 TR across the APCY-P, APCY-H, APCY-E, APCN-S, APCN-V and ACMR series, with semi-hermetic screw, VFD screw and scroll compressors. Water-cooled and centrifugal lines extend the range — screw chillers from 82 TR to 375 TR, and centrifugal chillers from 200 TR to 2,700 TR.",
    capacity: "8 – 2,700 TR",
    series: [
      "Air-cooled · APCY-P / H / E, APCN-S, APCN-V, ACMR · 8–520 TR · R134a & R410A",
      "Water-cooled screw · WPCY / WPCN / WPCD · 82–375 TR",
      "Centrifugal · 200–2,700 TR · COP up to 6.9 at AHRI conditions",
    ],
    standards: ["AHRI 550/590", "AHRI 551/591", "ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018"],
    applications: [
      "Hotels",
      "High-rise buildings",
      "Retail & stores",
      "Hospitals",
      "Data centres",
      "Process cooling",
    ],
    features: [
      "Harsh-climate engineering for minimum outdoor ambients down to −4 °C and up to 52–55 °C",
      "Microprocessor controls with BMS integration as standard",
      "Factory assembled, leak tested, evacuated and internally wired — tested before delivery",
      "EC condenser fans and variable-speed screw options for part-load efficiency",
    ],
    image: stock.plant,
    svg: "Thermal Energy Exchange.svg",
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
  },
  {
    slug: "vrf-systems",
    name: "VRF Systems",
    shortName: "VRF",
    tagline: "High-capacity variable refrigerant flow for large high-rise buildings.",
    summary:
      "The SKM VRF system combines DC compressor control, DC fan motors and improved heat exchangers for top-tier cooling and heating efficiency. The VRF PRO V6 series reaches the world's largest single-system capacity in its class — 96 HP — with piping runs up to 1,000 m and level differences up to 110 m.",
    capacity: "8 – 96 HP",
    series: [
      "VRF PRO V5 · 8–88 HP in 2 HP increments · up to 1,000 m piping",
      "VRF PRO V6 · 8–96 HP in 2 HP increments · up to 1,000 m piping",
    ],
    standards: [],
    applications: ["High-rise buildings", "Hotels", "Offices", "Mixed-use developments"],
    features: [
      "1,000 m maximum piping length with 110 m level difference",
      "DC inverter compressor and DC fan motor control",
      "High external static pressure applications",
      "Wide selection of outdoor and indoor units",
    ],
    image: stock.plant,
    svg: "ac.svg",
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
  },
  {
    slug: "packaged-units",
    name: "Packaged Units",
    shortName: "Packaged",
    tagline: "Rooftop and ground packaged units engineered for Gulf climate performance.",
    summary:
      "SKM packaged air conditioners are designed and manufactured for the Gulf's severe climatic conditions and are built specifically for outdoor installation — rooftop or ground. A self-contained range from 4 TR to 145 TR across APMR, PACS, PACV and PAC4A series, including a 100% fresh-air packaged unit for year-round operation.",
    capacity: "4 – 145 TR",
    series: [
      "APMR / APMR-V · inverter scroll · R410A",
      "PACS / PACS-C · scroll · R22 / R407C",
      "PACV-S · scroll · R134a",
      "PACV-D · semi-hermetic reciprocating · R134a",
      "PAC4A · 100% fresh air / dedicated outside air",
    ],
    standards: ["AHRI 210/240", "AHRI 340/360", "ESMA", "SASO"],
    applications: ["Commercial spaces", "Warehouses", "Schools", "Mosques", "Power plants", "Substations"],
    features: [
      "Factory assembled, charged and tested before dispatch",
      "Site work limited to ducting and power connection",
      "Microprocessor controls with thermostatic or electronic expansion valves",
      "Fresh-air and dehumidification variants for year-round operation",
    ],
    image: stock.plant,
    svg: "rooftop.svg",
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
  },
  {
    slug: "condensing-units",
    name: "Condensing Units",
    shortName: "Condensing",
    tagline: "Remote air-cooled condensing units from 5 to 145 TR.",
    summary:
      "SKM air-cooled condensing units connect to indoor units located outside at ground or roof level, manufactured to meet Gulf severe climatic conditions. The AUMR, ACUS and ACUV series cover a wide capacity range with microprocessor control and are rated in accordance with international standards.",
    capacity: "5 – 145 TR",
    series: [
      "ACUV-D · semi-hermetic · 8–129 TR (50 Hz) / 9–150 TR (60 Hz)",
      "ACUV-S · hermetic scroll · 7–115 TR (50 Hz) / 9–136 TR (60 Hz)",
      "ACUS-C · scroll · R407C · 5–95 TR",
      "ACUS-G · scroll · R22 / R407C",
      "AUMR-G · hermetic scroll · R410A · 25–65 TR",
    ],
    standards: ["AHRI 365", "ASHRAE"],
    applications: ["Commercial spaces", "Warehouses", "Schools", "Mosques", "Power plants", "Substations"],
    features: [
      "One to four refrigeration circuits for staged capacity",
      "Match indoor central station AHUs or coils for split-system performance",
      "Stock of replacement parts across major GCC cities, Egypt, Jordan and Pakistan",
    ],
    image: stock.plant,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
  },
  {
    slug: "fan-coil-units",
    name: "Fan Coil Units",
    shortName: "FCU",
    tagline: "Quiet, dense fan coil range for standard and district cooling.",
    summary:
      "SKM fan coil units meet both standard and district cooling requirements with a wide range of airflow and capacity. Ducted and cassette units with sleek, compact, low-noise design — available in 3-speed (PSC) and variable-speed (EC) configurations with factory-piped valve packages to trim field installation time.",
    capacity: "200 – 3,000 CFM",
    series: [
      "Hi-Static · PSC · 600–3,000 CFM",
      "Hi-Static EC · 600–2,100 CFM",
      "Lo-Static · 200–1,200 CFM",
      "DFC Cassette · chilled water · 300–1,700 CFM",
    ],
    standards: ["AHRI 440"],
    applications: ["Apartments", "Offices", "Schools", "Clinics", "Hotels", "Retail"],
    features: [
      "3-speed PSC and variable-speed EC motor options",
      "Ducted units ideal above false ceilings",
      "Factory-piped valve packages for fast installation",
      "Suitable for standard and district cooling chilled-water systems",
    ],
    image: stock.plant,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
  },
  {
    slug: "swimpool-units",
    name: "Swimpool Dehumidification",
    shortName: "Swimpool",
    tagline: "Packaged dehumidification that reclaims latent heat from indoor pool air.",
    summary:
      "The SKM Swimpool unit dehumidifies indoor swimming pool enclosures while reclaiming the latent heat that would otherwise be wasted. Everything is built into one packaged system; the DH-S series uses pool moisture load estimation software, designed to ASHRAE recommended evaporation formulas and guidelines.",
    capacity: "Indoor pool enclosures",
    series: ["Swimpool Unit", "DH-S Series Dehumidification Unit"],
    standards: ["ASHRAE", "ASHRAE STD 62.1"],
    applications: ["Indoor swimming pools", "Wellness & leisure centres", "Hotel pool decks"],
    features: [
      "Latent heat recovery for economical operation",
      "All-in-one packaged dehumidification",
      "Load estimation per ASHRAE evaporation formulas",
      "Protects building fabric from humidity damage",
    ],
    image: stock.plant,
    sectionOrder: ["hero", "overview", "applications", "trust", "cta"],
  },
  {
    slug: "computer-room-air-conditioners",
    name: "Computer Room Air Conditioners",
    shortName: "CRAC",
    tagline: "Precision in-room cooling for data centres and clean environments.",
    summary:
      "SKM Computer Room Air Conditioners (CRAC) deliver precision temperature and humidity control for data centres, laboratories and clean-room environments. Offered in five sizes covering loads up to 30 TR, in both DX and chilled-water versions with up-flow and down-flow arrangements.",
    capacity: "Up to 30 TR",
    series: ["SCRR + RCA Series · DX & chilled water · up-flow & down-flow"],
    standards: [],
    applications: ["Data centres", "IT rooms", "Laboratories", "Clean-room environments"],
    features: [
      "Advanced controller with precise temperature and humidity control",
      "DX and chilled-water options",
      "Up-flow and down-flow air arrangements",
    ],
    image: stock.plant,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
  },
  {
    slug: "package-split-units",
    name: "Package & Split Units",
    shortName: "Unitary",
    tagline: "Complete unitary range — package, split, ducted mini-split and decorative units.",
    summary:
      "The SKM unitary range covers package units, split systems, ducted mini-split systems and decorative units — refrigerant-direct equipment for light commercial, residential and distributed cooling applications.",
    capacity: "Full unitary range",
    series: ["Package", "Split", "Ducted mini-split", "Decorative"],
    standards: [],
    applications: ["Apartments", "Villas", "Small offices", "Retail shops"],
    features: [
      "Complete self-contained and split configurations",
      "Sleek decorative and ducted mini-split options",
      "Engineered for Gulf climate operation",
    ],
    image: stock.plant,
    sectionOrder: ["hero", "overview", "applications", "trust", "cta"],
  },
  {
    slug: "parts-service",
    name: "Parts & Service",
    shortName: "Service",
    tagline: "Lifelong product support — OEM parts, maintenance contracts and training.",
    summary:
      "Lifelong proactive product support is a core SKM strategy. With more than 15 service professionals, SKM supports customers through the whole lifecycle of their equipment, backed by a genuine OEM spare-parts division and a network of qualified service across major GCC cities.",
    capacity: "15+ service professionals",
    series: ["Service Centre", "Spare Parts Division"],
    standards: [],
    applications: ["Maintenance contracts", "Troubleshooting & start-up", "Spare parts supply", "Factory & site training"],
    features: [
      "Original-equipment manufacturer (OEM) parts, quality checked periodically",
      "Wide range of maintenance and servicing contracts",
      "Professional selection advice — parts to service packages",
      "Start-up, troubleshooting and periodic maintenance",
      "Toll-free enquiries via 800 MYSKM",
    ],
    image: stock.plant,
    sectionOrder: ["hero", "overview", "applications", "trust", "cta"],
  },
];

export const voiceDefaults: VoiceCopy = {
  brand: { initial: "SKM", line1: "AIRCON", line2: "Est. 1974 · UAE" },
  nav: {
    productsLabel: "Products",
    servicesAllLabel: "Full product range",
    projectsLabel: "Projects",
    companyLabel: "Company",
    contactLabel: "Contact",
    quoteLabel: "Request catalogue",
    homeBack: "Back to overview",
  },
  hero: {
    primaryCta: "Talk to the SKM engineering team",
    secondaryCta: "Explore the product range",
    heroImageAlt: "head office and manufacturing complex, Sharjah",
    ghostText: "COOLING ENGINEERS · UAE",
    stats: [
      { value: "1974", label: "Manufacturing since — Sharjah, UAE" },
      { value: "2", label: "Plants — Sharjah · Dammam" },
      { value: "11", label: "Export markets served" },
      { value: "75,000 m²", label: "Engineering facility, Industrial Area 13" },
    ],
    contactCardLabel: "GCC toll-free parts & service line",
    chipsHeading: "Certified quality",
    scrollCue: "Inside the factory",
  },
  trustLines: [
    "Sharjah Economic Excellence Award — Gold",
    "AHRI · TÜV · UL certified range",
  ],
  servicesKicker: "Product families",
  servicesHomeHeading: "The catalogue — built around your cooling load",
  servicesHomeBlurb:
    "Every range in the catalogue is manufactured in-house — designed in the UAE for the world's harshest climates.",
  servicesIndexHeading: "The complete {displayName} range",
  servicesIndexBlurb:
    "{count} product families, manufactured and factory tested in {facility} — every one engineered for year-round Gulf conditions.",
  servicesIndexMetaTitle: "{displayName} — Products & ranges",
  servicesIndexMetaDescription:
    "The full {displayName} product range — chillers, air handling units, VRF, packaged, condensing, fan coil and more.",
  capability: {
    kicker: "Indigenous engineering",
    headline: "Designed, tested and built for the Gulf's harshest climate",
    body: "SKM designs and engineers its own equipment — from chiller compressor integration to air handling construction — then proves performance in its own R&D and testing laboratory before a single unit leaves the factory.",
    points: [
      { icon: "factory", text: "75,000 m² manufacturing facility · Industrial Area 13, Sharjah" },
      { icon: "factory", text: "HVAC production plant · 2nd Industrial City, Dammam · Saudi Arabia" },
      { icon: "rnd", text: "Dedicated R&D and testing laboratory" },
    ],
    stats: [
      { value: "ISO 9001", label: "Quality management" },
      { value: "ISO 14001", label: "Environmental" },
      { value: "OHSAS 18001", label: "Occupational safety" },
    ],
    showSvg: true,
    svg: "Thermal Energy Exchange.svg",
    mediaImageKey: "",
    ctaLabel: "Explore the full range",
    bandImageKey: "factorySharjah",
    bandKicker: "Manufacturing facility",
    bandHeadline: "75,000 m² of HVAC engineering in Sharjah",
    bandBody:
      "75,000 m² at Industrial Area 13, Sharjah — a sister plant in Dammam, Saudi Arabia scales the same quality systems regionally.",
  },
  process: {
    kicker: "How we deliver",
    headline: "From specification to site, under one factory roof",
    body: "Indigenous engineering means SKM controls the process end to end — so the unit that arrives on site is the unit that was designed for it.",
    steps: [
      {
        step: "01",
        title: "Specify",
        body: "Share your cooling load, site constraints and application — SKM supports product selection across its in-house range and published selection guides.",
      },
      {
        step: "02",
        title: "Engineer",
        body: "In-house engineering configures the unit to the build — section arrangements, fan discharge positions, capacity staging and energy performance.",
      },
      {
        step: "03",
        title: "Manufacture",
        body: "Assembled at ISO 9001 certified facilities in Sharjah and Dammam, with component traceability and quality gates throughout.",
      },
      {
        step: "04",
        title: "Test",
        body: "Every unit is factory tested before dispatch — leak tested, evacuated, internally wired and refrigerant charged to specification.",
      },
      {
        step: "05",
        title: "Deliver & support",
        body: "Delivered ready to install, then backed for life — OEM parts, maintenance contracts and factory or site training.",
      },
    ],
  },
  regions: {
    kicker: "Capability, exported",
    headline: "Delivered across the region — supported on the ground",
    body: "SKM ships and services equipment across the Gulf and into wider markets, with qualified service and spare-part stock maintained in major cities.",
    groups: [
      {
        title: "GCC & Arabia",
        items: [
          "United Arab Emirates",
          "Saudi Arabia",
          "Qatar",
          "Kuwait",
          "Bahrain",
          "Oman",
        ],
      },
      {
        title: "Wider region",
        items: ["Jordan", "Egypt", "Iraq", "Pakistan", "India"],
      },
    ],
  },
  projectsIntro: {
    kicker: "Landmark portfolio",
    headline: "Proven on the Gulf's most demanding projects",
    body: "SKM equipment cools world-class towers, mosques, metros, malls and industrial facilities across 11 markets — rooted in indigenous Gulf engineering.",
    footer: "Scroll to travel the portfolio — {count} landmark installations across the region.",
  },
  serviceDetail: {
    overviewHeadingPrefix: "SKM",
    figureCaptionSuffix: "designed and built by",
    badge: "Factory tested",
    footnote:
      "Every SKM unit is factory assembled, leak tested, evacuated and charged before dispatch — installed with no more than ducting and power connection.",
    specsHeading: "The complete range",
    applicationsKicker: "Where it's applied",
    applicationsHeading: "Applications across the built environment",
  },
  ctaFeatures: [
    {
      iconKey: "mouse",
      title: "A qualified lead, not a generic form",
      body: "Every enquiry is captured, profiled by product area and routed to the right SKM team.",
    },
    {
      iconKey: "chart",
      title: "Service intelligence from day one",
      body: "Know exactly which products drive demand — chiller quotes vs. AHU specifications.",
    },
    {
      iconKey: "chat",
      title: "AI qualification before a human reply",
      body: "Suggested actions short-cut the conversation and capture the requirement instantly.",
    },
    {
      iconKey: "bell",
      title: "Your team is notified in real time",
      body: "New project requests land with SKM immediately — no manual forwarding, no delay.",
    },
  ],
  footer: {
    blurb:
      "one of the Gulf's leading manufacturers of HVAC equipment, engineered and built in Sharjah and Dammam.",
  },
  assistant: {
    name: "SKM assistant",
    greeting:
      "Hi! I'm the SKM assistant — engineered to help with anything from a catalogue request to a chiller specification.",
    placeholder: "Ask anything about SKM…",
    fallbackEmail: "info@skmaircon.com",
    actions: [
      {
        id: "catalogue",
        label: "Request a product catalogue",
        reply:
          "The full-range catalogue covers SKM's complete product line — including the applied and unitary selection guides. I'll flag it for the team to send over.",
      },
      {
        id: "ahu",
        label: "Discuss an AHU project",
        reply:
          "For an air handling unit we'll want airflow (CFM), static pressure and the application. Share those and the engineering team will size it against the MAH or HMAH range.",
      },
      {
        id: "chiller",
        label: "Quote a chiller project",
        reply:
          "Chillers run 8–2,700 TR across air-cooled, water-cooled and centrifugal lines. If you know the load in TR or kW, that's the best starting point.",
      },
      {
        id: "vrf",
        label: "VRF for a high-rise?",
        reply:
          "SKM VRF reaches 96 HP per system with 1,000 m piping runs and 110 m level difference — well suited to tall buildings. Send the floor plan and our team will help confirm selection.",
      },
      {
        id: "service",
        label: "Book parts & service",
        reply:
          "The service centre covers OEM parts, maintenance contracts, start-up and troubleshooting. Use the enquiry form and select Parts & Service — or the team can be reached at info@skmaircon.com.",
      },
    ],
    leadTitle: "Lead captured",
    leadBody:
      "Your {label} enquiry is with the SKM team. No form sits in an inbox — it's qualified and assigned automatically.",
    routed: "and routed it to the SKM team.",
    followUp: "One of the team will follow up. Anything else I can help with?",
  },
  formNote:
    "The assistant below opens automatically — see how a qualified lead lands with the SKM team without a single manual step.",
};

export function getTemplates(prospect: ProspectConfig): VoiceCopy {
  const v = prospect.voice ?? {};
  const merged = { ...voiceDefaults, ...v,
    nav: { ...voiceDefaults.nav, ...(v.nav ?? {}) },
    hero: { ...voiceDefaults.hero, ...(v.hero ?? {}) },
    trustLines: v.trustLines ?? voiceDefaults.trustLines,
    serviceDetail: { ...voiceDefaults.serviceDetail, ...(v.serviceDetail ?? {}) },
    capability: { ...voiceDefaults.capability, ...(v.capability ?? {}) },
    process: { ...voiceDefaults.process, ...(v.process ?? {}) },
    regions: { ...voiceDefaults.regions, ...(v.regions ?? {}) },
    projectsIntro: { ...voiceDefaults.projectsIntro, ...(v.projectsIntro ?? {}) },
    ctaFeatures: v.ctaFeatures ?? voiceDefaults.ctaFeatures,
    footer: { ...voiceDefaults.footer, ...(v.footer ?? {}) },
    assistant: { ...voiceDefaults.assistant, ...(v.assistant ?? {}) },
  } as VoiceCopy;
  const replaceTokens = (str: string) =>
    str
      .replaceAll("{displayName}", prospect.displayName)
      .replaceAll("{count}", String(prospect.services.length))
      .replaceAll("{facility}", prospect.facilities[0] ?? "");

  return {
    ...merged,
    servicesIndexHeading: replaceTokens(merged.servicesIndexHeading),
    servicesIndexBlurb: replaceTokens(merged.servicesIndexBlurb),
    projectsIntro: {
      ...merged.projectsIntro,
      footer: replaceTokens(merged.projectsIntro.footer),
    },
    assistant: {
      ...merged.assistant,
      leadBody: replaceTokens(merged.assistant.leadBody),
    },
  };
}

const JP_HERO =
  "2e85c2_96e855d5633a4d938f63929c7007f89ef000.jpg";
const JP_SHOWREEL =
  "2e85c2_775a8d8d63694b439a421ca8d66dc672f000.jpg";
const JP_FCU =
  "2e85c2_e74396d7980e4993941d086e4bebb73d~mv2.png";
const JP_DUCT_WH =
  "2e85c2_cf1c9af0bf984165a08debad5fbf6b70~mv2.png";
const JP_DUCT_UNITS =
  "2e85c2_dd955ba64c5148808b71b870c18b9152~mv2.jpg";
const JP_FREE_FLOW =
  "2e85c2_ca365b3633cc4729ba833c65cf2d93ad~mv2.jpg";
const JP_PACKAGE =
  "2e85c2_0a5fd3df59354ed788ead6971f06cc32~mv2.png";
const JP_CARRIER =
  "2e85c2_8fd54bd35af64f988652299a31c0bbc1~mv2.jpg";

const johnPaulServices: Service[] = [
  {
    slug: "ac-installation",
    name: "AC Installation",
    shortName: "Install",
    tagline:
      "New systems designed, supplied and installed properly the first time.",
    summary:
      "From a single split unit to chilled-water FCU, ducted and packaged systems, John Paul designs and installs AC for homes, kitchens and warehouses across Sharjah and Dubai — sized correctly, quoted honestly and finished clean.",
    capacity: "Residential → commercial",
    series: [
      "Split & inverter units",
      "Ducted & mini-ducted systems",
      "Chilled water FCU & cassette units",
      "Package & rooftop units",
    ],
    standards: [],
    applications: ["Apartments & villas", "Restaurants & QSR kitchens", "Warehouses & workshops", "Retail shops"],
    features: [
      "Site survey before quoting — no guesswork sizing",
      "Honest, itemised quotes with no add-ons",
      "Clean same-day installs, charged and tested",
      "The crew that finishes stays the crew that started",
    ],
    image: stock.factory,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
    featured: true,
  },
  {
    slug: "ac-maintenance",
    name: "AC Maintenance",
    shortName: "Maintain",
    tagline:
      "Scheduled and one-off servicing that keeps units healthy — and bills low.",
    summary:
      "Regular servicing keeps gas pressure, coils, filters and drains healthy, cutting breakdowns and electricity bills. John Paul runs maintenance visits and annual plans for homes and businesses across Sharjah and Dubai.",
    capacity: "One-off & annual plans",
    series: [
      "Annual service plans",
      "Pre-summer health checks",
      "Coil & filter cleaning",
      "Gas top-up & diagnostics",
    ],
    standards: [],
    applications: ["Home AC units", "Villas & apartment estates", "Restaurants & shops", "Office buildings"],
    features: [
      "2-hour appointment windows — morning or evening",
      "Service checklist you keep at the end of each visit",
      "CoolGuard members get priority scheduling",
      "No subcontracting — the same faces every time",
    ],
    image: stock.factory,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
    featured: true,
  },
  {
    slug: "coolguard",
    name: "CoolGuard AC Protection",
    shortName: "CoolGuard",
    tagline:
      "The in-house protection plan for existing AC systems.",
    summary:
      "CoolGuard bundles priority response, scheduled inspections and member pricing on repairs into a single plan — John Paul's own answer to aftermarket warranties, covering systems we've installed or inherited.",
    capacity: "Enrol existing systems",
    series: [
      "Priority response over general call-outs",
      "Scheduled checkups before the peak months",
      "Member pricing on parts & labour",
      "Annual service included in the plan",
    ],
    standards: [],
    applications: ["Existing AC systems", "Multi-unit homes", "Restaurants & retail", "Rental & office estates"],
    features: [
      "One flat annual plan — no surprise invoices",
      "Checkups timed before summer demand",
      "Member discounts on repairs and replacements",
      "Transferable if the property changes hands",
    ],
    image: stock.factory,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
    featured: true,
  },
  {
    slug: "design-consultancy",
    name: "Design & Consultancy",
    shortName: "Consult",
    tagline:
      "Cooling loads calculated properly — before a single unit is bought.",
    summary:
      "Load calculations, system selection and duct layout for new builds, extensions and refurbishments — catching over-sizing and costly mistakes on paper first, and presenting honest options at different price points.",
    capacity: "New build · retrofit",
    series: [
      "Cooling load calculations",
      "System selection — brand-agnostic advice",
      "Duct & chilled water layout",
      "Phased install plan",
    ],
    standards: [],
    applications: ["New homes & extensions", "Restaurants & commercial fit-outs", "Warehouses", "Renovation projects"],
    features: [
      "Same-day initial advice on the phone",
      "Sizing tuned to Sharjah & Dubai climates",
      "Three honest price options, not one inflated quote",
      "Drawings you can hand straight to a contractor",
    ],
    image: stock.factory,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
    featured: true,
  },
  {
    slug: "ventilation",
    name: "Ventilation",
    shortName: "Vent",
    tagline:
      "Extract and fresh-air systems that kitchens and workshops rely on.",
    summary:
      "Grease extract, general ventilation and fresh-air supply designed and installed to keep commercial kitchens, workshops and washrooms breathable, cool and within code.",
    capacity: "Extract · fresh air",
    series: [
      "Kitchen grease extract & ducting",
      "Bathroom & utility ventilation",
      "Fresh-air supply systems",
      "Smoke & heat extraction",
    ],
    standards: [],
    applications: ["Commercial kitchens", "Bathrooms & laundries", "Workshops & warehouses", "Stairwells & corridors"],
    features: [
      "Extraction-rate design, not guesswork",
      "Quiet, low-drain fans",
      "Ducting that hides cleanly in the ceiling",
      "Code-aware installs for food businesses",
    ],
    image: stock.factory,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
    featured: true,
  },
  {
    slug: "refrigeration",
    name: "Refrigeration",
    shortName: "Refrig",
    tagline:
      "Cold rooms and fridges that hold temperature — designed, installed and kept.",
    summary:
      "Walk-in coolers, freezer rooms and display refrigeration for food businesses — sized, installed and maintained within food-safety temperatures all year.",
    capacity: "Walk-ins · cold rooms",
    series: [
      "Walk-in cold rooms",
      "Display & chiller cabinets",
      "Freezer rooms",
      "Rack & glycol systems",
    ],
    standards: [],
    applications: ["Restaurants & QSR kitchens", "Supermarkets", "Bakeries & catering", "Cold storage"],
    features: [
      "Correct heat-load sizing for every room",
      "Unit controls and defrost set up properly",
      "Standby-and-repair support for food businesses",
      "Temperature logging for HACCP compliance",
    ],
    image: stock.factory,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
    featured: true,
  },
  {
    slug: "duct-works",
    name: "Duct Works",
    shortName: "Ducts",
    tagline:
      "Pre-insulated and sheet-metal ducting fabricated and installed on site.",
    summary:
      "Supply, fabrication and installation of pre-insulated and sheet-metal ducting — from a single room to a full warehouse fit-out, working as part of our own install crews.",
    capacity: "Fabricate · install",
    series: [
      "Pre-insulated ducts",
      "Sheet-metal & GI ducts",
      "Grilles, diffusers & volume control",
      "Insulation & vapour barrier",
    ],
    standards: [],
    applications: ["Warehouse fit-outs", "Retail & restaurants", "Offices", "Chilled water systems"],
    features: [
      "Fabricated to drawings — not guesswork",
      "Leak-tested joints sealed properly",
      "Clean, tidy fixings that respect the ceiling",
      "Coordinates with our own install crews",
    ],
    image: stock.factory,
    sectionOrder: ["hero", "overview", "specifications", "applications", "trust", "cta"],
    featured: true,
  },
];

export const johnPaulAc: ProspectConfig = {
  slug: "john-paul-ac",
  companyName: "John Paul AC",
  displayName: "John Paul AC",
  industry: "hvac",
  established: 1979,
  location: "Sharjah, United Arab Emirates",
  slogan: "Do the job right, charge a fair price, and the clients will stay forever.",
  metaRole: "AC installation & maintenance specialists",
  hero: {
    kicker: "Est. 1979 · Sharjah, UAE · AC install & maintenance specialists",
    headlineTop: "We keep the UAE",
    headlineAccent: "cool —",
    headlineBottom: "47 years running.",
    subline:
      "Family-owned AC specialists in Sharjah since 1979 — installation, maintenance and honest pricing for homes, kitchens, restaurants and warehouses. The crew that quotes your job is the crew that arrives.",
  },
  branding: {
    primaryColor: "#0052FF",
    secondaryColor: "#003DCC",
    accentColor: "#0EA5E9",
    tintColor: "#EAF2FF",
  },
  contact: {
    email: "info@johnpaulac.com",
    address: "Office G3, Bldg 39, Street 52, Al Yarmook, Sharjah, United Arab Emirates",
    phone: "+971 50 684 1059",
  },
  socialProof: {
    googleRating: 4.9,
    reviewCount: 116,
    keywords: ["AC Installation", "AC Maintenance", "AC Diagnosis", "System Repairs"],
  },
  certifications: [],
  markets: ["Sharjah", "Dubai", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"],
  facilities: [
    "Based in Al Yarmook, Sharjah — serving Sharjah & Dubai",
    "Independently owned and operated — small team, serious output",
    "No subcontracting — the same crew finishes every job",
  ],
  images: {
    officeBanner: stock.office,
    aerial: stock.cityscape,
    factorySharjah: stock.factory,
    heroPoster: stock.workshop,
    showreelPoster: stock.city,
  },
  projects: [
    {
      name: "Chilled Water FCU Installation",
      location: "Sharjah, UAE",
      img: stock.city,
    },
    {
      name: "Ducted Units — Warehouse with Duct Work",
      location: "Sharjah, UAE",
      img: stock.city,
    },
    {
      name: "Ducted Type Units for Warehouse",
      location: "Sharjah, UAE",
      img: stock.city,
    },
    {
      name: "Free-Flow Ducted Install — Warehouse with Racks",
      location: "Dubai, UAE",
      img: stock.city,
    },
    {
      name: "Package Unit Installation for Warehouse",
      location: "Dubai, UAE",
      img: stock.city,
    },
    {
      name: "Carrier Package Unit — Commercial Retail",
      location: "Dubai, UAE",
      img: stock.city,
    },
  ],
  services: johnPaulServices,
  featuredServiceSlug: "ac-installation",
  designDirection: {
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
  },
  automation: [
    "Enquiry received",
    "AI qualification",
    "Service matched",
    "Lead created in CRM",
    "Crew notified with slot",
    "Follow-up scheduled",
  ],
  cta: {
    heading: "Get a free, honest quote.",
    body: "Tell us what you need — a new install, a breakdown, or a service plan — and the John Paul crew will come back with a straight answer and a fair price.",
  },
  voice: {
    brand: { initial: "JP", line1: "JOHN PAUL", line2: "Est. 1979 · Sharjah" },
    nav: {
      productsLabel: "Services",
      servicesAllLabel: "All services",
      projectsLabel: "Projects",
      companyLabel: "Our story",
      contactLabel: "Contact",
      quoteLabel: "Get a free quote",
      homeBack: "Back to services",
    },
    hero: {
      primaryCta: "Get a free quote",
      secondaryCta: "Browse services",
      heroImageAlt: "John Paul AC — 47 years of keeping the UAE cool",
      ghostText: "KEEP THE UAE COOL · 1979",
      stats: [
        { value: "47", label: "Years keeping the UAE cool — since 1979" },
        { value: "150+", label: "Installation projects delivered" },
        { value: "1,000+", label: "AC units serviced" },
        { value: "4.9", label: "Google rating · 116 reviews" },
      ],
      contactCardLabel: "WhatsApp / call — replies in minutes",
      chipsHeading: "Recognised AC specialists",
      scrollCue: "Our story & the crew",
    },
    trustLines: [
      "UAE's most trusted AC specialists",
      "CoolGuard AC protection — in-house",
    ],
    servicesKicker: "Service areas",
    servicesHomeHeading: "AC services that keep a city cool",
    servicesHomeBlurb:
      "Installation, maintenance, CoolGuard protection, refrigeration, ventilation and duct works — carried by one small, serious family team since 1979.",
    servicesIndexHeading: "The complete {displayName} service range",
    servicesIndexBlurb:
      "{count} service areas under one roof — honest quotes, 2-hour appointment windows and a crew that never subcontracts.",
    servicesIndexMetaTitle: "{displayName} — Services",
    servicesIndexMetaDescription:
      "The full John Paul AC service range — installation, maintenance, CoolGuard protection, ventilation, refrigeration and more. Honest quotes and 2-hour appointment windows across Sharjah and Dubai.",
    capability: {
      kicker: "Why John Paul",
      headline: "Do it right, charge fair, and the clients stay forever",
      body: "A family outfit that has kept the UAE cool for 47 years — no salesmen, no subcontracting. The technician who quotes your job is the one who shows up, and the price quoted is the price billed.",
      points: [
        { icon: "award", text: "Half a century of expertise — founded 1979" },
        { icon: "shield", text: "Honest pricing. Always." },
        { icon: "handshake", text: "A family that's here to stay" },
        { icon: "users", text: "Small team. Serious output. — lean by design" },
      ],
      stats: [
        { value: "150+", label: "Installation projects" },
        { value: "1000+", label: "Units serviced" },
        { value: "500+", label: "Happy clients" },
        { value: "99%", label: "Would recommend us" },
      ],
      showSvg: false,
      svg: "",
      mediaImageKey: "showreelPoster",
      ctaLabel: "Explore all services",
      bandImageKey: "heroPoster",
      bandKicker: "The crew",
      bandHeadline: "A small, serious team in Al Yarmook, Sharjah",
      bandBody:
        "The same family-run crew handles installs, maintenance and CoolGuard calls — quoting your job, arriving on time, and signing off the work.",
    },
    process: {
      kicker: "How the lean team runs",
      headline: "From a WhatsApp message to a booked slot in minutes",
      body: "Every call is captured, qualified and scheduled in one flow — the same care as 1979, minus the paper.",
      steps: [
        {
          step: "01",
          title: "Reach out",
          body: "Message on WhatsApp, call the team or send the quote form — every enquiry lands in one place.",
        },
        {
          step: "02",
          title: "Diagnosis",
          body: "Details are qualified instantly: what's needed, where, and how fast — matched to the right service.",
        },
        {
          step: "03",
          title: "Slot booked",
          body: "A 2-hour appointment window is confirmed and the crew member is assigned automatically.",
        },
        {
          step: "04",
          title: "Job done",
          body: "The technician arrives with the right parts, finishes clean, and hands you a sign-off checklist.",
        },
        {
          step: "05",
          title: "Follow-up",
          body: "CoolGuard reminders and service schedules keep the unit healthy — we call you, not the other way around.",
        },
      ],
    },
    regions: {
      kicker: "Service areas",
      headline: "Serving Sharjah and Dubai — with the same crew",
      body: "Based in Al Yarmook, Sharjah since day one; the same technicians cover Dubai and the Northern Emirates for installs, maintenance and call-outs.",
      groups: [
        {
          title: "Sharjah",
          items: [
            "Al Yarmook — our base",
            "City-wide residential service",
            "Industrial & warehouse installs",
            "Restaurants & QSR kitchens",
          ],
        },
        {
          title: "Dubai & Northern Emirates",
          items: [
            "Dubai villas & apartments",
            "Retail & commercial fit-outs",
            "Ajman · Umm Al Quwain · RAK",
            "Ongoing service contracts",
          ],
        },
      ],
    },
    projectsIntro: {
      kicker: "Installed and trusted",
      headline: "From kitchens to warehouses — projects we're proud of",
      body: "We've fitted and serviced AC for big-name restaurants, busy warehouses and family homes across Sharjah and Dubai — done properly, once.",
      footer: "Scroll to travel the portfolio — {count} recent installations and service projects.",
    },
    serviceDetail: {
      overviewHeadingPrefix: "John Paul",
      figureCaptionSuffix: "installed and maintained by",
      badge: "Fully warranted work",
      footnote:
        "Every job is quoted honestly, scheduled in a 2-hour window and finished with a sign-off checklist you keep — backed by regular CoolGuard checkups.",
      specsHeading: "What we cover",
      applicationsKicker: "Where we work",
      applicationsHeading: "Typical sites we serve",
    },
    ctaFeatures: [
      {
        iconKey: "mouse",
        title: "A quote lead, captured instantly",
        body: "Every WhatsApp, call and form enquiry becomes a structured lead — nothing lost in a notebook.",
      },
      {
        iconKey: "chart",
        title: "Service demand, at a glance",
        body: "See which services people need — new installs vs. maintenance vs. breakdowns — as it happens.",
      },
      {
        iconKey: "chat",
        title: "AI qualifies before a human replies",
        body: "CoolGuard and maintenance enquiries are recognised and scheduled straight into the calendar.",
      },
      {
        iconKey: "bell",
        title: "The crew is notified in real time",
        body: "New jobs land with the right technician immediately — no manual forwarding, no delay.",
      },
    ],
    footer: {
      blurb:
        "independent AC installation and maintenance specialists in Sharjah since 1979 — honest pricing for homes, kitchens and warehouses.",
    },
    assistant: {
      name: "John Paul's assistant",
      greeting:
        "Hi! I'm John Paul's assistant — ask about installations, maintenance, CoolGuard protection, or a free quote for your home or business.",
      placeholder: "Ask about AC installation in Sharjah…",
      fallbackEmail: "info@johnpaulac.com",
      actions: [
        {
          id: "quote",
          label: "Get a free quote",
          reply:
            "Send your property type, number of units and rough size — we'll come back with a free, honest quote for a new install or replacement within a day.",
        },
        {
          id: "maintenance",
          label: "Book a maintenance visit",
          reply:
            "Maintenance visits run in 2-hour windows across Sharjah and Dubai. Tell us your area and the best time and we'll slot you in.",
        },
        {
          id: "coolguard",
          label: "Check CoolGuard protection",
          reply:
            "CoolGuard covers your AC with priority response, regular checkups and member pricing on repairs. Happy to walk you through it.",
        },
        {
          id: "repair",
          label: "Urgent — not cooling",
          reply:
            "For units not cooling, it's usually diagnosed in one visit. Share the model and the symptom and the technician will arrive with the right parts.",
        },
        {
          id: "commercial",
          label: "Restaurant or warehouse project",
          reply:
            "We design and install for restaurants, warehouses and retail — chilled water, ducted and packaged systems. Share the floor area and we'll schedule a survey.",
        },
      ],
      leadTitle: "Quote captured",
      leadBody:
        "Your {label} enquiry is with the John Paul crew. It's qualified and scheduled — nothing sits in an inbox.",
      routed: "and routed it to the crew.",
      followUp: "The duty technician will follow up with a time slot. Anything else I can help with?",
    },
    formNote:
      "The assistant below opens automatically — see how a quiet enquiry becomes a booked service, with zero manual steps.",
  },
};

export const prospects: ProspectConfig[] = [
  {
    slug: "skm-aircon",
    companyName: "S.K.M. Air Conditioning LLC",
    displayName: "SKM Aircon",
    industry: "hvac",
    established: 1974,
    location: "Sharjah, United Arab Emirates",
    slogan: "You name it.. We cool it.",
    hero: {
      kicker: "Est. 1974 · Sharjah, UAE · One of the Gulf's leading HVAC manufacturers",
      headlineTop: "Gulf-built HVAC,",
      headlineAccent: "engineered to cool",
      headlineBottom: "the region's landmarks.",
      subline:
        "S.K.M designs and manufactures a complete range of commercial and industrial air conditioning — chillers, air handling units, VRF, packaged, condensing and fan coil units — for the world's harshest climates.",
    },
    branding: {
      primaryColor: "#0052FF",
      secondaryColor: "#003DCC",
      accentColor: "#0EA5E9",
      tintColor: "#EAF2FF",
    },
    contact: {
      email: "info@skmaircon.com",
      address:
        "Industrial Area 13, Sheikh Mohammed Bin Zayed Road, Sharjah, United Arab Emirates",
      tollFree: "800 MYSKM",
    },
    socialProof: {
      googleRating: 4.2,
      reviewCount: 525,
      keywords: ["HVAC Equipment Manufacturing", "HVAC Engineering", "Air Conditioning Solutions"],
    },
    certifications: ["AHRI", "TÜV", "UL", "ADQ", "Eurovent", "ISO 9001", "ISO 14001", "OHSAS 18001"],
    markets: [
      "United Arab Emirates",
      "Saudi Arabia",
      "Qatar",
      "Kuwait",
      "Bahrain",
      "Oman",
      "Jordan",
      "Egypt",
      "Iraq",
      "Pakistan",
      "India",
    ],
    facilities: [
      "75,000 m² manufacturing facility · Industrial Area 13, Sharjah",
      "HVAC production plant · 2nd Industrial City, Dammam · Saudi Arabia",
      "Dedicated R&D and testing laboratory",
    ],
    images: {
      factorySharjah: stock.factory,
      factoryDammam: img("/img/content/almessila2.jpg"),
      aerial: stock.cityscape,
      officeBanner: stock.office,
      certifiedRange: stock.building,
    },
    projects: [
      { name: "Infinity Tower", location: "Dubai, UAE", img: stock.building },
      { name: "Al Noor Mosque", location: "Sharjah, UAE", img: stock.building },
      { name: "Bawadi Mall", location: "Al Ain, UAE", img: stock.building },
      { name: "Liwa Hotel", location: "Abu Dhabi, UAE", img: stock.building },
      { name: "United Tower", location: "Kuwait", img: stock.building },
      { name: "Al Mashaaer Al Mugaddasah Metro", location: "Saudi Arabia", img: stock.building },
      { name: "General Post Office", location: "Qatar", img: stock.building },
      { name: "World Trade Centre", location: "Bahrain", img: stock.building },
      { name: "Zauliyah Gas Compression", location: "Oman", img: stock.building },
      { name: "Mecca Mall", location: "Jordan", img: stock.building },
      { name: "Giza North Power Station", location: "Egypt", img: stock.building },
      { name: "Mustansiriya University", location: "Iraq", img: stock.building },
      { name: "Convention Centre", location: "Pakistan", img: stock.building },
      { name: "Deen Dayal Field", location: "India", img: stock.building },
    ],
    services,
    featuredServiceSlug: "air-handling-units",
    designDirection,
    automation: [
      "Enquiry received",
      "AI qualification",
      "Service identified",
      "Lead created",
      "Team notified",
      "Follow-up scheduled",
    ],
    cta: {
      heading: "Let's spec your next project.",
      body: "Send the technical detail behind your next build and the SKM engineering team will respond with product selection, capacity and lead times.",
    },
  },
  johnPaulAc,
  ...sharjahBatch,
  ...transformRawProspects(rawProspectsList),
];

// Deduplicate prospects by slug in case of any duplicate entries
const uniqueProspectsMap = new Map<string, ProspectConfig>();
for (const p of prospects) {
  uniqueProspectsMap.set(p.slug, p);
}
export const allProspects = Array.from(uniqueProspectsMap.values());

export function getProspect(slug: string): ProspectConfig | undefined {
  return uniqueProspectsMap.get(slug) ?? prospects.find((p) => p.slug === slug);
}

export function getService(prospect: ProspectConfig, slug: string): Service | undefined {
  return prospect.services.find((s) => s.slug === slug);
}

export const prospectSlugs = allProspects.map((p) => p.slug);