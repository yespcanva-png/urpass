import type { Metadata } from "next";
import { BadgeCheck, Layers, Radio, ScanLine, ShieldCheck, Smartphone } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Conference QR Badge Scanning Software | UrPass",
  description: "Transform any smartphone into a fast conference badge scanner with real-time attendee verification and session access validation.",
  keywords: [
    "conference badge scanning software",
    "scan conference qr passes and track live attendance",
    "urpass qr ticketing",
    "event check in software",
    "qr ticket scanner",
    "event registration platform"
  ],
  alternates: { canonical: "https://urpass.space/conference-badge-scanning-software" },
  openGraph: {
    title: "Conference QR Badge Scanning Software | UrPass",
    description: "Transform any smartphone into a fast conference badge scanner with real-time attendee verification and session access validation.",
    url: "https://urpass.space/conference-badge-scanning-software",
    locale: "en_US",
    type: "website",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Global",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "LANYARD & BADGE SCANNING",
        h1: "Scan Conference QR Passes and Track Live Attendance",
        canonicalUrl: "https://urpass.space/conference-badge-scanning-software",
        description: "Transform any smartphone into a fast conference badge scanner with real-time attendee verification and session access validation.",
        ctaLabel: "Start Scanning Badges",
        directAnswer: {
          title: "How Does Conference QR Badge Scanning Work on UrPass?",
          summary: "UrPass transforms standard smartphones into professional conference badge scanners. Gate marshals and session room door hosts scan printed lanyard badges or mobile QR passes using their phone camera in <0.3s. Scanners verify delegate credentials, validate track access, prevent duplicate entry, and sync attendance live to the cloud.",
          keyPoints: ["Sub-300ms camera scanning for printed lanyard badges and mobile smartphone passes", "Zero hardware rental costs \u2014 operates directly on volunteer iOS and Android phones", "Color-coded tier indicators (VIP, Delegate, Speaker, Sponsor, Press)", "Session-level badge validation tracking attendance at keynotes and breakout workshops"],
        },
        keyFactsTable: {
          title: "Conference Badge Scanning Comparison",
          subtitle: "Smartphone scanning vs traditional laser hardware rentals.",
          headers: ["Badge Scanning Factor", "UrPass Mobile Camera Scanner", "Hardware Laser Scanners & Handhelds"],
          rows: [
            {
                        "col1": "Hardware Rental Cost",
                        "col2": "$0 / \u00a30 \u2014 volunteers use their own smartphones",
                        "col3": "$150 to $300 rental fee per handheld terminal"
            },
            {
                        "col1": "Scan Speed",
                        "col2": "<0.3s sub-second instant camera recognition",
                        "col3": "1 to 2 seconds aiming optical laser beam"
            },
            {
                        "col1": "App Installation",
                        "col2": "0 downloads \u2014 runs directly in standard mobile browser",
                        "col3": "Complex proprietary APK setup and configuration"
            },
            {
                        "col1": "Screen Verification Feedback",
                        "col2": "Large green/red screen with attendee name & tier",
                        "col3": "Tiny monochrome text display on bulky scanner"
            },
            {
                        "col1": "Real-Time Cloud Sync",
                        "col2": "Sub-150ms instant sync across all venue doors",
                        "col3": "Batch dock syncing with delayed attendance records"
            }
],
        },
        features: [
          { icon: ScanLine, title: "Sub-0.3s Badge Recognition", desc: "Hardware-accelerated camera engine scans printed lanyard badges and smartphone screens instantly." },
          { icon: Smartphone, title: "Zero App Downloads", desc: "Volunteers open a secure web scanner URL on Safari or Chrome with zero app store installations." },
          { icon: BadgeCheck, title: "Color-Coded Tier Displays", desc: "Screen flashes emerald green for valid delegates, gold for VIPs, and bright red for duplicate attempts." },
          { icon: ShieldCheck, title: "Duplicate Badge Rejection", desc: "Instantly flags duplicated or re-scanned badges showing the exact timestamp and gate of first use." },
          { icon: Layers, title: "Breakout Session Mode", desc: "Switch scanner modes to track attendance at specific keynote halls, masterclasses, or sponsor lunches." },
          { icon: Radio, title: "Offline Scanning Resilience", desc: "Client-side cryptographic validation allows scanning to continue if convention center WiFi drops." }
        ],
        steps: [
          { n: "01", title: "Generate Delegate Badges", desc: "Design digital or printable conference badges featuring high-contrast scannable QR tokens." },
          { n: "02", title: "Share Scanner Link", desc: "Send secure scanner URLs to door volunteers and ushers via WhatsApp or QR code." },
          { n: "03", title: "Scan at Venue Doors", desc: "Volunteers point their smartphone cameras at delegate lanyards as they enter." },
          { n: "04", title: "Instant Audio & Visual Feedback", desc: "Haptic vibration and visual green confirmation verify delegate credentials in <0.3s." },
          { n: "05", title: "Monitor Live Flow", desc: "Watch conference arrival curves, session popularity, and total checked-in counts in real time." }
        ],
        callout: {
          badge: "ZERO HARDWARE OVERHEAD",
          title: "Save thousands in handheld scanner rentals at your next conference.",
          description: "Traditional badge scanner rental companies charge hundreds of dollars per terminal plus expensive shipping and setup fees. UrPass delivers faster, superior scanning on standard mobile phones.",
          bullets: ["Deploy 20+ scanning lanes across all conference doors at zero hardware cost", "Volunteers are trained and scanning in under 60 seconds with zero learning curve", "Prevents badge sharing with atomic cloud duplicate detection", "Full session-level attendance telemetry for CME/CEU certified conferences"],
        },
        faqs: [
          { q: "Can the scanner read printed lanyard badges or only phone screens?", a: "Both! The scanner reads both printed paper/plastic lanyard badges and digital phone screens with equal sub-second speed." },
          { q: "Do volunteers need to install an app from the App Store or Google Play?", a: "No. The scanner runs directly inside modern mobile browsers (Safari, Chrome) via secure WebRTC camera technology." },
          { q: "What happens if someone shares their badge with a colleague?", a: "The moment a badge is scanned, its token is recorded in the database. Any subsequent scan triggers an immediate red warning with the initial scan time." },
          { q: "Can we track which breakout sessions an attendee visited?", a: "Yes. Door staff can select the specific track or room name in the scanner interface to record session-level attendance." }
        ],
        relatedLinks: [
          { title: "Session-Wise Attendance Tracking", href: "/session-wise-attendance-tracking", category: "Product" },
          { title: "Smartphone QR Ticket Scanner", href: "/smartphone-qr-ticket-scanner", category: "Product" },
          { title: "Multi-Gate QR Check-In", href: "/multi-gate-event-check-in", category: "Product" },
          { title: "Duplicate QR Ticket Detection", href: "/duplicate-qr-ticket-detection", category: "Product" }
        ],
      }}
    />
  );
}
