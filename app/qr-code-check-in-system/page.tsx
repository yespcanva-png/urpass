import type { Metadata } from "next";
import {
  ScanLine,
  QrCode,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  BarChart3,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Code Check-In System for Events | Fast Smartphone Scanning",
  description:
    "Sub-second QR code check-in system for events. Scan digital passes with any smartphone camera in 0.28 seconds. Real-time multi-gate sync, duplicate lockout, and permanent free tier.",
  keywords: [
    "qr code check in system",
    "qr code event check in",
    "event check in app",
    "event gate scanner",
    "fast event check in software",
    "qr ticket scanner for events",
  ],
  alternates: {
    canonical: "https://urpass.space/qr-code-check-in-system",
  },
  openGraph: {
    title: "QR Code Check-In System for Events | URPASS",
    description:
      "Transform any smartphone into a high-speed gate scanner. Sub-second QR ticket validation, real-time multi-gate sync, and zero app downloads.",
    url: "https://urpass.space/qr-code-check-in-system",
    locale: "en_IN",
    type: "website",
  },
};

export default function QrCodeCheckInSystemPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/qr-code-check-in-system",
        badge: "GATE SCANNING ENGINE",
        h1: "QR Code Check-In System for Events",
        description:
          "Check in thousands of attendees per gate with zero lines. URPASS turns any smartphone into an ultra-fast in-browser scanner operating in under 0.28 seconds with real-time multi-gate cloud synchronization.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "What is a QR Code Event Check-In System?",
          summary:
            "A QR code event check-in system is software that validates attendee entry tickets using optical camera scanning. Instead of searching names manually in paper lists or spreadsheets, gate staff point a smartphone camera at an attendee's digital badge. The system decodes the encrypted ticket token, verifies authenticity in under 0.28 seconds, registers attendance in the central database, and locks the pass against duplicate re-use.",
          keyPoints: [
            "Scan Speed: Validates digital QR passes in under 0.28 seconds",
            "Zero Hardware Rental: Runs on iOS and Android phones via standard web browsers",
            "Multi-Gate Synchronization: Multiple entrance doors stay synchronized via real-time cloud updates",
            "Permanent Free Tier: ₹0 forever for up to 50 attendees per event with no credit card required",
          ],
        },
        productProof: {
          badge: "REAL-TIME CHECK-IN ENGINE",
          title: "Sub-0.3s Verification Speed",
          description:
            "Volunteers open a simple web link in Safari or Chrome. Sub-second QR verification with audio chime and haptic feedback.",
          type: "scanner",
        },
        features: [
          {
            icon: ScanLine,
            title: "0.28s In-Browser Scanning",
            desc: "Zero mobile app downloads required. Point any smartphone camera at attendee badges for instantaneous validation.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Fraud Duplicate Lock",
            desc: "Prevents ticket sharing, forwarded screenshots, and gate duplication. Tickets lock out immediately upon first scan.",
          },
          {
            icon: Smartphone,
            title: "Multi-Gate Cloud Sync",
            desc: "Deploy 5, 10, or 20 volunteers across different entrance gates. Scans synchronize in real-time to avoid duplicate check-ins.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Velocity",
            desc: "Track entry volume per minute, identify gate bottlenecks, and monitor venue capacity from your central dashboard.",
          },
          {
            icon: QrCode,
            title: "Encrypted QR Pass Issuance",
            desc: "Every ticket features a cryptographically signed payload that prevents unauthorized forgery or barcode duplication.",
          },
          {
            icon: Zap,
            title: "Offline Resilient Sync",
            desc: "If venue Wi-Fi stutters, the scanner queues validated check-ins locally and syncs automatically when signal resumes.",
          },
        ],
        steps: [
          { n: "01", title: "Generate Link", desc: "Create your event and share the secure volunteer scanner link." },
          { n: "02", title: "Open Camera", desc: "Gate staff tap the link in Safari or Chrome—no app store downloads." },
          { n: "03", title: "Scan Badges", desc: "Point phone at attendee screens for sub-second green confirmations." },
          { n: "04", title: "Analyze Live", desc: "Watch attendance metrics populate your organizer dashboard in real time." },
        ],
        callout: {
          badge: "FAST ENTRY OPERATIONS",
          title: "Eliminate gate queues and verify attendees in under 1 second",
          description:
            "Manual check-in rosters create massive wait lines and security risks. URPASS delivers professional, enterprise-grade gate access control using the smartphones your team already owns.",
          bullets: [
            "Permanent free plan available with full scanning capabilities",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Audible confirmation chime and haptic vibration feedback",
            "Instant CSV attendance export with exact entry timestamps",
          ],
        },
        useCases: [
          "College festivals, tech symposiums & cultural days",
          "Conferences, expos & industry summits",
          "Hackathons, code sprints & developer workshops",
          "Corporate annual meets & product launch days",
          "Community networking & club gatherings",
        ],
        faqs: [
          {
            q: "Do volunteers need to install an app to scan tickets?",
            a: "No! Volunteers simply open a private scanner link in Chrome or Safari on their personal smartphones. The scanner activates the camera immediately with zero app store downloads.",
          },
          {
            q: "Can we use multiple scanners at different entrance gates?",
            a: "Yes. You can have multiple volunteers scanning simultaneously across different entrance doors. Check-ins sync across devices in real time.",
          },
          {
            q: "How does the system prevent someone from sharing their ticket screenshot?",
            a: "When a ticket is scanned at any gate, it is instantly marked as 'Checked In'. If a friend attempts to use a screenshot of that same pass at another gate, the scanner alerts the volunteer with a red warning: 'Ticket Already Checked In'.",
          },
          {
            q: "Is there a free tier for QR check-in on URPASS?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 attendees per event, including full QR pass generation and unlimited gate scanning.",
          },
        ],
        ctaTitle: "Speed up your event entrance with URPASS",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
