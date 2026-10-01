import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Razorpay Event Ticketing Platform — Direct UPI Payouts & 0% Commission | URPASS",
  description:
    "Connect your own Razorpay account for event ticketing. Collect instant UPI, cards, and net banking with direct T+2 bank deposits and 0% URPASS platform commission.",
  keywords: [
    "razorpay event ticketing",
    "razorpay event ticketing platform",
    "upi event ticketing razorpay",
    "sell tickets using razorpay",
    "direct bank settlement event ticketing",
    "zero commission razorpay ticketing",
  ],
  alternates: { canonical: "https://urpass.space/razorpay-event-ticketing" },
  openGraph: {
    title: "Razorpay Event Ticketing Platform | Direct UPI & 0% Commission | URPASS",
    description:
      "Sell tickets directly through your verified Razorpay merchant account. 0% platform cuts, direct T+2 bank deposits, and automated GST tax invoices.",
    url: "https://urpass.space/razorpay-event-ticketing",
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

export default function RazorpayEventTicketingPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/razorpay-event-ticketing",
        badge: "DIRECT RAZORPAY INTEGRATION",
        h1: "Razorpay Event Ticketing Platform",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Connect your verified Razorpay merchant account to URPASS in under 2 minutes. Accept UPI, cards, and net banking directly into your own Indian bank account with 0% platform cuts.",
        primaryCtaLabel: "Connect Razorpay",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Razorpay event ticketing platform: connect your own Razorpay account, receive direct T+2 settlements, collect UPI payments, and pay 0% platform commission.",
        comparisonRows: [
          {
            criteria: "Merchant Account Ownership",
            urpass: "Direct merchant connection: your own Razorpay account",
            competitor: "Aggregator account holds all ticket money",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission on Sales",
            urpass: "0% commission (Pay standard PG rates + flat software fee)",
            competitor: "5% to 8% platform fee deducted from every ticket",
            urpassAdvantage: true,
          },
          {
            criteria: "Bank Settlement Timeline",
            urpass: "Direct T+2 settlement to your bank account",
            competitor: "Held for 7 to 14 days after the event concludes",
            urpassAdvantage: true,
          },
          {
            criteria: "GST Tax Receipts",
            urpass: "Automated B2B tax PDF receipts with your GSTIN",
            competitor: "Missing GSTIN capture or manual paperwork",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Third-Party Aggregators",
        pageSpecificTakeaway:
          "Using your own Razorpay gateway eliminates third-party payout delays, reduces ticket fees, and maintains positive cash flow to fund event deposits and venue vendor payments before doors open.",
      }}
    />
  );
}
