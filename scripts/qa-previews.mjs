#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const ROOT = process.cwd();
const BASE = process.env.QA_BASE ?? "http://localhost:3210";
const PORT = Number(process.env.QA_CDP_PORT ?? 9333);
const OUT = path.join(ROOT, "data/generated/qa-report.json");
const COMPANIES = path.join(ROOT, "data/generated/companies.json");

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

function chromePath() {
  for (const candidate of CHROME_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error("Chrome/Chromium not found. Set CHROME_PATH to the executable.");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDevtools() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (response.ok) return;
    } catch {
      // devtools endpoint not ready yet
    }
    await sleep(250);
  }
  throw new Error("Chrome DevTools endpoint did not start");
}

async function createTab(url) {
  const response = await fetch(
    `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`,
    { method: "PUT" }
  );
  if (!response.ok) throw new Error(`Unable to create tab: ${response.status}`);
  return response.json();
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const listeners = new Map();

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
      return;
    }
    if (message.method && listeners.has(message.method)) {
      for (const listener of listeners.get(message.method)) listener(message.params);
    }
  });

  const ready = new Promise((resolve) =>
    ws.addEventListener("open", resolve, { once: true })
  );

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const messageId = ++id;
      pending.set(messageId, { resolve, reject });
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });

  const once = (method) =>
    new Promise((resolve) => {
      const set = listeners.get(method) ?? new Set();
      const listener = (params) => {
        set.delete(listener);
        resolve(params);
      };
      set.add(listener);
      listeners.set(method, set);
    });

  return { ready, send, once, close: () => ws.close() };
}

const PREPARE = `(async () => {
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const step = Math.max(400, Math.round(window.innerHeight * 0.75));
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await pause(70);
  }
  window.scrollTo(0, 0);
  await pause(250);
  await Promise.all(
    [...document.images].map((img) => {
      img.loading = "eager";
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
        setTimeout(done, 1500);
      });
    })
  );
  await pause(150);
  return true;
})()`;

const CHECK = `(() => {
  const vw = window.innerWidth;
  const doc = document.documentElement;
  const overflowing = [];
  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    if (style.position === "fixed") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.right > vw + 2 || rect.left < -2) {
      overflowing.push({
        tag: el.tagName.toLowerCase(),
        cls: (typeof el.className === "string" ? el.className : "").slice(0, 70),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      });
    }
  }
  const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const brokenImages = [...document.images]
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => img.currentSrc || img.src);
  const missingAlt = [...document.images].filter((img) => !img.hasAttribute("alt")).length;
  const badAnchors = [...new Set(
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute("href"))
      .filter((href) => href !== "#" && !document.querySelector(href))
  )];
  const h1Count = document.querySelectorAll("h1").length;
  const text = document.body.innerText || "";
  return {
    width: vw,
    scrollWidth: doc.scrollWidth,
    scrollHeight: doc.scrollHeight,
    overflow: overflowing.slice(0, 6),
    duplicateIds,
    brokenImages,
    missingAlt,
    badAnchors,
    h1Count,
    textLength: text.trim().length,
    hasUndefined: /\\bundefined\\b/.test(text),
    hasNaN: /\\bNaN\\b/.test(text),
  };
})()`;

function issuesFor(snapshot) {
  const issues = [];
  if (snapshot.scrollWidth > snapshot.width + 2)
    issues.push(`horizontal-overflow:${snapshot.scrollWidth - snapshot.width}px`);
  if (snapshot.overflow.length) issues.push(`overflow-elements:${snapshot.overflow.length}`);
  if (snapshot.brokenImages.length) issues.push(`broken-images:${snapshot.brokenImages.length}`);
  if (snapshot.missingAlt) issues.push(`missing-alt:${snapshot.missingAlt}`);
  if (snapshot.badAnchors.length) issues.push(`bad-anchors:${snapshot.badAnchors.join(",")}`);
  if (snapshot.duplicateIds.length) issues.push(`duplicate-ids:${snapshot.duplicateIds.join(",")}`);
  if (snapshot.hasUndefined) issues.push("visible-undefined");
  if (snapshot.hasNaN) issues.push("visible-NaN");
  if (snapshot.h1Count !== 1) issues.push(`h1-count:${snapshot.h1Count}`);
  if (snapshot.textLength < 500) issues.push(`thin-content:${snapshot.textLength}`);
  return issues;
}

const WIDTHS = [
  { key: "desktop", width: 1440, height: 900, mobile: false },
  { key: "mobile", width: 390, height: 844, mobile: true },
];

async function main() {
  const companies = JSON.parse(fs.readFileSync(COMPANIES, "utf8"));
  const eligible = companies.filter((company) => company.eligibility.eligible);
  if (!eligible.length) throw new Error("No eligible companies found");

  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "demov2-qa-"));
  const chrome = spawn(
    chromePath(),
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  process.on("exit", () => {
    try {
      chrome.kill();
    } catch {
      // already stopped
    }
  });

  await waitForDevtools();
  const tab = await createTab(`${BASE}/preview`);
  const cdp = connect(tab.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  const results = [];
  let index = 0;

  for (const company of eligible) {
    const slug = company.identity.slug;
    const url = `${BASE}/preview/${slug}`;
    const entry = {
      slug,
      name: company.displayName ?? company.legalName ?? slug,
      family: company.industryFamily,
      researchAvailable: Boolean(company.research?.profileAvailable),
      images: {},
      issues: [],
      pass: true,
    };

    for (const viewport of WIDTHS) {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      const loaded = cdp.once("Page.loadEventFired");
      await cdp.send("Page.navigate", { url });
      await loaded;
      await sleep(250);
      await cdp.send("Runtime.evaluate", {
        expression: PREPARE,
        awaitPromise: true,
        returnByValue: true,
      });
      const evaluated = await cdp.send("Runtime.evaluate", {
        expression: CHECK,
        returnByValue: true,
      });
      const snapshot = evaluated.result.value;
      const issues = issuesFor(snapshot);
      entry.images[viewport.key] = {
        scrollWidth: snapshot.scrollWidth,
        scrollHeight: snapshot.scrollHeight,
        issues,
      };
      entry.issues.push(...issues.map((issue) => `${viewport.key}:${issue}`));
    }

    entry.pass = entry.issues.length === 0;
    results.push(entry);
    index += 1;
    const status = entry.pass ? "PASS" : "FAIL";
    console.log(`[${index}/${eligible.length}] ${status} ${slug}${entry.pass ? "" : ` — ${entry.issues.join(" | ")}`}`);
  }

  const failures = results.filter((result) => !result.pass);
  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    viewports: WIDTHS.map(({ key, width, height }) => ({ key, width, height })),
    totals: {
      demos: results.length,
      passed: results.length - failures.length,
      failed: failures.length,
    },
    failures,
    results,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`\nQA report written to ${path.relative(ROOT, OUT)}`);
  console.log(`Passed ${report.totals.passed}/${report.totals.demos}`);

  await fetch(`http://127.0.0.1:${PORT}/json/close/${tab.id}`).catch(() => {});
  cdp.close();
  chrome.kill();
  fs.rmSync(profile, { recursive: true, force: true });
  process.exit(failures.length ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
