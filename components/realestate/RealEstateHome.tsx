import { Star, BadgeCheck, MapPin, Quote, Sparkles } from "lucide-react";
import { BrandImage } from "@/components/visual/BrandImage";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/fx/Marquee";
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

  // Real, verified content from the prospect's own website — used to
  // personalise the page beyond the shared template.
  const realServices = (research?.services ?? []).filter(Boolean).slice(0, 10);
  const realAreas = (research?.serviceAreas ?? prospect.serviceAreas ?? []).filter(
    (a) => a && !/^(united arab emirates|australia)$/i.test(a)
  );
  const trustSignals = (research?.trustSignals ?? []).filter(Boolean).slice(0, 4);
  const capabilityBody =
    research?.description && research.description.length > 60
      ? research.description
      : t.capability.body;

  const regionsGroups =
    realAreas.length >= 3
      ? [
          { title: `${prospect.serviceAreas?.[0] ?? "The markets we serve"}`, items: realAreas.slice(0, 5) },
          { title: "Also serving", items: realAreas.slice(5, 10) },
        ].filter((g) => g.items.length > 0)
      : t.regions.groups;

  return (
    <>
      <RealEstateHero
        prospect={prospect}
        t={t}
        heroImage={heroImage}
        secondaryImage={secondaryImage}
        listings={listings}
      />

      {/* ── Trust band ───────────────────────────────────────── */}
      <section className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-5 py-8 sm:flex-row sm:items-center md:px-8">
          {hasRating && (
            <div className="flex items-center gap-4">
              <span className="font-serif text-4xl font-semibold tabular-nums text-ink">
                {prospect.socialProof.googleRating}
              </span>
              <div>
                <span className="flex items-center gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                  ))}
                </span>
                <p className="mt-1 text-[13px] text-ink-muted">
                  {prospect.socialProof.reviewCount} Google reviews
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {(trustSignals.length ? trustSignals : t.trustLines).map((line) => (
              <p key={line} className="flex items-center gap-2 text-sm font-semibold text-ink">
                <BadgeCheck className="h-4 w-4 text-accent" />
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Marquee
        speed={30}
        className="border-b border-line bg-paper py-5 font-serif text-3xl font-medium uppercase tracking-tight text-ink/80"
      >
        {[...new Set([t.nav.productsLabel, prospect.location, t.brand.line2, ...realAreas.slice(0, 4), "Buy", "Rent", "Sell"])].map(
          (w, i) => (
            <span key={`${w}-${i}`} className="flex items-center">
              <span className={i % 2 === 1 ? "px-6 text-ink/40" : "px-6"}>{w}</span>
              <span className="text-[0.5em] text-accent">✦</span>
            </span>
          )
        )}
      </Marquee>

      {/* ── Featured properties — pinned horizontal showcase ───── */}
      {featured.length > 0 && <PropertyRail prospect={prospect} listings={featured} base={base} />}

      {/* ── What we do — real services from the prospect's own site ── */}
      {realServices.length >= 3 && (
        <section className="border-y border-line bg-card py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <Reveal>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                {t.servicesKicker}
              </div>
              <h2 className="mt-3 max-w-2xl font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
                {prospect.displayName} in {realAreas[0] ?? prospect.location.split(",")[0]}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {realServices.map((s, i) => (
                <Reveal key={s + i} delay={(i % 3) * 0.05}>
                  <div className="group flex items-start gap-3 border-t border-line pt-4">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-tint text-[11px] font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[15px] font-medium leading-snug text-ink">{s}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Story / capability ───────────────────────────────── */}
      <section id="capability" className="scroll-mt-24 border-b border-line bg-paper py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <BrandImage
                src={prospect.images.showreelPoster || heroImage}
                alt={prospect.displayName}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden max-w-[240px] rounded-2xl border border-line bg-card p-5 shadow-xl sm:block lg:-right-6">
              <Quote className="h-6 w-6 text-accent" />
              <p className="mt-2 font-serif text-lg italic leading-snug text-ink">
                &ldquo;{prospect.slogan}&rdquo;
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
                {t.capability.kicker}
              </p>
              <h2 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
                {t.capability.headline}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">{capabilityBody}</p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-8 space-y-4">
                {t.capability.points.map((p) => (
                  <li key={p.text} className="flex items-start gap-3 text-[15px] text-ink">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    {p.text}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 flex flex-wrap gap-8 border-t border-line pt-8">
                {t.capability.stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-serif text-3xl font-semibold text-ink">{s.value}</p>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-ink-muted">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="bg-ink py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
              {t.process.kicker}
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
              {t.process.headline}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">{t.process.body}</p>
          </Reveal>

          <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {t.process.steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.06}>
                <div className="border-t border-white/15 pt-5">
                  <span className="font-serif text-2xl font-semibold text-accent">{s.step}</span>
                  <h3 className="mt-3 font-display text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Areas ────────────────────────────────────────────── */}
      <section className="bg-paper py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
              <MapPin className="h-3.5 w-3.5" />
              {t.regions.kicker}
            </div>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
              {t.regions.headline}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{t.regions.body}</p>
          </Reveal>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {regionsGroups.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-line bg-card p-7">
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">{g.title}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px] font-medium text-ink-muted"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enquiry ──────────────────────────────────────────── */}
      <section id="enquire" className="scroll-mt-24 border-t border-line bg-card py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
                {t.nav.quoteLabel}
              </p>
              <h2 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
                {prospect.cta.heading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">{prospect.cta.body}</p>
            </div>
          </Reveal>
          <div className="mx-auto max-w-4xl">
            <EnquiryPanel prospect={prospect} />
          </div>
        </div>
      </section>
    </>
  );
}
