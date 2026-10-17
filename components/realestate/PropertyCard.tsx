import Link from "next/link";
import { BedDouble, Bath, Maximize, MapPin, ArrowUpRight, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandImage } from "@/components/visual/BrandImage";
import type { PropertyListing, PropertyStatus, PropertyAvailability } from "@/lib/types";

export const STATUS_LABEL: Record<PropertyStatus, string> = {
  sale: "For sale",
  rent: "For rent",
  "off-plan": "Off-plan",
  investment: "Investment",
  commercial: "Commercial",
  managed: "Managed",
};

export const AVAILABILITY_LABEL: Record<PropertyAvailability, string | null> = {
  available: null,
  "coming-soon": "Coming soon",
  sold: "Sold",
  let: "Let agreed",
  unknown: null,
};

export function PropertyCard({
  listing,
  base,
  variant = "editorial",
  priority = false,
}: {
  listing: PropertyListing;
  base: string;
  variant?: "editorial" | "wide";
  priority?: boolean;
}) {
  const href = `${base}/properties/${listing.slug}`;
  const availability = AVAILABILITY_LABEL[listing.availability];
  const meta = [
    listing.bedrooms != null ? { icon: BedDouble, label: `${listing.bedrooms} bed` } : null,
    listing.bathrooms != null ? { icon: Bath, label: `${listing.bathrooms} bath` } : null,
    listing.areaLabel ? { icon: Maximize, label: listing.areaLabel } : null,
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[];

  return (
    <Link
      href={href}
      data-cursor="View"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-500 hover:border-ink/20 hover:shadow-[0_30px_60px_-30px_rgba(10,17,40,0.35)]",
        variant === "wide" && "sm:flex-row"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-ink/5",
          variant === "wide" ? "aspect-[4/3] sm:aspect-auto sm:w-[46%]" : "aspect-[4/3]"
        )}
      >
        {listing.images[0] ? (
          <BrandImage
            src={listing.images[0]}
            fallback={listing.images[1]}
            alt={listing.title}
            width={900}
            height={675}
            priority={priority}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            Image on request
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-ink/85 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
            {STATUS_LABEL[listing.status]}
          </span>
          {availability && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">
              <Timer className="h-3 w-3" />
              {availability}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
              {listing.propertyType}
              {listing.reference ? ` · ${listing.reference}` : ""}
            </p>
            <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-ink">
              {listing.title}
            </h3>
          </div>
          <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        {(listing.location || listing.community) && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {[listing.community, listing.location].filter(Boolean).join(" · ")}
          </p>
        )}

        {meta.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-[13px] text-ink-muted">
            {meta.map((m) => (
              <span key={m.label} className="inline-flex items-center gap-1.5">
                <m.icon className="h-4 w-4" />
                {m.label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <p className="font-serif text-lg font-semibold text-ink">
              {listing.priceLabel ?? "Price on application"}
            </p>
            {listing.tenure && (
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">{listing.tenure}</p>
            )}
          </div>
        </div>

        {listing.illustrative && (
          <p className="mt-3 text-[10.5px] uppercase tracking-[0.16em] text-ink-muted/80">
            Illustrative example — not verified inventory
          </p>
        )}
      </div>
    </Link>
  );
}
