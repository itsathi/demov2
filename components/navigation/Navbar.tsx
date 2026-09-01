"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTemplates } from "@/lib/prospect";
import { Magnetic } from "@/components/motion/Magnetic";
import type { ProspectConfig } from "@/lib/types";

const EASE = [0.65, 0, 0.35, 1] as const;

export function Navbar({ prospect }: { prospect: ProspectConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState<string | null>(null);
  const pathname = usePathname();
  const t = getTemplates(prospect);

  const home = `/${prospect.slug}`;
  const services = `${home}/services`;

  const isHome = pathname === home;
  const isServices = pathname === services || pathname.startsWith(`${services}/`);

  const links = [
    { label: t.nav.productsLabel, href: isHome ? home : services, active: isServices },
    { label: t.nav.projectsLabel, href: `${home}#projects`, active: false },
    { label: t.nav.companyLabel, href: `${home}#capability`, active: false },
    { label: t.nav.contactLabel, href: `${home}#enquire`, active: false },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Dubai",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] transition-all duration-300",
          scrolled || open
            ? "border-b border-line bg-white/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Link
            href={home}
            className="group flex items-center gap-3"
            aria-label={`${prospect.displayName} home`}
            data-cursor="Home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-[13px] font-extrabold tracking-tight text-white transition-transform duration-500 group-hover:rotate-[360deg]">
              {t.brand.initial}
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[15px] font-extrabold tracking-tight text-ink">
                {t.brand.line1}
              </span>
              <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
                {t.brand.line2}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={cn(
                  "link-underline text-sm font-medium text-ink-muted transition-colors hover:text-ink",
                  l.active && "text-ink"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-3 py-1 text-[11px] font-semibold tabular-nums text-ink-muted">
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {now ? `GST ${now}` : "GST"}
            </span>
             {prospect.contact.email && (
              <a
                href={`mailto:${prospect.contact.email}`}
                className="link-underline hidden text-sm font-semibold text-ink-muted transition-colors hover:text-ink xl:inline"
              >
                {prospect.contact.email}
              </a>
             )}
            <Magnetic strength={0.3}>
              <Link
                href={`${home}#enquire`}
                className="shine group inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand"
                data-cursor="Quote"
              >
                {t.nav.quoteLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="group grid h-11 w-11 place-items-center rounded-lg border border-line bg-white/70 text-ink transition-colors hover:border-ink/30 lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            data-cursor={open ? "Close" : "Menu"}
          >
            <div className="flex flex-col items-center justify-center gap-[5px]">
              <span
                className={cn(
                  "h-[2px] w-5 bg-current transition-all duration-300",
                  open && "translate-y-[7px] rotate-45"
                )}
              />
              <span className={cn("h-[2px] w-5 bg-current transition-all duration-300", open && "opacity-0")} />
              <span
                className={cn(
                  "h-[2px] w-5 bg-current transition-all duration-300",
                  open && "-translate-y-[7px] -rotate-45"
                )}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-[58] flex flex-col bg-ink text-white lg:hidden"
          >
            <div className="technical-grid-dark absolute inset-0 opacity-40" aria-hidden />
            <div className="relative mt-[72px] flex flex-1 flex-col justify-between overflow-hidden px-5 pb-8 pt-6">
              <nav className="flex flex-col" aria-label="Mobile">
                {links.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between border-b border-white/10 py-5 font-display text-3xl font-extrabold tracking-tight"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-2">{l.label}</span>
                      <ArrowUpRight className="h-6 w-6 text-white/40 transition-colors group-hover:text-brand" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">{prospect.companyName}</p>
                <p className="mt-2 font-display text-xl font-bold italic text-white/85">&ldquo;{prospect.slogan}&rdquo;</p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href={`${home}#enquire`}
                    onClick={() => setOpen(false)}
                    className="inline-flex h-13 items-center justify-center rounded-lg bg-brand px-5 text-sm font-semibold text-white"
                  >
                    {t.nav.quoteLabel}
                  </Link>
                  {(prospect.contact.tollFree ?? prospect.contact.phone) && (
                    <a
                      href={`tel:${((prospect.contact.tollFree ?? prospect.contact.phone) ?? "").replace(/\s/g, "")}`}
                      className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 text-sm font-semibold text-white">
                      {(prospect.contact.tollFree ?? prospect.contact.phone)}
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}