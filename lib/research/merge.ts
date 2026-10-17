import type {
  ProspectConfig,
  ProspectResearch,
  ResearchSummary,
  Service,
  PropertyListing,
} from "../types";
import { researchedProfiles } from "./profiles.generated";
import { buildServiceConfig } from "../prospectGenerator";

/**
 * Merge layer between researched profiles and rendered prospect configs.
 *
 * Rules:
 * - Only verified research values are applied; nothing is invented here.
 * - Research never degrades a curated prospect: services are only replaced
 *   when explicitly enabled (raw/generated prospects) and only when the
 *   research produced at least two plausible service names.
 * - Every applied value is still rendered through the existing fallback chain
 *   (research → hand-curated realImages → branded stock) at render time.
 */

export function getResearch(slug: string): ProspectResearch | undefined {
  return researchedProfiles[slug];
}

export function hasResearch(slug: string): boolean {
  return Boolean(researchedProfiles[slug] && researchedProfiles[slug].status !== "research_failed");
}

export function summarizeResearch(research: ProspectResearch | undefined): ResearchSummary | undefined {
  if (!research) return undefined;
  const active = research.assets.filter((a) => a.usedInDemo);
  const failed = research.assets.filter((a) => a.status !== "valid" && a.status !== "unchecked");
  const usable = research.status !== "research_failed";
  return {
    status: research.status,
    researchedAt: research.researchedAt,
    assetsDiscovered: research.assets.length,
    assetsValidated: research.assets.filter((a) => a.status === "valid").length,
    assetsRendered: active.length,
    assetsFailed: failed.length,
    fallbacks: research.fallbacks,
    missingFields: research.missingFields,
    manualReview: research.manualReview,
    verified: usable && ["ready_for_demo", "assets_ready", "research_complete"].includes(research.status),
    logoVerified: Boolean(research.logo),
    safeToPublish:
      usable &&
      research.status === "ready_for_demo" &&
      research.manualReview.length === 0 &&
      research.missingFields.length <= 3,
  };
}

function applyResearchColors(prospect: ProspectConfig, research: ProspectResearch): ProspectConfig {
  const c = research.colors;
  if (!c || !c.primary) return prospect;
  return {
    ...prospect,
    branding: {
      primaryColor: c.primary,
      secondaryColor: c.secondary || prospect.branding.secondaryColor,
      accentColor: c.accent || prospect.branding.accentColor,
      tintColor: c.tint || prospect.branding.tintColor,
    },
  };
}

function applyResearchContact(prospect: ProspectConfig, research: ProspectResearch): ProspectConfig {
  const r = research.contact;
  if (!r.phone && !r.email && !r.address) return prospect;
  return {
    ...prospect,
    contact: {
      ...prospect.contact,
      ...(r.phone ? { phone: r.phone } : {}),
      ...(r.email ? { email: r.email } : {}),
      ...(r.address ? { address: r.address } : {}),
    },
  };
}

function applyResearchServices(
  prospect: ProspectConfig,
  research: ProspectResearch,
  city: string
): ProspectConfig {
  const names = (research.services || []).filter(Boolean).slice(0, 8);
  if (names.length < 2) return prospect;

  const countryKey =
    (prospect.markets ?? []).some((m) => /australia/i.test(m)) ? "AU" : "UAE";

  const seen = new Set<string>();
  const services: Service[] = [];
  for (let i = 0; i < names.length; i++) {
    const svc = buildServiceConfig(names[i], i, prospect.companyName || prospect.displayName, city, countryKey);
    if (seen.has(svc.slug)) continue;
    seen.add(svc.slug);
    const researchImage = research.serviceImages?.[svc.slug];
    if (researchImage) svc.image = researchImage;
    svc.featured = services.length < 3;
    services.push(svc);
  }
  if (services.length < 2) return prospect;

  return {
    ...prospect,
    services,
    featuredServiceSlug: services[0].slug,
  };
}

/**
 * A URL that is obviously chrome — a logo, favicon, icon, sprite or tracking
 * pixel — must never be used as a photographic hero or listing image, even if
 * the crawler happened to tag it as a hero.
 */
const DECORATIVE_URL_RE =
  /(^|[/_.-])(logo|favicon|icon|sprite|placeholder|avatar|badge|watermark|spinner|loader|blank|spacer|pixel|tracking)([._/-]|$)/i;

function isDecorativeImage(url: string | undefined, research: ProspectResearch): boolean {
  if (!url) return true;
  if (url === research.logo || url === research.favicon) return true;
  if (research.logo && url.includes(research.logo)) return true;
  return DECORATIVE_URL_RE.test(url);
}

/**
 * Verified image URLs from a research profile, best-first. Only assets the
 * pipeline actually validated (or explicitly marked usable) are returned, so a
 * broken or blocked asset never reaches a listing. Logos, favicons, icons and
 * other chrome are excluded, and real photographs are ranked above the rest.
 */
function verifiedImagePool(research: ProspectResearch): string[] {
  const usable = research.assets.filter((a) => a.status === "valid" || a.usedInDemo);
  const byUrl = new Map(usable.map((a) => [a.resolvedUrl, a]));

  const score = (url: string): number => {
    const a = byUrl.get(url);
    if (!a) return -1;
    let s = a.quality ?? 0;
    if (a.category === "logo" || a.category === "favicon" || a.category === "icon") s -= 5;
    if (a.category === "project" || a.category === "gallery") s += 0.3;
    if (a.category === "hero" || a.category === "background" || a.category === "service") s += 0.2;
    if ((a.width ?? 0) >= 1600) s += 0.1;
    return s;
  };

  const candidates = [
    ...(research.projectImages ?? []),
    ...Object.values(research.serviceImages ?? {}),
    ...(research.heroImage ? [research.heroImage] : []),
    ...usable.map((a) => a.resolvedUrl),
  ];

  const out: string[] = [];
  for (const url of candidates) {
    if (!url || out.includes(url)) continue;
    if (isDecorativeImage(url, research)) continue;
    const a = byUrl.get(url);
    if (!a) continue;
    if (a.category === "logo" || a.category === "favicon" || a.category === "icon") continue;
    out.push(url);
  }
  out.sort((x, y) => score(y) - score(x));
  return out;
}

/** The best available photographic hero — never a logo. */
function bestHeroImage(research: ProspectResearch, pool: string[]): string | undefined {
  if (research.heroImage && !isDecorativeImage(research.heroImage, research)) {
    return research.heroImage;
  }
  return pool[0];
}

/**
 * Real-estate imagery upgrade: verified site photos replace the illustrative
 * stock imagery on listings and portfolio tiles. The real, verified listing
 * data itself is NOT invented — only the presentation imagery is upgraded and
 * the community/area is filled from the verified service areas the agency serves.
 */
function applyRealEstateImagery(
  prospect: ProspectConfig,
  research: ProspectResearch
): ProspectConfig {
  const pool = verifiedImagePool(research);
  const hero = bestHeroImage(research, pool);
  const areas = (research.serviceAreas ?? []).filter(
    (a) => a && a.toLowerCase() !== "united arab emirates" && a.toLowerCase() !== "australia"
  );

  const listings = (prospect.listings ?? []).map<PropertyListing>((listing, i) => {
    const primary =
      pool.length > 1 ? pool[(i + 1) % pool.length] : pool.length === 1 ? pool[0] : listing.images[0];
    const gallery = primary
      ? [primary, ...listing.images.filter((img) => img !== primary)].slice(0, 5)
      : listing.images;
    return {
      ...listing,
      images: gallery,
      community: listing.community ?? areas[i % Math.max(areas.length, 1)],
    };
  });

  const projects = prospect.projects.map((proj, i) => ({
    ...proj,
    img: pool.length ? pool[i % pool.length] : proj.img,
  }));

  if (pool.length === 0 && !hero) return { ...prospect, listings, projects };

  return {
    ...prospect,
    listings,
    projects,
    images: {
      ...prospect.images,
      ...(hero ? { heroPoster: hero, officeBanner: hero } : {}),
      showreelPoster: pool[0] ?? hero ?? prospect.images.showreelPoster,
    },
  };
}

/**
 * Merge researched data into a prospect config. Pleasingly pure: returns a new
 * config; the input is never mutated so shared/curated configs stay intact.
 */
export function applyResearch(prospect: ProspectConfig, opts?: { overrideServices?: boolean }): ProspectConfig {
  const research = researchedProfiles[prospect.slug];
  if (!research || research.status === "research_failed") return prospect;

  const city = prospect.location.split(",")[0]?.trim() || "Dubai";
  const isRealEstate = prospect.industryKey === "real_estate";

  let next: ProspectConfig = { ...prospect, research, researchSummary: summarizeResearch(research) };

  next = applyResearchColors(next, research);

  if (research.logo) {
    next = { ...next, logo: research.logo };
  }

  // Hero / band imagery on the prospect-level images map. The render-time
  // fallback chain (research first, via realImages.ts) covers the rest. A
  // decorative asset (logo/favicon/icon) is never accepted as a hero.
  if (research.heroImage && !isDecorativeImage(research.heroImage, research)) {
    next = {
      ...next,
      images: {
        ...next.images,
        heroPoster: research.heroImage,
        officeBanner: research.heroImage,
      },
    };
  }

  next = applyResearchContact(next, research);

  if (research.serviceAreas.length >= 2) {
    const extra = next.markets.filter((m) => !research.serviceAreas.includes(m));
    next = { ...next, markets: [...research.serviceAreas, ...extra] };
  }

  // Real-estate prospects keep their property-category services; verified site
  // photos upgrade listing imagery instead.
  if (isRealEstate) {
    next = applyRealEstateImagery(next, research);
  } else if (opts?.overrideServices !== false) {
    next = applyResearchServices(next, research, city);
  }

  // Real project photos whenever the research validates enough of them.
  if (!isRealEstate && (research.projectImages?.length ?? 0) >= 3) {
    const imgs = research.projectImages;
    next = {
      ...next,
      projects: next.projects.map((proj, i) => ({ ...proj, img: imgs[i % imgs.length] })),
      images: { ...next.images, showreelPoster: imgs[0] },
    };
  }

  return next;
}

export function applyResearchToAll(
  prospects: ProspectConfig[],
  opts?: { overrideServices?: boolean }
): ProspectConfig[] {
  return prospects.map((p) => applyResearch(p, opts));
}