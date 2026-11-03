import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { BrandImage } from "@/components/visual/BrandImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import type { ProspectConfig, PropertyListing, VoiceCopy } from "@/lib/types";
import type { RealEstateDesignDirection } from "@/lib/types";

function LuxuryHero({
  prospect,
  t,
  heroImage,
}: {
  prospect: ProspectConfig;
  t: VoiceCopy;
  heroImage?: string;
}) {
  const base = `/${prospect.slug}`;
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#111110] pt-24 text-white">
      {heroImage && (
        <BrandImage
          src={heroImage}
          alt={t.hero.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111110] via-[#111110]/70 to-transparent" />
      <div className="grain-re absolute inset-0 opacity-30" />
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 md:pb-20">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#B7A17A]">
            <span className="h-px w-12 bg-[#B7A17A]" />
            {prospect.hero.kicker || "Private Property Advisory"}
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-8 max-w-[22ch] font-re-display text-[clamp(3rem,9vw,7rem)] leading-[0.96] tracking-tight">
            <span className="block">{prospect.hero.headlineTop || "A More Considered Way"}</span>
            <span className="block">
              <em className="not-italic text-[#B7A17A]">{prospect.hero.headlineAccent || "to Find"}</em>{" "}
              {prospect.hero.headlineBottom || "Home"}
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">
            {prospect.hero.subline ||
              "Discover exceptional properties, distinctive architecture, and places worth living in. Curated with discretion and a refined eye for detail."}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`${base}/properties`}
              className="group inline-flex items-center gap-2 bg-[#B7A17A] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#a08c68]"
              data-cursor="Explore"
            >
              Explore the Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`${base}#enquire`}
              className="group inline-flex items-center gap-2 border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
              data-cursor="Enquire"
            >
              Speak to an Advisor
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.2} className="mt-16">
          <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4">
            {(t.hero?.stats || []).slice(0, 4).map((s) => (
              <div key={s.label}>
                <p className="font-re-display text-3xl text-white">{s.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 lg:flex">
        <span className="text-[9px] uppercase tracking-[0.4em]">Scroll</span>
        <div className="h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}

function ContemporaryHero({
  prospect,
  t,
  heroImage,
  secondaryImage,
}: {
  prospect: ProspectConfig;
  t: VoiceCopy;
  heroImage?: string;
  secondaryImage?: string;
}) {
  const base = `/${prospect.slug}`;
  return (
    <section className="relative overflow-hidden bg-[#F7F4EE] pb-16 pt-32 md:pb-24 lg:pt-40">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Reveal>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
              <span className="h-px w-10 bg-[#B7A17A]" />
              {prospect.hero.kicker}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 font-re-display text-[clamp(3rem,6vw,5.5rem)] leading-[1.0] tracking-tight text-ink">
              {prospect.hero.headlineTop}{" "}
              <em className="not-italic text-[#B7A17A]">{prospect.hero.headlineAccent}</em>{" "}
              {prospect.hero.headlineBottom}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{prospect.hero.subline}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={`${base}/properties`}
                className="group inline-flex items-center gap-2 bg-ink px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B7A17A]"
                data-cursor="Explore"
              >
                Explore the Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`${base}#enquire`}
                className="group inline-flex items-center gap-2 border border-[#D8D0C4] px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
                data-cursor="Enquire"
              >
                Speak to an Advisor
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            {heroImage && (
              <BrandImage
                src={heroImage}
                alt={t.hero.heroImageAlt}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 45vw"
                className="object-cover"
              />
            )}
          </div>
          {secondaryImage && (
            <div className="absolute -bottom-10 -left-8 hidden h-52 w-40 overflow-hidden border-4 border-[#F7F4EE] shadow-2xl sm:block">
              <BrandImage src={secondaryImage} alt="" fill sizes="160px" className="object-cover" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function DevelopmentHero({
  prospect,
  t,
  heroImage,
}: {
  prospect: ProspectConfig;
  t: VoiceCopy;
  heroImage?: string;
}) {
  const base = `/${prospect.slug}`;
  return (
    <section className="relative overflow-hidden bg-[#111110] text-white">
      <div className="relative min-h-[85svh] pt-28">
        {heroImage && (
          <BrandImage
            src={heroImage}
            alt={t.hero.heroImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111110] via-[#111110]/80 to-[#111110]/40" />
        <div className="grain-re absolute inset-0 opacity-30" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-5 py-20 md:px-8">
          <Reveal>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#B7A17A]">
              <span className="h-px w-12 bg-[#B7A17A]" />
              {prospect.hero.kicker}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-8 max-w-[18ch] font-re-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.98] tracking-tight">
              {prospect.hero.headlineTop}{" "}
              <em className="not-italic text-[#B7A17A]">{prospect.hero.headlineAccent}</em>{" "}
              {prospect.hero.headlineBottom}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">{prospect.hero.subline}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={`${base}/properties`}
                className="group inline-flex items-center gap-2 bg-[#B7A17A] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#a08c68]"
              >
                {t.hero.secondaryCta || "Discover Projects"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`${base}#enquire`}
                className="group inline-flex items-center gap-2 border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
              >
                Register Interest
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InvestmentHero({
  prospect,
  t,
  heroImage,
  listings,
}: {
  prospect: ProspectConfig;
  t: VoiceCopy;
  heroImage?: string;
  listings: PropertyListing[];
}) {
  const base = `/${prospect.slug}`;
  return (
    <section className="relative overflow-hidden bg-[#F7F4EE] border-b border-[#D8D0C4]/60">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-2 lg:items-center lg:pt-40">
        <div>
          <Reveal>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
              <span className="h-px w-10 bg-[#B7A17A]" />
              {prospect.hero.kicker}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 font-re-display text-[clamp(3rem,5vw,5rem)] leading-[1.02] tracking-tight text-ink">
              {prospect.hero.headlineTop}{" "}
              <em className="not-italic text-[#B7A17A]">{prospect.hero.headlineAccent}</em>{" "}
              {prospect.hero.headlineBottom}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{prospect.hero.subline}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={`${base}/properties`}
                className="group inline-flex items-center gap-2 bg-ink px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B7A17A]"
              >
                {t.hero.secondaryCta || "View Opportunities"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`${base}#enquire`}
                className="group inline-flex items-center gap-2 border border-[#D8D0C4] px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
              >
                {t.hero.primaryCta || "Speak to an Advisor"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[5/4] overflow-hidden">
            {heroImage && (
              <BrandImage
                src={heroImage}
                alt={t.hero.heroImageAlt}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function RealEstateHero({
  prospect,
  t,
  heroImage,
  secondaryImage,
  listings,
}: {
  prospect: ProspectConfig;
  t: VoiceCopy;
  heroImage?: string;
  secondaryImage?: string;
  listings: PropertyListing[];
}) {
  const variant: RealEstateDesignDirection = prospect.realEstateDirection ?? "luxury";
  if (variant === "luxury") return <LuxuryHero prospect={prospect} t={t} heroImage={heroImage} />;
  if (variant === "development")
    return <DevelopmentHero prospect={prospect} t={t} heroImage={heroImage} />;
  if (variant === "investment")
    return <InvestmentHero prospect={prospect} t={t} heroImage={heroImage} listings={listings} />;
  return <ContemporaryHero prospect={prospect} t={t} heroImage={heroImage} secondaryImage={secondaryImage} />;
}
