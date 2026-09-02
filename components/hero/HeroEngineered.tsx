"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ArrowRight,
  Star,
  Phone,
  Check,
  Award,
  MapPin,
  Sparkles,
  ShieldCheck,
  Wrench,
  Ruler,
  Clock,
} from "lucide-react";
import { AnimatedSvg } from "@/components/visual/AnimatedSvg";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { Magnetic } from "@/components/motion/Magnetic";
import { CountUp } from "@/components/motion/CountUp";
import { READY_EVENT } from "@/components/fx/FxStage";
import { BrandImage } from "@/components/visual/BrandImage";
import { getTemplates } from "@/lib/prospect";
import { brandImage } from "@/lib/realImages";
import type { ProspectConfig } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function HeroEngineered({ prospect }: { prospect: ProspectConfig }) {
  const scope = useRef<HTMLElement | null>(null);
  const imageCanvas = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const t = getTemplates(prospect);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    let ctx: gsap.Context | undefined;

    const start = () => {
      if (ctx) return;
      ctx = gsap.context(() => {
        if (reduced) return;

        gsap.fromTo(
          ".hero-eyebrow",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", delay: 0.1 }
        );
        gsap.fromTo(
          ".hero-line > span",
          { yPercent: 120, rotateX: -14, opacity: 0 },
          { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "expo.out", delay: 0.2 }
        );
        gsap.fromTo(
          ".hero-sub",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: "power3.out", stagger: 0.05 }
        );
        gsap.fromTo(
          ".hero-cta",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.5, ease: "power3.out" }
        );
        gsap.fromTo(
          ".hero-stats > div",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, delay: 0.68, ease: "power2.out" }
        );
        gsap.fromTo(
          ".hero-card-float",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, delay: 0.9, ease: "power3.out", stagger: 0.1 }
        );

        // Framed image — parallax settle + scroll depth
        if (imageCanvas.current) {
          gsap.fromTo(".hero-image-canvas", { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.8 } });
          gsap.fromTo(".hero-image-inner img", { scale: 1.05 }, { scale: 1.12, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 1.05 } });
        }

        gsap.fromTo(
          ".hero-ghost",
          { xPercent: 6 },
          { xPercent: -8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } }
        );
        gsap.to(".hero-glow", { yPercent: -8, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.8 } });
      }, root);
    };

    if (reduced) {
      start();
      return () => ctx?.revert();
    }

    const onReady = () => start();
    window.addEventListener(READY_EVENT, onReady);
    const fallback = setTimeout(start, 3400);
    return () => {
      window.removeEventListener(READY_EVENT, onReady);
      clearTimeout(fallback);
      ctx?.revert();
    };
  }, [reduced]);

  const onMove = (e: React.MouseEvent) => {
    const r = scope.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: ((e.clientX - r.left) / r.width - 0.5) * 12, y: ((e.clientY - r.top) / r.height - 0.5) * -9 });
  };

  const home = `/${prospect.slug}`;
  const heroImage = brandImage(prospect.slug, "officeBanner") ?? prospect.images.officeBanner;
  const area = prospect.markets && prospect.markets.length ? prospect.markets[0] : prospect.location;
  const marqueeItems = prospect.markets.length > 0 ? prospect.markets : [prospect.location];

  return (
    <section
      ref={scope}
      onMouseMove={onMove}
      className="relative overflow-hidden bg-paper selection:bg-brand/20"
      style={{ perspective: "1200px" }}
    >
      {/* Heritage blueprint — ultra refined */}
      <div className="heritage-pattern pointer-events-none absolute inset-0 opacity-[0.5]" aria-hidden />

      {/* Warm ambient glows */}
      <div className="hero-glow pointer-events-none absolute -right-48 -top-40 h-[720px] w-[720px] rounded-full opacity-[0.22] blur-[88px]" style={{ background: `radial-gradient(circle at 30% 40%, ${prospect.branding.accentColor}30 0%, transparent 58%)` }} />
      <div className="hero-glow pointer-events-none absolute -bottom-36 -left-36 h-[560px] w-[560px] rounded-full bg-brand/[0.045] blur-[78px]" />

      {/* Brass double hairline top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[3px] flex-col gap-[1px] opacity-60">
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#C9A86A]/50 to-transparent" />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A86A]/18 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A86A]/16 to-transparent" />

      {/* Ghost watermark */}
      <div
        className="hero-ghost pointer-events-none absolute -bottom-2 -left-2 z-0 hidden select-none whitespace-nowrap font-display text-display-huge font-extrabold uppercase tracking-tight text-ink opacity-[0.05] lg:block"
        aria-hidden
      >
        {t.hero.ghostText}
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-6 pb-6 pt-10 sm:pt-12 lg:px-8 lg:pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-8">
          {/* Left — editorial */}
          <div className="pt-1">
            {/* Eyebrow pill */}
            <div className="hero-eyebrow inline-flex flex-wrap items-center gap-2.5 rounded-full glass px-3.5 py-1.5 shadow-[0_2px_14px_rgba(19,26,46,0.05)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-[650] uppercase tracking-[0.13em] text-ink-muted">
                {prospect.companyName} · Est. {prospect.established} · {prospect.location}
              </span>
              <span className="ml-1 hidden items-center gap-1.5 border-l border-line pl-3 md:inline-flex">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span className="text-[11px] font-bold text-ink">{prospect.socialProof.googleRating}</span>
                <span className="text-[11px] text-ink-muted">({prospect.socialProof.reviewCount})</span>
                <span className="ml-1 h-1 w-1 rounded-full bg-line" />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted/70">AI-qualified · routed today</span>
              </span>
            </div>

            {/* Editorial serif headline */}
            <h1
              className="mt-6 text-balance font-serif font-black leading-[0.86] tracking-[-0.045em] text-ink [transform-style:preserve-3d]"
              style={{ fontSize: "clamp(38px, 5.4vw, 62px)" }}
            >
              <span className="hero-line block overflow-hidden"><span className="inline-block">{prospect.hero.headlineTop}</span></span>
              <span className="hero-line block -mt-1 overflow-hidden"><span className="inline-block italic font-light tracking-[-0.035em] text-brand-strong">{prospect.hero.headlineAccent}</span></span>
              <span className="hero-line block -mt-1 overflow-hidden"><span className="gradient-text inline-block">{prospect.hero.headlineBottom}</span></span>
            </h1>

            <p className="hero-sub mt-3 flex items-center gap-2 text-[14px] font-semibold tracking-[0.04em] text-[#C9A86A]">
              <span className="hidden h-px w-6 bg-[#C9A86A]/30 sm:block" /> — {prospect.hero.subline}
            </p>

            {/* Handwritten note */}
            <div className="hero-sub mt-2.5 flex items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A86A]/16 bg-white/70 px-3 py-1 shadow-sm backdrop-blur">
                <span className="rotate-[-0.6deg] text-[12.5px] italic font-medium tracking-wide text-[#8B6A2F]" style={{ fontFamily: "'Caveat','Segoe Script','Bradley Hand',cursive" }}>
                  {prospect.slogan}
                </span>
              </span>
              <span className="hidden h-px w-10 -rotate-[0.7deg] bg-[#C9A86A]/20 sm:block" />
            </div>

            <p className="hero-sub mt-4 max-w-[560px] text-balance text-[15.5px] leading-[1.72] text-ink-muted">
              {prospect.hero.kicker ? `${prospect.hero.kicker} — ` : ""}{prospect.slogan}
            </p>

            {/* Digital infra pipeline hint */}
            <div className="hero-sub mt-4 inline-flex flex-wrap items-center gap-2 rounded-full glass px-3 py-1.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted/70">Digital infra</span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A86A]" /> Enquiry
                <span className="text-[#C9A86A]/50">→</span> AI Qualify
                <span className="text-[#C9A86A]/50">→</span> Lead
                <span className="text-[#C9A86A]/50">→</span> Team
                <span className="hidden text-[#C9A86A]/50 sm:inline">→</span>
                <span className="hidden sm:inline">Follow-up</span>
              </span>
              <span className="ml-1 hidden rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white sm:inline-flex">LIVE</span>
            </div>

            {/* CTAs */}
            <div className="hero-cta mt-6 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.3}>
                <Link
                  href={`${home}#enquire`}
                  className="group inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-[13px] text-sm font-semibold text-white shadow-[0_10px_28px_rgba(19,26,46,0.2)] transition-colors hover:bg-brand"
                  data-cursor="Quote"
                >
                  <span className="relative flex items-center gap-2">
                    {t.hero.primaryCta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link
                  href={`${home}/services`}
                  className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-7 py-[13px] text-sm font-semibold text-ink backdrop-blur transition-all hover:border-[#C9A86A]/22 hover:bg-white"
                  data-cursor="Explore"
                >
                  {t.hero.secondaryCta}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-paper transition-transform group-hover:rotate-[-35deg]">
                    <ArrowRight className="h-3.5 w-3.5 text-[#C9A86A]" />
                  </span>
                </Link>
              </Magnetic>
              <Link
                href={`tel:${prospect.contact.tollFree ?? prospect.contact.phone}`}
                className="hidden items-center gap-2 rounded-full border border-[#C9A86A]/16 bg-white px-3 pr-4 py-2 text-sm font-medium text-ink shadow-sm transition-all hover:border-[#C9A86A]/22 hover:shadow-md xl:inline-flex"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="flex flex-col text-left leading-none">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted/70">24/7 Direct</span>
                  <span className="text-sm font-bold tracking-tight">{prospect.contact.tollFree ?? prospect.contact.phone}</span>
                </span>
              </Link>
            </div>

            {/* Credentials strip */}
            <div className="hero-cta mt-5 inline-flex flex-wrap items-center gap-2.5 rounded-full glass px-3.5 py-2 shadow-sm">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <ShieldCheck className="h-3.5 w-3.5 text-[#8B6A2F]" /> {prospect.certifications[0] ?? "Certified & licensed"}
              </span>
              <span className="hidden h-3 w-px bg-line sm:block" />
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <Award className="h-3.5 w-3.5 text-[#C9A86A]" /> {prospect.socialProof.keywords[0] ?? "Trusted partner"}
              </span>
              <span className="hidden h-3 w-px bg-line sm:block" />
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <Check className="h-3.5 w-3.5 text-[#8B6A2F]" /> 24/7 response
              </span>
            </div>

            {/* Animated stats */}
            <div className="hero-stats mt-7 grid grid-cols-2 gap-3 border-t border-line/60 pt-5 sm:grid-cols-4">
              {t.hero.stats.map((s, i) => (
                <div
                  key={s.label}
                  className="group relative overflow-hidden rounded-2xl border border-line bg-white px-4 py-3.5 text-center shadow-sm transition-all hover:border-[#C9A86A]/22 hover:shadow-[0_8px_24px_rgba(19,26,46,0.07)]"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "linear-gradient(180deg, #C9A86A07, transparent 60%)" }} />
                  <div className="relative font-serif text-[17px] font-extrabold tracking-tight text-ink">
                    <CountUp value={s.value} />
                  </div>
                  <div className="relative text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{s.label}</div>
                  <div className="pointer-events-none absolute inset-x-3 bottom-0 h-[2px] rounded-full opacity-55" style={{ background: i % 3 === 0 ? "linear-gradient(90deg, #C9A86A, #1B3A6E)" : i % 3 === 1 ? "linear-gradient(90deg, #C9A86A, #E7C48B)" : "linear-gradient(90deg, #1B3A6E, #C9A86A)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right — premium framed image with animated engineering SVG */}
          <div className="hero-right relative select-none lg:pl-3" style={{ transform: `translate3d(${mouse.x}px, ${mouse.y}px, 0)` }}>
            {/* Glow behind frame */}
            <div className="pointer-events-none absolute inset-0 -z-10 translate-y-6 opacity-[0.2] blur-[48px]">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#C9A86A]/22 via-[#E7C48B]/08 to-brand/08" />
            </div>

            <div className="relative mx-auto max-w-[560px] [transform-style:preserve-3d]">
              {/* Layered brass frame */}
              <div
                ref={imageCanvas}
                className="hero-image-canvas relative overflow-hidden rounded-[22px] border border-[#C9A86A]/22 bg-white/60 p-[7px] shadow-[0_28px_80px_rgba(19,26,46,0.16),0_1px_0_rgba(201,168,106,0.28)_inset]"
              >
                <div className="rounded-[16px] border border-[#C9A86A]/40 bg-white p-[6px] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),inset_0_2px_12px_rgba(19,26,46,0.05)]">
                  <div className="relative h-[460px] overflow-hidden rounded-[12px] border border-line bg-card sm:h-[520px]">
                    <div className="hero-image-inner absolute inset-0">
                      <BrandImage
                        src={heroImage}
                        fallback={prospect.images.officeBanner}
                        alt={`${prospect.companyName} — ${t.hero.heroImageAlt}`}
                        fill
                        priority
                        sizes="600px"
                        className="kenburns object-cover"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1220]/62 via-transparent to-transparent" />
                    <div className="heritage-pattern pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden />

                    {/* Animated engineering SVG overlay */}
                    {prospect.designDirection.useSvgScenes && (
                      <div className="absolute inset-0" aria-hidden>
                        <div className="absolute right-[-6%] top-[4%] w-[62%] max-w-[520px] mix-blend-screen opacity-50">
                          <AnimatedSvg src="ac.svg" playOn="load" className="h-full w-full" />
                        </div>
                      </div>
                    )}

                    {/* Floating location pill */}
                    <div className="hero-card-float absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <div className="glass-card-float flex items-center gap-2.5 rounded-full px-3.5 py-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white">
                          <MapPin className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold tracking-tight text-ink">{area}</span>
                        <span className="hidden text-xs text-ink-muted sm:inline">• {prospect.displayName} • {prospect.location}</span>
                      </div>
                      <div className="hero-card-float hidden items-center gap-1.5 rounded-full bg-ink/90 px-3.5 py-2 text-xs font-semibold text-white shadow-lg sm:inline-flex">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> 24/7 On Call
                      </div>
                    </div>

                    {/* Top-right established pill */}
                    <div className="hero-card-float absolute right-3 top-3 hidden items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur sm:flex">
                      <Sparkles className="h-3.5 w-3.5 text-[#C9A86A]" />
                      <span className="text-[11px] font-bold tracking-wide text-ink">EST. {prospect.established}</span>
                      <span className="h-3 w-px bg-line" />
                      <span className="text-[11px] font-semibold text-[#8B6A2F]">{prospect.location.split(",")[0].toUpperCase()}</span>
                    </div>

                    {/* Decorative engineering icons */}
                    <Wrench className="pointer-events-none absolute left-4 top-10 hidden rotate-[-18deg] text-ink opacity-[0.06] sm:block" strokeWidth={0.9} />
                    <Ruler className="pointer-events-none absolute bottom-24 right-6 hidden rotate-12 text-ink opacity-[0.055] sm:block" strokeWidth={0.9} />
                  </div>
                </div>

                {/* Corner notches */}
                <div className="pointer-events-none absolute -left-1 -top-1 h-7 w-7 rounded-tl-[22px] border-l-2 border-t-2 border-[#C9A86A]/32" />
                <div className="pointer-events-none absolute -bottom-1 -right-1 h-7 w-7 rounded-br-[22px] border-b-2 border-r-2 border-[#C9A86A]/32" />
              </div>

              {/* Floating rating card */}
              <div className="hero-card-float absolute -bottom-7 -left-2 hidden sm:block sm:-left-7">
                <div className="group rounded-2xl border border-line bg-white/95 px-4 py-3.5 shadow-[0_18px_48px_rgba(19,26,46,0.15)] backdrop-blur transition-shadow hover:shadow-[0_22px_56px_rgba(19,26,46,0.18)]">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-50 text-amber-500">
                      <Star className="h-5 w-5" fill="currentColor" />
                    </span>
                    <div className="text-xs">
                      <div className="flex items-center gap-1 font-bold text-ink">
                        <CountUp value={String(prospect.socialProof.googleRating)} /> from {prospect.socialProof.reviewCount} reviews
                      </div>
                      <div className="font-medium text-ink-muted">Trusted from {area} beyond</div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Enquiries qualified today
                  </div>
                </div>
              </div>

              {/* Floating client badge */}
              <div className="hero-card-float absolute -left-3 -top-3 hidden lg:flex">
                <div className="glass-dark flex items-center gap-2.5 rounded-full px-3.5 py-2 shadow-xl">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-semibold text-white">24/7 available</span>
                  <span className="h-4 w-px bg-white/15" />
                  <span className="text-xs font-bold text-[#C9A86A]">Est. {prospect.established}</span>
                </div>
              </div>
            </div>

            {/* Scroll cue */}
            <div className="hero-sub pointer-events-none mt-10 hidden justify-center lg:flex">
              <div className="flex flex-col items-center gap-2 opacity-50">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">Scroll</span>
                <span className="hero-scroll-line relative h-8 w-[1px] overflow-hidden bg-gradient-to-b from-ink/25 to-transparent">
                  <span className="absolute inset-0 bg-[#C9A86A]" style={{ transform: "translateY(-100%)" }} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Area marquee ticker */}
        <div className="hero-sub mt-9 hidden overflow-hidden rounded-full border border-[#C9A86A]/12 glass shadow-sm lg:block">
          <div className="marquee-track flex whitespace-nowrap py-2.5 text-xs font-medium tracking-wide text-ink-muted">
            {[...marqueeItems, ...marqueeItems].map((m, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${i % 2 === 0 ? "bg-[#C9A86A]" : "bg-[#8B6A2F]"}`} />
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
