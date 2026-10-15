import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Registration Software for Indian Organizers — QR Passes & UPI | URPASS",
  description:
    "India's leading event registration software for organizers. Build custom registration forms, collect attendee details, accept instant UPI payments via Razorpay, and generate automated QR passes.",
  keywords: [
    "event registration software india",
    "event registration software for indian organizers",
    "event registration form builder india",
    "upi event ticketing platform india",
    "qr code event registration",
    "college event registration software",
    "corporate event registration india",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-software-india" },
  openGraph: {
    title: "Event Registration Software for Indian Organizers | URPASS",
    description:
      "Modern event registration software for Indian organizers. Custom form fields, instant QR pass generation, UPI integration, and sub-second phone scanning.",
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
        badge: "EVENT REGISTRATION SOFTWARE INDIA",
        h1: "Event Registration Software for Indian Organizers",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Replace clunky Google Forms with high-converting, branded registration pages that automatically generate scannable QR tickets, accept instant UPI payments, and verify attendees at the door in <0.3s.",
        primaryCtaLabel: "Get Started for ₹29 →",
        primaryCtaHref: "/signup?plan=pro&from=event-registration-software-india",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        trustHighlights: ["₹29 intro offer", "Razorpay / UPI", "Sub-0.3s QR scan", "0% Ticket Fee"],
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
