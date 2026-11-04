import type { DemoConfig } from "@/lib/engine/types";
import { Reveal } from "./Reveal";

export function Trust({ config }: { config: DemoConfig }) {
  const { content } = config;
  if (!content.rating) return null;

  return (
    <section className="border-b border-[var(--line)] bg-[var(--brand-tint)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <div className="flex items-center gap-4">
            <span
              className="text-3xl font-semibold tabular-nums tracking-[-0.04em]"
              style={{ fontFamily: "var(--demo-display)" }}
            >
              {content.rating.value.toFixed(1)}
            </span>
            <div>
              <div className="flex items-center gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className="text-sm"
                    style={{
                      color:
                        index < Math.round(content.rating!.value)
                          ? "var(--accent)"
                          : "var(--line)",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                Google rating
                {content.rating.count ? ` · ${content.rating.count} reviews` : ""}
              </p>
            </div>
          </div>
        </Reveal>

        {content.keywords.length ? (
          <Reveal delay={100}>
            <ul className="flex flex-wrap gap-2">
              {content.keywords.slice(0, 4).map((keyword) => (
                <li
                  key={keyword}
                  className="rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 text-[10px] font-semibold text-[var(--ink-muted)]"
                >
                  {keyword}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
