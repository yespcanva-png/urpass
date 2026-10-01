import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "White Label Event Ticketing Platform — Custom Domains & Full Brand Control | URPASS",
  description:
    "White-label event ticketing platform for brands, media agencies, and event organizers. Use your own custom domain, brand colors, direct gateway, and zero third-party ads.",
  keywords: [
    "white label event ticketing",
    "white label ticketing platform",
    "custom domain event ticketing",
    "branded event registration software",
    "agency event ticketing platform",
    "own brand ticketing system",
  ],
  alternates: { canonical: "https://urpass.space/white-label-event-ticketing" },
  openGraph: {
    title: "White Label Event Ticketing Platform | Custom Domains | URPASS",
    description:
      "Host event ticketing entirely under your own brand and custom domain. Direct payment gateway, 0% platform cuts, and fully customizable passes.",
    url: "https://urpass.space/white-label-event-ticketing",
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

export default function WhiteLabelEventTicketingPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/white-label-event-ticketing",
        badge: "WHITE-LABEL TICKETING",
        h1: "White Label Event Ticketing Platform",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Own the entire attendee experience from registration to door entry. Host ticket sales under your custom domain with your brand colors, direct gateway connection, and zero platform advertising.",
        primaryCtaLabel: "Contact sales",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        trustHighlights: ["Custom domain", "Direct merchant payouts", "Branded QR passes", "Zero 3rd-party ads"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "White-label event ticketing platform: run event registration and ticket sales under your own brand, connect your own payment gateway, and pay zero platform commission.",
        comparisonRows: [
          {
            criteria: "Custom Domain & Subdomains",
            urpass: "Full custom domain support (e.g., tickets.yourbrand.com)",
            competitor: "Locked to platform URL (e.g., competitor.com/your-event)",
            urpassAdvantage: true,
          },
          {
            criteria: "Attendee Data & Re-marketing",
            urpass: "100% private organizer data; zero cross-marketing to attendees",
            competitor: "Platform markets competitor events to your attendee list",
            urpassAdvantage: true,
          },
          {
            criteria: "Branded Digital Pass Visuals",
            urpass: "Complete pass design control with dynamic custom tokens",
            competitor: "Rigid ticket PDF with large third-party platform logos",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission",
            urpass: "0% commission on ticket sales (Fixed monthly subscription)",
            competitor: "5% to 8% platform fee on every transaction",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Public Event Portals",
        pageSpecificTakeaway:
          "Agencies and enterprise brands cannot send high-value clients to public aggregator sites covered in competitor banners. URPASS delivers a true white-label infrastructure where your brand remains front and center.",
      }}
    />
  );
}
