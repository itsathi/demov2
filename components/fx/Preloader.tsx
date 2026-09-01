"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";

export const PRELOAD_KEY = "demo-preloaded";

export function Preloader({
  brandLine,
  brandLine2,
  onDone,
}: {
  brandLine: string;
  brandLine2: string;
  onDone: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [gone, setGone] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const finish = () => {
      onDone();
      setGone(true);
    };

    if (reduced) {
      sessionStorage.setItem(PRELOAD_KEY, "1");
      finish();
      return;
    }

    if (sessionStorage.getItem(PRELOAD_KEY)) {
      finish();
      return;
    }

    sessionStorage.setItem(PRELOAD_KEY, "1");

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      gsap.to(counter, {
        v: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (numRef.current) numRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
        },
      });

      gsap.fromTo(
        ".pre-word",
        { yPercent: 120 },
        { yPercent: 0, duration: 1.2, stagger: 0.04, delay: 0.2, ease: "power4.out" }
      );

      gsap.to([".pre-text-line", ".pre-progress-track", ".pre-counter"], {
        autoAlpha: 0,
        y: (i, target) => (target.classList.contains(".pre-progress-track") ? 10 : target.classList.contains(".pre-counter") ? 6 : -10),
        duration: 0.4,
        delay: 2.0,
        ease: "power2.in",
      });

      gsap.to(".curtain-panel", {
        yPercent: -100,
        duration: 1.2,
        delay: 2.4,
        ease: "power4.inOut",
        onComplete: finish,
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (gone && sessionStorage.getItem(PRELOAD_KEY) === "1") {
      sessionStorage.removeItem(PRELOAD_KEY);
    }
  }, [gone]);

  if (gone) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[999] bg-ink" aria-hidden>
      {/* Curtain panels */}
      <div className="curtain-panel absolute inset-0 bg-ink" />
      <div className="curtain-panel absolute inset-0 bg-brand" style={{ transform: "translateY(100%)" }} />

      {/* Content */}
      <div className="pre-text-line absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        <div className="flex overflow-hidden font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {brandLine.split("").map((c, i) => (
            <span key={i} className="pre-word overflow-hidden">
              <span style={{ display: "inline-block" }}>{c === " " ? "\u00A0" : c}</span>
            </span>
          ))}
        </div>
        <p className="pre-text-line mt-3 text-[9px] font-medium uppercase tracking-[0.32em] text-white/40">
          {brandLine2}
        </p>

        <div className="pre-progress-track mt-14 h-px w-64 overflow-hidden bg-white/8">
          <div ref={barRef} className="h-full w-full origin-left bg-white/90" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>

      <div className="pre-counter absolute bottom-10 right-10 z-10 flex items-baseline gap-1 font-display text-white/60">
        <span ref={numRef} className="text-3xl font-semibold tabular-nums sm:text-4xl">
          000
        </span>
        <span className="text-xs font-normal text-white/40">%</span>
      </div>
    </div>
  );
}