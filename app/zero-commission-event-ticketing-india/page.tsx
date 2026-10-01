import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Zero Commission Event Ticketing India — Keep 100% Ticket Sales | URPASS",
  description:
    "Keep 100% of your event ticket revenue in India. Zero platform commissions, direct UPI and Razorpay payouts, automated WhatsApp QR passes, and in-browser check-in.",
  keywords: [
    "zero commission event ticketing india",
    "0 commission event ticketing",
    "free event ticketing platform india",
    "zero fee ticketing platform",
    "ticket fee comparison india",
    "razorpay event ticketing",
    "sell tickets online without commission",
  ],
  alternates: { canonical: "https://urpass.space/zero-commission-event-ticketing-india" },
  openGraph: {
    title: "Zero Commission Event Ticketing India | Keep 100% Revenue | URPASS",
    description:
      "Sell event tickets in India with 0% platform cuts. Direct T+2 bank deposits, automated GST tax receipts, and sub-second QR code check-in.",
    url: "https://urpass.space/zero-commission-event-ticketing-india",
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

export default function ZeroCommissionEventTicketingIndiaPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/zero-commission-event-ticketing-india",
        badge: "0% PLATFORM COMMISSION TICKETING",
        h1: "Zero Commission Event Ticketing India",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Traditional ticketing portals charge 4% to 8% plus buyer fees on every ticket sold. URPASS charges 0% per-ticket commission, letting you keep every rupee of your event proceeds.",
        primaryCtaLabel: "Calculate savings",
        primaryCtaHref: "/event-ticketing-cost-calculator",
        secondaryCtaLabel: "Start Selling Tickets",
        secondaryCtaHref: "/signup",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "ticketing",
        description:
          "Zero commission event ticketing in India. Keep 100% of ticket sales revenue with 0% platform fees, direct Razorpay bank payouts, and digital QR passes.",
        comparisonRows: [
          {
            criteria: "Platform Commission on Sales",
            urpass: "0% Commission (Keep 100% of face value)",
            competitor: "4.0% to 7.9% deducted per ticket sold",
            urpassAdvantage: true,
          },
          {
            criteria: "Buyer Convenience Surcharge",
            urpass: "₹0 (Attendees pay exact face value + GST)",
            competitor: "2% to 4% added to attendee's cart",
            urpassAdvantage: true,
          },
          {
            criteria: "Merchant Payout Hold",
            urpass: "Direct T+2 settlement to your bank account",
            competitor: "Held until 7–14 days after event concludes",
            urpassAdvantage: true,
          },
          {
            criteria: "Customer Contact Ownership",
            urpass: "100% organizer ownership of attendee emails & phones",
            competitor: "Portal locks attendee data or markets competing events",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Commission-Based Portals (Townscript / Eventbrite India)",
        pageSpecificTakeaway:
          "An event selling 2,000 tickets at ₹500 generates ₹10,00,000 in gross revenue. On a traditional 5% commission model, ₹50,000 is lost to platform fees. With URPASS, organizers keep all ₹10,00,000 with a transparent flat monthly subscription.",
      }}
    />
  );
}
