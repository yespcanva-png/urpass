import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Conference Registration Software — Digital Badges, B2B GST & Sub-Second Check-In | URPASS",
  description:
    "Enterprise conference registration software. Multi-tier delegate badges, automated B2B GST invoices, instant QR check-in, and 0% ticket commission.",
  keywords: [
    "conference registration software",
    "conference ticketing platform",
    "b2b conference registration",
    "conference badge printing software",
    "summit registration software",
    "conference qr check in",
  ],
  alternates: { canonical: "https://urpass.space/conference-registration-software" },
  openGraph: {
    title: "Conference Registration Software | Digital Badges & B2B GST | URPASS",
    description:
      "Run professional conferences and summits with URPASS. Multi-tier passes, automated GST invoices, fast smartphone scanning, and zero commission.",
    url: "https://urpass.space/conference-registration-software",
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

export default function ConferenceRegistrationSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/conference-registration-software",
        badge: "CONFERENCE & SUMMIT EDITION",
        h1: "Conference Registration Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Power high-profile B2B conferences, developer summits, and medical congresses. Issue multi-tier delegate passes, collect GSTIN numbers at checkout, and scan badges in <0.3s.",
        primaryCtaLabel: "Book demo",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Start Selling Tickets",
        secondaryCtaHref: "/signup",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "Automated GST invoices"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Conference registration software: handle multi-track conferences, VIP delegate badges, automated B2B GST tax invoices, and sub-second entrance validation.",
        comparisonRows: [
          {
            criteria: "B2B GST Tax Invoicing",
            urpass: "Automated GSTIN capture and compliant corporate PDF tax invoices",
            competitor: "Manual invoice generation requested via support emails",
            urpassAdvantage: true,
          },
          {
            criteria: "Badge Customization Studio",
            urpass: "WYSIWYG Ticket Studio with 12 conference badge formats",
            competitor: "Generic single-format black and white ticket receipt",
            urpassAdvantage: true,
          },
          {
            criteria: "Multi-Gate Delegate Scanning Speed",
            urpass: "<0.3s validation with audible confirmation tone",
            competitor: "3 to 5 seconds per delegate causing foyer congestion",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission on Delegate Tickets",
            urpass: "0% commission (Keep 100% of high-value conference ticket revenue)",
            competitor: "5% to 8% cut totaling lakhs of rupees on large summits",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Enterprise Event Aggregators",
        pageSpecificTakeaway:
          "For high-ticket B2B conferences, platform percentage cuts severely erode organizer margins. On a ₹50,00,000 conference, traditional platforms deduct ₹2,50,000 to ₹4,00,000. URPASS charges zero commission.",
      }}
    />
  );
}
