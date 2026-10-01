import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "College Fest Registration Software — Forms, Passes & Gate Check-In | URPASS",
  description:
    "College fest registration software for engineering, arts, and medical colleges in India. Collect student registrations, accept UPI payments, and scan passes at entrance gates.",
  keywords: [
    "college fest registration software",
    "college fest registration form",
    "cultural fest registration software",
    "technical symposium registration software",
    "college fest qr code passes",
    "inter college fest management",
  ],
  alternates: { canonical: "https://urpass.space/college-fest-registration-software" },
  openGraph: {
    title: "College Fest Registration Software | Forms, Passes & Gate Check-In | URPASS",
    description:
      "Run your college fest registrations on URPASS. Custom student forms, roll number validation, instant UPI checkout, and sub-0.3s volunteer scanning.",
    url: "https://urpass.space/college-fest-registration-software",
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

export default function CollegeFestRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/college-fest-registration-software",
        badge: "COLLEGE FEST SPECIAL",
        h1: "College Fest Registration Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Launch branded registration forms for your college cultural or tech fest. Capture college name, student ID, and competition preferences with instant digital pass issuance.",
        primaryCtaLabel: "Create college fest",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Talk to Campus team",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "college",
        description:
          "College fest registration software: manage student registrations, collect fest fees via UPI, issue digital QR passes to WhatsApp, and coordinate campus entrance gates.",
        comparisonRows: [
          {
            criteria: "Registration Speed & Mobile Optimization",
            urpass: "Sub-10 second mobile registration with UPI one-tap payment",
            competitor: "Laggy Google Forms causing registration drop-off",
            urpassAdvantage: true,
          },
          {
            criteria: "Digital QR Ticket Generation",
            urpass: "Instant branded QR badge delivered to student WhatsApp",
            competitor: "Manual screenshot verification and email delays",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Queue Management",
            urpass: "In-browser volunteer scanning (<0.3s validation per pass)",
            competitor: "Manual paper list ticking creating 45-minute lobby queues",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Pricing for Colleges",
            urpass: "Permanent Free Tier for small events; 0% commission on tickets",
            competitor: "High per-ticket cuts taking funds from student budgets",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Google Forms & Paper Desk Lists",
        pageSpecificTakeaway:
          "College fests need fast, mobile-first registration that handles high registration surges without crashing. URPASS provides automated QR badges that student volunteers can scan using their own phones.",
      }}
    />
  );
}
