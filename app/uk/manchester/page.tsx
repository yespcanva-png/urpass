import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Building2,
  Smartphone,
  Banknote,
  Users,
  Zap,
  Clock,
  Sparkles,
  Layers,
  MapPin,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & Fast QR Check-In Software Manchester | URPASS",
  description:
    "Sub-second event registration and QR check-in software for Manchester conferences, university societies, and music venues. Fast mobile scanning, Victoria Warehouse & Manchester Central offline resilience, 0% ticket cut.",
  keywords: [
    "event registration software manchester",
    "qr event check-in manchester",
    "event ticketing software manchester",
    "manchester conference check-in app",
    "university of manchester society ticketing",
    "manchester central event scanner",
    "zero commission event ticketing manchester",
    "eventbrite alternative manchester",
  ],
  alternates: { canonical: "https://urpass.space/uk/manchester" },
  openGraph: {
    title: "Event Registration & Fast QR Check-In Manchester | URPASS",
    description:
      "Run seamless event check-ins across Manchester venues. Sub-second phone QR scanning, multi-gate sync, offline caching, and 0% ticket commissions.",
    url: "https://urpass.space/uk/manchester",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-MAN",
    "geo.placename": "Manchester",
    "geo.position": "53.4808;-2.2426",
    "ICBM": "53.4808, -2.2426",
  },
};

export default function ManchesterEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/manchester",
        badge: "MANCHESTER EVENT TECH · SUB-SECOND ENTRY CONTROL",
        h1: "Event Registration & Fast QR Check-In Software for Manchester Events",
        description:
          "Keep entrance queues moving at Manchester Central, Victoria Warehouse, and campus venues. Turn volunteer smartphones into instant QR scanners with <0.3s validation, real-time multi-door sync, offline resilience, and 0% ticket fees.",
        ctaLabel: "Start free in Manchester",

        directAnswer: {
          title: "Why Choose URPASS for Manchester Events & Summits?",
          summary:
            "URPASS is high-velocity event registration and gate check-in software engineered for Manchester venues, Northern Powerhouse tech summits, and university societies. It replaces slow manual badge searches and costly scanner rentals with browser-based QR scanning in under 0.3s on standard smartphones. Featuring offline caching for brick warehouse spaces, UK GDPR compliance, and 0% per-ticket commission, URPASS keeps Manchester queues moving rapidly.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning with instant green/red verification",
            "Offline validation engine keeps scanning even when mobile reception drops",
            "0% commission on ticket sales — save thousands compared to Eventbrite UK",
            "30-day instant free trial for Manchester organisers with no card required",
          ],
        },

        keyFactsTable: {
          title: "Manchester Event Check-In & Gate Operations Benchmark",
          subtitle: "How URPASS accelerates entrance gates compared to traditional ticketing providers.",
          headers: ["Feature / Metric", "URPASS Manchester", "Legacy Ticketing Apps (Eventbrite / Fatsoma)"],
          rows: [
            {
              col1: "Scan Speed per Attendee",
              col2: "<0.3 seconds per scan (camera detects from 30cm away)",
              col3: "2.5 to 4.0 seconds (requires screen wake & tap confirmations)",
            },
            {
              col1: "Industrial & Basement Venue Resilience",
              col2: "Full offline caching: validates tickets without cell signal or Wi-Fi",
              col3: "Fails or displays 'network timeout' in low-signal warehouses",
            },
            {
              col1: "Staff Hardware Requirements",
              col2: "Any volunteer phone (browser-based, zero app store downloads)",
              col3: "Mandatory app store downloads or proprietary scanner rentals",
            },
            {
              col1: "Multi-Door Fraud Prevention",
              col2: "Instant cross-door sync flags duplicate scans within 150ms",
              col3: "Sync lag allows duplicate passes to slip through secondary doors",
            },
            {
              col1: "Pricing Model",
              col2: "Flat GBP subscription (£0 / £15 / £35 / £79/mo) with 0% ticket cut",
              col3: "Up to 6.95% + £0.59 deducted from every single ticket sold",
            },
          ],
        },

        productProof: {
          badge: "NORTHERN QUEUE ERADICATION",
          title: "Built for Manchester Tech Summits, Club Nights & Campus Gatherings",
          description:
            "From tech conferences in Manchester Central and Northern Quarter creative workshops to Student Union events at University of Manchester and Manchester Met, URPASS validates attendees rapidly so guests spend their time inside, not waiting outside in rainy weather.",
          type: "scanner",
        },

        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Gate Scanning",
            desc: "Validate passes at 40–50 attendees per minute per volunteer. High-contrast visual feedback and audio cues confirm entry instantly.",
          },
          {
            icon: Zap,
            title: "Warehouse & Offline Mode",
            desc: "Thick Victorian brick walls and underground clubs frequently block 4G/5G. URPASS pre-caches the guest list so scanning never stops.",
          },
          {
            icon: Users,
            title: "Multi-Entrance Synchronisation",
            desc: "Operating multiple entrances at Victoria Warehouse or Manchester Central? Scans sync instantaneously across all door teams.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Full conformity with UK data privacy regulations. Attendee data is stored safely with no ad tracking or dark patterns.",
          },
          {
            icon: Building2,
            title: "Manchester Universities & Societies",
            desc: "Ideal for Oxford Road campus societies. Capture Student IDs, restrict ticket allocations, and run multi-tier ticketing effortlessly.",
          },
          {
            icon: Banknote,
            title: "0% Commission on Ticket Sales",
            desc: "Keep 100% of your box office revenue. Pay a transparent GBP (£) monthly subscription with zero per-ticket percentage cuts.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Setup Event & Manchester Venue Details",
            desc: "Configure your event time in GMT/BST (Europe/London), set venue location, and select custom registration questions.",
          },
          {
            n: "02",
            title: "Issue QR Passes Instantly",
            desc: "Attendees receive clean digital passes with unique QR codes via email or direct shareable link.",
          },
          {
            n: "03",
            title: "Share Scanner PIN with Door Crew",
            desc: "Your door stewards enter the 6-digit PIN on Safari or Chrome — no app installation needed.",
          },
          {
            n: "04",
            title: "Scan Tickets in Under 0.3s",
            desc: "Hold phone camera over the pass for instant green confirmation with attendee name and ticket tier.",
          },
          {
            n: "05",
            title: "Live Attendance Velocity Analytics",
            desc: "Track entry speed, peak arrival windows, and gate distribution in real time from your organiser dashboard.",
          },
        ],

        deepDiveSections: [
          {
            badge: "HIGH-CAPACITY ENTRY",
            title: "Eliminating Registration Queues in Manchester's Rainy Weather",
            paragraphs: [
              "Manchester event organisers know that keeping attendees waiting outside in the rain creates terrible first impressions. Whether it's a 600-delegate tech conference in MediaCityUK or a 1,500-capacity gig in Castlefield, 75% of guests arrive within a short 30-minute rush.",
              "Traditional check-in systems requiring staff to scroll through spreadsheets or wait for slow apps create long bottlenecks. URPASS reads digital QR codes instantly from attendees' phone screens from 30cm away, processing up to 50 entries per minute per lane.",
            ],
            bullets: [
              "Up to 50 check-ins per minute per entrance line",
              "Operates smoothly under dim warehouse lighting and stage spotlights",
              "Stewards use their personal iPhones or Android devices with zero hardware cost",
              "Haptic vibration confirms successful scan in loud music venues",
            ],
            takeaway: "Clear Manchester entrance foyers 3x faster with smartphone camera scanning.",
          },
          {
            badge: "DATA PRIVACY & SOVEREIGNTY",
            title: "UK GDPR Standards for Manchester Enterprise & University Events",
            paragraphs: [
              "From corporate summits to student union balls, UK data protection rules require strict handling of personal information. Legacy platforms often share or retarget attendee emails for their own marketing.",
              "URPASS ensures full compliance with UK GDPR and the Data Protection Act 2018. Your attendee lists belong strictly to your organisation, with one-click CSV export and instant deletion endpoints.",
            ],
            bullets: [
              "Zero attendee retargeting or cross-site tracking pixels",
              "Compliant UK Data Protection Agreement available for enterprise clients",
              "One-click complete CSV data export",
              "Automated attendee data anonymisation and deletion workflows",
            ],
            takeaway: "Meet UK enterprise compliance and university union standards effortlessly.",
          },
        ],

        useCases: [
          "Manchester Tech Festival & Hackathons",
          "MediaCityUK Creative & Media Summits",
          "University of Manchester & MMU Society Events",
          "Victoria Warehouse & Mayfield Depot Gigs",
          "Northern Quarter Design Workshops & Meetups",
          "Manchester Central Trade Shows & Expos",
          "Spinningfields Corporate Conferences & Networking",
          "Altrincham & Didsbury Community Festivals",
        ],

        relatedLinks: [
          {
            title: "UK Event Ticketing Master Hub",
            href: "/uk",
            category: "Location",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Eventbrite Alternative UK Comparison",
            href: "/compare/eventbrite-alternative-uk",
            category: "Comparison",
          },
          {
            title: "Zero Commission Event Ticketing UK",
            href: "/zero-commission-event-ticketing-uk",
            category: "Product",
          },
          {
            title: "University Society Event Ticketing",
            href: "/university-society-event-ticketing",
            category: "Product",
          },
        ],

        faqs: [
          {
            q: "How does URPASS handle Manchester venues with poor cell reception?",
            a: "Historic mills and basement venues around Manchester often experience signal blackouts. URPASS pre-caches the full attendee database into browser memory when door staff log in. Scanning continues smoothly offline and synchronises ticket states when connection is restored.",
          },
          {
            q: "Can University of Manchester and Manchester Met societies use URPASS?",
            a: "Yes. URPASS is designed for student unions and societies. You can record Student ID numbers, course details, verify society memberships, and scan passes at university venues with 0% ticketing commission.",
          },
          {
            q: "How much does URPASS cost for Manchester event organisers?",
            a: "URPASS offers simple, flat GBP pricing: Free (£0 forever for up to 100 registrations/month), Starter (£15/mo for 500 registrations), Pro (£35/mo for 2,500 registrations), and Business (£79/mo for 10,000 registrations). No ticket commission is ever deducted.",
          },
          {
            q: "Do Manchester door stewards need to download an app?",
            a: "No app download is needed. Stewards open a short link or enter a 6-digit PIN in Safari or Chrome on their own smartphones and start scanning immediately.",
          },
          {
            q: "How does URPASS prevent pass screenshot sharing at multiple doors?",
            a: "When a QR pass is scanned at any door, it is recorded in the central database within 150ms. If another attendee tries to enter using a screenshot at another gate, the scanner alerts door staff with a prominent red duplicate warning.",
          },
          {
            q: "How do I start the 30-day free trial in Manchester?",
            a: "Sign up at urpass.space and select Starter, Pro, or Business. For UK accounts, your 30-day free trial activates directly with no credit card or payment gateway setup required.",
          },
        ],

        ctaTitle: "Speed up your next Manchester event entrance",
        ctaDescription: "Join Manchester organisers slashing entrance queues and ticketing fees. Start your 30-day free trial today.",
        geo: {
          region: "GB-MAN",
          placename: "Manchester",
          position: "53.4808;-2.2426",
          latitude: 53.4808,
          longitude: -2.2426,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
