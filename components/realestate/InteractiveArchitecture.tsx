"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Compass, Sun, Moon, Maximize2, Layers, Eye } from "lucide-react";
import { reStock } from "@/lib/realEstateGenerator";

type StudyMode = "exterior" | "interior" | "schematic";
type TimeOfDay = "dawn" | "midday" | "golden" | "twilight";

interface Hotspot {
  id: string;
  title: string;
  dimension: string;
  description: string;
  top: string;
  left: string;
}

const EXTERIOR_HOTSPOTS: Hotspot[] = [
  {
    id: "cantilever",
    title: "Cantilevered Travertine Terrace",
    dimension: "4.5m Structural Overhang",
    description: "Post-tensioned Roman travertine slab extending weightlessly over the water edge, providing passive solar protection to lower living volumes.",
    top: "38%",
    left: "32%",
  },
  {
    id: "glazing",
    title: "Double-Height Glass Curtain Wall",
    dimension: "6.2m Floor-to-Ceiling Height",
    description: "Motorized triple-glazed acoustic panes engineered with minimal 18mm sightline mullions that recess entirely into perimeter floor pockets.",
    top: "52%",
    left: "58%",
  },
  {
    id: "pool",
    title: "Zero-Edge Sunset Lap Pool",
    dimension: "20.0m × 4.2m Water Surface",
    description: "Black basalt tiled reflection pool aligned with true west to capture the reflection of sunset across the evening horizon.",
    top: "76%",
    left: "48%",
  },
  {
    id: "primary-wing",
    title: "Primary Wing Sanctuary",
    dimension: "1,400 sq ft Independent Suite",
    description: "Acoustically isolated wing decoupled from the main entertaining pavilions, oriented toward private morning garden courtyards.",
    top: "32%",
    left: "74%",
  },
];

const INTERIOR_HOTSPOTS: Hotspot[] = [
  {
    id: "atrium",
    title: "Internal Lightwell Atrium",
    dimension: "Open-Air Sky Opening",
    description: "Brings natural vertical daylight into the heart of the ground-level gallery, anchored by an ancient Mediterranean olive tree.",
    top: "34%",
    left: "46%",
  },
  {
    id: "kitchen",
    title: "Chef's Show Kitchen",
    dimension: "5.4m Monolithic Island",
    description: "Fior di Bosco honed marble waterfall island with seamlessly integrated induction surfaces and concealed back-of-house scullery.",
    top: "62%",
    left: "28%",
  },
  {
    id: "staircase",
    title: "Floating Steel & Teak Staircase",
    dimension: "Suspended Cantilever",
    description: "Sculptural blackened steel spine with open solid teak treads connecting the formal salon to the upper bedroom gallery.",
    top: "44%",
    left: "78%",
  },
];

const TIME_FILTERS: Record<TimeOfDay, { label: string; filter: string; overlay: string }> = {
  dawn: {
    label: "Dawn (06:30)",
    filter: "brightness(0.92) contrast(1.05) saturate(1.1) hue-rotate(-8deg)",
    overlay: "bg-gradient-to-t from-[#B7A17A]/20 via-transparent to-rose-500/10",
  },
  midday: {
    label: "Midday Sun (12:30)",
    filter: "brightness(1.06) contrast(1.02) saturate(1.0)",
    overlay: "bg-transparent",
  },
  golden: {
    label: "Golden Hour (17:45)",
    filter: "brightness(0.95) contrast(1.12) saturate(1.3) sepia(0.2)",
    overlay: "bg-gradient-to-tr from-amber-600/25 via-amber-400/10 to-transparent",
  },
  twilight: {
    label: "Twilight (19:30)",
    filter: "brightness(0.72) contrast(1.22) saturate(1.15) hue-rotate(12deg)",
    overlay: "bg-gradient-to-t from-[#111110]/80 via-[#111110]/30 to-indigo-950/40",
  },
};

export function InteractiveArchitecture({ city = "Prime District" }: { city?: string }) {
  const [mode, setMode] = useState<StudyMode>("exterior");
  const [time, setTime] = useState<TimeOfDay>("golden");
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(EXTERIOR_HOTSPOTS[0]);

  const hotspots = mode === "interior" ? INTERIOR_HOTSPOTS : EXTERIOR_HOTSPOTS;
  const currentImage =
    mode === "interior"
      ? reStock.livingRoom
      : mode === "schematic"
      ? reStock.facade
      : reStock.travertineTerrace;

  return (
    <section id="architecture" className="scroll-mt-24 border-y border-white/10 bg-[#111110] py-20 text-[#F7F4EE] md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B7A17A]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B7A17A]">
                Spatial Study · Architectural Moments
              </p>
            </div>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
              The Anatomy of Modern Architecture
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/60">
              Explore how monolithic materials, light orientation, and cantilevered volumes interact throughout the day.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-full border border-white/15 bg-white/[0.04] p-1 backdrop-blur">
            {[
              { id: "exterior", label: "Exterior Volume" },
              { id: "interior", label: "Interior Light" },
              { id: "schematic", label: "Spatial Plan" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id as StudyMode);
                  if (tab.id === "interior") {
                    setActiveHotspot(INTERIOR_HOTSPOTS[0]);
                  } else {
                    setActiveHotspot(EXTERIOR_HOTSPOTS[0]);
                  }
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  mode === tab.id
                    ? "bg-[#B7A17A] text-[#111110] shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Viewer Canvas */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/15 bg-[#141413] shadow-2xl">
          {/* Main Viewport Container */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black md:aspect-[21/9]">
            {/* Image with Daylight Filter */}
            <div
              className="relative h-full w-full transition-all duration-700 ease-out"
              style={{ filter: TIME_FILTERS[time].filter }}
            >
              <Image
                src={currentImage}
                alt="Architectural Spatial Study"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover transition-transform duration-1000 ease-out"
              />
            </div>

            {/* Ambient Lighting Overlay */}
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${TIME_FILTERS[time].overlay}`}
            />

            {/* Schematic Overlay Grid when in schematic mode */}
            {mode === "schematic" && (
              <div className="pointer-events-none absolute inset-0 bg-blue-950/40 mix-blend-color-dodge backdrop-blur-[2px]">
                <div className="technical-grid-dark absolute inset-0 opacity-40" />
                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3.5 py-1 text-xs font-mono uppercase text-[#B7A17A]">
                  <Compass className="h-3.5 w-3.5" /> True West Axis · Elevation +14.2m
                </div>
              </div>
            )}

            {/* Interactive Pulsing Hotspots */}
            {hotspots.map((spot) => (
              <button
                key={spot.id}
                type="button"
                onClick={() => setActiveHotspot(spot)}
                style={{ top: spot.top, left: spot.left }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                aria-label={spot.title}
              >
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span
                    className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                      activeHotspot?.id === spot.id ? "bg-[#B7A17A]" : "bg-white"
                    }`}
                  />
                  <span
                    className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-white text-[10px] font-bold shadow-md transition-transform group-hover:scale-125 ${
                      activeHotspot?.id === spot.id
                        ? "bg-[#B7A17A] text-[#111110]"
                        : "bg-white/80 text-[#111110]"
                    }`}
                  >
                    +
                  </span>
                </span>
              </button>
            ))}

            {/* Time of Day Control Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/70 px-4 py-3 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                <Sun className="h-3.5 w-3.5 text-[#B7A17A]" />
                <span className="hidden sm:inline">Atmosphere & Daylight:</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                {(["dawn", "midday", "golden", "twilight"] as TimeOfDay[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-all sm:px-3 sm:py-1.5 sm:text-xs ${
                      time === t
                        ? "border border-[#B7A17A] bg-[#B7A17A]/20 text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {t === "dawn" ? "Dawn" : t === "midday" ? "Midday" : t === "golden" ? "Sunset" : "Twilight"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Hotspot Inspector Card */}
          <AnimatePresence mode="wait">
            {activeHotspot && (
              <motion.div
                key={activeHotspot.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25 }}
                className="grid gap-6 border-t border-white/10 p-6 md:grid-cols-[1fr_2fr] md:items-center md:p-8"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B7A17A]">
                    <Layers className="h-3.5 w-3.5" />
                    {activeHotspot.dimension}
                  </div>
                  <h4 className="mt-1 font-serif text-2xl font-medium text-white sm:text-3xl">
                    {activeHotspot.title}
                  </h4>
                </div>

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <p className="text-sm leading-relaxed text-white/70">
                    {activeHotspot.description}
                  </p>
                  <span className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/50">
                    Perspective Verified
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
