"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

type DemoNavProps = {
  brandName: string;
  initials: string;
  logo: string | null;
  links: NavLink[];
  ctaLabel: string;
  /** True when the nav sits over a dark hero. */
  onDark: boolean;
  phone?: string | null;
};

export function DemoNav({
  brandName,
  initials,
  logo,
  links,
  ctaLabel,
  onDark,
  phone,
}: DemoNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dark = onDark && !scrolled && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-[var(--line)] bg-[var(--paper)]/92 text-[var(--ink)] backdrop-blur-xl"
            : dark
              ? "border-b border-white/10 bg-transparent text-white"
              : "border-b border-transparent bg-transparent text-[var(--ink)]"
        )}
      >
        <div className="mx-auto flex h-[74px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
          <a
            href="#top"
            className="group flex min-w-0 items-center gap-3"
            onClick={() => setOpen(false)}
          >
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={`${brandName} logo`}
                className="h-9 w-auto max-w-[150px] object-contain"
                loading="eager"
              />
            ) : (
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border text-[11px] font-extrabold tracking-[0.08em]",
                  dark
                    ? "border-white/30 text-white"
                    : "border-[var(--line)] text-[var(--ink)]"
                )}
                style={{ backgroundColor: "var(--brand-tint)" }}
              >
                {initials}
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-bold tracking-[-0.01em] sm:text-sm">
                {brandName}
              </span>
              <span className={cn("block text-[10px] uppercase tracking-[0.22em]", dark ? "text-white/60" : "text-[var(--ink-muted)]")}>
                Concept website
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-underline text-[12px] font-semibold uppercase tracking-[0.16em] opacity-80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="text-[12px] font-semibold tabular-nums opacity-70 transition-opacity hover:opacity-100"
              >
                {phone}
              </a>
            ) : null}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0d0d0d] transition-transform duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {ctaLabel}
            </a>
          </div>

          <button
            type="button"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border lg:hidden",
              dark ? "border-white/30 text-white" : "border-[var(--line)] text-[var(--ink)]"
            )}
            aria-expanded={open}
            aria-controls="demo-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300",
                  open ? "top-1.5 rotate-45" : "top-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 block h-[1.5px] w-4 bg-current transition-opacity duration-200",
                  open && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-4 bg-current transition-transform duration-300",
                  open ? "top-1.5 -rotate-45" : "top-3"
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        id="demo-mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-[var(--paper)] px-6 pb-8 pt-24 text-[var(--ink)] transition-[opacity,transform] duration-500 lg:hidden",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        )}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-[var(--line)] py-4 text-3xl font-semibold tracking-[-0.03em]"
              style={{ fontFamily: "var(--demo-display)" }}
            >
              {link.label}
              <span className="text-[11px] font-normal tabular-nums text-[var(--ink-muted)]">
                0{index + 1}
              </span>
            </a>
          ))}
        </nav>
        <div className="mt-auto space-y-3 pt-8">
          {phone ? (
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="block text-sm font-semibold">
              {phone}
            </a>
          ) : null}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-[var(--radius)] px-5 py-4 text-[12px] font-bold uppercase tracking-[0.14em] text-[#0d0d0d]"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </>
  );
}
