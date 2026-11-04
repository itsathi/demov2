import type { DemoConfig } from "@/lib/engine/types";
import { Reveal } from "./Reveal";

export function Statement({ config }: { config: DemoConfig }) {
  const { content } = config;
  const image = content.gallery[0] ?? null;

  return (
    <section id="about" className="border-y border-[var(--line)] bg-[var(--card)]">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:gap-20 lg:py-28">
        <div>
          <Reveal>
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--ink-muted)]">
              <span className="inline-block h-[1px] w-8 bg-[var(--accent)]" aria-hidden />
              The company
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2
              className="mt-6 max-w-xl text-[clamp(2rem,4vw,3.6rem)] leading-[1] tracking-[-0.035em]"
              style={{ fontFamily: "var(--demo-display)" }}
            >
              {content.about.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-[var(--ink-muted)]">
              {content.about.body}
            </p>
          </Reveal>

          {content.about.facts.length ? (
            <Reveal delay={180}>
              <dl className="mt-10 grid max-w-xl grid-cols-2 gap-px border border-[var(--line)] bg-[var(--line)]">
                {content.about.facts.map((fact) => (
                  <div key={fact.label} className="bg-[var(--card)] px-4 py-4">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}

          {!content.about.verified ? (
            <Reveal delay={220}>
              <p className="mt-6 max-w-lg text-[11px] leading-relaxed text-[var(--ink-muted)]">
                Company description to be confirmed. The copy above is neutral concept content, not a
                verified claim.
              </p>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={100} className="lg:pt-6">
          {image ? (
            <figure className="relative overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {image.concept ? (
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
                  Concept imagery · licensed stock
                </figcaption>
              ) : null}
            </figure>
          ) : (
            <div
              className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden border border-[var(--line)] p-8"
              style={{ backgroundColor: "var(--brand-tint)", borderRadius: "var(--radius)" }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                {content.industryLabel}
              </span>
              <div>
                <div
                  className="text-[clamp(3rem,7vw,6rem)] leading-none tracking-[-0.05em]"
                  style={{ fontFamily: "var(--demo-display)", color: "var(--brand-strong)" }}
                >
                  {content.initials}
                </div>
                <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[var(--ink-muted)]">
                  {content.locationLabel}
                </p>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
