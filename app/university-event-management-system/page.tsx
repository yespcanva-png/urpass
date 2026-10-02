import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "University Event Management System — Multi-Department & Campus Access | URPASS",
  description:
    "Enterprise university event management system. Manage campus-wide symposiums, convocations, alumni meets, and inter-college fests with multi-gate QR access control.",
  keywords: [
    "university event management system",
    "campus event management platform",
    "higher education event ticketing",
    "university symposium registration system",
    "convocation qr check in software",
    "institutional event management software",
  ],
  alternates: { canonical: "https://urpass.space/university-event-management-system" },
  openGraph: {
    title: "University Event Management System | URPASS Campus",
    description:
      "Modern event management system for universities and higher education institutions. Department-level workspaces, fast smartphone QR check-in, and 0% ticket commissions.",
    url: "https://urpass.space/university-event-management-system",
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

export default function UniversityEventManagementSystemPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/university-event-management-system",
        badge: "CAMPUS & INSTITUTIONAL OS",
        h1: "University Event Management System",
        hook: "Campus-wide event registration. Multi-department access. Multi-gate QR check-in.",
        subDescription:
          "Equip academic departments, student councils, and university event committees with a unified platform for public registrations, digital pass distribution, and high-speed venue access.",
        primaryCtaLabel: "Request Campus Demo",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Start Free University Event",
        secondaryCtaHref: "/signup",
        trustHighlights: ["Multi-department support", "Atomic multi-gate sync", "Audit-ready logs", "0% commission"],
        currency: "INR",
        cluster: "college",
        description:
          "University event management system: run academic conferences, inter-college symposiums, convocations, and cultural festivals from one unified dashboard.",
        comparisonRows: [
          {
            criteria: "Administrative Hierarchy & Workspaces",
            urpass: "Central campus dashboard with role-based access for departments, clubs, and student leads",
            competitor: "Fragmented individual accounts with zero institutional oversight",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Gate Campus Entry Control",
            urpass: "Simultaneous scanning across 10+ campus gates with sub-0.3s validation and zero hardware cost",
            competitor: "Slow manual register sign-ins causing bottlenecks at campus security checkpoints",
            urpassAdvantage: true,
          },
          {
            criteria: "Audit & Accreditation Compliance",
            urpass: "Downloadable attendance timestamp reports and demographic breakdowns for NAAC/NIRF reporting",
            competitor: "Unstructured paper records prone to loss and audit discrepancies",
            urpassAdvantage: true,
          },
          {
            criteria: "Event Payment Routing",
            urpass: "Direct deposits to university finance accounts via UPI, Net Banking, and Cards",
            competitor: "Third-party escrow holding funds for weeks after the symposium or fest",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Disjointed Campus Spreadsheets & Paper Desks",
        pageSpecificTakeaway:
          "Modern universities need centralized event infrastructure that handles high student volume while maintaining security, compliance, and frictionless student entry.",
      }}
    />
  );
}
