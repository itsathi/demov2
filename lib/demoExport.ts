import type { DemoLifecycleStatus, DemoRegistryMeta } from "./types";

/**
 * Bulk demo registry export.
 *
 * This module is deliberately pure: it reads the existing demo records, derives
 * a CSV row for each eligible demo, and never mutates the underlying data. It
 * has no database or framework dependencies so the same logic can be exercised
 * by the test suite and reused by the admin route.
 */

export const DEMO_CSV_COLUMNS = [
  "demo_id",
  "lead_id",
  "company_name",
  "company_domain",
  "demo_name",
  "demo_url",
  "demo_status",
  "created_at",
  "updated_at",
  "project_id",
] as const;

export type DemoCsvColumn = (typeof DEMO_CSV_COLUMNS)[number];

export type DemoReviewReason =
  | "missing_demo_id"
  | "missing_company_domain"
  | "missing_demo_url";

export type DemoExportRow = {
  demo_id: string;
  lead_id: string;
  company_name: string;
  company_domain: string;
  demo_name: string;
  demo_url: string;
  demo_status: DemoLifecycleStatus;
  created_at: string;
  updated_at: string;
  project_id: string;
  /** Internal review signal; never written to the CSV. */
  review_reasons: DemoReviewReason[];
};

/**
 * Minimal structural shape needed for export. A full `ProspectConfig` (and the
 * synthetic records used in tests) both satisfy it.
 */
export type DemoExportSource = {
  slug?: string | null;
  companyName?: string | null;
  displayName?: string | null;
  contact?: { email?: string | null } | null;
  research?: { sourceUrl?: string | null; resolvedUrl?: string | null } | null;
  demoMeta?: DemoRegistryMeta | null;
};

export type DemoExportSummary = {
  total: number;
  published: number;
  draft: number;
  archived: number;
  missingCompanyDomains: number;
  missingDemoUrls: number;
  duplicateCompanyDomains: number;
  duplicateCompanyDomainRows: number;
  missingDemoIds: number;
};

export type DemoExportOptions = {
  /** Origin used to build absolute demo URLs, e.g. https://demos.example.com */
  baseUrl: string;
  /** Soft-deleted records are excluded unless explicitly requested. */
  includeDeleted?: boolean;
};

export type DemoExportResult = {
  rows: DemoExportRow[];
  summary: DemoExportSummary;
  csv: string;
};

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "mail.com",
  "yandex.com",
]);

function nonEmpty(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Normalize a base URL to a protocol-qualified origin/path without a trailing slash. */
export function normalizeBaseUrl(value: string | null | undefined): string {
  let base = nonEmpty(value);
  if (!base) return "";
  if (!/^https?:\/\//i.test(base)) base = `https://${base}`;
  return base.replace(/\/+$/, "");
}

/**
 * Derive the business's own domain from a domain or URL value.
 *
 * This is intentionally separate from `demo_url`: the demo is hosted on our
 * infrastructure (Vercel/preview/custom demo host) while `company_domain` is
 * the prospect's real website domain.
 */
export function normalizeCompanyDomain(value: string | null | undefined): string {
  const raw = nonEmpty(value);
  if (!raw) return "";
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const host = new URL(candidate).hostname.toLowerCase().replace(/\.$/, "");
    if (!host) return "";
    return host;
  } catch {
    return "";
  }
}

/** Build registry metadata for a generated demo from its raw source record. */
export function buildDemoMeta(
  source: {
    id?: string | null;
    domain?: string | null;
    website?: string | null;
  },
  slug: string
): DemoRegistryMeta {
  const leadId = nonEmpty(source.id);
  const companyDomain =
    normalizeCompanyDomain(source.domain) || normalizeCompanyDomain(source.website);

  return {
    demoId: slug,
    ...(leadId ? { leadId } : {}),
    ...(companyDomain ? { companyDomain } : {}),
    status: "published",
  };
}

function deriveCompanyDomain(source: DemoExportSource): string {
  const meta = source.demoMeta;

  const explicit = normalizeCompanyDomain(meta?.companyDomain);
  if (explicit) return explicit;

  const researchUrl =
    normalizeCompanyDomain(source.research?.resolvedUrl) ||
    normalizeCompanyDomain(source.research?.sourceUrl);
  if (researchUrl) return researchUrl;

  // Hand-curated configs may not have source metadata; their authored contact
  // email is a reliable fallback. Generated configs always carry `demoMeta`,
  // so a fabricated generator fallback email is never treated as a domain.
  if (!meta) {
    const email = nonEmpty(source.contact?.email);
    const at = email.lastIndexOf("@");
    if (at > 0) {
      const domain = normalizeCompanyDomain(email.slice(at + 1));
      if (domain && !FREE_EMAIL_DOMAINS.has(domain)) return domain;
    }
  }

  return "";
}

/**
 * Resolve the base URL for demo links from an explicit env override or the
 * incoming request's forwarded host/protocol. The env override is useful when
 * the admin page is served behind a proxy or on a different public origin.
 */
export function resolveDemoBaseUrl(headers: {
  get(name: string): string | null;
}): string {
  const fromEnv = normalizeBaseUrl(
    process.env.DEMO_BASE_URL || process.env.NEXT_PUBLIC_DEMO_BASE_URL
  );
  if (fromEnv) return fromEnv;

  const host =
    nonEmpty(headers.get("x-forwarded-host")) || nonEmpty(headers.get("host"));
  if (!host) return "";

  const forwardedProto = nonEmpty(headers.get("x-forwarded-proto"));
  const proto = forwardedProto ? forwardedProto.split(",")[0].trim() : "http";
  return normalizeBaseUrl(`${proto}://${host.split(",")[0].trim()}`);
}

function buildDemoUrl(
  baseUrl: string,
  slug: string,
  explicitDemoUrl: string | undefined
): string {
  const custom = nonEmpty(explicitDemoUrl);
  if (custom) {
    if (/^https?:\/\//i.test(custom)) return custom;
    const base = normalizeBaseUrl(baseUrl);
    return base ? `${base}/${custom.replace(/^\/+/, "")}` : "";
  }

  if (!slug) return "";
  const base = normalizeBaseUrl(baseUrl);
  return base ? `${base}/${slug}` : "";
}

function rowForSource(
  source: DemoExportSource,
  options: DemoExportOptions
): DemoExportRow {
  const meta = source.demoMeta ?? undefined;
  const slug = nonEmpty(source.slug);
  const demoId = nonEmpty(meta?.demoId) || slug;
  const companyDomain = deriveCompanyDomain(source);
  const demoUrl = buildDemoUrl(options.baseUrl, slug, meta?.demoUrl);
  const status: DemoLifecycleStatus = meta?.archived
    ? "archived"
    : meta?.status ?? "published";

  const row: DemoExportRow = {
    demo_id: demoId,
    lead_id: nonEmpty(meta?.leadId),
    company_name: nonEmpty(source.companyName) || nonEmpty(source.displayName),
    company_domain: companyDomain,
    demo_name: nonEmpty(source.displayName) || nonEmpty(source.companyName),
    demo_url: demoUrl,
    demo_status: status,
    created_at: nonEmpty(meta?.createdAt),
    updated_at: nonEmpty(meta?.updatedAt),
    project_id: nonEmpty(meta?.projectId),
    review_reasons: [],
  };

  if (!row.demo_id) row.review_reasons.push("missing_demo_id");
  if (!row.company_domain) row.review_reasons.push("missing_company_domain");
  if (!row.demo_url) row.review_reasons.push("missing_demo_url");

  return row;
}

/**
 * Build one row per eligible source demo, preserving input order and duplicates
 * (two demos may legitimately share a company domain). Records marked deleted
 * are skipped unless explicitly included.
 */
export function buildDemoExportRows(
  sources: readonly DemoExportSource[],
  options: DemoExportOptions
): DemoExportRow[] {
  const rows: DemoExportRow[] = [];
  for (const source of sources) {
    if (source.demoMeta?.deleted && !options.includeDeleted) continue;
    rows.push(rowForSource(source, options));
  }
  return rows;
}

export type DuplicateCompanyDomainGroup = {
  domain: string;
  rows: DemoExportRow[];
};

export function findDuplicateCompanyDomains(
  rows: readonly DemoExportRow[]
): DuplicateCompanyDomainGroup[] {
  const grouped = new Map<string, DemoExportRow[]>();
  for (const row of rows) {
    if (!row.company_domain) continue;
    const list = grouped.get(row.company_domain) ?? [];
    list.push(row);
    grouped.set(row.company_domain, list);
  }
  return Array.from(grouped.entries())
    .filter(([, list]) => list.length > 1)
    .map(([domain, list]) => ({ domain, rows: list }));
}

export function summarizeDemoExport(
  rows: readonly DemoExportRow[]
): DemoExportSummary {
  const duplicates = findDuplicateCompanyDomains(rows);

  return {
    total: rows.length,
    published: rows.filter((row) => row.demo_status === "published").length,
    draft: rows.filter((row) => row.demo_status === "draft").length,
    archived: rows.filter((row) => row.demo_status === "archived").length,
    missingCompanyDomains: rows.filter((row) => !row.company_domain).length,
    missingDemoUrls: rows.filter((row) => !row.demo_url).length,
    duplicateCompanyDomains: duplicates.length,
    duplicateCompanyDomainRows: duplicates.reduce(
      (count, group) => count + group.rows.length,
      0
    ),
    missingDemoIds: rows.filter((row) => !row.demo_id).length,
  };
}

/**
 * Protect spreadsheet readers from CSV formula injection while leaving ordinary
 * values (including full URLs) untouched.
 */
export function sanitizeCsvFormula(value: string): string {
  if (!value) return value;
  // Leading whitespace is ignored by some spreadsheet parsers, so check through
  // it as well as the first visible character.
  return /^[\s]*[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

export function escapeCsvField(value: string | null | undefined): string {
  const raw = value == null ? "" : String(value);
  const safe = sanitizeCsvFormula(raw);
  if (/[",\r\n]/.test(safe) || /^\s|\s$/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

/** Serialize rows to RFC-4180-style UTF-8 CSV with a header row. */
export function serializeDemoCsv(rows: readonly DemoExportRow[]): string {
  const lines: string[] = [DEMO_CSV_COLUMNS.join(",")];

  for (const row of rows) {
    lines.push(
      DEMO_CSV_COLUMNS.map((column) => escapeCsvField(row[column])).join(",")
    );
  }

  return `${lines.join("\r\n")}\r\n`;
}

export function buildDemoExport(
  sources: readonly DemoExportSource[],
  options: DemoExportOptions
): DemoExportResult {
  const rows = buildDemoExportRows(sources, options);
  return {
    rows,
    summary: summarizeDemoExport(rows),
    csv: serializeDemoCsv(rows),
  };
}
