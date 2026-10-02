import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Student Event Registration Platform — Club Meets & College Fests | URPASS",
  description:
    "Free student event registration platform for college clubs, student councils, and societies. Collect RSVPs, issue scannable QR passes via WhatsApp, and check in attendees fast.",
  keywords: [
    "student event registration platform",
    "college club registration software",
    "student union event ticketing",
    "campus society event registration",
    "student fest registration tool",
    "free student event passes",
  ],
  alternates: { canonical: "https://urpass.space/student-event-registration-platform" },
  openGraph: {
    title: "Student Event Registration Platform | URPASS Campus",
    description:
      "Simple, modern registration tool for student organizers. Launch club signups, technical workshops, and social meetups with instant QR passes.",
    url: "https://urpass.space/student-event-registration-platform",
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

export default function StudentEventRegistrationPlatformPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/student-event-registration-platform",
        badge: "STUDENT CLUBS & SOCIETIES",
        h1: "Student Event Registration Platform",
        hook: "Built for student unions, college clubs, and campus societies. Collect registrations & issue WhatsApp QR passes.",
        subDescription:
          "Ditch messy shared spreadsheets and unverified Google Forms. Set up your club meeting, hackathon, or cultural night in 2 minutes with automated QR passes.",
        primaryCtaLabel: "Create Student Event Free",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "See Campus Features",
        secondaryCtaHref: "/college-events",
        trustHighlights: ["₹0 free tier", "Mobile friendly", "WhatsApp ticket delivery", "Phone scanner"],
        currency: "INR",
        cluster: "college",
        description:
          "Student event registration platform: collect RSVPs, accept ticket payments with zero commission, and scan tickets at campus venues.",
        comparisonRows: [
          {
            criteria: "Registration Experience for Students",
            urpass: "Sleek mobile-first registration page with autofill and instant QR pass confirmation",
            competitor: "Clunky generic forms requiring attendees to screenshot confirmation text",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Verification at Venue",
            urpass: "Student volunteers scan QR passes using their own smartphone camera in 0.3s",
            competitor: "Volunteers manually cross-referencing names on printed roll lists",
            urpassAdvantage: true,
          },
          {
            criteria: "Duplicate Entry & Proxy Prevention",
            urpass: "Dynamic pass tokens reject duplicate scans and proxy sign-ins immediately",
            competitor: "Zero verification, allowing students to forward confirmations to unregistered friends",
            urpassAdvantage: true,
          },
          {
            criteria: "Student Committee Team Access",
            urpass: "Share volunteer PIN access for scanning without exposing dashboard admin controls",
            competitor: "Must share the entire organizer password or Google account with volunteers",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Google Forms & Printed Roll Lists",
        pageSpecificTakeaway:
          "Student club organizers need a fast, zero-cost, and reliable registration tool that makes events look professional and eliminates door-entry chaos.",
      }}
    />
  );
}
