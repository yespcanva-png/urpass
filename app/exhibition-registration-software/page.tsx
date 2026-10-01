import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Exhibition Registration Software — Multi-Gate Visitor Passes & Badge Scanning | URPASS",
  description:
    "Exhibition registration software for trade fairs and consumer expos. Manage visitor registration, issue digital QR entry passes, and coordinate multi-gate check-in.",
  keywords: [
    "exhibition registration software",
    "trade fair visitor registration",
    "expo entry management system",
    "exhibition badge printing software",
    "visitor check in software expo",
    "multi hall exhibition access control",
  ],
  alternates: { canonical: "https://urpass.space/exhibition-registration-software" },
  openGraph: {
    title: "Exhibition Registration Software | Multi-Gate Passes | URPASS",
    description:
      "High-throughput exhibition registration and visitor check-in. Digital QR badges, multi-hall entrance scanning, and real-time attendance telemetry.",
    url: "https://urpass.space/exhibition-registration-software",
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

export default function ExhibitionRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/exhibition-registration-software",
        badge: "EXHIBITION & TRADE FAIR",
        h1: "Exhibition Registration Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Handle 10,000+ exhibition visitors across multiple expo hall entrances. Issue digital visitor badges to WhatsApp and scan entries in under 0.3 seconds.",
        primaryCtaLabel: "Talk to sales",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Plan Your Event Entry",
        secondaryCtaHref: "/event-check-in-calculator",
        trustHighlights: ["₹0 to start", "Multi-gate sync", "QR check-in", "Live crowd analytics"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Exhibition registration software: high-capacity visitor registration, multi-hall badge verification, sub-second scanning, and 0% ticket commission.",
        comparisonRows: [
          {
            criteria: "Multi-Hall Entrance Throughput",
            urpass: "Sub-0.3s validation processes up to 30 visitors/minute per lane",
            competitor: "Slow 5s scanner validation creating massive registration lines",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Hardware Deployment",
            urpass: "Any smartphone camera via web browser (0 rental expenses)",
            competitor: "Leased barcode turnstiles and dedicated hardware guns",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Day Visitor Access",
            urpass: "Dynamic multi-day access rules and atomic duplicate blocking",
            competitor: "Separate physical wristbands or daily manual reissue",
            urpassAdvantage: true,
          },
          {
            criteria: "Visitor Pass Delivery",
            urpass: "Direct WhatsApp QR pass + Apple Wallet & email",
            competitor: "Mandatory printout required at registration counters",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Legacy Expo Hardware Vendors",
        pageSpecificTakeaway:
          "Exhibitions experience intense arrival surges in morning hours. URPASS browser-based scanners allow expo directors to deploy 10 to 30 volunteer phone lanes within minutes to clear crowds fast.",
      }}
    />
  );
}
