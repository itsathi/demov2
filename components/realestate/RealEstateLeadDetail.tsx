"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Home,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Target,
  UserRound,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatMoneyExact,
  type RealEstateDemoData,
} from "@/lib/realEstateDemo";
import type { PropertyListing } from "@/lib/types";
import { RealEstateShell } from "./RealEstateShell";

type TimelineEntry = {
  id: string;
  title: string;
  detail: string;
  date: string;
};

export function RealEstateLeadDetail({
  prospect,
  base,
  demo,
  listings,
  leadId,
}: {
  prospect: { displayName: string; companyName: string; location: string; slug: string };
  base: string;
  demo: RealEstateDemoData;
  listings: PropertyListing[];
  leadId: string;
}) {
  const lead = demo.leads.find((l) => l.id === leadId);
  const [notes, setNotes] = useState<string[]>(lead?.notes ? [lead.notes] : []);
  const [draft, setDraft] = useState("");
  const [followedUp, setFollowedUp] = useState(false);

  const deal = demo.deals.find((d) => d.leadId === leadId);
  const property = listings.find((l) => l.id === (lead?.propertyId ?? deal?.propertyId));
  const agent = demo.agents.find((a) => a.id === lead?.agentId);
  const viewings = demo.viewings.filter((v) => v.leadId === leadId);
  const documents = demo.documents.filter(
    (doc) =>
      (deal && doc.entityType === "Deal" && doc.entityId === deal.id) ||
      (property && doc.entityType === "Property" && doc.entityId === property.id)
  );

  const timeline: TimelineEntry[] = (() => {
    if (!lead) return [];
    const entries: TimelineEntry[] = [
      {
        id: "created",
        title: "Enquiry received",
        detail: `${lead.interestType} enquiry via ${lead.source} · ${lead.budgetLabel}`,
        date: lead.createdAt,
      },
      {
        id: "last",
        title: "Last interaction",
        detail: lead.notes,
        date: lead.lastInteraction,
      },
    ];
    if (deal) {
      entries.push({
        id: "deal",
        title: `Opportunity created · ${deal.stage}`,
        detail: `${formatCurrency(deal.value, demo.region)} · ${deal.probability}% probability`,
        date: deal.createdAt,
      });
    }
    for (const viewing of viewings) {
      entries.push({
        id: viewing.id,
        title: `Viewing ${viewing.status.toLowerCase()}`,
        detail: `${viewing.time} · ${viewing.durationMinutes} minutes`,
        date: viewing.date,
      });
    }
    entries.push({
      id: "followup",
      title: "Next follow-up",
      detail: `Assigned to ${agent?.name ?? "the team"}`,
      date: lead.nextFollowUp,
    });
    return entries;
  })();

  if (!lead) {
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
        title="Lead not found"
      >
        <div className="border border-[#D8D0C4]/70 bg-white p-12 text-center">
          <p className="font-re-display text-2xl text-ink">This lead record does not exist.</p>
          <Link
            href={`${base}/leads`}
            className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#8a7444]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to lead centre
          </Link>
        </div>
      </RealEstateShell>
    );
  }

  const dateLabel = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString(demo.locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const addNote = () => {
    const value = draft.trim();
    if (!value) return;
    setNotes((prev) => [value, ...prev]);
    setDraft("");
  };

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
      title={lead.name}
      description={`${lead.interestType} enquiry · ${lead.preferredLocation} · ${lead.budgetLabel}`}
      actions={
        <Link
          href={`${base}/leads`}
          className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-4 py-2 text-[12px] font-semibold text-ink transition-colors hover:border-[#B7A17A] hover:text-[#B7A17A]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All leads
        </Link>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <section className="border border-[#D8D0C4]/70 bg-white p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StagePill stage={lead.stage} />
              <PriorityPill priority={lead.priority} />
              <span className="rounded-full bg-[#F7F4EE] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                {lead.interestType}
              </span>
              <span className="ml-auto text-[11px] text-ink-muted">
                Created {dateLabel(lead.createdAt)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoRow icon={Mail} label="Email" value={lead.email} />
              <InfoRow icon={Phone} label="Phone" value={lead.phone} />
              <InfoRow icon={MapPin} label="Preferred area" value={lead.preferredLocation} />
              <InfoRow icon={Wallet} label="Budget" value={lead.budgetLabel} />
              <InfoRow icon={UserRound} label="Country" value={lead.country} />
              <InfoRow icon={Target} label="Source" value={lead.source} />
            </div>

            <div className="mt-5 border-t border-[#D8D0C4]/50 pt-5">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Requirements
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink">{lead.requirements}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#D8D0C4] px-2.5 py-1 text-[10.5px] font-medium text-ink-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-[#D8D0C4]/70 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-re-display text-xl text-ink">Activity timeline</h2>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                {timeline.length} events
              </span>
            </div>
            <ol className="mt-5 space-y-5">
              {timeline.map((entry) => (
                <li key={entry.id} className="relative pl-6">
                  <span className="absolute left-0 top-1 grid h-3.5 w-3.5 place-items-center rounded-full border border-[#B7A17A] bg-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B7A17A]" />
                  </span>
                  <span className="absolute bottom-[-20px] left-[6px] top-5 w-px bg-[#D8D0C4]/60 last:hidden" />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-[12.5px] font-semibold text-ink">{entry.title}</p>
                    <span className="text-[10.5px] tabular-nums text-ink-muted">
                      {dateLabel(entry.date)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-ink-muted">{entry.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="border border-[#D8D0C4]/70 bg-white p-6">
            <h2 className="font-re-display text-xl text-ink">Working notes</h2>
            <p className="mt-1 text-[11.5px] text-ink-muted">
              Notes added here live in this browser session only — demo data is not persisted.
            </p>
            <div className="mt-4 flex items-start gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder="Add a call note, requirement update or next step…"
                className="flex-1 resize-none border border-[#D8D0C4] bg-[#F7F4EE]/50 p-3 text-[12.5px] text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-[#B7A17A]"
              />
              <button
                type="button"
                onClick={addNote}
                className="inline-flex items-center gap-1.5 bg-[#111110] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#B7A17A]"
              >
                <Send className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {notes.map((note, i) => (
                <li
                  key={`${note}-${i}`}
                  className="flex gap-2 border border-[#D8D0C4]/50 bg-[#F7F4EE]/40 p-3 text-[12px] leading-relaxed text-ink"
                >
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B7A17A]" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="border border-[#D8D0C4]/70 bg-white p-5">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
              Assigned agent
            </h2>
            {agent ? (
              <Link href={`${base}/agents`} className="mt-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#111110] text-[12px] font-bold text-white">
                  {agent.initials}
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-ink">{agent.name}</span>
                  <span className="block text-[11px] text-ink-muted">{agent.title}</span>
                  <span className="block text-[10.5px] text-[#8a7444]">{agent.email}</span>
                </span>
              </Link>
            ) : (
              <p className="mt-2 text-[12px] text-ink-muted">Unassigned</p>
            )}
          </section>

          {deal && (
            <section className="border border-[#D8D0C4]/70 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Linked opportunity
                </h2>
                <Link
                  href={`${base}/pipeline`}
                  className="text-[10.5px] font-semibold text-[#8a7444]"
                >
                  Pipeline
                </Link>
              </div>
              <p className="mt-3 font-re-display text-2xl text-ink">
                {formatMoneyExact(deal.value, demo.region)}
              </p>
              <dl className="mt-3 space-y-2 text-[11.5px]">
                <Row label="Stage" value={deal.stage} />
                <Row label="Probability" value={`${deal.probability}%`} />
                <Row label="Expected close" value={dateLabel(deal.expectedClose)} />
                <Row label="Next action" value={deal.nextAction} />
              </dl>
            </section>
          )}

          {property && (
            <section className="border border-[#D8D0C4]/70 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Property of interest
                </h2>
                <Link
                  href={`${base}/properties/${property.slug}`}
                  className="text-[10.5px] font-semibold text-[#8a7444]"
                >
                  View
                </Link>
              </div>
              <p className="mt-3 text-[13px] font-semibold leading-snug text-ink">{property.title}</p>
              <p className="mt-1 text-[11.5px] text-ink-muted">
                {property.location} · {property.propertyType}
              </p>
              <p className="mt-2 font-re-display text-xl text-ink">
                {property.priceLabel ?? formatCurrency(property.priceValue ?? 0, demo.region)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10.5px] text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <Home className="h-3 w-3" /> {property.bedrooms ?? "—"} bed
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {property.areaLabel ?? "—"}
                </span>
              </div>
            </section>
          )}

          {viewings.length > 0 && (
            <section className="border border-[#D8D0C4]/70 bg-white p-5">
              <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                Viewings
              </h2>
              <ul className="mt-3 space-y-2.5">
                {viewings.map((v) => (
                  <li key={v.id} className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="inline-flex items-center gap-1.5 text-ink">
                      <Calendar className="h-3.5 w-3.5 text-[#B7A17A]" />
                      {dateLabel(v.date)} · {v.time}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em]",
                        v.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-[#B7A17A]/15 text-[#8a7444]"
                      )}
                    >
                      {v.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {documents.length > 0 && (
            <section className="border border-[#D8D0C4]/70 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  Documents
                </h2>
                <Link href={`${base}/documents`} className="text-[10.5px] font-semibold text-[#8a7444]">
                  All
                </Link>
              </div>
              <ul className="mt-3 space-y-2">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-start gap-2 text-[11.5px]">
                    <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B7A17A]" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">{doc.name}</span>
                      <span className="block text-[10.5px] text-ink-muted">
                        {doc.version} · {doc.status}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="border border-[#D8D0C4]/70 bg-[#111110] p-5 text-white">
            <h2 className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/60">
              Next follow-up
            </h2>
            <p
              className={cn(
                "mt-2 font-re-display text-2xl",
                followedUp && "text-white/50 line-through"
              )}
            >
              {dateLabel(lead.nextFollowUp)}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
              <Clock className="h-3 w-3" />
              {followedUp ? "Marked complete in this session" : "Prioritised by the sales team"}
            </p>
            <button
              type="button"
              onClick={() => setFollowedUp((v) => !v)}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 bg-white px-4 py-2.5 text-[12px] font-semibold text-[#111110] transition-colors hover:bg-[#B7A17A] hover:text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {followedUp ? "Follow-up completed" : "Mark follow-up complete"}
            </button>
          </section>
        </aside>
      </div>
    </RealEstateShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B7A17A]" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">{label}</p>
        <p className="truncate text-[12.5px] text-ink">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function StagePill({ stage }: { stage: string }) {
  const tone =
    stage === "Won"
      ? "bg-emerald-50 text-emerald-700"
      : stage === "Lost"
        ? "bg-[#F7F4EE] text-ink-muted"
        : stage === "New"
          ? "bg-[#B7A17A]/15 text-[#8a7444]"
          : "bg-[#111110]/6 text-ink-muted";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", tone)}>{stage}</span>
  );
}

function PriorityPill({ priority }: { priority: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em]",
        priority === "High"
          ? "bg-[#B7A17A]/15 text-[#8a7444]"
          : "bg-[#111110]/6 text-ink-muted"
      )}
    >
      {priority}
    </span>
  );
}
