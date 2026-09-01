import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUpRight, ArrowUp } from "lucide-react";
import { Marquee } from "@/components/fx/Marquee";
import { getTemplates } from "@/lib/prospect";
import type { ProspectConfig } from "@/lib/types";

export function Footer({ prospect }: { prospect: ProspectConfig }) {
  const home = `/${prospect.slug}`;
  const year = new Date().getFullYear();
  const t = getTemplates(prospect);

  const oversize = [t.brand.line1.toUpperCase(), "EST. " + prospect.established, t.brand.line2.toUpperCase()];

  return (
    <footer className="bg-ink text-white">
      {/* Oversize marquee */}
      <div className="border-b border-white/10">
        <Marquee
          speed={26}
          className="py-8 font-display text-display-xl font-extrabold uppercase tracking-tight text-white"
        >
          {oversize.map((word, i) => (
            <span key={`${word}-${i}`} className="flex items-center">
              <span className={i % 2 === 1 ? "px-8 stroke-text-light" : "px-8"}>{word}</span>
              <span className="text-[0.4em] text-brand">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Link href={home} className="flex items-center gap-3" aria-label={`${prospect.displayName} home`} data-cursor="Home">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-sm font-extrabold tracking-tight text-white transition-transform duration-500 hover:rotate-[360deg]">
                {t.brand.initial}
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-base font-extrabold tracking-tight">{t.brand.line1}</span>
                <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white/45">{t.brand.line2}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              {prospect.companyName} — {t.footer.blurb}
            </p>
            <p className="mt-6 font-display text-lg font-bold text-white/90">&ldquo;{prospect.slogan}&rdquo;</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">{t.nav.productsLabel}</h3>
            <ul className="mt-5 space-y-3">
              {prospect.services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link href={`${home}/services/${s.slug}`} className="group inline-flex items-center gap-1.5 text-sm text-white/65 transition-colors hover:text-white">
                    {s.name}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">{t.nav.companyLabel}</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              <li><Link href={`${home}#projects`} className="link-underline transition-colors hover:text-white">{t.nav.projectsLabel}</Link></li>
              <li><Link href={`${home}#capability`} className="link-underline transition-colors hover:text-white">{t.nav.companyLabel}</Link></li>
              <li><Link href={`${home}/services`} className="link-underline transition-colors hover:text-white">{t.nav.servicesAllLabel}</Link></li>
              <li><Link href={`${home}#enquire`} className="link-underline transition-colors hover:text-white">{t.nav.quoteLabel}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm">
              {prospect.contact.email && (
                <li className="flex items-start gap-3 text-white/65">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <a href={`mailto:${prospect.contact.email}`} className="link-underline transition-colors hover:text-white">{prospect.contact.email}</a>
                </li>
              )}
              <li className="flex items-start gap-3 text-white/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>{prospect.contact.address}</span>
              </li>
              {prospect.contact.tollFree && (
                <li className="flex items-start gap-3 text-white/65">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>Toll free — {prospect.contact.tollFree}</span>
                </li>
              )}
              {!prospect.contact.tollFree && prospect.contact.phone && (
                <li className="flex items-start gap-3 text-white/65">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <a href={`tel:${prospect.contact.phone.replace(/\s/g, "")}`} className="link-underline transition-colors hover:text-white">
                    Call / WhatsApp — {prospect.contact.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            © {year} {prospect.companyName}. Concept demonstration only.
          </p>
          <p className="text-xs text-white/40">
            Digital presence concept and modern preview for {prospect.displayName}.
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            data-cursor="Top"
          >
            Back to top
            <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition-colors group-hover:border-brand group-hover:bg-brand">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}