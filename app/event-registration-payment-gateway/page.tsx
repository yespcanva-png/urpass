import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Registration With Payment Gateway — 0% Commission | URPASS",
  description:
    "Event registration with integrated payment gateway. Collect custom attendee fields and process instant UPI & card payments with 0% platform cuts and direct bank deposits.",
  keywords: [
    "event registration with payment gateway",
    "event registration and payment system",
    "online registration with payment gateway",
    "paid event registration form",
    "upi event registration",
    "razorpay registration form",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-payment-gateway" },
  openGraph: {
    title: "Event Registration With Payment Gateway | 0% Commission | URPASS",
    description:
      "Seamless event registration forms with embedded payment gateways. Collect attendee info, accept UPI & cards, and issue automated digital QR passes.",
    url: "https://urpass.space/event-registration-payment-gateway",
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

export default function EventRegistrationPaymentGatewayPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-registration-payment-gateway",
        badge: "PAID REGISTRATION FORMS",
        h1: "Event Registration With Payment Gateway",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Combine customizable registration forms with instant checkout. Collect attendee details, process UPI and cards via your Razorpay gateway, and issue verified QR tickets automatically.",
        primaryCtaLabel: "Start paid registration",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Event registration with payment gateway: custom registration fields, instant UPI checkout, automated QR pass issuance, and direct bank settlement.",
        comparisonRows: [
          {
            criteria: "Registration & Checkout Flow",
            urpass: "Unified 1-page form + instant UPI/card payment",
            competitor: "Disconnected form followed by manual payment verification",
            urpassAdvantage: true,
          },
          {
            criteria: "Digital QR Ticket Issuance",
            urpass: "Instant automated generation upon payment confirmation",
            competitor: "Manual ticket generation via scripts or spreadsheets",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission",
            urpass: "0% commission on registration revenue",
            competitor: "5% to 8% platform cut on every registration",
            urpassAdvantage: true,
          },
          {
            criteria: "Door Entry Scanning",
            urpass: "<0.3s browser camera scanner with anti-duplicate validation",
            competitor: "Paper registration list cross-checking",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Generic Form Builders",
        pageSpecificTakeaway:
          "Managing paid event registrations requires an integrated pipeline from form fill to payment processing, QR ticket generation, and gate scanning. URPASS unifies the entire workflow with zero commission.",
      }}
    />
  );
}
