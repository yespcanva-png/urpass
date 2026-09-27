import type { Metadata } from "next";
import {
  Smartphone,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  CreditCard,
  Building2,
  Lock,
  Layers,
  BarChart3,
  Percent,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration with UPI — 0% Commission UPI Payments | URPASS",
  description:
    "Accept event registration payments via Google Pay, PhonePe, Paytm, and BHIM with 0% ticketing commission. Direct bank settlement, custom registration forms, and instant QR passes.",
  keywords: [
    "event registration with upi",
    "upi event registration",
    "accept upi payments for events",
    "event registration form with upi",
    "zero commission upi ticketing",
    "google pay event registration",
    "phonepe event tickets",
    "college fest upi registration",
    "URPASS upi registration",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-with-upi" },
  openGraph: {
    title: "Event Registration with UPI Payments | URPASS",
    description:
      "Collect event registrations with instant UPI payments. Zero platform commission, direct Indian bank settlement, and automated digital QR passes.",
    url: "https://urpass.space/event-registration-with-upi",
    locale: "en_IN",
    type: "website",
  },
};

export default function EventRegistrationWithUpiPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-registration-with-upi",
        badge: "0% COMMISSION UPI PAYMENTS",
        h1: "Event Registration Software with Native UPI Payments",
        description:
          "Collect attendee details and accept instant UPI payments via Google Pay, PhonePe, Paytm, and BHIM. Funds settle directly to your Indian bank account with 0% ticketing commission.",
        ctaLabel: "Start Accepting UPI Registrations",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "How Does Event Registration with UPI Work?",
          summary:
            "URPASS allows organizers to build custom event registration forms that collect attendee information and accept instant UPI payments. When an attendee submits their details, an interactive UPI intent prompt or dynamic QR code appears, allowing 1-tap checkout via Google Pay, PhonePe, Paytm, or CRED. Payments clear immediately, settling directly into the organizer's Indian bank account with 0% ticketing commission, while the attendee receives their digital pass instantly.",
          keyPoints: [
            "0% ticketing commission: keep 100% of your registration revenue (standard PG fee only)",
            "Native 1-tap UPI Intent for mobile users + dynamic QR code for desktop screens",
            "Compatible with Google Pay, PhonePe, Paytm, BHIM, CRED, and all Indian bank UPI apps",
            "Instant automated digital QR pass delivery on payment confirmation via WhatsApp & Email",
            "Funds settle directly to your Indian bank account via Razorpay with automated reconciliation",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "URPASS UPI Registration vs. Traditional Ticketing Portals",
          subtitle: "Financial and operational parameters comparing URPASS UPI to legacy ticketing portals.",
          headers: ["Commercial Parameter", "URPASS UPI Registration", "Traditional Ticketing Platforms (Townscript / Eventbrite)"],
          rows: [
            {
              col1: "Platform Ticketing Commission",
              col2: "0% Platform Commission (Flat subscription or free tier)",
              col3: "5% to 10% taken from every attendee ticket",
            },
            {
              col1: "Payment Settlement Speed",
              col2: "Direct to your bank account via your connected gateway (T+2 days)",
              col3: "Platform holds your money for 15–30 days after the event ends",
            },
            {
              col1: "UPI Checkout Experience",
              col2: "Seamless 1-tap UPI app intent switch + dynamic QR code",
              col3: "Redirects through multiple ad-heavy checkout screens",
            },
            {
              col1: "Supported UPI Apps",
              col2: "Google Pay, PhonePe, Paytm, BHIM, CRED, Axis, ICICI, HDFC",
              col3: "Limited or forces international credit card fields",
            },
            {
              col1: "Custom Registration Fields",
              col2: "Unlimited custom questions, roll numbers, team member names",
              col3: "Strictly limited to basic Name, Email, and Phone fields",
            },
            {
              col1: "Pass Issuance",
              col2: "Automated digital pass page + WhatsApp delivery instantly",
              col3: "Generic PDF receipt sent via delayed batch email",
            },
            {
              col1: "Refund & Cancellation Control",
              col2: "Full 1-click organizer control directly from dashboard",
              col3: "Requires opening support tickets with portal customer service",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Smartphone,
            title: "1-Tap UPI Mobile Intent",
            desc: "On mobile devices, clicking 'Pay with UPI' immediately launches the user's preferred app (GPay, PhonePe, Paytm) for frictionless 5-second checkout.",
          },
          {
            icon: Percent,
            title: "Zero Ticketing Commission",
            desc: "Stop sacrificing 8%–12% of your revenue to event portals. URPASS charges 0% per-ticket fees, so you keep maximum earnings.",
          },
          {
            icon: Building2,
            title: "Direct Bank Settlement",
            desc: "Connect your Razorpay account in 2 minutes. Ticket proceeds deposit directly into your institutional or corporate bank account automatically.",
          },
          {
            icon: QrCode,
            title: "Dynamic Desktop QR Codes",
            desc: "Attendees registering from laptops scan a high-resolution dynamic UPI QR code with any mobile UPI app to complete instant verification.",
          },
          {
            icon: Zap,
            title: "Instant Pass Delivery",
            desc: "Webhooks verify transaction status in real time, automatically provisioning and delivering the attendee's unique QR gate pass via WhatsApp and Email.",
          },
          {
            icon: ShieldCheck,
            title: "Automated Reconciliation",
            desc: "Every registration record is atomically tied to its UPI transaction ID, eliminating manual bank statement matching and paper screenshot verification.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REVENUE ANALYTICS",
          title: "Over ₹2.5 Crore Processed with Zero Platform Deductions",
          description:
            "From college technical symposiums in Coimbatore to founder networking conferences in Bangalore, see how UPI registration drives higher conversions.",
          type: "analytics",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Designed Specifically for the Indian UPI Economy",
          subtitle: "Why UPI registration out-converts credit cards by 4x across Indian student and professional events.",
          items: [
            {
              title: "85%+ Indian Digital Payment Share",
              description:
                "UPI accounts for the vast majority of digital payments in India. Forcing student and young professional attendees to use credit cards results in 40%+ checkout abandonment.",
              badge: "Highest Conversion",
            },
            {
              title: "Ending 'Send GPay Screenshot' Chaos",
              description:
                "Student clubs often ask attendees to GPay a volunteer and upload a payment screenshot into Google Forms. Volunteers waste 40 hours matching transaction IDs. URPASS automates the entire flow.",
              badge: "Auto-Reconciled",
            },
            {
              title: "Instant Student Club Budget Access",
              description:
                "Unlike platforms that hold your ticket funds until days after your festival ends, direct gateway connection provides continuous cash flow to pay event vendors on schedule.",
              badge: "Cash Flow Freedom",
            },
            {
              title: "GST Invoicing Compliance",
              description:
                "Collect GST numbers, generate compliant tax invoices, and export clean accounting sheets with 1 click for institutional audit compliance.",
              badge: "GST Ready",
            },
          ],
        },

        // Step-by-Step Workflow
        steps: [
          {
            n: "01",
            title: "Connect Your Razorpay Account",
            desc: "Link your verified Razorpay account inside URPASS settings in under 2 minutes. Funds route directly to your Indian bank.",
          },
          {
            n: "02",
            title: "Build Your Branded Registration Form",
            desc: "Set ticket prices in INR, define registration limits, and add custom attendee questions (college name, dietary choices, team members).",
          },
          {
            n: "03",
            title: "Attendees Pay via UPI in 5 Seconds",
            desc: "Guests register, tap Google Pay or PhonePe, authorize payment, and receive their scannable digital entry pass on WhatsApp immediately.",
          },
        ],

        // Deep Dive Educational Sections
        deepDiveSections: [
          {
            badge: "COMMERCIAL ADVANTAGE",
            title: "The Mathematical Reality of 0% Commission Ticketing",
            paragraphs: [
              "Traditional ticketing portals charge between 6% to 10% plus GST on every paid ticket sold. For a college technical fest or corporate conference selling ₹10,00,000 in registrations, the portal skims between ₹60,000 and ₹1,00,000 from your event budget.",
              "URPASS operates on a modern SaaS subscription model rather than a predatory percentage cut. By connecting your own payment gateway (such as Razorpay), you only pay standard RBI-regulated gateway processing fees (~2%), while URPASS charges ₹0 commission on ticket sales.",
              "This pricing structure saves event organizers tens of thousands of rupees while providing instant access to ticket revenue rather than waiting weeks for post-event portal disbursements.",
            ],
            bullets: [
              "Save up to 8% of gross ticket sales compared to aggregator ticketing sites",
              "Maintain complete ownership of your attendee financial data and transaction logs",
              "Direct merchant relationship with your payment gateway protects against third-party freezes",
              "Ideal for student unions, non-profits, independent creators, and corporate organizers",
            ],
            takeaway:
              "Switching from commission-based ticketing portals to direct UPI payments immediately recovers 6%–10% of your event budget.",
          },
          {
            badge: "OPERATIONAL AUTOMATION",
            title: "Why Manual GPay Screenshot Forms Paralyze Registration Teams",
            paragraphs: [
              "When running on tight budgets, thousands of Indian student clubs and meetup hosts resort to Google Forms: they paste a personal UPI ID, instruct attendees to transfer money, take a screenshot of the receipt, and upload the image to a Google Form.",
              "This workflow leads to severe administrative failure. Fraudulent attendees upload duplicate screenshots, Photoshop fake transaction IDs, or send ₹1 instead of ₹500. Event organizers spend dozens of hours manually verifying bank statements while valid attendees wait days for confirmation.",
              "URPASS replaces this error-prone manual labor with automated gateway webhooks. Every UPI payment is cryptographically verified with the banking switch in real time before the pass is generated, guaranteeing that every admitted attendee has genuinely paid.",
            ],
            bullets: [
              "Zero manual screenshot auditing or bank statement cross-referencing",
              "Cryptographic webhook verification prevents forged receipt images",
              "Automatic capacity decrementing ensures you never oversell paid event seats",
              "Instant confirmation eliminates nervous 'did you receive my payment?' messages",
            ],
            takeaway:
              "Automated UPI registration provides a professional payment experience without manual verification overhead.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS UPI Registration vs Legacy Portals & Google Forms",
          subtitle: "Why automated UPI checkouts outperform old aggregator portals and manual screenshot forms.",
          competitorName: "Traditional Event Portals & Forms",
          rows: [
            {
              criteria: "Platform Commission",
              urpass: "0% Platform Commission",
              competitor: "5%–10% per ticket fee",
              urpassAdvantage: true,
            },
            {
              criteria: "Payment Verification",
              urpass: "Automated real-time webhook confirmation",
              competitor: "Manual screenshot verification or delayed clearing",
              urpassAdvantage: true,
            },
            {
              criteria: "UPI Payment Experience",
              urpass: "1-tap intent launch (GPay, PhonePe, Paytm, CRED)",
              competitor: "Manual copy-pasting of VPA / UPI ID",
              urpassAdvantage: true,
            },
            {
              criteria: "Funds Settlement",
              urpass: "Direct to organizer bank (T+2 days via Razorpay)",
              competitor: "Held by platform until 15–30 days after event",
              urpassAdvantage: true,
            },
            {
              criteria: "Ticket / Pass Delivery",
              urpass: "Instant digital QR pass via WhatsApp and Email",
              competitor: "Unbranded email attachment or manual WhatsApp message",
              urpassAdvantage: true,
            },
            {
              criteria: "Capacity Management",
              urpass: "Atomic seat reservation preventing overselling",
              competitor: "Form remains open causing excess registrations",
              urpassAdvantage: true,
            },
          ],
        },

        // Target Event Formats
        useCases: [
          "College Technical Symposiums & Cultural Fests",
          "Paid Hands-On Workshops & Coding Bootcamps",
          "Founder Meetups, Tech Summits & Conferences",
          "Music Concerts, Standup Comedy & Club Gigs",
          "Sports Tournaments, Marathons & Fitness Meets",
          "Corporate Seminars & Professional Masterclasses",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Registration Software Pillar",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "Event Ticketing Software Pillar",
            href: "/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
          {
            title: "Razorpay Event Registration",
            href: "/razorpay-event-registration",
            category: "Product",
          },
          {
            title: "WhatsApp Event Tickets",
            href: "/whatsapp-event-tickets",
            category: "Product",
          },
          {
            title: "Event Registration in India (Hub)",
            href: "/in",
            category: "Location",
          },
          {
            title: "Compare: Google Forms vs URPASS",
            href: "/compare/google-forms-vs-urpass",
            category: "Comparison",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "Which UPI apps can attendees use to pay for registrations?",
            a: "Attendees can use any UPI application available in India, including Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay, and native banking apps from HDFC, ICICI, SBI, and Axis Bank.",
          },
          {
            q: "How does 0% ticketing commission work on URPASS?",
            a: "URPASS charges zero commission on your ticket sales. You connect your own Razorpay payment gateway credentials, so ticket revenue settles directly to your bank account with only standard payment gateway processing fees (~2%).",
          },
          {
            q: "How do attendees receive their ticket pass after completing UPI payment?",
            a: "Immediately upon payment confirmation, the attendee is redirected to their live digital QR pass. A copy of the pass link is also sent automatically to their mobile number via WhatsApp and to their email inbox.",
          },
          {
            q: "Can I collect custom registration details along with the payment?",
            a: "Yes. You can add unlimited custom fields to your registration form, including college names, student roll numbers, dietary preferences, t-shirt sizes, or team member details.",
          },
          {
            q: "What happens if an attendee's UPI transaction fails or gets debited without confirmation?",
            a: "If an attendee's bank fails during transit, the pass is not issued. If the bank debits funds and confirms via webhook within seconds, the pass is provisioned automatically. In the rare event of an unconfirmed debit, the banking system auto-refunds the user via standard UPI NPCI reversal protocols.",
          },
          {
            q: "Can I set different price tiers (e.g. Early Bird, Student, VIP)?",
            a: "Yes. You can create multiple ticket categories with individual price points, custom capacities, and sales start/end dates.",
          },
        ],
      }}
    />
  );
}
