"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function SplitLines({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  once = true,
}: {
  text: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const inners = gsap.utils.toArray<HTMLElement>(".reveal-inner", el);
      if (reduced || !inners.length) return;
      gsap.set(inners, { yPercent: 120 });
      gsap.to(inners, {
        yPercent: 0,
        duration: 0.9,
        delay,
        stagger: 0.055,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, delay, once]);

  return (
    <Tag ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="reveal-mask" style={{ display: "inline-block" }}>
          <span className="reveal-inner" style={{ display: "inline-block" }}>
            {word}
            {i < text.split(" ").length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}