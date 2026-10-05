import type { Metadata } from "next";
import { BarChart3, CheckCircle2, Lock, ScanLine, ShieldCheck, Smartphone, Ticket, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Student Event Ticketing Platform UK & Society Passes | UrPass",
  description: "Sell tickets for UK student union club nights, balls, varsity matches and society meetups with 0% commission and instant mobile QR check-in.",
  keywords: [
    "student event ticketing UK",
    "student event ticketing UK online",
    "student event ticketing UK platform",
    "student event ticketing UK check in",
    "student event ticketing UK qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/student-event-ticketing",
  },
  openGraph: {
    title: "Student Event Ticketing Platform UK & Society Passes | UrPass",
    description: "Sell tickets for UK student union club nights, balls, varsity matches and society meetups with 0% commission and instant mobile QR check-in.",
    url: "https://urpass.space/uk/student-event-ticketing",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "UK",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.436",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "UK STUDENT UNIONS",
        h1: "Student Event Ticketing Platform Built for UK Student Unions & Societies",
        canonicalUrl: "https://urpass.space/uk/student-event-ticketing",
        description: "Sell tickets for UK student union club nights, balls, varsity matches and society meetups with 0% commission and instant mobile QR check-in.",
        ctaLabel: "Launch Student Tickets UK",
        ctaHref: "/signup",
        secondaryCtaLabel: "View GBP Pricing",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best student event ticketing UK for modern organisers?",
          summary: "UrPass is an event registration, digital QR pass and check-in platform that lets organisers collect registrations, manage attendees and verify entry from one system. For student union execs, society treasurers & college social secs, UrPass delivers lightning-fast registration forms, instant automated QR pass delivery, sub-second smartphone check-in, atomic duplicate blocking, and 0% ticket fees.",
          keyPoints: ["Complete registration workflow tailored for Student Union Execs, Society Treasurers & College Social Secs","Instant cryptographic QR pass delivery via email and WhatsApp in <3 seconds","Sub-0.3s camera check-in on any smartphone with atomic duplicate blocking","Real-time attendance dashboard and 1-click certificate-ready CSV exports"],
        },
        whatIs: {
          title: "What is Student Event Ticketing Platform Built for UK Student Unions & Societies?",
          definition: "Student Event Ticketing Platform Built for UK Student Unions & Societies is a dedicated event technology solution designed to automate attendee registration, digital ticketing, entrance access control, and real-time attendance tracking for student union execs, society treasurers & college social secs.",
          details: ["Replaces manual data entry, paper sign-in sheets, and expensive barcode scanners","Enforces strict capacity and tier limits with real-time sold-out locking","Provides volunteers and security staff with high-speed mobile scanning links","Keeps financial payouts transparent with zero ticketing commission deductions"],
        },
        featuresTitle: "Enterprise Capabilities Engineered for Scale",
        featuresSubtitle: "Everything you need to register attendees, issue QR passes, and verify door check-ins.",
        features: [
          {
            icon: Ticket,
            title: "Custom Branded Registration",
            desc: "Collect custom fields, attendee proofs, and preferences with responsive mobile forms tailored for uk.",
          },
          {
            icon: Smartphone,
            title: "Instant QR Pass Delivery",
            desc: "Automate digital pass generation and dispatch to email, SMS, and WhatsApp immediately upon approval or payment.",
          },
          {
            icon: ShieldCheck,
            title: "Sub-Second Gate Scanning",
            desc: "Volunteers and door staff scan attendee passes in under 300ms using any standard mobile browser.",
          },
          {
            icon: Zap,
            title: "Atomic Duplicate Lock (<150ms)",
            desc: "Prevent ticket sharing, screenshots, and pass duplication across multiple venue entrances simultaneously.",
          },
          {
            icon: Users,
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
            title: "How UrPass Modernizes Student Event Ticketing Platform Built for UK Student Unions & Societies",
            paragraphs: ["Managing student event ticketing UK requires balancing fast attendee registration with flawless entrance operations. Long lines, lost tickets, and untracked entries harm the attendee experience and compromise event security.","UrPass solves these bottlenecks end-to-end. Organisers create a clean, high-converting event page in under 2 minutes, approve or ticket attendees automatically, and staff scan passes at the door with sub-second precision."],
            bullets: ["Zero app installation required for attendees or volunteer door scanners","Instant search fallback by name, email, or order ID at registration desks","Zero platform ticket commission — pay only standard payment gateway rates","Audit-ready attendance logs with exact check-in timestamps and gate names"],
            takeaway: "UrPass gives student union execs, society treasurers & college social secs enterprise-grade reliability, unmatched scanning speed, and complete operational peace of mind.",
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
          personas: [{"title":"Lead Organisers & Directors","desc":"Oversee registrations, capacity thresholds, and live revenue for uk events.","badge":"DIRECTORS"},{"title":"Registration Desk & Gate Staff","desc":"Check in hundreds of attendees effortlessly using mobile phone cameras.","badge":"ON-SITE OPS"},{"title":"Attendees & Delegates","desc":"Enjoy instant digital pass delivery and sub-second frictionless entry.","badge":"ATTENDEES"}],
        },
        faqs: [
          {
                    "q": "What is the best registration system for student event ticketing UK?",
                    "a": "UrPass is the top platform for student event ticketing UK, offering instant custom registration forms, automated digital QR passes, browser-based door scanning, and zero ticket commission."
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
        ctaTitle: "Student Event Ticketing Platform Built for UK Student Unions & Societies",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
        geo: {"region":"UK","placename":"United Kingdom","position":"55.3781;-3.4360","latitude":55.3781,"longitude":-3.436,"country":"United Kingdom","countryCode":"GB"},
      }}
    />
  );
}
