import type { Metadata } from "next";
import { CreditCard, QrCode, ScanLine, ShieldCheck, Smartphone, Receipt, Users, Banknote } from "lucide-react";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Ticketing Software India — Instant UPI, 0% Commission & QR Passes | URPASS",
  description:
    "India's dedicated event ticketing software. Sell tickets with 0% platform commission, accept instant UPI & cards via Razorpay, generate GST tax invoices, and check in attendees in <0.3s on any phone browser.",
  keywords: [
    "event ticketing software india",
    "event ticketing platform india",
    "upi event ticketing",
    "zero commission event ticketing india",
    "razorpay event ticketing",
    "qr code event ticketing india",
    "college fest ticketing software",
    "conference ticketing software india",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-software-india" },
  openGraph: {
    title: "Event Ticketing Software India | 0% Commission & UPI QR | URPASS",
    description:
      "Sell event tickets in India with zero platform cut. Instant UPI checkout, Razorpay direct bank settlement, GST invoices, and sub-second QR check-in.",
    url: "https://urpass.space/event-ticketing-software-india",
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

export default function EventTicketingSoftwareIndiaPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-software-india",
        badge: "INDIA-FIRST EVENT TICKETING",
        h1: "Event Ticketing Software India",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Launch branded registration pages, collect instant UPI and card payments directly via Razorpay, generate GST invoices, and scan passes at the door in <0.3s.",
        primaryCtaLabel: "Start selling tickets",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Book a Demo",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "India's dedicated event ticketing software. Sell tickets with 0% platform commission, accept instant UPI & cards via Razorpay, generate GST invoices, and check in attendees in <0.3s.",
        comparisonRows: [
          {
            criteria: "Platform Commission on Sales",
            urpass: "0% Commission (Fixed flat subscription starting at ₹0)",
            competitor: "4.0% to 7.9% deducted per ticket sold",
            urpassAdvantage: true,
          },
          {
            criteria: "Buyer Convenience Surcharge",
            urpass: "₹0 added to attendee's checkout cart",
            competitor: "2% to 4% added to attendee's cart",
            urpassAdvantage: true,
          },
          {
            criteria: "Payout Settlement Schedule",
            urpass: "Direct T+2 bank settlement via linked Razorpay",
            competitor: "Held until 7–14 days post-event",
            urpassAdvantage: true,
          },
          {
            criteria: "GST Tax Invoicing",
            urpass: "Automated GSTIN collection & compliant B2B tax PDF receipts",
            competitor: "Manual invoice requests or missing GST details",
            urpassAdvantage: true,
          },
          {
            criteria: "Entrance Gate Scanner",
            urpass: "In-browser camera scanner (<0.3s validation, zero app download)",
            competitor: "Mandatory app download or expensive laser rentals",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Legacy Portals (Townscript / Eventbrite India)",
        pageSpecificTakeaway:
          "By switching from commission-charging aggregators to URPASS, organizers selling ₹10,00,000 in tickets save ₹50,000 to ₹80,000 in deducted platform fees while receiving direct bank settlements before event day.",
      }}
    />
  );
}
