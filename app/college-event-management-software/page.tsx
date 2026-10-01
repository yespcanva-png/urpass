import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "College Event Management Software — Fests, Symposiums & Multi-Gate QR | URPASS",
  description:
    "India's dedicated college event management software. Manage technical symposiums, cultural fests, workshops, and multi-gate check-in with 0% ticket commission.",
  keywords: [
    "college event management software",
    "college fest management platform",
    "college event registration software",
    "technical symposium registration",
    "campus event ticketing platform",
    "multi gate check in college fest",
  ],
  alternates: { canonical: "https://urpass.space/college-event-management-software" },
  openGraph: {
    title: "College Event Management Software | Fests & Multi-Gate QR | URPASS",
    description:
      "Engineered for Indian engineering colleges and universities. Host cultural fests and symposiums with instant UPI payments and multi-gate scanning.",
    url: "https://urpass.space/college-event-management-software",
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

export default function CollegeEventManagementSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/college-event-management-software",
        badge: "CAMPUS & COLLEGE EDITION",
        h1: "College Event Management Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Engineered for student coordinators and college faculty. Manage inter-college registrations, track multiple competitions, and coordinate 10+ campus gates seamlessly.",
        primaryCtaLabel: "Talk to Campus team",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Start Your College Event",
        secondaryCtaHref: "/signup",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "college",
        description:
          "College event management software in India: manage college fests, technical symposiums, workshops, and multi-gate QR check-in with 0% commission.",
        comparisonRows: [
          {
            criteria: "Multi-Competition / Event Bundling",
            urpass: "Unified fest pass with access control for 20+ sub-events",
            competitor: "Messy individual Google Forms per event with no sync",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Gate Campus Scanning",
            urpass: "Synchronized sub-0.3s browser scanner across all campus gates",
            competitor: "Crowded entrance bottlenecks with paper desk sign-ins",
            urpassAdvantage: true,
          },
          {
            criteria: "Student Committee Onboarding",
            urpass: "Volunteer PIN login with zero app installation",
            competitor: "Complex app logins and individual admin training",
            urpassAdvantage: true,
          },
          {
            criteria: "College Society Financial Payouts",
            urpass: "Direct T+2 bank deposits to student council / college account",
            competitor: "Platform holds fest ticket funds for weeks after the fest",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Paper Sign-Ins & Manual Forms",
        pageSpecificTakeaway:
          "College fests and symposiums handle thousands of inter-college students across multiple gates simultaneously. URPASS delivers atomic duplicate prevention and high-speed in-browser validation with zero hardware costs.",
      }}
    />
  );
}
