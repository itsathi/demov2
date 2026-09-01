"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type AnimatedSvgProps = {
  src: string;
  className?: string;
  /** "load" plays entrances immediately (hero); "scroll" reveals on scroll (sections). */
  playOn?: "load" | "scroll";
  caption?: string;
};

type Motion = "flow" | "spin" | "drift" | "pulse" | "rise" | "dash";

export function AnimatedSvg({ src, className, playOn = "load", caption }: AnimatedSvgProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [markup, setMarkup] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let cancelled = false;
    fetch(`/${encodeURI(src)}`)
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return;
        const uid = Math.random().toString(36).slice(2, 8);
        const namespaced = text
          .replace(/id="/g, `id="${uid}-`)
          .replace(/url\(#/g, `url(#${uid}-`)
          .replace(/url\('#/g, `url('#${uid}-`);
        setMarkup(namespaced);
      })
      .catch(() => setMarkup(""));
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || markup === null || markup === "" || reduced || !root.querySelector("svg")) {
      return;
    }

    const ctx = gsap.context(() => {
      const by = (m: Motion) => Array.from(root.querySelectorAll(`[data-motion="${m}"]`));

      by("spin").forEach((el, i) => {
        gsap.to(el, {
          rotation: 360,
          transformOrigin: "50% 50%",
          duration: 6 - i * 1.2,
          ease: "none",
          repeat: -1,
        });
      });

      by("drift").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -7 : 7,
          duration: 2.6 + (i % 3) * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      by("pulse").forEach((el, i) => {
        gsap.to(el, {
          opacity: 0.35,
          duration: 1.6 + (i % 2) * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.25,
        });
      });

      const draw = (el: Element) => {
        const node = el as SVGPathElement;
        const len = node.getTotalLength ? node.getTotalLength() : 400;
        gsap.fromTo(
          node,
          { strokeDasharray: `${len} ${len}`, strokeDashoffset: len, autoAlpha: 1 },
          { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }
        );
      };

      if (playOn === "load") {
        by("flow").forEach((el, i) => {
          if (el.getAttribute("stroke-dasharray")) return;
          gsap.fromTo(
            el,
            { autoAlpha: 0.25, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.1 + i * 0.1, ease: "power2.out" }
          );
        });
        by("dash").forEach((el) => draw(el));
        by("rise")
          .slice(0, 3)
          .forEach((el, i) =>
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 22 },
              { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.3 + i * 0.15, ease: "power3.out" }
            )
          );
      } else {
        const start = "top 80%";
        by("flow").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0.2, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: { trigger: root, start, once: true },
            }
          );
        });
        by("rise")
          .slice(0, 3)
          .forEach((el, i) => {
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.12,
                ease: "power3.out",
                scrollTrigger: { trigger: root, start, once: true },
              }
            );
          });
        by("dash").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.2,
              scrollTrigger: { trigger: root, start, once: true },
              onComplete: () => draw(el),
              immediateRender: false,
            }
          );
        });
      }
    }, root);

    return () => ctx.revert();
  }, [markup, playOn, reduced]);

  return (
    <div ref={containerRef} className={className}>
      <div className="h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
        {markup && (
        <div
          className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: markup }}
          aria-hidden
        />
      )}
      </div>
      {caption && (
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          {caption}
        </p>
      )}
    </div>
  );
}