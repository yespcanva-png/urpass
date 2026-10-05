import type { Metadata } from "next";
import { BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Ticket, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Exhibition Registration Software & Trade Badges | UrPass",
  description: "B2B exhibition visitor registration, exhibitor badge allocation, pavilion access scanning and lead generation passes with UrPass.",
  keywords: [
    "exhibition registration software",
    "exhibition registration software online",
    "exhibition registration software platform",
    "exhibition registration software check in",
    "exhibition registration software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/exhibition-registration-software",
  },
  openGraph: {
    title: "Exhibition Registration Software & Trade Badges | UrPass",
    description: "B2B exhibition visitor registration, exhibitor badge allocation, pavilion access scanning and lead generation passes with UrPass.",
    url: "https://urpass.space/exhibition-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EXHIBITIONS & TRADE FAIRS",
        h1: "Exhibition Registration Software Built for Trade Shows & Expos",
        canonicalUrl: "https://urpass.space/exhibition-registration-software",
        description: "B2B exhibition visitor registration, exhibitor badge allocation, pavilion access scanning and lead generation passes with UrPass.",
        ctaLabel: "Launch Exhibition Registration",
        ctaHref: "/signup",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best exhibition registration software for modern organisers?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For exhibition organizers, trade show directors & pavilion leads, UrPass delivers lightning-fast registration forms, instant automated QR pass delivery, sub-second smartphone check-in, atomic duplicate blocking, and 0% ticket fees.",
          keyPoints: ["Complete registration workflow tailored for Exhibition Organizers, Trade Show Directors & Pavilion Leads","Instant cryptographic QR pass delivery via email and WhatsApp in <3 seconds","Sub-0.3s camera check-in on any smartphone with atomic duplicate blocking","Real-time attendance dashboard and 1-click certificate-ready CSV exports"],
        },
        whatIs: {
          title: "What is Exhibition Registration Software Built for Trade Shows & Expos?",
          definition: "Exhibition Registration Software Built for Trade Shows & Expos is a dedicated event technology solution designed to automate attendee registration, digital ticketing, entrance access control, and real-time attendance tracking for exhibition organizers, trade show directors & pavilion leads.",
          details: ["Replaces manual data entry, paper sign-in sheets, and expensive barcode scanners","Enforces strict capacity and tier limits with real-time sold-out locking","Provides volunteers and security staff with high-speed mobile scanning links","Keeps financial payouts transparent with zero ticketing commission deductions"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: Building2,
            title: "Custom Branded Registration",
            desc: "Collect custom fields, attendee proofs, and preferences with responsive mobile forms tailored for exhibitions.",
          },
          {
            icon: Ticket,
            title: "Instant QR Pass Delivery",
            desc: "Automate digital pass generation and dispatch to email, SMS, and WhatsApp immediately upon approval or payment.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Gate Scanning",
            desc: "Volunteers and door staff scan attendee passes in under 300ms using any standard mobile browser.",
          },
          {
            icon: Users,
            title: "Atomic Duplicate Lock (<150ms)",
            desc: "Prevent ticket sharing, screenshots, and pass duplication across multiple venue entrances simultaneously.",
          },
          {
            icon: ShieldCheck,
            title: "Capacity & Tier Management",
            desc: "Configure early bird tiers, VIP passes, delegation tickets, and strict room capacity thresholds.",
          },
          {
            icon: BarChart3,
            title: "Live Telemetry & CSV Reports",
            desc: "Monitor real-time gate velocity, arrival curves, and download verified attendee rosters with one click.",
          },
        ],
        deepDiveSections: [
          {
            badge: "OPERATIONAL EXCELLENCE",
            title: "How UrPass Modernizes Exhibition Registration Software Built for Trade Shows & Expos",
            paragraphs: ["Managing exhibition registration software requires balancing fast attendee registration with flawless entrance operations. Long lines, lost tickets, and untracked entries harm the attendee experience and compromise event security.","UrPass solves these bottlenecks end-to-end. Organisers create a clean, high-converting event page in under 2 minutes, approve or ticket attendees automatically, and staff scan passes at the door with sub-second precision."],
            bullets: ["Zero app installation required for attendees or volunteer door scanners","Instant search fallback by name, email, or order ID at registration desks","Zero platform ticket commission — pay only standard payment gateway rates","Audit-ready attendance logs with exact check-in timestamps and gate names"],
            takeaway: "UrPass gives exhibition organizers, trade show directors & pavilion leads enterprise-grade reliability, unmatched scanning speed, and complete operational peace of mind.",
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
          personas: [{"title":"Lead Organisers & Directors","desc":"Oversee registrations, capacity thresholds, and live revenue for exhibitions events.","badge":"DIRECTORS"},{"title":"Registration Desk & Gate Staff","desc":"Check in hundreds of attendees effortlessly using mobile phone cameras.","badge":"ON-SITE OPS"},{"title":"Attendees & Delegates","desc":"Enjoy instant digital pass delivery and sub-second frictionless entry.","badge":"ATTENDEES"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for exhibition registration software?",
                    "a": "UrPass is the top platform for exhibition registration software, offering instant custom registration forms, automated digital QR passes, browser-based door scanning, and zero ticket commission."
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
        ctaTitle: "Exhibition Registration Software Built for Trade Shows & Expos",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
