import type { Metadata } from "next";
import {
  ScanLine,
  Smartphone,
  Zap,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BarChart3,
  QrCode,
  Sliders,
  AlertCircle,
  Laptop,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Check-In Software with QR Scanning — Fast Door Entry | UrPass",
  description:
    "Sub-second event check-in software using any smartphone camera. Eliminate gate lines, block duplicate tickets, and track attendance live across multiple doors with zero app downloads.",
  keywords: [
    "event check-in software with qr scanning",
    "event check in app",
    "qr code event check in software",
    "mobile ticket scanner for events",
    "fast event entrance check in",
    "conference check in system",
  ],
  alternates: {
    canonical: "https://urpass.space/solutions/event-check-in-software",
  },
  openGraph: {
    title: "Event Check-In Software with QR Scanning — Fast Door Entry | UrPass",
    description:
      "Transform any phone into an enterprise ticket scanner in seconds. Zero hardware rentals, sub-0.3s validation, and live attendance metrics.",
    url: "https://urpass.space/solutions/event-check-in-software",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Check-In Software with QR Scanning | UrPass",
    description:
      "Check in 1,000+ attendees per hour without renting barcode hardware. Web browser camera scanning for iOS and Android.",
  },
};

export default function EventCheckInSoftwareSolutionPage() {
  return (
    <SEOPage
      config={{
        badge: "CORE SOLUTION // GATE CHECK-IN",
        h1: "Event Check-In Software with Lightning-Fast QR Scanning",
        canonicalUrl: "https://urpass.space/solutions/event-check-in-software",
        description:
          "Welcome guests with confidence. Turn volunteer smartphones into sub-0.3-second ticket scanners with zero app downloads, live multi-door sync, and instant attendance counts.",
        ctaLabel: "Try Free Gate Scanner",
        ctaHref: "/signup",
        secondaryCtaLabel: "Read High-Capacity Guide",
        secondaryCtaHref: "/guides/manage-1000-event-attendees",

        // GEO Direct Answer
        directAnswer: {
          title: "What is the Best Event Check-In Software for High-Volume Entrances?",
          summary:
            "Event check-in software with QR scanning automates guest arrival verification, eliminating paper guest rosters and entrance congestion. UrPass runs directly inside mobile web browsers (Safari & Chrome) on any standard smartphone or tablet. Volunteers scan attendee QR passes in under 0.3 seconds, receiving immediate visual green/red feedback and auditory chimes while the central dashboard logs real-time attendance velocity across all entry gates.",
          keyPoints: [
            "Zero app store downloads: opens instantly via private staff web scanner link",
            "Sub-0.3s camera scan latency enables lines to process up to 1,200 attendees/hour/lane",
            "Instant multi-gate synchronization prevents duplicate entries across different doors",
            "Role-based volunteer access hides attendee personal and financial records",
            "Real-time attendance dashboard displays arrival velocity, peak rush hours, and no-show stats",
          ],
        },

        whatIs: {
          title: "How Phone-Based QR Check-In Replaces Handheld Barcode Scanners",
          definition:
            "Historically, event managers had to rent expensive laser barcode scanners ($100–$250 per unit/day) and hook them up to local laptops. Modern browser-based event check-in leverages native high-resolution mobile phone camera APIs and WebAssembly computer vision to scan QR codes faster and more reliably than legacy laser hardware, at zero equipment cost.",
          details: [
            "Saves event organizers hundreds of dollars in equipment rental and courier fees",
            "Onboards event volunteers in 30 seconds with intuitive green-for-valid, red-for-invalid UI",
            "Eliminates line bottlenecks and delivers an effortless arrival experience for VIPs and delegates",
          ],
        },

        keyFactsTable: {
          title: "UrPass Mobile Camera Check-In vs. Traditional Check-In Methods",
          subtitle: "Direct operational comparison at the entrance gate.",
          headers: ["Operational Metric", "UrPass Web Scanner", "Dedicated Rented Scanners", "Paper Guest List with Pens"],
          rows: [
            {
              col1: "Throughput (Attendees/Hour/Lane)",
              col2: "Up to 1,200 attendees/hr",
              col3: "600–900 attendees/hr",
              col4: "120–180 attendees/hr (slow lookup)",
            },
            {
              col1: "Hardware / Rental Cost",
              col2: "$0 / ₹0 (use existing staff phones)",
              col3: "$100–$300 per device rental + shipping",
              col4: "Cost of printing hundreds of pages",
            },
            {
              col1: "Volunteer Training Required",
              col2: "30 seconds (point camera and scan)",
              col3: "Requires tech training on scanner keys",
              col4: "None, but extremely prone to human error",
            },
            {
              col1: "Multi-Gate Synchronization",
              col2: "Instant cloud sync (<0.28s)",
              col3: "Requires proprietary base station setup",
              col4: "Impossible (no cross-gate visibility)",
            },
            {
              col1: "Duplicate Entry Alerting",
              col2: "Audible alarm + red screen lockout",
              col3: "Beeps without cross-gate awareness",
              col4: "None (names can be ticked off twice)",
            },
          ],
        },

        featuresTitle: "Engineered for Frictionless Entrance Operations",
        featuresSubtitle: "Everything gate managers need to oversee smooth crowd flow.",
        features: [
          {
            icon: Smartphone,
            title: "Runs in Any Mobile Browser",
            desc: "Zero installation required. Volunteers tap your private scanner link on their iPhone or Android and start scanning immediately.",
          },
          {
            icon: Zap,
            title: "Sub-300ms Validation",
            desc: "Instant QR detection and database handshake. Gate lanes stay moving rapidly even during peak opening rush hours.",
          },
          {
            icon: Users,
            title: "Unlimited Volunteer Scanners",
            desc: "Deploy 2, 10, or 50 volunteers simultaneously across multiple entrances at zero additional cost per scanner seat.",
          },
          {
            icon: ShieldCheck,
            title: "Volunteer Privacy Lock",
            desc: "Gate staff see only essential check-in confirmations (Valid / Already Checked In / Invalid) without accessing private attendee emails or phone numbers.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Velocity",
            desc: "Watch the check-in graph update in real time. Know exactly when the main rush occurs and how many guests remain outside.",
          },
          {
            icon: QrCode,
            title: "Manual Search Fallback",
            desc: "If an attendee’s phone ran out of battery, gate staff can look them up by name or email with 1-click manual check-in.",
          },
        ],

        howItWorksTitle: "How Entrance Check-In Works on Event Day",
        howItWorksSubtitle: "Four straightforward steps from volunteer briefing to entrance lock.",
        steps: [
          { n: "01", title: "Share Scanner Link", desc: "Organizer generates a private scanner link or QR from the dashboard and shares it with gate staff." },
          { n: "02", title: "Open in Browser", desc: "Volunteers open the link on Safari or Chrome and allow camera access with one tap." },
          { n: "03", title: "Scan Guest Passes", desc: "Staff point cameras at attendee screens or printed passes; screen flashes green with a chime." },
          { n: "04", title: "Monitor Real-Time Stats", desc: "Headcount, gate breakdown, and arrival curves sync automatically to the organizer dashboard." },
        ],

        deepDiveSections: [
          {
            badge: "VENUE LOGISTICS",
            title: "Setting Up Entrance Lanes to Check In 1,000+ Guests in 30 Minutes",
            paragraphs: [
              "Entrance congestion is almost always caused by inefficient lane division and slow lookup systems. A paper roster takes an average of 20 to 30 seconds per attendee, meaning a single volunteer can only process 120 guests per hour.",
              "With UrPass’s sub-300ms phone scanner, each check-in takes less than 3 seconds including attendee approach time. By setting up three dedicated lanes (e.g. VIP / Pre-Registered / Help Desk) and staffing two phone scanners per lane, a team of six volunteers can comfortably admit 1,000 guests in 20 to 25 minutes without a single line forming.",
            ],
            bullets: [
              "Separate registration exception and troubleshooting desks from main scanning lanes",
              "Instruct attendees in line to pull up their digital pass and boost screen brightness",
              "Position staff volunteers in pairs: one to direct crowd flow, one to scan passes",
            ],
            takeaway: "High scanning speed transforms your entrance from a choke point into an effortless welcome.",
          },
        ],

        whoShouldUse: {
          title: "Trusted Across Fast-Paced Event Venues",
          subtitle: "Engineered for events with serious gate pressure.",
          personas: [
            {
              title: "College Fests & Youth Summits",
              desc: "Admit thousands of energetic college students smoothly without perimeter breaches or fake passes.",
              badge: "Campus",
            },
            {
              title: "Corporate Conferences & Seminars",
              desc: "Offer business delegates a polished, high-tech check-in experience with zero waiting around.",
              badge: "Corporate",
            },
            {
              title: "Trade Expos & Consumer Shows",
              desc: "Control multi-day badge access and visitor re-entry across primary exhibition halls.",
              badge: "Trade Shows",
            },
            {
              title: "Private Dinners & Award Galas",
              desc: "Discreetly verify VIP and executive arrivals against confidential invitation lists.",
              badge: "Gala & VIP",
            },
          ],
        },

        faqs: [
          {
            q: "Do staff need to install an app from Google Play or Apple App Store?",
            a: "No. The scanner operates entirely within modern mobile web browsers. Volunteers simply visit a dedicated link, grant camera permission, and scan passes immediately.",
          },
          {
            q: "Can volunteers accidentally delete or modify attendee data?",
            a: "No. The volunteer scanner role has read-and-check-in permissions only. Gate staff cannot view sensitive data, export lists, or alter event settings.",
          },
          {
            q: "Can we track which specific gate or volunteer checked in an attendee?",
            a: "Yes. Every scan records a timestamp, the scanner identifier, and gate location, creating a complete security audit log.",
          },
          {
            q: "What audio signals does the scanner provide?",
            a: "The scanner emits a high-pitched positive chime for valid passes, and a distinct low double-buzz accompanied by a red vibration warning for invalid or already-used passes.",
          },
        ],

        relatedLinks: [
          { title: "QR Code Event Ticketing Software", href: "/solutions/qr-code-ticketing", category: "Product" },
          { title: "Event Attendance Tracking Software", href: "/solutions/event-attendance-tracking", category: "Product" },
          { title: "How to Manage 1,000 Event Attendees", href: "/guides/manage-1000-event-attendees", category: "Guide" },
          { title: "Manual Check-In vs QR Code Check-In", href: "/compare/manual-vs-qr-check-in", category: "Comparison" },
        ],
      }}
    />
  );
}
