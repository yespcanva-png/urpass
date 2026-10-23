import type { Metadata } from "next";
import { BarChart3, ScanLine, ShieldCheck, Smartphone, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Event Check-In App & Scanner | UrPass",
  description: "Scan attendee QR tickets using your smartphone. Validate event passes, prevent duplicate entries and track live check-ins with UrPass.",
  keywords: ["qr code event check in app","event ticket scanner app","qr ticket check in","mobile event check in scanner","smartphone qr scanner for events","fast event entry app","event check in software"],
  alternates: {
    canonical: "https://urpass.space/qr-code-event-check-in-app",
  },
  openGraph: {
    title: "QR Event Check-In App & Scanner | UrPass",
    description: "Scan attendee QR tickets using your smartphone. Validate event passes, prevent duplicate entries and track live check-ins with UrPass.",
    url: "https://urpass.space/qr-code-event-check-in-app",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Event Check-In App & Scanner | UrPass",
    description: "Scan attendee QR tickets using your smartphone. Validate event passes, prevent duplicate entries and track live check-ins with UrPass.",
  },
};

export default function QrCodeEventCheckInAppPage() {
  return (
    <SEOPage
      config={{
        badge: "MOBILE QR CHECK-IN",
        h1: "QR Code Event Check-In App for Fast Entry",
        canonicalUrl: "https://urpass.space/qr-code-event-check-in-app",
        description: "Scan attendee QR tickets using your smartphone. Validate event passes, prevent duplicate entries and track live check-ins with UrPass.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=qr-code-event-check-in-app",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Transform Everyday Smartphones into High-Speed Event Scanners",
        ctaDescription: "Clear entry queues in seconds. No app downloads, no hardware rentals, and instant multi-gate duplicate protection.",
        directAnswer: {
        "title": "What is a QR Code Event Check-In App?",
        "summary": "A QR code event check-in app transforms standard smartphone cameras into high-speed ticket scanners. Volunteers and gate staff scan attendee digital passes directly in mobile web browsers without installing native software, validating passes in under 0.3 seconds and blocking duplicate entries in real time.",
        "keyPoints": [
                "Sub-0.3 second camera scan speed for ultra-fast queue clearing",
                "Zero native app installation required — runs in Safari and Chrome",
                "Atomic database row locks prevent screenshot sharing and duplicate entries",
                "Real-time synchronization across multiple entrance gates and devices"
        ]
},
        whatIs: {
        "title": "How the UrPass QR Check-In Scanner Operates",
        "definition": "The UrPass QR check-in scanner is a web-first attendance validation tool engineered for speed, reliability, and security. Event staff simply open a secure scanner link on their mobile devices, point their camera at an attendee digital pass, and receive immediate visual and haptic verification feedback.",
        "details": [
                "Instant camera activation with hardware auto-focus and low-light flashlight toggle",
                "Offline-resilient scanning mode with local cryptographic ticket verification",
                "Color-coded response screens: Green for valid, Red for invalid, Amber for duplicate scans",
                "Complete volunteer role permission controls without giving access to event financial data"
        ]
},
        keyFactsTable: {
        "title": "Smartphone Browser Scanner vs Dedicated Hardware Terminals",
        "subtitle": "Why modern event organizers choose browser-based scanning over expensive hardware rentals.",
        "headers": [
                "Operational Factor",
                "Dedicated Scanner Rentals",
                "UrPass Mobile Web Scanner"
        ],
        "rows": [
                {
                        "col1": "Hardware Costs",
                        "col2": "₹2,500 - ₹5,000 / £30 - £60 per handheld terminal per day",
                        "col3": "₹0 — uses staff and volunteer smartphones"
                },
                {
                        "col1": "Setup Time",
                        "col2": "Hours spent charging, configuring, and pairing devices",
                        "col3": "10 seconds — scan an organizer QR to authorize the phone"
                },
                {
                        "col1": "Scan Latency",
                        "col2": "0.5s - 1.2s depending on proprietary firmware",
                        "col3": "Under 0.3s using WebAssembly-accelerated video feeds"
                },
                {
                        "col1": "Gate Synchronization",
                        "col2": "Batch syncing with frequent multi-gate duplicate collisions",
                        "col3": "Instant sub-second cloud sync with atomic duplicate blocking"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "SPEED & THROUGHPUT",
                "title": "Clear 1,000 Attendees in Under 15 Minutes",
                "paragraphs": [
                        "Gate congestion is the most common failure point at live conferences, concerts, and college festivals. When organizers rely on paper rosters or slow desktop lookup tables, attendee check-in drops to 5-10 people per minute, creating frustrating queues that delay opening keynotes.",
                        "UrPass leverages optimized browser-based video stream processing. By feeding frames directly to a WebAssembly barcode decoder, scanning happens instantaneously when the QR code enters the viewfinder. A single volunteer can comfortably process 12 to 18 attendees per minute, allowing a four-volunteer entry team to process 1,000 attendees in approximately 15 minutes."
                ],
                "bullets": [
                        "Eliminate manual alphabetical paper rosters and name searches",
                        "Audible green chime and haptic buzz confirm admission without looking down",
                        "High-contrast QR rendering guarantees readability even on dimmed phone screens",
                        "Fallback manual search by attendee name or email if a ticket cannot be presented"
                ],
                "takeaway": "Web-first smartphone scanning eliminates entrance bottlenecks without requiring costly rental equipment."
        },
        {
                "badge": "SECURITY & FRAUD PREVENTION",
                "title": "Atomic Anti-Duplicate Protection Across All Doors",
                "paragraphs": [
                        "Ticket screenshot sharing is a major concern for popular and paid events. When attendees share pass screenshots with friends, conventional offline scanners fail to detect that the pass was already used at another gate minutes earlier.",
                        "UrPass eliminates ticket sharing through cloud-native atomic database transactions. The instant a ticket is validated at Gate 1, its status flips to admitted. If a duplicate screenshot is presented at Gate 2, the scanner instantly flashes an amber duplicate warning displaying the exact timestamp, volunteer name, and entrance gate of the first check-in."
                ],
                "bullets": [
                        "Cryptographically signed ticket tokens prevent URL tampering",
                        "Immediate amber duplicate warning with first-entry audit timestamp",
                        "Full check-in activity log recorded with gate and device identifiers",
                        "Optional photo verification for VIP, speaker, and delegate passes"
                ],
                "takeaway": "Real-time atomic row locking guarantees each ticket admits exactly one attendee."
        }
],
        featuresTitle: "Core Capabilities Built for Event Organizers",
        featuresSubtitle: "Engineered for speed, reliability, and zero ticketing commission.",
        features: [
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Scanning",
            desc: "Point any smartphone camera at the attendee pass for instant millisecond recognition and validation.",
          },
          {
            icon: Smartphone,
            title: "No App Installation",
            desc: "Staff and volunteers open a secure web link in Safari or Chrome without downloading apps from app stores.",
          },
          {
            icon: ShieldCheck,
            title: "Instant Duplicate Blocking",
            desc: "Atomic database locking catches screenshot sharing across all gates within milliseconds.",
          },
          {
            icon: Users,
            title: "Multi-Volunteer Coordination",
            desc: "Deploy dozens of scanners simultaneously with delegated check-in permissions and live gate tallies.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Telemetry",
            desc: "Monitor check-in percentages, arrival spikes, and remaining expected guests in real time.",
          },
          {
            icon: Zap,
            title: "Zero Hardware Costs",
            desc: "Skip thousands of dollars in rental hardware by turning everyday personal phones into enterprise scanners.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Your Event",
                "desc": "Set up registration fields and configure attendee ticket tiers in UrPass."
        },
        {
                "n": "02",
                "title": "Generate Secure Scanner Link",
                "desc": "Generate a gate scanner URL or QR code from your organizer control panel."
        },
        {
                "n": "03",
                "title": "Authorize Volunteer Phones",
                "desc": "Staff scan the setup code with their phone cameras to launch the scanner interface."
        },
        {
                "n": "04",
                "title": "Scan Digital Passes",
                "desc": "Point phone cameras at incoming attendees digital QR passes for instant green entry."
        },
        {
                "n": "05",
                "title": "Monitor Real-Time Dashboard",
                "desc": "View arrival flow, door counts, and export timestamped check-in logs anytime."
        }
],
        whoShouldUse: {
        "title": "Engineered for High-Volume Entry Points",
        "subtitle": "Trusted by organizers who cannot afford entrance delays.",
        "personas": [
                {
                        "badge": "COLLEGES",
                        "title": "College Fests & Cultural Summits",
                        "desc": "Manage thousands of student entries across multiple campus gates with student volunteers using their personal phones."
                },
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Conferences & Summits",
                        "desc": "Check in delegates smoothly, issue instant badge validations, and maintain complete corporate attendance audit trails."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Workshops & Training Sessions",
                        "desc": "Verify pre-paid participant tickets in seconds before letting students enter seminar halls."
                },
                {
                        "badge": "EXHIBITIONS",
                        "title": "Trade Shows & Expos",
                        "desc": "Track visitor entry flow across multiple exhibition hall gates with real-time arrival counts."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Phone-Based QR Validation Works",
        "subtitle": "Effortless, frictionless entry flow for attendees and staff.",
        "description": "When an attendee registers or purchases a ticket, UrPass automatically issues a high-contrast digital QR pass delivered via WhatsApp, Apple Wallet, or email. At the venue entrance, door staff simply point their mobile camera at the QR code. The browser decoder reads the token, verifies cryptographic validity against your event database, and signals green entry in under 300 milliseconds.",
        "points": [
                "Volunteers never need access to your organizer master account or billing details.",
                "Audible chimes provide auditory confirmation in loud concert or convention hall environments.",
                "Works smoothly under bright outdoor sunlight as well as dimmed auditorium lighting.",
                "Instant search bar allows manual check-in if an attendee arrives with a dead smartphone battery."
        ]
},
        faqs: [
        {
                "q": "Do volunteers need to download a mobile app from the App Store or Google Play?",
                "a": "No. The UrPass scanner operates entirely within modern mobile web browsers such as Apple Safari and Google Chrome. Volunteers simply open a secure authorization link or scan an organizer setup QR code to activate the scanner instantly."
        },
        {
                "q": "What happens if an attendee presents a screenshot of someone else's ticket?",
                "a": "UrPass checks pass status against an atomic database row lock in real time. If the pass was already scanned at any gate, the scanner immediately flashes an amber duplicate warning showing the exact entry timestamp and gate name, preventing reuse."
        },
        {
                "q": "Does the scanner work with multiple entrances simultaneously?",
                "a": "Yes. You can connect an unlimited number of smartphones across all venue entrances simultaneously. Check-in statuses sync instantly across every active device to prevent simultaneous cross-gate entries."
        },
        {
                "q": "Can I search for an attendee manually if their phone battery dies?",
                "a": "Yes. The scanner includes a quick-search lookup tool allowing gate staff to search by attendee name, email address, or ticket reference code and check them in manually with one tap."
        },
        {
                "q": "How much does the QR check-in scanner cost?",
                "a": "The scanner is included across all UrPass plans with zero per-scan charges. Subscriptions start with an transparent plans starting from ₹499/month in India (£15/month in the UK) with 0% platform ticket commissions."
        }
],
      }}
    />
  );
}
