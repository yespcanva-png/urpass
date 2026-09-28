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
  title: "Event Registration & Fast QR Check-In Software Edinburgh | URPASS",
  description:
    "Sub-second event registration and QR check-in software for Edinburgh conferences, Fringe shows, and university societies. Fast camera scanning, EICC & historic venue offline caching, 0% ticket fees, and UK GDPR compliance.",
  keywords: [
    "event registration software edinburgh",
    "qr event check-in edinburgh",
    "event ticketing software edinburgh",
    "eicc conference check-in app",
    "university of edinburgh society tickets",
    "edinburgh fringe ticketing software",
    "zero commission event ticketing scotland",
    "eventbrite alternative edinburgh",
  ],
  alternates: { canonical: "https://urpass.space/uk/edinburgh" },
  openGraph: {
    title: "Event Registration & Fast QR Check-In Edinburgh | URPASS",
    description:
      "Run seamless event check-ins across Edinburgh venues. Sub-second QR scanning, multi-gate sync, offline mode for thick stone buildings, and 0% ticket fees.",
    url: "https://urpass.space/uk/edinburgh",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-EDH",
    "geo.placename": "Edinburgh",
    "geo.position": "55.9533;-3.1883",
    "ICBM": "55.9533, -3.1883",
  },
};

export default function EdinburghEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/edinburgh",
        badge: "EDINBURGH EVENT TECH · SUB-SECOND DOOR CONTROL",
        h1: "Event Registration & Fast QR Check-In Software for Edinburgh Events",
        description:
          "Keep entrance lines flowing at EICC, historic Old Town venues, and university auditoriums. Turn volunteer smartphones into instant QR scanners with <0.3s validation, real-time multi-door sync, offline resilience in thick stone venues, and 0% ticket fees.",
        ctaLabel: "Start free in Edinburgh",

        directAnswer: {
          title: "Why Choose URPASS for Edinburgh Events & Festivals?",
          summary:
            "URPASS is high-speed event registration and gate check-in software engineered for Edinburgh venues, academic conferences at EICC, and student societies. It replaces slow name check-offs and costly scanner rentals with browser-based QR scanning in under 0.3s on standard smartphones. Featuring offline caching for historic stone buildings, UK GDPR compliance, and 0% per-ticket commission, URPASS keeps Scottish queues moving smoothly.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning with instant green/red verification",
            "Offline validation engine keeps scanning even when mobile reception drops",
            "0% commission on ticket sales — save thousands compared to Eventbrite UK",
            "30-day instant free trial for Edinburgh organisers with no card required",
          ],
        },

        keyFactsTable: {
          title: "Edinburgh Event Check-In & Gate Operations Benchmark",
          subtitle: "How URPASS speeds up entrance gates compared to traditional ticketing providers.",
          headers: ["Feature / Metric", "URPASS Edinburgh", "Legacy Ticketing Apps (Eventbrite / Citizen Ticket)"],
          rows: [
            {
              col1: "Scan Speed per Attendee",
              col2: "<0.3 seconds per scan (camera detects from 30cm away)",
              col3: "2.5 to 4.0 seconds (requires screen wake & tap confirmations)",
            },
            {
              col1: "Historic Stone Venue Resilience",
              col2: "Full offline caching: validates tickets without cell signal or Wi-Fi",
              col3: "Fails or displays 'network timeout' through thick masonry walls",
            },
            {
              col1: "Staff Hardware Requirements",
              col2: "Any volunteer smartphone (browser-based, zero app store downloads)",
              col3: "Mandatory app store downloads or leased handheld hardware",
            },
            {
              col1: "Multi-Gate Fraud Prevention",
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
          badge: "SCOTTISH QUEUE ELIMINATION",
          title: "Built for Edinburgh Academic Summits, Fringe Shows & Student Balls",
          description:
            "From international symposiums at EICC and tech gatherings at CodeBase to EUSA society galas at Teviot and Bristo Square, URPASS validates attendees rapidly so guests spend their time inside, not waiting outside in cold Scottish weather.",
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
            title: "Old Town & Stone Wall Offline Mode",
            desc: "Thick stone walls in historic Old Town and subterranean Edinburgh venues block mobile signal. URPASS pre-caches the guest list in memory so scanning never stops.",
          },
          {
            icon: Users,
            title: "Multi-Door Synchronisation",
            desc: "Managing multiple entrance halls or tiered seating at EICC? Scans sync instantaneously across all door teams in real time.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Full conformity with UK data privacy regulations. Attendee data is stored safely with no ad tracking or dark patterns.",
          },
          {
            icon: Building2,
            title: "Edinburgh Universities & Societies",
            desc: "Ideal for University of Edinburgh, Heriot-Watt, and Napier societies. Capture Student IDs, verify society memberships, and run multi-tier ticketing effortlessly.",
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
            title: "Setup Event & Edinburgh Venue Details",
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
            title: "Eliminating Registration Queues in Edinburgh's Historic Venues",
            paragraphs: [
              "Edinburgh hosts world-class cultural festivals, international medical congresses, and prestigious academic symposiums. When hundreds of delegates arrive simultaneously at the EICC or university auditoriums, paper guest lists and laggy apps create frustrating queues.",
              "Traditional check-in systems requiring staff to scroll through lists create long bottlenecks. URPASS reads digital QR codes instantly from attendees' phone screens from 30cm away, processing up to 50 entries per minute per lane.",
            ],
            bullets: [
              "Up to 50 check-ins per minute per entrance line",
              "Operates smoothly under low lighting in historic theatres and vaulted halls",
              "Stewards use their personal iPhones or Android devices with zero hardware cost",
              "Haptic vibration confirms successful scan in bustling environments",
            ],
            takeaway: "Clear Edinburgh entrance foyers 3x faster with smartphone camera scanning.",
          },
          {
            badge: "DATA PRIVACY & SOVEREIGNTY",
            title: "UK GDPR Standards for Scottish Academic & Enterprise Events",
            paragraphs: [
              "Academic institutions and medical bodies require the highest data governance standards. Storing attendee data on platforms that monetize emails with advertising trackers presents serious compliance risks.",
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
          "EICC International Conferences & Symposiums",
          "Edinburgh Festival Fringe Independent Shows",
          "University of Edinburgh (EUSA) Society Fairs & Balls",
          "CodeBase Tech Meetups & Startup Demo Days",
          "Assembly Rooms Galas & Award Dinners",
          "Heriot-Watt & Napier Academic Colloquiums",
          "George Street Corporate Networking Nights",
          "Leith Creative & Arts Exhibitions",
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
            q: "How does URPASS handle Old Town venues with thick stone walls?",
            a: "Historic stone buildings in Edinburgh often have little to no cellular reception. URPASS pre-caches the full attendee database into browser memory when door staff open the scanner. Scanning continues smoothly offline and synchronises ticket states automatically when network connectivity is available.",
          },
          {
            q: "Can University of Edinburgh (EUSA) societies use URPASS?",
            a: "Yes. URPASS is designed for student unions and societies. You can record Student ID numbers, course details, verify society memberships, and scan passes at campus venues with 0% ticketing commission.",
          },
          {
            q: "How much does URPASS cost for Edinburgh event organisers?",
            a: "URPASS offers simple, flat GBP pricing: Free (£0 forever for up to 100 registrations/month), Starter (£15/mo for 500 registrations), Pro (£35/mo for 2,500 registrations), and Business (£79/mo for 10,000 registrations). No ticket commission is ever deducted.",
          },
          {
            q: "Do Edinburgh door stewards need to download an app?",
            a: "No app download is needed. Stewards open a short link or enter a 6-digit PIN in Safari or Chrome on their own smartphones and start scanning immediately.",
          },
          {
            q: "How does URPASS prevent pass screenshot sharing at multiple doors?",
            a: "When a QR pass is scanned at any door, it is recorded in the central database within 150ms. If another attendee tries to enter using a screenshot at another gate, the scanner alerts door staff with a prominent red duplicate warning.",
          },
          {
            q: "How do I start the 30-day free trial in Edinburgh?",
            a: "Sign up at urpass.space and select Starter, Pro, or Business. For UK accounts, your 30-day free trial activates directly with no credit card or payment gateway setup required.",
          },
        ],

        ctaTitle: "Accelerate your next Edinburgh event entrance",
        ctaDescription: "Join Edinburgh organisers slashing entrance queues and ticketing fees. Start your 30-day free trial today.",
        geo: {
          region: "GB-EDH",
          placename: "Edinburgh",
          position: "55.9533;-3.1883",
          latitude: 55.9533,
          longitude: -3.1883,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
