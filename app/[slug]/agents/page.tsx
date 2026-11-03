import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect } from "@/lib/prospect";
import { buildRealEstateDemo } from "@/lib/realEstateDemo";
import { RealEstateAgents } from "@/components/realestate/RealEstateAgents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") return {};
  return {
    title: `${prospect.displayName} — Agents`,
    description: `Advisory team for ${prospect.displayName}.`,
  };
}

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") notFound();

  return (
    <RealEstateAgents
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
