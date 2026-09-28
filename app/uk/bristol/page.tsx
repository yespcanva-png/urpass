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
  title: "Event Registration & Fast QR Check-In Software Bristol | URPASS",
  description:
    "Sub-second event registration and QR check-in software for Bristol conferences, creative festivals, and university societies. Instant camera scanning, Motion & Bristol Beacon offline resilience, 0% ticket fees, and UK GDPR compliance.",
  keywords: [
    "event registration software bristol",
    "qr event check-in bristol",
    "event ticketing software bristol",
    "bristol beacon event check-in",
    "university of bristol society tickets",
    "bristol tech festival ticketing",
    "zero commission event ticketing south west",
    "eventbrite alternative bristol",
  ],
  alternates: { canonical: "https://urpass.space/uk/bristol" },
  openGraph: {
    title: "Event Registration & Fast QR Check-In Bristol | URPASS",
    description:
      "Run seamless event check-ins across Bristol venues. Sub-second phone QR scanning, multi-gate sync, offline mode for industrial spaces, and 0% ticket fees.",
    url: "https://urpass.space/uk/bristol",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-BST",
    "geo.placename": "Bristol",
    "geo.position": "51.4545;-2.5879",
    "ICBM": "51.4545, -2.5879",
  },
};

export default function BristolEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/bristol",
        badge: "BRISTOL EVENT TECH · SUB-SECOND GATE SCANNING",
        h1: "Event Registration & Fast QR Check-In Software for Bristol Events",
        description:
          "Keep entrance queues moving at Bristol Beacon, Passenger Shed, Motion, and campus venues. Turn volunteer smartphones into instant QR scanners with <0.3s validation, real-time multi-door sync, offline resilience, and 0% ticket fees.",
        ctaLabel: "Start free in Bristol",

        directAnswer: {
          title: "Why Choose URPASS for Bristol Events & Summits?",
          summary:
            "URPASS is high-speed event registration and gate check-in software engineered for Bristol venues, South West tech summits, and university societies. It replaces slow manual badge searches and costly scanner rentals with browser-based QR scanning in under 0.3s on standard smartphones. Featuring offline caching for converted warehouse spaces, UK GDPR compliance, and 0% per-ticket commission, URPASS keeps Bristol queues moving rapidly.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning with instant green/red verification",
            "Offline validation engine keeps scanning even when mobile reception drops",
            "0% commission on ticket sales — save thousands compared to Eventbrite UK",
            "30-day instant free trial for Bristol organisers with no card required",
          ],
        },

        keyFactsTable: {
          title: "Bristol Event Check-In & Gate Operations Benchmark",
          subtitle: "How URPASS accelerates entrance gates compared to traditional ticketing providers.",
          headers: ["Feature / Metric", "URPASS Bristol", "Legacy Ticketing Apps (Eventbrite / Headfirst Bristol)"],
          rows: [
            {
              col1: "Scan Speed per Attendee",
              col2: "<0.3 seconds per scan (camera detects from 30cm away)",
              col3: "2.5 to 4.0 seconds (requires screen wake & tap confirmations)",
            },
            {
              col1: "Industrial & Harbourside Venue Resilience",
              col2: "Full offline caching: validates tickets without cell signal or Wi-Fi",
              col3: "Fails or displays 'network timeout' in low-signal warehouse spaces",
            },
            {
              col1: "Staff Hardware Requirements",
              col2: "Any volunteer smartphone (browser-based, zero app store downloads)",
              col3: "Mandatory app store downloads or proprietary handheld rentals",
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
          badge: "SOUTH WEST QUEUE ERADICATION",
          title: "Built for Bristol Tech Summits, Creative Showcases & Student Balls",
          description:
            "From tech gatherings at Watershed and exhibitions at Bristol Beacon to Bristol SU student events at the Richmond Building and Motion warehouse nights, URPASS validates attendees rapidly so guests spend their time inside, not waiting outside in rainy queues.",
          type: "scanner",
        },

        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Gate Scanning",
            desc: "Validate passes at a rate of 40–50 attendees per minute per volunteer. High-contrast visual feedback and audio cues confirm entry instantly.",
          },
          {
            icon: Zap,
            title: "Harbourside & Warehouse Offline Mode",
            desc: "Converted industrial warehouses and waterfront cellars often suffer from dead mobile zones. URPASS pre-caches the guest list so scanning never stops.",
          },
          {
            icon: Users,
            title: "Multi-Entrance Synchronisation",
            desc: "Managing multiple entrance doors at Bristol Beacon or Passenger Shed? Scans sync instantaneously across all door teams in real time.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Full conformity with UK data privacy regulations. Attendee data is stored safely with no ad tracking or dark patterns.",
          },
          {
            icon: Building2,
            title: "Bristol SU & UWE Societies",
            desc: "Ideal for University of Bristol and UWE societies. Capture Student IDs, verify society memberships, and run multi-tier ticketing effortlessly.",
          },
          {
            icon: Banknote,
            title: "0% Commission on Ticket Sales",
            desc: "Keep 100% of your box office revenue. Pay a straightforward GBP (£) monthly subscription with zero per-ticket percentage cuts.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Setup Event & Bristol Venue Details",
            desc: "Configure your event time in GMT/BST (Europe/London), set venue location, and customize registration fields.",
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
            title: "Eliminating Registration Queues in Bristol's Creative Venues",
            paragraphs: [
              "Bristol is renowned for independent creativity, cutting-edge technology festivals, and vibrant campus life. When hundreds of attendees arrive at once for a creative showcase or evening gig, manual paper lists or clunky apps create unacceptable delays.",
              "URPASS reads digital QR codes instantly from attendees' phone screens from 30cm away, processing up to 50 entries per minute per lane. Stewards keep queues moving smoothly even through peak entry rushes.",
            ],
            bullets: [
              "Up to 50 check-ins per minute per entrance line",
              "Operates smoothly under low lighting in converted industrial venues",
              "Stewards use their personal iPhones or Android devices with zero hardware cost",
              "Haptic vibration confirms successful scan in loud music venues",
            ],
            takeaway: "Clear Bristol entrance foyers 3x faster with smartphone camera scanning.",
          },
          {
            badge: "DATA PRIVACY & SOVEREIGNTY",
            title: "UK GDPR Standards for Bristol Tech & University Events",
            paragraphs: [
              "Organisers in Bristol prioritize digital privacy and ethical technology. Using legacy ticketing platforms that monetize attendee data with tracking pixels conflicts with community values.",
              "URPASS provides complete UK GDPR and Data Protection Act 2018 compliance out of the box. You maintain complete data sovereignty, with easy one-click CSV data exports, Article 17 deletion workflows, and transparent cookie consent.",
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
          "Bristol Technology Festival & Tech Meetups",
          "Watershed Creative & Film Showcases",
          "University of Bristol (Bristol SU) Society Fairs",
          "UWE Bristol Welcome Week Events",
          "Bristol Beacon Concerts & Conferences",
          "Motion Bristol Evening & Club Events",
          "Harbourside Sustainable Living & Food Festivals",
          "Clifton & Stokes Croft Arts Exhibitions",
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
            title: "Manchester Event Registration & Check-In",
            href: "/uk/manchester",
            category: "Location",
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
            q: "How does URPASS handle converted warehouse venues in Bristol?",
            a: "Industrial and harbourside warehouse venues in Bristol often suffer from signal dead-zones. URPASS pre-caches the full attendee database into browser memory when door staff open the scanner. Scanning continues smoothly offline and synchronises ticket states automatically when network connectivity is available.",
          },
          {
            q: "Can University of Bristol and UWE societies use URPASS?",
            a: "Yes. URPASS is designed for student unions and societies. You can record Student ID numbers, course details, verify society memberships, and scan passes at campus venues with 0% ticketing commission.",
          },
          {
            q: "How much does URPASS cost for Bristol event organisers?",
            a: "URPASS offers simple, flat GBP pricing: Free (£0 forever for up to 100 registrations/month), Starter (£15/mo for 500 registrations), Pro (£35/mo for 2,500 registrations), and Business (£79/mo for 10,000 registrations). No ticket commission is ever deducted.",
          },
          {
            q: "Do Bristol door stewards need to download an app?",
            a: "No app download is needed. Stewards open a short link or enter a 6-digit PIN in Safari or Chrome on their own smartphones and start scanning immediately.",
          },
          {
            q: "How does URPASS prevent pass screenshot sharing at multiple doors?",
            a: "When a QR pass is scanned at any door, it is recorded in the central database within 150ms. If another attendee tries to enter using a screenshot at another gate, the scanner alerts door staff with a prominent red duplicate warning.",
          },
          {
            q: "How do I start the 30-day free trial in Bristol?",
            a: "Sign up at urpass.space and select Starter, Pro, or Business. For UK accounts, your 30-day free trial activates directly with no credit card or payment gateway setup required.",
          },
        ],

        ctaTitle: "Streamline your next Bristol event entrance",
        ctaDescription: "Join Bristol organisers slashing entrance queues and ticketing fees. Start your 30-day free trial today.",
        geo: {
          region: "GB-BST",
          placename: "Bristol",
          position: "51.4545;-2.5879",
          latitude: 51.4545,
          longitude: -2.5879,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
