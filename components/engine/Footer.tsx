import type { DemoConfig } from "@/lib/engine/types";
import { navLinksFor, visibleSections } from "@/lib/engine/navigation";

export function Footer({ config }: { config: DemoConfig }) {
  const { content, company } = config;
  const year = new Date().getFullYear();
  const navLinks = navLinksFor(visibleSections(config));

  return (
    <footer className="relative overflow-hidden text-white" style={{ backgroundColor: "#0c0f12" }}>
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-white/20 text-[11px] font-extrabold tracking-[0.08em]"
                style={{ backgroundColor: "var(--accent)", color: "#0d0d0d" }}
              >
                {content.initials}
              </span>
              <span className="text-sm font-bold">{content.brandName}</span>
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/55">
              {content.hero.subline}
            </p>
            <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-white/35">
              {content.locationLabel}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">Explore</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-white/70">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a className="hover:text-white" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">Contact</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-white/70">
              {content.contact.phone ? (
                <li>
                  <a className="tabular-nums hover:text-white" href={`tel:${content.contact.phone.replace(/[^+\d]/g, "")}`}>
                    {content.contact.phone}
                  </a>
                </li>
              ) : null}
              {content.contact.email ? (
                <li>
                  <a className="break-all hover:text-white" href={`mailto:${content.contact.email}`}>
                    {content.contact.email}
                  </a>
                </li>
              ) : null}
              {content.contact.address ? (
                <li className="max-w-[220px] leading-relaxed text-white/55">{content.contact.address}</li>
              ) : null}
              {!content.contact.phone && !content.contact.email ? (
                <li className="text-white/45">Details to be confirmed</li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-[10px] leading-relaxed text-white/35 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p>
              Concept website created for {content.brandName}. Not the company&apos;s live site.
              Content is drawn from publicly available information; verify all details directly with
              the company before publishing or transacting.
            </p>
            <p className="mt-2 tabular-nums">
              {company.identity.demoId} · {company.identity.batchId} · template {company.templateId} v
              {company.templateVersion}
            </p>
          </div>
          <p className="shrink-0">
            © {year} {content.brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}
