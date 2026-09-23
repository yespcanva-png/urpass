import type { Metadata } from "next";
import { Webhook, Zap, ShieldCheck, Terminal, ArrowRight, CheckCircle2, RefreshCw, Send, Lock } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Webhooks & Registration Automation | URPASS",
  description: "Automate event workflows with real-time webhooks. Receive instant JSON payloads for attendee registrations, payment captures, approvals, and entrance check-ins.",
  keywords: [
    "event webhooks",
    "event registration automation",
    "event webhook API",
    "real time event webhooks",
    "ticket payment webhooks",
    "check in webhook notification",
    "URPASS"
  ],
  alternates: { canonical: "https://urpass.space/event-webhooks" },
  openGraph: {
    title: "Event Webhooks & Registration Automation | URPASS",
    description: "Automate event workflows with real-time webhooks for registrations, payments, and check-ins.",
    url: "https://urpass.space/event-webhooks",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "REAL-TIME AUTOMATION",
        h1: "Automate Event Workflows with Webhooks",
        canonicalUrl: "https://urpass.space/event-webhooks",
        description:
          "Event webhooks dispatch real-time HTTP POST notifications to your servers whenever key event actions take place: new attendee registrations, captured ticket payments, application approvals, or entrance QR scan validations. URPASS signs each payload with cryptographic HMAC-SHA256 signatures, letting you automate Slack pings, Zapier workflows, CRM synchronization, and badge printing with zero polling delay.",
        ctaLabel: "Configure Webhooks",
        features: [
          { icon: Webhook, title: "Instant Event Triggers", desc: "Listen for granular events including attendee.created, payment.captured, attendee.approved, and checkin.recorded." },
          { icon: Lock, title: "HMAC-SHA256 Signatures", desc: "Every webhook request includes an X-Urpass-Signature header so your endpoints can verify authenticity securely." },
          { icon: Zap, title: "Sub-Second Payload Delivery", desc: "Dispatched immediately upon event execution with automatic exponential backoff retries on network failures." },
          { icon: Terminal, title: "Interactive Delivery Logs", desc: "Inspect request headers, JSON payloads, response codes, and retry histories directly in your developer console." },
          { icon: Send, title: "No-Code Integrations", desc: "Connect natively to Zapier, Make, Pipedream, Discord, or Slack to notify teams of new VIP ticket sales." },
          { icon: RefreshCw, title: "Automated Replay & Testing", desc: "Send test payloads with one click to verify that your webhook receiver endpoint responds with HTTP 200." },
        ],
        steps: [
          { n: "01", title: "Add Webhook Endpoint", desc: "Enter your HTTPS destination URL in the URPASS developer settings." },
          { n: "02", title: "Select Subscribed Events", desc: "Choose which actions trigger the webhook (e.g., ticket purchases, check-ins, or cancellations)." },
          { n: "03", title: "Verify Secret Signature", desc: "Copy your unique webhook signing secret to authenticate incoming POST requests." },
          { n: "04", title: "Send Test Payload", desc: "Click 'Test Endpoint' to simulate an attendee check-in and inspect the response." },
          { n: "05", title: "Automate Workflows", desc: "Trigger automated badge printing, Slack alerts, CRM updates, or catering logs on autopilot." },
        ],
        callout: {
          badge: "ZERO POLLING OVERHEAD",
          title: "Stop polling APIs in wasteful loops.",
          description: "Constantly querying a server every 5 seconds to detect new ticket sales wastes bandwidth and causes rate limits. URPASS event webhooks push clean JSON data straight to your infrastructure the exact millisecond an event occurs.",
          bullets: [
            "Automatic retry system with exponential backoff guarantees zero lost events",
            "Full JSON payload contains all attendee answers and ticket tier metadata",
            "Trigger on-demand thermal badge printing the second an attendee enters the gate",
            "Eliminate manual data synchronization across marketing, sales, and operations",
          ],
        },
        deepDiveSections: [
          {
            badge: "USE CASE: LIVE BADGE PRINTING",
            title: "How do organizers automate live badge printing with check-in webhooks?",
            paragraphs: [
              "High-profile conventions and trade shows often prefer printing physical name badges on-demand rather than pre-printing thousands of badges that go unclaimed.",
              "When an attendee scans their QR code at an entrance gate, URPASS dispatches a `checkin.recorded` webhook payload to a local server or cloud relay. The receiver extracts the attendee's name, company, and VIP tier, routing a print job to high-speed thermal badge printers located at the turnstile.",
            ],
            takeaway: "On-demand badge printing powered by webhooks saves thousands of dollars in wasted laminate and plastic badges.",
          },
          {
            badge: "SECURITY",
            title: "How do developers verify URPASS webhook authenticity?",
            paragraphs: [
              "To prevent replay attacks and spoofing, URPASS computes a keyed-hash message authentication code (HMAC-SHA256) of the raw payload using your private webhook secret. The signature is transmitted in the `X-Urpass-Signature` header.",
              "Your receiving server computes the same hash using your secret. If the signatures match, you can be 100% certain the notification originated from URPASS and was not intercepted or altered.",
            ],
            takeaway: "Cryptographic HMAC verification guarantees enterprise-grade payload security and authenticity.",
          },
        ],
        faqs: [
          {
            q: "What happens if our receiving server is temporarily offline when a webhook is sent?",
            a: "URPASS automatically retries failed deliveries using exponential backoff up to 5 times over several hours.",
          },
          {
            q: "Can I filter webhooks by specific events or ticket types?",
            a: "Yes. You can subscribe each webhook endpoint to specific event IDs and action types.",
          },
          {
            q: "Does URPASS support connecting to Zapier or Make.com?",
            a: "Yes. Simply paste your Zapier or Make 'Catch Webhook' URL into URPASS to automate hundreds of third-party apps.",
          },
        ],
        relatedLinks: [
          { title: "Event Registration API", href: "/event-registration-api", category: "Product" },
          { title: "Developer API Documentation", href: "/docs", category: "Guide" },
          { title: "Live Event Check-in Dashboard", href: "/event-check-in-dashboard", category: "Product" },
          { title: "Event Attendee CSV Export", href: "/event-attendee-data-export", category: "Product" },
        ],
      }}
    />
  );
}
