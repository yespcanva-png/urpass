import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Conference Ticketing Software | UrPass",
  description:
    "End-to-end ticketing platform for corporate summits, tech conferences and academic conventions with multi-tier ticket capabilities.",
  keywords: [
    "conference ticketing platform",
    "sell conference tickets online",
    "conference pass booking system",
    "b2b summit ticketing",
    "zero commission conference ticketing",
    "developer conference registration platform",
  ],
  alternates: { canonical: "https://urpass.space/conference-ticketing-platform" },
  openGraph: {
    title: "Conference Ticketing Software | UrPass",
    description:
      "End-to-end ticketing platform for corporate summits, tech conferences and academic conventions with multi-tier ticket capabilities.",
    url: "https://urpass.space/conference-ticketing-platform",
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

export default function ConferenceTicketingPlatformPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/conference-ticketing-platform",
        badge: "CONFERENCE TICKETING",
        h1: "Manage Conference Tickets, Registration and Check-In",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Create multi-tier delegate passes (Early Bird, Standard, VIP, Workshop add-ons). Collect payments via UPI and corporate cards with direct T+2 bank deposits.",
        primaryCtaLabel: "Start conference",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "Automated GST invoices"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Conference ticketing platform: sell multi-tier conference tickets with 0% platform commission, direct Razorpay gateway payouts, and sub-second entrance scanning.",
        comparisonRows: [
          {
            criteria: "Platform Commission on Sales",
            urpass: "0% Commission (Fixed flat monthly subscription)",
            competitor: "4.5% to 7.9% deducted per delegate ticket",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Tier Pass Management",
            urpass: "Dynamic capacity limits, discount codes, and workshop add-ons",
            competitor: "Rigid tier configuration with hidden upgrade fees",
            urpassAdvantage: true,
          },
          {
            criteria: "Corporate GSTIN Collection",
            urpass: "Automated GSTIN validation and instant compliant tax receipts",
            competitor: "Manual invoicing inquiries creating administrative backlog",
            urpassAdvantage: true,
          },
          {
            criteria: "Entrance Gate Verification",
            urpass: "<0.3s validation on standard volunteer smartphones",
            competitor: "Hardware laser scanner rentals costing ₹25,000+",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Legacy Ticketing Aggregators",
        pageSpecificTakeaway:
          "Conference ticketing demands professional financial handling and rapid gate throughput. URPASS combines corporate GST compliance with zero percentage commission on delegate sales.",
      }}
    />
  );
}
