import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "College Symposium Registration Software — Multi-Event Passes & QR | URPASS",
  description:
    "Specialized college symposium registration software. Manage department fests, track technical tracks, paper presentations, and issue multi-event QR entry badges.",
  keywords: [
    "symposium registration software",
    "college symposium registration software",
    "national level symposium registration",
    "technical symposium pass generator",
    "department symposium management system",
    "inter college symposium ticketing",
  ],
  alternates: { canonical: "https://urpass.space/college-symposium-registration-software" },
  openGraph: {
    title: "College Symposium Registration Software | URPASS Campus",
    description:
      "Run national and state-level engineering symposiums seamlessly. Multi-event track bundling, automated QR badges, and instant desk scanning.",
    url: "https://urpass.space/college-symposium-registration-software",
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

export default function CollegeSymposiumRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/college-symposium-registration-software",
        badge: "ACADEMIC & DEPARTMENT SYMPOSIUMS",
        h1: "College Symposium Registration Software",
        hook: "Manage department symposiums, track multiple paper presentations & coding contests, and issue automated QR entry passes.",
        subDescription:
          "Engineering and arts college departments can coordinate multi-track technical events, manage team paper submissions, and scan participant passes at lecture halls and seminar entrances.",
        primaryCtaLabel: "Launch Symposium Registration",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Talk to Campus Team",
        secondaryCtaHref: "/contact",
        trustHighlights: ["Multi-track bundling", "Instant UPI checkout", "Department reporting", "Sub-0.3s desk scan"],
        currency: "INR",
        cluster: "college",
        description:
          "College symposium registration software: manage paper presentations, project expos, coding hackathons, and department registrations with zero ticket commission.",
        comparisonRows: [
          {
            criteria: "Multi-Track & Event Selection",
            urpass: "Participants register once and select multiple technical competitions with dynamic pricing rules",
            competitor: "Requires separate disconnected Google Forms for each individual competition",
            urpassAdvantage: true,
          },
          {
            criteria: "Hall & Lab Entry Verification",
            urpass: "Session-level QR scanning verifies whether participant has registered for that specific symposium track",
            competitor: "Volunteers scramble to verify printed attendance sheets at laboratory doors",
            urpassAdvantage: true,
          },
          {
            criteria: "Registration Desk Throughput",
            urpass: "Fast optical QR scan validates arrival and prints/displays badge details in under 0.3s",
            competitor: "Long morning queues delaying keynote addresses by over an hour",
            urpassAdvantage: true,
          },
          {
            criteria: "Department Account Payouts",
            urpass: "100% of delegate fees deposit directly to department or student association bank accounts",
            competitor: "Ticketing aggregators hold symposium funds and take heavy commissions",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Multiple Google Forms & Cash Desks",
        pageSpecificTakeaway:
          "Department symposiums require structured track selection, team registration, and high-speed morning registration desk validation to keep academic schedules on time.",
      }}
    />
  );
}
