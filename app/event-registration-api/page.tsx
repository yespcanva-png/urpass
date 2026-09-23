import type { Metadata } from "next";
import { Code, Terminal, Webhook, KeyRound, Database, ShieldCheck, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration API & Integrations | URPASS",
  description: "Integrate event registrations, ticket inventory, digital QR passes, and check-in verification directly into your custom apps using the URPASS REST API.",
  keywords: [
    "event registration API",
    "event ticketing API",
    "QR code ticket API",
    "event check in API",
    "developer API for events",
    "event management REST API",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-registration-api" },
  openGraph: {
    title: "Event Registration API & Integrations | URPASS",
    description: "Integrate event registrations, ticket inventory, and digital QR passes using the URPASS REST API.",
    url: "https://urpass.space/event-registration-api",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "DEVELOPER PLATFORM",
        h1: "Connect Event Registration to Your Own Systems",
        canonicalUrl: "https://urpass.space/event-registration-api",
        description:
          "An event registration API allows developers to embed ticket purchasing, dynamic pass rendering, real-time inventory queries, and entrance check-in verification directly into proprietary mobile apps, corporate portals, and custom web applications. URPASS offers an intuitive RESTful API with scoped API tokens, detailed docs, and sub-100ms response times.",
        ctaLabel: "Read API Documentation",
        features: [
          { icon: Code, title: "RESTful JSON Architecture", desc: "Clean endpoints for managing events, ticket tiers, attendee applications, and gate scanner verification." },
          { icon: KeyRound, title: "Scoped API Key Management", desc: "Generate read-only, write-only, or event-specific API keys with automatic revocation and rate-limit quotas." },
          { icon: Zap, title: "Programmatic Pass Generation", desc: "Generate signed cryptographic digital passes on-the-fly from your backend servers and send via your own email service." },
          { icon: Webhook, title: "Event-Driven Webhooks", desc: "Receive immediate JSON payloads on key events like attendee.registered, payment.captured, and checkin.verified." },
          { icon: Database, title: "Bi-Directional CRM Sync", desc: "Keep Salesforce, HubSpot, or internal HR databases continuously synchronized with live registration rosters." },
          { icon: Terminal, title: "Interactive Developer Sandbox", desc: "Test API calls, inspect response payloads, and simulate entrance scan validations in your developer dashboard." },
        ],
        steps: [
          { n: "01", title: "Generate API Keys", desc: "Create an API key in your organizer settings with custom read/write permissions." },
          { n: "02", title: "Query Event Data", desc: "Call /api/v1/events to retrieve event details, ticket categories, and remaining inventory." },
          { n: "03", title: "Post New Registrations", desc: "Submit attendee form answers and generate signed pass URLs directly from your custom frontend." },
          { n: "04", title: "Listen to Webhooks", desc: "Configure your server endpoint to receive real-time check-in and payment event notifications." },
          { n: "05", title: "Verify Passes Programmatically", desc: "Use the /api/verify endpoint to authenticate QR code tokens in your custom hardware or turnstiles." },
        ],
        callout: {
          badge: "BUILT FOR DEVELOPERS",
          title: "Full programmatic control over the entire event lifecycle.",
          description: "Forget iframe embeds and rigid third-party ticket widgets that break your website's CSS. With the URPASS REST API, your engineering team can build fully custom attendee experiences while leveraging our battle-tested QR engine and high-concurrency ticket database.",
          bullets: [
            "Sub-100ms API response latency powered by distributed cloud edge compute",
            "OpenAPI / Swagger specifications and ready-to-run cURL & JavaScript code snippets",
            "Integrate directly with physical turnstiles, badge printers, or custom mobile apps",
            "Included on Business and Enterprise plans with high-throughput rate limits",
          ],
        },
        deepDiveSections: [
          {
            badge: "TURNSTILE INTEGRATION",
            title: "Can the URPASS API connect to physical turnstiles and badge printers?",
            paragraphs: [
              "Yes. High-security conferences and venues often utilize automated optical turnstiles or on-demand thermal badge printers at entrance gates. Physical turnstiles can send the scanned QR token to URPASS via the `/api/verify` endpoint.",
              "If the pass is valid and has not been previously checked in, URPASS returns an HTTP 200 payload that unlocks the turnstile gate relay and sends an automated print command to local badge printers in under 150 milliseconds.",
            ],
            takeaway: "Low-latency REST endpoints allow physical hardware integration with zero gate queue delay.",
          },
          {
            badge: "CUSTOM FRONTENDS",
            title: "How do teams build custom white-label registration apps using the API?",
            paragraphs: [
              "Companies hosting annual customer summits often want registration embedded seamlessly into their main product dashboard or mobile app. Rather than redirecting users to an external URL, their backend calls URPASS API endpoints to register the user, allocate the ticket, and embed the dynamic digital pass right inside the customer app.",
            ],
            takeaway: "Headless event infrastructure allows complete brand immersion inside your native digital products.",
          },
        ],
        faqs: [
          {
            q: "Where can I read the full developer documentation and API reference?",
            a: "Full API documentation, code examples, and schemas are available at urpass.space/docs and in your developer settings.",
          },
          {
            q: "What authentication format does the URPASS API use?",
            a: "The API uses Bearer token authentication via an 'x-api-key' or 'Authorization: Bearer <TOKEN>' HTTP header.",
          },
          {
            q: "Can I simulate ticket check-ins and webhook events in a test environment?",
            a: "Yes. URPASS provides sandbox test keys and webhook simulation triggers so you can verify integrations before going live.",
          },
        ],
        relatedLinks: [
          { title: "Event Webhooks & Automation", href: "/event-webhooks", category: "Product" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
          { title: "Enterprise Event Management", href: "/enterprise-event-management", category: "Product" },
          { title: "White Label Event Platform", href: "/white-label-event-platform", category: "Product" },
        ],
      }}
    />
  );
}
