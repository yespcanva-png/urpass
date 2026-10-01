import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Workshop Registration Software — Paid Masterclasses, Capacity Limits & QR | URPASS",
  description:
    "Workshop registration software for bootcamps, training programs, and masterclasses. Set seat capacity limits, collect instant UPI payments, and scan attendee passes in <0.3s.",
  keywords: [
    "workshop registration software",
    "masterclass ticketing software",
    "bootcamp registration platform",
    "training event booking system",
    "paid workshop registration",
    "seat capacity event registration",
  ],
  alternates: { canonical: "https://urpass.space/workshop-registration-software" },
  openGraph: {
    title: "Workshop Registration Software | Paid Masterclasses & Passes | URPASS",
    description:
      "Sell workshop tickets with 0% platform commission. Real-time seat inventory, instant UPI payments, automated WhatsApp passes, and fast check-in.",
    url: "https://urpass.space/workshop-registration-software",
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

export default function WorkshopRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/workshop-registration-software",
        badge: "WORKSHOPS & MASTERCLASSES",
        h1: "Workshop Registration Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Run hands-on masterclasses, corporate workshops, and certification bootcamps. Lock strict seat capacities, collect UPI & card payments with 0% commission, and check in participants via QR code.",
        primaryCtaLabel: "Create workshop",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Workshop registration software: manage seat capacity, collect workshop fees via UPI with 0% commission, and issue verified QR entry passes.",
        comparisonRows: [
          {
            criteria: "Seat Inventory & Overbooking Protection",
            urpass: "Atomic database limits lock seats instantly upon payment",
            competitor: "Google Forms allows overbooking past room capacity",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission on Ticket Sales",
            urpass: "0% commission (Keep 100% of your course/workshop fee)",
            competitor: "5% to 10% deducted per attendee ticket",
            urpassAdvantage: true,
          },
          {
            criteria: "Pass Delivery",
            urpass: "Direct WhatsApp QR pass + Apple Wallet & email",
            competitor: "Email receipt that often lands in spam",
            urpassAdvantage: true,
          },
          {
            criteria: "Door Entry Scanning",
            urpass: "<0.3s validation on instructor/host phone browser",
            competitor: "Printed attendance sheets with manual check-off",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Generic Event Aggregators",
        pageSpecificTakeaway:
          "Workshop organizers selling 50 seats at ₹2,000 generate ₹1,00,000 in gross revenue. While traditional ticketing portals deduct ₹6,000 to ₹10,000 in fees, URPASS takes 0% commission.",
      }}
    />
  );
}
