"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  ChevronRight,
  CircleDollarSign,
  Target,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEAL_STAGES,
  formatCurrency,
  formatMoneyExact,
  type DemoDeal,
  type DealStage,
  type RealEstateDemoData,
} from "@/lib/realEstateDemo";
import type { PropertyListing } from "@/lib/types";
import { RealEstateShell } from "./RealEstateShell";

export function RealEstatePipeline({
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [agent, setAgent] = useState("All");

  const deals = useMemo(
    () => (agent === "All" ? demo.deals : demo.deals.filter((d) => d.agentId === agent)),
    [demo.deals, agent]
  );

  const columns = useMemo(
    () =>
      DEAL_STAGES.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);
        return {
          stage,
          deals: stageDeals,
          value: stageDeals.reduce((sum, d) => sum + d.value, 0),
        };
      }),
    [deals]
  );

  const selected = demo.deals.find((d) => d.id === selectedId) ?? null;
  const openValue = deals
    .filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage))
    .reduce((sum, d) => sum + d.value, 0);
  const wonValue = deals
    .filter((d) => d.stage === "Closed Won")
    .reduce((sum, d) => sum + d.value, 0);
  const wonCount = deals.filter((d) => d.stage === "Closed Won").length;
  const closedCount = deals.filter((d) =>
    ["Closed Won", "Closed Lost"].includes(d.stage)
  ).length;
  const winRate = closedCount ? Math.round((wonCount / closedCount) * 100) : 0;

  const leadName = (id: string) => demo.leads.find((l) => l.id === id)?.name ?? "Client";
  const propertyFor = (deal: DemoDeal) => listings.find((l) => l.id === deal.propertyId);
  const agentFor = (id: string) => demo.agents.find((a) => a.id === id);
  const dateLabel = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString(demo.locale, {
      day: "2-digit",
      month: "short",
    });

  return (
    <RealEstateShell
      companyName={prospect.companyName}
      location={prospect.location}
      region={demo.region}
      currency={demo.currency}
      dateFormat={demo.dateFormat}
      base={base}
      active="pipeline"
      eyebrow="Sales Pipeline"
      title="The deal journey, end to end"
      description="Every live opportunity from qualification to agreement — with value, probability, ownership and the next action required."
      actions={
        <label className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-3 py-2 text-[11.5px] font-medium text-ink">
          <UserRound className="h-3.5 w-3.5 text-[#B7A17A]" />
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="bg-transparent text-[11.5px] outline-none"
          >
            <option value="All">All agents</option>
            {demo.agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      }
    >
      <section className="grid grid-cols-2 gap-px overflow-hidden border border-[#D8D0C4]/70 bg-[#D8D0C4]/60 lg:grid-cols-4">
        <Summary label="Open pipeline" value={formatCurrency(openValue, demo.region)} />
        <Summary label="Closed won" value={formatCurrency(wonValue, demo.region)} />
        <Summary
          label="Active deals"
          value={String(deals.filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage)).length)}
        />
        <Summary label="Win rate" value={`${winRate}%`} />
      </section>

      <section className="mt-4 overflow-x-auto border border-[#D8D0C4]/70 bg-white [scrollbar-width:thin]">
        <div className="flex min-w-[1180px] gap-px bg-[#D8D0C4]/50">
          {columns.map((column) => (
            <div key={column.stage} className="flex-1 bg-[#F7F4EE]/50">
              <div className="border-b border-[#D8D0C4]/60 bg-white p-3">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink">
                  {column.stage}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10.5px] text-ink-muted">
                  <span>{column.deals.length} deal{column.deals.length === 1 ? "" : "s"}</span>
                  <span className="font-semibold tabular-nums text-[#8a7444]">
                    {column.value ? formatCurrency(column.value, demo.region) : "—"}
                  </span>
                </div>
              </div>
              <ul className="space-y-2 p-2">
                {column.deals.map((deal) => {
                  const property = propertyFor(deal);
                  const agent = agentFor(deal.agentId);
                  return (
                    <li key={deal.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(deal.id)}
                        className={cn(
                          "w-full border bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#B7A17A] hover:shadow-[0_20px_30px_-24px_rgba(17,17,16,0.5)]",
                          selectedId === deal.id
                            ? "border-[#B7A17A] ring-1 ring-[#B7A17A]/30"
                            : "border-[#D8D0C4]/70"
                        )}
                      >
                        <p className="truncate text-[12px] font-semibold text-ink">
                          {leadName(deal.leadId)}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[10.5px] leading-snug text-ink-muted">
                          {property?.title ?? "Property TBC"}
                        </p>
                        <p className="mt-2 font-re-display text-base text-ink">
                          {formatCurrency(deal.value, demo.region)}
                        </p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#F7F4EE]">
                          <div
                            className="h-full rounded-full bg-[#B7A17A]"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[9.5px] text-ink-muted">
                          <span>{deal.probability}% · {dateLabel(deal.expectedClose)}</span>
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#111110] text-[8px] font-bold text-white">
                            {agent?.initials ?? "—"}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
                {column.deals.length === 0 && (
                  <li className="rounded border border-dashed border-[#D8D0C4] p-3 text-center text-[10.5px] text-ink-muted/70">
                    No deals
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[80] flex justify-end bg-[#111110]/30 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close deal panel"
            className="absolute inset-0"
            onClick={() => setSelectedId(null)}
          />
          <aside className="relative flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#D8D0C4]/60 p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B7A17A]">
                  Opportunity
                </p>
                <h2 className="mt-1 font-re-display text-2xl text-ink">{leadName(selected.leadId)}</h2>
                <p className="mt-1 text-[12px] text-ink-muted">
                  {propertyFor(selected)?.title ?? "Property TBC"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#D8D0C4] text-ink-muted transition-colors hover:border-ink hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              <p className="font-re-display text-3xl text-ink">
                {formatMoneyExact(selected.value, demo.region)}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <PanelStat icon={Target} label="Stage" value={selected.stage} />
                <PanelStat icon={CircleDollarSign} label="Probability" value={`${selected.probability}%`} />
                <PanelStat icon={Calendar} label="Expected close" value={dateLabel(selected.expectedClose)} />
                <PanelStat
                  icon={UserRound}
                  label="Agent"
                  value={agentFor(selected.agentId)?.name ?? "Unassigned"}
                />
              </div>

              <div className="mt-5 border border-[#D8D0C4]/60 bg-[#F7F4EE]/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Next action
                </p>
                <p className="mt-1.5 text-[13px] font-medium text-ink">{selected.nextAction}</p>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Stage progression
                </p>
                <ol className="mt-3 space-y-1.5">
                  {DEAL_STAGES.filter((s) => s !== "Closed Lost").map((stage, i) => {
                    const currentIndex = DEAL_STAGES.indexOf(selected.stage);
                    const stageIndex = DEAL_STAGES.indexOf(stage);
                    const reached = stageIndex <= currentIndex;
                    return (
                      <li key={stage} className="flex items-center gap-2 text-[11.5px]">
                        <span
                          className={cn(
                            "grid h-5 w-5 place-items-center rounded-full border text-[9px] font-bold",
                            reached
                              ? "border-[#B7A17A] bg-[#B7A17A] text-white"
                              : "border-[#D8D0C4] text-ink-muted/60"
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className={reached ? "font-semibold text-ink" : "text-ink-muted"}>
                          {stage}
                        </span>
                        {stageIndex === currentIndex && (
                          <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#B7A17A]" />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              <p className="mt-5 text-[11px] leading-relaxed text-ink-muted">{selected.notes}</p>

              <Link
                href={`${base}/leads/${selected.leadId}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-1.5 bg-[#111110] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#B7A17A]"
              >
                Open lead record
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      )}
    </RealEstateShell>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-5">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">{label}</p>
      <p className="mt-2 font-re-display text-2xl text-ink sm:text-3xl">{value}</p>
    </div>
  );
}

function PanelStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#D8D0C4]/60 p-3">
      <div className="flex items-center gap-1.5 text-ink-muted">
        <Icon className="h-3.5 w-3.5 text-[#B7A17A]" />
        <span className="text-[9.5px] font-bold uppercase tracking-[0.1em]">{label}</span>
      </div>
      <p className="mt-1.5 text-[12px] font-semibold text-ink">{value}</p>
    </div>
  );
}
