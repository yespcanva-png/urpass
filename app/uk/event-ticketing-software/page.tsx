import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Ticketing Software UK — 0% Commission & Sub-Second QR Check-In | URPASS",
  description:
    "The UK's dedicated zero-commission event ticketing software. Sell tickets in GBP (£), accept cards & Apple Pay via Stripe, issue digital QR passes, and check in attendees in <0.3s.",
  keywords: [
    "event ticketing software uk",
    "zero commission event ticketing uk",
    "event ticketing platform uk",
    "eventbrite alternative uk",
    "qr code event check in uk",
    "sell tickets online uk",
  ],
  alternates: { canonical: "https://urpass.space/uk/event-ticketing-software" },
  openGraph: {
    title: "Event Ticketing Software UK | 0% Commission & QR Check-In | URPASS",
    description:
      "Sell event tickets across the UK with 0% platform cuts. Transparent GBP pricing, UK GDPR compliance, and sub-second browser scanning.",
    url: "https://urpass.space/uk/event-ticketing-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.4360",
  },
};

export default function UkEventTicketingSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/uk/event-ticketing-software",
        badge: "UK EVENT TICKETING",
        h1: "Event Ticketing Software UK",
        hook: "Sell tickets. Accept cards & Apple Pay. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Keep 100% of your ticket sales across London, Manchester, Birmingham, Edinburgh, and across the UK. Zero percentage platform fees, transparent GBP pricing, and instant in-browser check-in.",
        primaryCtaLabel: "Start UK event",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["£0 to start", "Stripe / Cards / Apple Pay", "QR check-in", "Apple Wallet & Email passes"],
        currency: "GBP",
        cluster: "uk",
        description:
          "Event ticketing software UK: sell tickets with 0% platform commission in GBP, collect payments via Stripe and Apple Pay, and scan passes in <0.3s without apps.",
        comparisonRows: [
          {
            criteria: "Platform Commission per Ticket",
            urpass: "0% Commission (Fixed monthly plan starting at £0)",
            competitor: "3.7% to 6.9% + £0.79 deducted per ticket",
            urpassAdvantage: true,
          },
          {
            criteria: "Buyer Surcharge at Checkout",
            urpass: "£0 added to attendee cart",
            competitor: "£0.50 to £1.50 booking fee added to buyer",
            urpassAdvantage: true,
          },
          {
            criteria: "Free Event Organizer Limits",
            urpass: "Permanent Free Tier up to 100 registrations/month",
            competitor: "Strict 25-ticket cap on free events before mandatory upgrade",
            urpassAdvantage: true,
          },
          {
            criteria: "Door Entry Scanning Hardware",
            urpass: "Any smartphone browser (Safari/Chrome) in <0.3s",
            competitor: "Requires downloading separate scanner apps",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Eventbrite UK / Legacy Portals",
        pageSpecificTakeaway:
          "Selling 500 tickets at £30 generates £15,000 in gross revenue. On traditional UK ticketing platforms charging 4% + £0.79/ticket, you lose nearly £1,000 in platform fees. With URPASS, you keep 100% of your ticket revenue.",
      }}
    />
  );
}
