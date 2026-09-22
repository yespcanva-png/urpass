import type { Metadata } from "next";
import { FormInput, Sliders, CheckSquare, ShieldCheck, Ticket, Users, Layers, Sparkles, ArrowRight } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Form Builder | URPASS",
  description: "Create event registration forms, collect attendee details and manage registrations from one dashboard.",
  keywords: [
    "event registration form builder",
    "event form builder",
    "event signup form builder",
    "custom registration form",
    "event application form",
    "online event form creator",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-form-builder" },
  openGraph: {
    title: "Event Registration Form Builder | URPASS",
    description: "Create event registration forms, collect attendee details and manage registrations from one dashboard.",
    url: "https://urpass.space/event-registration-form-builder",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "FORM BUILDER",
        h1: "Build Event Registration Forms in Minutes",
        canonicalUrl: "https://urpass.space/event-registration-form-builder",
        description: "Collect the attendee information your event needs and keep every registration organized in URPASS.",
        ctaLabel: "Build Registration Form",
        features: [
          { icon: FormInput, title: "Versatile Field Types", desc: "Add single-line text, multi-line notes, dropdown selectors, checkboxes, and number fields customized to your event's exact requirements." },
          { icon: Sliders, title: "Conditional Requirements", desc: "Mark fields as mandatory or optional, set character limits, and validate email addresses and phone numbers automatically." },
          { icon: Ticket, title: "Direct Ticket Category Linking", desc: "Attach custom questions to specific ticket tiers — ask for student ID on student passes or company name on corporate tickets." },
          { icon: ShieldCheck, title: "Spam & Duplicate Protection", desc: "Prevent duplicate submissions and bot spam with built-in submission verification and unique email enforcement." },
          { icon: Users, title: "Unified Attendee Records", desc: "Every form response is structured and mapped directly to the attendee's profile, digital pass, and entrance check-in status." },
          { icon: CheckSquare, title: "Instant CSV/Excel Export", desc: "Download full registrant datasets with all custom field answers in one click for sponsors, catering teams, or college records." },
        ],
        steps: [
          { n: "01", title: "Add Custom Fields", desc: "Define required questions, dropdown options, and participant details." },
          { n: "02", title: "Set Ticket Limits", desc: "Configure capacities per ticket tier and toggle instant approval or manual review." },
          { n: "03", title: "Preview & Publish", desc: "Preview your responsive form across mobile and desktop screens before publishing." },
          { n: "04", title: "Collect Submissions", desc: "Share your clean, fast-loading form URL across social, chat, and email." },
          { n: "05", title: "Issue Digital Passes", desc: "Form submissions automatically generate scannable digital QR passes." },
        ],
        callout: {
          badge: "NO MORE FORM CHAOS",
          title: "Stop losing registration data between disjointed apps.",
          description: "When you build forms on generic survey tools, your registrant data is stranded in a disconnected spreadsheet. URPASS links your form directly to admission control, ticket tier quotas, and instant entrance scanning.",
          bullets: [
            "Frictionless mobile form interface with high completion rates",
            "Automatic digital pass dispatch upon submission or approval",
            "Zero coding or technical integration required to launch",
            "Direct synchronization with volunteer gate scanners on event day",
          ],
        },
        deepDiveSections: [
          {
            badge: "DATA COLLECTION STRATEGY",
            title: "Creating Registration Forms That Collect Exactly What You Need",
            paragraphs: [
              "Every event has unique operational data requirements. A university hackathon needs GitHub profile links, team names, and college identification numbers. A corporate summit requires company titles and dietary requirements. A medical conference requires license numbers and specialization tracks.",
              "Generic form builders force you to manage these responses in detached spreadsheets that cannot link back to ticket types or admission passes. When organizers attempt to connect forms to third-party QR generators, email deliverability breaks and records get out of sync.",
              "URPASS's form builder natively integrates data collection with credential generation. Every custom field you define is saved directly into the attendee's profile and appears on their digital record, ready for instant reference during check-in or post-event follow-up."
            ],
            bullets: [
              "Tailor registration questionnaires per ticket category or participant type",
              "Enforce clean data validation on student IDs, corporate emails, and phone numbers",
              "Maintain consistent branding with clean, responsive styling",
              "Eliminate the need for third-party zap or webhook connectors"
            ],
            takeaway: "Collect comprehensive attendee intelligence while maintaining a clean, single-screen signup experience that converts visitors into confirmed attendees."
          },
          {
            badge: "OPERATIONAL CONTINUITY",
            title: "Connecting Form Responses Directly to Entrance Check-In",
            paragraphs: [
              "The biggest flaw of standalone form builders is that they have zero awareness of venue doors. Gate staff on event day are left guessing which ticket tier an attendee purchased, whether their student ID was verified, or if they paid their registration fee.",
              "With URPASS, the moment an attendee submits your form and is approved, an encrypted QR pass is generated containing their complete record. When gate staff scan the pass, the mobile scanner displays the attendee's name, ticket tier, and key custom field answers right on the volunteer's screen.",
              "If a volunteer needs to verify an attendee's college affiliation or dietary badge, the information is immediately visible without opening external spreadsheets."
            ],
            bullets: [
              "Form answers appear directly in the volunteer scanner interface upon scan",
              "Enables badge categorization (e.g. VIP, Speaker, Delegate, Student)",
              "Prevents counterfeit credentials and unauthorized gate entries",
              "Enables immediate search and filtering by any custom question"
            ],
            takeaway: "Unifying your registration questionnaire with entrance check-in ensures that event staff always have the data they need to make rapid, informed gate decisions."
          }
        ],
        useCases: [
          "College Fest Multi-Event Registration",
          "Hackathon Team Application Forms",
          "Academic Conference Call for Papers",
          "Corporate Workshop Signups",
          "Exhibition Visitor Registration",
          "Sports Tournament Team Rosters",
          "Cultural Festival Audition Forms",
        ],
        relatedLinks: [
          { title: "Event Registration Platform", href: "/event-registration-platform", category: "Product" },
          { title: "Online Event Registration", href: "/online-event-registration", category: "Product" },
          { title: "Event Management Software", href: "/event-management-software", category: "Product" },
          { title: "Event Badge Generator", href: "/event-badge-generator", category: "Product" },
          { title: "Event Registration Form Guide", href: "/guides/what-information-should-event-registration-form-collect", category: "Guide" },
          { title: "Event Software Hyderabad", href: "/in/hyderabad", category: "Location" },
        ],
        faqs: [
          { q: "What is an event registration form builder?", a: "An event registration form builder is a tool that lets organizers design custom signup questionnaires, define attendee data fields, set ticket limits, and manage event admissions from one dashboard." },
          { q: "Can I collect custom fields like student ID or company name?", a: "Yes. You can add text fields, multiple-choice options, dropdowns, and checkboxes to collect any required attendee information." },
          { q: "Can different ticket tiers have different questions?", a: "Yes. You can configure custom questions for specific ticket types so delegates, students, and VIPs only answer questions relevant to their tier." },
          { q: "Do attendees need an account to fill out the form?", a: "No. Attendees access the form through a public link and can complete their registration in under 60 seconds without creating an account or downloading an app." },
          { q: "Can I export form responses to an Excel or CSV file?", a: "Yes. You can export the complete attendee database, including all custom field responses and submission timestamps, to CSV or Excel at any time." },
          { q: "Does the form builder support paid ticket registration?", a: "Yes. You can set prices in INR and collect registration fees via native Razorpay integration with UPI, cards, and net banking with zero platform commission." },
        ],
        ctaTitle: "Build your event registration form now",
        ctaDescription: "Set up in 5 minutes · Permanent free tier · 30-day free trial on paid plans",
      }}
    />
  );
}
