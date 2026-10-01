import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Registration Software India — Free Forms & QR Passes | URPASS",
  description:
    "India's leading event registration software. Build custom registration forms, collect attendee details, accept optional UPI payments, and generate automated QR passes.",
  keywords: [
    "event registration software india",
    "event registration form builder india",
    "free event registration platform india",
    "qr code event registration",
    "college event registration software",
    "corporate event registration india",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-india" },
  openGraph: {
    title: "Event Registration Software India | Free Forms & QR Passes | URPASS",
    description:
      "Modern event registration software for India. Custom form fields, instant QR pass generation, UPI integration, and mobile scanning.",
    url: "https://urpass.space/event-registration-software-india",
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

export default function EventRegistrationSoftwareIndiaPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-registration-software-india",
        badge: "EVENT REGISTRATION SOFTWARE",
        h1: "Event Registration Software India",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Replace clunky Google Forms with beautiful, branded registration pages that automatically generate scannable QR tickets and verify attendees at the door.",
        primaryCtaLabel: "Start free",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Event registration software in India: create custom registration forms, issue digital QR passes, accept UPI payments, and manage check-in without apps.",
        comparisonRows: [
          {
            criteria: "Digital QR Pass Generation",
            urpass: "Automated instant QR pass generated upon submission",
            competitor: "Google Forms requires complex third-party add-ons",
            urpassAdvantage: true,
          },
          {
            criteria: "Payment Collection",
            urpass: "Direct Razorpay UPI, Net Banking & Cards",
            competitor: "Manual screenshot uploads of UPI transaction IDs",
            urpassAdvantage: true,
          },
          {
            criteria: "Entrance Gate Verification",
            urpass: "<0.3s browser camera scanner with atomic duplicate blocking",
            competitor: "Manual spreadsheet lookup with duplicate risk",
            urpassAdvantage: true,
          },
          {
            criteria: "Ticket Delivery Channels",
            urpass: "WhatsApp, Apple Wallet, and Email",
            competitor: "Basic email confirmation only",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Google Forms / Typeform",
        pageSpecificTakeaway:
          "Event registration software in India should combine custom form builder tools with automated ticket distribution and instant gate validation. URPASS eliminates manual spreadsheet cross-referencing entirely.",
      }}
    />
  );
}
