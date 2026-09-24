import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Zap,
  Lock,
  Layers,
  CheckCircle2,
  Cpu,
  BarChart3,
  WifiOff,
  Palette,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Ticketing System for Events — Instant Digital Passes & Sub-Second Check-In",
  description:
    "End-to-end QR ticketing system for events. Issue cryptographically secure digital QR tickets, prevent duplicate entry with atomic verification, and scan at venue gates in <0.3s on any phone browser.",
  keywords: [
    "qr ticketing system",
    "qr code ticketing system",
    "event qr code generator",
    "qr ticket scanner",
    "digital qr pass",
    "qr event check in",
    "prevent duplicate qr tickets",
    "qr ticketing india",
  ],
  alternates: { canonical: "https://urpass.space/qr-ticketing-system" },
  openGraph: {
    title: "QR Ticketing System for Events | URPASS",
    description:
      "Generate digital QR passes, eliminate paper tickets, and validate attendees at venue gates in <0.3s with smartphone camera scanners.",
    url: "https://urpass.space/qr-ticketing-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function QrTicketingSystemPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/qr-ticketing-system",
        badge: "DIGITAL QR TICKETING SYSTEM",
        h1: "QR Ticketing System with Sub-Second Gate Check-In",
        description:
          "Issue tamper-proof digital QR tickets, customize pass layouts in Ticket Studio, block duplicate entries with atomic locks, and check in attendees at speed using any mobile phone browser.",
        ctaLabel: "Generate QR tickets free",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is a QR Ticketing System?",
          summary:
            "A QR ticketing system is a digital event access platform that generates encrypted, single-use 2D barcodes for ticket purchasers and validates them at venue doors using optical camera scanners. URPASS replaces expensive paper tickets, physical wristbands, and handheld barcode scanners with a modern cloud-native system—issuing branded digital passes that volunteers verify in under 0.3 seconds on standard smartphone browsers with audio chimes and haptic feedback.",
          keyPoints: [
            "Encrypted single-use QR tokens backed by atomic database row-locks",
            "Hardware-free gate scanning: volunteers use mobile Safari or Chrome",
            "Sub-second validation (<0.3s) with green chime and vibration feedback",
            "Offline check-in buffer with automatic bi-directional sync upon reconnect",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Technical QR Specifications & Gate Performance",
          subtitle: "How URPASS QR ticketing compares to legacy 1D barcodes and RFID wristbands.",
          headers: ["Technical Parameter", "URPASS QR Architecture", "Legacy 1D Barcode / Paper"],
          rows: [
            {
              col1: "QR Code Standard & Density",
              col2: "ISO/IEC 18004 compliant, Version 3-5 with Error Correction Level M/Q",
              col3: "Code 128 / Code 39 (low data density, high smudge failure)",
            },
            {
              col1: "Minimum Screen Scannability",
              col2: "Enforced ≥140px canvas render with ≥4.5:1 contrast safety engine",
              col3: "No contrast enforcement, frequently unreadable in daylight",
            },
            {
              col1: "Gate Scan Latency",
              col2: "< 0.3 seconds per attendee check-in",
              col3: "3.0 to 6.0 seconds per ticket",
            },
            {
              col1: "Duplicate Entry Prevention",
              col2: "Atomic DB write transaction (SELECT FOR UPDATE) preventing race conditions",
              col3: "Manual pen marking or slow asynchronous spreadsheet sync",
            },
            {
              col1: "Scanning Device Requirements",
              col2: "Any iOS or Android smartphone browser via secure PIN URL",
              col3: "Proprietary handheld laser guns (₹15,000–₹40,000 per unit rental)",
            },
            {
              col1: "Offline Gate Resilience",
              col2: "IndexedDB local check-in queue with automatic conflict reconciliation",
              col3: "Completely halts door entry when venue internet drops",
            },
            {
              col1: "Delivery Channels",
              col2: "Instant mobile web link, WhatsApp message, and email attachment",
              col3: "Slow physical paper printing or multi-page PDF vouchers",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: QrCode,
            title: "Dynamic Single-Use QR Passes",
            desc: "Each registered attendee receives an encrypted, high-contrast QR pass that invalidates instantly upon first gate scan.",
          },
          {
            icon: ScanLine,
            title: "Zero-Install Phone Scanner",
            desc: "Volunteers open a secure PIN scanner link in Safari or Chrome. No App Store downloads, no volunteer account logins.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Anti-Passback Protection",
            desc: "Prevents attendees from screenshotting and sharing passes. Any repeated scan triggers an immediate amber warning and error buzz.",
          },
          {
            icon: Palette,
            title: "Ticket Studio Visual Passes",
            desc: "Customize badge layouts (440x640), digital passes (380x680), and printable vouchers (780x340) with event logos and attendee tokens.",
          },
          {
            icon: WifiOff,
            title: "Offline-Resilient Gate Sync",
            desc: "Scan attendees uninterrupted during venue network dropouts. Scans queue locally and sync atomically when connection restores.",
          },
          {
            icon: BarChart3,
            title: "Live Multi-Gate Telemetry",
            desc: "Monitor check-in velocity, gate bottlenecks, attendance percentages, and peak entry curves from your central organizer console.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "SUB-SECOND GATE PROOF",
          title: "Engineered for 1,000+ Attendee Queues",
          description:
            "From college cultural fests with 5,000 students to high-security corporate summits, URPASS processes passes in <0.3s without dedicated hardware.",
          type: "scanner",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Optimized for Indian Venues & Mobile Networks",
          subtitle: "Designed for erratic convention WiFi, dual-SIM cellular connectivity, and WhatsApp distribution.",
          items: [
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Deliver mobile QR passes directly via WhatsApp in India, achieving 98% open rates and eliminating lost emails.",
              badge: "WhatsApp",
            },
            {
              title: "Instant UPI QR Ticketing",
              description:
                "Sell paid passes using UPI (PhonePe, GPay, Paytm) with zero ticketing commission and direct T+2 bank deposits.",
              badge: "UPI 2.0",
            },
            {
              title: "Spotty Venue WiFi Protection",
              description:
                "Indian auditoriums and basement banquet halls often have poor reception. URPASS offline mode keeps lines moving.",
              badge: "Offline Ready",
            },
            {
              title: "Multi-Gate College Fests",
              description:
                "Deploy 10 volunteer phones across North, South, and VIP gates simultaneously with synchronized anti-duplicate protection.",
              badge: "Colleges",
            },
            {
              title: "GST Tax Invoicing",
              description:
                "Collect attendee GSTIN numbers for corporate conferences and automatically generate compliant tax receipts.",
              badge: "GSTIN",
            },
            {
              title: "Free Forever Tier",
              description:
                "Host up to 2 events per month with 100 attendees completely free — perfect for student clubs and tech meetups.",
              badge: "₹0 Free Plan",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "SECURITY DEEP DIVE",
            title: "How Single-Use Cryptography Stops Pass Duplication & Fraud",
            paragraphs: [
              "When organizers distribute static PDF tickets, attendees can easily screenshot the barcode and send it to five friends over WhatsApp. At legacy check-in desks, if the scanner software performs simple, asynchronous reads without row-level database locks, two attendees can present the exact same ticket at Gate A and Gate B within seconds of each other—and both will get approved.",
              "URPASS eliminates this vulnerability through atomic database transactions. The moment a volunteer's camera detects a pass token, the server executes an atomic state change (`UPDATE passes SET status = 'checked_in' WHERE id = :pass_id AND status = 'issued'`). If another gate attempts to validate the duplicate 100 milliseconds later, the database rejects the query, sounding a low double-tone warning and displaying an amber 'ALREADY CHECKED IN' alert with the exact original entry timestamp and gate ID.",
            ],
            bullets: [
              "Cryptographic pass tokens resistant to brute-force URL guessing",
              "Atomic database row-locks eliminate race conditions across multiple gates",
              "Audio tone differentiation: high chime for success, low double tone for duplicate",
              "Immediate on-screen audit log displaying original scan time and gate location",
            ],
            takeaway:
              "True anti-fraud security requires atomic database writes, not client-side visual checks. URPASS guarantees that each pass can admit exactly one human being.",
          },
          {
            badge: "OPERATIONAL SPEED",
            title: "Why In-Browser Scanning Outperforms Dedicated Barcode Hardware",
            paragraphs: [
              "Renting dedicated industrial laser scanners costs organizers between ₹15,000 and ₹40,000 per event, requires bulky charging docks, and forces volunteers to spend 30 minutes learning unfamiliar hardware. If a scanner breaks or runs out of battery mid-event, the entire entrance gate comes to an abrupt halt.",
              "With URPASS, organizers create scanner access keys directly in their dashboard. Volunteers simply scan a setup QR code or open a 4-digit PIN link on their personal iPhones or Android devices. Camera feed processing happens entirely in the browser using hardware-accelerated WebAssembly. Within 30 seconds of arriving at the venue, any volunteer is fully equipped to process 25 to 30 attendees per minute.",
            ],
            bullets: [
              "Zero rental costs: volunteers use their existing iOS or Android phones",
              "Instant onboarding: scan a PIN link and start validating in under 30 seconds",
              "Multi-camera support: rear wide-angle optical autofocus handles poor venue lighting",
              "Web Audio API chimes provide clear audible cues in noisy entrance lobbies",
            ],
            takeaway:
              "Modern mobile phone cameras paired with lightweight web technologies deliver faster scan speeds and higher reliability than legacy hardware guns at zero extra cost.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS QR Ticketing vs. Legacy Barcode & RFID Systems",
          subtitle: "Compare hardware requirements, gate throughput, anti-fraud security, and total cost.",
          competitorName: "Legacy 1D Barcode / RFID Hardware",
          sourceCitations: [
            "Industry standard event rental benchmarks",
            "URPASS benchmark metrics & offline scanner specifications",
          ],
          rows: [
            {
              criteria: "Gate Scanner Hardware Cost",
              urpass: "₹0 (Any smartphone browser: iOS & Android)",
              competitor: "₹15,000–₹40,000 hardware gun rentals",
              urpassAdvantage: true,
            },
            {
              criteria: "Check-In Speed per Person",
              urpass: "< 0.3 seconds with audio and haptic cues",
              competitor: "3.5 to 5.0 seconds per scan",
              urpassAdvantage: true,
            },
            {
              criteria: "Anti-Passback (Screenshot Protection)",
              urpass: "Instant atomic DB lock across all gates",
              competitor: "Manual pen marking or delay-prone sync",
              urpassAdvantage: true,
            },
            {
              criteria: "Pass Visual Design",
              urpass: "Ticket Studio WYSIWYG (12 templates & dynamic tokens)",
              competitor: "Black & white barcode printouts",
              urpassAdvantage: true,
            },
            {
              criteria: "Offline Gate Operation",
              urpass: "IndexedDB buffer with automatic conflict resolution",
              competitor: "Fails completely or overwrites check-in records",
              urpassAdvantage: true,
            },
            {
              criteria: "Volunteer Setup Time",
              urpass: "< 30 seconds via secure PIN link",
              competitor: "Requires manual hardware training & app logins",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "College Cultural & Tech Fests",
          "Tech Conferences & Summits",
          "Inter-College Hackathons",
          "Workshops & Hands-On Bootcamps",
          "Music Festivals & Concerts",
          "Corporate Product Launches",
          "Exhibitions & Trade Expos",
          "Community & Founder Meetups",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "QR Ticket Scanner & Phone App",
            href: "/qr-ticket-scanner",
            category: "Product",
          },
          {
            title: "How QR Ticket Validation Works",
            href: "/how-qr-ticket-validation-works",
            category: "Guide",
          },
          {
            title: "Event Ticketing Software",
            href: "/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Event Registration Software",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "Event Ticketing in India (UPI & INR)",
            href: "/in",
            category: "Location",
          },
          {
            title: "College Event Registration & Passes",
            href: "/college-events",
            category: "Use Case",
          },
          {
            title: "Guide: Prevent Duplicate Event Entry",
            href: "/guides/prevent-duplicate-event-entry",
            category: "Guide",
          },
          {
            title: "Guide: How to Check In 1,000 Attendees Quickly",
            href: "/guides/how-to-check-in-1000-attendees-quickly",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "What is a QR ticketing system?",
            a: "A QR ticketing system generates a unique, encrypted 2D barcode for each ticket purchase or event registration. Attendees display this pass on their mobile phones, and venue staff scan it using camera-enabled devices to verify validity and log attendance in real time.",
          },
          {
            q: "What prevents attendees from sharing their QR pass with others?",
            a: "URPASS uses atomic database updates. When a pass is scanned at any entrance gate, its status changes instantly from 'issued' to 'checked_in'. If someone attempts to scan a duplicate screenshot, the scanner immediately alerts staff with an amber warning, a low warning tone, and an error vibration showing when and where the pass was originally checked in.",
          },
          {
            q: "Do entrance volunteers need to download a mobile app?",
            a: "No. Volunteers simply open a secure, PIN-protected URL provided by the organizer in Safari or Chrome on their smartphones. Camera scanning operates directly inside the browser using WebAssembly.",
          },
          {
            q: "Does the QR scanner work if the venue loses internet connection?",
            a: "Yes. URPASS features an offline check-in mode. Volunteer phones cache event attendee lists locally. Scans continue uninterrupted during network outages, and sync automatically to the central database once internet connectivity is restored.",
          },
          {
            q: "Can I customize the visual look of the QR passes?",
            a: "Yes. With URPASS Ticket Studio, you can choose from 12 pre-designed templates or build custom passes with your event logo, custom background colors, attendee names, ticket tier badges, and event dates across Digital (380x680), Printable (780x340), and Badge (440x640) formats.",
          },
          {
            q: "What audio and vibration cues does the scanner provide?",
            a: "Valid scans produce a high confirmation chime and a short 80ms haptic tap. Duplicate or invalid scans produce a double low-frequency tone and a distinct 150-80-150ms vibration pattern, allowing volunteers to process attendees rapidly without staring at the screen.",
          },
        ],

        ctaTitle: "Deploy your QR ticketing system in 5 minutes",
        ctaDescription:
          "Free tier available · Sub-second phone check-in · Visual pass studio · Built for India",
      }}
    />
  );
}
