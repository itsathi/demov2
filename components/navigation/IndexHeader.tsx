import Link from "next/link";
import { allProspects } from "@/lib/prospect";

export function IndexHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[60] border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Concept Demos home" data-cursor="Home">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-[13px] font-extrabold tracking-tight text-white transition-transform duration-500 group-hover:rotate-[360deg]">
            CD
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-extrabold tracking-tight text-ink">
              Concept Demos
            </span>
            <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
              Digital Presence Showcase
            </span>
          </span>
        </Link>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/80 px-3 py-1 text-[11px] font-semibold tabular-nums text-ink-muted">
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {allProspects.length} live demos
        </span>
      </div>
    </header>
  );
}