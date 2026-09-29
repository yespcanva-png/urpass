import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  Zap,
  Users,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Code Event Registration Software | Fast Check-In Passes",
  description:
    "Automate event registration with instant QR code passes. Attendees register online and receive secure mobile QR badges for 0.28s entrance scanning. Free plan available.",
  keywords: [
    "qr code event registration",
    "qr code event registration software",
    "event registration with qr code",
    "online event registration qr code",
    "event qr code passes",
    "free qr code registration",
  ],
  alternates: {
    canonical: "https://urpass.space/qr-code-event-registration",
  },
  openGraph: {
    title: "QR Code Event Registration Software | URPASS",
    description:
      "Automate event registration with instant QR code passes. Sub-second door scanning, duplicate entry protection, and free forever tier.",
    url: "https://urpass.space/qr-code-event-registration",
    locale: "en_IN",
    type: "website",
  },
};

export default function QrCodeEventRegistrationPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/qr-code-event-registration",
        badge: "DIGITAL PASS AUTOMATION",
        h1: "QR Code Event Registration Software",
        description:
          "Convert online sign-ups into tamper-proof digital QR entry passes automatically. Collect registrations with custom questions, deliver instant passes to mobile wallets, and scan attendees at the entrance in 0.28 seconds.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "How Does QR Code Event Registration Work?",
          summary:
            "QR code event registration connects an online sign-up form with automated ticket generation and entrance scanning. When an attendee submits their registration details, URPASS instantly generates a cryptographically signed QR code pass containing their verified credentials. On event day, gate volunteers scan the attendee's phone screen using any standard smartphone camera (<0.28s) to validate admission and eliminate entry lines.",
          keyPoints: [
            "Registration to Pass: Instant automated QR pass delivery upon form submission or approval",
            "Door Validation Speed: Validates and checks in attendees in under 0.28 seconds",
            "Zero Hardware Required: Any smartphone running Chrome or Safari functions as an entrance scanner",
            "Permanent Free Tier: ₹0 to start with up to 50 attendees per event and zero credit card required",
          ],
        },
        productProof: {
          badge: "SUB-SECOND CHECK-IN",
          title: "Instant In-Browser Phone Scanner",
          description:
            "No app downloads needed. Volunteers scan digital QR badges directly through the browser camera with instant duplicate entry detection.",
          type: "scanner",
        },
        features: [
          {
            icon: QrCode,
            title: "Automated QR Pass Delivery",
            desc: "Every registrant gets a personalized digital badge with their name, ticket tier, and tamper-proof verification hash.",
          },
          {
            icon: ScanLine,
            title: "0.28s Door Scanning",
            desc: "Point any smartphone camera at attendee badges for immediate audio and visual entry confirmation.",
          },
          {
            icon: ShieldCheck,
            title: "Duplicate Pass Lockout",
            desc: "Prevent ticket forwarding and screenshot fraud. Each QR pass can only be checked in once at the gates.",
          },
          {
            icon: Smartphone,
            title: "Apple & Google Wallet",
            desc: "Attendees can save their QR tickets directly into their native smartphone wallets for instant lock-screen access.",
          },
          {
            icon: Users,
            title: "Custom Form Builder",
            desc: "Collect phone numbers, college roll numbers, dietary preferences, or custom file attachments during sign-up.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Gate Dashboard",
            desc: "Monitor arrival volume by the minute, track peak door congestion, and export verified attendance records to CSV.",
          },
        ],
        steps: [
          { n: "01", title: "Build Form", desc: "Set up registration fields and event capacity in 2 minutes." },
          { n: "02", title: "Share Link", desc: "Publish your registration URL across WhatsApp, social, and email." },
          { n: "03", title: "Auto-Deliver", desc: "Registrants receive verified mobile QR passes instantly." },
          { n: "04", title: "Scan at Gates", desc: "Volunteers validate badges in under 0.28s with zero entrance queues." },
        ],
        callout: {
          badge: "ZERO COMMISSION",
          title: "Built for speed, security, and effortless gate operations",
          description:
            "Stop printing paper badges or manually checking names off spreadsheet rosters. URPASS modernizes your entire registration-to-check-in workflow.",
          bullets: [
            "Permanent free plan available — no credit card needed",
            "In-browser smartphone camera scanning (<0.28s)",
            "Real-time duplicate ticket blocking across all entrance gates",
            "Full attendee CSV exports with arrival timestamps",
          ],
        },
        useCases: [
          "College festivals & student club workshops",
          "Tech meetups, hackathons & code jams",
          "Conferences, expos & industry summits",
          "Corporate seminars & training masterclasses",
          "Community sports & cultural gatherings",
        ],
        faqs: [
          {
            q: "Can I use URPASS QR code event registration for free?",
            a: "Yes! URPASS offers a permanent free tier for up to 50 attendees per event (and up to 100 registrations per month across events) with full QR pass issuance and in-browser camera scanning at ₹0 forever.",
          },
          {
            q: "How do attendees access their QR passes?",
            a: "Upon registration, attendees receive a direct link to their digital pass, viewable on mobile web, downloadable as an image, and savable to Apple Wallet or Google Wallet.",
          },
          {
            q: "Do gate staff need to download an app from Google Play or App Store?",
            a: "No. URPASS runs directly in any mobile web browser (Chrome, Safari, Firefox). Organizers simply share a secure scanner link with volunteers.",
          },
          {
            q: "What happens if someone shares their QR pass screenshot?",
            a: "The first person to scan the pass enters successfully. When the second person tries to scan the identical screenshot, the scanner displays an immediate red alert: 'Ticket Already Checked In'.",
          },
        ],
        ctaTitle: "Automate your event entry with QR passes",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
