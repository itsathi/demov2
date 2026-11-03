import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { allProspects } from "@/lib/prospect";
import {
  buildDemoExportRows,
  findDuplicateCompanyDomains,
  resolveDemoBaseUrl,
  summarizeDemoExport,
  type DemoExportRow,
} from "@/lib/demoExport";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demo Registry Export",
  robots: { index: false, follow: false },
};

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "warn" | "ok";
}) {
  const valueClass =
    tone === "warn" && value > 0
      ? "text-amber-700"
      : tone === "ok"
        ? "text-emerald-700"
        : "text-ink";

  return (
    <div className="rounded-xl border border-line bg-slate-50 p-4">
      <div className={`font-display text-3xl font-extrabold tabular-nums ${valueClass}`}>
        {value}
      </div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
    </div>
  );
}

function ReviewList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: DemoExportRow[];
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="font-display text-base font-extrabold tracking-tight">
        {title}{" "}
        <span className="text-ink-muted">({rows.length})</span>
      </h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-emerald-700">{empty}</p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {rows.map((row) => (
            <li
              key={`${row.demo_id}-${row.company_domain}-${row.demo_url}`}
              className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800"
            >
              {row.demo_name || row.company_name || "(unnamed demo)"}
              <span className="ml-1.5 font-normal text-amber-700/70">
                {row.demo_id || "no demo_id"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function DemoExportPage() {
  const requestHeaders = await headers();
  const baseUrl = resolveDemoBaseUrl(requestHeaders);
  const rows = buildDemoExportRows(allProspects, { baseUrl });
  const summary = summarizeDemoExport(rows);

  const duplicates = findDuplicateCompanyDomains(rows);
  const missingDomains = rows.filter((row) => !row.company_domain);
  const missingUrls = rows.filter((row) => !row.demo_url);
  const missingIds = rows.filter((row) => !row.demo_id);

  return (
    <main className="min-h-screen bg-white text-ink">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <Link
            href="/prospects"
            className="text-xs font-bold uppercase tracking-[0.16em] text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            ← Prospect review
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
            Admin · protected
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Demo Registry Export
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
          Export every existing website demo into one CSV for the Athinem Creatives
          CRM. The export uses the live demo registry directly — it is not limited
          by pagination or any dashboard filters, and it does not modify demo
          records.
        </p>

        <div className="mt-6 rounded-2xl border border-line bg-slate-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-extrabold tracking-tight">
                Export All Demos (CSV)
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                {summary.total} eligible {summary.total === 1 ? "demo" : "demos"} ·{" "}
                {allProspects.length} source records · includes draft, published and
                archived demos.
              </p>
            </div>
            <a
              href="/api/admin/demos/export"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand"
              download
            >
              Download full CSV
            </a>
          </div>

          {!baseUrl && (
            <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
              No public demo origin could be resolved. Set{" "}
              <code className="rounded bg-white px-1">DEMO_BASE_URL</code> so the
              exported <code className="rounded bg-white px-1">demo_url</code>{" "}
              values are complete absolute URLs.
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <Metric label="Total demos included" value={summary.total} />
          <Metric label="Published" value={summary.published} tone="ok" />
          <Metric label="Draft" value={summary.draft} />
          <Metric label="Archived" value={summary.archived} />
          <Metric label="Missing demo IDs" value={summary.missingDemoIds} tone="warn" />
          <Metric
            label="Missing company domains"
            value={summary.missingCompanyDomains}
            tone="warn"
          />
          <Metric label="Missing demo URLs" value={summary.missingDemoUrls} tone="warn" />
          <Metric
            label="Duplicate company domains"
            value={summary.duplicateCompanyDomains}
            tone="warn"
          />
          <Metric
            label="Rows in duplicate domains"
            value={summary.duplicateCompanyDomainRows}
            tone="warn"
          />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <ReviewList
            title="Missing company domains"
            rows={missingDomains}
            empty="Every exported demo has a company domain."
          />
          <ReviewList
            title="Missing demo URLs"
            rows={missingUrls}
            empty="Every exported demo has a demo URL."
          />
          <ReviewList
            title="Missing demo IDs"
            rows={missingIds}
            empty="Every exported demo has a stable demo ID."
          />
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-base font-extrabold tracking-tight">
              Duplicate company domains{" "}
              <span className="text-ink-muted">({duplicates.length})</span>
            </h2>
            {duplicates.length === 0 ? (
              <p className="mt-2 text-sm text-emerald-700">
                No company domain is shared by more than one demo.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-xs text-ink-muted">
                {duplicates.map((group) => (
                  <li key={group.domain}>
                    <span className="font-bold text-amber-800">{group.domain}</span>
                    <span className="ml-2">
                      {group.rows.map((row) => row.demo_name).join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {duplicates.length > 0 && (
              <p className="mt-3 text-xs text-ink-muted">
                All rows are preserved — duplicate domains are reported here for
                audit only.
              </p>
            )}
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-line bg-slate-50 p-5">
          <h2 className="font-display text-base font-extrabold tracking-tight">
            CSV columns
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            <code className="rounded bg-white px-1">company_domain</code> is the
            prospect business&apos;s own domain.{" "}
            <code className="rounded bg-white px-1">demo_url</code> is the complete
            URL that opens our demo and may use a completely different host
            (Vercel, preview, or custom demo domain). Values are UTF-8, escaped for
            commas/quotes/line breaks, and protected against spreadsheet formula
            injection.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-slate-50 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  <th className="px-4 py-2.5">Column</th>
                  <th className="px-4 py-2.5">Source</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["demo_id", "Existing stable demo slug / override"],
                  ["lead_id", "Source company ID, when supplied"],
                  ["company_name", "Company name"],
                  ["company_domain", "Prospect business domain (not the demo host)"],
                  ["demo_name", "Demo display name"],
                  ["demo_url", "Complete URL that opens the demo"],
                  ["demo_status", "published | draft | archived"],
                  ["created_at", "Only when supplied by source metadata"],
                  ["updated_at", "Only when supplied by source metadata"],
                  ["project_id", "Only when supplied by source metadata"],
                ].map(([column, source]) => (
                  <tr key={column} className="border-b border-line/60 last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-ink">{column}</td>
                    <td className="px-4 py-2.5 text-ink-muted">{source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-ink-muted">
          CRM matching and record updates are intentionally not implemented here.
          This export ends at the CSV file; the receiving CRM owns Demo Link Audit
          matching.
        </p>
      </div>
    </main>
  );
}
