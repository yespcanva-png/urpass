import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Online Ticket Booking System for Events — 0% Commission | URPASS",
  description:
    "Self-hosted online ticket booking system for events. Sell tickets via UPI, credit cards, and net banking with direct gateway settlements and automated digital QR passes.",
  keywords: [
    "online ticket booking system for events",
    "event ticket booking software",
    "online ticketing system",
    "sell event tickets online",
    "zero commission event ticketing system",
    "event booking website builder",
  ],
  alternates: { canonical: "https://urpass.space/online-ticket-booking-system-for-events" },
  openGraph: {
    title: "Online Ticket Booking System for Events | URPASS",
    description:
      "Build a customized ticket booking page for your event. Direct UPI & Stripe payouts, automatic QR ticket delivery, and 0% per-ticket platform fees.",
    url: "https://urpass.space/online-ticket-booking-system-for-events",
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

export default function OnlineTicketBookingSystemForEventsPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/online-ticket-booking-system-for-events",
        badge: "DIRECT TICKET BOOKING",
        h1: "Online Ticket Booking System for Events",
        hook: "Launch branded ticket booking pages. Collect direct UPI & Card payments. Zero ticketing commissions.",
        subDescription:
          "Stop losing 5–10% of your box office revenue to ticketing middlemen. Connect your own payment gateway, publish a high-converting booking form, and issue instant QR passes.",
        primaryCtaLabel: "Launch Booking Page Free",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Compare Fee Savings",
        secondaryCtaHref: "/pricing",
        trustHighlights: ["0% commission", "Instant UPI checkout", "Automated GST invoices", "Instant QR delivery"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Online ticket booking system for events in India and the UK: sell multi-tier event tickets, collect payments directly to your bank account, and scan tickets at the door.",
        comparisonRows: [
          {
            criteria: "Per-Ticket Convenience Fee",
            urpass: "0% commission — keep 100% of your ticket price minus standard gateway interchange",
            competitor: "Takes 5% to 12% cut from every ticket transaction plus buyer convenience fees",
            urpassAdvantage: true,
          },
          {
            criteria: "Payment Settlement Timeline",
            urpass: "Direct T+2 deposits into your merchant bank account",
            competitor: "Withholds funds until 7 to 14 days after the event has concluded",
            urpassAdvantage: true,
          },
          {
            criteria: "Attendee Data Ownership",
            urpass: "100% first-party data ownership with one-click CSV export and zero cross-marketing",
            competitor: "Competitors market rival events to your attendee database",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Tier & Early Bird Passes",
            urpass: "Custom ticket tiers, student discounts, coupon codes, and capacity capping",
            competitor: "Rigid ticket structures with extra surcharge tiers",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Third-Party Marketplace Portals",
        pageSpecificTakeaway:
          "Owning your online ticket booking system ensures your event keeps maximum profit margins, controls attendee relationships, and provides a seamless mobile checkout experience.",
      }}
    />
  );
}
