import type { Metadata } from "next";
import BOFUMoneyPage from "@/components/landing/BOFUMoneyPage";

export const metadata: Metadata = {
  title: "Event Ticketing API — REST & Webhook APIs for Passes & Door Check-In | URPASS",
  description:
    "Developer-first event ticketing API. Generate digital QR passes, automate ticket issuance, sync registrations via webhooks, and validate entry via REST endpoints.",
  keywords: [
    "event ticketing api",
    "event registration api",
    "qr ticket generation api",
    "event check-in api",
    "ticketing webhooks",
    "developer ticketing platform",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-api" },
  openGraph: {
    title: "Event Ticketing API | REST & Webhook APIs for Passes | URPASS",
    description:
      "Integrate event registration, pass generation, and gate validation directly into your website or mobile app using URPASS developer APIs.",
    url: "https://urpass.space/event-ticketing-api",
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

export default function EventTicketingApiPage() {
  return (
    <BOFUMoneyPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-api",
        badge: "DEVELOPER API & WEBHOOKS",
        h1: "Event Ticketing API",
        hook: "Sell tickets. Accept UPI. Send QR passes. Scan attendees. Keep your event revenue.",
        subDescription:
          "Integrate ticketing, QR pass generation, and entrance validation into your custom website, CRM, or mobile app using our modern REST API and real-time webhooks.",
        primaryCtaLabel: "View API / contact sales",
        primaryCtaHref: "/docs",
        secondaryCtaLabel: "Talk to Sales",
        secondaryCtaHref: "/contact",
        trustHighlights: ["REST & Webhooks", "API keys management", "Sub-100ms latency", "0% commission"],
        currency: "INR",
        cluster: "enterprise",
        description:
          "Event ticketing API: programmatically issue digital QR tickets, listen for check-in events via webhooks, and integrate door validation with your existing software stack.",
        comparisonRows: [
          {
            criteria: "API Access & Integration",
            urpass: "Modern REST endpoints with signed webhooks and full TypeScript types",
            competitor: "Legacy XML/SOAP APIs or restricted developer access",
            urpassAdvantage: true,
          },
          {
            criteria: "Cryptographic Pass Issuance",
            urpass: "Programmatic pass generation with custom visual parameters",
            competitor: "Generic static PDF links without custom field binding",
            urpassAdvantage: true,
          },
          {
            criteria: "Validation Endpoint Speed",
            urpass: "Sub-50ms validation API response with atomic duplicate blocking",
            competitor: "Slow 500ms+ round trips unsuitable for high-traffic gates",
            urpassAdvantage: true,
          },
          {
            criteria: "Platform Commission on API Orders",
            urpass: "0% commission on orders processed via API",
            competitor: "Standard 5% to 8% platform cut even on custom integrations",
            urpassAdvantage: true,
          },
        ],
        competitorName: "Legacy Ticketing APIs",
        pageSpecificTakeaway:
          "Building custom registration flows shouldn't mean sacrificing door check-in reliability. URPASS provides robust developer primitives to generate tickets and validate gates effortlessly.",
      }}
    />
  );
}
