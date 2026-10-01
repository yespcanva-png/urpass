import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Ticketing Payment Gateway — Direct Payouts & 0% Platform Fee | URPASS",
  description:
    "Connect your own payment gateway for event ticketing. Compare Razorpay, Stripe, and UPI options with direct bank deposits and 0% URPASS platform commission.",
  keywords: [
    "event ticketing payment gateway",
    "event payment gateway india",
    "payment gateway for event tickets",
    "razorpay event ticketing",
    "stripe event ticketing",
    "low fee event payment gateway",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-payment-gateway" },
  openGraph: {
    title: "Event Ticketing Payment Gateway | Direct Payouts & 0% Cut | URPASS",
    description:
      "Connect your preferred payment gateway for event ticketing. Retain 100% of ticket sales with 0% platform cuts and direct T+2 bank deposits.",
    url: "https://urpass.space/event-ticketing-payment-gateway",
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

export default function EventTicketingPaymentGatewayPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-payment-gateway",
        badge: "DIRECT PAYMENT GATEWAY",
        h1: "Event Ticketing Payment Gateway",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Stop letting platforms hold your event funds for weeks. Connect your own Razorpay or Stripe account to receive direct T+2 deposits with 0% URPASS platform commission.",
        primaryCtaLabel: "Compare payment options",
        primaryCtaHref: "/pricing",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Event ticketing payment gateway: integrate Razorpay or Stripe directly, accept UPI and credit cards, and eliminate third-party payout holds.",
        comparisonRows: [
          {
            criteria: "Gateway Integration Architecture",
            urpass: "Direct merchant API connection: money routes to your bank",
            competitor: "Aggregator merchant account collects and withholds funds",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Markup on Gateway Fees",
            urpass: "0% markup (pay only genuine interchange rates)",
            competitor: "Up to 3% markup added on top of gateway processing",
            urpassAdvantage: true,
          },
          {
            criteria: "Cash Flow & Settlement Timing",
            urpass: "Rolling T+2 bank deposits before event day",
            competitor: "Payout released 7–14 days post-event",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Currency & International Support",
            urpass: "INR via Razorpay & UPI; GBP/USD via Stripe",
            competitor: "Limited regional payment support",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Aggregator Platforms",
        pageSpecificTakeaway:
          "Connecting your own payment gateway ensures you maintain complete financial control, direct customer relationships, and healthy operating cash flow leading up to your event.",
      }}
    />
  );
}
