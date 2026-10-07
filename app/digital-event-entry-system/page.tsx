import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Digital Event Entry System & Contactless QR Access Control | UrPass",
  description: "Modernize your venue entry with a contactless digital event entry system. Deploy sub-0.3s smartphone QR verification, anti-fraud locks, and live telemetry.",
  keywords: [
    "digital event entry system",
    "digital event entry system online",
    "digital event entry system platform",
    "digital event entry system check in",
    "digital event entry system qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/digital-event-entry-system",
  },
  openGraph: {
    title: "Digital Event Entry System & Contactless QR Access Control | UrPass",
    description: "Modernize your venue entry with a contactless digital event entry system. Deploy sub-0.3s smartphone QR verification, anti-fraud locks, and live telemetry.",
    url: "https://urpass.space/digital-event-entry-system",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DIGITAL ENTRY & ACCESS CONTROL",
        h1: "Digital Event Entry System & Contactless QR Pass Management",
        canonicalUrl: "https://urpass.space/digital-event-entry-system",
        description: "Modernize your venue entry with a contactless digital event entry system. Deploy sub-0.3s smartphone QR verification, anti-fraud locks, and live telemetry.",
        ctaLabel: "Deploy Digital Entry Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Digital Entry Specs",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best digital event entry system?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. UrPass replaces paper tickets and physical badges with dynamic digital QR passes, sub-0.3s smartphone camera scanning, Apple and Google Wallet support, and real-time atomic duplicate protection.",
          keyPoints: ["100% paperless digital QR passes delivered instantly to email, WhatsApp, and digital wallets","Ultra-fast 0.28-second optical camera scanning on standard staff smartphones","Atomic database locking stops digital screenshot sharing across venue doors","Real-time live telemetry console tracking venue capacity and concourse ingress velocity"],
        },
        whatIs: {
          title: "What is a Digital Event Entry System?",
          definition: "A digital event entry system is a modern, paperless access control solution that replaces physical paper tickets and badges with secure, smartphone-based digital passes and optical camera verification.",
          details: ["Eliminates paper waste, printing costs, and lost badge replacement desks","Delivers passes directly to attendee digital wallets for instant lock-screen access","Provides sub-150ms real-time verification across multiple entrance doors simultaneously","Captures immutable arrival timestamps for post-event analytics and security audits"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: ScanLine,
            title: "Paperless Digital QR Passes",
            desc: "Deliver beautiful digital tickets to mobile inboxes with Apple Wallet and Google Wallet support.",
          },
          {
            icon: Zap,
            title: "Sub-0.3s Optical Verification",
            desc: "Scan digital passes in 0.28 seconds on phone screens, even with low brightness or cracked screens.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Detection",
            desc: "Instant database row locking prevents pass reuse and screenshot sharing across gates.",
          },
          {
            icon: Lock,
            title: "Zero Hardware Costs",
            desc: "Run all door access control on standard staff and volunteer smartphones without rental fees.",
          },
          {
            icon: CheckCircle2,
            title: "Gate & Concourse Routing",
            desc: "Configure gate rules to route VIP, Speaker, and General Admission attendees to designated doors.",
          },
          {
            icon: BarChart3,
            title: "Live Venue Occupancy Telemetry",
            desc: "Monitor real-time venue occupancy, peak arrival curves, and door throughput continuously.",
          },
        ],
        deepDiveSections: [
          {
            badge: "DIGITAL TRANSFORMATION",
            title: "Why Modern Venues are Transitioning to 100% Digital Entry",
            paragraphs: ["Physical paper tickets and printed badge lists are slow, costly to produce, environmentally wasteful, and vulnerable to loss and counterfeit duplication. When attendees forget their paper tickets or staff misplace physical rosters, entrance doors quickly grind to a halt.","UrPass modernizes event entry with a frictionless digital workflow. Attendees receive a cryptographically unique digital pass on their smartphones. At the venue entrance, staff scan passes in 0.28 seconds using standard mobile phones. Atomic cloud verification guarantees pass exclusivity while live telemetry monitors real-time venue capacity."],
            bullets: ["Eliminates thousands of dollars in ticket printing, badge lanyards, and shipping costs","Sub-0.3 second optical scanning maintains smooth walking-pace crowd entry","100% paperless operation reduces environmental impact and supports sustainability goals","Immutable digital audit trails enhance venue security and emergency crowd accounting"],
            takeaway: "UrPass provides modern event organisers with an ultra-fast, secure, and sustainable digital event entry system.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Entry System Dimension","Traditional Paper / Printed Badges","UrPass Digital Entry System"],
          rows: [{"col1":"Pass Delivery Method","col2":"Physical printing / postal delivery","col3":"Instant digital delivery (Email, WhatsApp, Wallet)"},{"col1":"Door Check-In Velocity","col2":"30–60s per attendee","col3":"0.28s ultra-fast optical camera scan"},{"col1":"Anti-Counterfeit Protection","col2":"Vulnerable to photocopies and sharing","col3":"Sub-150ms atomic cryptographic duplicate lock"},{"col1":"Hardware Requirement","col2":"Bulky laser terminals ($300+/unit)","col3":"$0 (runs in standard smartphone browsers)"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Concerts & Nightlife Venues","desc":"Admit thousands of ticket holders rapidly with contactless digital QR passes.","badge":"NIGHTLIFE"},{"title":"Conferences & Summits","desc":"Provide high-profile delegates with branded digital wallet passes and fast entry.","badge":"CONFERENCES"},{"title":"Sports Stadiums & Arenas","desc":"Coordinate turnstile scanning and prevent pass-back fraud across concourses.","badge":"ARENAS"},{"title":"Corporate Product Launches","desc":"Deliver an innovative, VIP digital red-carpet entrance experience.","badge":"CORPORATE"}],
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
                    "q": "What is a digital event entry system?",
                    "a": "A digital event entry system uses electronic QR passes displayed on attendee smartphones and verified by staff using mobile camera scanners, replacing paper tickets and physical rosters."
          },
          {
                    "q": "How fast is the digital QR scanner?",
                    "a": "UrPass's optical engine decodes digital QR passes in 0.28 seconds, allowing staff to process 35 to 45 attendees per minute per scanner."
          },
          {
                    "q": "Do attendees need an internet connection at the venue to show their pass?",
                    "a": "No. Once attendees receive their QR pass via email or add it to Apple/Google Wallet, it can be displayed and scanned completely offline."
          },
          {
                    "q": "How does the system prevent attendees from sharing screenshots of their passes?",
                    "a": "UrPass marks tickets as checked in in real time across all active scanners in <150ms. If a shared screenshot is scanned again, the scanner sounds an immediate red duplicate alert."
          },
          {
                    "q": "Can we run digital entry on our staff's existing smartphones?",
                    "a": "Yes. Staff open a secure scanner link on their phone browsers and enter a PIN code to start scanning with zero app downloads."
          },
          {
                    "q": "Can we track how many people are currently inside the venue?",
                    "a": "Yes. The live telemetry dashboard displays real-time ingress counts, peak arrival curves, and current venue occupancy."
          },
          {
                    "q": "Is UrPass suitable for both small meetups and large arena events?",
                    "a": "Yes. UrPass scales seamlessly from 50-person community workshops to 10,000+ attendee stadium festivals."
          }
],
        ctaTitle: "Digital Event Entry System & Contactless QR Pass Management",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
