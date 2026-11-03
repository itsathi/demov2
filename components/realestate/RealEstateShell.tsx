"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Sparkles, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export const RE_MODULES = [
  { label: "Overview", href: "/overview", key: "overview" },
  { label: "Inventory", href: "/properties", key: "inventory" },
  { label: "Leads", href: "/leads", key: "leads" },
  { label: "Pipeline", href: "/pipeline", key: "pipeline" },
  { label: "Viewings", href: "/viewings", key: "viewings" },
  { label: "Agents", href: "/agents", key: "agents" },
  { label: "Owners", href: "/owners", key: "owners" },
  { label: "Documents", href: "/documents", key: "documents" },
  { label: "Market", href: "/market", key: "market" },
] as const;

export type ReModuleKey =
  | "overview"
  | "inventory"
  | "leads"
  | "pipeline"
  | "viewings"
  | "agents"
  | "owners"
  | "documents"
  | "market";

export function RealEstateShell({
  companyName,
  location,
  region,
  currency,
  base,
  active,
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  companyName: string;
  location: string;
  region: string;
  currency: string;
  dateFormat: string;
  base: string;
  active: ReModuleKey;
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F4EE] pb-24 pt-[72px] text-ink">
      <div className="border-b border-[#D8D0C4]/60 bg-[#F7F4EE]/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-5 py-6 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
                <span className="h-px w-10 bg-[#B7A17A]" />
                {companyName} · {eyebrow}
              </div>
              <h1 className="mt-4 font-re-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-muted">
                  {description}
                </p>
              ) : null}
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#B7A17A]" />
                  {location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-[#B7A17A]" />
                  {currency} · {region}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#D8D0C4] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7A17A]" />
                Demo data
              </span>
              {actions}
              <Link
                href={base}
                className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-4 py-2 text-[12px] font-semibold text-ink transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
              >
                Public site
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <nav className="mt-6 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {RE_MODULES.map((mod) => {
              const isActive = mod.key === active;
              return (
                <Link
                  key={mod.key}
                  href={`${base}${mod.href}`}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors",
                    isActive
                      ? "bg-[#111110] text-white"
                      : "text-ink-muted hover:bg-white hover:text-ink"
                  )}
                >
                  {mod.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1400px] px-5 md:px-8">
        {children}

        <p className="mt-8 flex items-start gap-2 border border-dashed border-[#D8D0C4] bg-white/60 p-3 text-[11px] leading-relaxed text-ink-muted">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B7A17A]" />
          This workspace is populated with a coherent fictional demo dataset generated from
          illustrative listing inventory. Records, values and identities are not real client
          information and should not be used for live decisions.
        </p>
      </div>
    </div>
  );
}
