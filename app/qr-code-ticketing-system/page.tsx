import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "QR Code Ticketing System for Events — Instant Digital Passes | URPASS",
  description:
    "Create and issue secure QR code tickets for events. Fast smartphone camera check-in, real-time duplicate protection, WhatsApp delivery, and 0% ticket commission.",
  keywords: [
    "QR code ticketing system",
    "QR code ticketing system for events",
    "event QR code ticket generator",
    "digital QR ticket platform",
    "mobile QR check in system",
    "secure QR event ticketing",
  ],
  alternates: { canonical: "https://urpass.space/qr-code-ticketing-system" },
  openGraph: {
    title: "QR Code Ticketing System for Events | URPASS",
    description:
      "Modern QR code ticketing system for conferences, fests, and workshops. Digital passes, WhatsApp delivery, sub-second scanning, and zero commission.",
    url: "https://urpass.space/qr-code-ticketing-system",
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

export default function QrCodeTicketingSystemPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/qr-code-ticketing-system",
        badge: "SMART DIGITAL TICKETING",
        h1: "QR Code Ticketing System for Events",
        hook: "Generate dynamic QR tickets. Accept UPI & Card payments. Prevent duplicate entries. Validate at the door in <0.3s.",
        subDescription:
          "Issue cryptographically unique QR tickets delivered directly to attendees via WhatsApp and email. Scan with any smartphone browser without buying expensive barcode hardware.",
        primaryCtaLabel: "Create QR Tickets Free",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "Sub-0.3s scan", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "End-to-end QR code ticketing system for events: design custom digital passes, accept payments with 0% platform fee, and scan attendees at high speed.",
        comparisonRows: [
          {
            criteria: "Scanner Hardware Requirements",
            urpass: "Any smartphone camera with a modern browser — zero dedicated hardware needed",
            competitor: "Proprietary handheld scanners or clunky external barcode readers",
            urpassAdvantage: true,
          },
          {
            criteria: "Duplicate Entry Protection",
            urpass: "Atomic database locking prevents identical QR codes from checking in twice across multiple gates",
            competitor: "Batch-synced apps vulnerable to offline duplicate scans",
            urpassAdvantage: true,
          },
          {
            criteria: "Attendee Delivery Channel",
            urpass: "Instant delivery via WhatsApp, Apple Wallet, and branded confirmation email",
            competitor: "PDF email attachment that attendees often lose in spam folders",
            urpassAdvantage: true,
          },
          {
            criteria: "Per-Ticket Platform Fee",
            urpass: "0% commission — flat monthly subscription",
            competitor: "5% to 10% convenience fee per ticket deducted from organizer revenue",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Legacy Barcode & PDF Ticketing",
        pageSpecificTakeaway:
          "A modern QR code ticketing system turns any smartphone into an enterprise-grade access control device while eliminating physical paper waste and ticketing commissions.",
      }}
    />
  );
}
