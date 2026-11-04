import type { DemoConfig } from "@/lib/engine/types";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Services({ config }: { config: DemoConfig }) {
  const { content, recipe } = config;
  if (!content.services.length) return null;

  return (
    <section id="services" className="border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            eyebrow={recipe.servicesLabel}
            title={recipe.servicesTitle}
            body={`A focused view of what ${content.shortName} does. Detail and availability are confirmed directly on enquiry.`}
          />
          <Reveal delay={120}>
            <a
              href="#contact"
              className="link-underline inline-flex text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]"
            >
              Request details ↗
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {content.services.map((service, index) => (
            <Reveal key={service.name} delay={index * 60} className="h-full">
              <article className="group flex h-full flex-col justify-between gap-8 bg-[var(--card)] p-6 transition-colors duration-300 hover:bg-[var(--brand-tint)] lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[10px] font-bold tabular-nums tracking-[0.18em] text-[var(--ink-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                    aria-hidden
                  />
                </div>
                <div>
                  <h3
                    className="text-xl leading-tight tracking-[-0.02em] lg:text-2xl"
                    style={{ fontFamily: "var(--demo-display)" }}
                  >
                    {service.name}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--ink-muted)]">
                    {service.blurb}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                    {service.verified ? "Listed on company site" : "Concept service"}
                  </span>
                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {content.servicesConcept ? (
          <p className="mt-5 text-[11px] leading-relaxed text-[var(--ink-muted)]">
            Some services are neutral concept content pending confirmation. They are never presented as
            verified company offerings.
          </p>
        ) : null}
      </div>
    </section>
  );
}
