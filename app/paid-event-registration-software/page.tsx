import type { Metadata } from "next";
import { Banknote, BarChart3, CreditCard, Lock, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Paid Event Registration & Online Ticketing Software | URPASS",
  description: "Paid event registration software with 0% ticketing commission. Direct payment gateway settlement, automated digital QR passes, and sub-second phone check-in.",
  keywords: ["paid event registration software", "paid event ticketing platform", "online event payment processing", "zero commission ticketing", "direct payment event registration", "paid ticket qr code scanner"],
  alternates: {
    canonical: "https://urpass.space/paid-event-registration-software",
  },
  openGraph: {
    title: "Paid Event Registration & Online Ticketing Software | URPASS",
    description: "Paid event registration software with 0% ticketing commission. Direct payment gateway settlement, automated digital QR passes, and sub-second phone check-in.",
    url: "https://urpass.space/paid-event-registration-software",
    locale: "en_US",
    type: "website",
  },
};

export default function PaidEventRegistrationSoftwarePage() {
  return (
    <SEOPage
      config={{
  "badge": "PAID TICKETING & PAYMENTS",
  "h1": "Paid Event Registration & Online Ticketing Software",
  "canonicalUrl": "https://urpass.space/paid-event-registration-software",
  "description": "Paid event registration software with 0% ticketing commission. Direct payment gateway settlement, automated digital QR passes, and sub-second phone check-in.",
  "ctaLabel": "Start Selling Tickets Free →",
  "ctaTitle": "Sell Event Tickets with 0% Ticketing Commission",
  "ctaDescription": "Connect your payment gateway, accept direct ticket sales, issue digital QR passes, and keep 100% of your event revenue without per-ticket fee cuts.",
  "directAnswer": {
    "title": "What is Paid Event Registration Software?",
    "summary": "Paid event registration software is an online ticketing platform that enables organizers to sell event tickets, process attendee payments securely, and issue digital admission passes. URPASS connects directly to your merchant payment gateway (Stripe, Razorpay) with 0% ticketing commission, settling funds straight to your bank account while providing sub-0.3s smartphone check-in.",
    "keyPoints": [
      "0% platform ticketing commission — keep 100% of your ticket price",
      "Direct settlement into your own bank account via Stripe or Razorpay",
      "Automated digital QR pass delivery sent immediately upon payment confirmation",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero hardware rentals"
    ]
  },
  "whatIs": {
    "title": "What is Paid Event Registration Software?",
    "definition": "Paid event registration software is a commercial event ticketing platform that handles financial transactions, tax compliance, inventory limits, and digital access credentials for paid events. It provides organizers with secure checkout pages and generates scannable digital passes for gate entry.",
    "details": [
      "Eliminates high 5% to 10% ticketing aggregator commissions that erode event margins",
      "Settles ticket revenues directly into the organizer's merchant account without delayed holds",
      "Issues cryptographically secure digital QR passes immediately upon successful checkout",
      "Synchronizes multi-door scanning at the venue to ensure paid tickets cannot be shared or duplicated"
    ]
  },
  "howItWorksTitle": "How Paid Event Ticketing Operates",
  "howItWorksSubtitle": "From ticket checkout to gate check-in.",
  "steps": [
    {
      "n": "01",
      "title": "Configure paid ticket tiers",
      "desc": "Set ticket names (Early Bird, VIP, General), prices, and capacity limits."
    },
    {
      "n": "02",
      "title": "Connect payment gateway",
      "desc": "Link your Stripe or Razorpay merchant account to accept credit cards or UPI."
    },
    {
      "n": "03",
      "title": "Publish registration link",
      "desc": "Share your clean, high-converting ticket checkout page with zero ads."
    },
    {
      "n": "04",
      "title": "Attendees purchase tickets",
      "desc": "Funds settle directly to your bank account with zero platform percentage deductions."
    },
    {
      "n": "05",
      "title": "Automated QR pass issuance",
      "desc": "Buyers receive secure digital QR tickets via email and mobile web immediately."
    },
    {
      "n": "06",
      "title": "Scan at the entrance",
      "desc": "Door volunteers scan passes in <0.3s with smartphone cameras for green entry."
    }
  ],
  "featuresTitle": "Commercial Capabilities Built to Protect Your Revenue",
  "featuresSubtitle": "Zero commission, direct payouts, and sub-second phone scanning.",
  "features": [
    {
      icon: Banknote,
      "title": "0% Platform Commission",
      "desc": "Keep 100% of your ticket sales. On a £10,000 / ₹5,00,000 event, traditional platforms deduct thousands. URPASS charges zero cuts."
    },
    {
      icon: CreditCard,
      "title": "Direct Gateway Settlement",
      "desc": "Connect your own Stripe or Razorpay account. Ticket funds deposit directly to your bank on your standard schedule."
    },
    {
      icon: QrCode,
      "title": "Instant QR Ticket Issuance",
      "desc": "Automated delivery of unique, mobile-responsive QR passes immediately upon successful payment."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Gate Validation",
      "desc": "Scan tickets in under 0.3 seconds using any volunteer smartphone browser. Clear queues rapidly."
    },
    {
      icon: Lock,
      "title": "Atomic Fraud Protection",
      "desc": "Prevent ticket counterfeiting and screenshot sharing. Scanned tickets are locked across all doors in <150ms."
    },
    {
      icon: BarChart3,
      "title": "Real-Time Revenue Telemetry",
      "desc": "Track ticket sales velocity, tier inventory, and revenue totals live from your organizer dashboard."
    }
  ],
  "whoShouldUse": {
    "title": "Who Needs Paid Event Registration Software?",
    "subtitle": "Built for commercial event organizers who value their profit margins.",
    "personas": [
      {
        "badge": "CONFERENCES",
        "title": "B2B Conferences & Summits",
        "desc": "Save thousands in platform fees on high-ticket delegate passes and issue automated tax invoices."
      },
      {
        "badge": "WORKSHOPS",
        "title": "Masterclasses & Professional Training",
        "desc": "Collect course fees directly and verify enrolled attendees at the door in seconds."
      },
      {
        "badge": "CONCERTS",
        "title": "Music Festivals & Nightlife",
        "desc": "Sell tickets with zero commission and scan mobile QR codes at venue doors in <0.3s."
      },
      {
        "badge": "COLLEGES",
        "title": "College Fests & Student Balls",
        "desc": "Keep 100% of ticket revenue for student clubs instead of paying aggregator cuts."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Paid Tickets Are Validated at the Door",
    "subtitle": "Sub-second camera scanning on volunteer phones.",
    "description": "Attendees display their mobile QR pass on their phone screen. Volunteer staff open the scanner URL in Safari or Chrome on their smartphones. Pointing the camera at the pass validates the ticket in under 0.3 seconds with an audible green chime, verifying their registration without needing a paper roster.",
    "points": [
      "Zero equipment costs: volunteers use their personal mobile phones.",
      "Offline engine pre-loads ticket databases to validate passes with zero network connectivity.",
      "Atomic row-locking prevents shared pass screenshots across different gate tents.",
      "Rapid manual lookup by name if an attendee's phone battery has died."
    ]
  },
  "keyFactsTable": {
    "title": "URPASS 0% Commission vs Legacy Ticketing Platforms",
    "subtitle": "See how much revenue you retain by avoiding per-ticket commission fees.",
    "headers": [
      "Financial / Operational Metric",
      "Legacy Ticketing Aggregators (Eventbrite / Townscript)",
      "Connected URPASS Platform"
    ],
    "rows": [
      {
        "col1": "Ticketing Commission",
        "col2": "5% to 10% deducted from every ticket sold",
        "col3": "0% commission; keep 100% of ticket price"
      },
      {
        "col1": "Payout Schedule",
        "col2": "Payouts delayed until days or weeks after the event",
        "col3": "Direct settlement to your bank via Stripe/Razorpay"
      },
      {
        "col1": "Attendee Data Privacy",
        "col2": "Aggregators market competitor events to your buyers",
        "col3": "100% white-label; zero competitor cross-selling"
      },
      {
        "col1": "Entrance Check-In Speed",
        "col2": "2.5 to 4.0s on heavy native scanner apps",
        "col3": "<0.3s camera scan on any mobile browser"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is paid event registration software?",
      "a": "It is an online ticketing platform that enables organizers to sell tickets, process attendee payments securely, and generate scannable digital passes for event entry."
    },
    {
      "q": "Does URPASS take a percentage cut of my ticket sales?",
      "a": "No! URPASS charges 0% commission on ticket sales. You only pay standard merchant processing fees directly to your payment gateway (Stripe or Razorpay)."
    },
    {
      "q": "When do I receive the money from my ticket sales?",
      "a": "Because you connect your own Stripe or Razorpay account, ticket revenues settle directly into your bank account on your standard gateway payout schedule."
    },
    {
      "q": "Can I configure multiple ticket tiers (e.g. Early Bird, VIP)?",
      "a": "Yes. You can configure unlimited ticket tiers with distinct prices, inventory limits, sales windows, and custom questions."
    },
    {
      "q": "How do door volunteers scan paid tickets at the venue?",
      "a": "Door staff simply open a secure web scanner link on their smartphone browser (Safari or Chrome) and scan attendee QR passes in under 0.3 seconds."
    },
    {
      "q": "What payment gateways are supported for paid event registrations?",
      "a": "URPASS supports direct integration with Stripe and Razorpay, allowing organizers to accept credit cards, debit cards, UPI, and net banking worldwide."
    },
    {
      "q": "Does URPASS withhold ticket funds or delay payouts?",
      "a": "No. Ticket payments go directly into your connected Stripe or Razorpay account with zero intermediary holding or payout delays."
    }
  ],
  "relatedLinks": [
    {
      "title": "Zero-Commission Event Ticketing Platform",
      "href": "/zero-commission-event-ticketing",
      "category": "Product"
    },
    {
      "title": "Event Ticketing with Razorpay, UPI & QR Passes",
      "href": "/event-ticketing-with-razorpay",
      "category": "Product"
    },
    {
      "title": "Event Registration with QR Code Tickets",
      "href": "/event-registration-with-qr-code",
      "category": "Product"
    },
    {
      "title": "Eventbrite Alternative",
      "href": "/eventbrite-alternative",
      "category": "Comparison"
    },
    {
      "title": "Conference Registration Software with QR Check-In",
      "href": "/conference-registration-software",
      "category": "Use Case"
    }
  ]
}}
    />
  );
}
