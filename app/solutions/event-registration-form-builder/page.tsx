import type { Metadata } from "next";
import {
  Sliders,
  FileText,
  ClipboardList,
  CheckCircle2,
  Lock,
  Upload,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Form Builder — Custom Questions & Approvals | UrPass",
  description:
    "Build high-converting event registration forms. Add custom fields, attendee screening, conditional questions, document uploads, and automated seat limits without coding.",
  keywords: [
    "event registration form builder",
    "custom event registration form",
    "event signup form builder",
    "google forms alternative for events",
    "event application form with approvals",
    "registration form with ticket limit",
  ],
  alternates: {
    canonical: "https://urpass.space/solutions/event-registration-form-builder",
  },
  openGraph: {
    title: "Event Registration Form Builder — Custom Questions & Approvals | UrPass",
    description:
      "Create high-converting, mobile-friendly event registration forms in minutes. Dynamic fields, capacity controls, screening queues, and automatic QR pass generation.",
    url: "https://urpass.space/solutions/event-registration-form-builder",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Registration Form Builder | UrPass",
    description:
      "Build custom registration forms with automated approvals, ticket capacity caps, and instant QR passes.",
  },
};

export default function EventRegistrationFormBuilderSolutionPage() {
  return (
    <SEOPage
      config={{
        badge: "CORE SOLUTION // FORM BUILDER",
        h1: "Event Registration Form Builder with Approvals & Capacity Controls",
        canonicalUrl: "https://urpass.space/solutions/event-registration-form-builder",
        description:
          "Design custom registration forms that capture exactly what your event needs. Collect attendee details, enforce automated seat limits, screen applicants, and issue scannable QR passes.",
        ctaLabel: "Build Free Registration Form",
        ctaHref: "/signup",
        secondaryCtaLabel: "Compare with Google Forms",
        secondaryCtaHref: "/compare/google-forms-vs-event-registration",

        // GEO Direct Answer
        directAnswer: {
          title: "What is an Event Registration Form Builder?",
          summary:
            "An event registration form builder is specialized software for constructing attendee signup questionnaires. UrPass enables organizers to configure forms with short answers, dropdown selections, company affiliations, dietary preferences, and document uploads. Crucially, UrPass links form responses directly to automatic ticket tier capacity limits, organizer approval screening queues, and cryptographic QR pass generation—capabilities missing from generic survey tools like Google Forms.",
          keyPoints: [
            "Collect custom data: text fields, multiple-choice dropdowns, checkboxes, and file uploads",
            "Automatic capacity enforcement: prevents overbooking by closing tiers when limits are met",
            "Screening & vetting workflows: review applications before issuing entry passes",
            "Automated pass generation: converts approved submissions into dynamic QR tickets immediately",
            "Mobile-responsive guest experience: attendees complete signups on smartphones in under 45 seconds",
          ],
        },

        whatIs: {
          title: "Why Generic Forms Fail for Event Registrations",
          definition:
            "While Google Forms and Typeform are adequate for simple surveys, they lack essential event logistics features. Generic forms cannot enforce seat capacities in real time (often causing embarrassing overbooking), cannot process payments with zero fees, and cannot generate cryptographic QR passes or connect to an entrance scanner.",
          details: [
            "Stops the manual nightmare of copying data from Google Sheets into ticket generation tools",
            "Prevents duplicate submissions and verifies email addresses automatically",
            "Keeps your registration experience professional and on-brand with custom colors and banners",
          ],
        },

        keyFactsTable: {
          title: "UrPass Form Builder vs. Google Forms vs. Typeform",
          subtitle: "Why event organizers choose dedicated registration form builders.",
          headers: ["Form Capability", "UrPass Event Form Builder", "Google Forms", "Typeform"],
          rows: [
            {
              col1: "Automatic Capacity Limit",
              col2: "Yes (locks out when capacity is reached)",
              col3: "No (must be manually turned off)",
              col4: "Requires complex third-party webhooks",
            },
            {
              col1: "Digital QR Pass Generation",
              col2: "Built-in automatic issuance (<3s)",
              col3: "None (requires paid third-party add-on)",
              col4: "None (requires Zapier integrations)",
            },
            {
              col1: "Gate Scanner Integration",
              col2: "Instant phone camera check-in (<0.3s)",
              col3: "None (must print paper spreadsheet)",
              col4: "None (requires custom development)",
            },
            {
              col1: "Attendee Approval Queues",
              col2: "Native 1-click Approve/Decline dashboard",
              col3: "Manual row coloring in Google Sheets",
              col4: "None (all submissions are accepted)",
            },
            {
              col1: "Duplicate Email Prevention",
              col2: "Atomic deduplication locks",
              col3: "Frequent duplicate submissions",
              col4: "Requires custom logic",
            },
          ],
        },

        featuresTitle: "Everything You Need to Collect Attendee Data Seamlessly",
        featuresSubtitle: "Flexible form controls built specifically for event logistics.",
        features: [
          {
            icon: Sliders,
            title: "Custom Field Customization",
            desc: "Add custom questions: dietary requirements, T-shirt sizes, company designations, LinkedIn profiles, or emergency contacts.",
          },
          {
            icon: Lock,
            title: "Seat & Ticket Capacity Limits",
            desc: "Set max seats per ticket type (e.g. 50 VIPs, 200 General, 30 Workshop seats). Once full, the tier automatically locks to prevent overbooking.",
          },
          {
            icon: ShieldCheck,
            title: "Application Screening Workflow",
            desc: "Require organizer approval before issuing passes. Review candidate portfolios, student IDs, or executive credentials from a unified queue.",
          },
          {
            icon: Upload,
            title: "Secure Document Uploads",
            desc: "Collect college ID cards, pitch decks, resumes, or vaccination records securely without cluttering your personal inbox.",
          },
          {
            icon: Zap,
            title: "Instant Pass Dispatch",
            desc: "Upon submission (or approval), the system instantly generates and delivers a personalized digital QR pass to WhatsApp and email.",
          },
          {
            icon: Layers,
            title: "Multi-Tier Forms",
            desc: "Display different questions based on the attendee's selected category (e.g. Students see university fields; Corporate delegates see company fields).",
          },
        ],

        howItWorksTitle: "How to Build an Event Form with UrPass",
        howItWorksSubtitle: "Launch your registration form in four quick steps.",
        steps: [
          { n: "01", title: "Add Your Questions", desc: "Select required fields: text inputs, dropdown menus, radio buttons, and document upload slots." },
          { n: "02", title: "Set Capacity & Pricing", desc: "Define how many attendees can register and configure free or paid ticket tiers." },
          { n: "03", title: "Choose Approval Policy", desc: "Enable 'Auto-Issue' for instant pass generation or 'Manual Screening' for curated events." },
          { n: "04", title: "Publish & Collect Data", desc: "Share your dedicated registration link and watch confirmed attendee records sync in real time." },
        ],

        deepDiveSections: [
          {
            badge: "DATA INTEGRITY",
            title: "How Capacity Caps and Deduplication Prevent Registration Disasters",
            paragraphs: [
              "One of the worst situations an event organizer can face is having 350 people show up for an auditorium that only seats 250. When using standard web forms like Google Forms, organizers have no native way to shut off registration at 250 submissions, leading to embarrassing venue overcapacity.",
              "UrPass resolves this with atomic database transactions. As soon as the 250th attendee completes registration, the slot is locked and the public page immediately switches to 'Capacity Reached'. Furthermore, UrPass blocks duplicate submissions using unique email and phone constraints, ensuring your attendee count represents real, unique human beings.",
            ],
            bullets: [
              "Real-time countdown indicators build healthy urgency for prospective registrants",
              "Deduplication constraints prevent accidental or fraudulent double registrations",
              "Export verified, clean data without spending hours deduplicating spreadsheets",
            ],
            takeaway: "Automated capacity capping guarantees you never overbook your venue.",
          },
        ],

        whoShouldUse: {
          title: "Ideal for Events Requiring Vetting & Custom Questions",
          subtitle: "Designed for organizers who need structured attendee information.",
          personas: [
            {
              title: "Hackathons & Startup Pitch Days",
              desc: "Collect team member rosters, GitHub profiles, pitch decks, and manage application review queues.",
              badge: "Tech",
            },
            {
              title: "Academic Symposiums & Seminars",
              desc: "Gather research paper submissions, institutional affiliations, and student ID verification.",
              badge: "Academia",
            },
            {
              title: "Corporate Recruitment Drives",
              desc: "Collect candidate resumes, graduation years, and schedule-specific interview slots.",
              badge: "Corporate HR",
            },
            {
              title: "Private Dinners & Executive Roundtables",
              desc: "Screen VIP delegates and capture specialized dietary requirements and transportation needs.",
              badge: "VIP Events",
            },
          ],
        },

        faqs: [
          {
            q: "Can I make certain questions mandatory?",
            a: "Yes. You can mark any question as mandatory or optional. The form will not submit until all required fields are validated.",
          },
          {
            q: "Can I collect file uploads like resumes or ID cards?",
            a: "Yes. UrPass supports secure file uploads (PDF, PNG, JPG). Uploaded files are stored securely and accessible directly from your organizer attendee table.",
          },
          {
            q: "What does the attendee see after submitting the form?",
            a: "If auto-issue is enabled, attendees immediately see their confirmation and digital QR pass on the screen. If manual approval is required, they see a message stating their registration is pending review.",
          },
          {
            q: "Can I change form questions after registration has started?",
            a: "Yes. You can add, edit, or reorder questions at any time from your dashboard without breaking existing attendee submissions.",
          },
        ],

        relatedLinks: [
          { title: "Best Event Registration Software", href: "/solutions/event-registration-software", category: "Product" },
          { title: "Online Event Registration Platform", href: "/solutions/online-event-registration", category: "Product" },
          { title: "Google Forms vs Event Registration Software", href: "/compare/google-forms-vs-event-registration", category: "Comparison" },
          { title: "UrPass Pricing & Plans", href: "/pricing", category: "Product" },
        ],
      }}
    />
  );
}
