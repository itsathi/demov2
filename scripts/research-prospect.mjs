#!/usr/bin/env node
/**
 * Prospect research & real-asset pipeline.
 *
 * Fetches a prospect's public website, extracts verified business information
 * and image assets, validates every discovered asset over the network, and
 * writes a normalized profile that the demo renderer consumes.
 *
 * Usage:
 *   node scripts/research-prospect.mjs --slug rakea --name "RAKEA" --url https://rakeauae.com
 *   node scripts/research-prospect.mjs --batch scripts/research-targets.json
 *   node scripts/research-prospect.mjs --batch scripts/research-targets.json --only rakea,iec
 *
 * Output:
 *   lib/research/data/<slug>.json          (canonical per-prospect profile)
 *   lib/research/profiles.generated.ts     (typed module imported by the app)
 *
 * Nothing is invented: unavailable fields are recorded in `missingFields` and
 * left empty. Access controls, robots restrictions and authentication are
 * never bypassed.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "lib", "research", "data");
const GENERATED = path.join(ROOT, "lib", "research", "profiles.generated.ts");

const RESEARCH_VERSION = "1.0.0";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";
const FETCH_TIMEOUT = 20000;
const MAX_PAGES = 8;
const MAX_ASSETS_TO_VALIDATE = 48;
const VALIDATE_CONCURRENCY = 6;

/* ------------------------------------------------------------------ */
/* Small utilities                                                     */
/* ------------------------------------------------------------------ */

const log = (...a) => console.log("[research]", ...a);
const warn = (...a) => console.warn("[research]", ...a);

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeEntities(str = "") {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2f;/gi, "/")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function unique(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function titleCase(s = "") {
  return s
    .split(/\s+/)
    .map((w) => (w.length > 2 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase()))
    .join(" ")
    .trim();
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      try {
        out[idx] = await fn(items[idx], idx);
      } catch (err) {
        out[idx] = { __error: String(err && err.message ? err.message : err) };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

async function fetchWithTimeout(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeout ?? FETCH_TIMEOUT);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": UA,
        Accept: opts.accept ?? "text/html,application/xhtml+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        ...(opts.headers ?? {}),
      },
      ...opts,
    });
  } finally {
    clearTimeout(timer);
  }
}

function resolveUrl(ref, base) {
  try {
    return new URL(decodeEntities(ref.trim()), base).href;
  } catch {
    return undefined;
  }
}

/* ------------------------------------------------------------------ */
/* Lightweight HTML parsing (no external deps)                         */
/* ------------------------------------------------------------------ */

function parseAttrs(tag) {
  const attrs = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  while ((m = re.exec(tag))) {
    const name = m[1].toLowerCase();
    attrs[name] = decodeEntities(m[3] ?? m[4] ?? m[5] ?? "");
  }
  return attrs;
}

function metaMap(html) {
  const map = {};
  const re = /<meta\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const a = parseAttrs(m[0]);
    const key = (a.property || a.name || a.itemprop || "").toLowerCase();
    if (!key) continue;
    const value = a.content || a.value || "";
    if (!map[key]) map[key] = value;
  }
  return map;
}

function titleTag(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1]).replace(/\s+/g, " ").trim() : "";
}

function linkTags(html) {
  const out = [];
  const re = /<link\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) out.push(parseAttrs(m[0]));
  return out;
}

function parseSrcset(srcset = "") {
  // Choose the largest candidate by width descriptor (fallback: last entry).
  const parts = srcset
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [url, ...descriptors] = s.split(/\s+/);
      const w = descriptors.find((d) => /^\d+w$/.test(d));
      const x = descriptors.find((d) => /^\d+(\.\d+)?x$/.test(d));
      return { url, rank: w ? parseInt(w, 10) : x ? parseFloat(x) * 1000 : 0 };
    })
    .filter((c) => c.url);
  if (!parts.length) return undefined;
  parts.sort((a, b) => b.rank - a.rank);
  return parts[0].url;
}

function imgTags(html) {
  const out = [];
  const re = /<img\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const a = parseAttrs(m[0]);
    // Lazy-loaded images carry a data:/blob: placeholder in src — ignore it
    // so the real data-src URL is used instead.
    const rawSrc = a.src && !/^(data|blob):/i.test(a.src.trim()) ? a.src : undefined;
    const src =
      rawSrc ||
      a["data-src"] ||
      a["data-original"] ||
      a["data-lazy"] ||
      a["data-lazyload"] ||
      a["data-lazy-src"] ||
      (a.srcset ? parseSrcset(a.srcset) : undefined) ||
      (a["data-srcset"] ? parseSrcset(a["data-srcset"]) : undefined);
    if (!src) continue;
    out.push({
      src,
      srcset: a.srcset || a["data-srcset"],
      alt: a.alt || a.title || "",
      width: a.width ? parseInt(a.width, 10) : undefined,
      height: a.height ? parseInt(a.height, 10) : undefined,
      loading: a.loading,
      className: `${a.class || ""} ${a.id || ""}`.trim(),
    });
  }
  return out;
}

function sourceTags(html) {
  const out = [];
  const re = /<source\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const a = parseAttrs(m[0]);
    const src =
      a.src ||
      (a.srcset ? parseSrcset(a.srcset) : undefined) ||
      a["data-src"] ||
      (a["data-srcset"] ? parseSrcset(a["data-srcset"]) : undefined);
    if (src) out.push({ src, type: a.type || "" });
  }
  return out;
}

function backgroundImages(html) {
  const urls = [];
  let m;
  const re = /url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi;
  while ((m = re.exec(html))) urls.push(m[2]);
  return urls;
}

function anchors(html) {
  const out = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const a = parseAttrs(`<a ${m[1]}>`);
    if (!a.href) continue;
    const text = decodeEntities(String(m[2]).replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    out.push({ href: a.href, text });
  }
  return out;
}

function jsonLdBlocks(html) {
  const blocks = [];
  const re =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1].trim()));
    } catch {
      /* malformed JSON-LD — ignore */
    }
  }
  return blocks;
}

function collectLd(bricks, out = []) {
  for (const b of bricks) {
    if (!b || typeof b !== "object") continue;
    if (Array.isArray(b)) collectLd(b, out);
    else {
      out.push(b);
      if (b["@graph"]) collectLd(b["@graph"], out);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Primitive extraction                                                */
/* ------------------------------------------------------------------ */

const PHONE_RE = /(?:\+?\d[\d\s().-]{7,}\d)/g;
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

function visibleText(html) {
  return String(html)
    .replace(/<(script|style|noscript|template|svg|head|meta|link|title)[\s\S]*?>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function headings(html) {
  const out = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (text) out.push(text);
  }
  return out;
}

function isValidPhone(p) {
  const digits = String(p).replace(/[^\d]/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  if (/^(\d)\1{6,}$/.test(digits)) return false;
  if (new Set(digits).size < 3) return false;
  return true;
}

const CTA_PATTERNS = [
  /book now/i,
  /get a (?:free )?quote/i,
  /request (?:a )?(?:quote|service|call|visit)/i,
  /call (?:us|now|today)/i,
  /contact us/i,
  /enquire/i,
  /free estimate/i,
  /schedule (?:a )?(?:visit|service|appointment)/i,
  /whatsapp/i,
  /talk to /i,
];

const SERVICE_HINTS = [
  "installation",
  "install",
  "maintenance",
  "repair",
  "servicing",
  "service",
  "cleaning",
  "duct",
  "hvac",
  "air condition",
  "ac ",
  "chiller",
  "ventilation",
  "plumbing",
  "electrical",
  "handyman",
  "painting",
  "carpentry",
  "renovation",
  "fit-out",
  "fit out",
  "facility",
  "amc",
  "annual maintenance",
  "refrigeration",
  "water tank",
  "pest control",
  "cleaning",
  "mep",
  "contracting",
  "emergency",
  "insulation",
  "welding",
  "concrete",
  "construction",
  "landscaping",
  "pool",
];

const CITY_HINTS = [
  "abu dhabi",
  "dubai",
  "sharjah",
  "ajman",
  "ras al khaimah",
  "umm al quwain",
  "fujairah",
  "al ain",
  "khalifa city",
  "musaffah",
  "deira",
  "jumeirah",
  "downtown dubai",
  "abu dhabi emirate",
  "northern emirates",
  "al reem",
  "yas island",
  "saadiyat",
  "al garhoud",
  "bur dubai",
  "business bay",
  "dubai marina",
  "jlt",
  "al barsha",
  "al quoz",
  "dip",
  "mirdif",
  "silicon oasis",
];

// Trailing "in <area>" / "<area>" junk that can show up in scraped service titles.
const AREA_WORDS = [
  ...CITY_HINTS,
  "uae",
  "u.a.e",
  "uaq",
  "rak",
  "dxb",
  "auh",
  "shj",
  "fuj",
  "alain",
  "emirates",
  "abu dhabi",
]
  .map((w) => w.replace(/\s+/g, "[\\s-]*"))
  .sort((a, b) => b.length - a.length)
  .join("|");
const AREA_SUFFIX_RE = new RegExp(`(?:\\s+(?:in|for|near|at|by)\\s+)?(?:${AREA_WORDS})\\s*$`, "i");
const AREA_ONLY_RE = new RegExp(`^(?:${AREA_WORDS})$`, "i");

const COMPANY_RE =
  /\b(l\.?\.?\s*l\.?\.?\s*c|ltd|l\.l\.c|co\b|company|corporation|incorporated|group|holding|enterprise|trading|establishment)\b|\.llc/i;

function extractPhones(html, ldNodes) {
  const phones = [];
  for (const node of ldNodes) {
    if (node.telephone) phones.push(String(node.telephone));
  }
  for (const m of html.matchAll(/href=["']tel:([^"']+)["']/gi)) phones.push(m[1]);
  const textPhones = (visibleText(html).match(PHONE_RE) || []).filter(isValidPhone);
  const fromTel = phones.map((p) => p.replace(/[^\d+]/g, "").replace(/(?!^)\+/, "")).filter(isValidPhone);
  return unique([...fromTel, ...textPhones.map((p) => p.trim())]).filter(isValidPhone);
}

function extractEmails(html, ldNodes) {
  const emails = [];
  for (const node of ldNodes) if (node.email) emails.push(String(node.email).replace(/^mailto:/, ""));
  for (const m of html.matchAll(/href=["']mailto:([^"'?]+)/gi)) emails.push(m[1]);
  for (const m of html.matchAll(EMAIL_RE)) emails.push(m[0]);
  return unique(
    emails
      .map((e) => e.trim().toLowerCase())
      .filter((e) => !/\.(png|jpg|jpeg|gif|webp|svg)$/.test(e) && !e.includes("sentry") && !e.includes("example.com"))
  );
}

function extractWhatsapp(html) {
  const m = html.match(/(?:wa\.me|api\.whatsapp\.com\/send\?phone=|whatsapp:\/\/send\?phone=)(\+?\d[\d\s-]{6,})/i);
  return m ? m[1].replace(/[^\d+]/g, "") : undefined;
}

const STREET_RE =
  /(?:address|location|office|warehouse|street|st\.|road|building|bldg|floor|industrial area|plot)[^<]{6,120}/gi;

function extractAddress(html, ldNodes) {
  for (const node of ldNodes) {
    const a = node.address;
    if (typeof a === "string" && a.length > 8) return a;
    if (a && typeof a === "object") {
      const parts = [a.streetAddress, a.addressLocality, a.addressRegion, a.addressCountry, a.postalCode]
        .filter(Boolean)
        .join(", ");
      if (parts.length > 8) return parts;
    }
  }
  const matches = (visibleText(html).match(STREET_RE) || [])
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => /\d/.test(s) && s.length > 15 && s.length < 140);
  return matches[0];
}

function extractBusinessName(html, ldNodes, fallback) {
  const decode = (v) => decodeEntities(v).trim().replace(/\s+/g, " ");
  for (const node of ldNodes) {
    if (typeof node.name === "string" && node.name.length > 2 && node.name.length < 90) {
      const type = node["@type"];
      const types = Array.isArray(type) ? type : [type];
      if (types.some((t) => /organization|localbusiness|corporation|store|contractor/i.test(String(t)))) {
        return decode(node.name);
      }
    }
  }
  const og = metaMap(html)["og:site_name"];
  if (og && og.length > 2) return decode(og);
  return fallback;
}

function extractServiceAreas(html, ldNodes) {
  const areas = new Set();
  for (const node of ldNodes) {
    const a = node.areaServed;
    if (typeof a === "string") areas.add(titleCase(a));
    if (Array.isArray(a)) a.forEach((x) => typeof x === "string" && areas.add(titleCase(x)));
    if (a && typeof a === "object" && a.name) areas.add(titleCase(String(a.name)));
  }
  const text = visibleText(html).toLowerCase();
  for (const city of CITY_HINTS) {
    if (text.includes(city)) areas.add(titleCase(city));
  }
  return unique([...areas]).slice(0, 12);
}

function normalizeServiceName(raw) {
  if (!raw) return undefined;
  let s = decodeEntities(raw)
    .replace(/[\u00a0]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[|•·>»/\\]+/g, " ")
    .replace(/([A-Za-z])-([A-Za-z])/g, "$1 $2")
    .replace(/^(our|the)\s+/i, "")
    .replace(/\s*--+\s*$/, "")
    .trim();
  if (s.length < 3 || s.length > 52) return undefined;
  s = s.replace(AREA_SUFFIX_RE, " ").trim();
  s = s.replace(/[\s]*[.,;:!?)\]]*$/u, "").trim();
  while (s.length > 2) {
    const t = s.replace(/\s*\b(services?|company|estimates?|pricing|prices?|plans?)\b\s*$/i, "").trim();
    if (t === s) break;
    s = t;
  }
  s = s.replace(/[^\u0000-\u007F].*$/u, "").trim();
  if (s.length < 3 || s.length > 46) return undefined;
  const low = s.toLowerCase();
  if (
    /^(home|about|contact|blog|menu|more|read|learn|view|all|next|prev|shop|cart|login|search|portfolio|projects|gallery|faq|careers?|quote|terms|privacy|cookies?|legal)$/i.test(low) ||
    /^(view all|see all|more info|read more|learn more|our services|all services)$/i.test(low) ||
    /^(contact us|explore our|what we do|call us|about us|our company)\b/i.test(low) ||
    /^(services?|we|our|i)\s+(offer|provide|available|can|do|are)\b/i.test(low) ||
    /\b(terms|privacy|cookies?|faq)\b/i.test(low) ||
    /\bhttps?:|\.(com|ae|org|net|io|me)\b/i.test(low) ||
    /^(top|best)\b/i.test(low) ||
    /(,?\d{4,})\s*$/.test(low) ||
    /\s\d{1,2}$/.test(low) ||
    low.includes("@")
  )
    return undefined;
  return titleCase(s);
}

function extractServices(html, ldNodes, pages) {
  const found = new Map(); // lowercase -> display

  const push = (raw) => {
    const name = normalizeServiceName(raw);
    if (!name) return;
    const lower = name.toLowerCase();
    const singular =
      lower.length > 6 && lower.endsWith("s") && !lower.includes("&") && !/[a-z]+\s+[A-Z]{2,}$/.test(lower)
        ? lower.slice(0, -1)
        : lower;
    if (!found.has(singular)) found.set(singular, name);
  };

  for (const node of ldNodes) {
    const offers = node.hasOfferCatalog?.itemListElement || node.makesOffer;
    if (Array.isArray(offers)) {
      for (const o of offers) {
        if (typeof o === "string") push(o);
        else if (o && typeof o === "object") push(o.name || o.itemOffered?.name || "");
      }
    }
    const type = String(node["@type"]);
    if (/^service$/i.test(type) && node.name) push(node.name);
  }

  for (const a of anchors(html)) {
    const text = a.text;
    if (!text || text.length < 3 || text.length > 46) continue;
    const lower = text.toLowerCase();
    const isServiceText =
      SERVICE_HINTS.some((h) => lower.includes(h)) &&
      !/\b(read|learn|view all|see all|more info)\b/.test(lower);
    const slug = a.href.toLowerCase();
    const isServiceUrl = /\/(services?|what-we-do|our-work|solutions?)(\/|-)/.test(slug) || slug.endsWith("/services");
    if (isServiceText || isServiceUrl) push(text);
  }

  for (const page of pages) {
    const u = page instanceof URL ? page : new URL(page.url);
    const pathname = u.pathname.toLowerCase();
    const seg = pathname.split("/").filter(Boolean).pop() || "";
    if (/(services?|solutions?)/.test(pathname) && seg) push(seg.replace(/-/g, " "));

    // On service-related pages, headings and image alt texts are strong signals.
    const isServicePage = /(services?|solutions?|what-we-do|our-work)/.test(pathname) || pathname === "/";
    if (!isServicePage) continue;
    for (const h of headings(page.html)) {
      if (h.length < 3 || h.length > 46) continue;
      if (SERVICE_HINTS.some((hint) => h.toLowerCase().includes(hint))) push(h);
    }
    for (const img of imgTags(page.html)) {
      const alt = (img.alt || "").trim();
      if (alt.length < 3 || alt.length > 46) continue;
      if (SERVICE_HINTS.some((hint) => alt.toLowerCase().includes(hint))) push(alt);
    }
  }

  return [...found.values()].slice(0, 12);
}

function extractCtas(html) {
  const ctas = new Set();
  for (const a of anchors(html)) {
    const text = a.text.replace(/\s+/g, " ").trim();
    if (!text || text.length > 40) continue;
    for (const p of CTA_PATTERNS) {
      if (p.test(text)) {
        ctas.add(titleCase(text.replace(/[<>]/g, "")));
        break;
      }
    }
  }
  return [...ctas].slice(0, 8);
}

function extractTrustSignals(html, ldNodes) {
  const signals = new Set();
  for (const node of ldNodes) {
    if (node.aggregateRating?.ratingValue) {
      signals.add(
        `Google/structured rating ${node.aggregateRating.ratingValue} (${node.aggregateRating.reviewCount ?? "?"} reviews)`
      );
    }
  }
  const text = visibleText(html);
  const patterns = [
    /ISO\s?9001[:\d]*/gi,
    /ISO\s?14001[:\d]*/gi,
    /ISO\s?45001[:\d]*/gi,
    /OHSAS\s?18001/gi,
    /(?:fully\s+)?(?:licensed|insured|certified)/gi,
    /\d+\s*(?:\+\s*)?years?/gi,
    /municipality\s+approved/gi,
    /(?:warranty|guarantee)[^<.]{0,40}/gi,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) signals.add(titleCase(m[0].trim().slice(0, 60)));
  }
  return [...signals].slice(0, 8);
}

/* ------------------------------------------------------------------ */
/* Brand colours                                                       */
/* ------------------------------------------------------------------ */

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (full.length !== 6) return undefined;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb = [0, 0, 0];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

function extractColors(html) {
  const meta = metaMap(html);
  const candidates = [];
  const theme = meta["theme-color"];
  if (theme && /^#?[0-9a-f]{3,8}$/i.test(theme.trim())) candidates.push(theme.trim());

  const cssText = [
    ...[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]),
    ...(html.match(/style=["'][^"']*["']/gi) || []),
  ].join("\n");
  for (const m of cssText.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
    candidates.push("#" + m[1]);
  }

  const freq = new Map();
  for (const raw of candidates) {
    const hex = raw.startsWith("#") ? raw : "#" + raw;
    const rgb = hexToRgb(hex);
    if (!rgb) continue;
    const { s, l } = rgbToHsl(rgb);
    if (s < 0.25 || l < 0.1 || l > 0.92) continue; // skip neutrals / near-black/white
    const key = hex.toLowerCase();
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  if (!freq.size) {
    if (theme && hexToRgb(theme)) {
      const rgb = hexToRgb(theme);
      const hsl = rgbToHsl(rgb);
      return {
        primary: (theme.startsWith("#") ? theme : "#" + theme).toLowerCase(),
        secondary: hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 0.14)),
        tint: hslToHex(hsl.h, Math.min(1, hsl.s * 0.6), 0.95),
      };
    }
    return undefined;
  }
  const [primaryHex] = [...freq.entries()].sort((a, b) => b[1] - a[1])[0];
  const rgb = hexToRgb(primaryHex);
  const hsl = rgbToHsl(rgb);
  return {
    primary: primaryHex,
    secondary: hslToHex(hsl.h, hsl.s, Math.max(0.08, hsl.l - 0.14)),
    accent: hslToHex((hsl.h + 24) % 360, Math.min(1, hsl.s * 1.05), Math.min(0.6, hsl.l + 0.06)),
    tint: hslToHex(hsl.h, Math.min(1, hsl.s * 0.55), 0.95),
  };
}

/* ------------------------------------------------------------------ */
/* Asset discovery + validation                                        */
/* ------------------------------------------------------------------ */

const TRACKING_RE =
  /(google-analytics|googletagmanager|doubleclick|facebook\.com\/tr|sentry|hotjar|clarity\.ms|pixel|gravatar|w\.org|\/ads?[./]|spacer|blank\.(gif|png)|transparent)/i;
const IGNORE_EXT_RE = /\.(svg)(\?|$)/i; // icons handled separately for logo
const IMG_EXT_RE = /\.(jpe?g|png|webp|avif|gif|bmp)(\?|$)/i;

function guessCategory({ resolvedUrl, originalUrl, alt, className, width, height, sourcePage, isMeta }) {
  const hay = `${resolvedUrl || originalUrl || ""} ${alt || ""} ${className || ""}`.toLowerCase();
  if (/logo/.test(hay)) return "logo";
  if (/favicon|apple-touch|icon/.test(hay)) return "favicon";
  if (isMeta) return "hero";
  const page = sourcePage.toLowerCase();
  let normalized;
  try {
    normalized = new URL(sourcePage).pathname;
  } catch {
    normalized = "/";
  }
  if (normalized === "/" && /slide|slider|banner|hero|homepage|web|top|main|cover/i.test(hay)) return "hero";
  if (/gallery|portfolio|project|our-work|showcase/.test(page)) return "project";
  if (/team|about|staff|crew/.test(page)) return "team";
  if (/service|solution|what-we-do/.test(page)) return "service";
  if (/project|installation|showcase|case-study/.test(hay)) return "project";
  if (/team|technician|staff|crew|engineer/.test(hay)) return "team";
  return "unknown";
}

function collectAssetCandidates(page) {
  const { url, html } = page;
  const meta = metaMap(page.html);
  const candidates = [];

  const add = (rawUrl, extra = {}) => {
    if (!rawUrl) return;
    const trimmed = rawUrl.trim();
    if (!trimmed || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return;
    if (TRACKING_RE.test(trimmed)) return;
    const resolved = resolveUrl(trimmed, url);
    if (!resolved || !/^https?:/i.test(resolved)) return;
    candidates.push({ originalUrl: trimmed, resolvedUrl: resolved, sourcePage: url, ...extra });
  };

  for (const key of ["og:image", "og:image:secure_url", "twitter:image", "twitter:image:src"]) {
    if (meta[key]) add(meta[key], { isMeta: true, alt: meta["og:image:alt"] || "", category: "hero" });
  }

  for (const img of imgTags(html)) {
    add(img.src, {
      alt: img.alt,
      className: img.className,
      width: img.width,
      height: img.height,
      srcset: img.srcset,
    });
  }
  for (const s of sourceTags(html)) add(s.src, { isMeta: false });

  for (const bg of backgroundImages(html)) {
    if (IMG_EXT_RE.test(bg) || /image|photo|media|upload|cdn/i.test(bg)) add(bg, { category: "background" });
  }

  for (const a of jsonLdBlocks(html)) {
    for (const node of collectLd([a])) {
      const imgs = [].concat(node.image || [], node.logo || []);
      for (const im of imgs) {
        const u = typeof im === "string" ? im : im?.url;
        if (u) add(u, { isMeta: true, alt: node.name || "", category: "hero" });
      }
    }
  }

  return candidates;
}

function icoImageFromHtml(html, baseUrl) {
  const links = linkTags(html);
  const rels = ["icon", "shortcut icon", "apple-touch-icon", "apple-touch-icon-precomposed", "mask-icon"];
  for (const rel of rels) {
    const found = links.find((l) => (l.rel || "").toLowerCase() === rel && l.href);
    if (found) {
      const resolved = resolveUrl(found.href, baseUrl);
      if (resolved) return resolved;
    }
  }
  return undefined;
}

function readImageSize(buf) {
  try {
    if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), type: "png" };
    }
    if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      let off = 2;
      while (off + 9 < buf.length) {
        if (buf[off] !== 0xff) { off++; continue; }
        const marker = buf[off + 1];
        const len = buf.readUInt16BE(off + 2);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return { height: buf.readUInt16BE(off + 5), width: buf.readUInt16BE(off + 7), type: "jpeg" };
        }
        off += 2 + len;
      }
    }
    if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
      const fourcc = buf.toString("ascii", 12, 16);
      if (fourcc === "VP8X") {
        const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
        const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
        return { width: w, height: h, type: "webp" };
      }
      if (fourcc === "VP8 ") {
        return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff, type: "webp" };
      }
      if (fourcc === "VP8L") {
        const bits = buf.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, type: "webp" };
      }
    }
    if (buf.length > 10 && buf.toString("ascii", 0, 3) === "GIF") {
      return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8), type: "gif" };
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

async function validateAsset(candidate) {
  const record = {
    originalUrl: candidate.originalUrl,
    resolvedUrl: candidate.resolvedUrl,
    sourcePage: candidate.sourcePage,
    category: candidate.category || "unknown",
    alt: candidate.alt || undefined,
    width: candidate.width,
    height: candidate.height,
    quality: 0,
    status: "unchecked",
    checkedAt: new Date().toISOString(),
    usedInDemo: false,
  };
  try {
    const res = await fetchWithTimeout(candidate.resolvedUrl, {
      method: "GET",
      headers: { Range: "bytes=0-262143" },
      accept: "image/*,*/*;q=0.8",
      timeout: 15000,
    });
    record.httpStatus = res.status;
    if (res.status === 401 || res.status === 403 || res.status === 451) {
      record.status = "blocked";
      record.failureReason = `HTTP ${res.status} (hotlink/access protection)`;
      return record;
    }
    if (!res.ok && res.status !== 206) {
      record.status = "invalid";
      record.failureReason = `HTTP ${res.status}`;
      return record;
    }
    const ctype = (res.headers.get("content-type") || "").toLowerCase();
    if (!ctype.startsWith("image/")) {
      record.status = "non_image";
      record.failureReason = `content-type ${ctype || "unknown"}`;
      return record;
    }
    record.fileType = ctype.split("/")[1]?.split(";")[0];
    const clen = res.headers.get("content-length");
    const rangeTotal = res.headers.get("content-range")?.split("/")?.[1];
    record.bytes = clen ? parseInt(clen, 10) : rangeTotal ? parseInt(rangeTotal, 10) : undefined;

    const buf = Buffer.from(await res.arrayBuffer());
    const dims = readImageSize(buf);
    if (dims) {
      record.width = record.width || dims.width;
      record.height = record.height || dims.height;
    }
    if (record.width && record.height) {
      record.aspectRatio = +(record.width / record.height).toFixed(3);
    }
    const tiny =
      (record.width && record.height && record.width < 160 && record.height < 160) ||
      (record.bytes && record.bytes < 4000 && candidate.category !== "logo" && candidate.category !== "favicon");
    if (tiny && !/logo|favicon/.test(candidate.category || "")) {
      record.status = "too_small";
      record.failureReason = `too small (${record.width ?? "?"}×${record.height ?? "?"}, ${record.bytes ?? "?"}B)`;
      return record;
    }
    record.status = "valid";
    record.quality = scoreAsset(record);
    return record;
  } catch (err) {
    record.status = "unreachable";
    record.failureReason = String(err && err.name === "AbortError" ? "timeout" : err.message || err);
    return record;
  }
}

function scoreAsset(r) {
  let score = 0.35;
  const cat = r.category || "unknown";
  if (cat === "hero" || cat === "background") score += 0.2;
  if (cat === "project" || cat === "gallery") score += 0.15;
  if (cat === "service") score += 0.12;
  if (cat === "team") score += 0.08;
  if (cat === "logo" || cat === "favicon") score += 0.1;
  if (r.alt && r.alt.trim().length > 3) score += 0.08;
  if (r.fileType === "jpeg" || r.fileType === "png" || r.fileType === "webp") score += 0.1;
  if (r.fileType === "gif") score -= 0.1;
  if (r.aspectRatio) {
    const ar = r.aspectRatio;
    if (ar > 1.3 && ar < 2.2) score += 0.15; // landscape hero-ish
    else if (ar >= 0.6 && ar <= 1.3) score += 0.05;
  }
  const px = (r.width || 0) * (r.height || 0);
  if (px > 900_000) score += 0.15;
  else if (px > 300_000) score += 0.1;
  else if (px > 100_000) score += 0.05;
  else if (px && px < 40_000) score -= 0.15;
  if (/\/themes\/[^/]+\/(?:assets|images)\/[^"']*(?:default|placeholder|sample|banner)[^"']*/i.test(r.resolvedUrl))
    score -= 0.25; // generic template placeholder imagery
  if (/-\d+x\d+\.(jpe?g|png|webp|gif)(\?|$)/i.test(r.resolvedUrl)) score -= 0.15; // WP-size dupes
  return Math.max(0, Math.min(1, +score.toFixed(3)));
}

/* ------------------------------------------------------------------ */
/* Crawling                                                            */
/* ------------------------------------------------------------------ */

function internalLinks(html, baseUrl, origin) {
  const seen = new Map();
  for (const a of anchors(html)) {
    const resolved = resolveUrl(a.href, baseUrl);
    if (!resolved) continue;
    let u;
    try {
      u = new URL(resolved);
    } catch {
      continue;
    }
    if (u.origin !== origin) continue;
    if (/\.(pdf|zip|rar|docx?|xlsx?|mp4|mp3|css|js|xml)(\?|$)/i.test(u.pathname)) continue;
    if (/^#/.test(a.href)) continue;
    const key = u.origin + u.pathname.replace(/\/$/, "");
    if (!seen.has(key)) seen.set(key, u);
  }
  return [...seen.values()];
}

const PRIORITY_RE = /(services?|our-services|what-we-do|solutions?|about|contact|gallery|portfolio|projects|our-work|locations?|areas?)/i;

function rankPages(pages) {
  return pages
    .map((u) => {
      const p = u.pathname.toLowerCase();
      let score = 0;
      if (/services?|solutions?|what-we-do/.test(p)) score += 5;
      if (/about/.test(p)) score += 3;
      if (/contact/.test(p)) score += 3;
      if (/gallery|portfolio|projects|our-work/.test(p)) score += 4;
      if (/locations?|areas/.test(p)) score += 2;
      if (p.split("/").filter(Boolean).length > 2) score -= 1;
      return { u, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.u);
}

async function crawl(startUrl) {
  const pages = [];
  const visited = new Set();
  let resolvedUrl = startUrl;

  const first = await fetchWithTimeout(startUrl, { accept: "text/html" });
  resolvedUrl = first.url || startUrl;
  if (first.status === 401 || first.status === 403) {
    throw new Error(`Site blocked automated access (HTTP ${first.status}) — not bypassing`);
  }
  if (!first.ok) throw new Error(`Homepage returned HTTP ${first.status}`);
  const firstHtml = await first.text();
  const origin = new URL(resolvedUrl).origin;
  pages.push({ url: resolvedUrl, html: firstHtml, kind: "home" });
  visited.add(resolvedUrl.replace(/\/$/, ""));

  const links = rankPages(internalLinks(firstHtml, resolvedUrl, origin));
  // Ensure /contact and /about are crawled even if low score ordering cuts them.
  const selected = links.slice(0, MAX_PAGES - 1);

  const results = await mapLimit(selected, 4, async (u) => {
    const key = u.href.replace(/\/$/, "");
    if (visited.has(key)) return undefined;
    visited.add(key);
    try {
      const res = await fetchWithTimeout(u.href, { accept: "text/html" });
      if (!res.ok) return undefined;
      const ctype = res.headers.get("content-type") || "";
      if (!ctype.includes("html")) return undefined;
      const html = await res.text();
      return { url: res.url || u.href, html, kind: "internal" };
    } catch {
      return undefined;
    }
  });
  for (const r of results) if (r && !r.__error) pages.push(r);
  return { pages, resolvedUrl, origin };
}

/* ------------------------------------------------------------------ */
/* Profile assembly                                                    */
/* ------------------------------------------------------------------ */

function buildStatus({ totalAssets, validAssets, heroImage, logo, missingFields, services, contact, manualReview }) {
  const researched = missingFields.length <= 3 && services.length >= 2;
  const assetsReady = Boolean(heroImage || logo);
  const directoryFlag = manualReview.some((m) => typeof m === "string" && m.includes("directory"));
  if (manualReview.length > 2 || directoryFlag) return "manual_review_required";
  if (!assetsReady && !researched) return "partially_researched";
  if (assetsReady && researched && validAssets >= 4 && missingFields.length === 0) return "ready_for_demo";
  if (assetsReady && totalAssets > 0) return "assets_ready";
  if (totalAssets > 0 && validAssets > 0) return "assets_partial";
  if (researched) return "research_complete";
  return "partially_researched";
}

async function researchTarget(target) {
  const { slug, name, url } = target;
  log(`→ ${slug}  (${url})`);
  const base = {
    slug,
    sourceUrl: url,
    status: "research_failed",
    researchedAt: new Date().toISOString(),
    researchVersion: RESEARCH_VERSION,
    pagesCrawled: [],
    missingFields: [],
    fallbacks: [],
    assets: [],
    businessName: name,
    description: undefined,
    services: [],
    serviceAreas: [],
    contact: {},
    ctas: [],
    trustSignals: [],
    serviceImages: {},
    projectImages: [],
    manualReview: [],
  };

  let crawlResult;
  try {
    crawlResult = await crawl(url);
  } catch (err) {
    warn(`  ✗ crawl failed: ${err.message}`);
    base.missingFields = ["website_access"];
    base.status = "research_failed";
    return base;
  }

  const { pages, resolvedUrl } = crawlResult;
  base.resolvedUrl = resolvedUrl;
  base.pagesCrawled = pages.map((p) => p.url);
  log(`  crawled ${pages.length} page(s)`);

  const home = pages[0].html;
  const meta = metaMap(home);
  const ldNodes = pages.flatMap((p) => collectLd(jsonLdBlocks(p.html)));

  base.businessName = extractBusinessName(home, ldNodes, name);
  base.description = meta["og:description"] || meta.description || undefined;

  // ── Services: normalize then drop non-service noise ──
  const rawServices = extractServices(home, ldNodes, pages);
  const brandLower = String(base.businessName || "").toLowerCase();
  const noiseCount = rawServices.filter(
    (s) => COMPANY_RE.test(s) || AREA_ONLY_RE.test(s) || s.toLowerCase() === brandLower
  ).length;
  base.services = rawServices.filter((s) => {
    const lower = s.toLowerCase();
    if (COMPANY_RE.test(s) || AREA_ONLY_RE.test(s)) return false; // other businesses / place names
    if (brandLower && brandLower.length >= 3 && (lower === brandLower || lower.startsWith(brandLower) || lower.includes(brandLower))) return false; // company's own name
    return true;
  });
  if (noiseCount > 1 && noiseCount >= rawServices.length / 2) {
    base.manualReview.push(
      "site looks like a directory/aggregator listing third-party businesses — verify the identity of the business before shipping"
    );
  }

  // Aggregator detection: many distinct Organization/LocalBusiness nodes means
  // this is a directory of third parties, not the prospect's own company site.
  const orgNames = new Set();
  for (const node of ldNodes) {
    const type = String(node["@type"] ?? "");
    const types = Array.isArray(type) ? type : [type];
    if (
      types.some((t) => /(^|\.)(organization|localbusiness|corporation)$/i.test(String(t))) &&
      typeof node.name === "string" &&
      node.name.trim().length > 2
    ) {
      orgNames.add(node.name.trim().toLowerCase());
    }
  }
  if (orgNames.size >= 4) {
    base.manualReview.push(
      `found ${orgNames.size} distinct organizations in structured data — directory/aggregator site, verify identity`
    );
  } else if (orgNames.size > 1) {
    base.manualReview.push(
      `multiple organization records found (${orgNames.size}) — confirm which entity is the prospect`
    );
  }

  base.serviceAreas = extractServiceAreas(home, ldNodes);
  base.ctas = extractCtas(home);
  base.trustSignals = extractTrustSignals(home, ldNodes);
  base.colors = extractColors(home);

  const phones = extractPhones(home, ldNodes);
  const emails = extractEmails(home, ldNodes);
  const address = extractAddress(home, ldNodes);
  base.contact = {
    phone: phones[0],
    email: emails[0],
    address,
    whatsapp: extractWhatsapp(home),
  };

  if (target.kind === "directory") {
    base.manualReview.push(
      "flagged as a directory/aggregator page (not the business's own site) — confirm business identity before shipping"
    );
  }

  // ── Asset discovery across all crawled pages ──
  const candidateMap = new Map();
  for (const page of pages) {
    for (const c of collectAssetCandidates(page)) {
      if (!c.category || c.category === "unknown") {
        c.category = guessCategory({
          resolvedUrl: c.resolvedUrl,
          originalUrl: c.originalUrl,
          alt: c.alt,
          className: c.className,
          width: c.width,
          height: c.height,
          sourcePage: page.url,
          isMeta: !!c.isMeta,
        });
      }
      const key = c.resolvedUrl;
      if (!candidateMap.has(key)) candidateMap.set(key, c);
    }
  }
  const favicon = icoImageFromHtml(home, resolvedUrl);
  if (favicon && !candidateMap.has(favicon)) {
    candidateMap.set(favicon, {
      originalUrl: favicon,
      resolvedUrl: favicon,
      sourcePage: resolvedUrl,
      category: "favicon",
      alt: `${base.businessName} favicon`,
    });
  }

  const candidates = [...candidateMap.values()]
    .sort((a, b) => (b.isMeta ? 1 : 0) - (a.isMeta ? 1 : 0))
    .slice(0, MAX_ASSETS_TO_VALIDATE);

  const records = await mapLimit(candidates, VALIDATE_CONCURRENCY, validateAsset);
  const assets = records.filter((r) => r && !r.__error && r.resolvedUrl);
  base.assets = assets;

  const valid = assets.filter((a) => a.status === "valid");
  log(`  assets: ${assets.length} discovered, ${valid.length} valid`);

  // ── Asset selection ──
  const byQuality = [...valid].sort((a, b) => b.quality - a.quality);
  const isThemeDefault = (url) =>
    /\/themes\/[^/]+\/(?:assets|images)\/[^"']*(?:default|placeholder|sample)[^"']*/i.test(url);
  // ── Logo selection: prefer the company's own header mark ──
  // Anything carrying partner/award/client/badge vocabulary is demoted hard;
  // filename/alt matches on the company name and site-header context are
  // promoted. Favicons and thumbnail crops are last resorts.
  const GENERIC_NAME_WORDS = new Set([
    "air", "conditioning", "conditioner", "heating", "cooling", "refrigeration",
    "electrical", "electrician", "electric", "services", "service", "solutions",
    "solution", "group", "company", "co", "pty", "ltd", "inc", "australia",
    "australian", "sydney", "melbourne", "brisbane", "perth", "adelaide",
    "maintenance", "mechanical", "engineering", "home", "the", "and",
  ]);
  const nameTokens = String(name || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !GENERIC_NAME_WORDS.has(w));
  const BAD_LOGO_RE =
    /(qbcc|hia|master[-_ ]?builders?|award|badge|dealer|diamond[-_ ]?dealer|proudly|master[-_ ]?plumber|trustindex|error[-_ ]?icon|customer[-_ ]?logos?|client[-_ ]?logos?|partner|certified|accredit|member[-_ ]?logo|google|seeklogo|humm|fujitsu|daikin|mitsubishi|actron|panasonic|samsung|kelvinator|carrier|temperzone|hitachi|toshiba|brivis|braemar|rinnai|gree|hisense|tcl|york|trane|philips|haneco|hager|clipsal|abcc)/i;
  function scoreLogoCandidate(a) {
    const hay = `${a.resolvedUrl || ""} ${a.alt || ""} ${a.className || ""}`.toLowerCase();
    let score = a.quality ?? 0;
    score += nameTokens.filter((t) => hay.includes(t)).length * 60;
    if (/(^|\/)logo([-_][a-z0-9]*)?\.(svg|png|webp|avif)($|\?)/i.test(a.resolvedUrl || "")) score += 50;
    if (/header|site-logo|custom-logo|navbar|brand-logo/.test(hay)) score += 40;
    else if (/footer|flogo|foot-logo/.test(hay)) score += 15;
    if (BAD_LOGO_RE.test(hay)) score -= 500;
    if (a.category === "favicon") score -= 150;
    if (/apple-touch|favicon|\.ico(\?|$)/i.test(a.resolvedUrl || "")) score -= 150;
    if (/[-_](16x16|32x32|64x64|150x150)\./.test(a.resolvedUrl || "")) score -= 120;
    const w = a.width ?? 0;
    if (w >= 200) score += 20;
    else if (w > 0 && w < 80 && !/\.svg(\?|$)/i.test(a.resolvedUrl || "")) score -= 60;
    return score;
  }
  const logoCandidates = byQuality.filter(
    (a) => a.category === "logo" || a.category === "favicon"
  );
  const rankedLogos = [...logoCandidates].sort(
    (a, b) => scoreLogoCandidate(b) - scoreLogoCandidate(a)
  );
  // Never ship a third-party mark as the company logo: if even the best
  // candidate smells like a partner/award/badge asset, leave the logo empty
  // so the demo falls back to the initials mark.
  let logoPick = rankedLogos[0];
  if (
    logoPick &&
    BAD_LOGO_RE.test(`${logoPick.resolvedUrl || ""} ${logoPick.alt || ""} ${logoPick.className || ""}`)
  ) {
    logoPick = undefined;
  }
  const logo = logoPick;
  const hero =
    byQuality.filter((a) => !isThemeDefault(a.resolvedUrl)).find(
      (a) => (a.category === "hero" || a.category === "background") && (a.width ?? 0) >= 1000
    ) ||
    byQuality.filter((a) => !isThemeDefault(a.resolvedUrl)).find((a) => a.category === "hero" || a.category === "background") ||
    byQuality.find((a) => (a.category === "hero" || a.category === "background")) ||
    byQuality.find((a) => (a.width ?? 0) >= 1200) ||
    byQuality.find(
      (a) => !isThemeDefault(a.resolvedUrl) && a.category !== "logo" && a.category !== "favicon" && a.status === "valid"
    );
  const projectImages = unique(
    byQuality
      .filter((a) => a.category === "project" || a.category === "gallery")
      .map((a) => a.resolvedUrl)
  ).slice(0, 8);
  if (projectImages.length < 4) {
    for (const a of byQuality) {
      if (projectImages.length >= 6) break;
      if (isThemeDefault(a.resolvedUrl)) continue;
      if (!projectImages.includes(a.resolvedUrl) && (a.category === "service" || a.category === "hero" || a.category === "background")) {
        projectImages.push(a.resolvedUrl);
      }
    }
  }
  base.projectImages = projectImages.slice(0, 6);

  // Service imagery: pair valid service-category assets with detected services
  // (assets keep page order, which usually mirrors the service grid).
  const serviceAssets = valid.filter((a) => a.category === "service");
  base.services.forEach((svcName, i) => {
    const svcSlug = slugify(svcName);
    const hit = serviceAssets[i % Math.max(1, serviceAssets.length)];
    if (hit) base.serviceImages[svcSlug] = hit.resolvedUrl;
  });

  base.logo = logo?.resolvedUrl;
  base.favicon = favicon || valid.find((a) => a.category === "favicon")?.resolvedUrl;
  base.heroImage = hero?.resolvedUrl;

  // ── Missing fields / manual review (never invent) ──
  const missing = [];
  if (!base.businessName) missing.push("business_name");
  if (!base.description) missing.push("description");
  if (!base.services.length) missing.push("services");
  if (!base.contact.phone) missing.push("phone");
  if (!base.contact.email) missing.push("email");
  if (!base.contact.address) missing.push("address");
  if (!base.serviceAreas.length) missing.push("service_areas");
  base.missingFields = missing;

  const manual = [];
  if (!base.logo) manual.push("logo — replace initials mark manually");
  else {
    const logoHay = `${base.logo} ${logo?.alt || ""} ${logo?.className || ""}`.toLowerCase();
    const logoNameHits = nameTokens.filter((t) => logoHay.includes(t)).length;
    if (logoNameHits === 0 && !/(^|\/)logo\.(svg|png|webp|avif)($|\?)/i.test(base.logo)) {
      manual.push(`logo identity unconfirmed (${base.logo}) — verify it is the company mark`);
    }
  }
  if (!base.heroImage) manual.push("hero image — using controlled fallback");
  if (!base.contact.phone) manual.push("phone number — unverified/not found");
  base.manualReview = [...base.manualReview, ...manual];

  for (const a of assets) {
    a.usedInDemo = [base.logo, base.heroImage, base.favicon, ...projectImages, ...Object.values(base.serviceImages)].includes(
      a.resolvedUrl
    );
    if (a.status !== "valid" && a.usedInDemo) a.manualReview = true;
  }

  base.status = buildStatus({
    totalAssets: assets.length,
    validAssets: valid.length,
    heroImage: base.heroImage,
    logo: base.logo,
    missingFields: base.missingFields,
    services: base.services,
    contact: base.contact,
    manualReview: base.manualReview,
  });

  log(`  status: ${base.status}  (logo:${base.logo ? "✓" : "✗"} hero:${base.heroImage ? "✓" : "✗"} services:${base.services.length})`);
  return base;
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

async function writeProfile(profile) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, `${profile.slug}.json`);
  await fs.writeFile(file, JSON.stringify(profile, null, 2) + "\n", "utf8");
}

async function regenerateModule() {
  const files = (await fs.readdir(DATA_DIR)).filter((f) => f.endsWith(".json")).sort();
  const entries = [];
  for (const f of files) {
    const raw = await fs.readFile(path.join(DATA_DIR, f), "utf8");
    const parsed = JSON.parse(raw);
    entries.push(`  ${JSON.stringify(parsed.slug)}: ${JSON.stringify(parsed, null, 2).replace(/\n/g, "\n  ")},`);
  }
  const body = `// AUTO-GENERATED by scripts/research-prospect.mjs — do not edit by hand.
// Run: node scripts/research-prospect.mjs --batch scripts/research-targets.json
import type { ProspectResearch } from "@/lib/types";

export const RESEARCH_VERSION = "${RESEARCH_VERSION}";

export const researchedProfiles: Record<string, ProspectResearch> = {
${entries.join("\n")}
};
`;
  await fs.writeFile(GENERATED, body, "utf8");
  log(`wrote ${files.length} profile(s) → lib/research/profiles.generated.ts`);
}

/* ------------------------------------------------------------------ */
/* CLI                                                                 */
/* ------------------------------------------------------------------ */

function parseArgs(argv) {
  const args = { batch: undefined, slug: undefined, name: undefined, url: undefined, only: undefined };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--batch") args.batch = argv[++i];
    else if (a === "--slug") args.slug = argv[++i];
    else if (a === "--name") args.name = argv[++i];
    else if (a === "--url") args.url = argv[++i];
    else if (a === "--only") args.only = argv[++i].split(",").map((s) => s.trim());
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let targets = [];
  if (args.batch) {
    const raw = await fs.readFile(path.resolve(ROOT, args.batch), "utf8");
    targets = JSON.parse(raw);
  } else if (args.slug && args.url) {
    targets = [{ slug: args.slug, name: args.name || args.slug, url: args.url }];
  } else {
    console.error(
      "Usage: node scripts/research-prospect.mjs --slug <slug> --name <name> --url <url>\n" +
        "       node scripts/research-prospect.mjs --batch scripts/research-targets.json [--only a,b]"
    );
    process.exit(1);
  }
  if (args.only) targets = targets.filter((t) => args.only.includes(t.slug));

  for (const target of targets) {
    try {
      const profile = await researchTarget(target);
      await writeProfile(profile);
    } catch (err) {
      warn(`  ✗ unexpected failure for ${target.slug}: ${err.message}`);
    }
  }
  await regenerateModule();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
