import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Corporate Event Registration Software — Enterprise Guest Passes & SSO | URPASS",
  description:
    "Enterprise corporate event registration software. Host town halls, annual general meetings, customer summits, and product launches with white-label passes and audit-ready attendance.",
  keywords: [
    "corporate event registration software",
    "enterprise event management platform",
    "corporate town hall check in",
    "agm event registration software",
    "b2b corporate event platform",
    "employee event check in system",
  ],
  alternates: { canonical: "https://urpass.space/corporate-event-registration-software" },
  openGraph: {
    title: "Corporate Event Registration Software | Enterprise Guest Passes | URPASS",
    description:
      "Professional corporate event registration. Branded passes, fast guest check-in, real-time security logs, and enterprise data privacy.",
    url: "https://urpass.space/corporate-event-registration-software",
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

export default function CorporateEventRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/corporate-event-registration-software",
        badge: "ENTERPRISE & CORPORATE",
        h1: "Corporate Event Registration Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Designed for internal corporate town halls, enterprise customer summits, and partner roundtables. Deliver white-label digital passes and track guest arrival in real time.",
        primaryCtaLabel: "Book enterprise demo",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Start Free Event",
        secondaryCtaHref: "/signup",
        trustHighlights: ["Enterprise security", "Role-based access", "QR check-in", "Live audit logs"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Corporate event registration software: manage corporate summits, client roundtables, internal conferences, and secure smartphone check-in.",
        comparisonRows: [
          {
            criteria: "Brand Identity & White-Labeling",
            urpass: "Custom organization branding with zero third-party advertising",
            competitor: "Public portal shows competitor events and public banners",
            urpassAdvantage: true,
          },
          {
            criteria: "Executive & VIP Guest Arrival",
            urpass: "Instant sub-0.3s validation with optional discreet host alerts",
            competitor: "Awkward paper guest list searching at reception desks",
            urpassAdvantage: true,
          },
          {
            criteria: "Data Privacy & Governance",
            urpass: "SOC-ready architecture, encrypted attendee storage & CSV exports",
            competitor: "Aggregator shares or markets to corporate attendee lists",
            urpassAdvantage: true,
          },
          {
            criteria: "Pricing Architecture",
            urpass: "Transparent fixed subscription with zero per-ticket cuts",
            competitor: "Expensive enterprise contracts with minimum spend commitments",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Public Consumer Ticketing Portals",
        pageSpecificTakeaway:
          "Corporate events require immaculate brand presentation, strict attendee confidentiality, and frictionless executive arrivals. URPASS ensures professional door check-in without consumer advertising.",
      }}
    />
  );
}
