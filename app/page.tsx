import { allProspects } from "@/lib/prospect";
import { RegionPage } from "@/components/visual/RegionPage";

export const metadata = {
  title: "Website Concept Demos",
  description:
    "Re-imagined digital presences for manufacturing and engineering brands — real company data, engineered visuals and a working enquiry flow.",
};

function regionOf(location: string): string {
  const loc = location.toLowerCase();
  if (loc.includes("abu dhabi")) return "Abu Dhabi";
  if (loc.includes("umm al quwain")) return "Umm Al Quwain";
  if (loc.includes("dubai")) return "Dubai";
  if (loc.includes("sharjah")) return "Sharjah";
  const first = location.split(/[,&]/)[0].trim();
  return first || "Other";
}

function groupByRegion() {
  const groups = new Map<string, typeof allProspects>();
  for (const prospect of allProspects) {
    const region = regionOf(prospect.location);
    const list = groups.get(region) ?? [];
    list.push(prospect);
    groups.set(region, list);
  }
  return Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
}

export default function HomePage() {
  const regionGroups = groupByRegion();
  return <RegionPage regionGroups={regionGroups} />;
}