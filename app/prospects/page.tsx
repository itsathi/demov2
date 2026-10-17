import Link from "next/link";
import type { ProspectConfig, ResearchStatus } from "@/lib/types";
import { allProspects } from "@/lib/prospect";
import { getResearch } from "@/lib/research/merge";
import { NICHE_TABS, nicheOf, type NicheKey } from "@/lib/niche";

export const metadata = {
  title: "Prospect Research & Asset Review",
};

type TemplateKey = "all" | "real_estate" | "hvac";

const TEMPLATE_TABS: { key: TemplateKey; label: string }[] = [
  { key: "all", label: "All templates" },
  { key: "real_estate", label: "Real estate" },
  { key: "hvac", label: "HVAC / default" },
];

/** Which demo generator a prospect renders through. */
function templateOf(prospect: ProspectConfig): Exclude<TemplateKey, "all"> {
  return prospect.industryKey === "real_estate" ? "real_estate" : "hvac";
}

function matchesTemplate(prospect: ProspectConfig, template: TemplateKey): boolean {
  return template === "all" || templateOf(prospect) === template;
}

function matchesNiche(prospect: ProspectConfig, niche: NicheKey): boolean {
  return niche === "all" || nicheOf(prospect) === niche;
}

const STATUS_STYLE: Record<ResearchStatus, { label: string; bg: string; text: string }> = {
  ready_for_demo: { label: "Ready for demo", bg: "#10B981", text: "#fff" },
  published: { label: "Published", bg: "#10B981", text: "#fff" },
  assets_ready: { label: "Assets ready", bg: "#0EA5E9", text: "#fff" },
  research_complete: { label: "Researched", bg: "#14B8A6", text: "#fff" },
  assets_partial: { label: "Partial assets", bg: "#F59E0B", text: "#fff" },
  partially_researched: { label: "Partial data", bg: "#F59E0B", text: "#fff" },
  research_in_progress: { label: "In progress", bg: "#8B5CF6", text: "#fff" },
  manual_review_required: { label: "Manual review", bg: "#EF4444", text: "#fff" },
  research_failed: { label: "Research failed", bg: "#EF4444", text: "#fff" },
  research_pending: { label: "Not researched", bg: "#94A3B8", text: "#fff" },
};

function Chip({ status }: { status: ResearchStatus }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.research_pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}

function Row({ slug }: { slug: string }) {
  const prospect = allProspects.find((p) => p.slug === slug);
  if (!prospect) return null;
  const research = getResearch(prospect.slug);
  const summary = prospect.researchSummary;
  const valid = research?.assets.filter((a) => a.status === "valid") ?? [];
  const rendered = research?.assets.filter((a) => a.usedInDemo) ?? [];

  return (
    <tr className="border-b border-line/60 align-top">
      <td className="py-3 pr-4">
        <Link
          href={`/${prospect.slug}`}
          className="font-semibold text-ink underline-offset-4 hover:underline"
        >
          {prospect.displayName}
        </Link>
        <div className="mt-0.5 text-xs text-ink-muted">
          {prospect.slug} · {prospect.industry}
        </div>
        {research?.sourceUrl && (
          <a
            href={research.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 inline-block text-xs text-brand-strong underline-offset-4 hover:underline"
          >
            {research.sourceUrl.replace(/^https?:\/\//, "")}
          </a>
        )}
      </td>
      <td className="py-3 pr-4">
        {(summary?.status ?? "research_pending") && (
          <Chip status={summary?.status ?? "research_pending"} />
        )}
        {summary?.researchedAt && (
          <div className="mt-1 text-[11px] tabular-nums text-ink-muted">
            {new Date(summary.researchedAt).toLocaleString("en-GB", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </div>
        )}
      </td>
      <td className="py-3 pr-4 text-sm tabular-nums">
        {research ? (
          <div className="space-y-0.5">
            <div>Discovered <b>{summary?.assetsDiscovered ?? 0}</b></div>
            <div className="text-emerald-700">Valid {summary?.assetsValidated ?? 0}</div>
            <div className="text-ink">Rendered {summary?.assetsRendered ?? 0}</div>
            {summary && (summary.assetsFailed ?? 0) > 0 && (
              <div className="text-red-600">Failed {summary.assetsFailed}</div>
            )}
          </div>
        ) : (
          <span className="text-ink-muted">—</span>
        )}
      </td>
      <td className="py-3 pr-4">
        {research ? (
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs">
            <span className={research.logo ? "text-emerald-700" : "text-amber-600"}>
              Logo {research.logo ? "✓" : "–"}
            </span>
            <span className={research.heroImage ? "text-emerald-700" : "text-amber-600"}>
              Hero {research.heroImage ? "✓" : "–"}
            </span>
            <span className={research.services.length >= 2 ? "text-emerald-700" : "text-amber-600"}>
              Services {research.services.length}
            </span>
            <span className={research.contact.phone ? "text-emerald-700" : "text-amber-600"}>
              Phone {research.contact.phone ? "✓" : "–"}
            </span>
            <span className={research.contact.email ? "text-emerald-700" : "text-amber-600"}>
              Email {research.contact.email ? "✓" : "–"}
            </span>
            <span className={research.serviceAreas.length ? "text-emerald-700" : "text-amber-600"}>
              Areas {research.serviceAreas.length}
            </span>
          </div>
        ) : (
          <span className="text-ink-muted">—</span>
        )}
        {research && (research.missingFields?.length ?? 0) > 0 && (
          <div className="mt-1 text-[11px] text-amber-600">
            Missing: {research.missingFields.join(", ")}
          </div>
        )}
      </td>
      <td className="py-3">
        {research && (research.manualReview?.length ?? 0) > 0 ? (
          <ul className="space-y-1 text-xs text-red-700">
            {research.manualReview.slice(0, 3).map((m, i) => (
              <li key={i}>{m}</li>
            ))}
            {research.manualReview.length > 3 && (
              <li className="text-ink-muted">+{research.manualReview.length - 3} more…</li>
            )}
          </ul>
        ) : research ? (
          <span className="text-xs text-emerald-700">Clear — no human review needed</span>
        ) : (
          <span className="text-xs text-ink-muted">Research not run</span>
        )}
      </td>
      <td className="py-3 pl-4 text-center">
        {summary ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold ${
              summary.safeToPublish ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}
            title={
              summary.safeToPublish
                ? "Verified research, no manual reviews, ≤3 missing fields"
                : `safeToPublish=false (status: ${summary.status})`
            }
          >
            {summary.safeToPublish ? "Safe" : "Review"}
          </span>
        ) : (
          <span className="text-[11px] text-ink-muted">—</span>
        )}
      </td>
    </tr>
  );
}

export default async function ProspectsReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; template?: string }>;
}) {
  const params = await searchParams;
  const template: TemplateKey = TEMPLATE_TABS.some((t) => t.key === params.template)
    ? (params.template as TemplateKey)
    : "all";
  const niche: NicheKey = NICHE_TABS.some((t) => t.key === params.niche)
    ? (params.niche as NicheKey)
    : "all";

  const matchesBoth = (p: ProspectConfig) =>
    matchesTemplate(p, template) && matchesNiche(p, niche);

  const scoped = allProspects.filter(matchesBoth);
  const researched = scoped.filter((p) => getResearch(p.slug));
  const pending = scoped.filter((p) => !getResearch(p.slug));
  const ready = scoped.filter((p) => p.researchSummary?.safeToPublish);

  const link = (over: { template?: TemplateKey; niche?: NicheKey }) => {
    const t = over.template ?? template;
    const n = over.niche ?? niche;
    const sp = new URLSearchParams();
    if (t !== "all") sp.set("template", t);
    if (n !== "all") sp.set("niche", n);
    const qs = sp.toString();
    return qs ? `/prospects?${qs}` : "/prospects";
  };

  // Faceted counts: each facet counts the pool narrowed by the *other* facet.
  const templatePool = allProspects.filter((p) => matchesNiche(p, niche));
  const nichePool = allProspects.filter((p) => matchesTemplate(p, template));
  const templateCounts: Record<TemplateKey, number> = {
    all: templatePool.length,
    real_estate: templatePool.filter((p) => templateOf(p) === "real_estate").length,
    hvac: templatePool.filter((p) => templateOf(p) === "hvac").length,
  };
  const nicheCounts: Record<NicheKey, number> = {
    all: nichePool.length,
    real_estate: nichePool.filter((p) => nicheOf(p) === "real_estate").length,
    hvac: nichePool.filter((p) => nicheOf(p) === "hvac").length,
    other: nichePool.filter((p) => nicheOf(p) === "other").length,
  };

  const tabsFor = <K extends string>(
    tabs: { key: K; label: string }[],
    active: K,
    counts: Record<K, number>,
    onPick: (key: K) => string
  ) => (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={onPick(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
              isActive
                ? "border-ink bg-ink text-white"
                : "border-line bg-slate-50 text-ink-muted hover:border-ink/40 hover:text-ink"
            }`}
          >
            {tab.label}
            <span className={`tabular-nums ${isActive ? "text-white/70" : "text-ink-muted/60"}`}>
              {counts[tab.key]}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-ink">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-700">
          Internal · not linked from public pages
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Prospect Research & Asset Review
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Per-prospect coverage produced by <code className="rounded bg-line/60 px-1">scripts/research-prospect.mjs</code>.
          Assets are validated over the network at research time; anything missing is reported here — no data is ever invented.
        </p>

        <div className="mt-6 space-y-3">
          <div>
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
              Demo template
            </div>
            {tabsFor(TEMPLATE_TABS, template, templateCounts, (key) =>
              link({ template: key })
            )}
          </div>
          <div>
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
              Stated industry
            </div>
            {tabsFor(NICHE_TABS, niche, nicheCounts, (key) => link({ niche: key }))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "In view", value: scoped.length },
            { label: "Researched", value: researched.length },
            { label: "Manual review needed", value: scoped.filter((p) => p.researchSummary?.status === "manual_review_required").length },
            { label: "Safe to publish", value: ready.length },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-slate-50 p-4">
              <div className="font-display text-3xl font-extrabold tabular-nums">{s.value}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="font-display text-xl font-extrabold tracking-tight">
            Researched prospects{" "}
            <span className="text-ink-muted">({researched.length})</span>
          </h2>
          {researched.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-line bg-slate-50 px-4 py-6 text-sm text-ink-muted">
              No researched prospects match these filters.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-slate-50 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                    <th className="px-4 py-3">Prospect</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Assets (disc/valid/rend/fail)</th>
                    <th className="px-4 py-3">Verified coverage</th>
                    <th className="px-4 py-3">Human review notes</th>
                    <th className="px-4 py-3 text-center">Publish</th>
                  </tr>
                </thead>
                <tbody>
                  {researched.map((p) => (
                    <Row key={p.slug} slug={p.slug} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {pending.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-extrabold tracking-tight">
              Not yet researched{" "}
              <span className="text-ink-muted">({pending.length})</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              These prospects still render on controlled stock templates. Point
              <code className="rounded bg-line/60 px-1"> scripts/research-targets.json</code> at
              their real website and re-run the pipeline to upgrade them.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {pending.map((p) => (
                <span key={p.slug} className="rounded-full border border-line bg-slate-50 px-3 py-1.5 text-xs font-semibold text-ink-muted">
                  {p.displayName}
                  <span className="ml-1.5 text-ink-muted/60">{p.slug}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        <p className="mt-12 max-w-3xl text-xs leading-relaxed text-ink-muted">
          Fallback policy: at render time every asset resolves through research → hand-curated
          real images → branded stock imagery. Failed or missing assets never break a demo and are
          surfaced in this page so a human can fix them before publishing.
        </p>
      </div>
    </main>
  );
}