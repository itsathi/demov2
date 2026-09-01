import { Globe2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig } from "@/lib/types";

export function RegionsServed({ prospect }: { prospect: ProspectConfig }) {
  const t = getTemplates(prospect);

  return (
    <section className="relative overflow-hidden bg-paper py-20 lg:py-24">
      <div
        className="pointer-events-none absolute -right-8 bottom-0 hidden select-none font-display text-display-huge font-extrabold uppercase tracking-tight text-ink/[0.05] lg:block"
        aria-hidden
      >
        ON GROUND
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-tint text-brand">
                  <Globe2 className="h-5 w-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">{t.regions.kicker}</p>
              </div>
            </Reveal>
            <SplitLines text={t.regions.headline} className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl" />
            <Reveal delay={0.1}>
              <p className="mt-5 text-sm leading-relaxed text-ink-muted sm:text-base">{t.regions.body}</p>
            </Reveal>
          </div>

          <div className="space-y-10">
            {t.regions.groups.map((group, gi) => (
              <Reveal key={group.title} delay={gi * 0.08}>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-ink-muted">{group.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {group.items.map((m) => (
                      <span
                        key={m}
                        className="group cursor-default rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_12px_28px_-16px_rgba(0,82,255,0.45)]"
                        data-cursor="Pin"
                      >
                        <span className="mr-1.5 text-brand opacity-0 transition-opacity group-hover:opacity-100">●</span>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}