import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Conference Registration Software UK — Delegate Badges & Fast Check-In | URPASS",
  description:
    "UK conference registration software for business summits, academic symposia, and tech congresses. Multi-tier delegate badges, VAT invoices, and sub-0.3s check-in.",
  keywords: [
    "conference registration software uk",
    "conference ticketing software uk",
    "academic conference management uk",
    "delegate badge check in uk",
    "b2b conference registration platform",
    "zero commission conference ticketing uk",
  ],
  alternates: { canonical: "https://urpass.space/uk/conference-registration-software" },
  openGraph: {
    title: "Conference Registration Software UK | Delegate Badges | URPASS",
    description:
      "Enterprise conference registration software for the UK. Multi-tier delegate tickets, digital badge studio, UK GDPR compliance, and sub-second QR entry.",
    url: "https://urpass.space/uk/conference-registration-software",
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

export default function UkConferenceRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/uk/conference-registration-software",
        badge: "UK CONFERENCES & SUMMITS",
        h1: "Conference Registration Software UK",
        hook: "Sell tickets. Accept cards & Apple Pay. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Power professional conferences across London, Edinburgh, Manchester, and Oxford. Issue multi-tier delegate passes, collect VAT details, and validate badges in under 0.3s.",
        primaryCtaLabel: "Book demo",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Start UK Event",
        secondaryCtaHref: "/signup",
        trustHighlights: ["£0 to start", "0% ticket cut", "UK GDPR compliant", "Sub-0.3s check-in"],
        currency: "GBP",
        cluster: "uk",
        description:
          "Conference registration software UK: handle multi-track delegate registrations, digital badge issuance, VAT receipts, and high-speed in-browser gate check-in.",
        comparisonRows: [
          {
            criteria: "Platform Commission on Delegate Tickets",
            urpass: "0% commission (Keep 100% of high-ticket conference sales)",
            competitor: "3.7% to 6.9% + per-ticket flat fee",
            urpassAdvantage: true,
          },
          {
            criteria: "Delegate Badge Customization",
            urpass: "Ticket Studio with 12 conference badge formats and custom fields",
            competitor: "Basic black-and-white standard voucher format",
            urpassAdvantage: true,
          },
          {
            criteria: "Foyer & Door Entry Scanning",
            urpass: "<0.3s validation on standard smartphones without apps",
            competitor: "3 to 5 seconds per delegate causing arrival bottlenecks",
            urpassAdvantage: true,
          },
          {
            criteria: "UK GDPR & Data Sovereignty",
            urpass: "Strict UK GDPR compliance with private organizer data ownership",
            competitor: "Platform markets competing industry events to attendees",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Traditional Conference Aggregators",
        pageSpecificTakeaway:
          "UK conference producers selling premium tickets lose thousands of pounds to percentage-based ticketing platforms. URPASS replaces percentage fees with transparent software pricing and faster badge validation.",
      }}
    />
  );
}
