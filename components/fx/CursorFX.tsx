"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function CursorFX() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.15 });
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const enter = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const labelText = target?.dataset.cursor;
      gsap.to(ring, { scale: labelText ? 2.4 : 1.7, opacity: 1, duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: labelText ? 0.4 : 1, duration: 0.25 });
      if (labelText) {
        label.textContent = labelText.toUpperCase();
        gsap.to(label, { autoAlpha: 1, y: 0, duration: 0.25 });
      }
    };

    const leave = () => {
      gsap.to(ring, { scale: 1, opacity: 0.6, duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 1, duration: 0.25 });
      gsap.to(label, { autoAlpha: 0, y: 8, duration: 0.2 });
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", enter, { passive: true });
    document.addEventListener("mouseout", leave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand opacity-0"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] grid h-11 w-11 place-items-center -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/70 bg-white/70 opacity-0 backdrop-blur-sm"
        aria-hidden
      >
        <span
          ref={labelRef}
          className="translate-y-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ink opacity-0"
        />
      </div>
    </>
  );
}