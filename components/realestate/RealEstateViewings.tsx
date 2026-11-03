"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CheckCircle2,
  Clock,
  MapPin,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  type DemoViewing,
  type RealEstateDemoData,
} from "@/lib/realEstateDemo";
import type { PropertyListing } from "@/lib/types";
import { RealEstateShell } from "./RealEstateShell";

type ViewingStatus = DemoViewing["status"];

export function RealEstateViewings({
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
  const [status, setStatus] = useState<ViewingStatus | "All">("All");
  const [agent, setAgent] = useState("All");
  const [overrides, setOverrides] = useState<Record<string, ViewingStatus>>({});

  const effectiveStatus = (v: DemoViewing): ViewingStatus => overrides[v.id] ?? v.status;

  const viewings = useMemo(() => {
    return demo.viewings
      .map((v) => ({ ...v, status: effectiveStatus(v) }))
      .filter((v) => (status === "All" ? true : v.status === status))
      .filter((v) => (agent === "All" ? true : v.agentId === agent))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [demo.viewings, status, agent, overrides]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof viewings>();
    for (const v of viewings) {
      const list = map.get(v.date) ?? [];
      list.push(v);
      map.set(v.date, list);
    }
    return Array.from(map.entries());
  }, [viewings]);

  const counts = useMemo(() => {
    const all = demo.viewings.map((v) => ({ ...v, status: effectiveStatus(v) }));
    return {
      scheduled: all.filter((v) => v.status === "Scheduled").length,
      completed: all.filter((v) => v.status === "Completed").length,
      cancelled: all.filter((v) => v.status === "Cancelled").length,
    };
  }, [demo.viewings, overrides]);

  const propertyFor = (id: string) => listings.find((l) => l.id === id);
  const leadFor = (id: string) => demo.leads.find((l) => l.id === id);
  const agentFor = (id: string) => demo.agents.find((a) => a.id === id);

  const dayLabel = (iso: string) => {
    const date = new Date(`${iso}T12:00:00`);
    return {
      weekday: date.toLocaleDateString(demo.locale, { weekday: "long" }),
      day: date.toLocaleDateString(demo.locale, { day: "2-digit" }),
      month: date.toLocaleDateString(demo.locale, { month: "short" }),
      full: date.toLocaleDateString(demo.locale, {
        weekday: "long",
        day: "2-digit",
        month: "long",
      }),
    };
  };

  const setViewingStatus = (id: string, next: ViewingStatus) =>
    setOverrides((prev) => ({ ...prev, [id]: next }));

  return (
    <RealEstateShell
      companyName={prospect.companyName}
      location={prospect.location}
      region={demo.region}
      currency={demo.currency}
      dateFormat={demo.dateFormat}
      base={base}
      active="viewings"
      eyebrow="Viewings"
      title="Appointments & accompanied viewings"
      description="Coordinate the inspection calendar across the team, capture outcomes and keep every client follow-up visible."
      actions={
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
      }
    >
      <section className="grid grid-cols-3 gap-px overflow-hidden border border-[#D8D0C4]/70 bg-[#D8D0C4]/60">
        <Stat icon={CalendarClock} label="Scheduled" value={counts.scheduled} />
        <Stat icon={CalendarCheck} label="Completed" value={counts.completed} />
        <Stat icon={CalendarX} label="Cancelled" value={counts.cancelled} />
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-1 border-b border-[#D8D0C4]/70">
        {(["All", "Scheduled", "Completed", "Cancelled"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatus(tab)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-[12.5px] font-semibold transition-colors",
              status === tab
                ? "border-[#B7A17A] text-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            )}
          >
            {tab}
          </button>
        ))}
        <span className="ml-auto pb-2 text-[11px] text-ink-muted">{viewings.length} shown</span>
      </div>

      <div className="mt-5 space-y-6">
        {grouped.map(([date, items]) => {
          const label = dayLabel(date);
          return (
            <section key={date} className="grid gap-3 md:grid-cols-[120px_1fr]">
              <div className="md:pt-2">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#B7A17A]">
                  {label.weekday}
                </p>
                <p className="font-re-display text-3xl leading-none text-ink">
                  {label.day}
                  <span className="ml-1 text-base text-ink-muted">{label.month}</span>
                </p>
                <p className="mt-1 text-[10.5px] text-ink-muted">
                  {items.length} viewing{items.length === 1 ? "" : "s"}
                </p>
              </div>

              <ul className="space-y-2">
                {items.map((viewing) => {
                  const property = propertyFor(viewing.propertyId);
                  const lead = leadFor(viewing.leadId);
                  const agent = agentFor(viewing.agentId);
                  return (
                    <li
                      key={viewing.id}
                      className="flex flex-col gap-3 border border-[#D8D0C4]/70 bg-white p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex w-16 shrink-0 flex-col items-center justify-center border border-[#D8D0C4]/60 bg-[#F7F4EE]/60 py-1.5">
                        <Clock className="h-3 w-3 text-[#B7A17A]" />
                        <span className="mt-0.5 text-[12.5px] font-semibold tabular-nums text-ink">
                          {viewing.time}
                        </span>
                        <span className="text-[9px] text-ink-muted">{viewing.durationMinutes}m</span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={property ? `${base}/properties/${property.slug}` : `${base}/properties`}
                          className="block truncate text-[13px] font-semibold text-ink hover:text-[#8a7444]"
                        >
                          {property?.title ?? "Property viewing"}
                        </Link>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-ink-muted">
                          <span className="inline-flex items-center gap-1">
                            <UserRound className="h-3 w-3" />
                            {lead?.name ?? "Client"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property?.community ?? property?.location ?? "—"}
                          </span>
                          <span>{agent?.name}</span>
                          {property?.priceLabel && (
                            <span className="font-medium text-[#8a7444]">{property.priceLabel}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <StatusPill status={viewing.status} />
                        {viewing.status !== "Completed" && (
                          <button
                            type="button"
                            onClick={() => setViewingStatus(viewing.id, "Completed")}
                            className="inline-flex items-center gap-1 border border-[#D8D0C4] px-2.5 py-1.5 text-[10.5px] font-semibold text-ink-muted transition-colors hover:border-emerald-600 hover:text-emerald-700"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        {grouped.length === 0 && (
          <div className="border border-[#D8D0C4]/70 bg-white p-12 text-center">
            <p className="font-re-display text-xl text-ink">No viewings match those filters</p>
            <p className="mt-2 text-[12.5px] text-ink-muted">
              Adjust the status or agent filter to see the rest of the calendar.
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-[11px] text-ink-muted">
        Status changes are held in this browser session only. Portfolio value shown elsewhere:{" "}
        {formatCurrency(
          listings.reduce((sum, l) => sum + (l.priceValue ?? 0), 0),
          demo.region
        )}{" "}
        illustrative.
      </p>
    </RealEstateShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-2 text-ink-muted">
        <Icon className="h-4 w-4 text-[#B7A17A]" />
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="mt-2 font-re-display text-2xl text-ink sm:text-3xl">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: ViewingStatus }) {
  const tone =
    status === "Completed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Cancelled"
        ? "bg-[#F7F4EE] text-ink-muted"
        : "bg-[#B7A17A]/15 text-[#8a7444]";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em]", tone)}>
      {status}
    </span>
  );
}
