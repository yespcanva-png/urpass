import type { Metadata } from "next";
import {
  CreditCard,
  Building2,
  Lock,
  Receipt,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Server,
  Key,
  Users,
  BarChart3,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticket Payment Gateway — Razorpay Direct Settlements & 0% Fee",
  description:
    "Connect your Razorpay payment gateway for event ticket sales. Direct T+2 bank deposits, automated GST tax invoices, instant UPI checkout, and 0% platform commission.",
  keywords: [
    "event ticket payment gateway",
    "razorpay event ticketing",
    "payment gateway for events india",
    "event ticket payment processing",
    "direct payout event ticketing",
    "gst compliant event ticketing gateway",
    "zero commission event payment gateway",
  ],
  alternates: { canonical: "https://urpass.space/event-ticket-payment-gateway" },
  openGraph: {
    title: "Event Ticket Payment Gateway | Razorpay Direct Settlement | URPASS",
    description:
      "Link your Razorpay payment gateway to sell event tickets. 100% direct bank payouts, automated GST invoices, and zero ticket commission.",
    url: "https://urpass.space/event-ticket-payment-gateway",
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

export default function EventTicketPaymentGatewayPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticket-payment-gateway",
        badge: "GATEWAY INTEGRATION & SETTLEMENTS",
        h1: "Event Ticket Payment Gateway with Direct Bank Settlements",
        description:
          "Connect your verified Razorpay payment gateway in 2 minutes. Receive direct T+2 bank deposits, automate 18% GST tax invoicing, and pay 0% platform commission on ticket volume.",
        ctaLabel: "Connect payment gateway",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is an Event Ticket Payment Gateway?",
          summary:
            "An event ticket payment gateway is a secure financial processing service that authorizes and clears ticket transactions between attendees and event organizers. Unlike legacy ticketing platforms that hold attendee funds in escrow until weeks after an event concludes, URPASS integrates directly with your merchant Razorpay account. Ticket proceeds deposit directly into your Indian bank account on standard T+2 rolling business day cycles with 0% platform deductions.",
          keyPoints: [
            "Direct merchant bank settlements on rolling T+2 business day schedules",
            "0% platform commission on ticket volume — keep 100% of ticket sales",
            "Full payment method coverage: UPI, debit/credit cards, and net banking",
            "Automated GST invoice generation with corporate GSTIN validation and SAC codes",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Payment Gateway Comparison: Direct Payouts vs. Escrow Holds",
          subtitle: "Why direct payment gateway integration protects event cash flow compared to third-party aggregators.",
          headers: ["Financial Feature", "URPASS Direct Gateway (Razorpay)", "Traditional Aggregators (Eventbrite / Townscript)"],
          rows: [
            {
              col1: "Payout Settlement Schedule",
              col2: "Direct T+2 business days into your linked bank account",
              col3: "Withheld in escrow until 7 to 14 days after event concludes",
            },
            {
              col1: "Platform Commission on Sales",
              col2: "0% Commission (Fixed monthly software subscription)",
              col3: "4.0% to 7.9% deducted per ticket sold",
            },
            {
              col1: "Payment Methods Supported",
              col2: "Instant UPI (GPay, PhonePe), Visa, Mastercard, RuPay, Net Banking",
              col3: "Limited international cards; clunky UPI redirects",
            },
            {
              col1: "Automated GST Tax Invoicing",
              col2: "Automated B2B invoices with corporate GSTIN and SAC code 998596",
              col3: "Manual invoice generation or missing Indian GST credentials",
            },
            {
              col1: "Merchant Account KYC",
              col2: "KYC completed directly with Razorpay; full financial compliance",
              col3: "Platform acts as merchant of record; dispute opacity",
            },
            {
              col1: "Webhook Verification Security",
              col2: "HMAC SHA-256 signature verification preventing payment spoofing",
              col3: "Client-side redirects susceptible to manipulated cart states",
            },
            {
              col1: "Attendee Data Privacy",
              col2: "100% private attendee database; zero marketing retargeting",
              col3: "Attendee emails used to promote competing events",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Banknote,
            title: "Direct T+2 Rolling Settlements",
            desc: "Ticket proceeds settle straight into your Indian bank account on standard T+2 cycles, maintaining positive operating cash flow.",
          },
          {
            icon: CreditCard,
            title: "0% Commission Software Model",
            desc: "Keep 100% of your ticket revenue. Pay only standard payment gateway interchange fees without any extra per-ticket platform cuts.",
          },
          {
            icon: Receipt,
            title: "Automated GST Tax Compliance",
            desc: "Capture corporate attendee GSTIN numbers at checkout and automatically generate compliant tax invoices with proper HSN/SAC codes.",
          },
          {
            icon: ShieldCheck,
            title: "HMAC Webhook Verification",
            desc: "Server-to-server webhook verification ensures that digital QR passes are issued only after cryptographic confirmation from the bank.",
          },
          {
            icon: Building2,
            title: "Pan-India Payment Methods",
            desc: "Accept UPI (PhonePe, Google Pay, Paytm), RuPay cards, corporate credit cards, and net banking across 50+ major Indian banks.",
          },
          {
            icon: BarChart3,
            title: "Unified Financial Reporting",
            desc: "Reconcile ticket sales, refund logs, dispute statuses, and attendance check-ins from a single real-time dashboard.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Bank-Grade Financial Infrastructure",
          description:
            "From college fests processing thousands of UPI micro-payments to enterprise conferences selling VIP passes, URPASS ensures zero transaction drops.",
          type: "passes",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Optimized for Indian Banking & Gateway Regulations",
          subtitle: "Full RBI compliance, direct merchant KYC, and support for all domestic payment rails.",
          items: [
            {
              title: "T+2 Direct Bank Payouts",
              description:
                "Funds deposit directly into your Indian bank account on standard T+2 cycles, keeping event cash flow healthy.",
              badge: "Cashflow",
            },
            {
              title: "Instant UPI 2.0 Integration",
              description:
                "Mobile attendees can pay directly inside their preferred UPI apps without manually typing card numbers or CVVs.",
              badge: "UPI 2.0",
            },
            {
              title: "Compliant GST Invoices",
              description:
                "Provide B2B conference attendees with downloadable PDF invoices featuring your GSTIN, client GSTIN, and reverse charge status.",
              badge: "Tax Ready",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "Distribute mobile digital QR passes directly via WhatsApp in India, ensuring attendees never lose their tickets.",
              badge: "WhatsApp",
            },
            {
              title: "Corporate Credit & Net Banking",
              description:
                "Support enterprise purchasing departments using corporate Visa/Mastercard and net banking across 50+ banks.",
              badge: "B2B Ready",
            },
            {
              title: "Transparent INR Software",
              description:
                "Flat software pricing starting at ₹0 for free community events and ₹499/mo for paid events with zero ticket commission.",
              badge: "INR Pricing",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "CASH FLOW PROTECTION",
            title: "Why Holding Ticket Revenue in Escrow Damages Event Execution",
            paragraphs: [
              "Traditional ticketing portals operate an escrow business model: when attendees buy tickets 60 days before your conference, the portal holds all the money in their own corporate bank accounts until 7 to 14 days after your event has successfully concluded.",
              "This escrow model creates severe cash flow emergencies for event organizers who must pay upfront venue booking deposits, sound and light rentals, catering advances, and international speaker travel costs weeks before the event doors open. Organizers are often forced to take high-interest short-term loans simply to bridge the gap.",
              "With URPASS, you connect your own Razorpay payment gateway. You are the merchant of record. Ticket sales deposit directly into your bank account on a rolling T+2 business day schedule as tickets are sold. Your operating cash flow remains strong, transparent, and completely under your control.",
            ],
            bullets: [
              "Direct T+2 payouts provide liquidity to pay vendors and venue deposits in advance",
              "Zero platform withholding or arbitrary payout escrow freezes",
              "Organizers maintain direct merchant relationship with their banking partners",
              "Real-time transaction reconciliation between ticket sales and bank accounts",
            ],
            takeaway:
              "Direct gateway integration eliminates artificial escrow holds, giving organizers the healthy cash flow needed to produce flawless events.",
          },
          {
            badge: "WEBHOOK SECURITY",
            title: "Securing Ticket Pass Issuance with HMAC Webhooks",
            paragraphs: [
              "In naive e-commerce integrations, ticket issuance relies on the attendee's browser completing a redirect back to a 'success' page. If the attendee closes their browser tab during the redirect, or if a malicious user alters the URL query parameters, the system can either fail to issue a legitimate pass or issue free tickets to unauthorized users.",
              "URPASS utilizes server-to-server webhook architecture secured with HMAC SHA-256 signatures. When a payment succeeds, the payment gateway transmits an encrypted event payload directly to our cloud infrastructure. The server verifies the cryptographic signature against the organizer's secret key before creating the attendee record and generating the digital QR pass.",
            ],
            bullets: [
              "HMAC SHA-256 signatures guarantee webhook authenticity and prevent tampering",
              "Passes are issued reliably even if the attendee closes their mobile browser",
              "Atomic database updates prevent double-crediting of payments",
              "Automated email and WhatsApp pass delivery triggered immediately upon confirmation",
            ],
            takeaway:
              "Bank-grade webhook architecture guarantees 100% reliable pass delivery while completely protecting ticketing revenue from client-side tampering.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS Direct Gateway vs. Legacy Aggregator Models",
          subtitle: "Compare payout timing, ticket commissions, GST compliance, and data ownership.",
          competitorName: "Legacy Ticketing Aggregators",
          sourceCitations: [
            "Official competitor commercial schedules in India",
            "URPASS benchmark metrics & Razorpay gateway documentation",
          ],
          rows: [
            {
              criteria: "Payout Settlement Schedule",
              urpass: "Direct T+2 business days into your linked bank account",
              competitor: "Withheld until 7 to 14 days post-event",
              urpassAdvantage: true,
            },
            {
              criteria: "Platform Commission on Sales",
              urpass: "0% Commission (Fixed monthly software fee)",
              competitor: "4.0% to 7.9% deducted per ticket sold",
              urpassAdvantage: true,
            },
            {
              criteria: "Merchant Account Ownership",
              urpass: "Direct KYC with Razorpay; full banking transparency",
              competitor: "Aggregator acts as intermediary merchant",
              urpassAdvantage: true,
            },
            {
              criteria: "Automated GST Tax Invoicing",
              urpass: "Automated GSTIN capture and compliant B2B tax PDFs",
              competitor: "Manual invoice creation or non-compliant receipts",
              urpassAdvantage: true,
            },
            {
              criteria: "UPI Payment Experience",
              urpass: "Native UPI Intent (PhonePe/GPay) + Dynamic Desktop QR",
              competitor: "Clunky VPA copy-paste or third-party redirect",
              urpassAdvantage: true,
            },
            {
              criteria: "Door QR Check-In Speed",
              urpass: "< 0.3s camera scan on any volunteer phone",
              competitor: "3.5 to 5.0 seconds per ticket",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "Professional Tech & Developer Conferences",
          "College Technical Symposiums & Cultural Fests",
          "Hands-On Masterclasses & Bootcamps",
          "Inter-College Hackathons & Competitions",
          "Music Concerts & Cultural Festivals",
          "Founder Meetups & Investor Summits",
          "Corporate Product Launches & Annual Meets",
          "Industry Trade Expos & Business Summits",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
          {
            title: "Event Ticketing Software India",
            href: "/event-ticketing-software-india",
            category: "Product",
          },
          {
            title: "QR Ticketing System & Check-In",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "Event Registration Software India",
            href: "/in",
            category: "Location",
          },
          {
            title: "College Event Ticketing Platform",
            href: "/event-ticketing-platform-for-college-events",
            category: "Use Case",
          },
          {
            title: "Conference Event Ticketing Platform",
            href: "/event-ticketing-platform-for-conferences",
            category: "Use Case",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
          {
            title: "Guide: Prevent Duplicate Event Entry",
            href: "/guides/prevent-duplicate-event-entry",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "How do I connect my Razorpay payment gateway to URPASS?",
            a: "In your URPASS dashboard, go to Settings > Payment Gateway and enter your Razorpay Key ID and Key Secret. Once saved, all ticket sales for your paid events will be processed directly through your Razorpay merchant account.",
          },
          {
            q: "Does URPASS charge any per-ticket fees on paid transactions?",
            a: "No! URPASS charges 0% commission on ticket sales. You pay our flat monthly software subscription (starting at ₹499/mo) and standard payment gateway fees from Razorpay (~2% for UPI and cards).",
          },
          {
            q: "When are ticket proceeds deposited into my bank account?",
            a: "Because you are using your own Razorpay account, funds settle directly into your Indian bank account according to Razorpay's standard rolling T+2 business day schedule. URPASS never holds or delays your money.",
          },
          {
            q: "Can I generate automated GST tax invoices for corporate delegates?",
            a: "Yes. You can enable GSTIN capture in your checkout settings. When a business attendee enters their GSTIN, URPASS automatically generates a compliant B2B tax invoice featuring your business details and proper SAC code (998596).",
          },
          {
            q: "What payment methods can attendees use at checkout?",
            a: "Through your Razorpay gateway, attendees can pay using instant UPI (PhonePe, Google Pay, Paytm, BHIM), debit and credit cards (Visa, Mastercard, RuPay), and net banking across 50+ major Indian banks.",
          },
          {
            q: "Can I test the payment gateway before launching ticket sales?",
            a: "Yes. Razorpay provides test mode keys. You can connect your test keys to URPASS to simulate test purchases and verify pass issuance workflows before switching to live mode.",
          },
        ],

        ctaTitle: "Connect your payment gateway in minutes",
        ctaDescription:
          "Razorpay direct settlement · 0% ticket commission · Automated GST invoices · Sub-second phone scanning",
      }}
    />
  );
}
