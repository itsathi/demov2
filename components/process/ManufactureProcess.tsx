import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig } from "@/lib/types";

export function ManufactureProcess({ prospect }: { prospect: ProspectConfig }) {
  const t = getTemplates(prospect);
  const steps = t.process.steps;

  return (
    <section className="relative overflow-hidden bg-ink py-20 lg:py-28">
      <div className="technical-grid-dark absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute -left-8 top-6 hidden select-none font-display text-display-huge font-extrabold uppercase tracking-tight stroke-text-light opacity-60 lg:block"
        aria-hidden
      >
        PROCESS
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand" style={{ color: "#7aa2ff" }}>
            {t.process.kicker}
          </p>
        </Reveal>
        <SplitLines
          text={t.process.headline}
          className="mx-auto mt-3 max-w-3xl text-center font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
        />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/60 sm:text-base">
            {t.process.body}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.07} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-brand/60 hover:bg-white/[0.07]">
                <span className="font-display text-4xl font-extrabold transition-colors duration-300 group-hover:text-brand" style={{ color: "rgba(255,255,255,0.15)" }}>
                  {s.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/55 transition-colors group-hover:text-white/70">{s.body}</p>
                {i < steps.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden h-px w-3 bg-white/20 lg:block" aria-hidden />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}