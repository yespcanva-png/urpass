import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "College Cultural Fest Ticketing — Pronites, Concerts & Multi-Gate QR | URPASS",
  description:
    "High-throughput college cultural fest ticketing platform. Sell pronite concert passes, multi-day fest tickets, and manage 10+ campus entry gates with 0% commission.",
  keywords: [
    "college cultural fest ticketing",
    "pronite ticket booking software",
    "college concert ticket system",
    "multi gate fest entry control",
    "campus cultural festival ticketing",
    "student fest pass platform",
  ],
  alternates: { canonical: "https://urpass.space/college-cultural-fest-ticketing" },
  openGraph: {
    title: "College Cultural Fest Ticketing | Pronites & Gate Control | URPASS",
    description:
      "Engineered for high-attendance campus cultural festivals and pronites. Tiered ticketing, anti-screenshot QR codes, and multi-gate scanning.",
    url: "https://urpass.space/college-cultural-fest-ticketing",
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

export default function CollegeCulturalFestTicketingPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/college-cultural-fest-ticketing",
        badge: "CULTURAL FESTS & PRONITES",
        h1: "College Cultural Fest Ticketing Platform",
        hook: "Pronite concert tickets. Multi-tier student passes. High-volume multi-gate crowd management.",
        subDescription:
          "Handle thousands of excited attendees streaming through campus gates on celebrity pronite evenings. Instant UPI checkout, anti-counterfeit QR passes, and atomic duplicate protection.",
        primaryCtaLabel: "Launch Cultural Fest Tickets",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book Fest Gate Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["0% ticket commission", "Anti-screenshot QR", "10+ gates simultaneous", "Direct UPI payout"],
        currency: "INR",
        cluster: "college",
        description:
          "College cultural fest ticketing platform: sell multi-day passes and pronite concert tickets with real-time multi-gate access control and zero ticket fees.",
        comparisonRows: [
          {
            criteria: "Gate Entry Rush & Throughput",
            urpass: "Sub-0.3s browser scanner processes up to 40 attendees per minute per gate lane",
            competitor: "Slow paper checking or crashing apps creating dangerous crowd crushes at main gates",
            urpassAdvantage: true,
          },
          {
            criteria: "Ticket Fraud & Screenshot Sharing",
            urpass: "Atomic database locking triggers immediate amber alerts if a QR screenshot is scanned at another gate",
            competitor: "No live sync across distant campus gates allowing multiple entries with one pass",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Day & VIP Pronite Tiers",
            urpass: "Single unified pass with granular permissions (Day 1, Day 2, Day 3, VIP Lounge, General Arena)",
            competitor: "Separate wristbands and manual stamping prone to tampering and loss",
            urpassAdvantage: true,
          },
          {
            criteria: "Fest Box Office Payout",
            urpass: "Zero commission — all ticket funds deposit directly into the student council / fest committee bank account",
            competitor: "Aggregator takes 7% to 12% plus charges processing cuts on high-priced pronite tickets",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Traditional Ticketing Portals & Wristband Desks",
        pageSpecificTakeaway:
          "College cultural fests generate high crowd density at evening concert hours. Atomic multi-gate QR validation stops pass-sharing fraud while keeping entrance lines flowing smoothly.",
      }}
    />
  );
}
