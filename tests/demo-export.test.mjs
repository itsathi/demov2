import test from "node:test";
import assert from "node:assert/strict";

import {
  DEMO_CSV_COLUMNS,
  buildDemoExport,
  buildDemoExportRows,
  escapeCsvField,
  findDuplicateCompanyDomains,
  normalizeCompanyDomain,
  sanitizeCsvFormula,
  serializeDemoCsv,
  summarizeDemoExport,
} from "../lib/demoExport.ts";

const BASE_URL = "https://demos.athinem.test";

function makeSource(index, overrides = {}) {
  return {
    slug: `demo-${index}`,
    companyName: `Company ${index}`,
    displayName: `Demo ${index}`,
    contact: { email: `hello@company${index}.com` },
    research: null,
    demoMeta: {
      demoId: `demo-${index}`,
      leadId: `lead-${index}`,
      companyDomain: `company${index}.com`,
      status: "published",
    },
    ...overrides,
  };
}

test("exports every eligible record and excludes soft-deleted records", () => {
  const sources = Array.from({ length: 152 }, (_, index) => makeSource(index));
  sources[3] = makeSource(3, {
    demoMeta: { ...sources[3].demoMeta, deleted: true },
  });
  sources[77] = makeSource(77, {
    demoMeta: { ...sources[77].demoMeta, deleted: true },
  });

  const result = buildDemoExport(sources, { baseUrl: BASE_URL });

  assert.equal(sources.length, 152);
  assert.equal(result.rows.length, 150);
  assert.equal(result.summary.total, 150);
  assert.equal(result.rows.length, sources.filter((s) => !s.demoMeta.deleted).length);
});

test("uses the exact stable CSV schema and a header row", () => {
  const csv = serializeDemoCsv([]);
  assert.equal(
    csv,
    "demo_id,lead_id,company_name,company_domain,demo_name,demo_url,demo_status,created_at,updated_at,project_id\r\n"
  );
  assert.deepEqual(DEMO_CSV_COLUMNS, [
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
  ]);
});

test("keeps company_domain separate from the demo URL host", () => {
  const [row] = buildDemoExportRows(
    [
      {
        slug: "acme",
        companyName: "Acme LLC",
        displayName: "Acme",
        demoMeta: {
          demoId: "acme",
          companyDomain: "acme.com",
          demoUrl: "https://acme-preview.vercel.app/?ref=demo&audit=1",
        },
      },
    ],
    { baseUrl: "https://demos.athinem.test" }
  );

  assert.equal(row.company_domain, "acme.com");
  assert.equal(row.demo_url, "https://acme-preview.vercel.app/?ref=demo&audit=1");
  assert.notEqual(new URL(row.demo_url).hostname, row.company_domain);
});

test("preserves query parameters, custom domains and Vercel preview URLs", () => {
  const rows = buildDemoExportRows(
    [
      makeSource(1, {
        demoMeta: {
          demoId: "one",
          companyDomain: "one.com",
          demoUrl: "https://preview-123.vercel.app/one?utm_source=crm&x=1",
        },
      }),
      makeSource(2, {
        demoMeta: {
          demoId: "two",
          companyDomain: "two.com",
          demoUrl: "https://demos.custom-host.example/two?ref=audit",
        },
      }),
      makeSource(3, {
        demoMeta: {
          demoId: "three",
          companyDomain: "three.com",
        },
      }),
    ],
    { baseUrl: `${BASE_URL}/` }
  );

  assert.equal(rows[0].demo_url, "https://preview-123.vercel.app/one?utm_source=crm&x=1");
  assert.equal(rows[1].demo_url, "https://demos.custom-host.example/two?ref=audit");
  assert.equal(rows[2].demo_url, `${BASE_URL}/demo-3`);
});

test("handles missing demo IDs, domains and URLs without inventing values", () => {
  const [row] = buildDemoExportRows(
    [
      {
        slug: "",
        companyName: "Mystery Co",
        displayName: "Mystery",
        demoMeta: { status: "published" },
      },
    ],
    { baseUrl: BASE_URL }
  );

  assert.equal(row.demo_id, "");
  assert.equal(row.company_domain, "");
  assert.equal(row.demo_url, "");
  assert.deepEqual(row.review_reasons, [
    "missing_demo_id",
    "missing_company_domain",
    "missing_demo_url",
  ]);

  const summary = summarizeDemoExport([row]);
  assert.equal(summary.missingDemoIds, 1);
  assert.equal(summary.missingCompanyDomains, 1);
  assert.equal(summary.missingDemoUrls, 1);
});

test("preserves duplicate company domains and reports them", () => {
  const sources = [
    makeSource(1, {
      demoMeta: { demoId: "one", companyDomain: "shared.com", status: "published" },
    }),
    makeSource(2, {
      demoMeta: { demoId: "two", companyDomain: "shared.com", status: "draft" },
    }),
    makeSource(3, {
      demoMeta: { demoId: "three", companyDomain: "unique.com", status: "published" },
    }),
  ];

  const rows = buildDemoExportRows(sources, { baseUrl: BASE_URL });
  const summary = summarizeDemoExport(rows);
  const duplicates = findDuplicateCompanyDomains(rows);

  assert.equal(rows.length, 3);
  assert.equal(rows.filter((row) => row.company_domain === "shared.com").length, 2);
  assert.equal(summary.duplicateCompanyDomains, 1);
  assert.equal(summary.duplicateCompanyDomainRows, 2);
  assert.equal(duplicates[0].domain, "shared.com");
});

test("counts published, draft and archived demos", () => {
  const rows = buildDemoExportRows(
    [
      makeSource(1, { demoMeta: { status: "published" } }),
      makeSource(2, { demoMeta: { status: "draft" } }),
      makeSource(3, { demoMeta: { archived: true } }),
      makeSource(4, { demoMeta: { status: "archived" } }),
    ],
    { baseUrl: BASE_URL }
  );

  const summary = summarizeDemoExport(rows);
  assert.equal(summary.published, 1);
  assert.equal(summary.draft, 1);
  assert.equal(summary.archived, 2);
  assert.deepEqual(
    rows.map((row) => row.demo_status),
    ["published", "draft", "archived", "archived"]
  );
});

test("escapes commas, quotes, line breaks and surrounding whitespace", () => {
  assert.equal(escapeCsvField("Acme, Inc"), '"Acme, Inc"');
  assert.equal(escapeCsvField('Acme "Quote" Co'), '"Acme ""Quote"" Co"');
  assert.equal(escapeCsvField("line one\nline two"), '"line one\nline two"');
  assert.equal(escapeCsvField("line one\r\nline two"), '"line one\r\nline two"');
  assert.equal(escapeCsvField("  padded  "), '"  padded  "');
  assert.equal(escapeCsvField("https://example.com/a?b=1&c=2"), "https://example.com/a?b=1&c=2");
});

test("prevents spreadsheet formula injection", () => {
  for (const value of ["=SUM(A1:A2)", "+1", "-1", "@cmd", "\tvalue", "\rvalue", "  =cmd"]) {
    assert.ok(sanitizeCsvFormula(value).startsWith("'"), value);
  }
  assert.equal(sanitizeCsvFormula("normal value"), "normal value");
  assert.equal(
    sanitizeCsvFormula("https://example.com/demo?x=1"),
    "https://example.com/demo?x=1"
  );
});

test("sanitizes special company names in the serialized CSV", () => {
  const rows = buildDemoExportRows(
    [
      makeSource(1, {
        companyName: '=HYPERLINK("http://evil")',
        displayName: "Acme, Inc.\nSecond line",
        demoMeta: { demoId: "one", companyDomain: "acme.com", status: "published" },
      }),
    ],
    { baseUrl: BASE_URL }
  );

  const csv = serializeDemoCsv(rows);
  assert.ok(csv.includes('"\'=HYPERLINK(""http://evil"")"'));
  assert.ok(csv.includes('"Acme, Inc.\nSecond line"'));
});

test("derives company domains from source metadata and research only", () => {
  assert.equal(normalizeCompanyDomain("https://www.Example.com/path?q=1"), "www.example.com");
  assert.equal(normalizeCompanyDomain("example.com"), "example.com");

  const [fromMeta, fromResearch, noGeneratedFallback, fromCuratedEmail] =
    buildDemoExportRows(
      [
        makeSource(1, {
          demoMeta: { companyDomain: "https://meta.example.com/about", status: "published" },
        }),
        makeSource(2, {
          demoMeta: { status: "published" },
          research: { sourceUrl: "https://www.research.example.org/" },
        }),
        makeSource(3, {
          demoMeta: { status: "published" },
          contact: { email: "info@fabricated-fallback.example" },
        }),
        {
          slug: "curated",
          displayName: "Curated",
          contact: { email: "hello@curated-brand.com" },
        },
      ],
      { baseUrl: BASE_URL }
    );

  assert.equal(fromMeta.company_domain, "meta.example.com");
  assert.equal(fromResearch.company_domain, "www.research.example.org");
  assert.equal(noGeneratedFallback.company_domain, "");
  assert.equal(fromCuratedEmail.company_domain, "curated-brand.com");
});

test("does not mutate source records", () => {
  const source = makeSource(1);
  const before = JSON.stringify(source);
  buildDemoExport([source], { baseUrl: BASE_URL });
  assert.equal(JSON.stringify(source), before);
});

test("exports 150+ rows with all required fields populated", () => {
  const sources = Array.from({ length: 160 }, (_, index) =>
    makeSource(index, {
      companyName: `Company ${index}, "Special"`,
      demoMeta: {
        demoId: `demo-${index}`,
        leadId: `lead-${index}`,
        projectId: `project-${index}`,
        companyDomain: `company${index}.com`,
        status: "published",
        createdAt: `2026-01-${String((index % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
        updatedAt: `2026-02-${String((index % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
      },
    })
  );

  const result = buildDemoExport(sources, { baseUrl: BASE_URL });

  assert.equal(result.rows.length, 160);
  assert.equal(result.summary.total, 160);
  assert.equal(result.summary.missingCompanyDomains, 0);
  assert.equal(result.summary.missingDemoUrls, 0);
  assert.equal(result.summary.missingDemoIds, 0);
  for (const row of result.rows) {
    assert.ok(row.demo_id);
    assert.ok(row.lead_id);
    assert.ok(row.company_name);
    assert.ok(row.company_domain);
    assert.ok(row.demo_name);
    assert.ok(row.demo_url.startsWith(`${BASE_URL}/`));
    assert.equal(row.demo_status, "published");
    assert.ok(row.created_at);
    assert.ok(row.updated_at);
    assert.ok(row.project_id);
  }
});
