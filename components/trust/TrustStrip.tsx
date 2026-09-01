import { BadgeCheck, ShieldCheck, Star } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig } from "@/lib/types";

export function RatingStrip({ prospect }: { prospect: ProspectConfig }) {
  const { googleRating, reviewCount } = prospect.socialProof;
  const t = getTemplates(prospect);
  return (
    <section className="relative overflow-hidden border-y border-line bg-white">
      <div className="technical-grid absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-9 md:flex-row md:items-center md:px-8">
        <Reveal className="flex items-center gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-ink text-white shadow-lg shadow-ink/15">
            <Star className="h-8 w-8 text-amber-400" fill="currentColor" />
          </div>
          <div>
            <p className="flex items-center gap-2 font-display text-4xl font-extrabold tabular-nums tracking-tight text-ink sm:text-5xl">
              <CountUp value={String(googleRating)} />
              <span className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill={i < 4 ? "currentColor" : "none"} />
                ))}
              </span>
            </p>
            <p className="mt-1 text-sm font-medium text-ink-muted">
              Rated by <span className="font-bold text-ink"><CountUp value={`${reviewCount}+`} /></span> customers on Google Reviews
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-8">
          {t.trustLines.map((line) => (
            <p key={line} className="group flex items-center gap-2 text-sm font-semibold text-ink">
              <BadgeCheck className="h-4.5 w-4.5 text-brand transition-transform duration-300 group-hover:scale-125" />
              {line}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function CertMarquee({ certs }: { certs: string[] }) {
  const chips = [...certs, ...certs, ...certs.filter((_, i) => i < 3)];
  return (
    <div className="overflow-hidden py-1">
      <div className="marquee-track flex w-max items-center gap-3">
        {[...chips, ...chips].map((cert, i) => (
          <span
            key={`${cert}-${i}`}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-muted"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            {cert}
          </span>
        ))}
      </div>
    </div>
  );
}