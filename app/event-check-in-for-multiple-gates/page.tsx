import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Multi-Gate Event Check-In Software & Door Synchronization | UrPass",
  description: "Synchronize check-ins across multiple entrance gates, VIP doors, and concourse turnstiles in real time. Prevent duplicate entry across doors with UrPass.",
  keywords: [
    "event check in multiple gates",
    "event check in multiple gates online",
    "event check in multiple gates platform",
    "event check in multiple gates check in",
    "event check in multiple gates qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-check-in-for-multiple-gates",
  },
  openGraph: {
    title: "Multi-Gate Event Check-In Software & Door Synchronization | UrPass",
    description: "Synchronize check-ins across multiple entrance gates, VIP doors, and concourse turnstiles in real time. Prevent duplicate entry across doors with UrPass.",
    url: "https://urpass.space/event-check-in-for-multiple-gates",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "MULTI-DOOR & CONCOURSE CONTROL",
        h1: "Multi-Gate Event Check-In & Real-Time Door Synchronization",
        canonicalUrl: "https://urpass.space/event-check-in-for-multiple-gates",
        description: "Synchronize check-ins across multiple entrance gates, VIP doors, and concourse turnstiles in real time. Prevent duplicate entry across doors with UrPass.",
        ctaLabel: "Set Up Multi-Gate Check-In",
        ctaHref: "/signup",
        secondaryCtaLabel: "See Door Sync Tech",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best event check-in software for multiple gates?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For multi-gate venues, UrPass links all door scanners into a single real-time network, ensuring sub-150ms atomic pass invalidation so a ticket scanned at Gate 1 cannot be reused at Gate 4.",
          keyPoints: ["Synchronizes unlimited entrance gates, turnstiles, and VIP doors in real time","Sub-150ms atomic record locking stops screenshotted pass reuse across doors","Gate-specific routing permissions (e.g. VIP Only, Press Only, General Admission)","Real-time gate telemetry reporting throughput and queue density per entrance"],
        },
        whatIs: {
          title: "What is Multi-Gate Event Check-In Software?",
          definition: "Multi-gate event check-in software is a synchronized access control solution that connects scanners at different venue entrances to a single real-time database. It ensures that pass validation is instantaneous and coordinated across all doors.",
          details: ["Prevents pass sharing across separate physical entrances in large venues","Allows event managers to allocate staff and scanners dynamically based on gate crowd density","Operates entirely on mobile phone browsers without local server hardware","Provides granular gate-by-gate entry logs and security audit trails"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: ShieldCheck,
            title: "Real-Time Cross-Door Sync",
            desc: "Instant database synchronization ensures passes scanned at Gate A are immediately locked at Gate B.",
          },
          {
            icon: CheckCircle2,
            title: "Gate-Specific Ticket Routing",
            desc: "Configure scanners to only accept specific tiers (e.g. North Gate = VIP, South Gate = General).",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Optical Scanning",
            desc: "High-speed camera scanning maintains rapid passenger throughput across all doors.",
          },
          {
            icon: Lock,
            title: "PIN-Based Scanner Access",
            desc: "Grant gate volunteers instant scanner access via simple PIN codes without password sharing.",
          },
          {
            icon: BarChart3,
            title: "Live Gate Velocity Telemetry",
            desc: "Monitor live scan rates per gate to identify and relieve crowded venue entrances.",
          },
          {
            icon: Zap,
            title: "Zero Hardware Rental",
            desc: "Run all multi-gate operations on staff iPhones or Android smartphones.",
          },
        ],
        deepDiveSections: [
          {
            badge: "MULTI-DOOR SECURITY",
            title: "Why Multi-Gate Events Require Atomic Synchronization",
            paragraphs: ["In venues with multiple entry points (such as stadiums, multi-level convention centers, or campus festivals), attendees often attempt to share digital ticket screenshots with friends waiting at other gates. If the check-in system relies on periodic offline syncing or slow databases, the same pass can gain entry at two different gates simultaneously.","UrPass utilizes atomic database locking with sub-150ms state propagation. The moment a QR code is scanned at Gate 1, the ticket record is locked. If someone presents a screenshot of that same pass at Gate 3 two seconds later, the scanner instantly flashes red with an audio alert showing 'Already Checked In at Gate 1'."],
            bullets: ["Sub-150ms atomic state lock stops cross-gate screenshot fraud instantly","Audio/visual alarms immediately notify door security of reuse attempts","Individual gate audit logs record exact timestamp, scanner ID, and door location","Seamless performance across cellular data and venue Wi-Fi"],
            takeaway: "UrPass multi-gate synchronization provides 100% airtight door security across any number of venue entrances.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Multi-Gate Operational Feature","Legacy Hardware Systems","UrPass Multi-Gate Cloud"],
          rows: [{"col1":"Cross-Gate Sync Speed","col2":"2–10 seconds (vulnerable to duplicate entry)","col3":"Sub-150ms instant atomic lock"},{"col1":"Scanner Setup Time","col2":"Hours of hardware configuration & cabling","col3":"Under 60 seconds (scan PIN link)"},{"col1":"Gate Routing Capability","col2":"Requires expensive dedicated terminals","col3":"Instant tier routing in mobile scanner UI"},{"col1":"Hardware Requirement","col2":"Proprietary handheld laser terminals","col3":"Standard iOS / Android smartphone cameras"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Convention Centers","desc":"Coordinate North, South, and VIP hall entrances simultaneously.","badge":"CONVENTIONS"},{"title":"Campus Festivals & Fests","desc":"Manage multiple college campus perimeter gates and auditorium doors.","badge":"CAMPUS"},{"title":"Music & Sports Arenas","desc":"Synchronize concourse turnstiles and luxury box entrances.","badge":"ARENAS"},{"title":"Multi-Track Conferences","desc":"Scan delegates entering the main hall and restricted breakout rooms.","badge":"CONFERENCES"}],
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
                    "q": "How does multi-gate event check-in work?",
                    "a": "Staff at each gate open the UrPass scanner on their smartphones. When an attendee's QR pass is scanned, UrPass verifies and marks it as used in real time across all active scanners in under 150ms."
          },
          {
                    "q": "Can a ticket be scanned at Gate 1 and then used at Gate 2?",
                    "a": "No. UrPass enforces atomic database row locking. The instant a ticket is checked in at Gate 1, any subsequent scan attempt at Gate 2 will trigger an immediate red 'Already Checked In' warning."
          },
          {
                    "q": "How many gates can UrPass support simultaneously?",
                    "a": "UrPass supports unlimited concurrent gates and scanning devices with no performance degradation."
          },
          {
                    "q": "Can I restrict specific gates to VIP tickets only?",
                    "a": "Yes. You can assign gate rules in the dashboard so that Gate A only validates VIP passes and alerts general ticket holders to proceed to Gate B."
          },
          {
                    "q": "Do volunteers need to create accounts to scan at gates?",
                    "a": "No. Organisers can generate secure volunteer scanner PIN links that grant direct scanning access without requiring accounts or app downloads."
          },
          {
                    "q": "Can organisers monitor check-in progress across all gates in real time?",
                    "a": "Yes. The live telemetry dashboard displays total entries, scans per minute, and attendance breakdown for every individual gate."
          },
          {
                    "q": "What happens if mobile network reception is weak at one gate?",
                    "a": "UrPass is optimized for low-bandwidth cellular environments, transmitting compact verification payloads in milliseconds."
          }
],
        ctaTitle: "Multi-Gate Event Check-In & Real-Time Door Synchronization",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
