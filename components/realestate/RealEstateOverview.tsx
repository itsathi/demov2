"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Home,
  KeyRound,
  Layers,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEAL_STAGES,
  formatCurrency,
  type DemoViewing,
  type RealEstateDemoData,
} from "@/lib/realEstateDemo";
import type { PropertyListing } from "@/lib/types";

type ProspectSummary = {
  slug: string;
  displayName: string;
  companyName: string;
  location: string;
};

const MODULES = [
  { label: "Overview", href: "/overview", key: "overview" },
  { label: "Inventory", href: "/properties", key: "inventory" },
  { label: "Leads", href: "/leads", key: "leads" },
  { label: "Pipeline", href: "/pipeline", key: "pipeline" },
  { label: "Viewings", href: "/viewings", key: "viewings" },
  { label: "Agents", href: "/agents", key: "agents" },
  { label: "Owners", href: "/owners", key: "owners" },
  { label: "Documents", href: "/documents", key: "documents" },
  { label: "Market", href: "/market", key: "market" },
];

export function RealEstateOverview({
  prospect,
  base,
  listings,
  demo,
}: {
  prospect: ProspectSummary;
  base: string;
  listings: PropertyListing[];
  demo: RealEstateDemoData;
}) {
  const [activeTab, setActiveTab] = useState<"command" | "today">("command");
  const m = demo.metrics;

  const primaryKpis = [
    {
      label: "Total properties",
      value: m.totalProperties,
      sub: `${m.availableInventory} available now`,
      icon: Home,
    },
    {
      label: "Active opportunities",
      value: m.activeOpportunities,
      sub: `${m.closedDeals} closed won`,
      icon: Target,
    },
    {
      label: "Pipeline value",
      value: formatCurrency(m.pipelineValue, demo.region),
      sub: `${demo.currency} · live deals`,
      icon: Wallet,
    },
    {
      label: "Viewings scheduled",
      value: m.upcomingViewings,
      sub: "upcoming this week",
      icon: Calendar,
    },
  ];

  const secondaryKpis = [
    { label: "Available inventory", value: m.availableInventory, icon: KeyRound },
    { label: "Under offer", value: m.underOffer, icon: Layers },
    { label: "Sold / let", value: m.soldLet, icon: CheckCircle2 },
    { label: "New enquiries", value: m.newEnquiries, icon: Sparkles },
    { label: "Qualified leads", value: m.qualifiedLeads, icon: TrendingUp },
    { label: "Avg days on market", value: m.avgDaysOnMarket, icon: Clock },
  ];

  const enquirySeries = useMemo(() => {
    const weeks = 8;
    const newest = Math.max(
      0,
      ...demo.leads.map((lead) => new Date(`${lead.createdAt}T12:00:00`).getTime())
    );
    const buckets = Array.from({ length: weeks }, () => 0);
    for (const lead of demo.leads) {
      const created = new Date(`${lead.createdAt}T12:00:00`).getTime();
      const diffDays = Math.floor((newest - created) / 86_400_000);
      const idx = weeks - 1 - Math.floor(diffDays / 7);
      if (idx >= 0 && idx < weeks) buckets[idx] += 1;
    }
    const max = Math.max(1, ...buckets);
    return buckets.map((count, i) => ({
      count,
      height: Math.round((count / max) * 100),
      label: i === weeks - 1 ? "This wk" : `W${i + 1}`,
    }));
  }, [demo.leads]);

  const pipelineStages = useMemo(
    () =>
      DEAL_STAGES.map((stage) => ({
        stage,
        deals: demo.deals.filter((d) => d.stage === stage),
      })).map((entry) => ({
        ...entry,
        count: entry.deals.length,
        value: entry.deals.reduce((sum, d) => sum + d.value, 0),
      })),
    [demo.deals]
  );
  const maxStageCount = Math.max(1, ...pipelineStages.map((s) => s.count));

  const sortedTasks = useMemo(
    () =>
      [...demo.tasks].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        return a.due.localeCompare(b.due);
      }),
    [demo.tasks]
  );

  const upcoming = useMemo(
    () =>
      [...demo.viewings]
        .filter((v) => v.status === "Scheduled")
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
        .slice(0, 4),
    [demo.viewings]
  );

  const agentLeaderboard = useMemo(
    () =>
      demo.agents
        .map((agent) => {
          const agentDeals = demo.deals.filter((d) => d.agentId === agent.id);
          return {
            agent,
            deals: agentDeals.length,
            won: agentDeals.filter((d) => d.stage === "Closed Won").length,
            value: agentDeals
              .filter((d) => !["Closed Lost"].includes(d.stage))
              .reduce((sum, d) => sum + d.value, 0),
          };
        })
        .sort((a, b) => b.value - a.value),
    [demo.agents, demo.deals]
  );

  const leadSourceMax = Math.max(1, ...demo.leadSourcePerformance.map((s) => s.leads));

  const dateLabel = (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString(demo.locale, { day: "2-digit", month: "short" });
  };

  const listingById = (id?: string) => listings.find((l) => l.id === id);
  const leadById = (id?: string) => demo.leads.find((l) => l.id === id);
  const agentById = (id?: string) => demo.agents.find((a) => a.id === id);

  return (
    <div className="min-h-screen bg-[#F7F4EE] pb-24 pt-[72px] text-ink">
      {/* ── Command bar ─────────────────────────────────────────── */}
      <div className="border-b border-[#D8D0C4]/60 bg-[#F7F4EE]/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-5 py-6 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
                <span className="h-px w-10 bg-[#B7A17A]" />
                {prospect.companyName}
              </div>
              <h1 className="mt-4 font-re-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
                Real Estate Overview
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#B7A17A]" />
                  {prospect.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-[#B7A17A]" />
                  {demo.currency} · {demo.region}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#D8D0C4] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7A17A]" />
                Demo data
              </span>
              <Link
                href={base}
                className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-4 py-2 text-[12px] font-semibold text-ink transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
              >
                Public site
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`${base}/leads`}
                className="inline-flex items-center gap-1.5 bg-[#111110] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#B7A17A]"
              >
                Open lead center
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Module nav */}
          <nav className="mt-6 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MODULES.map((mod) => {
              const active = mod.key === "overview";
              return (
                <Link
                  key={mod.key}
                  href={`${base}${mod.href}`}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-colors",
                    active
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
        {/* ── Primary KPI cards ─────────────────────────────────── */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {primaryKpis.map((kpi, i) => (
            <div
              key={kpi.label}
              className="group relative overflow-hidden border border-[#D8D0C4]/70 bg-white p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_40px_70px_-50px_rgba(17,17,16,0.5)]"
            >
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-[#B7A17A]/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#111110] text-white">
                  <kpi.icon className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-muted/70">
                  0{i + 1}
                </span>
              </div>
              <p className="relative mt-5 font-re-display text-3xl tracking-tight text-ink sm:text-4xl">
                {kpi.value}
              </p>
              <p className="relative mt-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {kpi.label}
              </p>
              <p className="relative mt-3 text-[12px] text-ink-muted/80">{kpi.sub}</p>
            </div>
          ))}
        </section>

        {/* ── Secondary KPI strip ───────────────────────────────── */}
        <section className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-[#D8D0C4]/70 bg-[#D8D0C4]/60 sm:grid-cols-3 xl:grid-cols-6">
          {secondaryKpis.map((kpi) => (
            <div key={kpi.label} className="bg-white p-4">
              <div className="flex items-center gap-2 text-ink-muted">
                <kpi.icon className="h-4 w-4 text-[#B7A17A]" />
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em]">
                  {kpi.label}
                </span>
              </div>
              <p className="mt-2 font-re-display text-2xl text-ink">{kpi.value}</p>
            </div>
          ))}
        </section>

        {/* ── Tabs: Command / Today ─────────────────────────────── */}
        <div className="mt-8 flex items-center gap-1 border-b border-[#D8D0C4]/70">
          {([
            { id: "command", label: "Command center" },
            { id: "today", label: "Today's focus" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-3 text-[13px] font-semibold transition-colors",
                activeTab === tab.id
                  ? "border-[#B7A17A] text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "command" ? (
          <>
            {/* ── Charts row ────────────────────────────────────── */}
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {/* Enquiry trend */}
              <div className="border border-[#D8D0C4]/70 bg-white p-6 lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-re-display text-xl text-ink">Enquiry trend</h2>
                    <p className="mt-1 text-[12px] text-ink-muted">
                      New leads received over the last 8 weeks
                    </p>
                  </div>
                  <span className="rounded-full bg-[#F7F4EE] px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                    {m.totalLeads} total leads
                  </span>
                </div>
                <div className="mt-8 flex h-40 items-end gap-2 sm:gap-3">
                  {enquirySeries.map((point, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-[11px] font-semibold tabular-nums text-ink-muted">
                        {point.count}
                      </span>
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className="w-full rounded-t-sm bg-gradient-to-t from-[#B7A17A] to-[#D6C3A1] transition-all duration-500"
                          style={{ height: `${Math.max(6, point.height)}%` }}
                        />
                      </div>
                      <span className="text-[9.5px] uppercase tracking-[0.08em] text-ink-muted/70">
                        {point.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory distribution */}
              <div className="border border-[#D8D0C4]/70 bg-white p-6">
                <h2 className="font-re-display text-xl text-ink">Inventory by type</h2>
                <p className="mt-1 text-[12px] text-ink-muted">
                  {m.totalProperties} properties across the collection
                </p>
                <ul className="mt-6 space-y-3">
                  {demo.inventoryDistribution.length === 0 && (
                    <li className="text-[12px] text-ink-muted">No inventory recorded.</li>
                  )}
                  {demo.inventoryDistribution.map((row) => (
                    <li key={row.type}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium text-ink">{row.type}</span>
                        <span className="tabular-nums text-ink-muted">{row.count}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F7F4EE]">
                        <div
                          className="h-full rounded-full bg-[#111110]"
                          style={{
                            width: `${Math.max(
                              8,
                              (row.count / Math.max(1, m.totalProperties)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Pipeline + Lead sources ───────────────────────── */}
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="border border-[#D8D0C4]/70 bg-white p-6 lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-re-display text-xl text-ink">Sales pipeline</h2>
                    <p className="mt-1 text-[12px] text-ink-muted">
                      Opportunities by stage · {formatCurrency(m.pipelineValue, demo.region)} in play
                    </p>
                  </div>
                  <Link
                    href={`${base}/pipeline`}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-muted transition-colors hover:text-ink"
                  >
                    Open <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <ul className="mt-6 space-y-3">
                  {pipelineStages.map((row) => (
                    <li key={row.stage} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 text-[11.5px] font-medium text-ink">
                        {row.stage}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F7F4EE]">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            row.stage === "Closed Won"
                              ? "bg-emerald-600"
                              : row.stage === "Closed Lost"
                                ? "bg-[#C4B8A4]"
                                : "bg-[#B7A17A]"
                          )}
                          style={{
                            width: `${(row.count / maxStageCount) * 100}%`,
                            minWidth: row.count ? "10px" : "0",
                          }}
                        />
                      </div>
                      <span className="w-16 shrink-0 text-right text-[11.5px] tabular-nums text-ink-muted">
                        {row.count} · {row.value ? formatCurrency(row.value, demo.region) : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-[#D8D0C4]/70 bg-white p-6">
                <h2 className="font-re-display text-xl text-ink">Lead sources</h2>
                <p className="mt-1 text-[12px] text-ink-muted">Enquiries by acquisition channel</p>
                <ul className="mt-6 space-y-4">
                  {demo.leadSourcePerformance.map((source) => (
                    <li key={source.source}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium text-ink">{source.source}</span>
                        <span className="tabular-nums text-ink-muted">
                          {source.leads} lead{source.leads === 1 ? "" : "s"}
                          {source.won ? ` · ${source.won} won` : ""}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F7F4EE]">
                        <div
                          className="h-full rounded-full bg-[#B7A17A]"
                          style={{ width: `${(source.leads / leadSourceMax) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Activity + appointments + tasks ───────────────── */}
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="border border-[#D8D0C4]/70 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-re-display text-xl text-ink">Recent activity</h2>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Live feed
                  </span>
                </div>
                <ol className="mt-5 space-y-4">
                  {demo.activities.slice(0, 6).map((activity) => (
                    <li key={activity.id} className="flex gap-3">
                      <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F7F4EE] text-[#B7A17A]">
                        {activity.type === "viewing" ? (
                          <Eye className="h-3.5 w-3.5" />
                        ) : activity.type === "offer" ? (
                          <Target className="h-3.5 w-3.5" />
                        ) : activity.type === "document" ? (
                          <FileText className="h-3.5 w-3.5" />
                        ) : (
                          <Sparkles className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold leading-tight text-ink">
                          {activity.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11.5px] text-ink-muted">
                          {activity.detail}
                        </p>
                        <p className="mt-0.5 text-[10.5px] uppercase tracking-[0.12em] text-ink-muted/70">
                          {activity.createdAt} · {agentById(activity.agentId)?.name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border border-[#D8D0C4]/70 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-re-display text-xl text-ink">Upcoming viewings</h2>
                  <Link
                    href={`${base}/viewings`}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-muted transition-colors hover:text-ink"
                  >
                    Calendar <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <ul className="mt-5 space-y-3">
                  {upcoming.length === 0 && (
                    <li className="text-[12px] text-ink-muted">No viewings scheduled.</li>
                  )}
                  {upcoming.map((v: DemoViewing) => {
                    const property = listingById(v.propertyId);
                    const lead = leadById(v.leadId);
                    return (
                      <li
                        key={v.id}
                        className="flex items-center gap-3 border border-[#D8D0C4]/60 bg-[#F7F4EE]/60 p-3"
                      >
                        <div className="flex w-11 shrink-0 flex-col items-center rounded bg-white py-1.5 text-center">
                          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#B7A17A]">
                            {dateLabel(v.date).split(" ")[1]}
                          </span>
                          <span className="font-re-display text-lg leading-none text-ink">
                            {dateLabel(v.date).split(" ")[0]}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] font-semibold text-ink">
                            {property?.title ?? "Property"}
                          </p>
                          <p className="truncate text-[11px] text-ink-muted">
                            {lead?.name ?? "Client"} · {v.time}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border border-[#D8D0C4]/70 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-re-display text-xl text-ink">Priority tasks</h2>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    {sortedTasks.filter((t) => !t.done).length} open
                  </span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {sortedTasks.slice(0, 6).map((task) => (
                    <li
                      key={task.id}
                      className="flex items-start gap-2.5 border-b border-[#D8D0C4]/40 pb-2.5 last:border-0"
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                          task.done
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-[#D8D0C4]"
                        )}
                      >
                        {task.done && <CheckCircle2 className="h-3 w-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-[12px] font-medium leading-tight",
                            task.done ? "text-ink-muted line-through" : "text-ink"
                          )}
                        >
                          {task.title}
                        </p>
                        <p className="mt-0.5 text-[10.5px] text-ink-muted">
                          {task.relatedLabel} · due {dateLabel(task.due)}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]",
                          task.priority === "High"
                            ? "bg-[#B7A17A]/15 text-[#8a7444]"
                            : task.priority === "Medium"
                              ? "bg-[#111110]/8 text-ink-muted"
                              : "bg-[#F7F4EE] text-ink-muted"
                        )}
                      >
                        {task.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Agent leaderboard ─────────────────────────────── */}
            <div className="mt-4 border border-[#D8D0C4]/70 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-re-display text-xl text-ink">Agent performance</h2>
                  <p className="mt-1 text-[12px] text-ink-muted">
                    Pipeline value owned by each agent
                  </p>
                </div>
                <Link
                  href={`${base}/agents`}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-muted transition-colors hover:text-ink"
                >
                  Team workspace <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {agentLeaderboard.map((row) => (
                  <Link
                    key={row.agent.id}
                    href={`${base}/agents`}
                    className="group border border-[#D8D0C4]/60 p-4 transition-colors hover:border-[#B7A17A]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#111110] text-[11px] font-bold text-white">
                        {row.agent.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold text-ink">
                          {row.agent.name}
                        </p>
                        <p className="truncate text-[10.5px] text-ink-muted">{row.agent.title}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted">
                      <span>{row.deals} deals</span>
                      <span className="font-semibold text-ink">
                        {formatCurrency(row.value, demo.region)}
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#F7F4EE]">
                      <div
                        className="h-full rounded-full bg-[#B7A17A]"
                        style={{
                          width: `${
                            (row.value /
                              Math.max(1, ...agentLeaderboard.map((a) => a.value))) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* ── Today's focus ─────────────────────────────────── */
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="border border-[#D8D0C4]/70 bg-white p-6">
              <h2 className="font-re-display text-xl text-ink">Scheduled viewings</h2>
              <p className="mt-1 text-[12px] text-ink-muted">
                Scheduled accompanied viewings across the team
              </p>
              <ul className="mt-5 divide-y divide-[#D8D0C4]/50">
                {demo.viewings
                  .filter((v) => v.status === "Scheduled")
                  .slice(0, 6)
                  .map((v) => {
                    const property = listingById(v.propertyId);
                    const lead = leadById(v.leadId);
                    const agent = agentById(v.agentId);
                    return (
                      <li key={v.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center">
                        <span className="w-16 shrink-0 rounded bg-[#F7F4EE] px-2 py-1 text-center text-[12px] font-semibold tabular-nums text-ink">
                          {v.time}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-ink">
                            {property?.title ?? "Property viewing"}
                          </p>
                          <p className="truncate text-[11.5px] text-ink-muted">
                            {lead?.name} · {leading(lead?.interestType)} · {agent?.name}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                          {v.status}
                        </span>
                      </li>
                    );
                  })}
                {demo.viewings.filter((v) => v.status === "Scheduled").length === 0 && (
                  <li className="py-6 text-[12px] text-ink-muted">No viewings scheduled today.</li>
                )}
              </ul>
            </div>

            <div className="border border-[#D8D0C4]/70 bg-white p-6">
              <h2 className="font-re-display text-xl text-ink">Needs attention</h2>
              <p className="mt-1 text-[12px] text-ink-muted">
                High-priority leads with the nearest follow-up
              </p>
              <ul className="mt-5 space-y-3">
                {[...demo.leads]
                  .filter((l) => l.priority === "High")
                  .sort((a, b) => a.nextFollowUp.localeCompare(b.nextFollowUp))
                  .slice(0, 5)
                  .map((lead) => (
                    <li key={lead.id}>
                      <Link
                        href={`${base}/leads/${lead.id}`}
                        className="group flex items-center justify-between gap-3 border border-[#D8D0C4]/60 p-3 transition-colors hover:border-[#B7A17A]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-semibold text-ink">
                            {lead.name}
                          </p>
                          <p className="truncate text-[11px] text-ink-muted">
                            {lead.interestType} · {lead.preferredLocation}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10.5px] font-semibold text-[#8a7444]">
                          {dateLabel(lead.nextFollowUp)}
                        </span>
                      </Link>
                    </li>
                  ))}
                {demo.leads.filter((l) => l.priority === "High").length === 0 && (
                  <li className="text-[12px] text-ink-muted">No high-priority follow-ups.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* ── Demo transparency note ──────────────────────────── */}
        <p className="mt-6 flex items-start gap-2 border border-dashed border-[#D8D0C4] bg-white/60 p-3 text-[11px] leading-relaxed text-ink-muted">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B7A17A]" />
          This command centre is populated with a coherent fictional demo dataset generated from{" "}
          {prospect.displayName}&apos;s illustrative listing inventory. Metrics are computed from those
          records and are not real business statistics. Property prices, availability and identities
          are illustrative only.
        </p>
      </div>
    </div>
  );
}

function leading(value?: string) {
  return value ? value.toLowerCase() : "client";
}
