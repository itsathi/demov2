import type { DemoRecipe, DemoTheme, IndustryFamily } from "./types";

const SANS = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";
const GROTESK = "var(--font-manrope), ui-sans-serif, system-ui, sans-serif";
const SERIF = "var(--font-playfair), Georgia, 'Times New Roman', serif";

type ThemeSeed = Omit<DemoTheme, "key">;

const LIGHT: ThemeSeed = {
  mode: "light",
  paper: "#f7f5f0",
  card: "#ffffff",
  ink: "#14161a",
  inkMuted: "#5c6169",
  line: "#e2ded6",
  brand: "#1f3a5f",
  brandStrong: "#162942",
  brandTint: "#e9eef5",
  accent: "#b08d57",
  displayFont: SERIF,
  bodyFont: SANS,
  radius: "3px",
  eyebrow: "letter-spacing:0.24em",
  artDirection: "Warm editorial",
};

/** Industry art direction. Palettes are deliberately restrained; each family
 * gets its own typographic voice instead of a generic gradient treatment. */
const THEMES: Record<IndustryFamily, ThemeSeed> = {
  real_estate: {
    ...LIGHT,
    paper: "#f5f1e8",
    card: "#fffdf8",
    ink: "#171512",
    inkMuted: "#6b645a",
    line: "#ded6c8",
    brand: "#1e3a34",
    brandStrong: "#142a26",
    brandTint: "#e7ece7",
    accent: "#b08d57",
    displayFont: SERIF,
    radius: "2px",
    artDirection: "Quiet luxury · editorial serif · travertine neutrals",
  },
  interior: {
    ...LIGHT,
    paper: "#f3f1eb",
    card: "#fbfaf6",
    ink: "#1b1a17",
    inkMuted: "#6f6a60",
    line: "#ddd8cc",
    brand: "#3c4a3f",
    brandStrong: "#28332b",
    brandTint: "#e8ece6",
    accent: "#a9835a",
    displayFont: SERIF,
    radius: "0px",
    artDirection: "Gallery-led · sage and sand · hairline rules",
  },
  hvac: {
    ...LIGHT,
    mode: "dark",
    paper: "#0b1219",
    card: "#111b24",
    ink: "#f2f6f8",
    inkMuted: "#9fb0bd",
    line: "#22313d",
    brand: "#19a7c4",
    brandStrong: "#0f7f97",
    brandTint: "#102a33",
    accent: "#f2b544",
    displayFont: GROTESK,
    radius: "16px",
    artDirection: "Cool technical · deep navy · electric cyan",
  },
  facilities: {
    ...LIGHT,
    paper: "#f4f6f5",
    card: "#ffffff",
    ink: "#13201c",
    inkMuted: "#5b6b65",
    line: "#dce3df",
    brand: "#0f5b4c",
    brandStrong: "#0a4036",
    brandTint: "#e4efea",
    accent: "#c8d94a",
    displayFont: GROTESK,
    radius: "8px",
    artDirection: "Operational clarity · deep green · chartreuse signal",
  },
  construction: {
    ...LIGHT,
    mode: "dark",
    paper: "#141312",
    card: "#1c1a18",
    ink: "#f4f1ea",
    inkMuted: "#a9a49a",
    line: "#312d28",
    brand: "#e0662a",
    brandStrong: "#b84e1c",
    brandTint: "#2a211b",
    accent: "#d8b24a",
    displayFont: GROTESK,
    radius: "2px",
    artDirection: "Concrete and steel · safety orange · heavy grotesk",
  },
  manufacturing: {
    ...LIGHT,
    paper: "#f3f4f5",
    card: "#ffffff",
    ink: "#121820",
    inkMuted: "#59636e",
    line: "#d9dee3",
    brand: "#1d4e74",
    brandStrong: "#143a57",
    brandTint: "#e6eef4",
    accent: "#d97b2b",
    displayFont: GROTESK,
    radius: "4px",
    artDirection: "Precision industrial · steel blue · amber spec accents",
  },
  home_services: {
    ...LIGHT,
    paper: "#f7f6f3",
    card: "#ffffff",
    ink: "#181b1e",
    inkMuted: "#606870",
    line: "#e0dfda",
    brand: "#1d5fa8",
    brandStrong: "#154777",
    brandTint: "#e8f0f9",
    accent: "#e8892b",
    displayFont: GROTESK,
    radius: "12px",
    artDirection: "Approachable trade · clean blue · warm orange",
  },
  professional: {
    ...LIGHT,
    paper: "#f4f3ee",
    card: "#fffefb",
    ink: "#161a18",
    inkMuted: "#5f6662",
    line: "#deddd5",
    brand: "#243b32",
    brandStrong: "#182a23",
    brandTint: "#e9ece7",
    accent: "#b58a4a",
    displayFont: SERIF,
    radius: "2px",
    artDirection: "Considered advisory · forest and cream",
  },
  healthcare: {
    ...LIGHT,
    paper: "#f4f7f7",
    card: "#ffffff",
    ink: "#14201f",
    inkMuted: "#5b6b69",
    line: "#dbe5e3",
    brand: "#0f6b63",
    brandStrong: "#0a4c46",
    brandTint: "#e3f0ed",
    accent: "#79b6a8",
    displayFont: GROTESK,
    radius: "14px",
    artDirection: "Calm clinical · teal and white",
  },
  education: {
    ...LIGHT,
    paper: "#f6f3ec",
    card: "#fffdf8",
    ink: "#191814",
    inkMuted: "#66625a",
    line: "#e1dcd0",
    brand: "#233f66",
    brandStrong: "#172c48",
    brandTint: "#e8edf4",
    accent: "#c09a4a",
    displayFont: SERIF,
    radius: "3px",
    artDirection: "Academic heritage · navy and parchment",
  },
  hospitality: {
    ...LIGHT,
    mode: "dark",
    paper: "#141210",
    card: "#1d1a17",
    ink: "#f6f1e8",
    inkMuted: "#b0a79a",
    line: "#332e28",
    brand: "#c8a06a",
    brandStrong: "#a37c47",
    brandTint: "#2a241d",
    accent: "#e6c894",
    displayFont: SERIF,
    radius: "4px",
    artDirection: "Warm hospitality · candlelit neutrals",
  },
  retail: {
    ...LIGHT,
    paper: "#f6f4f1",
    card: "#ffffff",
    ink: "#171615",
    inkMuted: "#64605b",
    line: "#e2ddd6",
    brand: "#1f1d1b",
    brandStrong: "#0f0e0d",
    brandTint: "#ece8e2",
    accent: "#c2543c",
    displayFont: GROTESK,
    radius: "6px",
    artDirection: "Editorial retail · near-black and terracotta",
  },
  other: {
    ...LIGHT,
    displayFont: GROTESK,
    artDirection: "Neutral editorial",
  },
};

const HEX = /^#[0-9a-f]{6}$/i;

function safeHex(value: string | undefined | null): string | null {
  return value && HEX.test(value) ? value : null;
}

/** Mix two hex colours (0..1 weight on `a`). */
function mix(a: string, b: string, weight = 0.5): string {
  const pa = a.replace("#", "");
  const pb = b.replace("#", "");
  const na = parseInt(pa, 16);
  const nb = parseInt(pb, 16);
  const ch = (shift: number) => {
    const va = (na >> shift) & 255;
    const vb = (nb >> shift) & 255;
    return Math.round(va * weight + vb * (1 - weight));
  };
  return `#${[ch(16), ch(8), ch(0)].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

export function themeForFamily(family: IndustryFamily): DemoTheme {
  const seed = THEMES[family] ?? THEMES.other;
  return { ...seed, key: family };
}

export type ThemeOverrides = {
  primary?: string | null;
  secondary?: string | null;
  accent?: string | null;
  tint?: string | null;
};

/**
 * Resolve the final theme. Research colours win because they are sampled from
 * the company's live site; CRM colours are only used when they are not the
 * platform's generic default (#0052FF) and no research colour exists.
 */
export function resolveTheme(
  family: IndustryFamily,
  researchColors?: ThemeOverrides | null,
  crmPrimary?: string | null
): DemoTheme {
  const base = themeForFamily(family);
  const primary =
    safeHex(researchColors?.primary) ??
    (crmPrimary && crmPrimary.toLowerCase() !== "#0052ff" ? safeHex(crmPrimary) : null);
  if (!primary) return base;

  const secondary = safeHex(researchColors?.secondary) ?? mix(primary, "#000000", 0.78);
  const accent = safeHex(researchColors?.accent) ?? base.accent;
  const tint =
    safeHex(researchColors?.tint) ??
    mix(primary, base.mode === "dark" ? "#0b1219" : "#ffffff", 0.12);

  return {
    ...base,
    brand: primary,
    brandStrong: secondary,
    brandTint: tint,
    accent,
  };
}

/* ------------------------------------------------------------------ */
/* Recipes                                                             */
/* ------------------------------------------------------------------ */

const RECIPES: Record<IndustryFamily, DemoRecipe> = {
  real_estate: {
    heroVariant: "editorial",
    sections: ["trust", "statement", "services", "areas", "process", "gallery", "contact"],
    servicesLabel: "How we help",
    servicesTitle: "Property services, end to end.",
    areasLabel: "Where we work",
    processTitle: "A considered process",
  },
  interior: {
    heroVariant: "fullbleed",
    sections: ["statement", "gallery", "services", "areas", "contact"],
    servicesLabel: "Studio services",
    servicesTitle: "Design services, start to finish.",
    areasLabel: "Projects & service area",
    processTitle: "From brief to handover",
  },
  hvac: {
    heroVariant: "split",
    sections: ["trust", "services", "process", "areas", "gallery", "contact"],
    servicesLabel: "Systems & services",
    servicesTitle: "Systems, installed and maintained.",
    areasLabel: "Service areas",
    processTitle: "How a job runs",
  },
  facilities: {
    heroVariant: "split",
    sections: ["trust", "services", "statement", "process", "areas", "contact"],
    servicesLabel: "Capabilities",
    servicesTitle: "Capabilities built around your building.",
    areasLabel: "Coverage",
    processTitle: "How we operate",
  },
  construction: {
    heroVariant: "fullbleed",
    sections: ["statement", "services", "process", "gallery", "areas", "contact"],
    servicesLabel: "What we build",
    servicesTitle: "What we build.",
    areasLabel: "Where we build",
    processTitle: "From ground to handover",
  },
  manufacturing: {
    heroVariant: "split",
    sections: ["trust", "services", "statement", "process", "areas", "contact"],
    servicesLabel: "Products & solutions",
    servicesTitle: "Products and support.",
    areasLabel: "Supply coverage",
    processTitle: "Specification to delivery",
  },
  home_services: {
    heroVariant: "split",
    sections: ["trust", "services", "process", "areas", "contact"],
    servicesLabel: "What we do",
    servicesTitle: "Work we take on.",
    areasLabel: "Areas covered",
    processTitle: "How we work",
  },
  professional: {
    heroVariant: "editorial",
    sections: ["trust", "statement", "services", "process", "areas", "contact"],
    servicesLabel: "Expertise",
    servicesTitle: "How we can help.",
    areasLabel: "Where we advise",
    processTitle: "How we engage",
  },
  healthcare: {
    heroVariant: "split",
    sections: ["trust", "services", "statement", "process", "areas", "contact"],
    servicesLabel: "Care & services",
    servicesTitle: "Care and services.",
    areasLabel: "Locations",
    processTitle: "What to expect",
  },
  education: {
    heroVariant: "editorial",
    sections: ["statement", "services", "process", "areas", "contact"],
    servicesLabel: "Programmes",
    servicesTitle: "Programmes and support.",
    areasLabel: "Campus & community",
    processTitle: "How to apply",
  },
  hospitality: {
    heroVariant: "fullbleed",
    sections: ["statement", "services", "gallery", "areas", "contact"],
    servicesLabel: "Experience",
    servicesTitle: "Experience and services.",
    areasLabel: "Find us",
    processTitle: "Your visit",
  },
  retail: {
    heroVariant: "fullbleed",
    sections: ["statement", "services", "gallery", "areas", "contact"],
    servicesLabel: "Collection & services",
    servicesTitle: "Collections and services.",
    areasLabel: "Visit",
    processTitle: "How it works",
  },
  other: {
    heroVariant: "minimal",
    sections: ["statement", "services", "process", "areas", "contact"],
    servicesLabel: "Services",
    servicesTitle: "What we do.",
    areasLabel: "Coverage",
    processTitle: "How we work",
  },
};

export function recipeForFamily(family: IndustryFamily): DemoRecipe {
  return RECIPES[family] ?? RECIPES.other;
}
