import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProspect, getService, getTemplates } from "@/lib/prospect";
import {
  ServiceHero,
  ServiceOverview,
  ServiceSpecs,
  ServiceApplications,
  ServiceTrust,
} from "@/components/service/ServiceSections";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { CtaEngineered } from "@/components/cta/CtaEngineered";
import type { ProspectConfig, Service, ServiceSection } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; service: string }>;
}): Promise<Metadata> {
  const { slug, service: serviceSlug } = await params;
  const prospect = getProspect(slug);
  const service = prospect && getService(prospect, serviceSlug);
  if (!prospect || !service) return {};
  return {
    title: `${service.name} — ${prospect.displayName}`,
    description: service.tagline,
    keywords: [service.name, prospect.industry, ...service.standards],
  };
}

const sectionComponents: Record<
  Exclude<ServiceSection, "process">,
  (prospect: ProspectConfig, service: Service) => React.ReactNode
> = {
  hero: (p, s) => <ServiceHero prospect={p} service={s} />,
  overview: (p, s) => <ServiceOverview prospect={p} service={s} />,
  specifications: (p, s) => <ServiceSpecs prospect={p} service={s} />,
  applications: (p, s) => <ServiceApplications prospect={p} service={s} />,
  trust: (p) => <ServiceTrust prospect={p} />,
  cta: (p) => <CtaEngineered prospect={p} />,
};

export default async function ServiceSinglePage({
  params,
}: {
  params: Promise<{ slug: string; service: string }>;
}) {
  const { slug, service: serviceSlug } = await params;
  const prospect = getProspect(slug);
  const service = prospect && getService(prospect, serviceSlug);
  if (!prospect || !service) notFound();

  const order = service.sectionOrder.filter((s) => s !== "process");
  const index = prospect.services.findIndex((s) => s.slug === service.slug);
  const prev = prospect.services[(index - 1 + prospect.services.length) % prospect.services.length];
  const next = prospect.services[(index + 1) % prospect.services.length];
  const related = prospect.services.filter((s) => s.slug !== service.slug).slice(0, 4);
  const t = getTemplates(prospect);

  return (
    <div className="bg-white pb-24">
      {order.map((section) => (
        <div key={section}>{sectionComponents[section](prospect, service)}</div>
      ))}

      {!order.includes("cta") && <CtaEngineered prospect={prospect} />}

      {related.length > 0 && (
        <ServiceGrid
          base={`/${prospect.slug}`}
          services={related}
          kicker={t.servicesKicker}
          heading={`More ${t.nav.productsLabel.toLowerCase()} from ${prospect.displayName}`}
          blurb="Keep prospecting — every range links to its own spec page with capacities, standards and applications."
        />
      )}

      <nav
        aria-label="More products"
        className="mx-auto mt-4 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-line px-5 pt-8 sm:px-8"
      >
        <Link
          href={`/${prospect.slug}/services/${prev.slug}`}
          className="group inline-flex items-center gap-2 text-sm font-bold text-ink transition-colors hover:text-brand-strong"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Previous</span>
            {prev.name}
          </span>
        </Link>
        <Link
          href={`/${prospect.slug}/services`}
          className="rounded-lg border border-line px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink-muted transition-colors hover:border-brand hover:text-brand"
        >
          {t.nav.servicesAllLabel}
        </Link>
        <Link
          href={`/${prospect.slug}/services/${next.slug}`}
          className="group inline-flex items-center gap-2 text-right text-sm font-bold text-ink transition-colors hover:text-brand-strong"
        >
          <span className="flex flex-col items-end leading-tight">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Next</span>
            {next.name}
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </nav>
    </div>
  );
}