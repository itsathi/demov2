import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { listDemos, getRegistryTotals } from "@/lib/engine/registry";
import report from "@/data/generated/classification-report.json";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demo Generator 2.0 — Preview Registry",
  robots: { index: false, follow: false },
};

const pilotSlugs = new Set(
  ((report as { pilotShortlist?: Array<{ slug: string }> }).pilotShortlist ?? []).map((p) => p.slug)
);

type QaResult = { slug: string; pass: boolean; issues: string[] };
type QaReport = {
  generatedAt: string;
  totals: { demos: number; passed: number; failed: number };
  failures: QaResult[];
  results: QaResult[];
};

function loadQaReport(): QaReport | null {
  try {
    const file = path.join(process.cwd(), "data/generated/qa-report.json");
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as QaReport;
  } catch {
    return null;
  }
}

export default function PreviewIndexPage() {
  const demos = listDemos({ eligibleOnly: true });
  const totals = getRegistryTotals();
  const qa = loadQaReport();
  const qaBySlug = new Map((qa?.results ?? []).map((result) => [result.slug, result]));

  const groups = new Map<string, typeof demos>();
  for (const demo of demos) {
    const list = groups.get(demo.family) ?? [];
    list.push(demo);
    groups.set(demo.family, list);
  }
  const ordered = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            Demo Generator 2.0
          </span>
          <Link
            href="/prospects"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Research review
          </Link>
          <Link
            href="/admin/demos"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Legacy export
          </Link>
        </div>

        <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Preview registry
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
          Canonical company identities from the supplied 207-lead dataset. Only eligible businesses are
          listed; portals, directories, editorial pages, legal services and test records are excluded.
          Each preview is a private concept build — not deployed and not indexed.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Source records", value: totals.total },
            { label: "Eligible", value: totals.eligible },
            { label: "Excluded", value: totals.excluded },
            { label: "Industries", value: Object.keys(totals.families).length },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {metric.label}
              </dt>
              <dd className="mt-1 font-display text-3xl font-extrabold tabular-nums">{metric.value}</dd>
            </div>
          ))}
        </dl>

        {qa ? (
          <div
            className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border px-4 py-3 text-xs ${
              qa.totals.failed
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            <span className="font-bold">
              QA {qa.totals.passed}/{qa.totals.demos} passed
            </span>
            <span className="opacity-70">
              desktop + mobile · {new Date(qa.generatedAt).toLocaleString()}
            </span>
            <span className="opacity-70">Re-run with `node scripts/qa-previews.mjs`</span>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
            QA has not run yet. Start the app, then run{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">node scripts/qa-previews.mjs</code>.
          </div>
        )}

        {qa?.failures.length ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
              QA issues to review
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              {qa.failures.slice(0, 12).map((failure) => (
                <li key={failure.slug}>
                  <Link
                    href={`/preview/${failure.slug}`}
                    className="font-semibold text-slate-900 underline-offset-4 hover:underline"
                  >
                    {failure.slug}
                  </Link>
                  <span className="text-slate-500"> — {failure.issues.join(" | ")}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {Object.entries(totals.families)
            .sort((a, b) => b[1] - a[1])
            .map(([family, count]) => (
              <span
                key={family}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600"
              >
                {family.replace(/_/g, " ")} <span className="text-slate-400">{count}</span>
              </span>
            ))}
        </div>

        <div className="mt-12 space-y-12">
          {ordered.map(([family, list]) => (
            <section key={family}>
              <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-3">
                <h2 className="font-display text-xl font-extrabold capitalize tracking-tight">
                  {family.replace(/_/g, " ")}
                </h2>
                <span className="text-xs tabular-nums text-slate-500">{list.length} eligible</span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((demo) => {
                  const pilot = pilotSlugs.has(demo.slug);
                  return (
                    <Link
                      key={demo.slug}
                      href={`/preview/${demo.slug}`}
                      className={`group min-w-0 rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                        pilot ? "border-slate-900 ring-1 ring-slate-900" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">{demo.name}</p>
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">{demo.domain}</p>
                        </div>
                        {pilot ? (
                          <span className="shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                            Pilot
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em]">
                        <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">
                          {demo.familyLabel}
                        </span>
                        <span
                          className={`rounded px-2 py-1 ${
                            demo.researchAvailable
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {demo.researchAvailable ? "Researched" : "CRM only"}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">
                          {demo.serviceCount} services
                        </span>
                        {qaBySlug.get(demo.slug) ? (
                          <span
                            className={`rounded px-2 py-1 ${
                              qaBySlug.get(demo.slug)?.pass
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {qaBySlug.get(demo.slug)?.pass ? "QA pass" : "QA issue"}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-[11px] text-slate-500">
                        {[demo.city, demo.country].filter(Boolean).join(", ") || "Location to confirm"}
                        {" · "}
                        {demo.imageVerified ? "verified imagery" : "concept imagery"}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
