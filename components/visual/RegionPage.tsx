"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { ProspectConfig } from "@/lib/types";
import { NICHE_TABS, nicheOf, type NicheKey } from "@/lib/niche";
import { brandImage } from "@/lib/realImages";
import { BrandImage } from "@/components/visual/BrandImage";
import { SearchBar } from "@/components/visual/SearchBar";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { Marquee } from "@/components/fx/Marquee";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface RegionPageProps {
  regionGroups: [string, ProspectConfig[]][];
}

const pad = (n: number) => String(n).padStart(2, "0");

const RESEARCH_CHIP: Record<string, { label: string; bg: string; text: string }> = {
  ready_for_demo: { label: "Verified", bg: "#10B981", text: "#fff" },
  assets_ready: { label: "Assets ready", bg: "#0EA5E9", text: "#fff" },
  research_complete: { label: "Researched", bg: "#14B8A6", text: "#fff" },
  assets_partial: { label: "Partial assets", bg: "#F59E0B", text: "#fff" },
  partially_researched: { label: "Partial data", bg: "#F59E0B", text: "#fff" },
  manual_review_required: { label: "Review needed", bg: "#EF4444", text: "#fff" },
  research_failed: { label: "Research failed", bg: "#EF4444", text: "#fff" },
};

export function RegionPage({ regionGroups }: RegionPageProps) {
  const allProspects = useMemo(
    () => regionGroups.flatMap(([, p]) => p),
    [regionGroups]
  );
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [niche, setNiche] = useState<NicheKey>("all");
  const scopeRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const year = new Date().getFullYear();

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProspects.filter((p) => {
      if (niche !== "all" && nicheOf(p) !== niche) return false;
      if (!q) return true;
      return (
        p.displayName.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q) ||
        p.hero.subline.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    });
  }, [query, niche, allProspects]);

  const nicheCounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = allProspects.filter((p) => {
      if (!q) return true;
      return (
        p.displayName.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q) ||
        p.hero.subline.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    });
    const map = new Map<NicheKey, number>();
    map.set("all", pool.length);
    for (const p of pool) {
      const k = nicheOf(p);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [query, allProspects]);

  const groupedByRegion = useMemo(() => {
    const byRegion = new Map<string, ProspectConfig[]>();
    for (const p of searched) {
      const group = regionGroups.find(([, ps]) => ps.includes(p));
      const key = group?.[0] ?? "Other";
      const list = byRegion.get(key) ?? [];
      list.push(p);
      byRegion.set(key, list);
    }
    return Array.from(byRegion.entries()).sort(
      (a, b) =>
        regionGroups.findIndex(([n]) => n === a[0]) -
        regionGroups.findIndex(([n]) => n === b[0])
    );
  }, [searched, regionGroups]);

  const regionCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const [name, list] of groupedByRegion) map.set(name, list.length);
    return map;
  }, [groupedByRegion]);

  const visibleGroups = useMemo(
    () => groupedByRegion.filter(([name]) => region === "All" || name === region),
    [groupedByRegion, region]
  );

  const regionPills = useMemo(
    () => ["All", ...regionGroups.map(([name]) => name)],
    [regionGroups]
  );

  const stats = useMemo(
    () => [
      { value: String(allProspects.length), label: "Live demos" },
      { value: String(regionGroups.length), label: "Regions" },
      {
        value: String(allProspects.reduce((n, p) => n + p.services.length, 0)),
        label: "Service pages",
      },
    ],
    [allProspects, regionGroups]
  );

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.fromTo(
        ".idx-eyebrow",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
      gsap.fromTo(
        ".idx-line > span",
        { yPercent: 116, rotateX: -12 },
        {
          yPercent: 0,
          rotateX: 0,
          duration: 1.05,
          stagger: 0.09,
          ease: "expo.out",
          delay: 0.1,
        }
      );
      gsap.fromTo(
        ".idx-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 0.55, ease: "power3.out" }
      );
      gsap.fromTo(
        ".idx-stats",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, delay: 0.72, ease: "power2.out" }
      );
      gsap.fromTo(
        ".idx-filters",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.85, ease: "power3.out" }
      );
      gsap.fromTo(
        ".idx-ghost",
        { xPercent: 18 },
        {
          xPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: 0.6 },
        }
      );
    }, scope);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <main ref={scopeRef} className="relative min-h-screen overflow-hidden bg-paper">
      <div className="technical-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="heritage-pattern pointer-events-none absolute inset-0 opacity-[0.3]" aria-hidden />

      {/* Ghost watermark */}
      <div
        className="idx-ghost pointer-events-none absolute right-[-4%] top-3 z-0 hidden select-none font-display font-extrabold uppercase leading-none tracking-tight stroke-text opacity-60 lg:block"
        style={{ fontSize: "clamp(7rem, 17vw, 15rem)" }}
        aria-hidden
      >
        demos
      </div>

      <div className="relative z-10">
        {/* ── Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-5 pb-12 pt-28 md:px-8 lg:pt-36">
            <p className="idx-eyebrow inline-flex items-center gap-2.5 rounded-full glass px-3.5 py-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-[650] uppercase tracking-[0.14em] text-ink-muted">
                Digital Presence Showcase <span className="text-[#C9A86A]">— Edition {year}</span>
              </span>
            </p>

            <h1
              className="mt-6 font-display font-extrabold leading-[0.95] tracking-[-0.038em] text-ink [transform-style:preserve-3d]"
              style={{ fontSize: "clamp(2.6rem, 6.4vw, 5.75rem)" }}
            >
              <span className="idx-line block overflow-hidden">
                <span className="inline-block">Re-imagined digital</span>
              </span>
              <span className="idx-line block -mt-1 overflow-hidden">
                <span className="inline-block font-serif font-light italic tracking-[-0.025em] text-brand-strong">
                  presences for
                </span>
              </span>
              <span className="idx-line block -mt-1 overflow-hidden">
                <span className="gradient-text inline-block">{allProspects.length} brands</span>
              </span>
            </h1>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-8">
              <p className="idx-sub max-w-xl text-balance text-[15.5px] leading-[1.72] text-ink-muted">
                Re-imagined digital presences for manufacturing and engineering brands — every
                demo uses real company data, engineered visuals and a working enquiry flow,
                arranged by location.
              </p>
              <div className="idx-stats flex items-stretch gap-2.5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="group min-w-[104px] rounded-xl border border-line bg-white/90 px-4 py-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_14px_34px_-20px_rgba(10,17,40,0.35)]"
                  >
                    <p className="font-display text-[19px] font-extrabold tabular-nums text-ink transition-colors group-hover:text-brand">
                      <CountUp value={s.value} />
                    </p>
                    <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Filters */}
        <div className="idx-filters relative overflow-hidden border-y border-line/80 bg-white/55 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by industry">
                <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                  Industry
                </span>
                {NICHE_TABS.map((tab) => {
                  const active = niche === tab.key;
                  const count = nicheCounts.get(tab.key) ?? 0;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setNiche(tab.key)}
                      className={
                        active
                          ? "inline-flex items-center gap-2 rounded-full bg-brand-strong px-4 py-2 text-xs font-bold text-white shadow-[0_8px_20px_-10px_rgba(10,17,40,0.6)] transition-all"
                          : "inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-ink-muted transition-all hover:-translate-y-0.5 hover:border-ink/25 hover:text-ink"
                      }
                      data-cursor={active ? undefined : "Filter"}
                    >
                      {tab.label}
                      <span className={active ? "tabular-nums text-white/55" : "tabular-nums text-ink-muted/60"}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter by region">
                <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                  Region
                </span>
                {regionPills.map((r) => {
                  const active = region === r;
                  const count = r === "All" ? searched.length : (regionCounts.get(r) ?? 0);
                  return (
                    <button
                      key={r}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setRegion(r)}
                      className={
                        active
                          ? "inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white shadow-[0_8px_20px_-10px_rgba(10,17,40,0.6)] transition-all"
                          : "inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold text-ink-muted transition-all hover:-translate-y-0.5 hover:border-ink/25 hover:text-ink"
                      }
                      data-cursor={active ? undefined : "Filter"}
                    >
                      {r}
                      <span className={active ? "tabular-nums text-white/55" : "tabular-nums text-ink-muted/60"}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="w-full lg:w-[360px]">
              <SearchBar value={query} onChange={setQuery} />
            </div>
          </div>
        </div>

        {/* ── Region marquee divider */}
        <div className="border-b border-line/70 py-5">
          <Marquee
            speed={46}
            className="font-display text-[1.35rem] font-extrabold uppercase tracking-tight text-ink/[0.3]"
          >
            {[...regionPills.slice(1), "Concept", "Demos", `Edition ${year}`].map((word, i) => (
              <span key={`${word}-${i}`} className="flex items-center">
                <span className="px-5">{word}</span>
                <span className="text-[0.55em] text-[#C9A86A]">✦</span>
              </span>
            ))}
          </Marquee>
        </div>

        {/* ── Regions */}
        {visibleGroups.length === 0 ? (
          <div className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
            <p className="font-display text-2xl font-extrabold text-ink">No demos found</p>
            <p className="mt-2 text-sm text-ink-muted">
              Try a different name, or clear the search and region filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setRegion("All");
                setNiche("all");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand"
              data-cursor="Reset"
            >
              Reset filters
            </button>
          </div>
        ) : (
          visibleGroups.map(([name, prospects], gi) => (
            <section key={name} className="mx-auto max-w-7xl px-5 pb-20 pt-16 md:px-8 lg:pt-20">
              <div className="flex items-end justify-between border-b border-line pb-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl font-extrabold tabular-nums text-ink/[0.12]">
                    {pad(gi + 1)}
                  </span>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                    {name}
                  </h2>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                  {prospects.length} {prospects.length === 1 ? "demo" : "demos"}
                </span>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-8">
                {prospects.map((prospect, i) => {
                  const hubFallback =
                    prospect.images.aerial ?? prospect.images.factorySharjah;
                  const hubSrc =
                    brandImage(prospect.slug, "aerial") ?? hubFallback;
                  return (
                    <Reveal key={prospect.slug} delay={(i % 4) * 0.06} y={34} className="h-full">
                      <Link
                        href={`/${prospect.slug}`}
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_50px_-30px_rgba(10,17,40,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:border-ink/20 hover:shadow-[0_34px_80px_-32px_rgba(10,17,40,0.45)]"
                        data-cursor="Explore"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-gradient-to-br from-brand-tint via-white to-white">
                          <BrandImage
                            src={hubSrc}
                            fallback={hubFallback}
                            alt={`${prospect.companyName} — ${prospect.hero.subline}`}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          {prospect.researchSummary &&
                            RESEARCH_CHIP[prospect.researchSummary.status as string] &&
                            (() => {
                              const chip = RESEARCH_CHIP[prospect.researchSummary.status as string];
                              return (
                                <span
                                  className="pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm"
                                  style={{ backgroundColor: chip.bg, color: chip.text }}
                                  title={`Research status: ${prospect.researchSummary.status} — ${prospect.researchSummary.assetsRendered} real assets rendered`}
                                >
                                  {chip.label}
                                </span>
                              );
                            })()}
                          <span className="pointer-events-none absolute bottom-3 right-4 select-none font-display text-5xl font-extrabold leading-none text-white/15 transition-colors duration-500 group-hover:text-white/40">
                            {pad(i + 1)}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-extrabold text-white transition-transform duration-300 group-hover:-rotate-6"
                                style={{ backgroundColor: prospect.branding.primaryColor }}
                              >
                                {prospect.displayName.slice(0, 3).toUpperCase()}
                              </span>
                              <span className="truncate font-display text-lg font-extrabold tracking-tight text-ink">
                                {prospect.displayName}
                              </span>
                            </div>
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-ink-muted line-clamp-2">
                            {prospect.hero.subline}
                          </p>
                          <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-strong">
                            Open live demo
                            <span className="h-px w-8 origin-left bg-current opacity-50 transition-transform duration-500 ease-out group-hover:scale-x-[1.6]" />
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ))
        )}

        {/* ── Closing strip */}
        <footer className="border-t border-line bg-white/60">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-5 py-8 sm:flex-row sm:items-center md:px-8">
            <p className="text-xs text-ink-muted">
              © {year} Concept Demos. Every site below is a demonstration built from real
              company data.
            </p>
            <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-ink" data-cursor="Top">
              Back to top ↑
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}