import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Seminar Registration Software — Academic, Medical & Professional Seminars | URPASS",
  description:
    "Seminar registration software for professional, medical, and academic institutions. Collect registrations, accept UPI payments, issue digital QR passes, and track attendance.",
  keywords: [
    "seminar registration software",
    "seminar ticketing system",
    "academic seminar registration",
    "medical seminar check in",
    "professional seminar software",
    "webinar and in-person seminar platform",
  ],
  alternates: { canonical: "https://urpass.space/seminar-registration-software" },
  openGraph: {
    title: "Seminar Registration Software | Professional Seminars & Passes | URPASS",
    description:
      "Run professional seminars with seamless registrations, instant QR passes, 0% platform commission, and live attendance tracking.",
    url: "https://urpass.space/seminar-registration-software",
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

export default function SeminarRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/seminar-registration-software",
        badge: "SEMINARS & SYMPOSIUMS",
        h1: "Seminar Registration Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Designed for professional associations, medical councils, and academic faculty. Issue certified attendee credentials, capture GSTIN details, and track attendance effortlessly.",
        primaryCtaLabel: "Create seminar",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "Automated GST invoices"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Seminar registration software: collect registrations, generate digital QR passes, automate GST tax invoices, and track seminar attendance in <0.3s.",
        comparisonRows: [
          {
            criteria: "B2B Tax Invoicing & GSTIN",
            urpass: "Automated GSTIN capture and compliant B2B tax PDF receipts",
            competitor: "Manual invoice creation and paperwork burden",
            urpassAdvantage: true,
          },
          {
            criteria: "Attendance Verification & CME Credits",
            urpass: "Sub-0.3s scanning records precise arrival timestamps for audits",
            competitor: "Paper signatures that are easily misplaced or falsified",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission",
            urpass: "0% commission on seminar ticket revenue",
            competitor: "5% to 8% platform fee deducted from ticket sales",
            urpassAdvantage: true,
          },
          {
            criteria: "Volunteer Gate Setup",
            urpass: "Direct in-browser camera scanning without app downloads",
            competitor: "Mandatory app store downloads or paper registration",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Generic Event Aggregators",
        pageSpecificTakeaway:
          "Seminars require precise attendance logging for professional certifications and continuing education credits. URPASS records verifiable check-in timestamps with zero hardware rentals.",
      }}
    />
  );
}
