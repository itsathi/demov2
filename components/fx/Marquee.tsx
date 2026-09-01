"use client";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
};

export function Marquee({ children, className, speed = 40, pauseOnHover = true }: MarqueeProps) {
  return (
    <div
      className={cn("relative flex overflow-hidden", className)}
      style={{ maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)" }}
    >
      <div
        className={cn("marquee-track flex w-max shrink-0", pauseOnHover && "hover:[animation-play-state:paused]")}
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="flex w-max items-center">{children}</span>
        <span className="flex w-max items-center" aria-hidden>
          {children}
        </span>
      </div>
    </div>
  );
}

export function MarqueeBand({ items, dark = false, speed = 30 }: { items: string[]; dark?: boolean; speed?: number }) {
  return (
    <div className={cn("border-y py-6", dark ? "border-white/10 bg-ink" : "border-line bg-white")}>
      <Marquee
        speed={speed}
        className={cn(
          "font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl",
          dark ? "text-white" : "text-ink"
        )}
      >
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span className={cn("px-6", i % 2 === 1 && dark ? "stroke-text-light" : i % 2 === 1 ? "stroke-text" : "")}>
              {item}
            </span>
            <span className={cn("text-[0.5em]", dark ? "text-brand" : "text-brand")}>✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}