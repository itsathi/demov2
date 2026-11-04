import type { CSSProperties } from "react";
import type { DemoConfig, SectionKey } from "@/lib/engine/types";
import { navLinksFor, visibleSections } from "@/lib/engine/navigation";
import { DemoNav } from "./DemoNav";
import { Hero } from "./Hero";
import { Services } from "./Services";
import { Statement } from "./Statement";
import { Process } from "./Process";
import { Areas } from "./Areas";
import { Gallery } from "./Gallery";
import { Trust } from "./Trust";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

const SECTION_COMPONENTS: Record<SectionKey, (props: { config: DemoConfig }) => React.ReactNode> = {
  trust: Trust,
  statement: Statement,
  services: Services,
  process: Process,
  areas: Areas,
  gallery: Gallery,
  contact: Contact,
};

export function DemoPage({ config }: { config: DemoConfig }) {
  const { theme, recipe, content, company } = config;
  const sections = visibleSections(config);

  const vars = {
    "--paper": theme.paper,
    "--card": theme.card,
    "--ink": theme.ink,
    "--ink-muted": theme.inkMuted,
    "--line": theme.line,
    "--brand": theme.brand,
    "--brand-strong": theme.brandStrong,
    "--brand-tint": theme.brandTint,
    "--accent": theme.accent,
    "--demo-display": theme.displayFont,
    "--demo-body": theme.bodyFont,
    "--radius": theme.radius,
  } as CSSProperties;

  const onDark = theme.mode === "dark" || recipe.heroVariant === "fullbleed";

  return (
    <div
      style={vars}
      className="min-h-screen overflow-x-clip bg-[var(--paper)] text-[var(--ink)] [font-family:var(--demo-body)]"
    >
      <DemoNav
        brandName={content.brandName}
        initials={content.initials}
        logo={content.logo}
        links={navLinksFor(sections)}
        ctaLabel={content.hero.primaryCta}
        onDark={onDark}
        phone={content.contact.phone}
      />

      <main>
        <Hero config={config} />
        {sections.map((key) => {
          const Section = SECTION_COMPONENTS[key];
          return <Section key={key} config={config} />;
        })}
      </main>

      <Footer config={config} />

      <a
        href={`https://${company.domain}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="fixed bottom-5 right-5 z-30 hidden rounded-full border border-[var(--line)] bg-[var(--card)]/90 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ink-muted)] shadow-sm backdrop-blur-md transition-colors hover:text-[var(--ink)] sm:block"
        title="Open the company's live website"
      >
        Live site ↗
      </a>
    </div>
  );
}
