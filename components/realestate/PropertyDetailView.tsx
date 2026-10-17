"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandImage } from "@/components/visual/BrandImage";
import { PropertyCard } from "./PropertyCard";
import { EnquiryPanel } from "./EnquiryPanel";
import type { ProspectConfig, PropertyListing, PropertyStatus, PropertyAvailability } from "@/lib/types";

const STATUS_LABEL: Record<PropertyStatus, string> = {
  sale: "For sale",
  rent: "For rent",
  "off-plan": "Off-plan",
  investment: "Investment",
  commercial: "Commercial",
  managed: "Managed",
};

const AVAILABILITY_LABEL: Record<PropertyAvailability, string | null> = {
  available: "Available",
  "coming-soon": "Coming soon",
  sold: "Sold",
  let: "Let agreed",
  unknown: null,
};

export function PropertyDetailView({
  prospect,
  listing,
  others,
}: {
  prospect: ProspectConfig;
  listing: PropertyListing;
  others: PropertyListing[];
}) {
  const base = `/${prospect.slug}`;
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const images = listing.images.length ? listing.images : [prospect.images.heroPoster];
  const availability = AVAILABILITY_LABEL[listing.availability];
  const meta = [
    listing.bedrooms != null ? { icon: BedDouble, label: "Bedrooms", value: String(listing.bedrooms) } : null,
    listing.bathrooms != null ? { icon: Bath, label: "Bathrooms", value: String(listing.bathrooms) } : null,
    listing.areaLabel ? { icon: Maximize, label: "Area", value: listing.areaLabel } : null,
    { icon: Building2, label: "Type", value: listing.propertyType },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string; value: string }[];

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, go]);

  return (
    <article className="bg-paper pt-[72px]">
      {/* ── Gallery ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8">
        <Link
          href={`${base}/properties`}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          All properties
        </Link>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink/5"
            data-cursor="Expand"
            aria-label="Open gallery"
          >
            <BrandImage
              src={images[active]}
              alt={listing.title}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {active + 1} / {images.length} · View gallery
            </span>
          </button>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-2">
            {images.slice(0, 4).map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => {
                  setActive(i);
                  if (i >= 1) setLightbox(true);
                }}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-xl bg-ink/5 transition-opacity",
                  i === active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : "opacity-90 hover:opacity-100"
                )}
                aria-label={`View image ${i + 1}`}
              >
                <BrandImage src={src} alt="" fill sizes="25vw" className="object-cover" />
                {i === 3 && images.length > 4 && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/60 text-sm font-semibold text-white">
                    +{images.length - 4} more
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Title block ──────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                {STATUS_LABEL[listing.status]}
              </span>
              {availability && (
                <span className="rounded-full border border-line px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                  {availability}
                </span>
              )}
              {listing.illustrative && (
                <span className="rounded-full border border-dashed border-line px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  Illustrative example
                </span>
              )}
            </div>

            <h1 className="mt-5 font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
              {listing.title}
            </h1>
            {(listing.location || listing.community) && (
              <p className="mt-3 inline-flex items-center gap-2 text-ink-muted">
                <MapPin className="h-4 w-4" />
                {[listing.community, listing.location].filter(Boolean).join(" · ")}
              </p>
            )}

            <div className="mt-8 grid grid-cols-2 gap-5 border-y border-line py-6 sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label}>
                  <m.icon className="h-5 w-5 text-accent" />
                  <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                    {m.label}
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold text-ink">{m.value}</p>
                </div>
              ))}
            </div>

            {listing.description && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-bold tracking-tight text-ink">About this property</h2>
                <p className="mt-3 leading-relaxed text-ink-muted">{listing.description}</p>
              </div>
            )}

            {listing.highlights.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-bold tracking-tight text-ink">Highlights</h2>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {listing.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-[15px] text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {listing.features.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-bold tracking-tight text-ink">Features</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-line bg-card px-3.5 py-1.5 text-[13px] text-ink-muted"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {listing.illustrative && (
              <p className="mt-8 flex items-start gap-2 rounded-xl border border-dashed border-line bg-card p-4 text-[13px] leading-relaxed text-ink-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                This is an illustrative example prepared to demonstrate how a verified listing would be presented.
                Price, dimensions and availability are placeholders and must be replaced with confirmed detail
                before publishing.
              </p>
            )}
          </div>

          {/* ── Sticky enquiry rail ──────────────────────────── */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
              <p className="font-serif text-3xl font-semibold text-ink">
                {listing.priceLabel ?? "Price on application"}
              </p>
              {listing.tenure && (
                <p className="mt-1 text-[12px] uppercase tracking-[0.16em] text-ink-muted">{listing.tenure}</p>
              )}
              {listing.reference && (
                <p className="mt-4 text-[13px] text-ink-muted">
                  Ref. <span className="font-semibold text-ink">{listing.reference}</span>
                </p>
              )}

              {listing.agent && (
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-6">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/15 font-display text-sm font-bold text-accent">
                    {listing.agent.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{listing.agent.name}</p>
                    {listing.agent.title && (
                      <p className="text-[12px] text-ink-muted">{listing.agent.title}</p>
                    )}
                  </div>
                </div>
              )}

              <a
                href="#enquire-property"
                className="shine mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-white transition-colors hover:bg-brand"
                data-cursor="Enquire"
              >
                {prospect.voice?.assistant?.actions?.[0]?.label ?? "Arrange a viewing"}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="mt-3 text-center text-[12px] text-ink-muted">
                Availability confirmed before any viewing.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Enquiry ──────────────────────────────────────────── */}
      <div id="enquire-property" className="scroll-mt-24 border-t border-line bg-card py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <h2 className="mb-8 text-center font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Enquire about this property
          </h2>
          <EnquiryPanel prospect={prospect} presetListing={listing} presetIntent="viewing" />
        </div>
      </div>

      {/* ── Similar ──────────────────────────────────────────── */}
      {others.length > 0 && (
        <div className="border-t border-line bg-paper py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              More properties
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {others.slice(0, 3).map((l) => (
                <PropertyCard key={l.id} listing={l} base={base} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Property gallery"
          >
            <div className="flex items-center justify-between px-5 py-4 text-white md:px-8">
              <span className="text-sm font-semibold">
                {listing.title} — {active + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                aria-label="Close gallery"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition-colors hover:bg-white hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink md:left-8"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="relative h-full w-full max-w-6xl">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={images[active]}
                    alt=""
                    fill
                    sizes="90vw"
                    className="object-contain"
                  />
                </motion.div>
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-ink md:right-8"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center gap-2 overflow-x-auto px-5 pb-6">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-opacity",
                    i === active ? "ring-2 ring-white" : "opacity-50 hover:opacity-100"
                  )}
                  aria-label={`Image ${i + 1}`}
                >
                  <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
