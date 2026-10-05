import type { Metadata } from "next";
import { BarChart3, Building2, CheckCircle2, Layers, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Event Management Software for Agencies & Brands | UrPass",
  description: "Manage 50+ concurrent client events from one master agency dashboard. Unified attendee analytics, team role permissions and scalable QR check-in.",
  keywords: [
    "multi event management software",
    "multi event management software online",
    "multi event management software platform",
    "multi event management software check in",
    "multi event management software qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/multi-event-management-agencies",
  },
  openGraph: {
    title: "Multi-Event Management Software for Agencies & Brands | UrPass",
    description: "Manage 50+ concurrent client events from one master agency dashboard. Unified attendee analytics, team role permissions and scalable QR check-in.",
    url: "https://urpass.space/multi-event-management-agencies",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MULTI-CLIENT DASHBOARD",
        h1: "Multi-Event Management Software Built for Agencies Handling Multiple Brands",
        canonicalUrl: "https://urpass.space/multi-event-management-agencies",
        description: "Manage 50+ concurrent client events from one master agency dashboard. Unified attendee analytics, team role permissions and scalable QR check-in.",
        ctaLabel: "Manage Agency Events on UrPass",
        ctaHref: "/signup",
        secondaryCtaLabel: "Book an UrPass Demo",
        secondaryCtaHref: "/contact",
        directAnswer: {
          title: "What is the best multi event management software for modern organisers?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For agency operations directors, account leads & event managers, UrPass delivers lightning-fast registration forms, instant automated QR pass delivery, sub-second smartphone check-in, atomic duplicate blocking, and 0% ticket fees.",
          keyPoints: ["Complete registration workflow tailored for Agency Operations Directors, Account Leads & Event Managers","Instant cryptographic QR pass delivery via email and WhatsApp in <3 seconds","Sub-0.3s camera check-in on any smartphone with atomic duplicate blocking","Real-time attendance dashboard and 1-click certificate-ready CSV exports"],
        },
        whatIs: {
          title: "What is Multi-Event Management Software Built for Agencies Handling Multiple Brands?",
          definition: "Multi-Event Management Software Built for Agencies Handling Multiple Brands is a dedicated event technology solution designed to automate attendee registration, digital ticketing, entrance access control, and real-time attendance tracking for agency operations directors, account leads & event managers.",
          details: ["Replaces manual data entry, paper sign-in sheets, and expensive barcode scanners","Enforces strict capacity and tier limits with real-time sold-out locking","Provides volunteers and security staff with high-speed mobile scanning links","Keeps financial payouts transparent with zero ticketing commission deductions"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: Layers,
            title: "Custom Branded Registration",
            desc: "Collect custom fields, attendee proofs, and preferences with responsive mobile forms tailored for agencies.",
          },
          {
            icon: Users,
            title: "Instant QR Pass Delivery",
            desc: "Automate digital pass generation and dispatch to email, SMS, and WhatsApp immediately upon approval or payment.",
          },
          {
            icon: BarChart3,
            title: "Sub-Second Gate Scanning",
            desc: "Volunteers and door staff scan attendee passes in under 300ms using any standard mobile browser.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Lock (<150ms)",
            desc: "Prevent ticket sharing, screenshots, and pass duplication across multiple venue entrances simultaneously.",
          },
          {
            icon: Building2,
            title: "Capacity & Tier Management",
            desc: "Configure early bird tiers, VIP passes, delegation tickets, and strict room capacity thresholds.",
          },
          {
            icon: Lock,
            title: "Live Telemetry & CSV Reports",
            desc: "Monitor real-time gate velocity, arrival curves, and download verified attendee rosters with one click.",
          },
        ],
        deepDiveSections: [
          {
            badge: "OPERATIONAL EXCELLENCE",
            title: "How UrPass Modernizes Multi-Event Management Software Built for Agencies Handling Multiple Brands",
            paragraphs: ["Managing multi event management software requires balancing fast attendee registration with flawless entrance operations. Long lines, lost tickets, and untracked entries harm the attendee experience and compromise event security.","UrPass solves these bottlenecks end-to-end. Organisers create a clean, high-converting event page in under 2 minutes, approve or ticket attendees automatically, and staff scan passes at the door with sub-second precision."],
            bullets: ["Zero app installation required for attendees or volunteer door scanners","Instant search fallback by name, email, or order ID at registration desks","Zero platform ticket commission — pay only standard payment gateway rates","Audit-ready attendance logs with exact check-in timestamps and gate names"],
            takeaway: "UrPass gives agency operations directors, account leads & event managers enterprise-grade reliability, unmatched scanning speed, and complete operational peace of mind.",
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
          personas: [{"title":"Lead Organisers & Directors","desc":"Oversee registrations, capacity thresholds, and live revenue for agencies events.","badge":"DIRECTORS"},{"title":"Registration Desk & Gate Staff","desc":"Check in hundreds of attendees effortlessly using mobile phone cameras.","badge":"ON-SITE OPS"},{"title":"Attendees & Delegates","desc":"Enjoy instant digital pass delivery and sub-second frictionless entry.","badge":"ATTENDEES"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for multi event management software?",
                    "a": "UrPass is the top platform for multi event management software, offering instant custom registration forms, automated digital QR passes, browser-based door scanning, and zero ticket commission."
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
        ctaTitle: "Multi-Event Management Software Built for Agencies Handling Multiple Brands",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
