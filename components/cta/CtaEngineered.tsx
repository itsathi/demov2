import { MousePointerClick, MessageSquareText, PieChart, BellRing } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { MarqueeBand } from "@/components/fx/Marquee";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig } from "@/lib/types";

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mouse: MousePointerClick,
  chart: PieChart,
  chat: MessageSquareText,
  bell: BellRing,
};

export function CtaEngineered({ prospect }: { prospect: ProspectConfig }) {
  const t = getTemplates(prospect);

  return (
    <section id="enquire" className="relative overflow-hidden bg-white">
      <MarqueeBand
        dark
        speed={30}
        items={[prospect.cta.heading, prospect.displayName.toUpperCase(), `EST. ${prospect.established}`]}
      />

      <div className="relative py-20 lg:py-28">
        <div
          className="absolute right-[-15%] top-[-20%] h-[500px] w-[600px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--brand) 0%, transparent 62%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">Start a project</p>
              </Reveal>
              <SplitLines
                text={prospect.cta.heading}
                as="h2"
                className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
              />
              <Reveal delay={0.1}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">{prospect.cta.body}</p>
              </Reveal>

              <Reveal delay={0.15} className="mt-10 space-y-3">
                {t.ctaFeatures.map((f) => {
                  const Icon = FEATURE_ICONS[f.iconKey] ?? MousePointerClick;
                  return (
                    <div key={f.title} className="group flex items-start gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand transition-transform duration-300 group-hover:rotate-6">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-[15px] font-bold text-ink">{f.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{f.body}</p>
                      </div>
                    </div>
                  );
                })}
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <EnquiryForm prospect={prospect} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}