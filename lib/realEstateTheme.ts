import type { CSSProperties } from "react";
import type { Branding, RealEstateDesignDirection } from "./types";

/**
 * Dedicated quiet-luxury design system for real estate.
 *
 * Implements the design target:
 * Obsidian + Warm Ivory + Soft Stone + Muted Taupe + Champagne / Brass accents.
 * Provides fine hairlines, editorial typography tokens, and restrained glassmorphic surfaces.
 */
export type RealEstatePalette = {
  paper: string;
  card: string;
  ink: string;
  inkMuted: string;
  line: string;
  accent: string;
  obsidian: string;
  warmIvory: string;
  stone: string;
  taupe: string;
  brass: string;
  brassLight: string;
  displaySerif: boolean;
};

const PALETTES: Record<RealEstateDesignDirection, RealEstatePalette> = {
  luxury: {
    paper: "#F7F4EE",
    card: "#FFFFFF",
    ink: "#111110",
    inkMuted: "#6B655C",
    line: "#E6DFC8",
    accent: "#B7A17A",
    obsidian: "#111110",
    warmIvory: "#F7F4EE",
    stone: "#D8D0C4",
    taupe: "#8C8174",
    brass: "#B7A17A",
    brassLight: "#D6C3A1",
    displaySerif: true,
  },
  contemporary: {
    paper: "#F5F3EF",
    card: "#FFFFFF",
    ink: "#121417",
    inkMuted: "#635D52",
    line: "#E5E0D6",
    accent: "#A68A56",
    obsidian: "#121417",
    warmIvory: "#F5F3EF",
    stone: "#D4CDC2",
    taupe: "#7D7569",
    brass: "#B09668",
    brassLight: "#D1BF9B",
    displaySerif: true,
  },
  development: {
    paper: "#F5F1E8",
    card: "#FFFFFF",
    ink: "#141413",
    inkMuted: "#666157",
    line: "#E4DDCF",
    accent: "#B59663",
    obsidian: "#141413",
    warmIvory: "#F5F1E8",
    stone: "#D8CEBE",
    taupe: "#857A6C",
    brass: "#B59663",
    brassLight: "#D4BC90",
    displaySerif: true,
  },
  investment: {
    paper: "#F4F0E8",
    card: "#FFFFFF",
    ink: "#111413",
    inkMuted: "#615C52",
    line: "#E3DBD0",
    accent: "#A88D58",
    obsidian: "#111413",
    warmIvory: "#F4F0E8",
    stone: "#D5CCBC",
    taupe: "#807667",
    brass: "#A88D58",
    brassLight: "#CAB587",
    displaySerif: true,
  },
};

export function getRealEstatePalette(
  direction: RealEstateDesignDirection
): RealEstatePalette {
  return PALETTES[direction] ?? PALETTES.luxury;
}

/**
 * Returns the CSS-variable overrides for a real-estate prospect.
 * Remaps `--paper`, `--card`, `--ink`, `--line`, and injects custom luxury variables.
 */
export function realEstateThemeVars(
  direction: RealEstateDesignDirection,
  branding: Branding
): CSSProperties {
  const p = getRealEstatePalette(direction);
  return {
    "--paper": p.paper,
    "--card": p.card,
    "--ink": p.ink,
    "--ink-muted": p.inkMuted,
    "--line": p.line,
    "--accent": branding.accentColor || p.accent,
    "--re-obsidian": p.obsidian,
    "--re-warm-ivory": p.warmIvory,
    "--re-stone": p.stone,
    "--re-taupe": p.taupe,
    "--re-brass": p.brass,
    "--re-brass-light": p.brassLight,
    "--re-border": "rgba(216, 208, 196, 0.4)",
    "--re-border-dark": "rgba(255, 255, 255, 0.12)",
    "--re-glass-surface": "rgba(255, 255, 255, 0.08)",
    "--re-glass-border": "rgba(255, 255, 255, 0.14)",
  } as CSSProperties;
}
