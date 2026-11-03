import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProspect, getTemplates } from "@/lib/prospect";
import { PropertyDiscovery } from "@/components/realestate/PropertyDiscovery";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") return {};
  const t = getTemplates(prospect);
  return {
    title: `${prospect.displayName} — Properties, ${prospect.location}`,
    description: t.servicesIndexMetaDescription,
  };
}

export default async function PropertiesIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") notFound();
  const t = getTemplates(prospect);
  const base = `/${prospect.slug}`;

  return (
    <div className="bg-[#F7F4EE] pt-[120px]">
      <div className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <header className="max-w-4xl">
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">
            <span className="h-px w-10 bg-[#B7A17A]" />
            {t.nav.productsLabel} · {prospect.location}
          </div>
          <h1 className="mt-6 font-re-display text-4xl leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
            The Collection
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
            A considered portfolio of exceptional properties — curated for those who value architecture, place and discretion.
          </p>
        </header>

        <div className="mt-10">
          <PropertyDiscovery listings={prospect.listings ?? []} base={base} initialQuery={q ?? ""} />
        </div>

        <div className="mt-20 flex flex-col items-center gap-5 border border-[#D8D0C4]/60 bg-white p-12 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#B7A17A]">Private Advisory</p>
          <h2 className="font-re-display text-3xl tracking-tight text-ink sm:text-4xl">
            Can&rsquo;t see what you&rsquo;re after?
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-ink-muted">
            Tell us your brief and our advisors will shortlist properties that are genuinely available — discreetly and without obligation.
          </p>
          <Link
            href={`${base}#enquire`}
            className="group mt-3 inline-flex items-center gap-2 bg-ink px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B7A17A]"
            data-cursor="Enquire"
          >
            Request a Private Viewing
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
