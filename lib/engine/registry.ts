import fs from "node:fs";
import path from "node:path";
import type { ProspectResearch } from "@/lib/types";
import type { CompanyRecord, DemoConfig } from "./types";
import { buildContent } from "./content";
import { recipeForFamily, resolveTheme } from "./theme";

const ROOT = process.cwd();
const COMPANIES_PATH = path.join(ROOT, "data/generated/companies.json");
const RESEARCH_DIR = path.join(ROOT, "lib/research/data");

let cachedCompanies: CompanyRecord[] | null = null;
const researchCache = new Map<string, ProspectResearch | null>();

function loadCompanies(): CompanyRecord[] {
  if (cachedCompanies) return cachedCompanies;
  if (!fs.existsSync(COMPANIES_PATH)) {
    throw new Error(
      "Company registry not found. Run `node scripts/build-company-registry.mjs` first."
    );
  }
  cachedCompanies = JSON.parse(fs.readFileSync(COMPANIES_PATH, "utf8")) as CompanyRecord[];
  return cachedCompanies;
}

function loadResearch(slug: string): ProspectResearch | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  if (researchCache.has(slug)) return researchCache.get(slug) ?? null;
  const file = path.join(RESEARCH_DIR, `${slug}.json`);
  let research: ProspectResearch | null = null;
  if (fs.existsSync(file)) {
    try {
      research = JSON.parse(fs.readFileSync(file, "utf8")) as ProspectResearch;
    } catch {
      research = null;
    }
  }
  researchCache.set(slug, research);
  return research;
}

export function getCompany(slug: string): CompanyRecord | undefined {
  return loadCompanies().find((company) => company.identity.slug === slug);
}

export function getDemo(slug: string): DemoConfig | undefined {
  const company = getCompany(slug);
  if (!company) return undefined;
  const research = loadResearch(slug);
  return {
    company,
    research,
    theme: resolveTheme(
      company.industryFamily,
      research?.colors ?? null,
      company.branding.primaryColor
    ),
    recipe: recipeForFamily(company.industryFamily),
    content: buildContent(company, research),
  };
}

export type DemoSummary = {
  slug: string;
  companyId: string;
  demoId: string;
  name: string;
  domain: string;
  family: string;
  familyLabel: string;
  city: string | null;
  country: string | null;
  eligible: boolean;
  researchAvailable: boolean;
  hasRating: boolean;
  serviceCount: number;
  imageVerified: boolean;
};

export function listDemos(options?: { eligibleOnly?: boolean }): DemoSummary[] {
  const companies = loadCompanies();
  return companies
    .filter((company) => !options?.eligibleOnly || company.eligibility.eligible)
    .map((company) => {
      const research = loadResearch(company.identity.slug);
      const content = buildContent(company, research);
      return {
        slug: company.identity.slug,
        companyId: company.companyId,
        demoId: company.identity.demoId,
        name: content.brandName,
        domain: company.domain,
        family: company.industryFamily,
        familyLabel: company.industryFamilyLabel,
        city: content.city,
        country: content.country,
        eligible: company.eligibility.eligible,
        researchAvailable: Boolean(research),
        hasRating: Boolean(content.rating),
        serviceCount: content.services.length,
        imageVerified: content.hero.imageVerified,
      };
    });
}

export function getRegistryTotals() {
  const companies = loadCompanies();
  const eligible = companies.filter((c) => c.eligibility.eligible);
  const families: Record<string, number> = {};
  for (const company of eligible) {
    families[company.industryFamily] = (families[company.industryFamily] ?? 0) + 1;
  }
  return {
    total: companies.length,
    eligible: eligible.length,
    excluded: companies.length - eligible.length,
    families,
  };
}
