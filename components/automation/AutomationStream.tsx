"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { usePrefersReducedMotion } from "@/components/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type AutomationStreamProps = {
  labels: string[];
  note?: string;
  className?: string;
};

export function AutomationStream({ labels, note, className }: AutomationStreamProps) {
  const reduced = usePrefersReducedMotion();
  const [done, setDone] = useState(() => (reduced ? labels.length : 0));

  useEffect(() => {
    if (reduced) return;
    const timers = labels.map((_, i) =>
      setTimeout(() => setDone(i + 1), 320 + i * 520)
    );
    return () => timers.forEach(clearTimeout);
  }, [labels, reduced]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-paper p-4 sm:p-5",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          <Zap className="h-3.5 w-3.5 text-brand" />
          Automated follow-through
        </p>
        {note && (
          <span className="truncate rounded-full bg-brand-tint px-2.5 py-1 text-[10px] font-bold text-brand-strong">
            {note}
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-0.5">
        {labels.map((label, i) => {
          const isDone = i < done;
          const isActive = i === done;
          return (
            <motion.li
              key={label}
              initial={false}
              animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
              className="flex items-center gap-3 py-1.5"
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] transition-colors duration-300",
                  isDone
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isActive
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-white text-transparent"
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isDone ? "text-ink" : isActive ? "text-ink" : "text-ink-muted"
                )}
              >
                {label}
              </span>
              {isActive && (
                <span className="ml-2 h-1.5 w-1.5 animate-ping rounded-full bg-brand" aria-hidden />
              )}
            </motion.li>
          );
        })}
      </ul>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
          animate={{ width: `${(done / labels.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}