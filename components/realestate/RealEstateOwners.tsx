"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  FileSignature,
  Mail,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, type RealEstateDemoData } from "@/lib/realEstateDemo";
import type { PropertyListing } from "@/lib/types";
import { RealEstateShell } from "./RealEstateShell";

export function RealEstateOwners({
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
  const [query, setQuery] = useState("");
  const [agreement, setAgreement] = useState("All");

  const rows = useMemo(() => {
    return demo.owners
      .map((owner) => {
        const owned = listings.filter((l) => owner.propertyIds.includes(l.id));
        const value = owned.reduce((sum, l) => sum + (l.priceValue ?? 0), 0);
        return { owner, owned, value };
      })
      .filter((row) => {
        if (agreement !== "All" && row.owner.agreement !== agreement) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [row.owner.name, row.owner.email, row.owner.type, ...row.owned.map((l) => l.title)]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => b.value - a.value);
  }, [demo.owners, listings, query, agreement]);

  const totalValue = demo.owners.reduce(
    (sum, owner) =>
      sum +
      listings
        .filter((l) => owner.propertyIds.includes(l.id))
        .reduce((s, l) => s + (l.priceValue ?? 0), 0),
    0
  );
  const exclusive = demo.owners.filter((o) => o.agreement === "Exclusive").length;
  const represented = new Set(demo.owners.flatMap((o) => o.propertyIds)).size;

  return (
    <RealEstateShell
      companyName={prospect.companyName}
      location={prospect.location}
      region={demo.region}
      currency={demo.currency}
      dateFormat={demo.dateFormat}
      base={base}
      active="owners"
      eyebrow="Owners & Mandates"
      title="Owner relationships"
      description="Private owners, investors and developers — with mandate type, represented property and portfolio value."
    >
      <section className="grid grid-cols-2 gap-px overflow-hidden border border-[#D8D0C4]/70 bg-[#D8D0C4]/60 lg:grid-cols-4">
        <Summary label="Owners" value={String(demo.owners.length)} />
        <Summary label="Exclusive mandates" value={String(exclusive)} />
        <Summary label="Properties represented" value={String(represented)} />
        <Summary label="Portfolio value" value={formatCurrency(totalValue, demo.region)} />
      </section>

      <section className="mt-4 border border-[#D8D0C4]/70 bg-white">
        <div className="flex flex-col gap-3 border-b border-[#D8D0C4]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search owner, email or property…"
              className="w-full border border-[#D8D0C4] bg-[#F7F4EE]/50 py-2.5 pl-9 pr-3 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-[#B7A17A]"
            />
          </div>
          <label className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-2.5 py-2 text-[11.5px] font-medium text-ink">
            <FileSignature className="h-3.5 w-3.5 text-[#B7A17A]" />
            <select
              value={agreement}
              onChange={(e) => setAgreement(e.target.value)}
              className="bg-transparent text-[11.5px] outline-none"
            >
              {["All", "Exclusive", "Open", "Off-market"].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="divide-y divide-[#D8D0C4]/50">
          {rows.map(({ owner, owned, value }) => (
            <article key={owner.id} className="grid gap-4 p-5 lg:grid-cols-[1.2fr_1fr_auto]">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#111110] text-[11px] font-bold text-white">
                    {initials(owner.name)}
                  </span>
                  <div>
                    <h2 className="text-[13.5px] font-semibold leading-tight text-ink">
                      {owner.name}
                    </h2>
                    <p className="text-[11px] text-ink-muted">
                      {owner.type} · client since {owner.since}
                    </p>
                  </div>
                  <AgreementBadge agreement={owner.agreement} />
                </div>
                <div className="mt-3 space-y-1 text-[10.5px] text-ink-muted">
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-[#B7A17A]" />
                    {owner.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-[#B7A17A]" />
                    {owner.phone}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                  Represented properties ({owned.length})
                </p>
                <ul className="mt-2 space-y-1">
                  {owned.length === 0 && (
                    <li className="text-[11px] text-ink-muted">No linked listings.</li>
                  )}
                  {owned.slice(0, 3).map((property) => (
                    <li key={property.id}>
                      <Link
                        href={`${base}/properties/${property.slug}`}
                        className="flex items-baseline justify-between gap-2 text-[11.5px] text-ink transition-colors hover:text-[#8a7444]"
                      >
                        <span className="truncate">{property.title}</span>
                        <span className="shrink-0 tabular-nums text-ink-muted">
                          {property.priceLabel ?? formatCurrency(property.priceValue ?? 0, demo.region)}
                        </span>
                      </Link>
                    </li>
                  ))}
                  {owned.length > 3 && (
                    <li className="text-[10.5px] text-ink-muted">+{owned.length - 3} more</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center gap-4 border-t border-[#D8D0C4]/40 pt-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                    Portfolio
                  </p>
                  <p className="font-re-display text-xl text-ink">
                    {formatCurrency(value, demo.region)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-muted">
                    <Building2 className="h-3 w-3" /> {owned.length} listing
                    {owned.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {rows.length === 0 && (
            <div className="p-12 text-center">
              <p className="font-re-display text-xl text-ink">No owners match that search</p>
              <p className="mt-2 text-[12.5px] text-ink-muted">
                Try a different name, or reset the agreement filter.
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-ink-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B7A17A]" />
        Owner profiles and mandates are fictional. Portfolio value is the sum of illustrative listing
        prices and does not represent a real appraisal or transaction.
      </p>
    </RealEstateShell>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
      <p className="mt-2 font-re-display text-xl text-ink sm:text-2xl">{value}</p>
    </div>
  );
}

function AgreementBadge({ agreement }: { agreement: string }) {
  return (
    <span
      className={cn(
        "ml-auto shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em]",
        agreement === "Exclusive"
          ? "bg-[#B7A17A]/15 text-[#8a7444]"
          : agreement === "Open"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-[#F7F4EE] text-ink-muted"
      )}
    >
      {agreement}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}
