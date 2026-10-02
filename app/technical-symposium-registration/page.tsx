import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Technical Symposium Registration Software — Multi-Event Paper & Code Tracks | URPASS",
  description:
    "Complete technical symposium registration software for engineering colleges. Run paper presentations, coding contests, project displays, and track-level QR validation with 0% commission.",
  keywords: [
    "technical symposium registration software",
    "technical symposium registration",
    "engineering symposium event software",
    "paper presentation registration system",
    "college coding contest ticketing",
    "multi track symposium registration",
  ],
  alternates: { canonical: "https://urpass.space/technical-symposium-registration" },
  openGraph: {
    title: "Technical Symposium Registration Software | URPASS Campus",
    description:
      "Engineered for CSE, ECE, Mechanical, and Engineering departments. Multi-track competition registration, instant UPI checkout, and sub-second desk check-in.",
    url: "https://urpass.space/technical-symposium-registration",
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

export default function TechnicalSymposiumRegistrationPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/technical-symposium-registration",
        badge: "ENGINEERING & TECHNICAL FESTS",
        h1: "Technical Symposium Registration Software",
        hook: "Paper presentations, project expos, coding hackathons, and multi-track technical events.",
        subDescription:
          "Provide delegates from across the state with an effortless registration portal. Collect technical paper abstracts, accept UPI payments, and issue unified digital event passes.",
        primaryCtaLabel: "Start Symposium Registration",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["Abstract submission support", "UPI payment verification", "Sub-0.3s desk scan", "Track attendance logs"],
        currency: "INR",
        cluster: "college",
        description:
          "Technical symposium registration software: manage paper presentations, project expos, coding hackathons, and technical tracks with digital QR passes.",
        comparisonRows: [
          {
            criteria: "Technical Track Management",
            urpass: "Unified pass allowing delegates to register for general entry plus specific technical competitions",
            competitor: "Disjointed forms leading to scheduling clashes and uncoordinated venue allocations",
            urpassAdvantage: true,
          },
          {
            criteria: "Abstract & Document Collection",
            urpass: "Integrated file upload fields for IEEE-format paper presentations and project posters",
            competitor: "Organizers have to dig through disorganized email inboxes to find student paper submissions",
            urpassAdvantage: true,
          },
          {
            criteria: "Morning Desk Check-In Speed",
            urpass: "Volunteers scan mobile QR passes in under 0.3s to issue symposium kits and food coupons",
            competitor: "Volunteers manually ticking paper lists while hundreds of delegates wait in line",
            urpassAdvantage: true,
          },
          {
            criteria: "Pricing & Platform Fees",
            urpass: "Flat subscription with 0% commission — all delegate fees go straight to the department",
            competitor: "Aggregator takes 5% to 10% cut per delegate ticket",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Manual Paper Spreadsheets & Unlinked Forms",
        pageSpecificTakeaway:
          "Engineering technical symposiums require fast registration throughput and track-specific check-ins so morning keynote sessions and judging panels start on schedule.",
      }}
    />
  );
}
