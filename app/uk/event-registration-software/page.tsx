import type { Metadata } from "next";
import {
  FileText,
  QrCode,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  Sliders,
  Mail,
  Zap,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software UK — Online Booking & Passes | URPASS",
  description:
    "UK event registration software for conferences, universities, workshops, and business events. Build branded registration forms, screen applicants, issue instant digital QR passes, and ensure UK GDPR compliance.",
  keywords: [
    "event registration software uk",
    "uk online event registration",
    "event registration platform uk",
    "conference registration software uk",
    "student registration software uk",
    "custom event registration form uk",
    "event registration system uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/event-registration-software",
    languages: {
      "en-GB": "https://urpass.space/uk/event-registration-software",
      "x-default": "https://urpass.space/event-registration-software",
    },
  },
  openGraph: {
    title: "Event Registration Software UK — Online Booking & Passes | URPASS",
    description:
      "Build branded registration forms, collect custom attendee details, approve guests, and issue digital QR passes across the United Kingdom. UK GDPR compliant.",
    url: "https://urpass.space/uk/event-registration-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkEventRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/event-registration-software",
        badge: "UK EVENT REGISTRATION · SEAMLESS ONLINE FORMS",
        h1: "Event Registration Software for UK Organisers",
        description:
          "Create beautiful, mobile-first event registration pages in minutes. Collect custom attendee data, run manual or automatic approval workflows, issue branded digital QR passes, and track check-ins seamlessly across the UK.",
        ctaLabel: "Build Your Event Page Free",

        directAnswer: {
          title: "How does URPASS streamline event registration in the UK?",
          summary:
            "URPASS is an event registration platform designed for UK universities, corporate organisers, and community hosts. It simplifies registration with clean, branded online forms that capture custom attendee data (such as dietary needs or Student IDs), manages approval workflows for restricted sessions, automatically delivers digital QR passes via email, and adheres strictly to the UK Data Protection Act 2018 and UK GDPR.",
          keyPoints: [
            "Branded registration pages with custom fields and capacity caps",
            "Automatic or manual approval workflows for attendee screening",
            "Instant digital QR passes delivered via email without app downloads",
            "Full UK GDPR compliance with explicit consent and data export controls",
          ],
        },

        keyFactsTable: {
          title: "UK Event Registration Capabilities",
          subtitle: "Comparison of URPASS registration workflows versus generic online form builders.",
          headers: ["Feature / Metric", "URPASS UK", "Generic Form Tools (Google Forms / Typeform)"],
          rows: [
            {
              col1: "Automated QR Pass Delivery",
              col2: "Instant dynamic QR pass generated and emailed upon registration",
              col3: "Requires third-party add-ons, Zapier connections, or manual emails",
            },
            {
              col1: "Entrance Gate Verification",
              col2: "Sub-second browser camera scanner validates passes in <0.3s",
              col3: "Manual spreadsheet check-off; slow and prone to errors",
            },
            {
              col1: "Duplicate Prevention",
              col2: "Real-time cloud check prevents reused tickets across multiple gates",
              col3: "No duplicate detection; anyone can forward a confirmation email",
            },
            {
              col1: "Registration Capacity Caps",
              col2: "Automated ticket tier limits and sold-out notifications",
              col3: "Manual form closure or complex scripting required",
            },
            {
              col1: "UK GDPR & Privacy Architecture",
              col2: "Dedicated attendee privacy management, consent tracking, Article 17 deletion",
              col3: "Data stored in general cloud drives with limited audit controls",
            },
          ],
        },

        features: [
          {
            icon: FileText,
            title: "Custom Form Builder",
            desc: "Collect exact attendee details including job titles, student IDs, dietary restrictions, session preferences, and accessibility requirements.",
          },
          {
            icon: Sliders,
            title: "Capacity Limits & Tiers",
            desc: "Set maximum capacities per ticket type. Forms automatically close or mark tiers as sold out when limits are reached.",
          },
          {
            icon: Users,
            title: "Approval Screening Queue",
            desc: "Review applicant profiles before confirming admission. Perfect for closed workshops, VIP dinners, and executive conferences.",
          },
          {
            icon: QrCode,
            title: "Automated Digital Passes",
            desc: "Approved attendees receive an instant, beautifully designed digital QR pass via email, ready to save to their smartphone.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR Compliant",
            desc: "Built-in privacy notices, explicit opt-ins, and one-click data purge tools adhering to UK data protection legislation.",
          },
          {
            icon: Zap,
            title: "Real-Time Roster Sync",
            desc: "All registrations sync immediately with entrance gate scanners for rapid attendee check-in on event day.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Configure Form Fields",
            desc: "Add custom questions, upload your logo, define ticket tiers, and set attendee capacity limits.",
          },
          {
            n: "02",
            title: "Publish & Share Link",
            desc: "Embed the registration form into your website or share the dedicated link across your marketing channels.",
          },
          {
            n: "03",
            title: "Process Registrations",
            desc: "Approve guests automatically or review submissions manually through your organiser dashboard.",
          },
          {
            n: "04",
            title: "Deliver Digital Passes",
            desc: "URPASS automatically emails branded QR passes with event venue, time, and session instructions.",
          },
          {
            n: "05",
            title: "Check In at the Door",
            desc: "Scan attendees with any smartphone browser camera for rapid, queue-free entrance verification.",
          },
        ],

        deepDiveSections: [
          {
            badge: "FORM DESIGN & CONVERSION",
            title: "High-Converting, Mobile-First Registration for UK Audiences",
            paragraphs: [
              "Complex registration processes cause high abandonment rates. When prospective attendees encounter multi-page questionnaires, mandatory account creation, or sluggish interfaces, they drop off.",
              "URPASS provides frictionless, single-page registration tailored for UK mobile users. With responsive styling, clear field validation, and instant confirmation, registration conversion rates are maximized.",
            ],
            bullets: [
              "No account creation required for attendees",
              "Optimised for mobile Safari, Chrome, and desktop browsers",
              "Instant confirmation screen with direct pass download link",
              "Clean British date formatting (DD/MM/YYYY) and time zones (GMT / BST)",
            ],
            takeaway: "Capture more registrations by eliminating unnecessary sign-up friction.",
          },
        ],

        useCases: [
          "UK University Open Days & Inductions",
          "Professional CPD Training Courses",
          "Academic Conferences & Research Seminars",
          "Corporate Product Launches & Press Days",
          "Industry Networking Breakfasts",
          "Non-Profit & Charity Fundraisers",
        ],

        relatedLinks: [
          {
            title: "UK Event Ticketing Software",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "Attendee Management Software UK",
            href: "/uk/attendee-management-software",
            category: "Product",
          },
          {
            title: "University Event Management Software UK",
            href: "/uk/university-event-software",
            category: "Use Case",
          },
        ],

        faqs: [
          {
            q: "Can I collect custom questions during registration?",
            a: "Yes. URPASS allows organisers to add custom text fields, dropdown selectors, checkboxes, and file uploads. You can make questions mandatory or optional depending on your needs.",
          },
          {
            q: "How does the registration approval workflow work?",
            a: "When you enable manual approval for an event, registrations enter a review queue. Organisers can review applicant details and approve or decline them with one click. Digital passes are only dispatched to approved attendees.",
          },
          {
            q: "Can I limit the number of attendees for a specific ticket category?",
            a: "Yes. You can specify precise capacity caps for each ticket tier (e.g., 50 VIP passes, 200 General Admission). Once a tier reaches its limit, it is automatically marked as sold out.",
          },
          {
            q: "How do attendees access their event passes after registering?",
            a: "Attendees receive an automated confirmation email containing a digital QR pass. They can also view their pass directly in their mobile browser and save the link or bookmark it for easy access at the venue entrance.",
          },
        ],

        ctaTitle: "Streamline your event registrations today",
        ctaDescription:
          "Start free on URPASS. Clean forms, automatic QR passes, and sub-second entrance scanning across the UK.",
      }}
    />
  );
}
