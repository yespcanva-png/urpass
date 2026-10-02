import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Free Online Event Ticketing Software — Digital QR Passes | URPASS",
  description:
    "Free online event ticketing software for community organizers, meetups, workshops, and student clubs. Host 2 events/month with up to 100 registrations/month at zero cost.",
  keywords: [
    "free online event ticketing",
    "free event ticketing software",
    "free event registration platform",
    "free qr code ticket generator",
    "free RSVP platform with qr codes",
    "zero cost event check in software",
  ],
  alternates: { canonical: "https://urpass.space/free-online-event-ticketing" },
  openGraph: {
    title: "Free Online Event Ticketing Software | URPASS",
    description:
      "Start hosting events at ₹0/£0 forever. Generate digital QR tickets, manage registrations, and scan attendees at the entrance on your smartphone.",
    url: "https://urpass.space/free-online-event-ticketing",
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

export default function FreeOnlineEventTicketingPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/free-online-event-ticketing",
        badge: "PERMANENT FREE TIER",
        h1: "Free Online Event Ticketing Software",
        hook: "Host free events with zero platform costs. Issue digital QR passes. Upgrade only when you grow.",
        subDescription:
          "Everything you need to publish an event registration page, collect attendee details, deliver scannable QR passes, and check in guests — without entering a credit card.",
        primaryCtaLabel: "Start Free Forever",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Explore All Features",
        secondaryCtaHref: "/free-event-registration",
        trustHighlights: ["2 events/month free", "100 registrations/mo", "No credit card needed", "Browser QR scanner"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Free online event ticketing software: create registration forms, issue digital QR passes, and scan attendees at venue gates with 0 platform fees.",
        comparisonRows: [
          {
            criteria: "Free Plan Event Quota",
            urpass: "2 active events/month with up to 100 registrations/month forever",
            competitor: "Trial period expires after 14 days or forces costly enterprise upgrade",
            urpassAdvantage: true,
          },
          {
            criteria: "Digital QR Passes Included",
            urpass: "Fully formatted digital passes with live dynamic QR codes on free tier",
            competitor: "Charges premium add-ons for mobile passes or QR check-in capabilities",
            urpassAdvantage: true,
          },
          {
            criteria: "Credit Card Requirement",
            urpass: "Zero credit card or payment setup required to get started",
            competitor: "Requires upfront credit card details with recurring billing traps",
            urpassAdvantage: true,
          },
          {
            criteria: "Ad-Free Registration Pages",
            urpass: "Clean, professional attendee registration form with zero third-party ads",
            competitor: "Displays competitor ads and unsolicited promotional sponsors to your attendees",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Generic RSVP Tools & Ad-Supported Forms",
        pageSpecificTakeaway:
          "Community leaders and grassroots organisers deserve professional event ticketing and QR check-in tools without paywalls, intrusive ads, or complex onboarding.",
      }}
    />
  );
}
