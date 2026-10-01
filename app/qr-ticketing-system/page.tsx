import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "QR Ticketing System — End-to-End Digital Passes & Check-In | URPASS",
  description:
    "Complete QR ticketing system for event organizers. Generate secure digital QR passes, deliver via WhatsApp and Apple Wallet, and validate entries in <0.3s.",
  keywords: [
    "qr ticketing system",
    "digital qr ticketing system",
    "qr code event ticketing",
    "mobile qr pass generator",
    "event ticketing and qr check in",
    "automated qr code tickets",
  ],
  alternates: { canonical: "https://urpass.space/qr-ticketing-system" },
  openGraph: {
    title: "QR Ticketing System | End-to-End Digital Passes & Check-In | URPASS",
    description:
      "Modern QR ticketing system for events. Digital QR passes, WhatsApp delivery, sub-second scanning, and atomic duplicate entry prevention.",
    url: "https://urpass.space/qr-ticketing-system",
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

export default function QrTicketingSystemPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/qr-ticketing-system",
        badge: "DIGITAL QR PASS PLATFORM",
        h1: "QR Ticketing System",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Generate high-contrast, cryptographically signed QR tickets that work across WhatsApp, Apple Wallet, and printed passes with instant optical scanning.",
        primaryCtaLabel: "Create QR tickets",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "End-to-end QR ticketing system: create digital tickets, distribute passes via WhatsApp, accept UPI payments, and scan guests at venue entrances.",
        comparisonRows: [
          {
            criteria: "QR Ticket Formatting",
            urpass: "Custom design studio with 12 dynamic visual templates",
            competitor: "Fixed black-and-white basic voucher PDF",
            urpassAdvantage: true,
          },
          {
            criteria: "Distribution Channels",
            urpass: "Direct WhatsApp delivery, Apple Wallet & Email",
            competitor: "Email attachment only",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Verification Time",
            urpass: "< 0.3s in-browser scanner on any smartphone",
            competitor: "Slow laser scanners or 3–5s manual app check-in",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission",
            urpass: "0% commission on ticket sales",
            competitor: "5% to 10% platform fee per ticket",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Legacy Ticketing Providers",
        pageSpecificTakeaway:
          "A modern QR ticketing system connects ticket design, distribution, payment collection, and gate scanning into a single frictionless pipeline with zero per-ticket cuts.",
      }}
    />
  );
}
