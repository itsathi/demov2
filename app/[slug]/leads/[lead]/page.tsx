import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect } from "@/lib/prospect";
import { buildRealEstateDemo } from "@/lib/realEstateDemo";
import { RealEstateLeadDetail } from "@/components/realestate/RealEstateLeadDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lead: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") return {};
  return {
    title: `${prospect.displayName} — Lead`,
    description: `Enquiry record for ${prospect.displayName}.`,
  };
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ slug: string; lead: string }>;
}) {
  const { slug, lead } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") notFound();
  const demo = buildRealEstateDemo(prospect);
  if (!demo.leads.some((l) => l.id === lead)) notFound();

  return (
    <RealEstateLeadDetail
      prospect={{
        slug: prospect.slug,
        displayName: prospect.displayName,
        companyName: prospect.companyName,
        location: prospect.location,
      }}
      base={`/${prospect.slug}`}
      demo={demo}
      listings={prospect.listings ?? []}
      leadId={lead}
    />
  );
}
