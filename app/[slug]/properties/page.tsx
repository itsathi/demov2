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
    <div className="bg-paper pt-[112px]">
      <div className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <header className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
            {t.nav.productsLabel} · {prospect.location}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
            {t.servicesIndexHeading}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">{t.servicesIndexBlurb}</p>
        </header>

        <div className="mt-10">
          <PropertyDiscovery listings={prospect.listings ?? []} base={base} initialQuery={q ?? ""} />
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-line bg-card p-10 text-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-ink">
            Can&rsquo;t see what you&rsquo;re after?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-ink-muted">
            Tell us your brief and the {prospect.displayName} team will shortlist what is genuinely
            available — no endless listings, no wasted viewings.
          </p>
          <Link
            href={`${base}#enquire`}
            className="shine group mt-2 inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-brand"
            data-cursor="Enquire"
          >
            {t.nav.quoteLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
