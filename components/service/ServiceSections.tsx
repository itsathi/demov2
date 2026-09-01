"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, BadgeCheck, Check, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatedSvg } from "@/components/visual/AnimatedSvg";
import { BrandImage } from "@/components/visual/BrandImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { ServiceIcon } from "@/components/services/ServiceGrid";
import { getTemplates } from "@/lib/prospect";
import { serviceImage } from "@/lib/realImages";
import type { ProspectConfig, Service } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export function ServiceHero({ prospect, service }: { prospect: ProspectConfig; service: Service }) {
  const home = `/demo/${prospect.slug}`;
  const t = getTemplates(prospect);
  const cover = prospect.designDirection.imageTreatment === "PhotoCover";

  return (
    <section className="relative overflow-hidden bg-paper pt-[72px]">
      <div className="technical-grid absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -right-6 top-8 select-none font-display text-display-huge font-extrabold uppercase tracking-tight text-ink/[0.05] hidden lg:block"
        aria-hidden
      >
        {service.name.split(" ")[0]}
      </div>
      <div
        className="absolute -top-32 right-[-10%] h-[480px] w-[640px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 62%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-10 md:px-8 lg:pt-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
          <Link href={home} className="transition-colors hover:text-ink">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`${home}/services`} className="transition-colors hover:text-ink">{t.nav.productsLabel}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-ink">{service.name}</span>
        </nav>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-brand">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-tint text-brand">
                <ServiceIcon slug={service.slug} className="h-4 w-4" />
              </span>
              {service.shortName}
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              {service.tagline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-ink ring-1 ring-line">
                {service.capacity}
              </span>
              {service.standards.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-2 text-xs font-bold text-brand-strong"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`${home}#enquire`}
                className="group inline-flex h-12 items-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-strong"
              >
                Request a quote
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href={`${home}/services`}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-line bg-white px-6 text-sm font-semibold text-ink transition-colors hover:border-ink/25"
              >
                {t.nav.servicesAllLabel}
              </Link>
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-line bg-white/80 shadow-[0_40px_80px_-30px_rgba(10,17,40,0.3)]">
                {service.svg ? (
                  <AnimatedSvg src={service.svg} playOn="load" className="aspect-[16/9] w-full" />
                ) : (
                  <div className={`relative aspect-[16/9] w-full ${cover ? "" : "bg-gradient-to-br from-brand-tint to-white p-6"}`}>
                    <BrandImage
                      src={serviceImage(prospect.slug, service.slug) ?? service.image}
                      fallback={service.image}
                      alt={`${service.name} — ${prospect.displayName}`}
                      fill
                      sizes="720px"
                      className={cover ? "object-cover" : "object-contain"}
                    />
                  </div>
                )}
              </div>
              <span className="absolute -bottom-0 left-6 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white shadow-lg">
                {service.capacity}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ServiceOverview({
  prospect,
  service,
}: {
  prospect: ProspectConfig;
  service: Service;
}) {
  const t = getTemplates(prospect);
  const cover = prospect.designDirection.imageTreatment === "PhotoCover";
  const figureRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ov-parallax",
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Overview</p>
          <SplitLines
            text={`What ${t.serviceDetail.overviewHeadingPrefix} delivers in ${service.name.toLowerCase()}`}
            className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          />
          <p className="mt-6 text-base leading-relaxed text-ink-muted">{service.summary}</p>

          {service.features.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <li key={f} className="group flex items-start gap-3 rounded-xl border border-line bg-paper p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_16px_34px_-24px_rgba(0,82,255,0.4)]">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-110">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-relaxed text-ink">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <figure ref={figureRef} className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_-30px_rgba(10,17,40,0.3)]" data-cursor="Zoom">
            <div className={`relative aspect-[4/3] overflow-hidden ${cover ? "" : "bg-gradient-to-br from-brand-tint to-white p-8"}`}>
              <span className="ov-parallax absolute inset-0">
                <BrandImage
                  src={serviceImage(prospect.slug, service.slug) ?? service.image}
                  fallback={service.image}
                  alt={`${service.name} — ${prospect.displayName}`}
                  fill
                  sizes="720px"
                  className={cover ? "object-cover" : "object-contain"}
                />
              </span>
            </div>
            <figcaption className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
              <span className="text-xs font-semibold text-ink-muted">
                {service.shortName}(s) — {t.serviceDetail.figureCaptionSuffix} {prospect.displayName}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand-strong">
                <BadgeCheck className="h-4 w-4 text-brand" /> {t.serviceDetail.badge}
              </span>
            </figcaption>
          </figure>
          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            {t.serviceDetail.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function ServiceSpecs({ prospect, service }: { prospect: ProspectConfig; service: Service }) {
  const t = getTemplates(prospect);
  return (
    <section className="bg-paper py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Range &amp; capability</p>
          <SplitLines
            text={t.serviceDetail.specsHeading}
            className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            {service.series.map((s, i) => (
              <Reveal key={s} delay={i * 0.04}>
                <div className="flex items-start gap-5 border-b border-line px-6 py-6 last:border-0">
                  <span className="font-display text-2xl font-extrabold text-line">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 text-base font-semibold leading-relaxed text-ink">{s}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Capacity</p>
              <p className="mt-2 font-display text-2xl font-extrabold text-brand-strong">
                {service.capacity}
              </p>
            </div>
            {service.standards.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Tested &amp; certified to
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.standards.map((st) => (
                    <span key={st} className="flex items-center gap-1.5 rounded-lg bg-brand-tint px-3 py-2 text-xs font-bold text-brand-strong">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                <Sparkles className="h-3.5 w-3.5 text-brand" /> How we work
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink">
                {t.serviceDetail.footnote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceApplications({ service, prospect }: { service: Service; prospect: ProspectConfig }) {
  if (service.applications.length === 0) return null;
  const t = getTemplates(prospect);
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">{t.serviceDetail.applicationsKicker}</p>
          <SplitLines
            text={t.serviceDetail.applicationsHeading}
            className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink"
          />
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {service.applications.map((app, i) => (
            <Reveal key={app} delay={(i % 4) * 0.05}>
              <div className="group flex items-center gap-3 rounded-xl border border-line bg-paper px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-tint">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand transition-transform duration-300 group-hover:scale-150" aria-hidden />
                <span className="text-sm font-semibold text-ink">{app}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceTrust({ prospect }: { prospect: ProspectConfig }) {
  const t = getTemplates(prospect);
  const certifications = prospect.certifications;
  return (
    <section className="border-t border-line bg-white pb-16 pt-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center md:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">
            {certifications.length > 0 ? "Verifiable quality" : "Trusted AC specialists"}
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            {certifications.length > 0
              ? "Product lines are rated and certified by internationally recognised bodies, backed by ISO 9001, ISO 14001 and OHSAS 18001 quality, environmental and safety systems."
              : "47 years of keeping the UAE cool — honest quotes, reliable visits and work that carries a warranty we actually honour."}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap gap-2.5">
          {(certifications.length > 0 ? certifications : t.trustLines).map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-brand" />
              {c}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}