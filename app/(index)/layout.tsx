import type { Metadata } from "next";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CursorFX } from "@/components/fx/CursorFX";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { IndexHeader } from "@/components/navigation/IndexHeader";

export const metadata: Metadata = {
  title: "Concept Website Demos",
  description:
    "Re-imagined digital presences for manufacturing and engineering brands — real company data, engineered visuals and a working enquiry flow.",
};

export default function IndexLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="grain-overlay" aria-hidden />
      <CursorFX />
      <ScrollProgress />
      <IndexHeader />
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}