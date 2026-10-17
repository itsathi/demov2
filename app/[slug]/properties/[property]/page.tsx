import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProspect } from "@/lib/prospect";
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

  return <PropertyDetailView prospect={prospect} listing={listing} others={others} />;
}
