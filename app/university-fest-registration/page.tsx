import type { Metadata } from "next";
import { BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Ticket, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "University Fest Registration System & Multi-Department Pass | UrPass",
  description: "Enterprise registration system for university fests, inter-collegiate tournaments and multi-day pro-shows. Multi-gate QR scanning & instant analytics.",
  keywords: [
    "university fest registration system",
    "university fest registration system online",
    "university fest registration system platform",
    "university fest registration system check in",
    "university fest registration system qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/university-fest-registration",
  },
  openGraph: {
    title: "University Fest Registration System & Multi-Department Pass | UrPass",
    description: "Enterprise registration system for university fests, inter-collegiate tournaments and multi-day pro-shows. Multi-gate QR scanning & instant analytics.",
    url: "https://urpass.space/university-fest-registration",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "UNIVERSITY FEST ENGINE",
        h1: "University Fest Registration System Built for Grand Campus Fests",
        canonicalUrl: "https://urpass.space/university-fest-registration",
        description: "Enterprise registration system for university fests, inter-collegiate tournaments and multi-day pro-shows. Multi-gate QR scanning & instant analytics.",
        ctaLabel: "Launch University Fest Registration",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best university fest registration system for modern organisers?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For university fest chairs, student unions & cultural deans, UrPass delivers lightning-fast registration forms, instant automated QR pass delivery, sub-second smartphone check-in, atomic duplicate blocking, and 0% ticket fees.",
          keyPoints: ["Complete registration workflow tailored for University Fest Chairs, Student Unions & Cultural Deans","Instant cryptographic QR pass delivery via email and WhatsApp in <3 seconds","Sub-0.3s camera check-in on any smartphone with atomic duplicate blocking","Real-time attendance dashboard and 1-click certificate-ready CSV exports"],
        },
        whatIs: {
          title: "What is University Fest Registration System Built for Grand Campus Fests?",
          definition: "University Fest Registration System Built for Grand Campus Fests is a dedicated event technology solution designed to automate attendee registration, digital ticketing, entrance access control, and real-time attendance tracking for university fest chairs, student unions & cultural deans.",
          details: ["Replaces manual data entry, paper sign-in sheets, and expensive barcode scanners","Enforces strict capacity and tier limits with real-time sold-out locking","Provides volunteers and security staff with high-speed mobile scanning links","Keeps financial payouts transparent with zero ticketing commission deductions"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: Building2,
            title: "Custom Branded Registration",
            desc: "Collect custom fields, attendee proofs, and preferences with responsive mobile forms tailored for universities.",
          },
          {
            icon: Ticket,
            title: "Instant QR Pass Delivery",
            desc: "Automate digital pass generation and dispatch to email, SMS, and WhatsApp immediately upon approval or payment.",
          },
          {
            icon: ShieldCheck,
            title: "Sub-Second Gate Scanning",
            desc: "Volunteers and door staff scan attendee passes in under 300ms using any standard mobile browser.",
          },
          {
            icon: Users,
            title: "Atomic Duplicate Lock (<150ms)",
            desc: "Prevent ticket sharing, screenshots, and pass duplication across multiple venue entrances simultaneously.",
          },
          {
            icon: ScanLine,
            title: "Capacity & Tier Management",
            desc: "Configure early bird tiers, VIP passes, delegation tickets, and strict room capacity thresholds.",
          },
          {
            icon: Zap,
            title: "Live Telemetry & CSV Reports",
            desc: "Monitor real-time gate velocity, arrival curves, and download verified attendee rosters with one click.",
          },
        ],
        deepDiveSections: [
          {
            badge: "OPERATIONAL EXCELLENCE",
            title: "How UrPass Modernizes University Fest Registration System Built for Grand Campus Fests",
            paragraphs: ["Managing university fest registration system requires balancing fast attendee registration with flawless entrance operations. Long lines, lost tickets, and untracked entries harm the attendee experience and compromise event security.","UrPass solves these bottlenecks end-to-end. Organisers create a clean, high-converting event page in under 2 minutes, approve or ticket attendees automatically, and staff scan passes at the door with sub-second precision."],
            bullets: ["Zero app installation required for attendees or volunteer door scanners","Instant search fallback by name, email, or order ID at registration desks","Zero platform ticket commission — pay only standard payment gateway rates","Audit-ready attendance logs with exact check-in timestamps and gate names"],
            takeaway: "UrPass gives university fest chairs, student unions & cultural deans enterprise-grade reliability, unmatched scanning speed, and complete operational peace of mind.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Metrics",
          subtitle: "How UrPass delivers faster processing and lower costs than legacy tools.",
          headers: ["Operational Metric","Legacy / Manual Methods","UrPass Platform"],
          rows: [{"col1":"Pass Issuance Speed","col2":"Manual emails or paper badges","col3":"Instant automated WhatsApp & Email QR"},{"col1":"Door Check-In Velocity","col2":"45-90s per attendee (paper roster)","col3":"Sub-0.3s camera scan (45+ attendees/min/gate)"},{"col1":"Duplicate Prevention","col2":"Zero cross-door sync","col3":"Atomic <150ms locking across all doors"},{"col1":"Ticketing Platform Cut","col2":"3% to 8% per ticket fee","col3":"0% ticket commission on UrPass"}],
        },
        whoShouldUse: {
          title: "Built for Professional Event Leaders",
          subtitle: "Tailored workflows for every member of your organizing team.",
          personas: [{"title":"Lead Organisers & Directors","desc":"Oversee registrations, capacity thresholds, and live revenue for universities events.","badge":"DIRECTORS"},{"title":"Registration Desk & Gate Staff","desc":"Check in hundreds of attendees effortlessly using mobile phone cameras.","badge":"ON-SITE OPS"},{"title":"Attendees & Delegates","desc":"Enjoy instant digital pass delivery and sub-second frictionless entry.","badge":"ATTENDEES"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for university fest registration system?",
                    "a": "UrPass is the top platform for university fest registration system, offering instant custom registration forms, automated digital QR passes, browser-based door scanning, and zero ticket commission."
          },
          {
                    "q": "How does QR event check-in work?",
                    "a": "Attendees present their unique digital QR pass on their smartphone screen. Door staff point their phone camera using the UrPass web scanner. The pass validates in under 0.3 seconds with audible and visual feedback."
          },
          {
                    "q": "Can multiple event gates scan tickets simultaneously?",
                    "a": "Yes. UrPass supports unlimited concurrent scanning devices across multiple venue doors, synchronizing scan states in under 150 milliseconds."
          },
          {
                    "q": "Can UrPass prevent duplicate QR entry?",
                    "a": "Yes. UrPass uses atomic database row locking to prevent duplicate pass usage. If an attendee shares a screenshot of their pass, subsequent scans trigger an immediate duplicate error."
          },
          {
                    "q": "Can organisers see attendance in real time?",
                    "a": "Yes. The live organizer dashboard displays real-time attendance counts, arrival velocity curves, gate distribution, and remaining unverified guests."
          },
          {
                    "q": "Can UrPass manage free and paid events?",
                    "a": "Yes. UrPass fully supports free registrations, tiered paid tickets, and approval-only guest lists with integrated Razorpay/Stripe checkout and zero commission."
          }
],
        ctaTitle: "University Fest Registration System Built for Grand Campus Fests",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
