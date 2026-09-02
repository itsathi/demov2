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
const AIO = "https://files.saasuae.gositebuilder.com";
const AIRO = "https://www.airotechacgm.com/static/img";
const ENDV = "https://endeavoruae.com/wp-content/uploads/2023/02";
const NQT = "https://noqtatalnada.com/wp-content/uploads";
const CMB = "https://camberme.com/wp-content/uploads";
const NWY = "https://newwaygroupcompanies.ae/assets/images";
const GBF = "https://gbfm.ae/wp-content/uploads/2026/06";
const DHB = "https://dhabicontracting.com/wp-content/uploads";
const WAM = "https://whitearch-me.com/wp-content/uploads/2025/05";
const LEM = "https://lemlemtechnicals.com/wp-content/uploads/2024/11";
const PRM = "https://www.primegroupuae.ae";
const SAC = "https://specialairconditiongeneralmaintenance.com/wp-content/uploads";
const NLF = "https://newlifeuae.com/wp-content/uploads/2022/04";
const ACO = "https://air-co.ae/wp-content/uploads";
const BST = "https://brightstargroup.ae/wp-content/uploads";
const EMR = "https://emra.ae/assets";
const LRK = "https://lark.ae/wp-content/uploads";
const QLIV =
  "https://img1.wsimg.com/isteam/getty/2188405641/:/rs=w:1920,h:1080,cg:true,m";

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
  // ── Abu Dhabi demos (scraped from each company's live site, verified 200) ──
  aiofm: {
    officeBanner: `${AIO}/08/1e/081e899e-d49a-4a83-a120-2835d30097ef.jpeg`,
    aerial: `${AIO}/99/b3/99b3791a-3c2a-407a-95d1-100a036eb291.jpg`,
    factorySharjah: `${AIO}/cf/fc/cffcc313-363d-4455-a8f7-0da7511cf289.jpg`,
    heroPoster: `${AIO}/50/5e/505e1335-95ed-467b-a21a-4e6cb75bc3ab.jpg`,
    showreelPoster: `${AIO}/08/1e/081e899e-d49a-4a83-a120-2835d30097ef.jpeg`,
  },
  airotechacgm: {
    officeBanner: `${AIRO}/bannerr1.jpg`,
    aerial: `${AIRO}/bannerr2.jpg`,
    factorySharjah: `${AIRO}/banner3a.jpeg`,
    heroPoster: `${AIRO}/acmain.jpg`,
    showreelPoster: `${AIRO}/2acmain.jpg`,
  },
  endeavor: {
    officeBanner: `${ENDV}/HVAC-1.jpg`,
    aerial: `${ENDV}/HVAC-2.jpg`,
    factorySharjah: `${ENDV}/HVAC-3.jpg`,
    heroPoster: `${ENDV}/HVAC-2.jpg`,
    showreelPoster: `${ENDV}/HVAC-1.jpg`,
  },
  noqtatalnada: {
    officeBanner: `${NQT}/2025/09/nan-slider-01.webp`,
    aerial: `${NQT}/2025/09/nan-slider-02-d.webp`,
    factorySharjah: `${NQT}/2025/09/nan-slider-03.webp`,
    heroPoster: `${NQT}/2025/09/Yas-Mosque-04.webp`,
    showreelPoster: `${NQT}/2025/09/Villa-F-01.webp`,
  },
  camberme: {
    officeBanner: `${CMB}/2025/04/close-up-men-with-masks-working-together-1-5.png`,
    aerial: `${CMB}/2025/04/2-1-2.png`,
    factorySharjah: `${CMB}/2025/04/3-1-2.png`,
    heroPoster: `${CMB}/2025/04/4-1-2.png`,
    showreelPoster: `${CMB}/2025/04/5-1-1.png`,
  },
  newwaygroupcompanies: {
    officeBanner: `${NWY}/home/sliders/bg_1.jpg`,
    aerial: `${NWY}/home/sliders/bg_2.jpg`,
    factorySharjah: `${NWY}/home/sliders/bg_3.jpg`,
    heroPoster: `${NWY}/home/about.jpg`,
    showreelPoster: `${NWY}/home/services/hvac.jpg`,
  },
  gbfm: {
    officeBanner: `${GBF}/Gemini_Generated_Image_csganjcsganjcsga.png`,
    aerial: `${GBF}/Gemini_Generated_Image_qp76psqp76psqp76.png`,
    factorySharjah: `${GBF}/Gemini_Generated_Image_de89cqde89cqde89.png`,
    heroPoster: `${GBF}/6ea060c0-e0ae-431f-9500-88c6e6040bf4.jpg`,
    showreelPoster: `${GBF}/WhatsApp-Image-2026-06-08-at-4.41.43-PM.jpeg`,
  },
  dhabicontracting: {
    officeBanner: `${DHB}/2024/07/absolutvision_wyd_pkca1by_unsplash_1.webp`,
    aerial: `${DHB}/2024/08/1.png`,
    factorySharjah: `${DHB}/2024/08/2.png`,
    heroPoster: `${DHB}/2024/08/3.png`,
    showreelPoster: `${DHB}/2024/08/4.png`,
  },
  thehealthyhomeme: {
    officeBanner: `https://thehealthyhome.me/new-home/assets/images/background2.webp`,
    aerial: `https://thehealthyhome.me/new-home/assets/images/background2.webp`,
    factorySharjah: `https://thehealthyhome.me/img/02615937-6722-43e8-8b9c-f75e286514df/prototype-png.png?fm=webp&q=100&fit=max&crop=1488,1472,0,0&w=1488`,
    heroPoster: `https://thehealthyhome.me/new-home/assets/images/background2.webp`,
    showreelPoster: `https://thehealthyhome.me/img/02615937-6722-43e8-8b9c-f75e286514df/prototype-png.png?fm=webp&q=100&fit=max&crop=1488,1472,0,0&w=1488`,
  },
  "whitearch-me": {
    officeBanner: `${WAM}/Untitled-design-2025-05-07T054106.906.jpg`,
    aerial: `${WAM}/Untitled-design-2025-05-06T150017.720.jpg`,
    factorySharjah: `${WAM}/Untitled-design-2025-05-07T124248.930.jpg`,
    heroPoster: `${WAM}/Untitled-design-2025-05-06T150921.028.jpg`,
    showreelPoster: `${WAM}/Untitled-design-2025-05-06T151304.866.jpg`,
  },
  lemlemtechnicals: {
    officeBanner: `${LEM}/01-e1751875905178.webp`,
    aerial: `${LEM}/1000x600-e1751883302683.webp`,
    factorySharjah: `${LEM}/Car-Wash-Banner-e1751874482514.png`,
    heroPoster: `${LEM}/1.jpg`,
    showreelPoster: `${LEM}/2.jpg`,
  },
  primegroup: {
    officeBanner: `${PRM}/images/gallery-1.jpg`,
    aerial: `${PRM}/images/gallery-2.jpg`,
    factorySharjah: `${PRM}/images/gallery-3.jpg`,
    heroPoster: `${PRM}/images/gallery-4.jpg`,
    showreelPoster: `${PRM}/images/gallery-5.jpg`,
  },
  emccllc: {
    officeBanner: WIX("f7133f9895b24525a2ad16c1e778c9fa.jpg", 1920, 1080),
    aerial: WIX("2e0338287b2c4edaae950630b29be851.jpg", 1920, 1080),
    factorySharjah: WIX("34d3d94481d145e19d068133f1dbe772.jpg", 1920, 1080),
    heroPoster: WIX("6a401562b21040bd8d76faeff9042212.jpg", 1920, 1080),
    showreelPoster: WIX("d0712aab1f9249668c74c9812441546e.jpg", 1920, 1080),
  },
  specialairconditiongeneralmaintenance: {
    officeBanner: `${SAC}/2026/02/Home-page-image-1.jpg`,
    aerial: `${SAC}/2026/02/Home-Page-image-2.jpg`,
    factorySharjah: `${SAC}/2024/10/ac-maintenance.png`,
    heroPoster: `${SAC}/2024/08/ac-maintenance.jpg`,
    showreelPoster: `${SAC}/2024/08/air-conditioner.jpg`,
  },
  newlife: {
    officeBanner: `${NLF}/hvac.jpg`,
    aerial: `${NLF}/hvac.jpg`,
    factorySharjah: `${NLF}/hvac.jpg`,
    heroPoster: `${NLF}/hvac.jpg`,
    showreelPoster: `${NLF}/hvac.jpg`,
  },
  "air-co": {
    officeBanner: `${ACO}/2025/09/about-airco.webp`,
    aerial: `${ACO}/2025/09/annual-maintence-contract.webp`,
    factorySharjah: `${ACO}/2025/09/annual-maintence-contract.webp`,
    heroPoster: `${ACO}/2025/06/Breathe-Fresh-New-1-1355x2048.webp`,
    showreelPoster: `${ACO}/2025/06/Breathe-Right-New-1-1355x2048.webp`,
  },
  brightstargroup: {
    officeBanner: `${BST}/2026/01/hvac-duct-cladding-company-abu-dhabiUAE-1024x573.jpg`,
    aerial: `${BST}/2025/04/9.png`,
    factorySharjah: `${BST}/2025/04/6.png`,
    heroPoster: `${BST}/2025/04/1.png`,
    showreelPoster: `${BST}/2025/04/2.png`,
  },
  emra: {
    officeBanner: `${EMR}/images/Landing%20page/about-img.png`,
    aerial: `${EMR}/images/Services/MEP.png`,
    factorySharjah: `${EMR}/images/Services/ac.png`,
    heroPoster: `${EMR}/images/Services/maintance.png`,
    showreelPoster: `${EMR}/images/Services/fire.png`,
  },
  lark: {
    officeBanner: `${LRK}/2025/05/slide1-26.webp`,
    aerial: `${LRK}/2025/05/wide2-1.webp`,
    factorySharjah: `${LRK}/2025/05/wide3-1.webp`,
    heroPoster: `${LRK}/2025/05/Luxury-Villa-A-03.webp`,
    showreelPoster: `${LRK}/2025/05/Luxury-Villa-D-Main.webp`,
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
  aiofm: {
    "air-conditioning-services": `${AIO}/99/b3/99b3791a-3c2a-407a-95d1-100a036eb291.jpg`,
    "civil-works-services": `${AIO}/cf/fc/cffcc313-363d-4455-a8f7-0da7511cf289.jpg`,
    "plumbing-services": `${AIO}/50/5e/505e1335-95ed-467b-a21a-4e6cb75bc3ab.jpg`,
    "duct-cleaning": `${AIO}/08/1e/081e899e-d49a-4a83-a120-2835d30097ef.jpeg`,
    "villa-maintenance": `${AIO}/cf/fc/cffcc313-363d-4455-a8f7-0da7511cf289.jpg`,
    "emergency-ac-repair": `${AIO}/99/b3/99b3791a-3c2a-407a-95d1-100a036eb291.jpg`,
  },
  airotechacgm: {
    "hvac-systems-design-installation": `${AIRO}/banner1.png`,
    "annual-maintenance-contracts-amc": `${AIRO}/workers.jpg`,
    "smoke-ventilation-systems": `${AIRO}/machine.jpg`,
    "24-7-emergency-services": `${AIRO}/machine2.jpg`,
    "duct-cleaning": `${AIRO}/banner23.png`,
    "plumbing-full-building-maintenance": `${AIRO}/acmain.jpg`,
  },
  endeavor: {
    "heat-load-calculation-design": `${ENDV}/HVAC-1.jpg`,
    "equipment-selection-procurement": `${ENDV}/HVAC-2.jpg`,
    "shopping-mall-industrial-hvac-works": `${ENDV}/HVAC-3.jpg`,
    "after-sales-service-amc-for-ac-systems": `${ENDV}/HVAC-2.jpg`,
    "duct-cleaning": `${ENDV}/HVAC-1.jpg`,
    "villa-maintenance": `${ENDV}/HVAC-3.jpg`,
    "emergency-ac-repair": `${ENDV}/HVAC-2.jpg`,
  },
  noqtatalnada: {
    "facility-management": `${NQT}/2025/09/nan-slider-01.webp`,
    "fit-out-contracting": `${NQT}/2025/09/Villa-F-01.webp`,
    "maintenance-and-amc": `${NQT}/2025/09/nan-slider-03.webp`,
    "mep-contracting": `${NQT}/2025/09/Al-Ain-Hospital-Renovation-01.webp`,
    "duct-cleaning": `${NQT}/2025/09/Yas-Mosque-04.webp`,
    "emergency-ac-repair": `${NQT}/2023/12/Fairmont-Hotel-02.webp`,
  },
  camberme: {
    "hvac-system-design": `${CMB}/2025/04/2-1-2.png`,
    "installation-commissioning": `${CMB}/2025/04/3-1-2.png`,
    "air-conditioning-ventilation-systems": `${CMB}/2025/04/4-1-2.png`,
    "ductwork-piping": `${CMB}/2025/04/5-1-1.png`,
    "bms-integration": `${CMB}/2025/04/2-1-2.png`,
    "energy-efficient-solutions": `${CMB}/2025/04/3-1-2.png`,
    "villa-maintenance": `${CMB}/2025/04/4-1-2.png`,
    "emergency-ac-repair": `${CMB}/2025/04/5-1-1.png`,
  },
  newwaygroupcompanies: {
    "electro-mechanical-contracting": `${NWY}/home/services/electrical.jpg`,
    "design-services": `${NWY}/home/services/interior.jpg`,
    "project-management": `${NWY}/home/about.jpg`,
    "project-development": `${NWY}/home/services/civil.jpg`,
    "integrated-engineering-solutions": `${NWY}/home/services/hvac.jpg`,
    "duct-cleaning": `${NWY}/home/services/plumbing.jpg`,
    "villa-maintenance": `${NWY}/home/services/civil.jpg`,
    "emergency-ac-repair": `${NWY}/home/services/hvac.jpg`,
  },
  gbfm: {
    "hvac-maintenance-service": `${GBF}/6ea060c0-e0ae-431f-9500-88c6e6040bf4.jpg`,
    "preventive-maintenance": `${GBF}/Gemini_Generated_Image_csganjcsganjcsga.png`,
    "system-inspection-and-cleaning": `${GBF}/Gemini_Generated_Image_qp76psqp76psqp76.png`,
    "duct-cleaning": `${GBF}/Gemini_Generated_Image_de89cqde89cqde89.png`,
    "emergency-ac-repair": `${GBF}/Gemini_Generated_Image_4fr7rb4fr7rb4fr7.png`,
  },
  dhabicontracting: {
    "civil-engineering": `${DHB}/2024/07/absolutvision_wyd_pkca1by_unsplash_1.webp`,
    "electro-mechanical-engineering": `${DHB}/2024/08/1.png`,
    "turnkey-construction-projects": `${DHB}/2024/08/2.png`,
    "industrial-projects": `${DHB}/2024/08/3.png`,
    "commercial-projects": `${DHB}/2024/08/4.png`,
    "institutional-projects": `${DHB}/2024/08/5.png`,
    "duct-cleaning": `${DHB}/2024/08/6.png`,
    "villa-maintenance": `${DHB}/2024/08/5.png`,
    "emergency-ac-repair": `${DHB}/2024/08/6.png`,
  },
  "whitearch-me": {
    "air-conditioning-services": `${WAM}/Untitled-design-2025-05-29T110231.080-600x400.jpg`,
    "hvac-services": `${WAM}/Untitled-design-2025-05-29T110246.876-600x400.jpg`,
    "ppm-amc": `${WAM}/Untitled-design-2025-05-29T110324.802-600x400.jpg`,
    "electrical-services": `${WAM}/Untitled-design-2025-05-29T110352.592-600x400.jpg`,
    "plumbing-drainage-services": `${WAM}/Untitled-design-2025-05-29T110408.835-600x400.jpg`,
    "fire-fighting-services": `${WAM}/Untitled-design-2025-05-29T110422.838-600x400.jpg`,
    "duct-cleaning": `${WAM}/Untitled-design-2025-05-29T110652.908-600x400.jpg`,
    "villa-maintenance": `${WAM}/Untitled-design-2025-05-29T110722.004-600x400.jpg`,
    "emergency-ac-repair": `${WAM}/Untitled-design-2025-05-29T110747.984-600x400.jpg`,
  },
  lemlemtechnicals: {
    "ac-maintenance": `${LEM}/AC-378x267.webp`,
    "coil-cleaning": `${LEM}/ac-duct-cleaning.jpg`,
    "duct-cleaning": `${LEM}/Duct-installation.jpg`,
    plumbing: `${LEM}/Plumbing-378x267.webp`,
    "handyman-servicing": `${LEM}/water-tank-cleaning-1-1-768x829-1-378x324.jpg`,
    "electrical-works": `${LEM}/ElectricalElectrical-378x267.webp`,
    "emergency-ac-repair": `${LEM}/2.jpg`,
  },
  primegroup: {
    "hvac-systems": `${PRM}/images/services/hvac-systems.jfif`,
    "mep-works": `${PRM}/images/services/ducting-works.png`,
    "facilities-management": `${PRM}/images/services/facade-cleaning.jfif`,
    "annual-maintenance-amc": `${PRM}/images/services/annual-maintenance.jfif`,
    "ac-servicing-repair": `${PRM}/images/services/ac-servicing.jfif`,
    "electrical-works": `${PRM}/images/services/electrical.jfif`,
    "duct-cleaning": `${PRM}/images/services/duct-cleaning.jfif`,
  },
  emccllc: {
    "electro-mechanical-contracting-mep": WIX(
      "f7133f9895b24525a2ad16c1e778c9fa.jpg",
      1920,
      1080
    ),
    "facilities-management": WIX("420080f6353b48f887f85fd5ffaadaf6.jpg", 1920, 1080),
    "foreign-company-representation-services": WIX(
      "048236_8b1359cb5f8c435f936fb721aae6d8b3~mv2_d_3209_2421_s_4_2.jpeg",
      1920,
      1080
    ),
    "trading-of-metal-alloys": WIX("d0712aab1f9249668c74c9812441546e.jpg", 1920, 1080),
    "trading-of-equipment": WIX("1d0c4e35695b480f9af53d15c404ea99.jpg", 1920, 1080),
    "trading-of-welding-products": WIX("34d3d94481d145e19d068133f1dbe772.jpg", 1920, 1080),
    "duct-cleaning": WIX("f7133f9895b24525a2ad16c1e778c9fa.jpg", 1920, 1080),
    "villa-maintenance": WIX("420080f6353b48f887f85fd5ffaadaf6.jpg", 1920, 1080),
    "emergency-ac-repair": WIX("2e0338287b2c4edaae950630b29be851.jpg", 1920, 1080),
  },
  specialairconditiongeneralmaintenance: {
    "ac-repair": `${SAC}/2026/02/Home-page-image-1.jpg`,
    "refrigerator-repair": `${SAC}/2022/02/Refrigerator-Maintenance-in-Abu-Dhabi.jpg`,
    "washing-machine-repair": `${SAC}/2022/05/washing-machine-repairing-in-chennai-500x500-1.png`,
    "kitchen-equipment-repair": `${SAC}/2022/02/Microwave-oven-3.jpg`,
    "electronics-equipment-repair": `${SAC}/2022/02/Water-Heater-3.jpg`,
    "home-improvement-repair": `${SAC}/2022/02/Tiles-2.jpg`,
    "duct-cleaning": `${SAC}/2022/07/WhatsApp-Image-2022-07-15-at-4.42.05-PM.jpeg`,
    "villa-maintenance": `${SAC}/2022/02/Artificial-Grass-1.jpg`,
  },
  newlife: {
    procurement: `${NLF}/hvac.jpg`,
    installation: `${NLF}/hvac.jpg`,
    "testing-and-commissioning": `${NLF}/hvac.jpg`,
    maintenance: `${NLF}/hvac.jpg`,
    "duct-cleaning": `${NLF}/hvac.jpg`,
    "emergency-ac-repair": `${NLF}/hvac.jpg`,
  },
  "air-co": {
    "ac-repair": `${ACO}/2025/06/Breathe-Fresh-New-1-1355x2048.webp`,
    "ac-maintenance": `${ACO}/2025/09/annual-maintence-contract.webp`,
    "ac-installation": `${ACO}/2025/09/about-airco.webp`,
    "ac-deep-cleaning": `${ACO}/2025/06/Breathe-Right-New-1-1355x2048.webp`,
    "duct-cleaning": `${ACO}/2025/09/air-co-enquiry.webp`,
    "emergency-ac-service": `${ACO}/2025/09/about-airco.webp`,
  },
  brightstargroup: {
    "ac-repairs": `${BST}/2025/04/1.png`,
    "new-installations": `${BST}/2025/04/2.png`,
    "industrial-hvac-solutions": `${BST}/2025/04/9.png`,
    "system-installation": `${BST}/2025/04/4.png`,
    "plant-room-ventilation": `${BST}/2025/04/6.png`,
    "custom-hvac-duct-aluminium-sheet-work": `${BST}/2026/01/hvac-duct-cladding-company-abu-dhabiUAE-1024x573.jpg`,
    "villa-maintenance": `${BST}/2025/04/11.png`,
  },
  emra: {
    "construction-management": `${EMR}/images/Services/MEP.png`,
    "building-construction": `${EMR}/images/Landing%20page/about-img.png`,
    "interior-design": `${EMR}/images/Services/interior.png`,
    maintenance: `${EMR}/images/Services/maintance.png`,
    "firefighting-equipment": `${EMR}/images/Services/fire.png`,
    "air-conditioning": `${EMR}/images/Services/ac.png`,
    "duct-cleaning": `${EMR}/images/Services/smoke.png`,
    "emergency-ac-repair": `${EMR}/images/Services/ac.png`,
  },
  lark: {
    "construction-services": `${LRK}/2025/05/Luxury-Villa-D-Main.webp`,
    "renovation-services": `${LRK}/2025/05/Matar-Main.png`,
    "mep-installations-services": `${LRK}/2025/05/project-management-1.webp`,
    "interior-design-and-fit-out": `${LRK}/2025/05/Interior-Design-and-Fit-out-1.webp`,
    "duct-cleaning": `${LRK}/2025/05/slide1-26.webp`,
    "villa-maintenance": `${LRK}/2025/05/Luxury-Villa-A-03.webp`,
    "emergency-ac-repair": `${LRK}/2025/05/Fares-Main.webp`,
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
  // ── Abu Dhabi demos (project galleries, verified 200) ──
  aiofm: [
    `${AIO}/08/1e/081e899e-d49a-4a83-a120-2835d30097ef.jpeg`,
    `${AIO}/99/b3/99b3791a-3c2a-407a-95d1-100a036eb291.jpg`,
    `${AIO}/cf/fc/cffcc313-363d-4455-a8f7-0da7511cf289.jpg`,
    `${AIO}/50/5e/505e1335-95ed-467b-a21a-4e6cb75bc3ab.jpg`,
    `${AIO}/99/b3/99b3791a-3c2a-407a-95d1-100a036eb291.jpg`,
    `${AIO}/cf/fc/cffcc313-363d-4455-a8f7-0da7511cf289.jpg`,
  ],
  airotechacgm: [
    `${AIRO}/air3.jpg`,
    `${AIRO}/air4.jpg`,
    `${AIRO}/workers.jpg`,
    `${AIRO}/banner1.png`,
    `${AIRO}/banner23.png`,
    `${AIRO}/machine.jpg`,
  ],
  endeavor: [
    `${ENDV}/HVAC-1.jpg`,
    `${ENDV}/HVAC-2.jpg`,
    `${ENDV}/HVAC-3.jpg`,
    `${ENDV}/HVAC-1.jpg`,
    `${ENDV}/HVAC-2.jpg`,
    `${ENDV}/HVAC-3.jpg`,
  ],
  noqtatalnada: [
    `${NQT}/2025/09/Yas-Mosque-04.webp`,
    `${NQT}/2025/09/Villa-F-01.webp`,
    `${NQT}/2025/09/Al-Ain-Hospital-Renovation-01.webp`,
    `${NQT}/2025/09/Villa-H-01.webp`,
    `${NQT}/2023/12/Fairmont-Hotel-02.webp`,
    `${NQT}/2023/12/Zayed-Medical-Center-01.png`,
  ],
  camberme: [
    `${CMB}/2025/04/Group-120.png`,
    `${CMB}/2025/04/Group-169.png`,
    `${CMB}/2025/04/Group-248.png`,
    `${CMB}/2025/04/Group-253.png`,
    `${CMB}/2025/04/Group-121.png`,
    `${CMB}/2025/04/Group-250.png`,
  ],
  newwaygroupcompanies: [
    `${NWY}/home/sliders/bg_2.jpg`,
    `${NWY}/home/services/hvac.jpg`,
    `${NWY}/home/services/civil.jpg`,
    `${NWY}/home/services/interior.jpg`,
    `${NWY}/home/sliders/bg_3.jpg`,
    `${NWY}/home/services/electrical.jpg`,
  ],
  gbfm: [
    `${GBF}/6ea060c0-e0ae-431f-9500-88c6e6040bf4.jpg`,
    `${GBF}/Gemini_Generated_Image_csganjcsganjcsga.png`,
    `${GBF}/Gemini_Generated_Image_qp76psqp76psqp76.png`,
    `${GBF}/Gemini_Generated_Image_de89cqde89cqde89.png`,
    `${GBF}/Gemini_Generated_Image_4fr7rb4fr7rb4fr7.png`,
    `${GBF}/WhatsApp-Image-2026-06-08-at-4.41.43-PM.jpeg`,
  ],
  dhabicontracting: [
    `${DHB}/2024/07/absolutvision_wyd_pkca1by_unsplash_1.webp`,
    `${DHB}/2024/08/5.png`,
    `${DHB}/2024/08/6.png`,
    `${DHB}/2024/08/2.png`,
    `${DHB}/2024/08/4.png`,
    `${DHB}/2024/08/3.png`,
  ],
  thehealthyhomeme: [
    `https://thehealthyhome.me/new-home/assets/images/background2.webp`,
    `https://thehealthyhome.me/img/02615937-6722-43e8-8b9c-f75e286514df/prototype-png.png?fm=webp&q=100&fit=max&crop=1488,1472,0,0&w=1488`,
    `https://thehealthyhome.me/new-home/assets/images/background2.webp`,
    `https://thehealthyhome.me/img/02615937-6722-43e8-8b9c-f75e286514df/prototype-png.png?fm=webp&q=100&fit=max&crop=1488,1472,0,0&w=1488`,
    `https://thehealthyhome.me/new-home/assets/images/background2.webp`,
    `https://thehealthyhome.me/img/02615937-6722-43e8-8b9c-f75e286514df/prototype-png.png?fm=webp&q=100&fit=max&crop=1488,1472,0,0&w=1488`,
  ],
  "whitearch-me": [
    `${WAM}/Untitled-design-2025-05-06T150707.212.jpg`,
    `${WAM}/Untitled-design-2025-05-06T151418.585.jpg`,
    `${WAM}/Untitled-design-2025-05-06T151858.735.jpg`,
    `${WAM}/Untitled-design-2025-05-06T151952.543.jpg`,
    `${WAM}/Untitled-design-2025-05-08T121620.374.jpg`,
    `${WAM}/Untitled-design-2025-05-08T115645.999.jpg`,
  ],
  lemlemtechnicals: [
    `${LEM}/3.jpg`,
    `${LEM}/4.jpg`,
    `${LEM}/6.jpg`,
    `${LEM}/7.jpg`,
    `${LEM}/8.jpg`,
    `${LEM}/Duct-installation.jpg`,
  ],
  primegroup: [
    `${PRM}/images/gallery-1.jpg`,
    `${PRM}/images/gallery-2.jpg`,
    `${PRM}/images/gallery-3.jpg`,
    `${PRM}/images/gallery-4.jpg`,
    `${PRM}/images/gallery-5.jpg`,
    `${PRM}/images/services/water-tank-cleaning.jfif`,
  ],
  emccllc: [
    WIX("048236_8b1359cb5f8c435f936fb721aae6d8b3~mv2_d_3209_2421_s_4_2.jpeg", 1280, 960),
    WIX("1d0c4e35695b480f9af53d15c404ea99.jpg", 1280, 960),
    WIX("420080f6353b48f887f85fd5ffaadaf6.jpg", 1280, 960),
    WIX("6a401562b21040bd8d76faeff9042212.jpg", 1280, 960),
    WIX("34d3d94481d145e19d068133f1dbe772.jpg", 1280, 960),
    WIX("2e0338287b2c4edaae950630b29be851.jpg", 1280, 960),
  ],
  specialairconditiongeneralmaintenance: [
    `${SAC}/2026/02/Home-Page-image-2.jpg`,
    `${SAC}/2024/10/ac-maintenance.png`,
    `${SAC}/2024/08/air-conditioner.jpg`,
    `${SAC}/2022/02/Garden-Lighting-3.jpg`,
    `${SAC}/2022/02/Tiles-2.jpg`,
    `${SAC}/2022/02/Artificial-Grass-1.jpg`,
  ],
  newlife: [
    `${NLF}/hvac.jpg`,
    `${NLF}/hvac.jpg`,
    `${NLF}/hvac.jpg`,
    `${NLF}/hvac.jpg`,
    `${NLF}/hvac.jpg`,
    `${NLF}/hvac.jpg`,
  ],
  "air-co": [
    `${ACO}/2025/09/annual-maintence-contract.webp`,
    `${ACO}/2025/09/air-co-enquiry.webp`,
    `${ACO}/2025/06/Breathe-Fresh-New-1-1355x2048.webp`,
    `${ACO}/2025/06/Breathe-Right-New-1-1355x2048.webp`,
    `${ACO}/2025/09/about-airco.webp`,
    `${ACO}/2025/09/annual-maintence-contract.webp`,
  ],
  brightstargroup: [
    `${BST}/2025/04/4.png`,
    `${BST}/2025/04/11.png`,
    `${BST}/2025/04/13.png`,
    `${BST}/2025/04/9.png`,
    `${BST}/2025/04/6.png`,
    `${BST}/2025/04/1.png`,
  ],
  emra: [
    `${EMR}/images/Services/smoke.png`,
    `${EMR}/images/Services/interior.png`,
    `${EMR}/images/Landing%20page/about-img.png`,
    `${EMR}/images/Services/ac.png`,
    `${EMR}/images/Services/maintance.png`,
    `${EMR}/images/Services/MEP.png`,
  ],
  lark: [
    `${LRK}/2025/05/Luxury-Villa-A-02.webp`,
    `${LRK}/2025/05/Luxury-Villa-C-Main.webp`,
    `${LRK}/2025/05/YAS.webp`,
    `${LRK}/2025/05/Matar-Main.png`,
    `${LRK}/2025/05/Fares-Main.webp`,
    `${LRK}/2025/05/Interior-Design-and-Fit-out-1.webp`,
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