import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Registration With QR Code — Instant Passes & Scanning | URPASS",
  description:
    "Event registration with automated QR codes. Create registration forms, issue digital QR passes to attendees via WhatsApp, and scan tickets at the door.",
  keywords: [
    "event registration with qr code",
    "event registration qr code generator",
    "qr code for event registration",
    "digital qr pass for events",
    "online registration with qr code",
    "qr ticket registration system",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-qr-code" },
  openGraph: {
    title: "Event Registration With QR Code | Instant Passes & Scanning | URPASS",
    description:
      "Automate event registrations with personalized QR code passes. Send tickets via WhatsApp and scan guests at the door in <0.3s.",
    url: "https://urpass.space/event-registration-qr-code",
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

export default function EventRegistrationQrCodePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-registration-qr-code",
        badge: "AUTOMATED QR REGISTRATION",
        h1: "Event Registration With QR Code",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Attendees fill out your custom registration form and instantly receive a personalized digital QR pass. Door volunteers scan passes in sub-seconds with zero paper waste.",
        primaryCtaLabel: "Create event",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Event registration with QR code: generate unique scannable tickets upon form submission, deliver passes via WhatsApp, and verify attendees in <0.3s.",
        comparisonRows: [
          {
            criteria: "QR Code Creation Time",
            urpass: "Instant cryptographic QR pass generated upon submit",
            competitor: "Manual mail merge or delayed batch script",
            urpassAdvantage: true,
          },
          {
            criteria: "Pass Delivery",
            urpass: "WhatsApp, Apple Wallet, and branded email receipt",
            competitor: "Plain text email or manual attachment",
            urpassAdvantage: true,
          },
          {
            criteria: "Entrance Validation",
            urpass: "Sub-0.3s camera scan with instant duplicate alerts",
            competitor: "Printed paper cross-off lists",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission",
            urpass: "0% commission on paid tickets",
            competitor: "5% to 8% platform cut",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Manual Google Forms Workflows",
        pageSpecificTakeaway:
          "Combining event registration with automated QR code generation ensures every registrant gets an anti-duplicate pass delivered instantly to their phone, cutting entrance wait times to seconds.",
      }}
    />
  );
}
