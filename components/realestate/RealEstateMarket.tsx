"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Building2,
  Clock,
  Info,
  Landmark,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, type RealEstateDemoData } from "@/lib/realEstateDemo";
import type { PropertyListing } from "@/lib/types";
import { RealEstateShell } from "./RealEstateShell";

export function RealEstateMarket({
  prospect,
  base,
  demo,
  listings,
}: {
  prospect: { displayName: string; companyName: string; location: string; slug: string };
  base: string;
  demo: RealEstateDemoData;
  listings: PropertyListing[];
}) {
  const stats = useMemo(() => {
    const prices = listings
      .map((l) => l.priceValue)
      .filter((v): v is number => typeof v === "number" && v > 0)
      .sort((a, b) => a - b);
    const sum = prices.reduce((a, b) => a + b, 0);
    const median = prices.length
      ? prices.length % 2 === 1
        ? prices[(prices.length - 1) / 2]
        : Math.round((prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2)
      : 0;
    const quartile = Math.ceil(prices.length / 4) || 0;
    const bands = quartile
      ? Array.from({ length: 4 }).map((_, i) => {
          const slice = prices.slice(i * quartile, i === 3 ? prices.length : (i + 1) * quartile);
          return {
            label: slice.length
              ? `${formatCurrency(slice[0], demo.region)} – ${formatCurrency(
                  slice[slice.length - 1],
                  demo.region
                )}`
              : "—",
            count: slice.length,
            min: slice[0] ?? 0,
            max: slice[slice.length - 1] ?? 0,
          };
        })
      : [];
    return {
      count: prices.length,
      average: prices.length ? Math.round(sum / prices.length) : 0,
      median,
      min: prices[0] ?? 0,
      max: prices[prices.length - 1] ?? 0,
      bands,
      maxBand: Math.max(1, ...bands.map((b) => b.count)),
    };
  }, [listings, demo.region]);

  const avgDemand = Math.round(
    demo.marketAreas.reduce((sum, area) => sum + area.demand, 0) /
      Math.max(1, demo.marketAreas.length)
  );
  const avgDom = Math.round(
    demo.marketAreas.reduce((sum, area) => sum + area.avgDaysOnMarket, 0) /
      Math.max(1, demo.marketAreas.length)
  );

  return (
    <RealEstateShell
      companyName={prospect.companyName}
      location={prospect.location}
      region={demo.region}
      currency={demo.currency}
      dateFormat={demo.dateFormat}
      base={base}
      active="market"
      eyebrow="Market Intelligence"
      title="Where the portfolio sits"
      description="A view of the areas represented by this inventory — listing counts, illustrative demand signals and time on market."
    >
      <section className="grid grid-cols-2 gap-px overflow-hidden border border-[#D8D0C4]/70 bg-[#D8D0C4]/60 lg:grid-cols-4">
        <Summary icon={MapPin} label="Areas tracked" value={String(demo.marketAreas.length)} />
        <Summary icon={Building2} label="Listings sampled" value={String(stats.count)} />
        <Summary
          icon={TrendingUp}
          label="Average asking price"
          value={formatCurrency(stats.average, demo.region)}
        />
        <Summary icon={Clock} label="Avg. days on market" value={String(avgDom)} />
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="border border-[#D8D0C4]/70 bg-white p-6 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-re-display text-xl text-ink">Area overview</h2>
              <p className="mt-1 text-[12px] text-ink-muted">
                Demand index is an illustrative demo metric, not a market statistic.
              </p>
            </div>
            <span className="rounded-full bg-[#F7F4EE] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              Avg. demand {avgDemand}
            </span>
          </div>

          <ul className="mt-6 space-y-4">
            {demo.marketAreas.map((area) => (
              <li key={area.area} className="border border-[#D8D0C4]/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                      <MapPin className="h-3.5 w-3.5 text-[#B7A17A]" />
                      {area.area}
                    </p>
                    <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.1em] text-ink-muted">
                      {area.type} · {area.listings} listing{area.listings === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-re-display text-lg leading-none text-ink">
                      {formatCurrency(area.avgPrice, demo.region)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-ink-muted">avg. asking</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="w-24 shrink-0 text-[9.5px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                    Demand
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F7F4EE]">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        area.demand >= 70
                          ? "bg-emerald-600"
                          : area.demand >= 40
                            ? "bg-[#B7A17A]"
                            : "bg-[#C4B8A4]"
                      )}
                      style={{ width: `${area.demand}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-ink">
                    {area.demand}
                  </span>
                  <span className="w-20 shrink-0 text-right text-[10.5px] text-ink-muted">
                    {area.avgDaysOnMarket}d on market
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-4">
          <section className="border border-[#D8D0C4]/70 bg-white p-6">
            <h2 className="font-re-display text-xl text-ink">Price bands</h2>
            <p className="mt-1 text-[12px] text-ink-muted">
              {stats.count} illustrative listings by asking price
            </p>
            <ul className="mt-5 space-y-3">
              {stats.bands.map((band, i) => (
                <li key={i}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-ink">{band.label}</span>
                    <span className="tabular-nums text-ink-muted">{band.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#F7F4EE]">
                    <div
                      className="h-full rounded-full bg-[#B7A17A]"
                      style={{ width: `${(band.count / stats.maxBand) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
              {stats.bands.length === 0 && (
                <li className="text-[12px] text-ink-muted">No priced listings available.</li>
              )}
            </ul>
          </section>

          <section className="border border-[#D8D0C4]/70 bg-white p-6">
            <h2 className="flex items-center gap-2 font-re-display text-xl text-ink">
              <BarChart3 className="h-4 w-4 text-[#B7A17A]" /> Inventory status
            </h2>
            <ul className="mt-5 space-y-3">
              {demo.statusDistribution.map((row) => (
                <li key={row.status}>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-medium capitalize text-ink">
                      {row.status.replace("-", " ")}
                    </span>
                    <span className="tabular-nums text-ink-muted">{row.count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F7F4EE]">
                    <div
                      className="h-full rounded-full bg-[#111110]"
                      style={{
                        width: `${(row.count / Math.max(1, listings.length)) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="border border-[#D8D0C4]/70 bg-white p-6">
            <h2 className="flex items-center gap-2 font-re-display text-xl text-ink">
              <Landmark className="h-4 w-4 text-[#B7A17A]" /> Asking price range
            </h2>
            <dl className="mt-4 space-y-2.5 text-[12px]">
              <Row label="Lowest" value={formatCurrency(stats.min, demo.region)} />
              <Row label="Median" value={formatCurrency(stats.median, demo.region)} />
              <Row label="Average" value={formatCurrency(stats.average, demo.region)} />
              <Row label="Highest" value={formatCurrency(stats.max, demo.region)} />
            </dl>
          </section>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 border border-[#D8D0C4]/70 bg-white p-4 text-[11px] leading-relaxed text-ink-muted">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B7A17A]" />
        These figures are computed only from this demo prospect&apos;s illustrative listing inventory. The
        demand index and days-on-market values are synthetic demo signals generated for presentation.
        They are not verified market data, valuations or regulatory information, and should not be used
        for pricing or investment decisions.
      </p>
    </RealEstateShell>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-2 text-ink-muted">
        <Icon className="h-4 w-4 text-[#B7A17A]" />
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="mt-2 font-re-display text-xl text-ink sm:text-2xl">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
