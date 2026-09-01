"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { BrandImage } from "@/components/visual/BrandImage";
import { projectImage } from "@/lib/realImages";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function ProjectRail({ prospect }: { prospect: ProspectConfig }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const t = getTemplates(prospect);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reduced) return;
    if (window.innerWidth < 1024) return;

    const getScrollAmount = () => track.scrollWidth - window.innerWidth + 64;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      tl.to(track, { x: () => -getScrollAmount() });

      // Per-card depth: images travel slower than their frames
      tl.fromTo(
        ".rail-img",
        { yPercent: -10 },
        { yPercent: 10, ease: "none" },
        0
      );

      // Progress hairline draws across the pinned section
      tl.fromTo(
        ".rail-progress",
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: "left 50%", ease: "none" },
        0
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} id="projects" className="relative overflow-hidden bg-ink text-white">
      <div className="technical-grid-dark absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 md:px-8 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-strong" style={{ color: "#7aa2ff" }}>
                {t.projectsIntro.kicker}
              </p>
            </Reveal>
            <SplitLines
              text={t.projectsIntro.headline}
              className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">{t.projectsIntro.body}</p>
          </Reveal>
        </div>

        {/* Progress hairline */}
        <div className="mt-8 h-px w-full bg-white/10">
          <div className="rail-progress h-full w-full bg-brand-strong" style={{ background: "#7aa2ff", transform: "scaleX(0)" }} />
        </div>
      </div>

      <div className="mt-8 h-[76vh] max-lg:h-auto">
        <div
          ref={trackRef}
          className="no-scrollbar flex w-max max-lg:w-full max-lg:overflow-x-auto max-lg:snap-x max-lg:snap-mandatory max-lg:px-5 gap-5 px-5 lg:gap-8 lg:px-8"
        >
          {prospect.projects.map((project, i) => (
            <article
              key={project.name}
              className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors duration-500 hover:border-white/25 sm:w-[430px] max-lg:shadow-2xl"
              data-cursor="View"
            >
              <span
                className="pointer-events-none absolute -right-2 -top-5 z-10 select-none font-display text-[6.5rem] font-extrabold leading-none text-white/[0.06] transition-colors duration-500 group-hover:text-brand/80"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                <div className="rail-img absolute inset-0 will-change-transform">
                  <BrandImage
                    src={projectImage(prospect.slug, i) ?? project.img}
                    fallback={project.img}
                    alt={`${project.name} — HVAC project by ${prospect.displayName}`}
                    fill
                    sizes="(max-width: 1024px) 430px, 62vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur">
                  {project.location.split(",")[0]}
                </span>
                <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-white/0 transition-all duration-300 group-hover:text-white" />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{project.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/55">
                    <MapPin className="h-3.5 w-3.5 text-brand" />
                    {project.location}
                  </p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-all group-hover:border-brand group-hover:bg-brand">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="relative mx-auto max-w-7xl px-5 pb-16 text-center text-xs font-medium text-white/45 lg:pb-20 lg:px-8">
        {t.projectsIntro.footer}
      </p>
    </section>
  );
}