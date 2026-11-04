"use client";

import { useCallback, useEffect, useState } from "react";
import type { DemoConfig } from "@/lib/engine/types";
import { Reveal } from "./Reveal";

export function Gallery({ config }: { config: DemoConfig }) {
  const { content, recipe } = config;
  const items = recipe.sections.includes("statement") ? content.gallery.slice(1) : content.gallery;
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (direction: 1 | -1) => {
      setActive((current) => {
        if (current === null) return current;
        const count = items.length;
        return (current + direction + count) % count;
      });
    },
    [items.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  if (!items.length) return null;

  return (
    <section id="gallery" className="bg-[var(--card)]">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--ink-muted)]">
                <span className="inline-block h-[1px] w-8 bg-[var(--accent)]" aria-hidden />
                Gallery
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h2
                className="mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1] tracking-[-0.035em]"
                style={{ fontFamily: "var(--demo-display)" }}
              >
                A closer look
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-sm text-[11px] leading-relaxed text-[var(--ink-muted)]">
              {content.galleryConcept
                ? "Includes licensed concept imagery. Stock images are never presented as the company's own projects."
                : "Imagery pulled from the company's public website."}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={`${item.src}-${index}`} delay={index * 70}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className="group relative block w-full overflow-hidden"
                style={{ borderRadius: "var(--radius)" }}
                aria-label={`Open image ${index + 1}: ${item.alt}`}
              >
                <div className={index === 0 ? "aspect-[4/3] sm:aspect-[3/4]" : "aspect-[4/3]"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                  ↗
                </span>
                {item.concept ? (
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
                    Concept
                  </span>
                ) : null}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-black/92 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={close}
        >
          <div className="flex items-center justify-between text-white/70">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
              {active + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] hover:bg-white/10"
            >
              Close
            </button>
          </div>
          <div
            className="flex min-h-0 flex-1 items-center justify-center py-6"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={items[active].src}
              alt={items[active].alt}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              className="rounded-full border border-white/20 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 hover:bg-white/10"
            >
              ← Previous
            </button>
            <p className="hidden max-w-md text-center text-[11px] text-white/50 sm:block">
              {items[active].alt}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              className="rounded-full border border-white/20 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 hover:bg-white/10"
            >
              Next →
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
