import type { Metadata } from "next";
import { FormInput, Sliders, CheckSquare, ShieldCheck, Ticket, Users, Layers, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Form Builder | URPASS",
  description: "Build custom event registration forms in minutes. Collect attendee details, add conditional fields, validate credentials, and auto-issue QR passes.",
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
    description: "Build custom event registration forms in minutes with instant QR pass issuance.",
    url: "https://urpass.space/event-registration-form-builder",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "CUSTOM FORM BUILDER",
        h1: "Build Custom Event Registration Forms",
        canonicalUrl: "https://urpass.space/event-registration-form-builder",
        description:
          "An event registration form builder allows organizers to design customized questionnaires, validate participant credentials, segment questions by ticket tier, and trigger automated QR pass issuance upon submission or payment. URPASS combines dynamic form creation with real-time entry scanning, eliminating disconnected spreadsheets.",
        ctaLabel: "Build Registration Form",
        features: [
          { icon: FormInput, title: "Versatile Field Types", desc: "Add single-line text, multi-line notes, dropdown selectors, checkboxes, file uploads, and number fields customized to your event." },
          { icon: Sliders, title: "Conditional Requirements", desc: "Mark fields as mandatory or optional, set character bounds, and validate email addresses, phone numbers, and IDs automatically." },
          { icon: Ticket, title: "Tier-Specific Questions", desc: "Attach specific questions to particular ticket categories — request student IDs on student passes or company names on corporate passes." },
          { icon: ShieldCheck, title: "Spam & Duplicate Protection", desc: "Prevent duplicate submissions and bot spam with built-in submission verification and unique email enforcement." },
          { icon: Users, title: "Unified Attendee Records", desc: "Every form response maps directly to the attendee's profile, digital pass, and entrance check-in history." },
          { icon: CheckSquare, title: "Instant CSV/Excel Export", desc: "Download full registrant datasets with all custom field answers in one click for sponsors, caterers, or college records." },
        ],
        steps: [
          { n: "01", title: "Add Custom Fields", desc: "Define required questions, dropdown options, and participant details in the visual builder." },
          { n: "02", title: "Set Ticket Limits", desc: "Configure capacities per ticket tier and toggle instant approval, manual review, or paid checkout." },
          { n: "03", title: "Preview & Publish", desc: "Preview your mobile-optimized form across devices before sharing the public URL." },
          { n: "04", title: "Collect Submissions", desc: "Share your clean, fast-loading form URL across social, chat, WhatsApp, and email." },
          { n: "05", title: "Auto-Issue QR Passes", desc: "Submissions immediately generate cryptographic digital QR passes sent to attendee inboxes." },
        ],
        callout: {
          badge: "NO MORE FORM CHAOS",
          title: "Stop losing registration data between disjointed apps.",
          description: "When you build forms on generic survey tools like Google Forms or Typeform, attendee data is stranded in a disconnected spreadsheet. URPASS links your form directly to admission control, ticket tier quotas, and instant entrance scanning.",
          bullets: [
            "Frictionless mobile form interface with industry-leading completion rates",
            "Automatic digital pass dispatch upon submission or payment confirmation",
            "Zero coding or technical integration required to launch in minutes",
            "Direct synchronization with volunteer gate scanners on event day",
          ],
        },
        deepDiveSections: [
          {
            badge: "FORM ARCHITECTURE",
            title: "How does an integrated event registration form builder differ from generic survey tools?",
            paragraphs: [
              "Generic survey tools (like Google Forms) simply capture rows of text into a spreadsheet. They cannot reserve ticket inventory, take payments with automatic reconciliation, enforce hard capacity limits, or generate scannable digital passes.",
              "URPASS's form builder is deeply connected to your event's gate operations. When an attendee submits your form, their data is instantly transformed into an authenticated digital pass linked to live gate scanners.",
            ],
            takeaway: "An integrated form builder eliminates manual data exporting, email drafting, and ticket mail merges.",
          },
          {
            badge: "TIER TARGETING",
            title: "How can organizers ask different questions for different ticket categories?",
            paragraphs: [
              "Different attendee segments have different informational requirements. For a tech conference, general attendees might only need to provide their name and t-shirt size, whereas hackathon participants must submit their GitHub profile and team name, and VIPs specify dietary requirements.",
              "URPASS lets you attach question blocks to specific ticket tiers. Attendees only see questions relevant to the pass they select, resulting in higher form completion rates and cleaner attendee data.",
            ],
            takeaway: "Contextual question targeting reduces attendee form fatigue and delivers cleaner data to event organizers.",
          },
        ],
        faqs: [
          {
            q: "Can I collect file attachments (e.g. resumes, student ID cards) in the form?",
            a: "Yes. Attendees can upload images and PDF documents directly through the registration form.",
          },
          {
            q: "Can I embed the registration form on my own custom website?",
            a: "Yes. You can share your dedicated URPASS event URL or embed the registration widget directly into Webflow, WordPress, or custom sites.",
          },
          {
            q: "Can I restrict registrations to specific corporate or university email domains?",
            a: "Yes. You can enforce email domain restrictions (e.g., '@college.edu' or '@company.com') to ensure only eligible participants register.",
          },
        ],
        relatedLinks: [
          { title: "Google Forms Event Alternative", href: "/google-forms-alternative-for-events", category: "Comparison" },
          { title: "Event Registration with Payment", href: "/event-registration-with-payment", category: "Product" },
          { title: "Event Attendee CSV Export", href: "/event-attendee-data-export", category: "Product" },
          { title: "Branded Event Tickets", href: "/branded-event-tickets", category: "Product" },
        ],
      }}
    />
  );
}
