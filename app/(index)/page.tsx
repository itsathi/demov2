import { allProspects } from "@/lib/prospect";
import { RegionPage } from "@/components/visual/RegionPage";

function regionOf(prospect: (typeof allProspects)[number]): string {
  const markets = (prospect.markets ?? []).join(" ").toLowerCase();
  if (markets.includes("western australia") || markets.includes("perth")) return "Perth, WA";
  if (markets.includes("queensland") || markets.includes("brisbane")) return "Brisbane, QLD";
  if (markets.includes("australia")) return "Australia";
  const loc = prospect.location.toLowerCase();
  if (loc.includes("abu dhabi")) return "Abu Dhabi";
  if (loc.includes("umm al quwain")) return "Umm Al Quwain";
  if (loc.includes("dubai")) return "Dubai";
  if (loc.includes("sharjah")) return "Sharjah";
  const first = prospect.location.split(/[,&]/)[0].trim();
  return first || "Other";
}

function groupByRegion() {
  const groups = new Map<string, typeof allProspects>();
  for (const prospect of allProspects) {
    const region = regionOf(prospect);
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