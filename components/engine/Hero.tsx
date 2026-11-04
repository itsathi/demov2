import type { DemoConfig } from "@/lib/engine/types";
import { Reveal } from "./Reveal";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--ink-muted)]">
      <span className="inline-block h-[1px] w-8 bg-[var(--accent)]" aria-hidden />
      {children}
    </p>
  );
}

function CtaRow({ content }: { content: DemoConfig["content"] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
      <a
        href="#contact"
        className="inline-flex items-center gap-3 rounded-[var(--radius)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0d0d0d] transition-transform duration-300 hover:-translate-y-0.5"
        style={{ backgroundColor: "var(--accent)" }}
      >
        {content.hero.primaryCta}
        <span aria-hidden>↗</span>
      </a>
      <a
        href="#services"
        className="link-underline text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]"
      >
        {content.hero.secondaryCta}
      </a>
    </div>
  );
}

function Stats({ config }: { config: DemoConfig }) {
  const showRatingBand = config.recipe.sections.includes("trust");
  const stats = showRatingBand
    ? config.content.stats.filter((stat) => !/google/i.test(stat.label))
    : config.content.stats;
  if (!stats.length) return null;
  return (
    <dl
      className="mt-12 grid max-w-xl gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)]"
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0,1fr))` }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[var(--paper)] px-4 py-4">
          <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {stat.label}
          </dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums" style={{ fontFamily: "var(--demo-display)" }}>
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Headline({ config }: { config: DemoConfig }) {
  const { content, theme } = config;
  const serif = theme.displayFont.includes("Playfair");
  return (
    <h1
      className="text-[clamp(2.7rem,7.4vw,7.2rem)] leading-[0.9] tracking-[-0.045em]"
      style={{ fontFamily: "var(--demo-display)" }}
    >
      <span className="block">{content.hero.headlineTop}</span>
      <span
        className="block"
        style={{
          color: "var(--accent)",
          fontStyle: serif ? "italic" : "normal",
          fontWeight: serif ? 400 : 600,
        }}
      >
        {content.hero.headlineAccent}
      </span>
      {content.hero.headlineBottom ? (
        <span className="block">{content.hero.headlineBottom}</span>
      ) : null}
    </h1>
  );
}

function ImageNote({ config, dark }: { config: DemoConfig; dark?: boolean }) {
  return (
    <span
      className={`absolute bottom-4 left-4 z-10 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-md ${
        dark ? "bg-black/40 text-white/80" : "bg-white/70 text-black/60"
      }`}
    >
      {config.content.hero.imageVerified
        ? `Source: ${config.company.domain}`
        : "Concept imagery · licensed stock"}
    </span>
  );
}

export function Hero({ config }: { config: DemoConfig }) {
  const { content, recipe } = config;
  const variant = recipe.heroVariant;

  if (variant === "fullbleed") {
    return (
      <section id="top" className="relative flex min-h-[94svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.hero.image}
            alt={content.hero.imageAlt}
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_10%,transparent,rgba(0,0,0,0.35))]" />
        </div>
        <div className="relative z-[1] mx-auto w-full max-w-[1400px] px-5 pb-14 pt-32 text-white sm:px-8 sm:pb-20">
          <Reveal>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] text-white/70">
              <span className="inline-block h-[1px] w-8 bg-[var(--accent)]" aria-hidden />
              {content.hero.kicker}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-6 max-w-4xl">
              <Headline config={config} />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
              {content.hero.subline}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <CtaRow content={content} />
          </Reveal>
        </div>
        <ImageNote config={config} dark />
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section id="top" className="relative overflow-hidden pt-[74px]">
        <div className="mx-auto grid min-h-[calc(92svh-74px)] max-w-[1400px] items-stretch lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-8 lg:py-24 lg:pr-14">
            <Reveal>
              <Eyebrow>{content.hero.kicker}</Eyebrow>
            </Reveal>
            <Reveal delay={70}>
              <div className="mt-6">
                <Headline config={config} />
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-[var(--ink-muted)]">
                {content.hero.subline}
              </p>
            </Reveal>
            <Reveal delay={210}>
              <CtaRow content={content} />
            </Reveal>
            <Reveal delay={280}>
              <Stats config={config} />
            </Reveal>
          </div>
          <div className="relative min-h-[52vh] lg:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.hero.image}
              alt={content.hero.imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
            <div
              className="absolute -left-3 bottom-10 hidden h-24 w-24 border lg:block"
              style={{ borderColor: "var(--accent)" }}
              aria-hidden
            />
            <ImageNote config={config} dark />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section id="top" className="relative overflow-hidden pt-[74px]">
        <div className="technical-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-[1400px] px-5 pb-20 pt-20 sm:px-8 lg:pb-28 lg:pt-28">
          <Reveal>
            <Eyebrow>{content.hero.kicker}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-8 max-w-5xl">
              <Headline config={config} />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-xl text-[15px] leading-relaxed text-[var(--ink-muted)]">
                {content.hero.subline}
              </p>
              <CtaRow content={content} />
            </div>
          </Reveal>
          <Reveal delay={260}>
            <Stats config={config} />
          </Reveal>
        </div>
      </section>
    );
  }

  // editorial
  return (
    <section id="top" className="relative overflow-hidden pt-[74px]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid items-end gap-10 py-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:py-24">
          <div className="lg:pb-6">
            <Reveal>
              <Eyebrow>{content.hero.kicker}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <div className="mt-7">
                <Headline config={config} />
              </div>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-[var(--ink-muted)]">
                {content.hero.subline}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <CtaRow content={content} />
            </Reveal>
            <Reveal delay={290}>
              <Stats config={config} />
            </Reveal>
          </div>
          <Reveal delay={120}>
            <figure className="relative">
              <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.hero.image}
                  alt={content.hero.imageAlt}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div
                  className="absolute inset-0 ring-1 ring-inset"
                  style={{ borderColor: "var(--line)" }}
                />
                <ImageNote config={config} />
              </div>
              <div
                className="absolute -bottom-5 -left-5 hidden h-20 w-20 items-center justify-center bg-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.14em] text-[#101010] lg:flex"
                style={{ borderRadius: "var(--radius)" }}
              >
                {content.initials}
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
      <div className="border-y border-[var(--line)]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-10 gap-y-3 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-muted)] sm:px-8">
          <span>{content.industryLabel}</span>
          <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
          <span>{content.locationLabel}</span>
          {content.rating ? (
            <>
              <span className="hidden h-3 w-px bg-[var(--line)] sm:block" />
              <span>
                {content.rating.value.toFixed(1)}★
                {content.rating.count ? ` · ${content.rating.count} reviews` : ""}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
