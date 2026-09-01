"use client";

import { useEffect, useRef } from "react";
import { CursorFX } from "@/components/fx/CursorFX";
import { Preloader } from "@/components/fx/Preloader";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

export const READY_EVENT = "athinem:ready";

export function FxStage({
  children,
  brandLine,
  brandLine2,
}: {
  children: React.ReactNode;
  brandLine: string;
  brandLine2: string;
}) {
  const doneRef = useRef(false);

  useEffect(() => {
    return () => {
      window.dispatchEvent(new Event(READY_EVENT));
    };
  }, []);

  const handleDone = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    requestAnimationFrame(() => window.dispatchEvent(new Event(READY_EVENT)));
  };

  return (
    <>
      <CursorFX />
      <ScrollProgress />
      <div className="grain-overlay" aria-hidden />
      <Preloader brandLine={brandLine} brandLine2={brandLine2} onDone={handleDone} />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}