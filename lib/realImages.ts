// Real image URLs captured from each company's live website (verified reachable).
// Slots that are missing here keep the prospect's existing (stock) image, and every
// consumer component falls back to that stock image if a real URL ever fails to load.

const SKM = "https://www.skmaircon.com/img/banners";
const GEO = "https://geogroupglobal.com/assets/img/portfolio";
const ALJUNAID = "https://www.aljunaidgroup.com/web/image";
const ATHER = "https://www.atheeraljazirah.com/images";
const BURJ = "https://burjaldar.com/wp-content/uploads/2021/03";
const BESTAIR = "https://bestairservices.com/wp-content/uploads";
const UNITED = "https://www.unitedgulf.ae/wp-content/uploads";
const TAWOOS = "https://tawoostech.com/wp-content/uploads";
const WIX = (uri: string, w: number, h: number) =>
  `https://static.wixstatic.com/media/${uri}/v1/fill/w_${w},h_${h},al_c,q_90/${uri}`;

export const realBrandImages: Record<string, Record<string, string>> = {
  "john-paul-ac": {
    officeBanner: WIX("2e85c2_96e855d5633a4d938f63929c7007f89ef000.jpg", 1920, 1080),
    aerial: WIX("2e85c2_8fd54bd35af64f988652299a31c0bbc1~mv2.jpg", 1920, 1080),
    factorySharjah: WIX("2e85c2_dd955ba64c5148808b71b870c18b9152~mv2.jpg", 1920, 1080),
    heroPoster: WIX("2e85c2_775a8d8d63694b439a421ca8d66dc672f000.jpg", 1920, 1080),
    showreelPoster: WIX("2e85c2_cf1c9af0bf984165a08debad5fbf6b70~mv2.png", 1920, 1080),
  },
  "skm-aircon": {
    officeBanner: `${SKM}/Office%20banner-02.jpg`,
    aerial: `${SKM}/skm_highlights_jan20.jpg`,
    factorySharjah: `${SKM}/Applied%20Products%20-%20%20full%20range-01.png`,
    heroPoster: `${SKM}/MAH-01.jpg`,
    showreelPoster: `${SKM}/desert-04.jpg`,
  },
  "geo-group-global": {
    officeBanner: `${GEO}/home-slide-2.webp`,
    aerial: `${GEO}/home-slide-3.webp`,
    factorySharjah: `${GEO}/home-slide-6.webp`,
    heroPoster: `${GEO}/home-slide-1.webp`,
    showreelPoster: `${GEO}/home-slide-4.webp`,
  },
  aljunaid: {
    officeBanner:
      `${ALJUNAID}/56897-e06382de/%D9%85%D8%AC%D9%85%D9%88%D8%B9%D8%A9%20%D8%A7%D9%84%D8%AC%D9%86%D9%8A%D8%AF%20%D8%A7%D9%84%D8%B5%D9%86%D8%A7%D8%B9%D9%8A%D8%A9.jpg`,
    aerial:
      `${ALJUNAID}/49687-1856d96a/WhatsApp%20Image%202023-12-14%20at%2015.14.24_b14b517a.jpg`,
    factorySharjah:
      `${ALJUNAID}/56897-e06382de/%D9%85%D8%AC%D9%85%D9%88%D8%B9%D8%A9%20%D8%A7%D9%84%D8%AC%D9%86%D9%8A%D8%AF%20%D8%A7%D9%84%D8%B5%D9%86%D8%A7%D8%B9%D9%8A%D8%A9.jpg`,
    heroPoster: `${ALJUNAID}/48916-c2a54473/ch1%20%283%29.png`,
    showreelPoster: `${ALJUNAID}/48917-a2227bee/ch3.png`,
  },
  "atheer-al-jazirah": {
    officeBanner: `${ATHER}/dubai-skyscrape.jpg?crc=4289052603`,
    aerial: `${ATHER}/dubai-540747275-above0116.jpg?crc=4061395958`,
    factorySharjah: `${ATHER}/wall09.jpg?crc=255342571`,
    heroPoster: `${ATHER}/dsc_0145.jpg?crc=194176020`,
    showreelPoster: `${ATHER}/dubai-shutterstock.jpg?crc=471948485`,
  },
  "burj-al-dar": {
    officeBanner: `${BURJ}/slid1-1.jpg`,
    aerial: `${BURJ}/slid2.jpg`,
    factorySharjah: `${BURJ}/slid3.jpg`,
    heroPoster: `${BURJ}/3-1.jpg`,
    showreelPoster: `${BURJ}/11-1.jpg`,
  },
  bestair: {
    officeBanner: `${BESTAIR}/2024/05/1.jpg`,
    aerial: `${BESTAIR}/2024/05/dubai-aerial-cityscape-.jpg`,
    factorySharjah: `${BESTAIR}/2024/05/about-us-.jpg`,
    heroPoster: `${BESTAIR}/2024/11/4ww.jpg`,
    showreelPoster: `${BESTAIR}/2024/05/7.jpg`,
  },
  "united-gulf": {
    officeBanner: `${UNITED}/2024/02/slider-img2.jpg`,
    aerial: `${UNITED}/2024/02/slider-img3.jpg`,
    factorySharjah: `${UNITED}/2024/04/fire-and-safety-3.jpeg`,
    heroPoster: `${UNITED}/2024/02/slider-img4.jpg`,
    showreelPoster: `${UNITED}/2024/02/firefighting-system.jpg`,
  },
  "al-tawoos": {
    officeBanner: `${TAWOOS}/2023/02/HVAC-Execution-Service.jpg`,
    aerial: `${TAWOOS}/2023/02/Company-Overview-Right-Image.jpg`,
    factorySharjah: `${TAWOOS}/2023/02/HOT-TAPPING-PIPE-FREEZING-Service.jpg`,
    heroPoster: `${TAWOOS}/2023/02/HVAC-AMC.jpg`,
    showreelPoster: `${TAWOOS}/2023/02/TAB-WORKS-Service.jpg`,
  },
};

export const realServiceImages: Record<string, Record<string, string>> = {
  "john-paul-ac": {
    "ac-installation": WIX("2e85c2_e74396d7980e4993941d086e4bebb73d~mv2.png", 1280, 720),
    "ac-maintenance": WIX("2e85c2_0a5fd3df59354ed788ead6971f06cc32~mv2.png", 1280, 720),
    ventilation: WIX("2e85c2_cf1c9af0bf984165a08debad5fbf6b70~mv2.png", 1280, 720),
    refrigeration: WIX("2e85c2_ca365b3633cc4729ba833c65cf2d93ad~mv2.jpg", 1280, 720),
    "duct-works": WIX("2e85c2_dd955ba64c5148808b71b870c18b9152~mv2.jpg", 1280, 720),
    coolguard: WIX("2e85c2_8fd54bd35af64f988652299a31c0bbc1~mv2.jpg", 1280, 720),
    "design-consultancy": WIX("2e85c2_96e855d5633a4d938f63929c7007f89ef000.jpg", 1280, 720),
  },
  "skm-aircon": {
    "air-handling-units": `${SKM}/MAH-01.jpg`,
    "vrf-systems": `${SKM}/desert-05.jpg`,
    "packaged-units": `${SKM}/PAC4A-01.jpg`,
    "fan-coil-units": `${SKM}/FCU%20banner-01.jpg`,
    "computer-room-air-conditioners": `${SKM}/CRAC%20banner-01.jpg`,
    "swimpool-units": `${SKM}/swimpool%202-01.jpg`,
    "package-split-units": `${SKM}/APCN-V%2001.jpg`,
    "condensing-units": `${SKM}/APMR-V-01.jpg`,
  },
  "geo-group-global": {
    "geonair-water-chillers": `${GEO}/home-slide-1.webp`,
    "geonair-package-units": `${GEO}/home-slide-2.webp`,
    "geonair-air-handling-units": `${GEO}/home-slide-4.webp`,
    "geonair-ducted-split-units": `${GEO}/home-slide-3.webp`,
    "geonair-wall-mounted-units": `${GEO}/home-slide-5.webp`,
    "geonair-air-curtains": `${GEO}/geonair.webp`,
    "geonair-floor-standing-units": `${GEO}/home-slide-6.webp`,
    "domestic-water-chillers": `${GEO}/home-slide-2.webp`,
  },
  aljunaid: {
    "packaged-air-conditioning": `${ALJUNAID}/48916-c2a54473/ch1%20%283%29.png`,
    "chiller-units": `${ALJUNAID}/48915-85ca204c/ch2%20%281%29.png`,
    "cold-room-freezer-panels": `${ALJUNAID}/48917-a2227bee/ch3.png`,
    "refrigeration-units": `${ALJUNAID}/48918-019336ad/ch4.png`,
    "ducted-mini-split-systems": `${ALJUNAID}/48919-84035870/ch5.png`,
    "replacement-condensing-spare-parts": `${ALJUNAID}/48920-dba481c0/ch6.png`,
  },
  "atheer-al-jazirah": {
    "mechanical-works": `${ATHER}/dsc_0001.jpg?crc=3994609263`,
    "electrical-works": `${ATHER}/wall09.jpg?crc=255342571`,
    "plumbing-works": `${ATHER}/dsc_0145.jpg?crc=194176020`,
    "general-building": `${ATHER}/dubai-skyscrape.jpg?crc=4289052603`,
    "facility-maintenance": `${ATHER}/shutterstock_532455481.jpg?crc=212654485`,
  },
  "burj-al-dar": {
    "building-construction": `${BURJ}/slid3.jpg`,
    "industrial-warehouse-construction": `${BURJ}/10-1.jpg`,
    "villa-residential-projects": `${BURJ}/5-1.jpg`,
    "renovation-refurbishment": `${BURJ}/12-1.jpg`,
  },
  bestair: {
    "air-cooled-chiller-services": `${BESTAIR}/2024/05/1.jpg`,
    "chilled-water-system-services": `${BESTAIR}/2024/05/3.jpg`,
    "packaged-rooftop-unit-services": `${BESTAIR}/2024/05/4.jpg`,
    "fcu-ahu-ducted-systems": `${BESTAIR}/2024/05/5.jpg`,
    "cold-room-solutions": `${BESTAIR}/2024/05/7.jpg`,
    "btu-metering-controls": `${BESTAIR}/2024/05/8.jpg`,
  },
  "united-gulf": {
    "fire-fighting-systems": `${UNITED}/2024/02/firefighting-system.jpg`,
    "air-conditioning-systems": `${UNITED}/2024/02/hvac-system-1.jpg`,
    "electrical-works": `${UNITED}/2024/02/electrical.jpg`,
    "plumbing-works": `${UNITED}/2024/02/plumbing.jpg`,
    "amc-mep-services": `${UNITED}/2024/02/amc.jpg`,
  },
  "al-tawoos": {
    "hvac-execution": `${TAWOOS}/2023/02/HVAC-Execution-Service.jpg`,
    "kitchen-ventilation-dckv": `${TAWOOS}/2023/03/Demand-Control-Kitchen-Ventilation-Image.jpg`,
    "hvac-annual-maintenance": `${TAWOOS}/2023/02/HVAC-AMC.jpg`,
    "hvac-maintenance-repair": `${TAWOOS}/2023/02/HVAC-Maintenance.jpg`,
    "tab-works": `${TAWOOS}/2023/02/TAB-WORKS-Service.jpg`,
    "cladding-works": `${TAWOOS}/2023/02/Cladding-Work-Service.jpg`,
  },
};

export const realProjectImages: Record<string, string[]> = {
  "john-paul-ac": [
    WIX("2e85c2_e74396d7980e4993941d086e4bebb73d~mv2.png", 1280, 960),
    WIX("2e85c2_cf1c9af0bf984165a08debad5fbf6b70~mv2.png", 1280, 960),
    WIX("2e85c2_dd955ba64c5148808b71b870c18b9152~mv2.jpg", 1280, 960),
    WIX("2e85c2_ca365b3633cc4729ba833c65cf2d93ad~mv2.jpg", 1280, 960),
    WIX("2e85c2_0a5fd3df59354ed788ead6971f06cc32~mv2.png", 1280, 960),
    WIX("2e85c2_8fd54bd35af64f988652299a31c0bbc1~mv2.jpg", 1280, 960),
  ],
  "geo-group-global": [
    `${GEO}/home-slide-1.webp`,
    `${GEO}/home-slide-3.webp`,
    `${GEO}/home-slide-4.webp`,
    `${GEO}/home-slide-6.webp`,
    `${GEO}/home-slide-2.webp`,
    `${GEO}/home-slide-5.webp`,
  ],
  aljunaid: [
    `${ALJUNAID}/56897-e06382de/%D9%85%D8%AC%D9%85%D9%88%D8%B9%D8%A9%20%D8%A7%D9%84%D8%AC%D9%86%D9%8A%D8%AF%20%D8%A7%D9%84%D8%B5%D9%86%D8%A7%D8%B9%D9%8A%D8%A9.jpg`,
    `${ALJUNAID}/49687-1856d96a/WhatsApp%20Image%202023-12-14%20at%2015.14.24_b14b517a.jpg`,
    `${ALJUNAID}/48916-c2a54473/ch1%20%283%29.png`,
    `${ALJUNAID}/48915-85ca204c/ch2%20%281%29.png`,
  ],
  "atheer-al-jazirah": [
    `${ATHER}/dsc_0001.jpg?crc=3994609263`,
    `${ATHER}/dsc_0145.jpg?crc=194176020`,
    `${ATHER}/dubai-540747275-above0116.jpg?crc=4061395958`,
    `${ATHER}/dubai-skyscrape.jpg?crc=4289052603`,
    `${ATHER}/wall09.jpg?crc=255342571`,
    `${ATHER}/dubai-shutterstock.jpg?crc=471948485`,
  ],
  "burj-al-dar": [
    `${BURJ}/slid1-1.jpg`,
    `${BURJ}/2-1.jpg`,
    `${BURJ}/3-1.jpg`,
    `${BURJ}/4-1.jpg`,
    `${BURJ}/10-1.jpg`,
    `${BURJ}/11-1.jpg`,
    `${BURJ}/13-1.jpg`,
  ],
  bestair: [
    `${BESTAIR}/2024/05/3.jpg`,
    `${BESTAIR}/2024/05/5.jpg`,
    `${BESTAIR}/2024/05/6.jpg`,
    `${BESTAIR}/2024/05/7.jpg`,
    `${BESTAIR}/2024/05/8.jpg`,
    `${BESTAIR}/2024/05/4.jpg`,
  ],
  "united-gulf": [
    `${UNITED}/2022/11/11-3.jpg`,
    `${UNITED}/2022/11/12-4.jpg`,
    `${UNITED}/2022/11/2-1-1.jpg`,
    `${UNITED}/2022/11/2-2.jpg`,
    `${UNITED}/2022/11/23-1.jpg`,
    `${UNITED}/2022/11/31.jpg`,
  ],
  "al-tawoos": [
    `${TAWOOS}/2023/03/Al-Baik.jpg`,
    `${TAWOOS}/2023/03/Bounce%40Delma-mall.jpg`,
    `${TAWOOS}/2023/03/AlAin-Farms.jpg`,
    `${TAWOOS}/2023/03/Cafe-Beirut%40Murooj.jpg`,
    `${TAWOOS}/2023/03/lopo-pizza.jpg`,
    `${TAWOOS}/2023/03/ihealthy.jpg`,
    `${TAWOOS}/2023/03/Asador-1.jpg`,
    `${TAWOOS}/2023/03/Chhappan-Bhog.jpg`,
  ],
};

export function brandImage(prospectSlug: string, key: string): string | undefined {
  return realBrandImages[prospectSlug]?.[key];
}

export function serviceImage(prospectSlug: string, serviceSlug: string): string | undefined {
  return realServiceImages[prospectSlug]?.[serviceSlug];
}

export function projectImage(prospectSlug: string, index: number): string | undefined {
  return realProjectImages[prospectSlug]?.[index];
}