import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getProspect, getTemplates } from "@/lib/prospect";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { RatingStrip } from "@/components/trust/TrustStrip";
import { CtaEngineered } from "@/components/cta/CtaEngineered";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect) return {};
  const t = getTemplates(prospect);
  return {
    title: t.servicesIndexMetaTitle,
    description: t.servicesIndexMetaDescription,
  };
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect) notFound();
  const t = getTemplates(prospect);

  return (
    <div className="bg-paper pt-[72px]">
      <section className="relative overflow-hidden">
        <div className="technical-grid absolute inset-0 opacity-40" aria-hidden />
        <div
          className="absolute -top-32 right-[-10%] h-[480px] w-[640px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 62%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-8 lg:pt-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
            <Link href={`/${prospect.slug}`} className="transition-colors hover:text-ink">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ink">{t.nav.productsLabel}</span>
          </nav>
          <Reveal>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-brand">
              {t.servicesKicker}
            </p>
            <SplitLines text={t.servicesIndexHeading} as="h1" className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl" />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {t.servicesIndexBlurb}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">
              {prospect.services.length} {prospect.services.length === 1 ? "range" : "ranges"}
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-ink ring-1 ring-line">
              Est. {prospect.established}
            </span>
            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-ink ring-1 ring-line">
              {prospect.location}
            </span>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-2">
            {prospect.services.map((s) => (
              <Link
                key={s.slug}
                href={`/${prospect.slug}/services/${s.slug}`}
                className="rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-ink-muted backdrop-blur transition-colors hover:border-brand hover:text-brand-strong"
              >
                {s.shortName}
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-white pb-4 pt-2">
        <ServiceGrid
          base={`/${prospect.slug}`}
          services={prospect.services}
          variant="index"
        />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-white p-8 md:flex-row md:items-center lg:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Not sure which range fits?</p>
              <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">
                Send the load — we&apos;ll spec it.
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                Share capacity, site constraints and application. The {prospect.displayName} team replies with selection and lead times.
              </p>
            </div>
            <Link
              href={`/${prospect.slug}#enquire`}
              className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-strong"
            >
              {t.nav.quoteLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      <RatingStrip prospect={prospect} />
      <CtaEngineered prospect={prospect} />
    </div>
  );
}