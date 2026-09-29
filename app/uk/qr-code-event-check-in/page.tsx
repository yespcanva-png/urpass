import type { Metadata } from "next";
import {
  ScanLine,
  Smartphone,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Code Event Check-In UK — Sub-Second Smartphone Scanner | URPASS",
  description:
    "Lightning-fast QR code event check-in software for UK venues. Scan attendee tickets in <0.3s directly in standard mobile web browsers. Multi-gate sync, duplicate prevention, and offline resilience.",
  keywords: [
    "qr code event check-in uk",
    "event check-in scanner uk",
    "browser qr scanner events",
    "qr ticket scanner uk",
    "fast event check-in app uk",
    "conference qr check-in uk",
    "offline event check-in uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/qr-code-event-check-in",
    languages: {
      "en-GB": "https://urpass.space/uk/qr-code-event-check-in",
      "x-default": "https://urpass.space/qr-event-check-in",
    },
  },
  openGraph: {
    title: "QR Code Event Check-In UK — Sub-Second Smartphone Scanner | URPASS",
    description:
      "Turn volunteer smartphones into instant event gate scanners. <0.3s check-in, real-time duplicate detection, and offline caching across UK venues.",
    url: "https://urpass.space/uk/qr-code-event-check-in",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkQrCodeEventCheckInPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/qr-code-event-check-in",
        badge: "UK GATE SCANNER · SUB-SECOND ENTRY CONTROL",
        h1: "QR Code Event Check-In Software for UK Venues",
        description:
          "Turn any volunteer's smartphone into a high-speed gate scanner in seconds. Validate attendee QR passes in under 0.3s directly in standard web browsers, block duplicate entries in real time, and keep queues moving effortlessly.",
        ctaLabel: "Test the Scanner Free",

        directAnswer: {
          title: "How does browser-based QR event check-in work?",
          summary:
            "URPASS browser-based QR check-in operates directly within modern mobile web browsers (Safari, Chrome, Edge) using device camera APIs. Door volunteers simply open a secure gate link or enter a PIN—no app store downloads or account setups are required. When an attendee presents their digital pass, the camera reads and validates the code in under 0.3 seconds, providing instant green (valid) or red (duplicate/invalid) feedback.",
          keyPoints: [
            "Sub-second (<0.3s) camera scanning without installing any app",
            "Real-time duplicate ticket detection across all entrance doors",
            "Offline caching ensures scanning continues if venue connectivity drops",
            "Role-based scanner access with secure PIN protection",
          ],
        },

        keyFactsTable: {
          title: "Gate Check-In Speed & Operations Benchmark",
          subtitle: "Comparison of URPASS smartphone browser scanning against traditional gate scanning methods.",
          headers: ["Operational Metric", "URPASS Browser Scanner", "Traditional Mobile Apps / Laser Scanners"],
          rows: [
            {
              col1: "Scan Latency",
              col2: "<0.3 seconds per attendee (wide-angle camera detection)",
              col3: "2.5 to 5 seconds per attendee",
            },
            {
              col1: "Staff Setup Time",
              col2: "15 seconds: open URL on personal phone and enter gate PIN",
              col3: "15–30 minutes: download native app, sign in, sync data",
            },
            {
              col1: "Hardware Costs",
              col2: "£0 (uses existing volunteer and staff smartphones)",
              col3: "£50–£150 per day for rented handheld barcode terminals",
            },
            {
              col1: "Duplicate Detection",
              col2: "Immediate full-screen red warning with exact prior check-in time",
              col3: "Basic warning chime, easily missed in loud venue environments",
            },
            {
              col1: "Offline Resilience",
              col2: "Built-in local roster cache; scans continue offline and sync later",
              col3: "Frequent network freeze errors in historic halls or basements",
            },
          ],
        },

        features: [
          {
            icon: ScanLine,
            title: "Sub-300ms Camera Recognition",
            desc: "Advanced WebRTC camera engine detects and reads QR codes from over 30cm away in under 300 milliseconds with zero lag.",
          },
          {
            icon: Smartphone,
            title: "No App Installation",
            desc: "Door staff and student volunteers scan directly in Safari or Chrome. No App Store or Google Play downloads required.",
          },
          {
            icon: AlertTriangle,
            title: "Instant Duplicate Alerts",
            desc: "Prevent ticket sharing and gate hopping. Second scans trigger a bright red visual screen and distinct haptic vibration.",
          },
          {
            icon: WifiOff,
            title: "Offline Gate Caching",
            desc: "Scanners cache the attendee database locally, continuing to validate passes even when mobile signals vanish in thick stone venues.",
          },
          {
            icon: Layers,
            title: "Multi-Door Synchronisation",
            desc: "Scan across 2, 5, or 20 entrances simultaneously. Check-in timestamps sync across all active scanners in under 50 milliseconds.",
          },
          {
            icon: ShieldCheck,
            title: "Secure Gate PIN Access",
            desc: "Protect your admin dashboard. Volunteers access only the camera scanner interface via an event-specific 4-digit PIN.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Create Event & Roster",
            desc: "Set up your event and build your attendee roster through registrations, ticket sales, or CSV import.",
          },
          {
            n: "02",
            title: "Generate Scanner Link & PIN",
            desc: "Create an entrance station and note the secure gate PIN from your organiser dashboard.",
          },
          {
            n: "03",
            title: "Volunteers Open Camera",
            desc: "Staff navigate to the scanner URL on their smartphones, grant camera permission, and enter the PIN.",
          },
          {
            n: "04",
            title: "Scan Digital Passes",
            desc: "Point the camera at attendee mobile passes. Scanners validate in <0.3s with clear visual and haptic feedback.",
          },
          {
            n: "05",
            title: "Monitor Live Throughput",
            desc: "Watch real-time entrance velocity, arrival curves, and door percentages live on your dashboard.",
          },
        ],

        deepDiveSections: [
          {
            badge: "QUEUE MANAGEMENT",
            title: "How Sub-Second Scanning Eliminates Queue Bottlenecks at UK Venues",
            paragraphs: [
              "Entrance queues are the single biggest point of attendee friction at British events. In cold or rainy UK weather, a slow check-in desk creates immediate dissatisfaction and safety hazards outside venues.",
              "Traditional check-in apps take 3 to 5 seconds per person as staff tap through screens or wait for network handshakes. At 4 seconds per person, a single entrance can only process 15 people per minute. With URPASS's sub-300ms scan speed, a single volunteer smartphone can comfortably check in 60 to 80 attendees per minute.",
            ],
            bullets: [
              "Reduce entrance queue wait times by up to 80%",
              "Equip 10 volunteer scanners in under 2 minutes with no app downloads",
              "Clear, unambiguous green and red check-in indicators",
              "Audio chime and phone vibration for noisy venue foyers",
            ],
            takeaway: "Keep your event entrance moving smoothly regardless of weather or crowd size.",
          },
        ],

        useCases: [
          "UK University Freshers' Fairs & Balls",
          "Tech Conferences & Developer Summits",
          "Music Festivals & Nightlife Events",
          "Exhibition Halls & Trade Shows",
          "Corporate Town Halls & AGMs",
          "Community Sports Tournaments",
        ],

        relatedLinks: [
          {
            title: "Event Check-In Software UK",
            href: "/uk/event-check-in-software",
            category: "Product",
          },
          {
            title: "QR Ticketing System UK",
            href: "/uk/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "UK Event Ticketing Software",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can volunteers scan tickets on iPhone and Android phones?",
            a: "Yes. URPASS gate scanning works seamlessly on modern iOS devices running Safari and Android devices running Chrome or Edge. No apps need to be downloaded from the App Store or Google Play Store.",
          },
          {
            q: "What happens if someone presents a screenshot or duplicate QR pass?",
            a: "The first scan validates the pass and marks the attendee as checked in. If the same QR code is scanned again—even seconds later at a different entrance door—the scanner flashes bright red, triggers a warning vibration, and displays the exact time and door where the pass was previously checked in.",
          },
          {
            q: "Does the scanner work if mobile signal drops inside the venue?",
            a: "Yes. URPASS utilizes an offline caching engine. Once the scanner session is loaded, the attendee database is stored securely in the browser's local cache. Tickets are validated locally without delay, and check-in records sync back to the cloud as soon as connection is re-established.",
          },
          {
            q: "Can we look up attendees manually if their phone battery dies?",
            a: "Yes. The scanner interface includes a rapid manual lookup search bar. Staff can search attendees by name, email, or Student ID and perform a manual check-in with a single tap.",
          },
        ],

        ctaTitle: "Experience lightning-fast gate scanning",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Sub-second scanning, zero app downloads, and full offline reliability.",
      }}
    />
  );
}
