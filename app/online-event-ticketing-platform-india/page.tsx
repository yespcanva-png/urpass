import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Online Event Ticketing Platform India — 0% Commission | URPASS",
  description:
    "The modern online event ticketing platform in India. Sell paid tickets with 0% commission, accept instant UPI payments, deliver WhatsApp QR passes, and check in attendees in <0.3s.",
  keywords: [
    "online event ticketing platform india",
    "online event ticketing india",
    "sell tickets online india",
    "paid event ticketing india",
    "upi event ticketing platform",
    "zero commission event ticketing",
    "best ticketing platform india",
  ],
  alternates: { canonical: "https://urpass.space/online-event-ticketing-platform-india" },
  openGraph: {
    title: "Online Event Ticketing Platform India — 0% Commission | URPASS",
    description:
      "Sell paid tickets online in India with 0% platform commission. Instant UPI checkout, Razorpay settlements, WhatsApp QR passes, and sub-second door check-in.",
    url: "https://urpass.space/online-event-ticketing-platform-india",
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

export default function OnlineEventTicketingPlatformIndiaPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/online-event-ticketing-platform-india",
        badge: "PAID EVENT TICKETING PLATFORM",
        h1: "Online Event Ticketing Platform India",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Create your paid event in minutes. Connect your Razorpay account, collect UPI & card payments with zero platform commission, and validate guests with digital QR passes.",
        primaryCtaLabel: "Create paid event",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Online event ticketing platform in India: sell paid tickets with 0% platform commission, direct Razorpay settlements, and instant QR check-in on any mobile phone.",
        comparisonRows: [
          {
            criteria: "Platform Commission on Sales",
            urpass: "0% Commission (Fixed monthly plan starting at ₹0)",
            competitor: "4.0% to 7.9% deducted per ticket sold",
            urpassAdvantage: true,
          },
          {
            criteria: "Payment Experience",
            urpass: "Sub-5s instant UPI (PhonePe, GPay, Paytm) + Cards",
            competitor: "Redirect hops and frequent mobile cart abandonment",
            urpassAdvantage: true,
          },
          {
            criteria: "Ticket Delivery",
            urpass: "Instant WhatsApp QR passes, Apple Wallet & Email",
            competitor: "Generic PDF email attachment",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Check-In Hardware",
            urpass: "Any volunteer smartphone camera (<0.3s validation)",
            competitor: "Dedicated hardware rentals or clunky apps",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Traditional Aggregators",
        pageSpecificTakeaway:
          "Setting up a paid event online in India no longer requires giving up 5% to 10% of gross ticket sales. URPASS connects directly to your Razorpay account so every rupee flows to your bank on standard T+2 cycles.",
      }}
    />
  );
}
