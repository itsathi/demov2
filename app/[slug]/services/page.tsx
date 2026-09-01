import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProspect, getTemplates } from "@/lib/prospect";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect) return {};
  const t = getTemplates(prospect);
  return {
    title: t.servicesIndexMetaTitle,
    description: t.servicesIndexMetaDescription,
  };
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect) notFound();
  const t = getTemplates(prospect);

  return (
    <div className="bg-paper pt-[72px]">
      <section className="relative overflow-hidden">
        <div className="technical-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 pb-4 pt-16 md:px-8 lg:pt-20">
          <nav aria-label="Breadcrumb">
            <Link
              href={`/${prospect.slug}`}
              className="text-xs font-bold uppercase tracking-[0.2em] text-brand hover:text-brand-strong"
            >
              {t.nav.homeBack}
            </Link>
          </nav>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">
              {t.servicesKicker}
            </p>
            <SplitLines text={t.servicesIndexHeading} as="h1" className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl" />
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {t.servicesIndexBlurb}
            </p>
          </Reveal>
        </div>
      </section>

      <ServiceGrid
        base={`/${prospect.slug}`}
        services={prospect.services}
        variant="index"
      />
    </div>
  );
}