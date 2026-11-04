import type { DemoConfig } from "@/lib/engine/types";
import { Reveal } from "./Reveal";

export function Areas({ config }: { config: DemoConfig }) {
  const { content, recipe } = config;
  if (!content.areas.length) return null;

  return (
    <section id="areas" className="relative overflow-hidden text-white" style={{ backgroundColor: "#0e1214" }}>
      <div className="technical-grid-dark absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] text-white/50">
                <span className="inline-block h-[1px] w-8 bg-[var(--accent)]" aria-hidden />
                {recipe.areasLabel}
              </p>
            </Reveal>
            <Reveal delay={70}>
              <h2
                className="mt-5 text-[clamp(2rem,4vw,3.6rem)] leading-[1] tracking-[-0.035em]"
                style={{ fontFamily: "var(--demo-display)" }}
              >
                Areas served
              </h2>
            </Reveal>
            <Reveal delay={130}>
              <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/55">
                Coverage below is drawn from the company&apos;s published information. Confirm the exact
                scope for your location on enquiry.
              </p>
            </Reveal>
          </div>

          <ul className="grid gap-px self-start border border-white/10 bg-white/10 sm:grid-cols-2">
            {content.areas.map((area, index) => (
              <Reveal key={area} delay={index * 40} as="li">
                <div className="flex items-baseline justify-between gap-4 bg-[#0e1214] px-5 py-5">
                  <span className="text-base font-medium tracking-[-0.01em]">{area}</span>
                  <span className="text-[10px] font-bold tabular-nums text-white/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
