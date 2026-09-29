import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Banknote,
  Users,
  Zap,
  Sliders,
  Sparkles,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Looking for an Eventbrite Alternative in the UK? | URPASS",
  description:
    "Explore URPASS as a modern UK Eventbrite alternative. Streamlined event registration, digital QR tickets, browser-based entry scanning, approval workflows, and transparent GBP plans with 0% platform commission.",
  keywords: [
    "eventbrite alternative uk",
    "eventbrite alternatives uk",
    "uk ticketing platforms",
    "free event registration uk",
    "university ticketing eventbrite alternative",
    "student union ticketing alternative",
    "qr ticket scanner eventbrite alternative",
    "zero commission event ticketing uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/eventbrite-alternative",
    languages: {
      "en-GB": "https://urpass.space/uk/eventbrite-alternative",
      "x-default": "https://urpass.space/compare/eventbrite-alternative",
    },
  },
  openGraph: {
    title: "Eventbrite Alternative UK — Streamlined Registration & QR Check-In | URPASS",
    description:
      "Eventbrite works well for public event discovery. For organisers needing direct attendee management, instant browser QR scanning, custom pass design, and 0% per-ticket commission, URPASS is built for you.",
    url: "https://urpass.space/uk/eventbrite-alternative",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkEventbriteAlternativePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/eventbrite-alternative",
        badge: "UK TICKETING COMPARISON · TRANSPARENT EVENT OS",
        h1: "Looking for an Eventbrite Alternative in the UK?",
        description:
          "Eventbrite works well for public event discovery and general ticket sales. But many UK organisers simply need a streamlined system for custom registration, digital passes, approval workflows, and lightning-fast gate scanning without punitive fees.",
        ctaLabel: "Try URPASS UK Free for 30 Days",

        // AI / GEO Direct Answer Block
        directAnswer: {
          title: "Is URPASS a viable Eventbrite alternative for UK event organisers?",
          summary:
            "Yes. While Eventbrite operates primarily as a public event discovery marketplace taking per-ticket commissions, URPASS is an independent event operating system built for UK conferences, university societies, students' unions, and professional organisations. URPASS provides branded registration forms, custom QR digital passes, sub-second browser scanning on smartphones without app downloads, and transparent GBP pricing with 0% ticket commission.",
          keyPoints: [
            "0% platform commission on ticket sales — save on every registration",
            "Browser-based smartphone scanner: no proprietary hardware or app downloads needed",
            "Custom pass designer with instant digital QR passes sent to attendees",
            "Strict UK GDPR, Data Protection Act 2018, and PECR privacy compliance",
          ],
        },

        // Documented Feature Comparison (Eventbrite vs URPASS)
        competitorComparison: {
          title: "Eventbrite vs URPASS — Capability Comparison",
          subtitle:
            "A factual comparison of documented platform capabilities for UK event registration, ticketing, and entrance scanning.",
          competitorName: "Eventbrite",
          sourceCitations: [
            "Eventbrite Organiser App documentation on QR scanning and manual check-in",
            "URPASS live platform feature documentation (2026)",
          ],
          rows: [
            {
              criteria: "Online Registration & Form Builder",
              urpass: "Fully customisable registration forms with custom student/company fields",
              competitor: "Standard online ticket booking flow with optional custom questions",
              urpassAdvantage: true,
            },
            {
              criteria: "Digital QR Tickets & Passes",
              urpass: "Branded digital passes with scannable QR codes sent via email or link",
              competitor: "PDF ticket attachments and mobile in-app tickets",
              urpassAdvantage: true,
            },
            {
              criteria: "QR Ticket Scanning at Gates",
              urpass: "Sub-second (<0.3s) camera scanning directly in any smartphone web browser",
              competitor: "Requires Eventbrite Organiser mobile app installation on staff devices",
              urpassAdvantage: true,
            },
            {
              criteria: "Duplicate Ticket Detection",
              urpass: "Instant visual and haptic duplicate detection with exact previous check-in timestamp",
              competitor: "Duplicate scan detection supported in organiser app",
              urpassAdvantage: false,
            },
            {
              criteria: "Browser-Based Scanner (Zero App Install)",
              urpass: "Supported natively via WebRTC camera API in Safari, Chrome, and Edge",
              competitor: "Not supported: volunteers must download native iOS/Android mobile app",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Management & Filtering",
              urpass: "Real-time attendee roster, bulk status updates, CSV export, and search",
              competitor: "Attendee list management, manual check-in, and order exports",
              urpassAdvantage: false,
            },
            {
              criteria: "Real-Time Check-In Synchronisation",
              urpass: "Instant multi-door sync with sub-50ms latency across unlimited volunteer phones",
              competitor: "Real-time sync across connected mobile scanner devices",
              urpassAdvantage: false,
            },
            {
              criteria: "Registration Approval Workflow",
              urpass: "Built-in manual review and approval queue before issuing passes",
              competitor: "Requires custom setup or third-party add-ons for gated approval",
              urpassAdvantage: true,
            },
            {
              criteria: "Custom Pass & Ticket Design",
              urpass: "Visual ticket studio with custom banner, theme colours, and field placement",
              competitor: "Standard fixed ticket layout with organiser logo",
              urpassAdvantage: true,
            },
            {
              criteria: "Multi-Gate Entry Control",
              urpass: "Role-based gate access with PIN protection for volunteer scanner stations",
              competitor: "Staff user permissions within organiser account",
              urpassAdvantage: true,
            },
            {
              criteria: "UK Data Privacy & Compliance",
              urpass: "UK GDPR compliant, Article 17 deletion, zero cross-marketing of competitor events",
              competitor: "Marketplace model with platform-wide attendee marketing and tracking",
              urpassAdvantage: true,
            },
          ],
        },

        features: [
          {
            icon: QrCode,
            title: "Custom Branded Digital Passes",
            desc: "Generate beautiful, professional digital passes matching your organisation's visual identity. Passes load instantly on any mobile device.",
          },
          {
            icon: Smartphone,
            title: "Zero-Download Browser Scanner",
            desc: "Skip the friction of having volunteers install apps. Share a secure scanner link or PIN, open the phone browser, and scan in <0.3s.",
          },
          {
            icon: ShieldCheck,
            title: "Your Attendees, Your Data",
            desc: "Unlike public marketplaces that recommend competitor events to your guests, URPASS never markets to your attendees or shares their details.",
          },
          {
            icon: Banknote,
            title: "Transparent GBP Pricing",
            desc: "Flat, predictable monthly or annual subscriptions with 0% commission on tickets. Free forever for up to 100 registrations per month.",
          },
          {
            icon: Users,
            title: "Approval & Guest Screening",
            desc: "Run invitation-only or application-based events with review workflows before issuing valid entrance passes.",
          },
          {
            icon: Zap,
            title: "Multi-Door Offline Sync",
            desc: "Gate stations cache attendee lists locally, allowing seamless entry scanning even in historic stone buildings or basement halls without Wi-Fi.",
          },
        ],

        deepDiveSections: [
          {
            badge: "MARKETPLACE VS DEDICATED TOOL",
            title: "Why UK Organisers Choose a Dedicated Event OS Over a Ticketing Marketplace",
            paragraphs: [
              "When you host an event on a public ticketing marketplace, you trade simplicity for platform lock-in. Marketplaces monetize by charging booking fees and displaying competing events to your attendees right after they register.",
              "For universities, students' unions, academic conferences, and independent organisers, this model creates friction. Organisers need clean registration links that reflect their own brand, seamless check-in for volunteer staff, and direct ownership of attendee communication.",
              "URPASS gives you complete control over your event pipeline from registration forms to gate scanning, backed by UK GDPR compliance and transparent pricing in GBP (£).",
            ],
            bullets: [
              "Clean URLs without distracting third-party ads or recommended events",
              "Immediate 30-day free trial on Starter, Pro, and Business tiers",
              "No requirement for volunteers to create personal accounts to scan tickets",
              "Built-in CSV and roster management with real-time check-in stats",
            ],
            takeaway: "Use URPASS when you want your event to feel like your own brand, not a listing on someone else's marketplace.",
          },
          {
            badge: "UK STUDENT UNIONS & SOCIETIES",
            title: "Designed for British Higher Education & Society Operations",
            paragraphs: [
              "Student unions and societies across the UK face unique hurdles: annual committee handovers, tight budgets, and the need to verify student status at society balls, freshers' fairs, and guest lectures.",
              "URPASS allows committees to capture Student IDs, course names, and dietary preferences directly on the form. Because gate scanning runs in any browser, any committee member can assist at the door in seconds using their own smartphone.",
            ],
            bullets: [
              "Unlimited volunteer scanners with PIN protection",
              "Sub-second verification preventing long queues in the rain",
              "Full data export for union administration and health & safety compliance",
              "Affordable society plans with 0% ticket commission",
            ],
            takeaway: "Run professional society events with enterprise gate control on a student-friendly budget.",
          },
        ],

        useCases: [
          "UK University Societies & Students' Unions",
          "Academic Conferences & Research Symposiums",
          "Tech Hackathons & Startup Pitch Nights",
          "Corporate Training & CPD Seminars",
          "Community Workshops & Cultural Gatherings",
          "Exclusive Member Mixers & Networking Dinners",
        ],

        relatedLinks: [
          {
            title: "UK Event Ticketing Software",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "University Event Management Software UK",
            href: "/uk/university-event-software",
            category: "Use Case",
          },
          {
            title: "Student Union Event Ticketing",
            href: "/uk/student-union-event-ticketing",
            category: "Use Case",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Why do UK event organisers look for an Eventbrite alternative?",
            a: "Many UK organisers seek alternatives because Eventbrite is primarily designed as a consumer event discovery directory rather than a streamlined event operating system. Organisers often prefer dedicated platforms like URPASS to eliminate ticket commissions, avoid showing competing events to attendees, utilize browser-based scanners that don't require app downloads, and keep attendee data strictly private under UK GDPR.",
          },
          {
            q: "Can volunteer door staff scan tickets without downloading an app?",
            a: "Yes. Unlike Eventbrite which requires volunteers to download the Eventbrite Organiser app from the iOS App Store or Google Play Store, URPASS runs natively in standard web browsers (Safari, Chrome, Edge). Organisers simply provide a secure scanner link or gate PIN, allowing volunteers to start scanning tickets in seconds.",
          },
          {
            q: "Does URPASS charge per-ticket booking fees in the UK?",
            a: "No. URPASS charges 0% platform commission on ticket sales. Organisers choose a transparent monthly or annual subscription in GBP (£), or use the Free plan for smaller events. 100% of your ticket revenue goes directly to your organisation.",
          },
          {
            q: "How does URPASS compare for university society events and student unions?",
            a: "URPASS is exceptionally well-suited for UK universities and students' unions. It allows committees to collect student IDs, department details, and dietary needs during registration, supports approval queues for member-only events, and handles rapid check-ins at society balls, freshers' fairs, and guest speaker events.",
          },
          {
            q: "How does duplicate ticket prevention work during gate scanning?",
            a: "URPASS validates every ticket against the cloud roster in sub-50ms. If an attendee attempts to reuse a ticket, or if the same QR pass is scanned at two different entrances, the scanner displays an immediate full-screen red alert showing 'ALREADY CHECKED IN' alongside the exact previous scan timestamp and gate identifier.",
          },
        ],

        ctaTitle: "Ready for a cleaner UK ticketing & check-in platform?",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. No credit card required, instant setup, and 0% ticket commission.",
      }}
    />
  );
}
