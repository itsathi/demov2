"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Eye,
  FileText,
  Filter,
  FolderOpen,
  PenLine,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoDocument, RealEstateDemoData } from "@/lib/realEstateDemo";
import { RealEstateShell } from "./RealEstateShell";

const STATUSES = ["Draft", "In review", "Signed", "Archived"] as const;

export function RealEstateDocuments({
  prospect,
  base,
  demo,
}: {
  prospect: { displayName: string; companyName: string; location: string; slug: string };
  base: string;
  demo: RealEstateDemoData;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<DemoDocument | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(demo.documents.map((d) => d.category)))],
    [demo.documents]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demo.documents.filter((doc) => {
      if (category !== "All" && doc.category !== category) return false;
      if (status !== "All" && doc.status !== status) return false;
      if (!q) return true;
      return [doc.name, doc.entityLabel, doc.category, doc.status]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [demo.documents, query, category, status]);

  const counts = {
    draft: demo.documents.filter((d) => d.status === "Draft").length,
    review: demo.documents.filter((d) => d.status === "In review").length,
    signed: demo.documents.filter((d) => d.status === "Signed").length,
    archived: demo.documents.filter((d) => d.status === "Archived").length,
  };

  return (
    <RealEstateShell
      companyName={prospect.companyName}
      location={prospect.location}
      region={demo.region}
      currency={demo.currency}
      dateFormat={demo.dateFormat}
      base={base}
      active="documents"
      eyebrow="Documents"
      title="Agreements, offers & records"
      description="Listing agreements, sale and rental contracts, offers and ownership records — organised by the property, deal or owner they belong to."
    >
      <section className="grid grid-cols-2 gap-px overflow-hidden border border-[#D8D0C4]/70 bg-[#D8D0C4]/60 lg:grid-cols-4">
        <Summary icon={FileText} label="Drafts" value={counts.draft} />
        <Summary icon={PenLine} label="In review" value={counts.review} />
        <Summary icon={CheckCircle2} label="Signed" value={counts.signed} />
        <Summary icon={Archive} label="Archived" value={counts.archived} />
      </section>

      <section className="mt-4 border border-[#D8D0C4]/70 bg-white">
        <div className="flex flex-col gap-3 border-b border-[#D8D0C4]/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search document, property or entity…"
              className="w-full border border-[#D8D0C4] bg-[#F7F4EE]/50 py-2.5 pl-9 pr-3 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-[#B7A17A]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-2.5 py-2 text-[11.5px] font-medium text-ink">
              <FolderOpen className="h-3.5 w-3.5 text-[#B7A17A]" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent text-[11.5px] outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-1.5 border border-[#D8D0C4] bg-white px-2.5 py-2 text-[11.5px] font-medium text-ink">
              <Filter className="h-3.5 w-3.5 text-[#B7A17A]" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-transparent text-[11.5px] outline-none"
              >
                <option value="All">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <span className="ml-auto text-[11px] text-ink-muted">
              {filtered.length} of {demo.documents.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-[#D8D0C4]/60 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Linked to</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-[#D8D0C4]/40 transition-colors last:border-0 hover:bg-[#F7F4EE]/60"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-[#B7A17A]" />
                      <span className="font-medium text-ink">{doc.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{doc.category}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {doc.entityType} · {doc.entityLabel}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink-muted">{doc.version}</td>
                  <td className="px-4 py-3 text-ink-muted">{doc.updatedAt}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelected(doc)}
                      className="inline-flex items-center gap-1 border border-[#D8D0C4] px-2.5 py-1.5 text-[10.5px] font-semibold text-ink-muted transition-colors hover:border-[#B7A17A] hover:text-[#8a7444]"
                    >
                      <Eye className="h-3 w-3" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-re-display text-xl text-ink">No documents match those filters</p>
            <p className="mt-2 text-[12.5px] text-ink-muted">
              Clear the search or choose a different category and status.
            </p>
          </div>
        )}
      </section>

      <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
        Document names, versions and statuses are fictional demo records. No real files are stored or
        available for download.
      </p>

      {selected && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[#111110]/40 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close document details"
            className="absolute inset-0"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-md border border-[#D8D0C4] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#D8D0C4]/60 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F7F4EE] text-[#B7A17A]">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-re-display text-lg leading-tight text-ink">{selected.name}</h2>
                  <p className="mt-1 text-[11px] text-ink-muted">{selected.category}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#D8D0C4] text-ink-muted transition-colors hover:border-ink hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="space-y-3 p-5 text-[12px]">
              <Row label="Linked entity" value={`${selected.entityType} · ${selected.entityLabel}`} />
              <Row label="Version" value={selected.version} />
              <Row label="File size" value={selected.sizeLabel} />
              <Row label="Last updated" value={selected.updatedAt} />
              <Row label="Status" value={selected.status} />
            </dl>
            <div className="border-t border-[#D8D0C4]/60 bg-[#F7F4EE]/50 p-4 text-[11px] leading-relaxed text-ink-muted">
              This is a demo record used to illustrate document workflows. There is no underlying file
              to preview, sign or download.
            </div>
          </div>
        </div>
      )}
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

function StatusBadge({ status }: { status: DemoDocument["status"] }) {
  const tone =
    status === "Signed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "In review"
        ? "bg-[#B7A17A]/15 text-[#8a7444]"
        : status === "Draft"
          ? "bg-[#111110]/6 text-ink-muted"
          : "bg-[#F7F4EE] text-ink-muted";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.08em]", tone)}>
      {status}
    </span>
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
