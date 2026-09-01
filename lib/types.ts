export type ServiceSection =
  | "hero"
  | "overview"
  | "specifications"
  | "applications"
  | "process"
  | "trust"
  | "cta";

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  summary: string;
  capacity: string;
  series: string[];
  standards: string[];
  applications: string[];
  features: string[];
  image: string;
  svg?: string;
  sectionOrder: ServiceSection[];
  featured?: boolean;
};

export type ContactData = {
  email: string;
  address: string;
  phone?: string;
  tollFree?: string;
};

export type SocialProof = {
  googleRating: number;
  reviewCount: number;
  keywords: string[];
};

export type ProjectAsset = {
  name: string;
  location: string;
  img: string;
};

export type Branding = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tintColor: string;
};

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type ProspectConfig = {
  slug: string;
  companyName: string;
  displayName: string;
  industry: string;
  established: number;
  location: string;
  slogan: string;
  metaRole?: string;
  voice?: DeepPartial<VoiceCopy>;
  hero: {
    kicker: string;
    headlineTop: string;
    headlineAccent: string;
    headlineBottom: string;
    subline: string;
  };
  branding: Branding;
  contact: ContactData;
  socialProof: SocialProof;
  certifications: string[];
  markets: string[];
  facilities: string[];
  images: Record<string, string>;
  projects: ProjectAsset[];
  services: Service[];
  featuredServiceSlug: string;
  designDirection: DesignDirection;
  automation: string[];
  cta: {
    heading: string;
    body: string;
  };
};

export type DesignDirection = {
  theme: "light-technical" | "dark-technical" | string;
  navbar: string;
  hero: string;
  serviceLayout: string;
  trustLayout: string;
  processLayout: string;
  ctaLayout: string;
  imageTreatment: string;
  animationLevel: "low" | "medium" | "high";
  useSvgScenes: boolean;
};

export type CapabilityPoint = {
  icon: "factory" | "rnd" | "award" | "shield" | "handshake" | "users" | "wrench";
  text: string;
};

export type CapabilityStat = { value: string; label: string };

export type ProcessStep = { step: string; title: string; body: string };

export type RegionGroup = { title: string; items: string[] };

export type AssistantAction = { id: string; label: string; reply: string };

export type VoiceCopy = {
  brand: { initial: string; line1: string; line2: string };
  nav: {
    productsLabel: string;
    servicesAllLabel: string;
    projectsLabel: string;
    companyLabel: string;
    contactLabel: string;
    quoteLabel: string;
    homeBack: string;
  };
  hero: {
    primaryCta: string;
    secondaryCta: string;
    heroImageAlt: string;
    ghostText: string;
    stats: { value: string; label: string }[];
    contactCardLabel: string;
    chipsHeading: string;
    scrollCue: string;
  };
  trustLines: string[];
  servicesKicker: string;
  servicesHomeHeading: string;
  servicesHomeBlurb: string;
  servicesIndexHeading: string;
  servicesIndexBlurb: string;
  servicesIndexMetaTitle: string;
  servicesIndexMetaDescription: string;
  capability: {
    kicker: string;
    headline: string;
    body: string;
    points: CapabilityPoint[];
    stats: CapabilityStat[];
    showSvg: boolean;
    svg: string;
    mediaImageKey: string;
    ctaLabel: string;
    bandImageKey: string;
    bandKicker: string;
    bandHeadline: string;
    bandBody: string;
  };
  process: {
    kicker: string;
    headline: string;
    body: string;
    steps: ProcessStep[];
  };
  regions: {
    kicker: string;
    headline: string;
    body: string;
    groups: RegionGroup[];
  };
  projectsIntro: { kicker: string; headline: string; body: string; footer: string };
  serviceDetail: {
    overviewHeadingPrefix: string;
    figureCaptionSuffix: string;
    badge: string;
    footnote: string;
    specsHeading: string;
    applicationsKicker: string;
    applicationsHeading: string;
  };
  ctaFeatures: { iconKey: "mouse" | "chart" | "chat" | "bell"; title: string; body: string }[];
  footer: { blurb: string };
  assistant: {
    name: string;
    greeting: string;
    placeholder: string;
    fallbackEmail: string;
    actions: AssistantAction[];
    leadTitle: string;
    leadBody: string;
    routed: string;
    followUp: string;
  };
  formNote: string;
};