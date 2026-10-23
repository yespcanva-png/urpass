import type { Metadata } from "next";
import { Building2, CreditCard, FileSpreadsheet, Filter, ScanLine, Sliders } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Data Collection Bengaluru | UrPass",
  description: "Collect attendee details, custom registration answers and participation information for Bengaluru events with UrPass forms.",
  keywords: ["event registration data collection bengaluru","custom event intake forms bangalore","attendee survey questions bengaluru","b2b event custom fields bangalore","event attendee data capture"],
  alternates: {
    canonical: "https://urpass.space/bengaluru-event-registration-data-collection",
  },
  openGraph: {
    title: "Event Registration Data Collection Bengaluru | UrPass",
    description: "Collect attendee details, custom registration answers and participation information for Bengaluru events with UrPass forms.",
    url: "https://urpass.space/bengaluru-event-registration-data-collection",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Registration Data Collection Bengaluru | UrPass",
    description: "Collect attendee details, custom registration answers and participation information for Bengaluru events with UrPass forms.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BengaluruEventRegistrationDataCollectionPage() {
  return (
    <SEOPage
      config={{
        badge: "CUSTOM DATA COLLECTION & FORMS",
        h1: "Collect Custom Attendee Information for Bengaluru Events",
        canonicalUrl: "https://urpass.space/bengaluru-event-registration-data-collection",
        description: "Collect attendee details, custom registration answers and participation information for Bengaluru events with UrPass forms.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bengaluru-event-registration-data-collection",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Capture Exactly the Data You Need",
        ctaDescription: "Build dynamic intake forms with custom questions, conditional logic, file upload links, and corporate GSTIN fields. Keep 100% of your attendee data.",
        directAnswer: {
        "title": "How to Collect Custom Attendee Information for Bengaluru Events?",
        "summary": "Collecting custom attendee information for Bengaluru events requires flexible, mobile-optimized registration forms that capture business-critical data without hurting conversion rates. UrPass allows organizers to create custom fields (text, dropdowns, checkboxes, GSTIN, portfolio URLs), enforce required fields, and export structured responses to CSV with 0% ticket fees.",
        "keyPoints": [
                "Custom intake fields: company name, job title, GSTIN, dietary needs, and LinkedIn handles",
                "Tier-specific questionnaires: ask different questions to VIPs, Students, and General attendees",
                "100% data ownership: attendee information is completely private and never shared with advertisers",
                "Sub-0.3s gate check-in displays custom attendee details directly on volunteer scanner screens"
        ]
},
        whatIs: {
        "title": "Why Generic Forms Fail for Bengaluru Event Producers",
        "definition": "Generic ticketing aggregators offer rigid, one-size-fits-all forms that capture only basic names and emails. B2B summits, hackathons, and medical conclaves in Bangalore require deep delegate profiling.",
        "details": [
                "Capture corporate tax details: collect organization name and GSTIN for automated invoicing",
                "Technical qualification: capture GitHub profiles, programming languages, and startup funding stages",
                "Event logistics: gather T-shirt sizes, dietary preferences, and hotel shuttle requirements",
                "Clean, unmasked data exports ready for immediate integration into Salesforce, HubSpot, or Excel"
        ]
},
        keyFactsTable: {
        "title": "UrPass Custom Forms vs Generic Ticketing Forms",
        "subtitle": "Why Bengaluru event coordinators choose UrPass custom data collection.",
        "headers": [
                "Form Capability",
                "Generic Ticketing Aggregators",
                "UrPass Custom Intake Studio"
        ],
        "rows": [
                {
                        "col1": "Custom Field Types",
                        "col2": "Limited to basic text inputs or rigid default fields",
                        "col3": "Text, dropdowns, checkboxes, URLs, and GSTIN inputs"
                },
                {
                        "col1": "Tier-Specific Questions",
                        "col2": "Same questions asked to every attendee regardless of tier",
                        "col3": "Ask unique questions per ticket category (VIP vs Student)"
                },
                {
                        "col1": "Corporate Invoicing",
                        "col2": "Manual invoicing taking days of finance effort",
                        "col3": "Automated GST invoices generated upon payment"
                },
                {
                        "col1": "Attendee Data Privacy",
                        "col2": "Aggregator markets competitor events to your attendees",
                        "col3": "100% private attendee directory, strictly yours"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "B2B PROFILING",
                "title": "Bespoke Questionnaires for Enterprise and Developer Audiences",
                "paragraphs": [
                        "B2B conferences and technical hackathons in Bangalore cannot rely on simple name and email signups. Organizers need to know the attendee's company size, tech stack, purchasing authority, and dietary requirements to plan catering and sponsor reports.",
                        "UrPass provides drag-and-drop custom intake fields. Configure mandatory or optional questions, specify field validation (e.g. valid LinkedIn URL or 15-digit GSTIN), and view structured answers in your dashboard."
                ],
                "bullets": [
                        "Custom text fields, multi-select checkboxes, dropdowns, and URL inputs",
                        "Tier-specific questions: prompt VIPs for dietary needs while asking students for college IDs",
                        "Automated GSTIN validation ensures corporate invoicing data is error-free",
                        "Mobile-responsive form design maintains high registration conversion rates"
                ],
                "takeaway": "Custom intake forms gather essential event logistics and B2B profiling data."
        },
        {
                "badge": "SCANNER INTEGRATION",
                "title": "Display Custom Form Answers Directly on Scanner Screens",
                "paragraphs": [
                        "Capturing custom attendee data during registration is only useful if your event day team can access it when the attendee arrives at the venue.",
                        "UrPass surfaces custom form responses directly on the volunteer's scanner screen. When an attendee's QR pass is scanned, staff can immediately see their T-shirt size, banquet table number, or dietary choice (e.g. 'Vegan / Jain'), allowing personalized attendee hospitality."
                ],
                "bullets": [
                        "Scanner displays attendee name, company, ticket tier, and custom response highlights",
                        "Front desk volunteers can distribute correct merchandise sizes without asking",
                        "Banquet ushers guide guests to assigned table numbers shown on the scanner screen",
                        "Download complete CSV exports containing all custom answers with arrival timestamps"
                ],
                "takeaway": "Surfacing custom answers on scanner screens elevates on-site attendee hospitality."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Sliders,
            title: "Custom Form Builder",
            desc: "Add custom text fields, dropdown menus, checkboxes, and URL inputs to your registration page.",
          },
          {
            icon: Building2,
            title: "Corporate GSTIN Collection",
            desc: "Capture company name and GSTIN to generate automated corporate tax invoices upon payment.",
          },
          {
            icon: Filter,
            title: "Tier-Specific Questions",
            desc: "Ask different questions to VIPs, Students, and General attendees based on ticket tier.",
          },
          {
            icon: ScanLine,
            title: "On-Screen Scanner Display",
            desc: "View custom attendee responses (T-shirt size, table number) directly on the scanner screen.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Collect ticket payments directly into your Razorpay account with zero platform fees.",
          },
          {
            icon: FileSpreadsheet,
            title: "Structured CSV Exports",
            desc: "Export verified attendee lists with all custom responses and scan timestamps anytime.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Add Custom Questions",
                "desc": "Define intake questions (designation, GSTIN, dietary needs) in your event builder."
        },
        {
                "n": "02",
                "title": "Assign to Ticket Tiers",
                "desc": "Select which ticket categories require specific questions (e.g. VIP vs General)."
        },
        {
                "n": "03",
                "title": "Publish Registration Portal",
                "desc": "Share your high-converting, mobile-responsive page with prospective attendees."
        },
        {
                "n": "04",
                "title": "Scan at Venue Doors",
                "desc": "Volunteers scan passes in <0.3s; screen displays attendee details and custom answers."
        },
        {
                "n": "05",
                "title": "Export Structured Data",
                "desc": "Download complete attendee records with answers and timestamps for CRM sync."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass for Data Collection in Bengaluru?",
        "subtitle": "Event producers and marketing directors across Karnataka's enterprise scene.",
        "personas": [
                {
                        "badge": "B2B CONFERENCES",
                        "title": "Enterprise Summit Directors",
                        "desc": "Collect company names, job titles, and GSTIN numbers for corporate invoicing."
                },
                {
                        "badge": "HACKATHONS",
                        "title": "Developer Hackathon Leads",
                        "desc": "Capture GitHub URLs, team sizes, and dietary preferences for weekend coding events."
                },
                {
                        "badge": "EXPOS",
                        "title": "Trade Exhibition Managers",
                        "desc": "Profile trade visitors by purchasing budget, industry sector, and company size."
                },
                {
                        "badge": "TRAINING",
                        "title": "Professional Academies",
                        "desc": "Gather educational background and prerequisite skills before admitting students."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Custom Data Displays During Check-In",
        "subtitle": "Instant context on the scanner screen that improves attendee hospitality.",
        "description": "When an attendee presents their digital pass, the volunteer points their mobile camera at the QR code. UrPass verifies the credentials in under 300 milliseconds and displays the attendee's name, company, tier, and selected custom fields (e.g., T-shirt size: L, Table: 8) directly on the scanner screen.",
        "points": [
                "Displays real-time pass validity with attendee name, organization, and tier.",
                "Highlights key custom answers (merchandise size, table assignment) for event staff.",
                "Prevents duplicate entry attempts across multiple entrance gates automatically.",
                "Supports manual name and email lookup for fast backup check-in."
        ]
},
        faqs: [
        {
                "q": "What types of custom questions can I add to my UrPass registration form?",
                "a": "UrPass supports text inputs, multi-line text areas, dropdown select menus, checkboxes, URL inputs (e.g. LinkedIn, GitHub), and dedicated corporate GSTIN tax fields."
        },
        {
                "q": "Can I make some questions mandatory and others optional?",
                "a": "Yes. You can toggle the 'Required' setting on each question, ensuring attendees cannot complete checkout without providing essential information."
        },
        {
                "q": "Can I ask different questions for different ticket tiers?",
                "a": "Yes. You can assign custom questions to specific ticket tiers, allowing you to ask different questions to VIPs, Students, or General Admission attendees."
        },
        {
                "q": "Does gate staff see the custom question answers when scanning passes?",
                "a": "Yes. You can choose to highlight specific responses (like T-shirt size, banquet table number, or dietary choice) directly on the volunteer scanner screen upon check-in."
        },
        {
                "q": "What pricing applies to custom data collection on UrPass?",
                "a": "Unlimited custom fields and complete CSV data exports are included on all UrPass plans, starting from ₹499/month, with 0% platform ticket fees."
        }
],
      }}
    />
  );
}
