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
  title: "Event Registration & Fast QR Check-In Software Birmingham | URPASS",
  description:
    "High-speed event registration and QR check-in software for Birmingham conferences, trade shows at NEC & ICC, and university societies. 0.3s camera scanning, offline gate sync, 0% ticket fees, and UK GDPR compliance.",
  keywords: [
    "event registration software birmingham",
    "qr event check-in birmingham",
    "event ticketing software birmingham",
    "nec birmingham event check-in app",
    "icc birmingham conference ticketing",
    "university of birmingham society tickets",
    "zero commission event ticketing midlands",
    "eventbrite alternative birmingham",
  ],
  alternates: { canonical: "https://urpass.space/uk/birmingham" },
  openGraph: {
    title: "Event Registration & Fast QR Check-In Birmingham | URPASS",
    description:
      "Run seamless event check-ins across Birmingham venues. Sub-second QR scanning, multi-gate sync, offline mode for massive halls, and 0% ticket cut.",
    url: "https://urpass.space/uk/birmingham",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-BIR",
    "geo.placename": "Birmingham",
    "geo.position": "52.4862;-1.8904",
    "ICBM": "52.4862, -1.8904",
  },
};

export default function BirminghamEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/birmingham",
        badge: "BIRMINGHAM EVENT TECH · SUB-SECOND GATE ENTRY",
        h1: "Event Registration & Fast QR Check-In Software for Birmingham Events",
        description:
          "Keep entrance lines flowing at NEC Birmingham, ICC, and Midlands venues. Turn volunteer smartphones into instant QR scanners with <0.3s validation, real-time multi-door sync, offline resilience in large exhibition halls, and 0% ticket fees.",
        ctaLabel: "Start free in Birmingham",

        directAnswer: {
          title: "Why Choose URPASS for Birmingham Events & Conferences?",
          summary:
            "URPASS is high-speed event registration and gate check-in software engineered for Birmingham venues, NEC exhibitions, and university societies. It replaces slow barcode scanners and expensive device rentals with browser-based QR scanning in under 0.3s on standard smartphones. Featuring offline caching for massive halls, UK GDPR compliance, and 0% per-ticket commission, URPASS keeps Midlands queues moving smoothly.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning with instant green/red verification",
            "Offline validation engine keeps scanning even when hall Wi-Fi drops",
            "0% commission on ticket sales — save thousands compared to Eventbrite UK",
            "30-day instant free trial for Birmingham organisers with no card required",
          ],
        },

        keyFactsTable: {
          title: "Birmingham Event Check-In & Gate Operations Benchmark",
          subtitle: "How URPASS speeds up entrance gates compared to traditional ticketing providers.",
          headers: ["Feature / Metric", "URPASS Birmingham", "Legacy Ticketing Apps (Eventbrite / Ticketmaster)"],
          rows: [
            {
              col1: "Scan Speed per Attendee",
              col2: "<0.3 seconds per scan (camera detects from 30cm away)",
              col3: "2.5 to 4.0 seconds (requires screen wake & tap confirmations)",
            },
            {
              col1: "Large Exhibition Hall Resilience",
              col2: "Full offline caching: validates tickets without cell signal or Wi-Fi",
              col3: "Fails or displays 'network timeout' under dense Wi-Fi congestion",
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
          badge: "MIDLANDS QUEUE ELIMINATION",
          title: "Engineered for NEC Expos, Digbeth Meetups & University Events",
          description:
            "From national trade fairs at NEC Birmingham and executive summits at ICC to student society fests at University of Birmingham and Aston, URPASS validates attendees rapidly so guests spend their time networking, not queuing in entrance foyers.",
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
            title: "NEC & Exhibition Hall Offline Mode",
            desc: "Cell networks get jammed when 5,000+ attendees fill an exhibition hall. URPASS pre-caches the guest list in memory so scanning never stalls.",
          },
          {
            icon: Users,
            title: "Multi-Door Synchronisation",
            desc: "Managing multiple entrance halls or VIP doors at ICC Birmingham? Scans sync instantaneously across all door teams in real time.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Full conformity with UK data privacy regulations. Attendee data is stored safely with no ad tracking or dark patterns.",
          },
          {
            icon: Building2,
            title: "Birmingham Guild of Students & Societies",
            desc: "Ideal for University of Birmingham, Aston, and BCU events. Capture Student IDs, verify society memberships, and run multi-tier ticketing effortlessly.",
          },
          {
            icon: Banknote,
            title: "0% Commission on Ticket Sales",
            desc: "Keep 100% of your ticket revenue. Pay a straightforward GBP (£) monthly subscription with zero per-ticket percentage cuts.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Setup Event & Birmingham Venue Details",
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
            title: "Eliminating Registration Queues in Birmingham's Busiest Halls",
            paragraphs: [
              "Birmingham hosts some of the UK's largest exhibitions, trade shows, and conferences. When hundreds of delegates disembark from Birmingham New Street or Birmingham International at the same time, entrance halls can get overwhelmed in minutes.",
              "Traditional check-in systems that rely on slow hardware scanners or manual name searches create disastrous queues. URPASS reads digital QR codes instantly from attendees' phone screens, processing up to 50 entries per minute per lane.",
            ],
            bullets: [
              "Up to 50 check-ins per minute per entrance line",
              "Operates smoothly under bright convention lighting and dark auditoriums",
              "Stewards use their personal iPhones or Android devices with zero hardware cost",
              "Haptic vibration confirms successful scan in noisy trade environments",
            ],
            takeaway: "Clear Birmingham entrance halls 3x faster with smartphone camera scanning.",
          },
          {
            badge: "DATA PRIVACY & SOVEREIGNTY",
            title: "UK GDPR Standards for Birmingham Enterprise & Guild Events",
            paragraphs: [
              "Corporate exhibitors and university student guilds require complete control over attendee data. Using legacy platforms that retarget attendees or share data with third-party advertisers creates compliance issues.",
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
          "NEC Birmingham Trade Shows & Expos",
          "ICC Birmingham Corporate & Medical Conferences",
          "University of Birmingham Guild of Students Fairs",
          "Aston University Tech & Innovation Hackathons",
          "Digbeth Custard Factory Creative Events",
          "O2 Academy Birmingham Music & Club Gigs",
          "Birmingham Tech Week Seminars & Panels",
          "Solihull & Colmore Row Business Roundtables",
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
            q: "How does URPASS perform at large venues like the NEC Birmingham?",
            a: "Large halls at the NEC often suffer from mobile signal degradation when thousands of attendees connect simultaneously. URPASS pre-caches the full attendee database into browser memory when door staff open the scanner. Scanning continues smoothly offline and synchronises ticket states automatically when network connectivity is available.",
          },
          {
            q: "Can University of Birmingham Guild societies use URPASS?",
            a: "Yes. URPASS is designed for student unions and societies. You can record Student ID numbers, course details, verify society memberships, and scan passes at campus venues with 0% ticketing commission.",
          },
          {
            q: "How much does URPASS cost for Birmingham event organisers?",
            a: "URPASS offers simple, flat GBP pricing: Free (£0 forever for up to 100 registrations/month), Starter (£15/mo for 500 registrations), Pro (£35/mo for 2,500 registrations), and Business (£79/mo for 10,000 registrations). No ticket commission is ever deducted.",
          },
          {
            q: "Do Birmingham door stewards need to download an app?",
            a: "No app download is needed. Stewards open a short link or enter a 6-digit PIN in Safari or Chrome on their own smartphones and start scanning immediately.",
          },
          {
            q: "How does URPASS prevent pass screenshot sharing at multiple doors?",
            a: "When a QR pass is scanned at any door, it is recorded in the central database within 150ms. If another attendee tries to enter using a screenshot at another gate, the scanner alerts door staff with a prominent red duplicate warning.",
          },
          {
            q: "How do I start the 30-day free trial in Birmingham?",
            a: "Sign up at urpass.space and select Starter, Pro, or Business. For UK accounts, your 30-day free trial activates directly with no credit card or payment gateway setup required.",
          },
        ],

        ctaTitle: "Accelerate your next Birmingham event entrance",
        ctaDescription: "Join Birmingham organisers slashing entrance queues and ticketing fees. Start your 30-day free trial today.",
        geo: {
          region: "GB-BIR",
          placename: "Birmingham",
          position: "52.4862;-1.8904",
          latitude: 52.4862,
          longitude: -1.8904,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
