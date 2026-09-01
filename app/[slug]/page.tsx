import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect, getTemplates } from "@/lib/prospect";
import { HeroEngineered } from "@/components/hero/HeroEngineered";
import { RatingStrip } from "@/components/trust/TrustStrip";
import { MarqueeBand } from "@/components/fx/Marquee";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { CapabilitySplit } from "@/components/capability/CapabilitySplit";
import { ProjectRail } from "@/components/projects/ProjectRail";
import { ManufactureProcess } from "@/components/process/ManufactureProcess";
import { RegionsServed } from "@/components/regions/RegionsServed";
import { CtaEngineered } from "@/components/cta/CtaEngineered";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect) return {};
  return {
    title: `${prospect.displayName} — ${prospect.metaRole ?? "HVAC & Services"}, ${prospect.location}`,
    description: prospect.hero.subline,
  };
}

export default async function ProspectHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect) notFound();
  const t = getTemplates(prospect);

  const featured = prospect.services.filter((s) => s.featured).slice(0, 4);
  const featuredCount = featured.length;
  const others = prospect.services.filter((s) => !s.featured);

  const marqueeItems = [
    prospect.displayName,
    `Est. ${prospect.established}`,
    t.brand.line2,
    ...t.trustLines,
  ];

  return (
    <>
      <HeroEngineered prospect={prospect} />
      <RatingStrip prospect={prospect} />
      <MarqueeBand items={marqueeItems} dark speed={34} />
      <ServiceGrid
        base={`/${prospect.slug}`}
        services={featuredCount ? featured : others.slice(0, 4)}
        kicker={t.servicesKicker}
        heading={t.servicesHomeHeading}
        blurb={t.servicesHomeBlurb}
      />
      <CapabilitySplit prospect={prospect} />
      <ProjectRail prospect={prospect} />
      <ManufactureProcess prospect={prospect} />
      <RegionsServed prospect={prospect} />
      <CtaEngineered prospect={prospect} />
    </>
  );
}