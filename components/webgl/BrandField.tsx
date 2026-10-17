"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import type { BrandFieldTone, BrandFieldVariant } from "./BrandFieldCanvas";

const BrandFieldCanvas = dynamic(
  () => import("./BrandFieldCanvas").then((m) => m.BrandFieldCanvas),
  { ssr: false }
);

type Props = {
  variant: BrandFieldVariant;
  tone?: BrandFieldTone;
  primary: string;
  accent: string;
  /** Static gradient shown before/without WebGL. Always rendered underneath. */
  fallbackClassName?: string;
  className?: string;
};

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

let cached: boolean | null = null;

/**
 * Only devices that can afford the scene get one: WebGL available, motion not
 * reduced, no Save-Data, and a reasonable core count. Computed once per session.
 */
function canRenderField() {
  if (cached !== null) return cached;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  const cores = navigator.hardwareConcurrency ?? 8;
  cached = !(reduced || nav.connection?.saveData || cores < 4 || !supportsWebGL());
  return cached;
}

const subscribe = () => () => {};

/**
 * Progressive-enhancement gate for the shared WebGL backplate.
 *
 * Renders a zero-cost branded gradient immediately (server + first paint), then
 * upgrades to the `three` scene only when the device qualifies. The heavy
 * `three` chunk never loads on devices that won't render it.
 */
export function BrandField({
  variant,
  tone = "dark",
  primary,
  accent,
  fallbackClassName,
  className,
}: Props) {
  const enhanced = useSyncExternalStore(subscribe, canRenderField, () => false);

  return (
    <div className={cn("relative", className)} aria-hidden>
      <div
        className={cn("absolute inset-0", fallbackClassName)}
        style={{
          background:
            tone === "dark"
              ? `radial-gradient(120% 90% at 75% 15%, ${accent}33 0%, transparent 55%), radial-gradient(90% 80% at 10% 90%, ${primary}2e 0%, transparent 60%)`
              : `radial-gradient(120% 90% at 80% 0%, ${accent}22 0%, transparent 55%), radial-gradient(90% 80% at 0% 100%, ${primary}1f 0%, transparent 60%)`,
        }}
      />
      {enhanced ? (
        <BrandFieldCanvas
          variant={variant}
          tone={tone}
          primary={primary}
          accent={accent}
          className="brand-field-canvas absolute inset-0"
        />
      ) : null}
    </div>
  );
}
