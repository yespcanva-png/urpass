import type { Metadata } from "next";
import { Banknote, CreditCard, FileText, Lock, QrCode, ScanLine } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing with Razorpay, UPI & QR Passes | URPASS",
  description: "Event ticketing with Razorpay integration. Accept instant UPI payments, Google Pay, cards, issue digital QR passes, and enjoy 0% ticketing commission.",
  keywords: ["Razorpay event ticketing", "event ticketing with upi", "razorpay event registration", "instant upi event ticket generator", "college fest ticketing with razorpay", "zero commission ticketing india"],
  alternates: {
    canonical: "https://urpass.space/event-ticketing-with-razorpay",
  },
  openGraph: {
    title: "Event Ticketing with Razorpay, UPI & QR Passes | URPASS",
    description: "Event ticketing with Razorpay integration. Accept instant UPI payments, Google Pay, cards, issue digital QR passes, and enjoy 0% ticketing commission.",
    url: "https://urpass.space/event-ticketing-with-razorpay",
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

export default function EventTicketingWithRazorpayPage() {
  return (
    <SEOPage
      config={{
  "badge": "RAZORPAY & UPI INTEGRATION",
  "h1": "Event Ticketing with Razorpay, UPI & QR Passes",
  "canonicalUrl": "https://urpass.space/event-ticketing-with-razorpay",
  "description": "Event ticketing with Razorpay integration. Accept instant UPI payments, Google Pay, cards, issue digital QR passes, and enjoy 0% ticketing commission.",
  "ctaLabel": "Connect Razorpay Free →",
  "ctaTitle": "Accept Instant UPI & Card Payments for Your Events",
  "ctaDescription": "Link your Razorpay merchant key, accept Google Pay, PhonePe, and cards, issue automated digital QR passes, and enjoy 0% ticketing commission.",
  "directAnswer": {
    "title": "How Does Razorpay Event Ticketing Work with URPASS?",
    "summary": "Event ticketing with Razorpay allows Indian organizers to connect their Razorpay merchant account directly to URPASS. Attendees pay seamlessly via Google Pay, PhonePe, Paytm, UPI QR, and cards. Funds settle directly into your bank account with 0% platform ticketing commission, while URPASS automatically generates and dispatches encrypted digital QR passes.",
    "keyPoints": [
      "Native UPI checkout supporting Google Pay, PhonePe, Paytm, and UPI QR",
      "Direct settlement into your bank account with zero platform commission fees",
      "Automated digital QR pass delivery sent immediately upon payment confirmation",
      "Sub-second (<0.3s) camera check-in on volunteer phones with zero app downloads"
    ]
  },
  "whatIs": {
    "title": "What is Razorpay Event Ticketing?",
    "definition": "Razorpay event ticketing is an integrated event payment workflow designed for the Indian market. It bridges Razorpay's trusted payment infrastructure with URPASS's automated credentialing and gate scanning engine, providing an end-to-end ticketing solution with direct bank payouts.",
    "details": [
      "Eliminates high 5% to 10% ticketing aggregator commissions, saving lakhs on large events",
      "Provides Indian attendees with familiar, trusted one-click UPI payment flows",
      "Issues instant mobile QR passes immediately upon transaction success",
      "Functions seamlessly for college fests, conferences, workshops, and sports tournaments across India"
    ]
  },
  "howItWorksTitle": "How Razorpay Ticketing Operates",
  "howItWorksSubtitle": "From UPI checkout to gate check-in in six steps.",
  "steps": [
    {
      "n": "01",
      "title": "Connect Razorpay account",
      "desc": "Paste your Razorpay Key ID and Key Secret into your organizer settings."
    },
    {
      "n": "02",
      "title": "Configure ticket tiers",
      "desc": "Set ticket pricing in INR (₹), capacity limits, and custom registration fields."
    },
    {
      "n": "03",
      "title": "Publish ticketing page",
      "desc": "Share your clean event URL across WhatsApp, Instagram, and college portals."
    },
    {
      "n": "04",
      "title": "Attendees pay via UPI",
      "desc": "Buyers complete payment in seconds using Google Pay, PhonePe, or cards."
    },
    {
      "n": "05",
      "title": "Instant QR pass issuance",
      "desc": "Buyers receive secure digital QR tickets via email and WhatsApp immediately."
    },
    {
      "n": "06",
      "title": "Scan at the entrance",
      "desc": "Door volunteers scan passes in <0.3s with smartphone cameras for green entry."
    }
  ],
  "featuresTitle": "Built for Indian Payments & High-Throughput Gates",
  "featuresSubtitle": "Native UPI checkout, direct settlement, and sub-second phone scanning.",
  "features": [
    {
      icon: Banknote,
      "title": "Native UPI & QR Checkout",
      "desc": "Accept payments via Google Pay, PhonePe, Paytm, BHIM, and Credit/Debit cards with high success rates."
    },
    {
      icon: CreditCard,
      "title": "Direct Merchant Settlement",
      "desc": "100% of ticket funds land directly in your own bank account via Razorpay on your standard settlement cycle."
    },
    {
      icon: QrCode,
      "title": "Automated QR Pass Dispatch",
      "desc": "Unique encrypted QR tickets are generated and delivered immediately upon payment confirmation."
    },
    {
      icon: ScanLine,
      "title": "Sub-0.3s Volunteer Gate Scanning",
      "desc": "Scan passes in under 0.3 seconds using any volunteer smartphone browser. Clear queues rapidly."
    },
    {
      icon: Lock,
      "title": "Atomic Fraud Protection",
      "desc": "Prevent ticket counterfeiting and screenshot sharing. Scanned tickets are locked across all doors in <150ms."
    },
    {
      icon: FileText,
      "title": "GST-Compliant Invoicing",
      "desc": "Capture company/institution GSTIN numbers during registration and generate automated corporate tax invoices."
    }
  ],
  "whoShouldUse": {
    "title": "Who Needs Razorpay Event Ticketing?",
    "subtitle": "From engineering college fests to Bengaluru tech conferences.",
    "personas": [
      {
        "badge": "COLLEGES",
        "title": "College Fests & Symposiums",
        "desc": "Accept student UPI payments directly and eliminate manual bank transfer screenshot verifications."
      },
      {
        "badge": "CONFERENCES",
        "title": "Tech & Medical Conferences",
        "desc": "Collect high-value delegate registrations with automated GST tax invoicing and 0% commission."
      },
      {
        "badge": "WORKSHOPS",
        "title": "Training & Masterclasses",
        "desc": "Cap seat capacities automatically and collect course fees directly into your business account."
      },
      {
        "badge": "COMMUNITY",
        "title": "Marathons & Sports Events",
        "desc": "Manage thousands of participant registrations with instant digital QR race passes."
      }
    ]
  },
  "howQrCheckInWorks": {
    "title": "How Razorpay Tickets Are Validated",
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
    "title": "Direct Razorpay Integration vs Ticketing Aggregators",
    "subtitle": "Why direct payment integration is superior for Indian organizers.",
    "headers": [
      "Financial / Operational Metric",
      "Ticketing Aggregators (BookMyShow / Townscript)",
      "URPASS Direct Razorpay Integration"
    ],
    "rows": [
      {
        "col1": "Ticketing Commission",
        "col2": "5% to 10% deducted from every ticket sold",
        "col3": "0% commission; keep 100% of ticket price"
      },
      {
        "col1": "Payout Timeline",
        "col2": "Funds held until days or weeks after the event",
        "col3": "Direct settlement to your bank via Razorpay"
      },
      {
        "col1": "UPI Payment Experience",
        "col2": "Clunky redirect flows with high drop-off rates",
        "col3": "Native seamless UPI intent & QR checkout"
      },
      {
        "col1": "Entrance Check-In Speed",
        "col2": "2.5 to 4.0s on heavy native scanner apps",
        "col3": "<0.3s camera scan on any mobile phone browser"
      }
    ]
  },
  "faqs": [
    {
      "q": "How do I connect Razorpay to URPASS?",
      "a": "You simply copy your Razorpay Key ID and Key Secret from your Razorpay Dashboard and paste them into your URPASS event settings. Setup takes less than 2 minutes."
    },
    {
      "q": "Does URPASS charge any commission on tickets sold via Razorpay?",
      "a": "No! URPASS charges 0% commission on ticket sales. You only pay standard Razorpay processing fees directly to Razorpay."
    },
    {
      "q": "Can attendees pay using Google Pay or PhonePe?",
      "a": "Yes! Razorpay provides full support for Google Pay, PhonePe, Paytm, BHIM, UPI QR, Netbanking, Credit Cards, and Debit Cards."
    },
    {
      "q": "When does the ticket money reach my bank account?",
      "a": "Because ticket payments flow directly through your own Razorpay merchant account, funds settle to your bank on your standard Razorpay settlement schedule (typically T+2 days)."
    },
    {
      "q": "Can college committees collect GST details for institutional sponsors?",
      "a": "Yes. Custom intake fields let you capture company/college GSTIN numbers, billing addresses, and generate automated corporate tax invoices."
    },
    {
      "q": "Does Razorpay ticketing support instant UPI payments and Google Pay?",
      "a": "Yes. Attendees can pay instantly via UPI apps (Google Pay, PhonePe, Paytm, CRED), credit/debit cards, and net banking."
    },
    {
      "q": "Do organizers need an active Razorpay merchant account?",
      "a": "Yes. You connect your own Razorpay Key ID and Secret in settings, ensuring 100% of event proceeds settle directly into your business bank account."
    }
  ],
  "relatedLinks": [
    {
      "title": "Zero-Commission Event Ticketing Platform",
      "href": "/zero-commission-event-ticketing",
      "category": "Product"
    },
    {
      "title": "Paid Event Registration & Online Ticketing Software",
      "href": "/paid-event-registration-software",
      "category": "Product"
    },
    {
      "title": "Eventbrite Alternative India",
      "href": "/eventbrite-alternative-india",
      "category": "Comparison"
    },
    {
      "title": "Event Registration with QR Code Tickets",
      "href": "/event-registration-with-qr-code",
      "category": "Product"
    },
    {
      "title": "Multi-Gate QR Check-In for Large Events",
      "href": "/multi-gate-event-check-in",
      "category": "Product"
    }
  ],
  "geo": {
    "region": "IN",
    "placename": "India",
    "position": "20.5937;78.9629",
    "latitude": 20.5937,
    "longitude": 78.9629,
    "country": "India",
    "countryCode": "IN"
  }
}}
    />
  );
}
