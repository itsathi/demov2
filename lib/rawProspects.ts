import type { RawProspectData } from "./rawProspectTypes";

/**
 * Raw Prospect Batch Data
 *
 * Whenever you want to create or update demos, simply paste the JSON objects
 * (single prospect or an entire array of prospects) into this list.
 * The system will automatically synthesize high-converting, fully customized
 * interactive concept demos with services pages, AI chatbot, and animations!
 */
export const rawProspectsList: RawProspectData[] = [
  {
    company: {
      id: "4b67028e-0a6e-4ffd-bc3d-be50f5080289",
      name: "Quality Living Building Maintenance – AC & Villa Maintenance Abu Dhabi",
      industry: "HVAC Services",
      category: "Air conditioning contractor",
      businessSize: "Small",
      businessMaturity: "Established",
      location: {
        address: "Market - Al Aswaq St - Khalifa City - Sector 32 - Abu Dhabi - United Arab Emirates",
        city: "Abu Dhabi",
        state: "Abu Dhabi",
        country: "United Arab Emirates",
        coordinates: {
          latitude: 24.4201736,
          longitude: 54.5662046,
        },
      },
      branding: {
        primaryColor: "#0052FF",
        secondaryColor: "#003DCC",
        logoUrl: null,
      },
      contact: {
        phone: "+971 (055) 355-6554",
        rawPhone: "+9710553556554",
        email: null,
        website: "https://qualitylivinguae.com/",
        domain: "qualitylivinguae.com",
      },
      socialProof: {
        googleRating: 5.0,
        reviewCount: 21,
        topKeywords: [
          "AC installation",
          "maintenance",
          "duct cleaning",
          "HVAC solutions",
        ],
        socialLinks: {},
      },
      decisionMakers: [],
    },
    audit: {
      sourceQuery: "HVAC/Home services companies United Arab Emirates",
      provider: "google_maps",
      crawlStatus: "COMPLETED",
      researchStatus: "COMPLETED",
      websiteDetails: {
        title: "Quality Living Reliable AC installation, maintenance, and duct cleaning services.",
        description: "Expert HVAC Solutions in the UAE",
        type: "Other",
        technologies: [],
      },
      summary:
        "Quality Living provides HVAC installation, maintenance, and duct cleaning services for villas and towers in the UAE. The site shows basic contact info and a free quote form but lacks detailed content, trust signals, and modern design.",
      personalizationHook: "I saw your expert HVAC solutions for UAE villas and towers highlighted on your homepage.",
      analysis: {
        painPoints: [
          "Low online visibility",
          "Limited lead capture effectiveness",
          "Difficulty differentiating from competitors",
          "Inability to scale customer engagement",
          "Lack of digital marketing efforts",
        ],
        websiteProblems: [
          "Duplicated content",
          "Basic design with limited branding",
          "Missing trust signals (testimonials, certifications)",
          "No blog or educational content",
          "No social media links",
        ],
        thinemOpportunities: [
          "Website Design",
          "SEO",
          "Google Ads",
          "Meta Ads",
          "Social Media Management",
        ],
        growthOpportunities: [
          "Expand service contracts",
          "Introduce smart HVAC/AI monitoring",
          "Improve local SEO",
          "Leverage social media for brand awareness",
          "Implement CRM for customer retention",
        ],
      },
      scoring: {
        leadQuality: "HIGH",
        fit: "Medium",
        estimatedDealSize: "₹25,000–₹50,000",
        estimatedTimeline: "1–2 Weeks",
      },
    },
  },
];
