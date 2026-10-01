import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "UPI Event Ticketing Software — Instant PhonePe, GPay & QR Checkout | URPASS",
  description:
    "Accept instant UPI payments for your event tickets in India. Seamless checkout via Google Pay, PhonePe, Paytm, and BHIM UPI with 0% platform cuts and direct bank payouts.",
  keywords: [
    "upi event ticketing software",
    "upi event ticketing",
    "accept upi for event tickets",
    "google pay event tickets",
    "phonepe event ticketing",
    "instant upi ticketing platform",
    "zero commission upi ticketing",
  ],
  alternates: { canonical: "https://urpass.space/upi-event-ticketing-software" },
  openGraph: {
    title: "UPI Event Ticketing Software | Instant UPI Checkout & 0% Cut | URPASS",
    description:
      "Sell event tickets with instant UPI checkout. Support Google Pay, PhonePe, and Paytm with direct bank settlement and sub-second QR check-in.",
    url: "https://urpass.space/upi-event-ticketing-software",
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

export default function UpiEventTicketingSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/upi-event-ticketing-software",
        badge: "INSTANT UPI TICKETING",
        h1: "UPI Event Ticketing Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Over 80% of Indian event attendees prefer paying with UPI. Enable one-tap app switching and dynamic UPI QR checkout to minimize mobile cart abandonment.",
        primaryCtaLabel: "Accept UPI payments",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "UPI event ticketing software in India: accept instant Google Pay, PhonePe, and Paytm ticket payments with direct bank deposits and 0% platform commission.",
        comparisonRows: [
          {
            criteria: "Mobile Checkout Speed",
            urpass: "Sub-5 second checkout via native UPI app-switch & QR",
            competitor: "Multi-page redirects and slow card forms",
            urpassAdvantage: true,
          },
          {
            criteria: "Cart Abandonment Rate",
            urpass: "Under 8% cart abandonment with 1-tap UPI intent",
            competitor: "25% to 35% drop-off on slow payment gateways",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission",
            urpass: "0% commission on all UPI ticket transactions",
            competitor: "5% to 8% platform cut plus buyer surcharges",
            urpassAdvantage: true,
          },
          {
            criteria: "Settlement Schedule",
            urpass: "Direct T+2 settlement into your bank account",
            competitor: "Held by platform until 2 weeks after event",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Traditional Event Portals",
        pageSpecificTakeaway:
          "Frictionless UPI checkout is essential for high ticket sales conversion in India. URPASS combines instant UPI payments with automatic QR pass generation and WhatsApp delivery.",
      }}
    />
  );
}
