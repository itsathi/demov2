import { useEffect, useLayoutEffect } from "react";

/**
 * One motion vocabulary for the whole demo platform.
 *
 * Every reveal, transition and scrub shares these tokens so the choreography
 * reads as if a single director paced it — instead of each section inventing
 * its own easing. GSAP accepts these strings/functions directly.
 */

/** Signature eases — the "voice" of the platform. */
export const EASE = {
  /** Entrances. Confident, decisive settle. */
  out: "power3.out",
  /** Gentle entrances for dense or secondary content. */
  soft: "power2.out",
  /** Hero headlines. Expansive, with a touch of theatre. */
  expo: "expo.out",
  /** Large media / masks. Heavy and deliberate. */
  cine: "power4.inOut",
  /** Scrub-driven travel. Must be linear so distance maps to scroll 1:1. */
  scrub: "none",
  /** Micro-interactions. Slight overshoot. */
  spring: "back.out(1.6)",
} as const;

/** A shared duration scale (seconds) keeps pacing consistent. */
export const DUR = {
  micro: 0.28,
  fast: 0.5,
  base: 0.9,
  slow: 1.2,
  cine: 1.5,
} as const;

/** Stagger rhythm used across grids, lists and stat rows. */
export const STAGGER = {
  tight: 0.05,
  base: 0.08,
  loose: 0.12,
} as const;

/** Default scroll-reveal start so sections enter at a consistent point. */
export const REVEAL_START = "top 85%";

/**
 * `useLayoutEffect` warns on the server; this picks the safe variant so
 * scroll setup never flashes unstyled content during hydration.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
