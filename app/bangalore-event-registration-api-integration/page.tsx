import type { Metadata } from "next";
import { Code2, CreditCard, Lock, RefreshCw, ScanLine, Webhook } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration API Bangalore | UrPass",
  description: "Explore UrPass event registration APIs and webhooks for integrating attendee workflows with business applications in Bangalore.",
  keywords: ["event registration api bangalore","event webhooks bengaluru","ticketing api integration bangalore","attendee sync api bengaluru","event automation api"],
  alternates: {
    canonical: "https://urpass.space/bangalore-event-registration-api-integration",
  },
  openGraph: {
    title: "Event Registration API Bangalore | UrPass",
    description: "Explore UrPass event registration APIs and webhooks for integrating attendee workflows with business applications in Bangalore.",
    url: "https://urpass.space/bangalore-event-registration-api-integration",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Registration API Bangalore | UrPass",
    description: "Explore UrPass event registration APIs and webhooks for integrating attendee workflows with business applications in Bangalore.",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

export default function BangaloreEventRegistrationApiIntegrationPage() {
  return (
    <SEOPage
      config={{
        badge: "DEVELOPER APIS & WEBHOOKS",
        h1: "Event Registration API and Webhook Integration in Bangalore",
        canonicalUrl: "https://urpass.space/bangalore-event-registration-api-integration",
        description: "Explore UrPass event registration APIs and webhooks for integrating attendee workflows with business applications in Bangalore.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=bangalore-event-registration-api-integration",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Automate Event Workflows with APIs",
        ctaDescription: "Connect UrPass registration events and gate check-in telemetry with your internal CRM, Slack, WhatsApp, and database systems via REST APIs and webhooks.",
        directAnswer: {
        "title": "What is Event Registration API & Webhook Integration in Bangalore?",
        "summary": "Event registration API and webhook integration in Bangalore allows engineering teams, SaaS companies, and enterprise IT departments to programmatically create events, sync attendee registrations, trigger custom WhatsApp flows, and receive real-time gate check-in payloads. UrPass offers RESTful endpoints and webhook triggers with 0% ticket fees.",
        "keyPoints": [
                "RESTful API endpoints for creating events, fetching attendee rosters, and issuing QR passes",
                "Real-time webhook triggers for registration created, payment captured, and guest checked in",
                "Seamless integration with internal ERP, CRM (HubSpot/Salesforce), Slack, and WhatsApp bots",
                "Developer-friendly JSON payloads with comprehensive documentation and code snippets"
        ]
},
        whatIs: {
        "title": "Why Bangalore Tech Teams Integrate with UrPass APIs",
        "definition": "As India's tech capital, Bangalore software firms and startups build custom internal tooling. Relying on closed, proprietary ticketing portals prevents automated lead scoring and CRM synchronization.",
        "details": [
                "Trigger custom Slack or Discord alerts when VIP delegates or keynote speakers check in",
                "Sync attendee details directly to your HubSpot or Salesforce pipeline in real time",
                "Embed dynamic QR pass generation into your own mobile applications and internal portals",
                "Secure token-based authentication with encrypted webhook payload signatures"
        ]
},
        keyFactsTable: {
        "title": "UrPass Developer APIs vs Closed Ticketing Platforms",
        "subtitle": "Why Bangalore engineering teams build on the UrPass platform.",
        "headers": [
                "Integration Capability",
                "Legacy Closed Ticketing Platforms",
                "UrPass API & Webhook Architecture"
        ],
        "rows": [
                {
                        "col1": "API Access",
                        "col2": "Locked behind expensive enterprise tiers ($5,000+)",
                        "col3": "Accessible on developer-friendly plans with transparent pricing"
                },
                {
                        "col1": "Webhook Latency",
                        "col2": "Delayed batch polling or zero webhook support",
                        "col3": "Sub-second real-time webhook event dispatch"
                },
                {
                        "col1": "Payload Schema",
                        "col2": "Complex XML or rigid proprietary formats",
                        "col3": "Clean, standardized JSON payloads with full attendee fields"
                },
                {
                        "col1": "Custom Integrations",
                        "col2": "Restricted to pre-built marketplace connectors",
                        "col3": "Full RESTful flexibility: connect with any custom backend"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "WEBHOOK EVENTS",
                "title": "Real-Time Webhooks for Registration and Gate Check-In",
                "paragraphs": [
                        "Building automated attendee workflows requires knowing immediately when an attendee registers, pays, or arrives at your venue.",
                        "UrPass dispatches secure webhook events to your configured HTTPS endpoints within milliseconds. Automate badge printing on arrival, trigger automated WhatsApp concierge messages, or update your internal company CRM instantly."
                ],
                "bullets": [
                        "Supported triggers: `registration.created`, `payment.captured`, `attendee.checked_in`",
                        "HMAC-SHA256 signature verification ensures webhook payloads are authentic and untampered",
                        "Automatic retry logic with exponential backoff prevents missed events during downtime",
                        "Detailed webhook delivery logs and payload inspection in your organizer dashboard"
                ],
                "takeaway": "Real-time webhooks automate business workflows the moment an attendee checks in."
        },
        {
                "badge": "RESTFUL ENDPOINTS",
                "title": "Programmatic Attendee Management and Dynamic Pass Generation",
                "paragraphs": [
                        "Enterprises and hackathon platforms often have their own custom registration portals and only need UrPass for generating encrypted QR credentials and managing gate camera scanning.",
                        "UrPass provides programmatic REST API endpoints. Your backend can generate an attendee record, receive their unique digital pass URL and Apple Wallet download link, and dispatch it through your own branded communication channels."
                ],
                "bullets": [
                        "POST `/api/v1/events/:id/attendees`: programmatically register delegates via backend scripts",
                        "GET `/api/v1/events/:id/attendance`: retrieve real-time check-in counts and roster statuses",
                        "Generate signed digital pass URLs directly from your own mobile or web application",
                        "Comprehensive API documentation with cURL, Node.js, and Python code examples"
                ],
                "takeaway": "RESTful APIs enable seamless headless ticketing inside your own applications."
        }
],
        featuresTitle: "Core Event Capabilities",
        featuresSubtitle: "Purpose-built for Bengaluru event organizers seeking speed, privacy, and zero ticket fees.",
        features: [
          {
            icon: Code2,
            title: "RESTful JSON APIs",
            desc: "Programmatically create events, manage ticket tiers, and issue encrypted digital QR passes.",
          },
          {
            icon: Webhook,
            title: "Real-Time Webhooks",
            desc: "Receive instant HTTP POST callbacks for registrations, payments, and gate check-ins.",
          },
          {
            icon: Lock,
            title: "HMAC Security Signatures",
            desc: "Verify payload authenticity with cryptographic HMAC-SHA256 signature headers.",
          },
          {
            icon: RefreshCw,
            title: "Automated Retry Logic",
            desc: "Webhook deliveries retry automatically with exponential backoff if endpoints fail.",
          },
          {
            icon: CreditCard,
            title: "0% Commission via Razorpay",
            desc: "Integrate ticketing payments with your Razorpay merchant account with zero platform fees.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Door Validation",
            desc: "Scan and check in attendees using smartphone cameras with zero hardware rentals.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Generate API Key",
                "desc": "Create an API token and secret key from your UrPass developer settings."
        },
        {
                "n": "02",
                "title": "Configure Webhooks",
                "desc": "Add your endpoint URL and subscribe to `attendee.checked_in` or `registration.created`."
        },
        {
                "n": "03",
                "title": "Test Integration",
                "desc": "Trigger test webhook payloads and inspect JSON responses directly in the dashboard."
        },
        {
                "n": "04",
                "title": "Deploy to Production",
                "desc": "Automate your CRM sync, badge printing, or Slack alerts as guests register and check in."
        },
        {
                "n": "05",
                "title": "Monitor Delivery Logs",
                "desc": "Track API latency and inspect HTTP response codes on your developer dashboard."
        }
],
        whoShouldUse: {
        "title": "Who Uses UrPass APIs & Webhooks in Bangalore?",
        "subtitle": "Software engineers and product teams across Bangalore's tech ecosystem.",
        "personas": [
                {
                        "badge": "SAAS FIRMS",
                        "title": "B2B Software Companies",
                        "desc": "Sync conference attendee leads directly into Salesforce and HubSpot in real time."
                },
                {
                        "badge": "DEVELOPER APPS",
                        "title": "Hackathon Platforms",
                        "desc": "Programmatically generate QR credentials for accepted hacker teams via backend scripts."
                },
                {
                        "badge": "ENTERPRISE IT",
                        "title": "Corporate Workplace Teams",
                        "desc": "Connect event check-in logs with internal enterprise badge and HR databases."
                },
                {
                        "badge": "MARKETING TECH",
                        "title": "Growth & Automation Leads",
                        "desc": "Trigger personalized post-check-in WhatsApp and email sequences using webhooks."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Check-In Triggers Webhooks in Milliseconds",
        "subtitle": "Event-driven architecture that powers external business automations.",
        "description": "When a gate volunteer scans an attendee's digital pass, UrPass validates credentials in under 300 milliseconds. The check-in event immediately fires a secure HTTPS webhook payload to your registered webhook URL, containing the attendee's name, ID, tier, and exact timestamp.",
        "points": [
                "Sub-second webhook execution allows real-time badge printing or Slack alerts.",
                "Payload includes complete attendee details and custom questionnaire responses.",
                "Cryptographic HMAC signature ensures security against unauthorized requests.",
                "Automatic retries ensure events are never lost due to temporary server hiccups."
        ]
},
        faqs: [
        {
                "q": "What events can trigger UrPass webhooks?",
                "a": "UrPass supports webhooks for `registration.created`, `registration.approved`, `payment.captured`, `attendee.checked_in`, and `registration.cancelled`."
        },
        {
                "q": "How do I authenticate API requests with UrPass?",
                "a": "API requests are authenticated using Bearer tokens generated from your UrPass developer dashboard, passed via standard `Authorization: Bearer <token>` headers."
        },
        {
                "q": "Can I use UrPass purely as a backend QR ticket generation and scanning engine?",
                "a": "Yes. You can collect registrations on your own custom website, send delegate details to UrPass via API, and use UrPass web scanners to validate attendees at the venue."
        },
        {
                "q": "How are webhook payloads secured?",
                "a": "Every webhook request includes an `X-UrPass-Signature` header containing an HMAC-SHA256 signature calculated using your secret webhook signing key."
        },
        {
                "q": "What pricing applies to API and webhook access?",
                "a": "Developer API access is included with UrPass plans starting at an introductory ₹29/month for your first 2 months (then ₹999/month), with 0% platform ticket fees."
        }
],
      }}
    />
  );
}
