"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Star } from "lucide-react";
import { AnimatedSvg } from "@/components/visual/AnimatedSvg";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { Magnetic } from "@/components/motion/Magnetic";
import { CountUp } from "@/components/motion/CountUp";
import { RotatingBadge } from "@/components/fx/RotatingBadge";
import { READY_EVENT } from "@/components/fx/FxStage";
import { BrandImage } from "@/components/visual/BrandImage";
import { getTemplates } from "@/lib/prospect";
import { brandImage } from "@/lib/realImages";
import type { ProspectConfig } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function HeroEngineered({ prospect }: { prospect: ProspectConfig }) {
  const scope = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const t = getTemplates(prospect);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    let ctx: gsap.Context | undefined;

    const start = () => {
      if (ctx) return;
      ctx = gsap.context(() => {
        if (reduced) return;

        gsap.fromTo(
          ".hero-fade",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.2, ease: "power3.out" }
        );
        gsap.fromTo(
          ".hero-line > span",
          { yPercent: 118 },
          { yPercent: 0, duration: 1, stagger: 0.12, delay: 0.1, ease: "power4.out" }
        );
        gsap.fromTo(
          ".hero-line-rot",
          { rotate: -8, opacity: 0 },
          { rotate: 0, opacity: 1, duration: 1.1, delay: 0.9, ease: "power3.out" }
        );
        gsap.fromTo(
          ".hero-trust",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 1.05, ease: "power3.out" }
        );
        gsap.fromTo(".hero-badge", { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1, delay: 1.2, ease: "back.out(1.6)" });

        // Photo settle + scroll parallax
        gsap.fromTo(".hero-photo-inner", { scale: 1.1 }, { scale: 1, duration: 1.8, delay: 0.1, ease: "power2.out" });
        gsap.fromTo(
          ".hero-photo-inner",
          { yPercent: -8 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.8 },
          }
        );

        // Ghost watermark — moves slower than scroll for depth
        gsap.fromTo(
          ".hero-ghost",
          { xPercent: -6 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
          }
        );

        // Ambient engineering texture
        gsap.fromTo(
          ".hero-ambient",
          { autoAlpha: 1, x: 0, rotate: 0 },
          {
            autoAlpha: 0,
            x: -60,
            rotate: -4,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 },
          }
        );
        gsap.to(".hero-ambient-inner", { y: -14, rotation: 1.5, repeat: -1, yoyo: true, duration: 10, ease: "sine.inOut" });

        // Vertical scroll line draws downward with scroll
        gsap.fromTo(
          ".hero-scroll-line",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom 35%", scrub: 0.4 },
          }
        );
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

  const home = `/demo/${prospect.slug}`;

  return (
    <section
      ref={scope}
      className="relative flex min-h-[94svh] flex-col overflow-hidden bg-paper pb-8 pt-[72px]"
    >
      {/* Real company photo — fills the hero, becomes the story */}
      <div className="hero-photo absolute inset-0" data-cursor="Scroll">
        <div className="hero-photo-inner absolute inset-0 will-change-transform">
          <BrandImage
            src={brandImage(prospect.slug, "officeBanner") ?? prospect.images.officeBanner}
            fallback={prospect.images.officeBanner}
            alt={`${prospect.companyName} — ${t.hero.heroImageAlt}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
        </div>
      </div>

      {/* Legibility washes — photo fades in from the text side */}
      <div
        className="absolute inset-0 hidden bg-[linear-gradient(to_right,var(--paper)_0%,rgba(246,248,252,0.94)_42%,rgba(246,248,252,0.4)_68%,rgba(246,248,252,0.08)_100%)] lg:block"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--paper)_0%,rgba(246,248,252,0.94)_48%,rgba(246,248,252,0.55)_72%,rgba(246,248,252,0.22)_100%)] lg:hidden"
        aria-hidden
      />

      {/* Ghost watermark */}
      <div
        className="hero-ghost pointer-events-none absolute -bottom-2 left-4 z-0 hidden select-none whitespace-nowrap font-display text-display-huge font-extrabold uppercase tracking-tight text-ink opacity-[0.07] lg:block"
        aria-hidden
      >
        {t.hero.ghostText}
      </div>

      {/* Ambient engineering texture (SVG special effect) over the photo */}
      {prospect.designDirection.useSvgScenes && (
        <div className="hero-ambient absolute inset-0 overflow-hidden" aria-hidden>
          <div className="hero-ambient-inner absolute right-[-8%] top-[4%] w-[56%] max-w-[900px] mix-blend-multiply opacity-25">
            <AnimatedSvg src="ac.svg" playOn="load" className="h-full w-full" />
          </div>
        </div>
      )}

      {/* Vertical scroll cue */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
        <span className="rotate-180 font-display text-[10px] font-bold uppercase tracking-[0.4em] text-ink-muted [writing-mode:vertical-rl]">
          {t.hero.scrollCue}
        </span>
        <span className="hero-scroll-line relative w-px flex-1 overflow-hidden bg-line">
          <span className="absolute inset-0 bg-brand" />
        </span>
      </div>

      {/* Rotating badge — float over the photo */}
      <div className="hero-badge absolute bottom-10 right-9 z-10 hidden h-24 w-24 text-white lg:block" aria-hidden>
        <RotatingBadge text={`EST ${prospect.established} · ${prospect.displayName} · `}>
          <Star className="h-6 w-6" fill="currentColor" />
        </RotatingBadge>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grow items-center px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Company story */}
          <div className="relative max-w-3xl">
            <p className="hero-fade inline-flex items-center gap-2.5 rounded-full border border-line bg-white/85 px-4 py-2 text-xs font-semibold tracking-wide text-ink-muted backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
              </span>
              {prospect.companyName} · Est. {prospect.established} · {prospect.location}
            </p>

            <h1 className="mt-7 font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-tight text-ink sm:text-[3.4rem] xl:text-[4.2rem]">
              <span className="hero-line"><span>{prospect.hero.headlineTop}</span></span>
              <span className="hero-line"><span className="text-brand">{prospect.hero.headlineAccent}</span></span>
              <span className="hero-line"><span>{prospect.hero.headlineBottom}</span></span>
            </h1>

            <p className="hero-fade mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {prospect.hero.subline}
            </p>

            <p className="hero-fade mt-4 font-display text-lg font-bold italic tracking-tight text-brand-strong">
              &ldquo;{prospect.slogan}&rdquo;
            </p>

            <div className="hero-fade mt-7 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.3}>
                <Link
                  href={`${home}#enquire`}
                  className="shine group inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 text-sm font-semibold text-white shadow-xl shadow-ink/20 transition-colors hover:bg-brand"
                >
                  {t.hero.primaryCta}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link
                  href={`${home}/services`}
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-ink/15 bg-white/80 px-6 text-sm font-semibold text-ink backdrop-blur transition-colors hover:border-ink/30 hover:bg-white"
                  data-cursor="Explore"
                >
                  {t.hero.secondaryCta}
                </Link>
              </Magnetic>
            </div>

            <dl className="hero-fade mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line bg-white/40 py-8 pr-6 backdrop-blur-[2px] sm:grid-cols-4">
              {t.hero.stats.map((s) => (
                <div key={s.label} className="group/stat">
                  <dd className="font-display text-3xl font-extrabold tabular-nums text-ink transition-colors group-hover/stat:text-brand">
                    <CountUp value={s.value} />
                  </dd>
                  <dt className="mt-1.5 text-xs font-medium leading-snug text-ink-muted">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Trust cards floating over the photo */}
          <div className="relative hidden h-full lg:block">
            <div className="absolute right-0 top-6 w-64">
              <div
                className="hero-trust rounded-xl border border-line bg-white/90 px-5 py-4 shadow-xl shadow-ink/5 backdrop-blur transition-transform duration-500 hover:-translate-y-1"
                data-cursor
              >
                <div className="flex items-center gap-3.5">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-tint text-brand">
                    <Star className="h-5 w-5" fill="currentColor" />
                  </span>
                  <div>
                    <p className="font-display text-xl font-extrabold leading-none text-ink">
                      <CountUp value={String(prospect.socialProof.googleRating)} />
                      <span className="ml-1.5 text-xs font-bold text-ink-muted">/ 5</span>
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-ink-muted">
                      {prospect.socialProof.reviewCount} Google reviews
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3" fill={i < 4 ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>

              <div className="hero-trust mt-4 flex items-center gap-3.5 rounded-xl border border-white/10 bg-ink/90 px-5 py-4 text-white shadow-xl backdrop-blur transition-transform duration-500 hover:-translate-y-1">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-accent">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-lg font-extrabold leading-none text-white">
                    {prospect.contact.tollFree ?? prospect.contact.phone}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-white/60">
                    {t.hero.contactCardLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authority strip + scroll cue */}
      <div className="relative z-10 mt-8 bg-gradient-to-t from-paper via-paper/85 to-transparent">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-line px-5 pt-5 md:px-8">
          <p className="flex flex-wrap items-center gap-3 text-xs font-semibold text-ink-muted">
            <span className="font-bold uppercase tracking-[0.2em] text-ink">{t.hero.chipsHeading}</span>
            <span className="flex items-center gap-2">
              {(prospect.certifications.length > 0
                ? prospect.certifications
                : prospect.socialProof.keywords
              )
                .slice(0, 5)
                .map((c) => (
                  <span key={c} className="rounded-full border border-line bg-white/90 px-3 py-1 text-[11px] font-bold text-ink-muted backdrop-blur">
                    {c}
                  </span>
                ))}
              <span className="text-ink-muted/50">+</span>
            </span>
          </p>
          <a
            href={`${home}#capability`}
            className="hero-fade flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-strong transition-colors hover:text-brand"
          >
            {t.hero.scrollCue}
            <ArrowUpRight className="h-4 w-4 rotate-90" />
          </a>
        </div>
      </div>
    </section>
  );
}