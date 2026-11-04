import type { DemoConfig } from "@/lib/engine/types";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Process({ config }: { config: DemoConfig }) {
  const { content, recipe } = config;

  return (
    <section id="process" className="bg-[var(--paper)]">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <SectionHead
          eyebrow="Process"
          title={recipe.processTitle}
          body="A clear sequence, with responsibilities and decisions documented at each stage."
        />

        <ol className="mt-14 grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-4">
          {content.process.map((step, index) => (
            <Reveal key={step.step} delay={index * 70} as="li" className="h-full">
              <div className="flex h-full flex-col bg-[var(--card)] p-6 lg:p-7">
                <span
                  className="text-[11px] font-bold tabular-nums tracking-[0.2em]"
                  style={{ color: "var(--accent)" }}
                >
                  {step.step}
                </span>
                <h3
                  className="mt-8 text-xl tracking-[-0.02em]"
                  style={{ fontFamily: "var(--demo-display)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--ink-muted)]">
                  {step.body}
                </p>
                <div className="mt-auto pt-8">
                  <span className="block h-px w-full bg-[var(--line)]" aria-hidden />
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
