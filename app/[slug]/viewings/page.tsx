import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect } from "@/lib/prospect";
import { buildRealEstateDemo } from "@/lib/realEstateDemo";
import { RealEstateViewings } from "@/components/realestate/RealEstateViewings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") return {};
  return {
    title: `${prospect.displayName} — Viewings`,
    description: `Viewing calendar for ${prospect.displayName}.`,
  };
}

export default async function ViewingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") notFound();

  return (
    <RealEstateViewings
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
