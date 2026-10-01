import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Expo Ticketing Software — High-Volume Visitor Passes & Door Check-In | URPASS",
  description:
    "Expo ticketing software for consumer, tech, and industrial expos. Sell tickets with 0% platform commission, issue WhatsApp passes, and scan thousands of attendees without lag.",
  keywords: [
    "expo ticketing software",
    "expo ticketing platform",
    "consumer expo ticket booking",
    "expo entrance pass management",
    "expo qr code tickets",
    "large scale expo ticketing",
  ],
  alternates: { canonical: "https://urpass.space/expo-ticketing-software" },
  openGraph: {
    title: "Expo Ticketing Software | High-Volume Passes & Door Check-In | URPASS",
    description:
      "Sell expo tickets with 0% platform fees. Instant UPI checkout, automated WhatsApp pass delivery, and high-speed multi-gate entry scanning.",
    url: "https://urpass.space/expo-ticketing-software",
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

export default function ExpoTicketingSoftwarePage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/expo-ticketing-software",
        badge: "HIGH-CAPACITY EXPO TICKETING",
        h1: "Expo Ticketing Software",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Handle 20,000+ visitor ticket sales without platform cuts. Issue digital QR passes instantly to WhatsApp and scan entries simultaneously across 10+ entrance lanes.",
        primaryCtaLabel: "Start expo",
        primaryCtaHref: "/signup",
        secondaryCtaLabel: "Plan Your Event Entry",
        secondaryCtaHref: "/event-check-in-calculator",
        trustHighlights: ["₹0 to start", "Razorpay / UPI", "QR check-in", "WhatsApp passes"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Expo ticketing software: sell expo passes with 0% platform commission, direct Razorpay settlements, automated WhatsApp tickets, and high-throughput door scanning.",
        comparisonRows: [
          {
            criteria: "Platform Commission on Sales",
            urpass: "0% Commission (Fixed flat subscription pricing)",
            competitor: "4.5% to 8% deducted from gross expo ticket revenue",
            urpassAdvantage: true,
          },
          {
            criteria: "Peak Surge Concurrency",
            urpass: "Optimized distributed serverless stack handles heavy surges",
            competitor: "Platform timeouts during popular expo on-sale rushes",
            urpassAdvantage: true,
          },
          {
            criteria: "Gate Queue Processing",
            urpass: "Sub-0.3s validation processes up to 30 visitors/min per phone",
            competitor: "3–5 second scan delays producing massive foyer jams",
            urpassAdvantage: true,
          },
          {
            criteria: "Direct Merchant Settlement",
            urpass: "Ticket funds settle directly to your bank on standard T+2 cycles",
            competitor: "Ticket proceeds withheld until after the expo wraps up",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Traditional Expo Ticketing Portals",
        pageSpecificTakeaway:
          "Expos generate large ticket volumes where percentage platform fees can cost organizers tens of lakhs. URPASS eliminates commission while delivering faster entrance scanning than proprietary hardware.",
      }}
    />
  );
}
