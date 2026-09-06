"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { READY_EVENT } from "@/components/fx/FxStage";
import { PRELOAD_KEY } from "@/components/fx/Preloader";
import { sessionFx } from "@/lib/sessionFx";

export function RouteTransition() {
  const pathname = usePathname();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef(true);
  const label = (pathname.split("/").filter(Boolean).at(-1) ?? "Index")
    .replace(/[-_]/g, " ")
    .toUpperCase();

  // Stamp the session so the prospect preloader only runs on the very first
  // page-load of the tab (subsequent navigations are covered by this layer).
  useEffect(() => {
    try {
      sessionStorage.setItem(PRELOAD_KEY, "1");
    } catch {
      /* storage unavailable — preloader will self-manage */
    }
  }, []);

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }

    const root = scopeRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panels = gsap.utils.toArray<HTMLElement>(".rt-panel", root);
    const labelEl = gsap.utils.toArray<HTMLElement>(".rt-label", root)[0];
    const hairlineEl = gsap.utils.toArray<HTMLElement>(".rt-hairline", root)[0];

    sessionFx.setTransitioning(true);
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.set(panels, { visibility: "visible", yPercent: 100 });

      if (reduced) {
        window.dispatchEvent(new Event(READY_EVENT));
        gsap.set(panels, { visibility: "hidden" });
        sessionFx.setTransitioning(false);
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => {
          sessionFx.setTransitioning(false);
          gsap.set(panels, { visibility: "hidden" });
        },
      });

      tl.to(panels, { yPercent: 0, duration: 0.52 }, 0)
        .fromTo(
          labelEl,
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
          0.18
        )
        .fromTo(
          hairlineEl,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.52, ease: "power4.inOut" },
          0
        )
        .call(() => window.dispatchEvent(new Event(READY_EVENT)), [], 0.5)
        .to(labelEl, { y: -18, autoAlpha: 0, duration: 0.34, ease: "power2.in" }, "+=0.12")
        .to(panels, { yPercent: -100, duration: 0.66 }, 0.66);
    }, root);

    return () => {
      ctx.revert();
      sessionFx.setTransitioning(false);
    };
  }, [pathname]);

  return (
    <div ref={scopeRef} className="pointer-events-none fixed inset-0 z-[1000]" aria-hidden>
      <div
        className="rt-panel absolute inset-0 bg-ink"
        style={{ visibility: "hidden", transform: "translateY(100%)" }}
      >
        <div className="technical-grid-dark absolute inset-0 opacity-40" aria-hidden />
        <span className="rt-label absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl font-extrabold uppercase tracking-tight text-white opacity-0 sm:text-3xl">
          {label}
        </span>
        <span className="rt-hairline absolute bottom-0 left-0 h-[3px] w-full origin-left bg-brand" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}