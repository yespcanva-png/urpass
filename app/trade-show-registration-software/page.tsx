import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Trade Show Registration Software — B2B Badge Management & Entrance Control | URPASS",
  description:
    "Trade show registration software for industry expos and B2B conventions. Manage exhibitor passes, buyer registrations, and synchronized multi-gate scanning.",
  keywords: [
    "trade show registration software",
    "b2b trade show ticketing",
    "trade show badge printing",
    "exhibitor pass management",
    "convention registration software",
    "expo entrance control",
  ],
  alternates: { canonical: "https://urpass.space/trade-show-registration-software" },
  openGraph: {
    title: "Trade Show Registration Software | B2B Badge Management | URPASS",
    description:
      "Modern trade show registration and badge scanning. Exhibitor tiers, buyer credentials, sub-second gate check-in, and full attendance export.",
    url: "https://urpass.space/trade-show-registration-software",
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

export default function TradeShowRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/trade-show-registration-software",
        badge: "TRADE SHOW & CONVENTION",
        h1: "Trade Show Registration Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Power high-traffic B2B trade shows, industrial conventions, and commercial expos. Manage exhibitor allotments, buyer tier credentials, and multi-entrance validation.",
        primaryCtaLabel: "Book demo",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Calculate Gate Capacity",
        secondaryCtaHref: "/event-check-in-calculator",
        trustHighlights: ["₹0 to start", "Multi-gate sync", "QR check-in", "Automated GST invoices"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Trade show registration software: manage exhibitor badges, buyer credentialing, multi-entrance gate scanning, and real-time attendance telemetry.",
        comparisonRows: [
          {
            criteria: "Exhibitor & Buyer Tier Partitioning",
            urpass: "Separate ticket types with custom access gates and validation rules",
            competitor: "One-size-fits-all registration with manual gate policing",
            urpassAdvantage: true,
          },
          {
            criteria: "Entrance Validation Speed",
            urpass: "<0.3s validation with visual color-coded pass confirmation",
            competitor: "Slow manual verification causing trade floor delays",
            urpassAdvantage: true,
          },
          {
            criteria: "B2B GST Compliance",
            urpass: "Automated GSTIN capture and compliant corporate tax PDF receipts",
            competitor: "Manual invoice generation via support desk",
            urpassAdvantage: true,
          },
          {
            criteria: "Hardware Deployment Overhead",
            urpass: "Zero hardware leases: gate staff use phone browsers (Safari/Chrome)",
            competitor: "High hardware leasing and technician travel costs",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Legacy Convention Systems",
        pageSpecificTakeaway:
          "Trade shows require strict separation between exhibitor badges, media passes, and commercial buyers. URPASS provides color-coded validation screens and sub-second verification across all venue gates.",
      }}
    />
  );
}
