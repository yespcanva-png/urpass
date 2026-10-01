import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Eventbrite Alternative UK — 0% Ticket Commission & No 25-Ticket Cap | URPASS",
  description:
    "The leading Eventbrite alternative in the UK. Keep 100% of your ticket revenue with 0% platform cuts, no 25-attendee caps on free events, and sub-0.3s browser QR check-in.",
  keywords: [
    "eventbrite alternative uk",
    "cheaper alternative to eventbrite uk",
    "eventbrite fee comparison uk",
    "free event ticketing platform uk",
    "zero commission event ticketing uk",
    "eventbrite 25 ticket limit alternative",
  ],
  alternates: { canonical: "https://urpass.space/uk/eventbrite-alternative" },
  openGraph: {
    title: "Eventbrite Alternative UK | 0% Ticket Commission | URPASS",
    description:
      "Looking for a better Eventbrite alternative in the UK? Compare fees, free event limits, and gate scanning speeds. Keep 100% of your ticket revenue.",
    url: "https://urpass.space/uk/eventbrite-alternative",
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

export default function UkEventbriteAlternativePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/uk/eventbrite-alternative",
        badge: "EVENTBRITE ALTERNATIVE UK",
        h1: "Eventbrite Alternative UK",
        hook: "Sell tickets. Accept cards & Apple Pay. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Tired of Eventbrite's 25-ticket cap on free events and steep 3.7% + £0.79 per-ticket commissions? URPASS offers a 0% commission model with transparent flat subscriptions.",
        primaryCtaLabel: "Compare fees",
        primaryCtaHref: "/pricing",
        secondaryCtaLabel: "Start UK Event Free",
        secondaryCtaHref: "/signup",
        trustHighlights: ["£0 to start", "No 25-ticket cap", "0% commission", "Sub-0.3s scanning"],
        currency: "GBP",
        cluster: "uk",
        description:
          "Eventbrite alternative UK: eliminate per-ticket commissions, avoid restrictive 25-ticket caps on free events, and enjoy fast in-browser QR check-in.",
        comparisonRows: [
          {
            criteria: "Per-Ticket Platform Cut (Paid Events)",
            urpass: "0% Commission (Flat software subscription starting at £0)",
            competitor: "Up to 3.7% + £0.79 per ticket sold",
            urpassAdvantage: true,
          },
          {
            criteria: "Free Event Cap",
            urpass: "100 registrations/month on permanent Free Tier",
            competitor: "Capped at 25 tickets unless paying a recurring plan",
            urpassAdvantage: true,
          },
          {
            criteria: "Buyer Checkout Surcharges",
            urpass: "£0 (Attendees pay only face value of the ticket)",
            competitor: "Service fees added to attendee checkout cart",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Scanner Installation",
            urpass: "Instant browser scanner on any phone (0 app downloads)",
            competitor: "Mandatory Eventbrite Organizer app download",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Eventbrite UK",
        pageSpecificTakeaway:
          "Eventbrite charges both percentage cuts and per-ticket flat fees on paid events, and enforces a strict 25-attendee cap on free organizers. URPASS replaces per-ticket cuts with transparent flat pricing.",
      }}
    />
  );
}
