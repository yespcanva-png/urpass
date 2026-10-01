import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Hackathon Registration Platform — Team Applications, Passes & Gate Check-In | URPASS",
  description:
    "The complete hackathon registration platform. Collect developer team registrations, manage application approvals, issue hacker QR passes, and check in attendees in <0.3s.",
  keywords: [
    "hackathon registration platform",
    "hackathon event management",
    "hackathon team registration software",
    "developer hackathon passes",
    "hackathon check in system",
    "code sprint registration",
  ],
  alternates: { canonical: "https://urpass.space/hackathon-registration-platform" },
  openGraph: {
    title: "Hackathon Registration Platform | Team Applications & QR Check-In | URPASS",
    description:
      "Run your hackathon on URPASS. Team registration, GitHub/LinkedIn profile collection, instant digital hacker passes, and sub-second door check-in.",
    url: "https://urpass.space/hackathon-registration-platform",
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

export default function HackathonRegistrationPlatformPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/hackathon-registration-platform",
        badge: "DEVELOPER HACKATHONS",
        h1: "Hackathon Registration Platform",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Built for hackathon organizers and developer communities. Collect team member info, manage review and approvals, issue cryptographic hacker passes, and check in teams in sub-seconds.",
        primaryCtaLabel: "Create hackathon",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Team registrations", "QR check-in", "Approval workflows"],
        currency: "INR",
        cluster: "college",
        description:
          "Hackathon registration platform: manage team applications, candidate approvals, digital QR pass issuance, and rapid entrance scanning for 24-48hr hackathons.",
        comparisonRows: [
          {
            criteria: "Team Registration Handling",
            urpass: "Unified team registration with individual hacker QR passes",
            competitor: "Clunky individual forms requiring manual spreadsheet merging",
            urpassAdvantage: true,
          },
          {
            criteria: "Approval Workflows",
            urpass: "1-click batch review, acceptance, and automated pass distribution",
            competitor: "Manual email blasts with high spam bounce rates",
            urpassAdvantage: true,
          },
          {
            criteria: "Midnight Re-Entry Tracking",
            urpass: "Atomic timestamp logging for venue re-entry over 48 hours",
            competitor: "Lost paper wristbands and security confusion",
            urpassAdvantage: true,
          },
          {
            criteria: "Free Tier for Student Hackathons",
            urpass: "100% Free Forever Tier for free community and student hackathons",
            competitor: "Mandatory fees or locked premium features",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Generic Event Platforms",
        pageSpecificTakeaway:
          "Hackathons need flexible team application workflows, rapid approval triggers, and reliable 24-hour venue access control. URPASS streamlines the hacker lifecycle with zero software fees.",
      }}
    />
  );
}
