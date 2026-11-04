import type { IndustryFamily } from "./types";

/**
 * Licensed stock imagery used only when a company has no usable verified
 * photography. Every stock item is rendered with a visible "concept imagery"
 * note so it is never mistaken for the company's own work.
 */
const BASE = "https://images.unsplash.com/photo";
const img = (id: string, w = 1800, h = 1200) =>
  `${BASE}-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const PHOTO = {
  villa: img("1613490493576-7fde63acd811"),
  modernHome: img("1600596542815-ffad4c1539a9"),
  penthouse: img("1600607687939-ce8a6c25118c"),
  livingRoom: img("1600566753086-00f18fb6b3ea"),
  poolVilla: img("1512917774080-9991f1c4c750"),
  apartment: img("1545324418-cc1a3fa10c00"),
  skyline: img("1512453979798-5ea266f8880c"),
  bedroom: img("1560448204-e02f11c3d0e2"),
  kitchen: img("1556909212-d5b604d0c90d"),
  office: img("1497366216548-37526070297c"),
  officeLounge: img("1497366811353-6870744d04b2"),
  aerial: img("1502005229762-cf1b2da7c5d6"),
  facade: img("1600585154340-be6161a56a0c"),
  interiorWarm: img("1560185007-cde436f6a4d0"),
  lounge: img("1618221195710-dd6b41faaea6"),
  dining: img("1617806118233-18e1de247200"),
  masterSuite: img("1595526114035-0d45ed16cfbf"),
  spa: img("1584622650111-993a426fbf0a"),
  factory: img("1565043666747-69f6646db940"),
  engineer: img("1581094794329-c8112a89af12"),
  engineer2: img("1581092918056-0c4c3acd3789"),
  technician: img("1621905251189-08b45d6a269e"),
  industrial: img("1504328345606-18bbc8c9d7d1"),
  construction: img("1504307651254-35680f356dfd"),
  site: img("1541888946425-d81bb19240f5"),
  architecture: img("1487958449943-2429e8be8625"),
  blueprint: img("1503387762-592deb58ef4e"),
  team: img("1521737604893-d14cc237f11d"),
  meeting: img("1454165804606-c3d57bc86b40"),
  cleaning: img("1581578731548-c64695cc6952"),
  clinic: img("1519494026892-80bbd2d6fd0d"),
  care: img("1576091160399-112ba8d25d1d"),
  campus: img("1503676260728-1c00da094a0b"),
  library: img("1541339907198-e08756dedf3f"),
  hotel: img("1566073771259-6a8506099945"),
  restaurant: img("1517248135467-4c7edcad34c4"),
  retail: img("1441986300917-64674bd600d8"),
  store: img("1567401893414-76b7b1e5a7a5"),
} as const;

const SETS: Record<IndustryFamily, string[]> = {
  real_estate: [PHOTO.villa, PHOTO.penthouse, PHOTO.livingRoom, PHOTO.poolVilla, PHOTO.facade, PHOTO.aerial],
  interior: [PHOTO.lounge, PHOTO.dining, PHOTO.kitchen, PHOTO.masterSuite, PHOTO.spa, PHOTO.interiorWarm],
  hvac: [PHOTO.engineer, PHOTO.technician, PHOTO.industrial, PHOTO.engineer2, PHOTO.factory],
  facilities: [PHOTO.officeLounge, PHOTO.cleaning, PHOTO.team, PHOTO.blueprint, PHOTO.office],
  construction: [PHOTO.construction, PHOTO.site, PHOTO.architecture, PHOTO.blueprint, PHOTO.facade],
  manufacturing: [PHOTO.factory, PHOTO.engineer, PHOTO.industrial, PHOTO.engineer2, PHOTO.blueprint],
  home_services: [PHOTO.technician, PHOTO.cleaning, PHOTO.engineer, PHOTO.team],
  professional: [PHOTO.office, PHOTO.meeting, PHOTO.officeLounge, PHOTO.team, PHOTO.architecture],
  healthcare: [PHOTO.clinic, PHOTO.care, PHOTO.team, PHOTO.officeLounge],
  education: [PHOTO.campus, PHOTO.library, PHOTO.meeting, PHOTO.architecture],
  hospitality: [PHOTO.hotel, PHOTO.restaurant, PHOTO.lounge, PHOTO.interiorWarm],
  retail: [PHOTO.retail, PHOTO.store, PHOTO.lounge, PHOTO.interiorWarm],
  other: [PHOTO.office, PHOTO.architecture, PHOTO.team, PHOTO.meeting],
};

export function stockFor(family: IndustryFamily): string[] {
  return SETS[family] ?? SETS.other;
}

export function stockAt(family: IndustryFamily, index: number): string {
  const set = stockFor(family);
  return set[index % set.length];
}
