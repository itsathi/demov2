import type { CSSProperties } from "react";
import type { Branding, RealEstateDesignDirection } from "./types";

/**
 * Per-direction art direction for real-estate demos. Rather than a parallel
 * token system, each direction re-maps the platform's existing CSS variables
 * (`--paper`, `--ink`, `--line`, …) so every shared component — Navbar,
 * Footer, motion primitives — inherits the correct look automatically.
 */
type Palette = {
  paper: string;
  card: string;
  ink: string;
  inkMuted: string;
  line: string;
  accent: string;
  /** Serif display fonts read as "premium"; a few directions stay geometric. */
  displaySerif: boolean;
};

const PALETTES: Record<RealEstateDesignDirection, Palette> = {
  luxury: {
    paper: "#f7f4ee",
    card: "#fffdf9",
    ink: "#16130d",
    inkMuted: "#6d6354",
    line: "#e7dfcf",
    accent: "#b0895a",
    displaySerif: true,
  },
  contemporary: {
    paper: "#f4f5f6",
    card: "#ffffff",
    ink: "#0b0d10",
    inkMuted: "#5c6571",
    line: "#e4e7ea",
    accent: "#111827",
    displaySerif: false,
  },
  development: {
    paper: "#f4f6f9",
    card: "#ffffff",
    ink: "#0a1128",
    inkMuted: "#5a6a85",
    line: "#e2e8f0",
    accent: "#0f766e",
    displaySerif: false,
  },
  investment: {
    paper: "#f2f4f5",
    card: "#ffffff",
    ink: "#0b1220",
    inkMuted: "#59636f",
    line: "#e1e6ea",
    accent: "#0f766e",
    displaySerif: true,
  },
};

export function getRealEstatePalette(
  direction: RealEstateDesignDirection
): Palette {
  return PALETTES[direction] ?? PALETTES.contemporary;
}

/**
 * Returns the CSS-variable overrides for a real-estate prospect. Layered after
 * the brand colour variables in the prospect layout so it never clobbers the
 * prospect's own primary/secondary colours.
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
  } as CSSProperties;
}
