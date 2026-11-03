import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect } from "@/lib/prospect";
import { buildRealEstateDemo } from "@/lib/realEstateDemo";
import { PropertyDetailView } from "@/components/realestate/PropertyDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; property: string }>;
}): Promise<Metadata> {
  const { slug, property } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") return {};
  const listing = prospect.listings?.find((l) => l.slug === property);
  if (!listing) return {};
  return {
    title: `${listing.title} — ${prospect.displayName}`,
    description: listing.description,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string; property: string }>;
}) {
  const { slug, property } = await params;
  const prospect = getProspect(slug);
  if (!prospect || prospect.industryKey !== "real_estate") notFound();

  const listing = prospect.listings?.find((l) => l.slug === property);
  if (!listing) notFound();

  const others = (prospect.listings ?? []).filter((l) => l.id !== listing.id);

  const demo = buildRealEstateDemo(prospect);
  const owner = demo.owners.find((o) => o.propertyIds.includes(listing.id));
  const crm = {
    leadCount: demo.leads.filter((l) => l.propertyId === listing.id).length,
    dealCount: demo.deals.filter((d) => d.propertyId === listing.id).length,
    viewingCount: demo.viewings.filter((v) => v.propertyId === listing.id).length,
    documentCount: demo.documents.filter(
      (d) => d.entityType === "Property" && d.entityId === listing.id
    ).length,
    ownerName: owner?.name,
    ownerType: owner?.type,
    ownerAgreement: owner?.agreement,
  };

  return (
    <PropertyDetailView
      prospect={prospect}
      listing={listing}
      others={others}
      crm={crm}
    />
  );
}
