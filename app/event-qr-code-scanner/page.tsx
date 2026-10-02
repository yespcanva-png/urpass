import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event QR Code Scanner — Fast Sub-Second Attendee Check-In | URPASS",
  description:
    "High-speed browser-based event QR code scanner. Validate attendee tickets in under 0.3s on any iOS or Android phone without downloading an app. Atomic duplicate prevention.",
  keywords: [
    "event QR code scanner",
    "QR scanner for event check in",
    "event ticket scanner app",
    "fast attendee QR check in",
    "multi gate event scanner",
    "event entry QR code reader",
  ],
  alternates: { canonical: "https://urpass.space/event-qr-code-scanner" },
  openGraph: {
    title: "Event QR Code Scanner | Sub-0.3s Fast Attendee Check-In | URPASS",
    description:
      "Turn any smartphone into a high-speed event entrance scanner. Sub-second verification, zero app downloads, and real-time multi-gate synchronization.",
    url: "https://urpass.space/event-qr-code-scanner",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function EventQrCodeScannerPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-qr-code-scanner",
        badge: "GATE ACCESS & ENTRY CONTROL",
        h1: "Event QR Code Scanner for Fast Attendee Check-In",
        hook: "Scan passes in under 0.3 seconds. Prevent duplicate tickets. Turn any smartphone into an entrance scanner.",
        subDescription:
          "Give door staff and volunteers a secure PIN link that opens directly in Safari or Chrome. Point the camera at any attendee's QR ticket for instant audio-visual entry confirmation.",
        primaryCtaLabel: "Try the Scanner Free",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Gate Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["<0.3s scan time", "Zero app download", "Multi-gate sync", "Audit trail logs"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Fast event QR code scanner running in any mobile browser: check in hundreds of attendees per gate per minute with real-time duplicate rejection.",
        comparisonRows: [
          {
            criteria: "Staff Onboarding & Setup",
            urpass: "Instant browser scanner with short PIN code — ready in 10 seconds",
            competitor: "Requires volunteers to download an app store app and configure accounts",
            urpassAdvantage: true,
          },
          {
            criteria: "Scan & Verification Speed",
            urpass: "< 0.3 seconds optical camera decode and database validation",
            competitor: "2 to 4 seconds per attendee causing long queues at registration desks",
            urpassAdvantage: true,
          },
          {
            criteria: "Duplicate & Fraud Prevention",
            urpass: "Immediate audio alert and red banner showing exact previous scan timestamp and gate",
            competitor: "Silent failures or delayed batch sync letting duplicates enter",
            urpassAdvantage: true,
          },
          {
            criteria: "Device Compatibility",
            urpass: "Works on any iOS Safari, Android Chrome, tablet, or laptop webcam",
            competitor: "Restricted to specific operating system versions or proprietary laser devices",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Slow Manual Apps & Paper Checklists",
        pageSpecificTakeaway:
          "An optical event QR code scanner operating directly in the mobile browser eliminates queue congestion at registration desks and eliminates the need for expensive rental hardware.",
      }}
    />
  );
}
