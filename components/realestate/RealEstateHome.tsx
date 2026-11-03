import { Star, BadgeCheck, MapPin, Quote, Sparkles, ArrowRight, ArrowUpRight, Building2 } from "lucide-react";
import Link from "next/link";
import { BrandImage } from "@/components/visual/BrandImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { PropertyRail } from "./PropertyRail";
import { EnquiryPanel } from "./EnquiryPanel";
import { RealEstateHero } from "./RealEstateHero";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig } from "@/lib/types";

export function RealEstateHome({ prospect }: { prospect: ProspectConfig }) {
  const t = getTemplates(prospect);
  const base = `/${prospect.slug}`;
  const listings = prospect.listings ?? [];
  const featured = listings.slice(0, 8);
  const heroImage = prospect.images.heroPoster || listings[0]?.images[0] || prospect.images.officeBanner;
  const secondaryImage =
    listings[1]?.images?.[0] || prospect.images.interior || listings[0]?.images?.[1];
  const hasRating = prospect.socialProof.googleRating > 0;
  const research = prospect.research;

  const realServices = (research?.services ?? []).filter(Boolean).slice(0, 10);
  const realAreas = (research?.serviceAreas ?? prospect.serviceAreas ?? []).filter(
    (a) => a && !/^(united arab emirates|australia)$/i.test(a)
  );

  const capabilityBody =
    research?.description && research.description.length > 60
      ? research.description
      : "A considered approach to property — curated homes, architectural distinction, and discreet advisory shaped by place and lifestyle.";

  return (
    <>
      <RealEstateHero
        prospect={prospect}
        t={t}
        heroImage={heroImage}
        secondaryImage={secondaryImage}
        listings={listings}
      />

      {/* ── Editorial Trust Band ────────────────────────────────── */}
      <section className="border-b border-line/60 bg-[#F7F4EE]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-7 text-center sm:flex-row sm:text-left md:px-8">
          {hasRating && (
            <div className="flex items-center gap-4">
              <span className="font-re-display text-4xl tabular-nums text-ink">
                {prospect.socialProof.googleRating.toFixed(1)}
              </span>
              <div>
                <span className="flex items-center gap-0.5 text-[#B7A17A]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                  ))}
                </span>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  {prospect.socialProof.reviewCount} Reviews
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {(t.trustLines ?? []).slice(0, 4).map((line) => (
              <p key={line} className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7A17A]" />
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Collection - Editorial ────────────────────── */}
      {featured.length > 0 && <PropertyRail prospect={prospect} listings={featured} base={base} />}

      {/* ── Curated Discovery by Lifestyle ─────────────────────── */}
      <section className="bg-[#F7F4EE] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
              <span className="h-px w-10 bg-[#B7A17A]" />
              Curated Living
            </div>
            <h2 className="mt-6 font-re-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
              Discover by Lifestyle
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
              A considered selection of homes defined by architecture, setting and way of life.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Contemporary Residences", image: listings[0]?.images?.[0] || heroImage },
              { title: "Waterfront Living", image: listings[1]?.images?.[0] || secondaryImage },
              { title: "Architectural Homes", image: listings[2]?.images?.[0] || heroImage },
              { title: "Private Estates", image: listings[3]?.images?.[0] || secondaryImage },
              { title: "Penthouses", image: listings[4]?.images?.[0] || heroImage },
              { title: "Investment Properties", image: listings[5]?.images?.[0] || secondaryImage },
            ].map((cat, i) => (
              <Reveal key={cat.title} delay={i * 0.05}>
                <Link
                  href={`${base}/properties`}
                  className="group relative block aspect-[4/5] overflow-hidden"
                  data-cursor="Explore"
                >
                  <BrandImage
                    src={cat.image || heroImage}
                    alt={cat.title}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="font-re-display text-2xl text-white">{cat.title}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-white/80">
                      View Collection
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial Story / Advisory ──────────────────────────── */}
      <section className="relative bg-[#111110] py-24 text-white md:py-32">
        <div className="grain-re absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden">
              <BrandImage
                src={prospect.images.showreelPoster || heroImage}
                alt={prospect.displayName}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-4 hidden max-w-[280px] border border-white/10 bg-[#111110]/90 p-6 backdrop-blur sm:block lg:-right-10">
              <Quote className="h-6 w-6 text-[#B7A17A]" />
              <p className="mt-3 font-re-display text-xl italic leading-snug text-white/90">
                &ldquo;{prospect.slogan}&rdquo;
              </p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
                <span className="h-px w-10 bg-[#B7A17A]" />
                Private Advisory
              </div>
              <h2 className="mt-6 font-re-display text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                A More Considered Way to Find Home
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {capabilityBody}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-10 space-y-4">
                {(t.capability?.points ?? []).slice(0, 4).map((p) => (
                  <li key={p.text} className="flex items-start gap-3 text-[15px] text-white/90">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#B7A17A]" />
                    {p.text}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-12 flex flex-wrap gap-6">
                <Link
                  href={`${base}/properties`}
                  className="group inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm font-semibold text-white transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
                >
                  Explore the Collection
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`${base}#enquire`}
                  className="group inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm font-semibold text-white transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
                >
                  Speak to an Advisor
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Locations / Lifestyle ──────────────────────────────── */}
      {realAreas.length > 0 && (
        <section className="bg-[#F7F4EE] py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
                <span className="h-px w-10 bg-[#B7A17A]" />
                Places &amp; Neighborhoods
              </div>
              <h2 className="mt-6 font-re-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Where Distinction Meets Place
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                A portfolio shaped by context — architecture and lifestyle, considered together.
              </p>
            </Reveal>

            <div className="mt-12 flex flex-wrap gap-3">
              {realAreas.slice(0, 12).map((area) => (
                <Reveal key={area}>
                  <Link
                    href={`${base}/properties`}
                    className="group inline-flex items-center gap-2 border border-[#D8D0C4] px-5 py-2.5 text-sm text-ink transition-all hover:border-[#B7A17A] hover:bg-white"
                  >
                    <MapPin className="h-4 w-4 text-[#B7A17A]" />
                    {area}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Final Conversion ──────────────────────────────────── */}
      <section id="enquire" className="scroll-mt-24 relative bg-[#111110] py-24 text-white md:py-32">
        <div className="grain-re absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
          <Reveal>
            <div className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
              <span className="h-px w-10 bg-[#B7A17A]" />
              Begin the Conversation
              <span className="h-px w-10 bg-[#B7A17A]" />
            </div>
            <h2 className="mt-6 font-re-display text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              The Right Property Starts with a Conversation
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Whether searching for your next home or considering selling, our advisors are at your service with discretion and insight.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`${base}/properties`}
                className="group inline-flex items-center gap-2 bg-[#B7A17A] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#a08c68]"
              >
                Request a Private Viewing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`${base}#enquire`}
                className="group inline-flex items-center gap-2 border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
              >
                Discuss Selling Your Property
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-16">
            <div className="mx-auto max-w-3xl">
              <EnquiryPanel prospect={prospect} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
