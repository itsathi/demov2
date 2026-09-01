import Link from "next/link";
import {
  ArrowUpRight,
  Wind,
  Snowflake,
  Network,
  Boxes,
  Fan,
  AirVent,
  Waves,
  Cpu,
  Split,
  Wrench,
  Settings,
  ShieldPlus,
  DraftingCompass,
  Thermometer,
  Route,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { TiltCard } from "@/components/motion/TiltCard";
import type { Service } from "@/lib/types";

export const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "air-handling-units": Wind,
  chillers: Snowflake,
  "vrf-systems": Network,
  "packaged-units": Boxes,
  "condensing-units": Fan,
  "fan-coil-units": AirVent,
  "swimpool-units": Waves,
  "computer-room-air-conditioners": Cpu,
  "package-split-units": Split,
  "parts-service": Wrench,
  "ac-installation": Wrench,
  "ac-maintenance": Settings,
  maintenance: Settings,
  "duct-cleaning": AirVent,
  "hvac-solutions": Network,
  "villa-maintenance": Boxes,
  "emergency-ac-repair": Wrench,
  coolguard: ShieldPlus,
  "design-consultancy": DraftingCompass,
  ventilation: Fan,
  refrigeration: Thermometer,
  "duct-works": Route,
};

export function getServiceIconComponent(slug: string): React.ComponentType<{ className?: string }> {
  if (SERVICE_ICONS[slug]) return SERVICE_ICONS[slug];
  const s = slug.toLowerCase();
  if (s.includes("duct") || s.includes("vent") || s.includes("air")) return AirVent;
  if (s.includes("chill") || s.includes("cool") || s.includes("freeze")) return Snowflake;
  if (s.includes("maintain") || s.includes("setting") || s.includes("prevent")) return Settings;
  if (s.includes("install") || s.includes("repair") || s.includes("wrench") || s.includes("fix")) return Wrench;
  if (s.includes("villa") || s.includes("box") || s.includes("pack")) return Boxes;
  if (s.includes("solut") || s.includes("net") || s.includes("system")) return Network;
  return Wind;
}

export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = getServiceIconComponent(slug);
  return <Icon className={className} />;
}

type ServiceGridProps = {
  services: Service[];
  base: string;
  variant?: "editorial" | "index";
  kicker?: string;
  heading?: string;
  blurb?: string;
};

export function ServiceGrid({
  services,
  base,
  variant = "editorial",
  kicker = "Product families",
  heading = "The catalogue — built around your cooling load",
  blurb,
}: ServiceGridProps) {
  if (variant === "index") {
    return (
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {services.map((service, i) => {
          const Icon = getServiceIconComponent(service.slug);
          return (
            <Reveal key={service.slug} delay={i * 0.04}>
              <Link
                href={`${base}/services/${service.slug}`}
                className="group grid gap-5 border-t border-line py-8 transition-colors last:border-b md:grid-cols-[1.4fr_2fr_1fr] md:items-center"
                data-cursor="View"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand transition-all duration-300 group-hover:rotate-6 group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-xl font-extrabold tracking-tight text-ink">
                        {service.name}
                      </h3>
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted ring-1 ring-line">
                        {service.shortName}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted line-clamp-2">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                <div className="pl-16 md:pl-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Capacity range</p>
                  <p className="mt-1 font-display text-base font-bold text-ink">{service.capacity}</p>
                  {service.series.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {service.series.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-md bg-paper px-2 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-line">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden justify-end md:flex">
                  <span
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-lg border border-line px-4 text-sm font-semibold text-ink transition-all",
                      "group-hover:border-brand group-hover:bg-brand group-hover:text-white"
                    )}
                  >
                    View range <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    );
  }

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">{kicker}</p>
          <SplitLines text={heading} className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl" />
          {blurb && <p className="mt-4 text-base leading-relaxed text-ink-muted">{blurb}</p>}
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: "1400px" }}>
          {services.map((service, i) => {
            const Icon = getServiceIconComponent(service.slug);
            return (
              <TiltCard key={service.slug} className="group relative h-full">
                <Link
                  href={`${base}/services/${service.slug}`}
                  className="shine relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 transition-colors duration-300 hover:border-ink/15"
                  data-cursor="View"
                >
                  <span
                    className="pointer-events-none absolute -right-3 -top-5 select-none font-display text-[6rem] font-extrabold leading-none text-ink/[0.045] transition-colors duration-500 group-hover:text-brand/10"
                    style={{ transform: "translateZ(30px)" }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-tint text-brand transition-all duration-300 group-hover:-rotate-6 group-hover:bg-brand group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-lg font-extrabold tracking-tight text-ink">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted line-clamp-3">{service.tagline}</p>

                  <div className="mt-auto flex items-center justify-between pt-6">
                    <span className="rounded-full bg-paper px-3 py-1 text-[11px] font-bold text-ink-muted ring-1 ring-line">
                      {service.capacity}
                    </span>
                    <span className="font-display text-2xl font-extrabold tabular-nums text-line transition-colors duration-300 group-hover:text-brand">
                      {i + 1 < 10 ? `0${i + 1}` : i + 1}
                    </span>
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}