import type { DemoConfig, SectionKey } from "./types";

/** Sections that will actually render for this demo (content can be absent). */
export function visibleSections(config: DemoConfig): SectionKey[] {
  const { content, recipe } = config;
  return recipe.sections.filter((key) => {
    if (key === "services") return content.services.length > 0;
    if (key === "areas") return content.areas.length > 0;
    if (key === "gallery") {
      const shown = recipe.sections.includes("statement")
        ? content.gallery.length - 1
        : content.gallery.length;
      return shown > 0;
    }
    if (key === "trust") return Boolean(content.rating);
    return true;
  });
}

const LABELS: Partial<Record<SectionKey, { label: string; href: string }>> = {
  services: { label: "Services", href: "#services" },
  statement: { label: "About", href: "#about" },
  process: { label: "Process", href: "#process" },
  areas: { label: "Areas", href: "#areas" },
  gallery: { label: "Gallery", href: "#gallery" },
};

export function navLinksFor(sections: SectionKey[]): Array<{ label: string; href: string }> {
  const links: Array<{ label: string; href: string }> = [];
  for (const key of sections) {
    const link = LABELS[key];
    if (link) links.push(link);
  }
  links.push({ label: "Contact", href: "#contact" });
  return links;
}
