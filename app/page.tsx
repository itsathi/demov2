import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { allProspects } from "@/lib/prospect";
import { brandImage } from "@/lib/realImages";
import { BrandImage } from "@/components/visual/BrandImage";

export const metadata = {
  title: "Website Concept Demos",
  description:
    "Re-imagined digital presences for manufacturing and engineering brands — real company data, engineered visuals and a working enquiry flow.",
};

function regionOf(location: string): string {
  const loc = location.toLowerCase();
  if (loc.includes("abu dhabi")) return "Abu Dhabi";
  if (loc.includes("umm al quwain")) return "Umm Al Quwain";
  if (loc.includes("dubai")) return "Dubai";
  if (loc.includes("sharjah")) return "Sharjah";
  const first = location.split(/[,&]/)[0].trim();
  return first || "Other";
}

function groupByRegion() {
  const groups = new Map<string, typeof allProspects>();
  for (const prospect of allProspects) {
    const region = regionOf(prospect.location);
    const list = groups.get(region) ?? [];
    list.push(prospect);
    groups.set(region, list);
  }
  return Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
}

export default function HomePage() {
  const regionGroups = groupByRegion();
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper">
      <div className="technical-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-brand">
          Digital Presence Showcase
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Concept website demos
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
          Re-imagined digital presences for manufacturing and engineering brands — every demo
          uses real company data, engineered visuals and a working enquiry flow, arranged by location.
        </p>

        {regionGroups.map(([region, prospects]) => (
          <section key={region} className="mt-14">
            <div className="flex items-end justify-between border-b border-line pb-3">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">
                {region}
              </h2>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                {prospects.length} {prospects.length === 1 ? "demo" : "demos"}
              </span>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {prospects.map((prospect) => {
                const hubFallback =
                  prospect.images.aerial ?? prospect.images.factorySharjah;
                const hubSrc =
                  brandImage(prospect.slug, "aerial") ?? hubFallback;
                return (
                  <Link
                    key={prospect.slug}
                    href={`/${prospect.slug}`}
                    className="group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_50px_-30px_rgba(10,17,40,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(10,17,40,0.4)]"
                  >
                    <div className="relative h-44 border-b border-line bg-gradient-to-br from-brand-tint to-white">
                      <BrandImage
                        src={hubSrc}
                        fallback={hubFallback}
                        alt=""
                        fill
                        sizes="600px"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="grid h-9 w-9 place-items-center rounded-lg text-xs font-extrabold text-white"
                          style={{ backgroundColor: prospect.branding.primaryColor }}
                        >
                          {prospect.displayName.slice(0, 3).toUpperCase()}
                        </span>
                        <span className="text-sm font-bold text-ink">{prospect.displayName}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {prospect.hero.subline}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-strong">
                        Open live demo
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}