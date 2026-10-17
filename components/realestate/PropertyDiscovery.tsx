"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyCard } from "./PropertyCard";
import type { PropertyListing, PropertyStatus } from "@/lib/types";

const STATUS_FILTERS: { id: PropertyStatus | "all"; label: string }[] = [
  { id: "all", label: "All properties" },
  { id: "sale", label: "For sale" },
  { id: "rent", label: "For rent" },
  { id: "off-plan", label: "Off-plan" },
  { id: "investment", label: "Investment" },
];

export function PropertyDiscovery({
  listings,
  base,
  initialQuery = "",
}: {
  listings: PropertyListing[];
  base: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<PropertyStatus | "all">("all");
  const [type, setType] = useState("all");
  const [beds, setBeds] = useState("all");
  const [sort, setSort] = useState("featured");

  const types = useMemo(
    () => Array.from(new Set(listings.map((l) => l.propertyType).filter(Boolean))),
    [listings]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = listings.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (type !== "all" && l.propertyType !== type) return false;
      if (beds !== "all" && (l.bedrooms ?? 0) < Number(beds)) return false;
      if (!q) return true;
      return [l.title, l.location, l.community, l.propertyType, l.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    if (sort === "price-asc")
      out = [...out].sort((a, b) => (a.priceValue ?? Infinity) - (b.priceValue ?? Infinity));
    if (sort === "price-desc")
      out = [...out].sort((a, b) => (b.priceValue ?? -Infinity) - (a.priceValue ?? -Infinity));
    return out;
  }, [listings, query, status, type, beds, sort]);

  const activeFilters = (status !== "all" ? 1 : 0) + (type !== "all" ? 1 : 0) + (beds !== "all" ? 1 : 0);

  return (
    <div>
      <div className="rounded-2xl border border-line bg-card p-5 sm:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by area, community or property…"
            className="w-full rounded-lg border border-line bg-white py-3 pl-11 pr-10 text-sm text-ink transition-colors placeholder:text-ink-muted focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
            data-cursor="Search"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatus(f.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors",
                status === f.id
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-white text-ink-muted hover:border-ink/30 hover:text-ink"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
          <Select label="Property type" value={type} onChange={setType}>
            <option value="all">Any type</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select label="Bedrooms" value={beds} onChange={setBeds}>
            <option value="all">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)}>
                {n}+ bed
              </option>
            ))}
          </Select>
          <Select label="Sort by" value={sort} onChange={setSort}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price — low to high</option>
            <option value="price-desc">Price — high to low</option>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-muted">
          <span className="font-bold text-ink">{results.length}</span>{" "}
          {results.length === 1 ? "property" : "properties"}
          {activeFilters > 0 && " matching your filters"}
        </p>
        {activeFilters > 0 && (
          <button
            type="button"
            onClick={() => {
              setStatus("all");
              setType("all");
              setBeds("all");
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Reset filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((l, i) => (
            <PropertyCard key={l.id} listing={l} base={base} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-card/50 p-12 text-center">
          <p className="font-serif text-xl font-semibold text-ink">No properties match that search.</p>
          <p className="mt-2 text-sm text-ink-muted">
            Adjust the filters, or send a brief and the team will shortlist for you.
          </p>
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
      >
        {children}
      </select>
    </label>
  );
}
