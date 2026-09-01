import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { allProspects } from "@/lib/prospect";
import { brandImage } from "@/lib/realImages";
import { BrandImage } from "@/components/visual/BrandImage";

export const metadata = {
  title: "Concept Demos — Athinem Creatives",
};

export default function DemoHubPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper">
      <div className="technical-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-brand">
          Athinem Creatives · Outreach
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Concept website demos
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
          Re-imagined digital presences for manufacturing and engineering brands — every demo
          uses real company data, engineered visuals and a working enquiry flow.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {allProspects.map((prospect) => {
            const hubFallback =
              prospect.images.aerial ?? prospect.images.factorySharjah;
            const hubSrc =
              brandImage(prospect.slug, "aerial") ?? hubFallback;
            return (
            <Link
              key={prospect.slug}
              href={`/demo/${prospect.slug}`}
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
      </div>
    </main>
  );
}