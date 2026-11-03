"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Filter,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LEAD_STAGES,
  formatCurrency,
  type DemoLead,
  type LeadStage,
  type RealEstateDemoData,
} from "@/lib/realEstateDemo";
import { RealEstateShell } from "./RealEstateShell";

const PRIORITIES = ["High", "Medium", "Low"] as const;

export function RealEstateLeads({
  prospect,
  base,
  demo,
}: {
  prospect: { displayName: string; companyName: string; location: string; slug: string };
  base: string;
  demo: RealEstateDemoData;
}) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<LeadStage | "All">("All");
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number] | "All">("All");
  const [agent, setAgent] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demo.leads.filter((lead) => {
      if (stage !== "All" && lead.stage !== stage) return false;
      if (priority !== "All" && lead.priority !== priority) return false;
      if (agent !== "All" && lead.agentId !== agent) return false;
      if (!q) return true;
      return [lead.name, lead.email, lead.preferredLocation, lead.interestType, lead.budgetLabel, ...lead.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [demo.leads, query, stage, priority, agent]);

  const stats = [
    { label: "Total leads", value: demo.metrics.totalLeads, icon: Users },
    { label: "New enquiries", value: demo.metrics.newEnquiries, icon: Target },
    { label: "Qualified", value: demo.metrics.qualifiedLeads, icon: TrendingUp },
    {
      label: "Combined budget",
      value: formatCurrency(
        demo.leads.reduce((sum, l) => sum + l.budgetValue, 0),
        demo.region
      ),
      icon: Wallet,
    },
  ];

  const dateLabel = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString(demo.locale, {
      day: "2-digit",
      month: "short",
    });

  const agentName = (id: string) => demo.agents.find((a) => a.id === id)?.name ?? "Unassigned";

  return (
    <RealEstateShell
      companyName={prospect.companyName}
      location={prospect.location}
      region={demo.region}
      currency={demo.currency}
      dateFormat={demo.dateFormat}
      base={base}
      active="leads"
      eyebrow="Lead Centre"
      title="Every enquiry, in one place"
      description="Track buyer, seller, investor and rental enquiries from first touch to appointment — with ownership, priorities and next actions."
    >
      <section className="grid grid-cols-2 gap-px overflow-hidden border border-[#D8D0C4]/70 bg-[#D8D0C4]/60 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-5">
            <div className="flex items-center gap-2 text-ink-muted">
              <stat.icon className="h-4 w-4 text-[#B7A17A]" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em]">
                {stat.label}
              </span>
            </div>
            <p className="mt-2 font-re-display text-2xl text-ink sm:text-3xl">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-4 border border-[#D8D0C4]/70 bg-white">
        <div className="flex flex-col gap-3 border-b border-[#D8D0C4]/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, location, budget, tag…"
              className="w-full border border-[#D8D0C4] bg-[#F7F4EE]/50 py-2.5 pl-9 pr-3 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-[#B7A17A]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill
              icon={Filter}
              value={stage}
              options={["All", ...LEAD_STAGES]}
              onChange={(v) => setStage(v as LeadStage | "All")}
              prefix="Stage"
            />
            <FilterPill
              icon={SlidersHorizontal}
              value={priority}
              options={["All", ...PRIORITIES]}
              onChange={(v) => setPriority(v as (typeof PRIORITIES)[number] | "All")}
              prefix="Priority"
            />
            <label className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-2.5 py-2 text-[11.5px] font-medium text-ink">
              <Users className="h-3.5 w-3.5 text-[#B7A17A]" />
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
            <span className="ml-auto text-[11px] text-ink-muted">
              {filtered.length} of {demo.leads.length}
            </span>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[980px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#D8D0C4]/60 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                <th className="px-4 py-3">Lead</th>
                <th className="px-4 py-3">Interest</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Agent</th>
                <th className="px-4 py-3 text-right">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="group border-b border-[#D8D0C4]/40 transition-colors last:border-0 hover:bg-[#F7F4EE]/60"
                >
                  <td className="px-4 py-3">
                    <Link href={`${base}/leads/${lead.id}`} className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#111110] text-[10px] font-bold text-white">
                        {initials(lead.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 font-semibold text-ink group-hover:text-[#8a7444]">
                          {lead.name}
                          <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                        <span className="flex items-center gap-2 text-[10.5px] text-ink-muted">
                          <span className="inline-flex items-center gap-0.5">
                            <Mail className="h-2.5 w-2.5" />
                            {lead.email}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{lead.interestType}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{lead.budgetLabel}</td>
                  <td className="px-4 py-3 text-ink-muted">{lead.preferredLocation}</td>
                  <td className="px-4 py-3">
                    <StageBadge stage={lead.stage} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={lead.priority} />
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{agentName(lead.agentId)}</td>
                  <td className="px-4 py-3 text-right text-[11.5px] tabular-nums text-ink-muted">
                    {dateLabel(lead.nextFollowUp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="divide-y divide-[#D8D0C4]/50 lg:hidden">
          {filtered.map((lead) => (
            <li key={lead.id}>
              <Link href={`${base}/leads/${lead.id}`} className="block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#111110] text-[10px] font-bold text-white">
                      {initials(lead.name)}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-ink">{lead.name}</p>
                      <p className="text-[11px] text-ink-muted">
                        {lead.interestType} · {lead.budgetLabel}
                      </p>
                    </div>
                  </div>
                  <PriorityBadge priority={lead.priority} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10.5px] text-ink-muted">
                  <StageBadge stage={lead.stage} />
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {lead.preferredLocation}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {lead.phone}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-re-display text-xl text-ink">No leads match those filters</p>
            <p className="mt-2 text-[12.5px] text-ink-muted">
              Try clearing the search or widening the stage and priority filters.
            </p>
          </div>
        )}
      </section>
    </RealEstateShell>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

function StageBadge({ stage }: { stage: LeadStage }) {
  const tone =
    stage === "Won"
      ? "bg-emerald-50 text-emerald-700"
      : stage === "Lost"
        ? "bg-[#F7F4EE] text-ink-muted line-through"
        : stage === "New"
          ? "bg-[#B7A17A]/15 text-[#8a7444]"
          : "bg-[#111110]/6 text-ink-muted";
  return (
    <span className={cn("inline-block rounded-full px-2 py-1 text-[10px] font-semibold", tone)}>
      {stage}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: DemoLead["priority"] }) {
  const tone =
    priority === "High"
      ? "bg-[#B7A17A]/15 text-[#8a7444]"
      : priority === "Medium"
        ? "bg-[#111110]/6 text-ink-muted"
        : "bg-[#F7F4EE] text-ink-muted";
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em]",
        tone
      )}
    >
      {priority}
    </span>
  );
}

function FilterPill<T extends string>({
  icon: Icon,
  value,
  options,
  onChange,
  prefix,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  prefix: string;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-2.5 py-2 text-[11.5px] font-medium text-ink">
      <Icon className="h-3.5 w-3.5 text-[#B7A17A]" />
      <span className="text-ink-muted">{prefix}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-transparent text-[11.5px] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="h-3 w-3 text-ink-muted" />
    </label>
  );
}
