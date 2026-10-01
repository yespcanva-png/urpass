import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "QR Code Event Check-In Software — Fast In-Browser Scanner | URPASS",
  description:
    "Fast QR code event check-in software. Turn any smartphone into a <0.3s ticket scanner with zero app downloads, multi-gate sync, and atomic duplicate protection.",
  keywords: [
    "qr code event check-in software",
    "qr code event scanner",
    "event check-in app",
    "mobile ticket scanner",
    "browser qr scanner for events",
    "event entrance management",
    "offline event check-in",
  ],
  alternates: { canonical: "https://urpass.space/qr-code-event-check-in-software" },
  openGraph: {
    title: "QR Code Event Check-In Software | Fast In-Browser Scanner | URPASS",
    description:
      "Sub-second QR code event check-in. Zero app downloads, multi-gate live sync, offline support, and duplicate prevention.",
    url: "https://urpass.space/qr-code-event-check-in-software",
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

export default function QrCodeEventCheckInSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/qr-code-event-check-in-software",
        badge: "SUB-SECOND GATE SCANNING",
        h1: "QR Code Event Check-In Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Validate attendees at venue gates in under 0.3 seconds. Works directly inside Safari and Chrome on any smartphone with zero app installations required.",
        primaryCtaLabel: "Try scanner",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "QR code event check-in software: scan tickets in <0.3s using standard smartphone browsers, sync multiple gates in real time, and block duplicate passes.",
        comparisonRows: [
          {
            criteria: "Scanner Setup & Installation",
            urpass: "Instant URL link in Safari/Chrome (0 downloads)",
            competitor: "Volunteers must download dedicated mobile apps",
            urpassAdvantage: true,
          },
          {
            criteria: "Validation Speed per Ticket",
            urpass: "< 0.3 seconds per scan with audio chime",
            competitor: "2.5 to 5.0 seconds per ticket",
            urpassAdvantage: true,
          },
          {
            criteria: "Duplicate Entry Prevention",
            urpass: "Atomic database locks across all gates simultaneously",
            competitor: "Periodic batch syncs risking multiple admissions",
            urpassAdvantage: true,
          },
          {
            criteria: "Hardware Cost",
            urpass: "₹0 (Use existing staff and volunteer smartphones)",
            competitor: "Expensive laser barcode scanner rentals",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Traditional Scanner Hardware / Apps",
        pageSpecificTakeaway:
          "Fast QR code check-in software removes venue bottlenecks by allowing volunteers to scan attendees continuously with high audio confirmation chimes without staring at screens.",
      }}
    />
  );
}
