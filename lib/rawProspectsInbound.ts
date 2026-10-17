import type { RawProspectData } from "./rawProspectTypes";

/**
 * Inbound prospect records supplied for demo generation.
 *
 * These are passed through the same industry dispatch as every other raw
 * prospect: each one is classified (real estate vs. default) and transformed
 * accordingly. Non-property businesses (facilities management, marketplaces)
 * deliberately keep the default generator — no real-estate demo is fabricated
 * for them.
 */
export const rawProspectsInboundList: RawProspectData[] = [
  {
    company: {
      id: "1d292eb6-6842-405d-9764-e08b10afde3a",
      name: "Asly Facilities Management",
      industry: "Facilities Management",
      category: "Property management company",
      businessSize: "Unknown",
      businessMaturity: "Established",
      location: {
        address: "Hyatt Regency - Al Corniche - Deira - Dubai - United Arab Emirates",
        city: null,
        state: "Dubai",
        country: "United Arab Emirates",
        coordinates: { latitude: 25.2789149, longitude: 55.3044559 },
      },
      branding: {
        primaryColor: "#0052FF",
        secondaryColor: "#003DCC",
        logoUrl: null,
      },
      contact: {
        phone: null,
        rawPhone: null,
        email: null,
        website: "http://www.aslyfm.com/",
        domain: "aslyfm.com",
      },
      socialProof: {
        googleRating: 4.8,
        reviewCount: 90,
        topKeywords: [
          "Facility Management",
          "Pest Control",
          "Cleaning Services",
          "Electrical & Plumbing",
          "Painting & Carpentry",
        ],
        socialLinks: {},
      },
      decisionMakers: [],
    },
    audit: {
      sourceQuery: "real estate companies UAE",
      provider: "google_maps",
      crawlStatus: "COMPLETED",
      researchStatus: "COMPLETED",
      websiteDetails: {
        title: "Asly FM - Integrated Facilities Management in UAE",
        description:
          "Integrated facilities management for commercial and residential properties across Dubai and the UAE, offering cleaning, licensed pest control, electrical & plumbing, painting & carpentry, and 24/7 operations with a focus on quality and customer care.",
        type: "Agency",
        technologies: [],
      },
      summary:
        "Asly FM delivers 24/7 integrated facilities management for commercial and residential properties, including cleaning, licensed pest control, electrical/plumbing, painting, and carpentry, emphasizing quality service and customer care.",
      personalizationHook:
        "Asly FM\u2019s 24/7 operations across Dubai and beyond\u2014let\u2019s elevate your service experience.",
      analysis: {
        painPoints: [
          "Need for reliable, cost\u2011effective facility management",
          "Requirement for licensed pest control solutions",
          "Demand for consistent cleaning standards",
          "Frequent handyman (electrical/plumbing) requests",
          "Desire for higher service quality across properties",
        ],
        websiteProblems: [
          "Minimal visual design and branding",
          "No visible contact information",
          "Limited navigation and menu structure",
          "Absence of client testimonials or social proof",
          "Lack of clear SEO optimization",
        ],
        thinemOpportunities: [
          "Website redesign & UI/UX improvement",
          "Branding & visual identity refresh",
          "CRM system implementation for client management",
          "Internal dashboards for operational tracking",
          "AI automation for service scheduling and lead handling",
        ],
        growthOpportunities: [
          "Introduce subscription\u2011based AMC contracts",
          "Launch a client portal for service requests",
          "Add green/sustainable cleaning options",
          "Develop a mobile app for scheduling",
          "Invest in digital marketing and SEO",
        ],
      },
      scoring: {
        leadQuality: "HIGH",
        fit: "Medium",
        estimatedDealSize: "\u20b950,000\u2013\u20b91,00,000",
        estimatedTimeline: "2\u20134 Weeks",
      },
    },
  },
  {
    company: {
      id: "20e077ab-ec25-4e9c-ad6d-407267838fd0",
      name: "Engel & V\u00f6lkers",
      industry: "Real Estate",
      category: null,
      businessSize: "Large",
      businessMaturity: "Established",
      location: {
        address: null,
        city: "Dubai",
        state: "Dubai",
        country: "United Arab Emirates",
        coordinates: { latitude: null, longitude: null },
      },
      branding: {
        primaryColor: "#0052FF",
        secondaryColor: "#003DCC",
        logoUrl: null,
      },
      contact: {
        phone: null,
        rawPhone: null,
        email: null,
        website: "https://www.engelvoelkers.com/ae/en/resources/top-10-real-estate-developers-in-dubai",
        domain: "engelvoelkers.com",
      },
      socialProof: {
        googleRating: null,
        reviewCount: null,
        topKeywords: [],
        socialLinks: {},
      },
      decisionMakers: [],
    },
    audit: {
      sourceQuery: "best real estate in Dubai UAE",
      provider: "google_search",
      crawlStatus: "COMPLETED",
      researchStatus: "COMPLETED",
      websiteDetails: {
        title: "Top 12 Real Estate Developers in Dubai (2026 Edition)",
        description:
          "Engel & V\u00f6lkers Discover the top real estate developers in Dubai for 2026. From luxury homes to smart investments, explore trusted names shaping the city.",
        type: "Agency",
        technologies: [],
      },
      summary:
        "Engel & V\u00f6lkers offers a 2026 ranking of Dubai\u2019s leading real\u2011estate developers, covering sales performance, build quality and market trends. The page serves buyers and investors seeking insight on top developers such as Emaar, DAMAC, Nakheel and emerging firms.",
      personalizationHook:
        "Your 2026 guide to Dubai\u2019s top developers highlights Azizi\u2019s sales and Emaar\u2019s market leadership.",
      analysis: {
        painPoints: [
          "Difficulty selecting the right developer among many options",
          "Uncertainty about build quality and long\u2011term value",
          "Reliance on sales volume as sole success metric",
          "Market saturation causing buyer confusion",
          "Need for trustworthy, data\u2011driven developer insights",
        ],
        websiteProblems: [
          "Disorganized page layout with duplicate navigation/close icons",
          "Missing direct contact details (email/phone) on the page",
          "Generic call\u2011to\u2011action lacking lead capture",
          "Outdated or incomplete 2026 data presentation",
          "No interactive tools or AI features to engage users",
        ],
        thinemOpportunities: [
          "SEO (to boost visibility of ranking page)",
          "AI Automation (for property recommendation engine)",
          "CRM Systems (to manage client relationships)",
          "Website Design (to refresh layout and navigation)",
          "Google Ads (to drive targeted traffic)",
        ],
        growthOpportunities: [
          "Interactive developer comparison chart",
          "In\u2011depth market analytics and forecast reports",
          "Lead generation form for investor inquiries",
          "Mobile\u2011optimized ranking page",
          "Personalized developer recommendation engine",
        ],
      },
      scoring: {
        leadQuality: "HIGH",
        fit: "Medium",
        estimatedDealSize: "\u20b950,000\u2013\u20b91,00,000",
        estimatedTimeline: "2\u20134 Weeks",
      },
    },
  },
  {
    company: {
      id: "a5bcc839-74c3-45d9-8524-7567fc6f2cc3",
      name: "Properties for Sale in Dubai - Buy Real Estate in Dubai",
      industry: "Real Estate",
      category: null,
      businessSize: "Unknown",
      businessMaturity: "Unknown",
      location: {
        address: null,
        city: "Dubai",
        state: "Dubai",
        country: "United Arab Emirates",
        coordinates: { latitude: null, longitude: null },
      },
      branding: {
        primaryColor: "#0052FF",
        secondaryColor: "#003DCC",
        logoUrl: null,
      },
      contact: {
        phone: null,
        rawPhone: null,
        email: null,
        website: "https://dubai.dubizzle.com/en/property-for-sale/residential/",
        domain: "dubai.dubizzle.com",
      },
      socialProof: {
        googleRating: null,
        reviewCount: null,
        topKeywords: ["Residential Property Sales"],
        socialLinks: {},
      },
      decisionMakers: [],
    },
    audit: {
      sourceQuery: "best real estate in Dubai UAE",
      provider: "google_search",
      crawlStatus: "COMPLETED",
      researchStatus: "COMPLETED",
      websiteDetails: {
        title: "Pardon Our Interruption",
        description: "",
        type: "Marketplace",
        technologies: [],
      },
      summary:
        "A Dubai-based residential property marketplace that displays listings for sale, currently inaccessible due to a bot detection page. The site lacks visible branding, contact information, and functional content, indicating limited online presence and user experience.",
      personalizationHook:
        "Your site currently shows a 'Pardon Our Interruption' page, which may be hindering visitor access.",
      analysis: {
        painPoints: [
          "User access hindered by interruption page",
          "Limited SEO/visibility",
          "Absence of lead generation tools",
          "Poor user experience and navigation",
          "Lack of digital marketing and brand credibility",
        ],
        websiteProblems: [
          "Page blocked by bot detection",
          "No visible business information",
          "Missing contact details",
          "Lacking branding and design",
          "No clear call-to-action or lead capture",
        ],
        thinemOpportunities: [
          "UI/UX Design",
          "AI Automation",
          "CRM Systems",
          "SEO",
          "Google Ads",
        ],
        growthOpportunities: [
          "Implement AI-powered property recommendations",
          "Enhance SEO and SEM campaigns",
          "Integrate CRM for lead management",
          "Redesign UI/UX for better navigation",
          "Leverage social media advertising for lead generation",
        ],
      },
      scoring: {
        leadQuality: "HIGH",
        fit: "Hard",
        estimatedDealSize: "\u20b950,000\u2013\u20b91,00,000",
        estimatedTimeline: "2\u20134 Weeks",
      },
    },
  },
];
