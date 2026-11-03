"use client";

import { useMemo } from "react";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Globe2,
  Mail,
  Phone,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatCurrency, type RealEstateDemoData } from "@/lib/realEstateDemo";
import type { PropertyListing } from "@/lib/types";
import { RealEstateShell } from "./RealEstateShell";

export function RealEstateAgents({
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
  const rows = useMemo(() => {
    return demo.agents
      .map((agent) => {
        const leads = demo.leads.filter((l) => l.agentId === agent.id);
        const deals = demo.deals.filter((d) => d.agentId === agent.id);
        const openDeals = deals.filter((d) => !["Closed Won", "Closed Lost"].includes(d.stage));
        const won = deals.filter((d) => d.stage === "Closed Won");
        const viewings = demo.viewings.filter(
          (v) => v.agentId === agent.id && v.status === "Scheduled"
        );
        const listingsHeld = listings.filter((l) => l.agent?.name === agent.name);
        const pipeline = openDeals.reduce((sum, d) => sum + d.value, 0);
        return {
          agent,
          leads: leads.length,
          openDeals: openDeals.length,
          won: won.length,
          viewings: viewings.length,
          listings: listingsHeld.length,
          pipeline,
          workload: leads.length + openDeals.length * 2 + viewings.length,
        };
      })
      .sort((a, b) => b.pipeline - a.pipeline);
  }, [demo, listings]);

  const maxWorkload = Math.max(1, ...rows.map((r) => r.workload));
  const totalPipeline = rows.reduce((sum, r) => sum + r.pipeline, 0);
  const totalLeads = rows.reduce((sum, r) => sum + r.leads, 0);
  const totalViewings = rows.reduce((sum, r) => sum + r.viewings, 0);

  return (
    <RealEstateShell
      companyName={prospect.companyName}
      location={prospect.location}
      region={demo.region}
      currency={demo.currency}
      dateFormat={demo.dateFormat}
      base={base}
      active="agents"
      eyebrow="Team"
      title="The advisory team"
      description="Consultants, directors and leasing specialists — with live workload, pipeline ownership and upcoming appointments."
    >
      <section className="grid grid-cols-2 gap-px overflow-hidden border border-[#D8D0C4]/70 bg-[#D8D0C4]/60 lg:grid-cols-4">
        <Summary label="Agents" value={String(demo.agents.length)} />
        <Summary label="Leads owned" value={String(totalLeads)} />
        <Summary label="Pipeline owned" value={formatCurrency(totalPipeline, demo.region)} />
        <Summary label="Viewings booked" value={String(totalViewings)} />
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <article
            key={row.agent.id}
            className="group flex flex-col border border-[#D8D0C4]/70 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_40px_60px_-50px_rgba(17,17,16,0.5)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#111110] font-re-display text-sm text-white">
                  {row.agent.initials}
                </span>
                <div>
                  <h2 className="text-[14px] font-semibold leading-tight text-ink">
                    {row.agent.name}
                  </h2>
                  <p className="text-[11px] text-ink-muted">{row.agent.title}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-[#8a7444]">
                    {row.agent.focus}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#F7F4EE] px-2 py-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                Since {row.agent.joined}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Mini icon={Target} label="Leads" value={row.leads} />
              <Mini icon={TrendingUp} label="Open deals" value={row.openDeals} />
              <Mini icon={CheckCircle2} label="Won" value={row.won} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Mini icon={CalendarClock} label="Viewings" value={row.viewings} />
              <Mini icon={Building2} label="Listings" value={row.listings} />
            </div>

            <div className="mt-4 border border-[#D8D0C4]/60 bg-[#F7F4EE]/50 p-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                  <Wallet className="h-3 w-3 text-[#B7A17A]" />
                  Pipeline owned
                </span>
                <span className="font-re-display text-sm text-ink">
                  {formatCurrency(row.pipeline, demo.region)}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-[#B7A17A]"
                  style={{ width: `${Math.max(row.pipeline ? 8 : 0, (row.pipeline / Math.max(1, totalPipeline)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted">
                <span>Relative workload</span>
                <span className="text-ink">{row.workload}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#F7F4EE]">
                <div
                  className="h-full rounded-full bg-[#111110]"
                  style={{ width: `${(row.workload / maxWorkload) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-1.5 border-t border-[#D8D0C4]/50 pt-3 text-[10.5px] text-ink-muted">
              <p className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-[#B7A17A]" />
                {row.agent.email}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-[#B7A17A]" />
                {row.agent.phone}
              </p>
              <p className="flex items-center gap-1.5">
                <Globe2 className="h-3 w-3 text-[#B7A17A]" />
                {row.agent.languages.join(" · ")}
              </p>
            </div>
          </article>
        ))}
      </section>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
        Agent identities, email addresses and phone numbers are fictional demo data. Workload is a
        simple relative score of leads, open deals and scheduled viewings, not a performance rating.
      </p>
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

function Mini({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="border border-[#D8D0C4]/60 p-2.5">
      <div className="flex items-center gap-1 text-ink-muted">
        <Icon className="h-3 w-3 text-[#B7A17A]" />
        <span className="text-[9px] font-bold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <p className="mt-1 text-[14px] font-semibold text-ink">{value}</p>
    </div>
  );
}
