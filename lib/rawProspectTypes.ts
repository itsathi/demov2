export type RawCompanyLocation = {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  coordinates?: {
    latitude?: number | null;
    longitude?: number | null;
  } | null;
};

export type RawCompanyBranding = {
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  tintColor?: string | null;
  logoUrl?: string | null;
};

export type RawCompanyContact = {
  phone?: string | null;
  rawPhone?: string | null;
  email?: string | null;
  website?: string | null;
  domain?: string | null;
};

export type RawCompanySocialProof = {
  googleRating?: number | null;
  reviewCount?: number | null;
  topKeywords?: string[] | null;
  socialLinks?: Record<string, string> | null;
};

export type RawDecisionMaker = {
  name?: string | null;
  title?: string | null;
  email?: string | null;
  linkedin?: string | null;
};

export type RawCompany = {
  id?: string | null;
  name: string;
  industry?: string | null;
  category?: string | null;
  businessSize?: string | null;
  businessMaturity?: string | null;
  established?: number | string | null;
  location?: RawCompanyLocation | null;
  branding?: RawCompanyBranding | null;
  contact?: RawCompanyContact | null;
  socialProof?: RawCompanySocialProof | null;
  decisionMakers?: RawDecisionMaker[] | null;
};

export type RawWebsiteDetails = {
  title?: string | null;
  description?: string | null;
  type?: string | null;
  technologies?: string[] | null;
};

export type RawAuditAnalysis = {
  painPoints?: string[] | null;
  websiteProblems?: string[] | null;
  thinemOpportunities?: string[] | null;
  growthOpportunities?: string[] | null;
};

export type RawAuditScoring = {
  leadQuality?: string | null;
  fit?: string | null;
  estimatedDealSize?: string | null;
  estimatedTimeline?: string | null;
};

export type RawAudit = {
  sourceQuery?: string | null;
  provider?: string | null;
  crawlStatus?: string | null;
  researchStatus?: string | null;
  websiteDetails?: RawWebsiteDetails | null;
  summary?: string | null;
  personalizationHook?: string | null;
  analysis?: RawAuditAnalysis | null;
  scoring?: RawAuditScoring | null;
};

export type RawProspectData = {
  company: RawCompany;
  audit?: RawAudit | null;
};
