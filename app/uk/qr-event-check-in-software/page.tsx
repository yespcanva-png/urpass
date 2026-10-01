import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "QR Check-In Software UK — Fast In-Browser Ticket Scanner | URPASS",
  description:
    "Fast in-browser QR check-in software for UK events. Scan tickets in <0.3s on iPhone or Android without downloading apps, manage multiple gates, and prevent duplicate entries.",
  keywords: [
    "qr check-in software uk",
    "qr code event check in uk",
    "event ticket scanner app uk",
    "mobile check in software uk",
    "conference entry scanning uk",
    "fast event check-in uk",
  ],
  alternates: { canonical: "https://urpass.space/uk/qr-event-check-in-software" },
  openGraph: {
    title: "QR Check-In Software UK | Fast In-Browser Ticket Scanner | URPASS",
    description:
      "Transform any phone into an entrance ticket scanner. Zero app downloads, sub-0.3s validation, multi-gate live sync, and UK GDPR compliance.",
    url: "https://urpass.space/uk/qr-event-check-in-software",
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

export default function UkQrEventCheckInSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/uk/qr-event-check-in-software",
        badge: "UK GATE SCANNER",
        h1: "QR Check-In Software UK",
        hook: "Sell tickets. Accept cards & Apple Pay. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Equip door stewards and university union volunteers with instant camera scanners. Decodes QR tickets in under 300 milliseconds directly inside Safari or Chrome.",
        primaryCtaLabel: "Try scanner",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Calculate Gate Capacity",
        secondaryCtaHref: "/event-check-in-calculator",
        trustHighlights: ["£0 to start", "Sub-0.3s validation", "Zero app downloads", "UK GDPR compliant"],
        currency: "GBP",
        cluster: "uk",
        description:
          "QR check-in software UK: fast browser-based ticket scanning, multi-gate synchronization, offline fault tolerance, and zero hardware rental costs.",
        comparisonRows: [
          {
            criteria: "Steward & Volunteer Onboarding",
            urpass: "Volunteers open a simple link in Safari/Chrome in 3 seconds",
            competitor: "Staff must download dedicated mobile apps and create logins",
            urpassAdvantage: true,
          },
          {
            criteria: "Ticket Decoding & Validation Speed",
            urpass: "< 0.3s optical verification with audible confirmation chime",
            competitor: "2.5 to 4 seconds per attendee causing foyer queues",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Entrance Anti-Duplicate Protection",
            urpass: "Database-level atomic row locks prevent pass reuse across doors",
            competitor: "Delayed cloud sync allowing duplicate entries",
            urpassAdvantage: true,
          },
          {
            criteria: "Data Privacy & Compliance",
            urpass: "Full UK GDPR compliance with zero third-party tracking",
            competitor: "Third-party analytics and data sharing",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Traditional Scanner Hardware / Apps",
        pageSpecificTakeaway:
          "UK venues from student unions to exhibition halls require fast entrance throughput to prevent outdoor queues in rainy weather. URPASS optical scanning clears doors rapidly without specialized hardware.",
      }}
    />
  );
}
