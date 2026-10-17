"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Bath, BedDouble, MapPin, Maximize, Timer } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { BrandImage } from "@/components/visual/BrandImage";
import { EASE } from "@/lib/motion";
import { getTemplates } from "@/lib/prospect";
import { AVAILABILITY_LABEL, STATUS_LABEL } from "./PropertyCard";
import type { ProspectConfig, PropertyListing } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned horizontal showcase for real-estate featured listings.
 *
 * Progressive enhancement mirrors `ProjectRail`: on capable desktop the section
 * pins and the track scrubs horizontally as you scroll; on mobile and for
 * reduced-motion users it degrades to a native snap-scroll carousel. Images
 * travel slightly slower than their frames for depth.
 */
export function PropertyRail({
  prospect,
  listings,
  base,
}: {
  prospect: ProspectConfig;
  listings: PropertyListing[];
  base: string;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [pinned, setPinned] = useState(false);
  const t = getTemplates(prospect);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const amount = () => Math.max(track.scrollWidth - window.innerWidth + 64, 0);
    const canPin = window.innerWidth >= 1024 && !reduced && amount() > 40;
    setPinned(canPin);
    if (!canPin) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: EASE.scrub },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${amount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      tl.to(track, { x: () => -amount() });
      tl.fromTo(".rail-img", { yPercent: -8 }, { yPercent: 8, ease: EASE.scrub }, 0);
      tl.fromTo(
        ".rail-progress",
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: "left 50%", ease: EASE.scrub },
        0
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} id="projects" className="relative scroll-mt-24 overflow-hidden bg-ink text-white">
      <div className="technical-grid-dark pointer-events-none absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 md:px-8 lg:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
                {t.projectsIntro.kicker}
              </p>
            </Reveal>
            <SplitLines
              text={t.projectsIntro.headline}
              className="mt-3 max-w-2xl font-serif text-3xl font-medium tracking-tight text-white sm:text-4xl"
            />
            <Reveal delay={0.06}>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
                {t.projectsIntro.body}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link
              href={`${base}/properties`}
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-white"
            >
              All properties
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/25 transition-colors group-hover:border-white group-hover:bg-white group-hover:text-ink">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-8 h-px w-full bg-white/10">
          <div className="rail-progress h-full w-full bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>

      <div
        className={
          pinned
            ? "mt-8 overflow-hidden"
            : "no-scrollbar mt-8 snap-x snap-mandatory overflow-x-auto"
        }
      >
        <div
          ref={trackRef}
          className="flex w-max gap-5 px-5 pb-16 md:px-8 lg:gap-7 lg:pb-20"
        >
          {listings.map((listing, i) => (
            <RailCard key={listing.id} listing={listing} base={base} priority={i < 2} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RailCard({
  listing,
  base,
  priority = false,
  index,
}: {
  listing: PropertyListing;
  base: string;
  priority?: boolean;
  index: number;
}) {
  const availability = AVAILABILITY_LABEL[listing.availability];
  const meta = [
    listing.bedrooms != null ? { icon: BedDouble, label: `${listing.bedrooms}` } : null,
    listing.bathrooms != null ? { icon: Bath, label: `${listing.bathrooms}` } : null,
    listing.areaLabel ? { icon: Maximize, label: listing.areaLabel } : null,
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[];

  return (
    <Link
      href={`${base}/properties/${listing.slug}`}
      data-cursor="View"
      className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-colors duration-500 hover:border-white/25 sm:w-[380px] lg:w-[400px]"
    >
      <span
        className="pointer-events-none absolute -right-2 -top-4 z-10 select-none font-display text-[5.5rem] font-extrabold leading-none text-white/[0.06] transition-colors duration-500 group-hover:text-accent/25"
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative aspect-[3/4] overflow-hidden bg-ink">
        {listing.images[0] && (
          <div className="rail-img absolute inset-0 scale-[1.2] will-change-transform">
            <BrandImage
              src={listing.images[0]}
              fallback={listing.images[1]}
              alt={listing.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 78vw, 400px"
              className="object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />

        <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink backdrop-blur">
            {STATUS_LABEL[listing.status]}
          </span>
          {availability && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
              <Timer className="h-3 w-3" />
              {availability}
            </span>
          )}
        </div>

        <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-white/0 transition-all duration-300 group-hover:text-white" />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/60">
            {listing.propertyType}
            {listing.reference ? ` · ${listing.reference}` : ""}
          </p>
          <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-white">
            {listing.title}
          </h3>
          {(listing.community || listing.location) && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] text-white/65">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
              {[listing.community, listing.location].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-white/70">
              {meta.map((m) => (
                <span key={m.label} className="inline-flex items-center gap-1.5">
                  <m.icon className="h-4 w-4" />
                  {m.label}
                </span>
              ))}
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-all group-hover:border-accent group-hover:bg-accent">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>

          <p className="mt-4 font-serif text-lg font-semibold text-white">
            {listing.priceLabel ?? "Price on application"}
          </p>
        </div>
      </div>
    </Link>
  );
}
