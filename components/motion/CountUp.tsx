"use client";

import { useEffect, useRef, useState } from "react";

function parseValue(v: string) {
  const m = /^([\d.,]+)\s*([kmb]?)\s*(.*)$/.exec(v.trim());
  if (!m) return null;
  const numPart = m[1];
  const hasComma = numPart.includes(",");
  const hasDot = numPart.includes(".");
  let decimalSep: string | null = null;
  if (hasComma && hasDot) decimalSep = ".";
  else if (hasComma) decimalSep = /^\d{1,3}(,\d{3})+$/.test(numPart) ? null : ",";
  else if (hasDot) decimalSep = ".";
  const clean = decimalSep
    ? numPart.replace(/[,.]/g, (c) => (c === decimalSep ? "." : ""))
    : numPart.replace(/,/g, "");
  let target = parseFloat(clean);
  const mult = m[2].toLowerCase();
  if (mult === "k") target *= 1e3;
  else if (mult === "m") target *= 1e6;
  else if (mult === "b") target *= 1e9;
  const decimals = decimalSep ? (numPart.split(decimalSep)[1] || "").length : 0;
  return { target, decimals, suffix: m[3].trim() };
}

const fmt = (n: number, decimals: number) =>
  decimals > 0
    ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(n).toLocaleString("en-US");

export function CountUp({
  value,
  className,
  duration = 1800,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(() => {
    const p = parseValue(value);
    return p ? fmt(0, p.decimals) : value;
  });
  const parsed = parseValue(value);

  useEffect(() => {
    const el = ref.current;
    const p = parseValue(value);
    if (!el || !p) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - k, 3);
          setDisplay(fmt(p.target * eased, p.decimals));
          if (k < 1) requestAnimationFrame(tick);
          else setDisplay(fmt(p.target, p.decimals));
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`} suppressHydrationWarning>
      {display}
      {parsed ? <span className="ml-0.5">{parsed.suffix}</span> : null}
    </span>
  );
}