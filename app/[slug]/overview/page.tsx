import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect } from "@/lib/prospect";
import { buildRealEstateDemo } from "@/lib/realEstateDemo";
import { RealEstateOverview } from "@/components/realestate/RealEstateOverview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") return {};
  return {
    title: `${prospect.displayName} — Real Estate Overview`,
    description: `Real estate overview for ${prospect.displayName} in ${prospect.location}`,
  };
}

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") notFound();

  const demo = buildRealEstateDemo(prospect);
  const base = `/${prospect.slug}`;

  return (
    <RealEstateOverview
      prospect={{
        slug: prospect.slug,
        displayName: prospect.displayName,
        companyName: prospect.companyName,
        location: prospect.location,
      }}
      base={base}
      listings={prospect.listings ?? []}
      demo={demo}
    />
  );
}
