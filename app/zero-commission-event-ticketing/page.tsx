import type { Metadata } from "next";
import { Banknote, BarChart3, CreditCard, Lock, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Zero-Commission Event Ticketing Platform | URPASS",
  description: "Zero-commission event ticketing platform. Keep 100% of your ticket sales with flat subscription pricing, automated QR passes, and sub-second phone scanning.",
  keywords: ["zero commission event ticketing", "zero fee ticketing platform", "0% commission event tickets", "no fee event ticketing", "flat fee event ticketing software", "event ticketing without commission"],
  alternates: {
    canonical: "https://urpass.space/zero-commission-event-ticketing",
  },
  openGraph: {
    title: "Zero-Commission Event Ticketing Platform | URPASS",
    description: "Zero-commission event ticketing platform. Keep 100% of your ticket sales with flat subscription pricing, automated QR passes, and sub-second phone scanning.",
    url: "https://urpass.space/zero-commission-event-ticketing",
    locale: "en_US",
    type: "website",
  },
};

export default function ZeroCommissionEventTicketingPage() {
  return (
    <SEOPage
      config={{
  "badge": "0% TICKETING COMMISSION",
  "h1": "Zero-Commission Event Ticketing Platform",
  "canonicalUrl": "https://urpass.space/zero-commission-event-ticketing",
  "description": "Zero-commission event ticketing platform. Keep 100% of your ticket sales with flat subscription pricing, automated QR passes, and sub-second phone scanning.",
  "ctaLabel": "Keep 100% of Ticket Revenue →",
  "ctaTitle": "Retain 100% of Your Gross Ticket Revenue",
  "ctaDescription": "Stop paying 5% to 10% ticketing aggregator commissions. Connect your payment gateway, pay simple flat monthly subscriptions, and keep every penny.",
  "directAnswer": {
    "title": "What is a Zero-Commission Event Ticketing Platform?",
    "summary": "A zero-commission event ticketing platform is an online ticketing system that charges 0% percentage cuts on your ticket sales. Unlike traditional ticketing aggregators that take 5% to 10% of gross revenue, URPASS operates on transparent flat monthly subscriptions, settling 100% of your ticket sales directly into your merchant bank account.",
    "keyPoints": [
      "0% platform ticketing commission — retain 100% of your ticket price",
      "Direct payment gateway settlement via Stripe or Razorpay to your bank",
      "Automated digital QR pass generation and instant mobile delivery",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero hardware rentals"
    ]
  },
  "whatIs": {
    "title": "What is Zero-Commission Event Ticketing?",
    "definition": "Zero-commission event ticketing is a business model and software platform that replaces variable per-ticket percentage penalties with flat software subscription pricing. Organizers connect their own payment gateway, collect ticket funds directly, and pay zero commission to the ticketing software provider.",
    "details": [
      "Saves event organizers thousands in unnecessary ticketing aggregator commissions",
      "Eliminates delayed payout cycles where platforms hold your ticket money until after the event",
      "Provides full ownership of attendee contact records with zero third-party promotional ads",
      "Includes enterprise-grade gate operations with sub-second smartphone camera check-in"
    ]
  },
  "howItWorksTitle": "How Zero-Commission Ticketing Works",
  "howItWorksSubtitle": "Keep your ticket revenue in six simple steps.",
  "steps": [
    {
      "n": "01",
      "title": "Create your event",
      "desc": "Set your ticket prices, tier categories, and capacity caps in 3 minutes."
    },
    {
      "n": "02",
      "title": "Connect direct gateway",
      "desc": "Link your Stripe or Razorpay account to receive ticket revenues directly."
    },
    {
      "n": "03",
      "title": "Publish branded ticketing page",
      "desc": "Share your clean, fast-loading ticket page with zero competitor ads."
    },
    {
      "n": "04",
      "title": "Attendees buy tickets",
      "desc": "100% of the ticket price lands directly in your bank account with zero platform cuts."
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
  "featuresTitle": "Capabilities Designed to Maximize Organizer Profit",
  "featuresSubtitle": "Zero percentage fees, direct bank payouts, and sub-second phone scanning.",
  "features": [
    {
      icon: Banknote,
      "title": "0% Per-Ticket Commission",
      "desc": "Keep 100% of your ticket price. On a £10,000 / $10,000 event, traditional platforms deduct £700 to £1,000. URPASS charges zero commission."
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
    "title": "Who Benefits from Zero-Commission Ticketing?",
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
    "title": "How Zero-Commission Event Check-In Operates",
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
    "title": "Zero Commission vs Commission Aggregators",
    "subtitle": "How URPASS flat pricing compares to percentage cuts on ticket sales.",
    "headers": [
      "Financial Dimension",
      "Percentage Aggregators (Eventbrite / Ticketmaster)",
      "URPASS Zero-Commission Platform"
    ],
    "rows": [
      {
        "col1": "Fee on £10,000 Sales",
        "col2": "£700 to £1,000 deducted in ticketing fees",
        "col3": "£0 commission; flat £35/mo subscription"
      },
      {
        "col1": "Payout Control",
        "col2": "Platform holds your money until weeks after the event",
        "col3": "Direct settlement to your bank via Stripe/Razorpay"
      },
      {
        "col1": "Competitor Ads",
        "col2": "Promotes competitor events on your checkout page",
        "col3": "100% white-label and ad-free experience"
      },
      {
        "col1": "Entrance Check-In",
        "col2": "Slow native apps or expensive rented hardware",
        "col3": "Sub-second (<0.3s) camera scan on volunteer phone"
      }
    ]
  },
  "faqs": [
    {
      "q": "What is zero-commission event ticketing?",
      "a": "It is an event ticketing model where the software platform charges 0% percentage cuts on your ticket sales, allowing organizers to retain 100% of their ticket revenue."
    },
    {
      "q": "How does URPASS make money if there is 0% commission?",
      "a": "URPASS operates on transparent flat monthly subscriptions (£15 / £35 / £79/mo or INR equivalent) for organizers hosting paid events, regardless of how many tickets you sell."
    },
    {
      "q": "Do I have to pay credit card processing fees?",
      "a": "Yes. Standard payment processing fees charged by your gateway (Stripe or Razorpay, typically ~1.4% to 2.9%) still apply, but URPASS adds zero platform markup."
    },
    {
      "q": "When do I receive my ticket money?",
      "a": "Because you connect your own Stripe or Razorpay account, all ticket payments land directly into your own merchant account on your standard payout schedule."
    },
    {
      "q": "Can I cancel my monthly subscription after my event finishes?",
      "a": "Yes! You can pause or cancel your subscription at any time with no lock-in contracts or cancellation penalties."
    },
    {
      "q": "How can URPASS offer zero platform commission?",
      "a": "URPASS operates on transparent SaaS subscription plans or optional organizer upgrades, never taking a percentage cut from your ticket sales."
    },
    {
      "q": "Do attendees pay booking fees or convenience charges on checkout?",
      "a": "No. Organizers can choose to absorb standard payment gateway fees (e.g., Stripe/Razorpay) so attendees pay exactly the face value of the ticket."
    }
  ],
  "relatedLinks": [
    {
      "title": "Paid Event Registration & Online Ticketing Software",
      "href": "/paid-event-registration-software",
      "category": "Product"
    },
    {
      "title": "Eventbrite Alternative",
      "href": "/eventbrite-alternative",
      "category": "Comparison"
    },
    {
      "title": "Eventbrite Alternative UK",
      "href": "/eventbrite-alternative-uk",
      "category": "Comparison"
    },
    {
      "title": "Event Ticketing with Razorpay, UPI & QR Passes",
      "href": "/event-ticketing-with-razorpay",
      "category": "Product"
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
