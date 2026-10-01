import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "College Fest Ticketing Platform — Sell Fest Tickets at 0% Commission | URPASS",
  description:
    "The dedicated college fest ticketing platform in India. Sell pro-show passes, workshop tickets, and cultural event registrations with instant UPI and 0% platform cuts.",
  keywords: [
    "college fest ticketing platform",
    "sell college fest tickets",
    "pro show tickets college fest",
    "campus ticketing platform",
    "fest pass booking system",
    "zero commission college ticketing",
  ],
  alternates: { canonical: "https://urpass.space/college-fest-ticketing-platform" },
  openGraph: {
    title: "College Fest Ticketing Platform | Sell Fest Tickets at 0% Commission | URPASS",
    description:
      "Sell college fest tickets, pronite passes, and competition entries with 0% platform commission. Direct UPI payments, WhatsApp passes, and multi-gate scanning.",
    url: "https://urpass.space/college-fest-ticketing-platform",
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

export default function CollegeFestTicketingPlatformPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/college-fest-ticketing-platform",
        badge: "CAMPUS FEST TICKETING",
        h1: "College Fest Ticketing Platform",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Sell pro-show passes, concert wristband vouchers, and technical symposium tickets directly to students. Keep 100% of fest ticket revenue with zero platform commission deductions.",
        primaryCtaLabel: "Sell fest tickets",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Talk to Campus team",
        secondaryCtaHref: "/contact",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "college",
        description:
          "College fest ticketing platform: sell paid fest passes, collect UPI payments directly to college accounts, and manage campus door entry in <0.3s.",
        comparisonRows: [
          {
            criteria: "Platform Commission on Sales",
            urpass: "0% Commission (Fest retains 100% of ticket revenue)",
            competitor: "4% to 8% deducted from student council budgets",
            urpassAdvantage: true,
          },
          {
            criteria: "Pronite & Concert Gate Control",
            urpass: "Atomic row locks prevent shared screenshots across gates",
            competitor: "Fake forwarded passes enter unchecked",
            urpassAdvantage: true,
          },
          {
            criteria: "Payout Schedule",
            urpass: "Direct T+2 settlements to fund fest production in advance",
            competitor: "Withheld until weeks after the fest has concluded",
            urpassAdvantage: true,
          },
          {
            criteria: "Volunteer Gate Scanners",
            urpass: "Unlimited smartphone camera scanners with instant PIN links",
            competitor: "Expensive barcode device rentals",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Commercial Ticketing Portals",
        pageSpecificTakeaway:
          "College fests cannot afford to lose 5% to 8% of ticket sales to ticketing middlemen. URPASS gives student organizers a professional ticketing infrastructure with zero commission and instant bank deposits.",
      }}
    />
  );
}
