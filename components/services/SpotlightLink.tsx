"use client";

import { useRef } from "react";
import Link from "next/link";

export function SpotlightLink({
  href,
  className,
  children,
  ...rest
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  "data-cursor"?: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={onMove}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}
