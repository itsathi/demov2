import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect } from "@/lib/prospect";
import { buildRealEstateDemo } from "@/lib/realEstateDemo";
import { RealEstatePipeline } from "@/components/realestate/RealEstatePipeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") return {};
  return {
    title: `${prospect.displayName} — Sales Pipeline`,
    description: `Real estate deal pipeline for ${prospect.displayName}.`,
  };
}

export default async function PipelinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") notFound();

  return (
    <RealEstatePipeline
      prospect={{
        slug: prospect.slug,
        displayName: prospect.displayName,
        companyName: prospect.companyName,
        location: prospect.location,
      }}
      base={`/${prospect.slug}`}
      demo={buildRealEstateDemo(prospect)}
      listings={prospect.listings ?? []}
    />
  );
}
