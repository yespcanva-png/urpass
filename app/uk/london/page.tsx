import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Smartphone,
  Banknote,
  Users,
  Zap,
  BarChart3,
  MapPin,
  Clock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software London | 0% Commission | URPASS",
  description:
    "High-speed event registration and QR check-in software for London conferences, university societies, and corporate summits. Sub-second browser scanning, underground offline cache, 0% ticket fees, and UK GDPR compliance.",
  keywords: [
    "event registration software london",
    "qr event check-in london",
    "event ticketing software london",
    "london conference check-in app",
    "students union ticketing london",
    "zero commission event ticketing london",
    "eventbrite alternative london",
  ],
  alternates: { canonical: "https://urpass.space/uk/london" },
  openGraph: {
    title: "Event Registration & Fast QR Check-In London | URPASS",
    description:
      "Run seamless event check-ins across London venues. Sub-second QR phone scanning, multi-gate sync, offline caching for basement venues, and 0% ticket commissions.",
    url: "https://urpass.space/uk/london",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-LND",
    "geo.placename": "London",
    "geo.position": "51.5074;-0.1278",
    "ICBM": "51.5074, -0.1278",
  },
};

export default function LondonEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/london",
        badge: "LONDON EVENT TECH · SUB-SECOND GATE CONTROL",
        h1: "Event Registration & Fast QR Check-In Software for London Events",
        description:
          "Keep entrance queues moving in London's busiest venues. Turn volunteer smartphones into instant QR scanners with <0.3s validation, real-time multi-door sync, offline resilience in basement spaces, and 0% ticket fees.",
        ctaLabel: "Start free in London",

        // 10-Point Standard: Direct Answer (40–60 words)
        directAnswer: {
          title: "Why Choose URPASS for London Events & Conferences?",
          summary:
            "URPASS is high-speed event registration and gate check-in software engineered for London venues, corporate conferences, and university societies. It replaces cumbersome physical badges and costly scanner rentals with browser-based QR scanning in under 0.3s on standard smartphones. Featuring offline caching for underground spaces, UK GDPR compliance, and 0% per-ticket commission, URPASS keeps London queues moving seamlessly.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning with instant green/red verification",
            "Offline validation engine keeps scanning even when mobile reception drops",
            "0% commission on ticket sales — save thousands compared to Eventbrite UK",
            "30-day instant free trial for London organisers with no card required",
          ],
        },

        // 10-Point Standard: Key Facts & Comparison Table
        keyFactsTable: {
          title: "London Event Check-In & Gate Operations Benchmark",
          subtitle: "How URPASS solves London entrance bottlenecks compared to traditional ticketing and check-in apps.",
          headers: ["Feature / Metric", "URPASS London", "Traditional Ticketing Apps (Eventbrite / Bizzabo)"],
          rows: [
            {
              col1: "Check-In Speed per Attendee",
              col2: "<0.3 seconds per scan (camera detects from 30cm away)",
              col3: "2.5 to 4.0 seconds (requires screen wake & tap confirmations)",
            },
            {
              col1: "Underground / Basement Resilience",
              col2: "Full offline caching: validates tickets without cell or Wi-Fi",
              col3: "Fails or displays 'network timeout' in low-signal venues",
            },
            {
              col1: "Hardware Requirements",
              col2: "Any volunteer smartphone (iOS/Android browser, zero app downloads)",
              col3: "Requires proprietary app downloads or expensive leased scanners",
            },
            {
              col1: "Multi-Gate Fraud Prevention",
              col2: "Instant cross-door sync flags duplicate scans within 150ms",
              col3: "Sync delays often allow duplicate passes through different doors",
            },
            {
              col1: "Pricing Model",
              col2: "Flat GBP subscription (£0 / £15 / £35 / £79/mo) with 0% ticket cut",
              col3: "Up to 6.95% + £0.59 deducted from every single ticket sold",
            },
          ],
        },

        // 10-Point Standard: Visual Product Proof
        productProof: {
          badge: "LONDON QUEUE ERADICATION",
          title: "Proven at Fast-Paced London Summits & University Gatherings",
          description:
            "From Shoreditch warehouse spaces and Westminster conference centres to student society venues at UCL, King's College London, Imperial, and LSE, URPASS validates attendees rapidly so guests spend their time networking, not standing in rain outside.",
          type: "scanner",
        },

        features: [
          {
            icon: ScanLine,
            title: "Sub-Second Gate Scanning",
            desc: "Validate passes at a rate of 40–50 attendees per minute per volunteer. High-contrast feedback and audio cues confirm entry instantly.",
          },
          {
            icon: Zap,
            title: "London Basement & Tube Offline Mode",
            desc: "Many historic and subterranean London venues suffer from dead mobile zones. URPASS pre-caches the guest list in memory so scanning never stops.",
          },
          {
            icon: Users,
            title: "Multi-Entrance Synchronisation",
            desc: "Managing multiple doors at Old Truman Brewery, ExCeL, or Business Design Centre? Scans sync instantaneously across all entrance lines.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & Information Commissioner Standards",
            desc: "Full compliance with UK data protection laws. Attendee data is stored securely without third-party advertising trackers or dark patterns.",
          },
          {
            icon: Building2,
            title: "London Universities & Societies",
            desc: "Perfect for Bloomsbury, Strand, and South Kensington student events. Track Student IDs, society membership, and guest quotas effortlessly.",
          },
          {
            icon: Banknote,
            title: "0% Commission on London Ticket Sales",
            desc: "Pay a simple monthly subscription in GBP (£). No surprise booking fees, no checkout penalties, and 30 days free to test.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Setup Event & London Venue Details",
            desc: "Configure your event time in GMT/BST (Europe/London), set venue address, and add custom fields.",
          },
          {
            n: "02",
            title: "Send Digital Passes",
            desc: "Attendees receive clean, minimalist digital passes with unique QR codes via email or direct link.",
          },
          {
            n: "03",
            title: "Share Scanner PIN with Door Team",
            desc: "Staff or volunteers enter the 6-digit scanner PIN on their mobile browser — no App Store downloads needed.",
          },
          {
            n: "04",
            title: "Scan Tickets in Under 0.3s",
            desc: "Hold camera over the QR code. Receive instant visual green verification with attendee name and ticket type.",
          },
          {
            n: "05",
            title: "Live Attendance Velocity Analytics",
            desc: "Monitor check-in velocity, peak entry times, and gate distribution in real time from your organiser dashboard.",
          },
        ],

        deepDiveSections: [
          {
            badge: "HIGH-CAPACITY ENTRY",
            title: "Eliminating Registration Queues at London Venues",
            paragraphs: [
              "Event organisers in London face intense time pressures. Whether it's a 400-person morning tech breakfast in the City or a 2,000-person university freshers' club night in Vauxhall, 80% of your attendees typically arrive within a 25-minute surge window.",
              "Traditional check-in apps that require typing names or tapping through confirmation modals create disastrous 45-minute queues outside in the London rain. URPASS's browser scanner reads digital passes instantly as attendees walk past, validating tickets in less than 300 milliseconds.",
            ],
            bullets: [
              "Up to 50 check-ins per minute per entrance line",
              "Works under bright exhibition lighting and dim nightclub atmospheres",
              "No specialist hardware rentals — door staff use their own iPhones or Android devices",
              "Instant haptic vibration on successful entry for noisy environments",
            ],
            takeaway: "Clear your entrance foyer 3x faster with smartphone camera scanning.",
          },
          {
            badge: "DATA PRIVACY IN LONDON",
            title: "UK GDPR Compliance for London Corporate & University Events",
            paragraphs: [
              "London is a global business capital with stringent corporate compliance standards. When hosting European delegates, financial partners, or university students, using legacy platforms that monetise attendee data with ad trackers creates compliance risks.",
              "URPASS provides full UK GDPR and Data Protection Act 2018 conformity out of the box. You maintain complete data sovereignty, with easy one-click CSV data exports, Article 17 deletion workflows, and transparent cookie consent.",
            ],
            bullets: [
              "Zero attendee tracking pixels or cross-site behavioral targeting",
              "Dedicated Data Protection Agreement (DPA) and UK privacy notice",
              "Full customer data export in standardized CSV format",
              "Automated data deletion request endpoint for attendee rights",
            ],
            takeaway: "Meet enterprise security and university privacy standards effortlessly.",
          },
        ],

        useCases: [
          "London Tech Week Events & Hackathons",
          "Canary Wharf Financial Seminars & Roundtables",
          "UCL, KCL, Imperial & LSE Society Fairs",
          "Shoreditch Creative & Design Workshops",
          "ExCeL & Olympia London Expo Check-Ins",
          "Soho & Fitzrovia Creator Showcases",
          "Westminster Policy Summits & Roundtables",
          "Boutique London Fashion & Arts Shows",
        ],

        relatedLinks: [
          {
            title: "UK Event Ticketing Master Hub",
            href: "/uk",
            category: "Location",
          },
          {
            title: "Eventbrite Alternative UK Comparison",
            href: "/compare/eventbrite-alternative-uk",
            category: "Comparison",
          },
          {
            title: "Multiple Gate Event Check-In",
            href: "/multiple-gate-event-check-in",
            category: "Product",
          },
          {
            title: "Check In 5,000 Attendees at Scale",
            href: "/event-check-in-for-5000-attendees",
            category: "Guide",
          },
          {
            title: "Prevent Duplicate QR Ticket Entry",
            href: "/prevent-duplicate-event-entry",
            category: "Product",
          },
        ],

        faqs: [
          {
            q: "How does URPASS handle London venues with poor phone reception?",
            a: "Many London venues — especially basement spaces in Shoreditch or subterranean halls near the Thames — have spotty mobile network coverage. URPASS pre-caches the full guest list in browser memory when staff open the scanner. Scanning continues smoothly offline and synchronises when connectivity returns.",
          },
          {
            q: "Can London student societies use URPASS for campus events?",
            a: "Yes. URPASS is built with student societies and students' unions in mind. You can capture Student IDs, restrict ticket quantities, and run multi-door check-ins at university events across London without paying Eventbrite's high booking fees.",
          },
          {
            q: "How much does URPASS cost for London organisers?",
            a: "URPASS has simple pricing in GBP: Free (£0 forever for up to 100 registrations/month), Starter (£15/mo for 500 registrations), Pro (£35/mo for 2,500 registrations), and Business (£79/mo for 10,000 registrations). We take 0% per-ticket commission, saving you hundreds of pounds per event.",
          },
          {
            q: "Do volunteer scanners need to download an iOS or Android app?",
            a: "No app download is needed. Organisers share a private scanner link or 6-digit PIN. Volunteers open it in Safari or Chrome on their phone and immediately start scanning passes using their camera.",
          },
          {
            q: "What prevents someone from sharing a screenshot of their London ticket?",
            a: "Once a QR pass is scanned at any door, the record is immediately committed to the central database. If an attendee tries to enter using a shared screenshot at another entrance, the scanner instantly flashes red with an 'ALREADY CHECKED IN' alert and exact timestamp.",
          },
          {
            q: "How do I activate the 30-day free trial in London?",
            a: "Simply sign up on urpass.space and choose Starter, Pro, or Business. For UK accounts, your 30-day free trial activates instantly with no credit card or payment gateway required.",
          },
        ],

        ctaTitle: "Streamline your next London event entrance",
        ctaDescription: "Join London organisers cutting queue times and ticket fees. Start your 30-day free trial today.",
        geo: {
          region: "GB-LND",
          placename: "London",
          position: "51.5074;-0.1278",
          latitude: 51.5074,
          longitude: -0.1278,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
