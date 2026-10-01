import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "University Event Management Software — Campus-Wide Multi-Department Platform | URPASS",
  description:
    "Enterprise university event management software. Empower faculty, academic departments, and student clubs to run conferences, seminars, convocation entries, and campus fests.",
  keywords: [
    "university event management software",
    "campus event management platform",
    "higher education event registration",
    "academic conference management software",
    "convocation qr check in software",
    "institution event ticketing",
  ],
  alternates: { canonical: "https://urpass.space/university-event-management-software" },
  openGraph: {
    title: "University Event Management Software | Campus Platform | URPASS",
    description:
      "Enterprise event registration, digital passes, and access control for universities. Centralized administration, multi-department access, and 0% ticket cuts.",
    url: "https://urpass.space/university-event-management-software",
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

export default function UniversityEventManagementSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/university-event-management-software",
        badge: "UNIVERSITY & INSTITUTIONAL",
        h1: "University Event Management Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Provide every academic department, student council, and research center with professional event registration, scannable QR passes, and audit-ready attendance reporting.",
        primaryCtaLabel: "Get institution pricing",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["Institutional billing", "Role-based access", "QR check-in", "Automated GST invoices"],
        currency: "INR",
        cluster: "college",
        description:
          "University event management software: campus-wide event registration, academic symposiums, convocation security scanning, and multi-department administrative controls.",
        comparisonRows: [
          {
            criteria: "Multi-Department Administrative Controls",
            urpass: "Role-based workspace access for departments, clubs, and faculty",
            competitor: "Siloed individual accounts with zero central visibility",
            urpassAdvantage: true,
          },
          {
            criteria: "Convocation & Auditorium Access Control",
            urpass: "Sub-0.3s QR scanning prevents unauthorized auditorium entry",
            competitor: "Paper pass distribution and manual security checks",
            urpassAdvantage: true,
          },
          {
            criteria: "Institutional Compliance & GST Invoicing",
            urpass: "Automated GSTIN collection, B2B tax PDF receipts, and CSV exports",
            competitor: "Manual invoice creation and messy spreadsheets",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Software Pricing",
            urpass: "Predictable institution-wide license with 0% per-ticket cut",
            competitor: "5% to 8% deducted from every paid academic conference",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Generic Legacy Portals",
        pageSpecificTakeaway:
          "Universities host hundreds of events every semester from academic symposia to sports fests. URPASS gives the entire institution unified branding, instant gate security, and comprehensive attendance logs.",
      }}
    />
  );
}
