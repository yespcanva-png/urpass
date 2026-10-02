import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Inter-College Event Registration Platform — Team Passes & Security | URPASS",
  description:
    "End-to-end inter-college event registration platform. Collect visiting college student IDs, manage team entries, accept UPI payments, and verify credentials at campus entry gates.",
  keywords: [
    "inter college event registration",
    "inter collegiate fest registration",
    "visiting student pass management",
    "college competition team registration",
    "campus security gate pass for events",
    "inter college tournament ticketing",
  ],
  alternates: { canonical: "https://urpass.space/inter-college-event-registration" },
  openGraph: {
    title: "Inter-College Event Registration Platform | URPASS Campus",
    description:
      "Seamless registration and security check-in for inter-college competitions, cultural fests, and sports meets. Secure gate passes and atomic duplicate prevention.",
    url: "https://urpass.space/inter-college-event-registration",
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

export default function InterCollegeEventRegistrationPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/inter-college-event-registration",
        badge: "INTER-COLLEGIATE & CAMPUS ACCESS",
        h1: "Inter-College Event Registration Platform",
        hook: "Verify external college IDs. Collect team registrations. Manage campus gate security for visiting students.",
        subDescription:
          "Hosting students from 50+ visiting colleges? URPASS collects institution details, student ID uploads, and team member rosters, issuing secure QR gate passes for instant campus entry.",
        primaryCtaLabel: "Launch Inter-College Event",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Campus Security Features",
        secondaryCtaHref: "/multi-gate-event-check-in",
        trustHighlights: ["External college ID capture", "Team pass bundling", "Security gate scanner", "Zero commission"],
        currency: "INR",
        cluster: "college",
        description:
          "Inter-college event registration platform: register visiting delegations, verify student identities, and manage campus gate security with digital passes.",
        comparisonRows: [
          {
            criteria: "Visiting College ID Verification",
            urpass: "Collects college name, roll number, and optional ID card photo during registration",
            competitor: "Zero verification, leading to unauthorized outsiders entering campus grounds",
            urpassAdvantage: true,
          },
          {
            criteria: "Team & Delegation Registration",
            urpass: "Single team leader registers all members and distributes individual QR passes with one click",
            competitor: "Forces each team member to fill separate forms, causing fragmented entry records",
            urpassAdvantage: true,
          },
          {
            criteria: "Campus Security Gate Check-In",
            urpass: "Campus security guards or student volunteers scan passes at outer perimeter gates in <0.3s",
            competitor: "Massive security gate traffic jams requiring manual inspection of physical college IDs",
            urpassAdvantage: true,
          },
          {
            criteria: "Inter-College Participation Certificates",
            urpass: "Automated digital attendance export tagged by visiting college for certificate dispatch",
            competitor: "Laborious manual sorting of thousands of paper registration slips",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Paper Gate Registers & Unverified Forms",
        pageSpecificTakeaway:
          "Inter-college events present major campus security and logistics challenges. Pre-verified digital passes with smartphone QR scanning give college administration total peace of mind.",
      }}
    />
  );
}
