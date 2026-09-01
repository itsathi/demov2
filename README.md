# Automated Prospect Demo Generator

This engine automatically converts raw prospect audit JSON data (from lead generation / audit tools) into high-converting, Awwwards-grade interactive website demos.

---

## 🚀 How to Add Prospects / Batch Data

You never have to manually code individual demo pages or burn extra tokens from scratch.

### Method 1: Paste JSON into `lib/rawProspects.ts`
Simply open [`lib/rawProspects.ts`](file:///Users/atharva/Projects/demov2/demov2/lib/rawProspects.ts) and paste your prospect JSON (either a single object or an array of objects in `rawProspectsList`):

```ts
export const rawProspectsList: RawProspectData[] = [
  {
    company: {
      name: "Quality Living Building Maintenance – AC & Villa Maintenance Abu Dhabi",
      industry: "HVAC Services",
      location: { ... },
      branding: { primaryColor: "#0052FF", ... },
      socialProof: { ... }
    },
    audit: { ... }
  },
  // ... paste more prospects here
];
```

### Method 2: Share JSON in Chat
You can simply paste your raw JSON (or batch of JSONs) in the chat. The generator engine will instantly ingest them and make the demos live!

---

## ⚡ What Gets Automatically Generated for Each Prospect:

1. **Brand Identity & Theming**:
   - Primary, secondary, accent, and tint CSS variable colors dynamically applied throughout the demo.
   - Initials brand mark and typography.

2. **Tailored Hero Section**:
   - High-impact headline, subline, authority kicker with year established, location, and slogan.
   - Live UAE time indicator, responsive navbar, and primary/secondary CTA magnets.

3. **Complete Services & Solutions Range**:
   - Individual subpages at `/[slug]/services/[service-slug]`.
   - Technical capacity, series options, certified standards, applications grid, and features.
   - Dynamic icon matching based on service keywords (`duct-cleaning`, `maintenance`, `ac-installation`, `hvac-solutions`, `villa-maintenance`, etc.).

4. **Engineered Interactive Assistant (AI Chatbot)**:
   - Customized quick-actions tailored to the prospect's exact offerings (e.g. *"Book AC service"*, *"Duct cleaning quote"*, *"Emergency cooling repair"*, *"Annual AMC"*).
   - Real-time simulation of automated lead routing to CRM & dispatch.

5. **Showcase Portfolio & Process**:
   - Pinned horizontal scroll project rail featuring hyper-local installations in the prospect's real city/emirate.
   - 5-step transparent delivery process and municipal coverage areas.

6. **Interactive Enquiry Stream & Form**:
   - Lead qualification flow with real-time feedback and automatic CRM qualification trigger.

---

## 🔗 Viewing Demos

- **Hub Page**: [http://localhost:3000/](http://localhost:3000/) (Lists all available client concepts)
- **Direct Prospect Demo**: [http://localhost:3000/geo-group-global](http://localhost:3000/geo-group-global)
- **Services Index**: [http://localhost:3000/geo-group-global/services](http://localhost:3000/geo-group-global/services)
