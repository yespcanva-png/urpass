import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration with Custom Fields & Structured Attendee Data | UrPass",
  description: "Collect custom attendee data, dietary requirements, organization names, t-shirt sizes, and job titles with UrPass's flexible form builder.",
  keywords: [
    "event registration custom fields",
    "event registration custom fields online",
    "event registration custom fields platform",
    "event registration custom fields check in",
    "event registration custom fields qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-registration-with-custom-fields",
  },
  openGraph: {
    title: "Event Registration with Custom Fields & Structured Attendee Data | UrPass",
    description: "Collect custom attendee data, dietary requirements, organization names, t-shirt sizes, and job titles with UrPass's flexible form builder.",
    url: "https://urpass.space/event-registration-with-custom-fields",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CUSTOM FORMS & ATTENDEE DATA",
        h1: "Event Registration with Custom Attendee Fields & Data Collection",
        canonicalUrl: "https://urpass.space/event-registration-with-custom-fields",
        description: "Collect custom attendee data, dietary requirements, organization names, t-shirt sizes, and job titles with UrPass's flexible form builder.",
        ctaLabel: "Build Custom Forms Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "Explore Form Options",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "How do I add custom fields to an event registration form?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. With UrPass, you can easily add custom registration fields—including dropdowns, text inputs, radio selections, and dietary requirements—and link that data directly to attendee QR passes and real-time scanner views.",
          keyPoints: ["Add custom text fields, dropdown menus, radio buttons, and checkboxes in seconds","Collect job titles, dietary restrictions, t-shirt sizes, student IDs, and company names","Custom field data displays on volunteer scanner screens upon door check-in","One-click CSV/Excel export of all structured attendee data for badges and reporting"],
        },
        whatIs: {
          title: "What is Event Registration with Custom Fields?",
          definition: "Event registration with custom fields allows event organisers to collect specific attendee information beyond basic name and email, capturing critical logistical, academic, dietary, and professional data during checkout.",
          details: ["Customizes registration forms for specialized industries (tech, academic, corporate)","Displays critical information (e.g. 'Vegan Meals', 'VIP Access') to door staff during scan","Maintains clean, structured datasets without manual data cleaning","Exports seamlessly to CRM, badge printing, and event reporting tools"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Users,
            title: "Flexible Field Types",
            desc: "Choose from short text, long text, dropdowns, radio selectors, and checkboxes.",
          },
          {
            icon: CheckCircle2,
            title: "Required vs Optional Toggle",
            desc: "Enforce mandatory fields for essential information like dietary needs or student roll numbers.",
          },
          {
            icon: ScanLine,
            title: "Door Scanner Data Visibility",
            desc: "Display critical custom responses (e.g. T-Shirt Size: XL, Meal: Halal) on the scanner screen.",
          },
          {
            icon: Zap,
            title: "Tier-Specific Form Questions",
            desc: "Ask specific questions only to relevant ticket tiers (e.g. ask Student ID only for Student tier).",
          },
          {
            icon: BarChart3,
            title: "Clean CSV & Excel Exports",
            desc: "Export formatted attendee data with all custom field columns intact in one click.",
          },
          {
            icon: ShieldCheck,
            title: "Mobile-Optimized Form UX",
            desc: "Registration forms load fast on all mobile devices, maximizing attendee completion rates.",
          },
        ],
        deepDiveSections: [
          {
            badge: "DATA STRUCTURE ARCHITECTURE",
            title: "How UrPass Integrates Custom Field Data with Door Operations",
            paragraphs: ["In most basic form tools, attendee responses sit isolated in a spreadsheet. When the attendee arrives at the venue, desk staff have no easy way of knowing what t-shirt size to give them, what meal preference they selected, or whether they paid for a workshop add-on without searching rows.","UrPass tightly integrates registration data with the mobile check-in engine. When an attendee's QR pass is scanned at the entrance, the scanner screen instantly presents their key custom responses (e.g., 'T-Shirt: Large', 'Diet: Gluten-Free', 'Kit Bag: Included'). Staff can hand out materials instantly without asking repetitive questions."],
            bullets: ["Door volunteers see attendee meal choices and badge details directly on scanner screen","Eliminates manual clipboard lookups and confusion at distribution desks","100% GDPR and privacy-compliant data storage with encrypted attendee records","Seamless export to Excel, CSV, and badge printing software"],
            takeaway: "UrPass bridges the gap between online registration data collection and frictionless on-the-ground event operations.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Custom Field Capability","Generic Form Tools","UrPass Integrated Platform"],
          rows: [{"col1":"Field Customization","col2":"Basic text boxes","col3":"Full field suite (dropdowns, text, radio, required rules)"},{"col1":"Door Scanner Integration","col2":"None (data is disconnected from check-in)","col3":"Custom fields display live on mobile scanner screen"},{"col1":"Tier-Specific Questions","col2":"Requires complex branching logic","col3":"Native question assignment per ticket tier"},{"col1":"Pass Generation with Custom Data","col2":"Manual mail merge required","col3":"Automated QR pass embedding custom delegate details"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Hackathons & Coding Competitions","desc":"Collect GitHub handles, t-shirt sizes, dietary preferences, and team names.","badge":"HACKATHONS"},{"title":"Academic & Scientific Conferences","desc":"Capture institutional affiliations, paper titles, and academic credentials.","badge":"ACADEMIA"},{"title":"Corporate Trade Shows","desc":"Gather company revenue, procurement authority, and purchasing timelines.","badge":"B2B EXPOS"},{"title":"Catering & Gala Banquets","desc":"Record exact allergen information and meal seating preferences.","badge":"BANQUETS"}],
        },
        relatedLinks: [
        {
                "title": "QR Code Check-In System",
                "href": "/qr-code-check-in-system",
                "category": "Product"
        },
        {
                "title": "Multi-Gate Event Check-In",
                "href": "/multiple-gate-event-check-in",
                "category": "Product"
        },
        {
                "title": "Zero Commission Event Ticketing",
                "href": "/zero-commission-event-ticketing",
                "category": "Product"
        },
        {
                "title": "Event Pricing & Free Plan",
                "href": "/pricing",
                "category": "Product"
        },
        {
                "title": "URPASS Sitelinks Directory",
                "href": "/sitelinks",
                "category": "Guide"
        }
],
        faqs: [
          {
                    "q": "What types of custom fields can I add to my registration form?",
                    "a": "You can add text fields, multiline text areas, dropdown menus, radio option buttons, number inputs, and checkboxes to capture any attendee information."
          },
          {
                    "q": "Can I make certain custom fields mandatory?",
                    "a": "Yes. You can toggle any custom field as required or optional, ensuring essential questions are completed before submission."
          },
          {
                    "q": "Can door staff see custom field responses when scanning tickets?",
                    "a": "Yes. When a volunteer scans an attendee's QR code, custom responses (such as dietary needs or kit choices) appear directly on the mobile scanner screen."
          },
          {
                    "q": "Can I ask different questions for different ticket types?",
                    "a": "Yes. You can configure custom questions to apply to all attendees or only to specific ticket categories (e.g. VIP vs General)."
          },
          {
                    "q": "How do I export custom field responses after the event?",
                    "a": "You can export all registration responses with one click as a CSV or Excel file, containing dedicated columns for every custom field."
          },
          {
                    "q": "Is attendee data collected via custom fields secure?",
                    "a": "Yes. All data collected on UrPass is encrypted in transit and at rest, adhering strictly to global data protection standards."
          },
          {
                    "q": "Is there a limit on how many custom fields I can create?",
                    "a": "No. You can add as many custom questions as needed to satisfy your event's logistical and reporting requirements."
          }
],
        ctaTitle: "Event Registration with Custom Attendee Fields & Data Collection",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
