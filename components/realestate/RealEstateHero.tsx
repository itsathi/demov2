import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Star,
  MapPin,
  CircleCheck,
} from "lucide-react";
import { BrandImage } from "@/components/visual/BrandImage";
import { BrandField } from "@/components/webgl/BrandField";
import { Reveal } from "@/components/motion/Reveal";
import type { ProspectConfig, PropertyListing, VoiceCopy } from "@/lib/types";
import type { RealEstateDesignDirection } from "@/lib/types";

type HeroVariant = RealEstateDesignDirection;

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/80 backdrop-blur">
      <CircleCheck className="h-3 w-3" />
      {children}
    </span>
  );
}

function StatRow({ t, dark }: { t: VoiceCopy; dark: boolean }) {
  return (
    <dl
      className={
        dark
          ? "grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4"
          : "grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-4"
      }
    >
      {t.hero.stats.map((s) => (
        <div key={s.label}>
          <dt
            className={
              dark
                ? "font-serif text-3xl font-semibold text-white"
                : "font-serif text-3xl font-semibold text-ink"
            }
          >
            {s.value}
          </dt>
          <dd className={dark ? "mt-1 text-[12px] leading-snug text-white/55" : "mt-1 text-[12px] leading-snug text-ink-muted"}>
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── Luxury — full-bleed cinematic ─────────────────────────────── */
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
    <section className="relative flex min-h-[94vh] flex-col justify-end overflow-hidden bg-ink pt-28 text-white">
      {heroImage && (
        <BrandImage src={heroImage} alt={t.hero.heroImageAlt} fill priority sizes="100vw" className="object-cover opacity-75" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/5" />
      <BrandField
        variant="depth"
        tone="dark"
        primary={prospect.branding.primaryColor}
        accent={prospect.branding.accentColor || "#0ea5e9"}
        className="pointer-events-none absolute inset-0 z-[1] opacity-70"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 md:px-8">
        <Reveal>
          <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">
            <span className="h-px w-10 bg-accent" />
            {prospect.hero.kicker}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-7 max-w-[17ch] font-serif text-[clamp(2.8rem,7.5vw,6rem)] font-normal leading-[0.98] tracking-tight">
            {prospect.hero.headlineTop} <em className="not-italic text-accent">{prospect.hero.headlineAccent}</em>{" "}
            {prospect.hero.headlineBottom}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{prospect.hero.subline}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`${base}#enquire`}
              className="shine group inline-flex h-13 items-center gap-2 rounded-full bg-white px-8 text-sm font-semibold text-ink transition-colors hover:bg-accent hover:text-white"
              data-cursor="Enquire"
            >
              {t.hero.primaryCta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href={`${base}/properties`}
              className="group inline-flex h-13 items-center gap-2 rounded-full border border-white/25 px-8 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/60"
              data-cursor="Browse"
            >
              {t.hero.secondaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.2} className="mt-16">
          <StatRow t={t} dark />
        </Reveal>
      </div>
    </section>
  );
}

/* ── Contemporary — split editorial ────────────────────────────── */
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
  const hasRating = prospect.socialProof.googleRating > 0;
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-32 md:pb-24 lg:pt-40">
      <div
        className="pointer-events-none absolute -right-40 top-20 h-[36rem] w-[36rem] rounded-full bg-brand-tint opacity-60 blur-3xl"
        aria-hidden
      />
      <BrandField
        variant="depth"
        tone="light"
        primary={prospect.branding.primaryColor}
        accent={prospect.branding.accentColor || "#0ea5e9"}
        className="pointer-events-none absolute inset-0 z-0"
      />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-accent">
              <span className="h-px w-8 bg-accent" />
              {prospect.hero.kicker}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,5.6vw,4.8rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink">
              {prospect.hero.headlineTop} <span className="text-accent">{prospect.hero.headlineAccent}</span>{" "}
              {prospect.hero.headlineBottom}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-muted">{prospect.hero.subline}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={`${base}#enquire`}
                className="group inline-flex h-13 items-center gap-2 rounded-lg bg-ink px-7 text-sm font-semibold text-white transition-colors hover:bg-brand"
                data-cursor="Enquire"
              >
                {t.hero.primaryCta}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href={`${base}/properties`}
                className="group inline-flex h-13 items-center gap-2 rounded-lg border border-line bg-white px-7 text-sm font-semibold text-ink transition-colors hover:border-ink"
                data-cursor="Browse"
              >
                {t.hero.secondaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-12 max-w-lg">
              <StatRow t={t} dark={false} />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line shadow-[0_40px_90px_-50px_rgba(10,17,40,0.5)]">
            {heroImage && (
              <BrandImage src={heroImage} alt={t.hero.heroImageAlt} fill priority sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
            )}
          </div>
          {secondaryImage && (
            <div className="absolute -bottom-8 -left-6 hidden h-40 w-32 overflow-hidden rounded-2xl border-4 border-paper shadow-xl sm:block">
              <BrandImage src={secondaryImage} alt="" fill sizes="128px" className="object-cover" />
            </div>
          )}
          {hasRating && (
            <div className="absolute -top-4 right-6 flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 shadow-lg">
              <Star className="h-4 w-4 text-accent" fill="currentColor" />
              <span className="text-sm font-bold text-ink">{prospect.socialProof.googleRating}</span>
              <span className="text-xs text-ink-muted">· {prospect.socialProof.reviewCount} reviews</span>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ── Development — project hero with index bar ─────────────────── */
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
  const areas = (prospect.serviceAreas ?? []).slice(0, 4);
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="relative min-h-[78vh] pt-28">
        {heroImage && (
          <BrandImage src={heroImage} alt={t.hero.heroImageAlt} fill priority sizes="100vw" className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/50 to-transparent" />
        <BrandField
          variant="depth"
          tone="dark"
          primary={prospect.branding.primaryColor}
          accent={prospect.branding.accentColor || "#0ea5e9"}
          className="pointer-events-none absolute inset-0 z-[1] opacity-60"
        />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-5 py-16 md:px-8">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
              <span className="h-px w-8 bg-accent" />
              {prospect.hero.kicker}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[1] tracking-[-0.03em]">
              {prospect.hero.headlineTop} {prospect.hero.headlineAccent} {prospect.hero.headlineBottom}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{prospect.hero.subline}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={`${base}/properties`}
                className="group inline-flex h-13 items-center gap-2 rounded-lg bg-accent px-7 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
                data-cursor="Explore"
              >
                {t.hero.secondaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`${base}#enquire`}
                className="group inline-flex h-13 items-center gap-2 rounded-lg border border-white/25 px-7 text-sm font-semibold text-white backdrop-blur transition-colors hover:border-white/60"
              >
                Register interest
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="relative border-t border-white/10 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {areas.map((a) => (
              <Chip key={a}>{a}</Chip>
            ))}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
            {t.hero.scrollCue}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Investment — data-forward ─────────────────────────────────── */
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
  const forSale = listings.filter((l) => l.status === "sale" || l.status === "investment").length;
  const forRent = listings.filter((l) => l.status === "rent").length;
  return (
    <section className="relative overflow-hidden border-b border-line bg-card">
      <div className="technical-grid absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-2 lg:items-center lg:pt-40">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-muted">
              <MapPin className="h-3 w-3 text-accent" />
              {prospect.hero.kicker}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-medium leading-[1.03] tracking-tight text-ink">
              {prospect.hero.headlineTop} <em className="not-italic text-accent">{prospect.hero.headlineAccent}</em>{" "}
              {prospect.hero.headlineBottom}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-muted">{prospect.hero.subline}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={`${base}/properties`}
                className="group inline-flex h-13 items-center gap-2 rounded-lg bg-ink px-7 text-sm font-semibold text-white transition-colors hover:bg-brand"
                data-cursor="Browse"
              >
                {t.hero.secondaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`${base}#enquire`}
                className="group inline-flex h-13 items-center gap-2 rounded-lg border border-line bg-white px-7 text-sm font-semibold text-ink transition-colors hover:border-ink"
              >
                {t.hero.primaryCta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-line">
            {heroImage && (
              <BrandImage src={heroImage} alt={t.hero.heroImageAlt} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { label: "For sale", value: forSale },
              { label: "For rent", value: forRent },
              { label: "Areas served", value: prospect.serviceAreas?.length ?? 1 },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-paper p-4 text-center">
                <p className="font-serif text-2xl font-semibold tabular-nums text-ink">{s.value}</p>
                <p className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">{s.label}</p>
              </div>
            ))}
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
  const variant: HeroVariant = prospect.realEstateDirection ?? "contemporary";
  if (variant === "luxury") return <LuxuryHero prospect={prospect} t={t} heroImage={heroImage} />;
  if (variant === "development")
    return <DevelopmentHero prospect={prospect} t={t} heroImage={heroImage} />;
  if (variant === "investment")
    return <InvestmentHero prospect={prospect} t={t} heroImage={heroImage} listings={listings} />;
  return <ContemporaryHero prospect={prospect} t={t} heroImage={heroImage} secondaryImage={secondaryImage} />;
}
