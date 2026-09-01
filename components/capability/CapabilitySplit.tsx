"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Factory, FlaskConical, Award, Shield, Handshake, Users, Wrench } from "lucide-react";
import { AnimatedSvg } from "@/components/visual/AnimatedSvg";
import { BrandImage } from "@/components/visual/BrandImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { CountUp } from "@/components/motion/CountUp";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { getTemplates } from "@/lib/prospect";
import { brandImage } from "@/lib/realImages";
import type { ProspectConfig } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const CAP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  factory: Factory,
  rnd: FlaskConical,
  award: Award,
  shield: Shield,
  handshake: Handshake,
  users: Users,
  wrench: Wrench,
};

export function CapabilitySplit({ prospect }: { prospect: ProspectConfig }) {
  const bandRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const t = getTemplates(prospect);

  useLayoutEffect(() => {
    const band = bandRef.current;
    const media = mediaRef.current;
    if (!band || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cap-image",
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
      gsap.fromTo(
        ".cap-glow",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: band, start: "top 65%", once: true } }
      );
      gsap.fromTo(
        ".cap-ghost",
        { xPercent: 20 },
        {
          xPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
      if (media) {
        gsap.fromTo(
          media,
          { clipPath: "inset(0% 0% 12% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: media, start: "top 82%", once: true },
          }
        );
      }
    }, [band, media]);
    return () => ctx.revert();
  }, [reduced]);

  const home = `/${prospect.slug}`;
  const bandImage =
    t.capability.bandImageKey && prospect.images[t.capability.bandImageKey]
      ? prospect.images[t.capability.bandImageKey]
      : prospect.images.factorySharjah;
  const mediaImage =
    t.capability.mediaImageKey && prospect.images[t.capability.mediaImageKey]
      ? prospect.images[t.capability.mediaImageKey]
      : undefined;

  return (
    <>
      <section id="capability" className="relative overflow-hidden bg-paper py-20 lg:py-28">
        {/* Ghost watermark */}
        <div className="cap-ghost pointer-events-none absolute -right-6 top-10 z-0 hidden select-none font-display text-display-huge font-extrabold uppercase tracking-tight text-ink/[0.05] lg:block" aria-hidden>
          {t.capability.kicker}
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">{t.capability.kicker}</p>
              <SplitLines text={t.capability.headline} className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-ink-muted">{t.capability.body}</p>
            </Reveal>

            <Reveal delay={0.16} className="mt-8 space-y-4">
              {t.capability.points.map((pt) => {
                const Icon = CAP_ICONS[pt.icon] ?? Factory;
                return (
                  <div key={pt.text} className="group flex items-start gap-4 rounded-xl border border-line bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_18px_40px_-24px_rgba(10,17,40,0.35)]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand transition-transform duration-300 group-hover:rotate-6">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="pt-1 text-sm font-semibold leading-relaxed text-ink">{pt.text}</p>
                  </div>
                );
              })}
            </Reveal>

            <Reveal delay={0.2}>
              <div className={`mt-8 grid grid-cols-2 gap-4 ${t.capability.stats.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
                {t.capability.stats.map((c) => (
                  <div
                    key={c.value}
                    className="group rounded-xl border border-line bg-white p-4 text-center transition-colors duration-300 hover:border-brand/30"
                  >
                    <p className="font-display text-lg font-extrabold tabular-nums text-ink transition-colors group-hover:text-brand">
                      <CountUp value={c.value} />
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-ink-muted">{c.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <div ref={mediaRef} className="cap-media relative aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-white/80 shadow-[0_40px_80px_-30px_rgba(10,17,40,0.25)]">
                <span className="absolute left-4 top-4 z-10 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  {t.capability.kicker}
                </span>
                {t.capability.showSvg && t.capability.svg ? (
                  <AnimatedSvg src={t.capability.svg} playOn="scroll" className="aspect-[16/9] w-full" />
                ) : mediaImage ? (
                  <BrandImage
                    src={brandImage(prospect.slug, t.capability.mediaImageKey) ?? mediaImage}
                    fallback={mediaImage}
                    alt={`${prospect.companyName} — ${t.capability.kicker.toLowerCase()}`}
                    fill
                    sizes="800px"
                    className="object-cover"
                  />
                ) : (
                  <AnimatedSvg src="Thermal Energy Exchange.svg" playOn="scroll" className="aspect-[16/9] w-full" />
                )}
              </div>
              <Link
                href={`${home}/services`}
                className="group absolute -bottom-5 right-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-ink/25 transition-colors hover:bg-brand"
                data-cursor="Open"
              >
                {t.capability.ctaLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative h-[56vh] min-h-[400px] overflow-hidden">
        <div ref={bandRef} className="absolute inset-0">
          <BrandImage
            src={brandImage(prospect.slug, t.capability.bandImageKey) ?? bandImage}
            fallback={bandImage}
            alt={`${prospect.companyName} — ${t.capability.kicker.toLowerCase()}`}
            fill
            sizes="100vw"
            className="cap-image object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
          <div className="technical-grid-dark absolute inset-0 opacity-30" aria-hidden />
          <div className="cap-ghost pointer-events-none absolute -bottom-4 right-0 select-none font-display text-display-huge font-extrabold uppercase tracking-tight stroke-text-light" aria-hidden>
            {t.capability.headline.split(" ")[0]}
          </div>
        </div>
        <div className="cap-glow absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/80">
                  <ArrowUpRight className="h-4 w-4" /> {t.capability.bandKicker}
                </p>
                <SplitLines text={t.capability.bandHeadline} className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl" />
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-white/75">{t.capability.bandBody}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}