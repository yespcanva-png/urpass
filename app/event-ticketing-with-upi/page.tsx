import type { Metadata } from "next";
import {
  Smartphone,
  CreditCard,
  QrCode,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Banknote,
  Receipt,
  ScanLine,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing with UPI — Instant PhonePe, GPay & Paytm Payments",
  description:
    "Sell event tickets with instant UPI checkout. Support PhonePe, Google Pay, Paytm, and BHIM with 0% platform commission, sub-5-second checkout, and direct T+2 bank deposits.",
  keywords: [
    "event ticketing with upi",
    "upi event ticketing",
    "sell event tickets upi",
    "google pay event tickets",
    "phonepe event registration",
    "upi qr event ticketing",
    "razorpay upi event tickets india",
  ],
  alternates: { canonical: "https://urpass.space/event-ticketing-with-upi" },
  openGraph: {
    title: "Event Ticketing with UPI | Instant Mobile Checkout | URPASS",
    description:
      "Frictionless UPI checkout for Indian events. Accept PhonePe, GPay, Paytm, and BHIM with zero platform fees and instant digital QR passes.",
    url: "https://urpass.space/event-ticketing-with-upi",
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

export default function EventTicketingWithUpiPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/event-ticketing-with-upi",
        badge: "INDIA UPI PAYMENTS",
        h1: "Event Ticketing with UPI: Sub-5-Second Mobile Checkout",
        description:
          "Allow attendees to purchase event tickets in seconds using PhonePe, Google Pay, Paytm, or BHIM. Zero per-ticket platform commission, direct merchant bank settlements, and instant digital pass issuance.",
        ctaLabel: "Enable UPI ticketing free",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "How Does Event Ticketing with UPI Work?",
          summary:
            "Event ticketing with UPI enables Indian event organizers to collect registration and ticket fees via the Unified Payments Interface using apps like PhonePe, Google Pay, Paytm, and BHIM. URPASS integrates directly with Razorpay to provide native UPI intent on mobile devices and dynamic QR codes on desktop screens—completing ticket purchases in under 5 seconds with zero platform commission deductions and instant digital pass generation.",
          keyPoints: [
            "Native mobile UPI intent flow: one-tap switch to PhonePe, GPay, or Paytm",
            "Dynamic desktop UPI QR code: attendees scan with their phone camera to pay",
            "0% commission on ticket volume: keep 100% of your ticket price",
            "Direct T+2 business day bank settlement via linked Razorpay merchant account",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "UPI vs. Traditional Card Checkout Specifications",
          subtitle: "Why UPI payment flows dramatically outperform credit and debit cards for event ticket sales in India.",
          headers: ["Payment Factor", "URPASS UPI Checkout", "Traditional Card Form Checkout"],
          rows: [
            {
              col1: "Checkout Completion Speed",
              col2: "Under 5 seconds (1 tap on mobile to open UPI app)",
              col3: "45 to 90 seconds (typing 16 digits, expiry, CVV, and OTP)",
            },
            {
              col1: "Mobile Cart Abandonment Rate",
              col2: "< 12% abandonment rate",
              col3: "35% to 50% abandonment due to card OTP failures",
            },
            {
              col1: "Supported UPI Apps",
              col2: "PhonePe, Google Pay, Paytm, Cred, BHIM, Amazon Pay, WhatsApp Pay",
              col3: "Only cards with SMS OTP gateway compatibility",
            },
            {
              col1: "Platform Commission on Sales",
              col2: "0% Commission (Fixed monthly software subscription)",
              col3: "4% to 8% platform fee deducted per ticket sold",
            },
            {
              col1: "Payment Confirmation Speed",
              col2: "Instant webhook acknowledgment triggering QR pass issuance",
              col3: "Frequent 2-step verification timeouts and delayed passes",
            },
            {
              col1: "Bank Settlement Schedule",
              col2: "T+2 rolling business day deposits into your bank",
              col3: "Often held 10–14 days post-event by legacy ticketing portals",
            },
            {
              col1: "GST Tax Invoicing",
              col2: "Automated GSTIN collection and compliant B2B tax PDF receipts",
              col3: "Manual invoice generation required",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Smartphone,
            title: "Native Mobile App Intent",
            desc: "On mobile devices, tapping 'Pay via UPI' launches the attendee's selected app (GPay, PhonePe, Paytm) directly without copying VPA strings.",
          },
          {
            icon: QrCode,
            title: "Dynamic Desktop QR Codes",
            desc: "Desktop visitors see a crisp, secure dynamic QR code on their screen. Scanning with any UPI app completes payment in seconds.",
          },
          {
            icon: CreditCard,
            title: "0% Platform Commission",
            desc: "Keep 100% of your ticket earnings. Pay only standard payment gateway interchange fees without any extra per-ticket platform cuts.",
          },
          {
            icon: Zap,
            title: "Instant QR Pass Issuance",
            desc: "The moment UPI confirms payment via Razorpay webhooks, the attendee's digital QR pass is generated and displayed on screen immediately.",
          },
          {
            icon: Banknote,
            title: "T+2 Direct Bank Deposits",
            desc: "Ticket proceeds settle directly into your Indian bank account on standard T+2 cycles, keeping event operating cash flow healthy.",
          },
          {
            icon: Receipt,
            title: "Automated GST Tax Invoices",
            desc: "Capture corporate attendee GSTIN numbers and automatically issue compliant tax invoices with proper HSN/SAC codes.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Seamless UPI Checkout Designed for India",
          description:
            "From ₹199 student symposium tickets to ₹9,999 VIP conference passes, URPASS makes paying via UPI effortless on any device.",
          type: "passes",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Engineered for Indian UPI Adoption",
          subtitle: "Eliminating checkout friction and transaction failures across the subcontinent.",
          items: [
            {
              title: "Over 80% UPI Preference",
              description:
                "In India, over 80% of digital transactions happen via UPI. URPASS puts UPI front and center for maximum conversion.",
              badge: "UPI First",
            },
            {
              title: "WhatsApp Pass Delivery",
              description:
                "After UPI payment, deliver the digital QR entry pass directly via WhatsApp, where Indian attendees can access it in seconds.",
              badge: "WhatsApp",
            },
            {
              title: "End Fake Payment Screenshots",
              description:
                "Replace manual Google Forms GPay screenshot checks with automated, cryptographic Razorpay webhook verification.",
              badge: "Anti-Fraud",
            },
            {
              title: "Pan-India Bank Support",
              description:
                "Supports all major Indian banks: SBI, HDFC, ICICI, Axis, Kotak, and 50+ regional and cooperative banks via UPI.",
              badge: "Pan-India",
            },
            {
              title: "Direct Merchant KYC",
              description:
                "Funds route through your own verified Razorpay account, ensuring full RBI compliance and transparent banking records.",
              badge: "RBI Compliant",
            },
            {
              title: "Transparent INR Software",
              description:
                "Flat software pricing starting at ₹0 for community events and ₹499/mo for paid events with zero ticket commission.",
              badge: "INR Pricing",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "CHECKOUT CONVERSION",
            title: "Why UPI Intent Slashes Mobile Ticket Abandonment by 70%",
            paragraphs: [
              "When an attendee attempts to buy a ticket on an international or legacy ticketing site on their phone, they are usually confronted with a multi-field credit card form asking for a 16-digit card number, expiration date, CVV, and cardholder name, followed by an SMS OTP verification redirect.",
              "On mobile devices, this multi-step flow has an abandonment rate exceeding 40% due to SMS delivery delays, banking gateway timeouts, and the inconvenience of typing card details in public. With UPI Intent, the attendee simply taps 'PhonePe' or 'Google Pay'. The phone smoothly switches to the banking app, the user enters their 4 or 6-digit MPIN, and the transaction is complete in under 5 seconds.",
            ],
            bullets: [
              "One-tap app switching eliminates manual VPA or card typing",
              "Biometric authentication (fingerprint/face unlock) speeds up payment",
              "Instant webhook confirmation provides pass within 500 milliseconds",
              "Drastically increases mobile ticket sales for college fests and tech summits",
            ],
            takeaway:
              "Offering a native UPI checkout flow dramatically reduces mobile drop-off and significantly boosts gross ticket revenue.",
          },
          {
            badge: "FRAUD DEFENSE",
            title: "Eliminating the Google Forms 'Fake GPay Screenshot' Scam",
            paragraphs: [
              "Thousands of Indian college fests and student workshops collect payments by providing a student coordinator's personal UPI QR code and asking registrants to upload a screenshot of the payment receipt to Google Forms. Scammers exploit this by using screenshot editing apps or online fake UPI receipt generators to alter the date and transaction amount, submitting fake proofs.",
              "Student organizers spend days manually cross-referencing hundreds of bank statement lines against form responses, often discovering missing funds only after the event. URPASS completely eliminates this risk: each transaction is verified server-side through cryptographically signed Razorpay webhooks. A pass is issued only when the bank confirms the funds have been captured.",
            ],
            bullets: [
              "Server-to-server webhook verification stops photoshopped payment screenshots",
              "Unique transaction IDs automatically linked to attendee profiles",
              "Zero manual bank reconciliation required by event treasurers",
              "Automated refunds and dispute handling handled directly through dashboard",
            ],
            takeaway:
              "Automated UPI verification protects event revenues from fraud and saves organizers countless hours of manual accounting.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS UPI Checkout vs. Legacy Ticketing Portals",
          subtitle: "Compare payment methods, mobile checkout speed, commission fees, and settlement.",
          competitorName: "Traditional Portals (Eventbrite / Townscript)",
          sourceCitations: [
            "Official competitor payment method documentation",
            "URPASS benchmark metrics & Razorpay UPI specifications",
          ],
          rows: [
            {
              criteria: "UPI Payment Experience",
              urpass: "Native UPI Intent (PhonePe/GPay) + Dynamic Desktop QR",
              competitor: "Clunky VPA copy-paste or third-party redirect",
              urpassAdvantage: true,
            },
            {
              criteria: "Ticket Sales Commission",
              urpass: "0% Commission (Keep 100% of ticket sales)",
              competitor: "4.0% to 7.9% deducted per ticket sold",
              urpassAdvantage: true,
            },
            {
              criteria: "Buyer Surcharge",
              urpass: "₹0 added convenience fee for ticket buyers",
              competitor: "2% to 4% added to the checkout total",
              urpassAdvantage: true,
            },
            {
              criteria: "Bank Settlement Timing",
              urpass: "Direct T+2 business day settlement via Razorpay",
              competitor: "Held until 7–14 days after event concludes",
              urpassAdvantage: true,
            },
            {
              criteria: "Door QR Check-In Speed",
              urpass: "< 0.3s camera scan on any volunteer phone",
              competitor: "3.5 to 5.0 seconds per ticket",
              urpassAdvantage: true,
            },
            {
              criteria: "GST Tax Invoicing",
              urpass: "Automated GSTIN capture and compliant PDF tax receipts",
              competitor: "Manual invoice creation or non-compliant receipts",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "College Technical Symposiums & Cultural Fests",
          "Inter-College Hackathons & Competitions",
          "Tech Conferences & Developer Summits",
          "Hands-On Masterclasses & Bootcamps",
          "Music Concerts & Live Stand-Up Shows",
          "Founder Meetups & Demo Days",
          "Corporate Product Launches & Annual Meets",
          "Exhibitions & Industry Trade Expos",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing Software India",
            href: "/event-ticketing-software-india",
            category: "Product",
          },
          {
            title: "Event Ticket Payment Gateway (Razorpay)",
            href: "/event-ticket-payment-gateway",
            category: "Guide",
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
            title: "Workshop Event Ticketing Platform",
            href: "/event-ticketing-platform-for-workshops",
            category: "Use Case",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
          {
            title: "Guide: How to Create QR Event Passes",
            href: "/guides/how-to-create-qr-event-pass",
            category: "Guide",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "Which UPI apps are supported for ticket purchases?",
            a: "URPASS supports all standard UPI applications including PhonePe, Google Pay, Paytm, Cred, BHIM, Amazon Pay, and WhatsApp Pay. On mobile devices, attendees can complete payment with a single tap.",
          },
          {
            q: "How does desktop UPI QR payment work?",
            a: "When an attendee checks out on a desktop or laptop, the payment modal generates a dynamic, secure UPI QR code. The attendee simply opens any UPI app on their phone, scans the screen, and authorizes the payment.",
          },
          {
            q: "Are there any per-ticket fees charged by URPASS for UPI transactions?",
            a: "No! URPASS charges 0% commission on ticket sales. You only pay our flat monthly subscription (from ₹499/mo) and standard payment gateway fees from Razorpay (~2% for UPI and cards).",
          },
          {
            q: "How quickly are funds deposited into my bank account?",
            a: "Payments are processed through your linked Razorpay account and settle directly into your Indian bank account on standard T+2 business day schedules, keeping your event cash flow healthy.",
          },
          {
            q: "How do attendees receive their ticket pass after completing UPI payment?",
            a: "The instant the payment is confirmed, the checkout screen redirects to the attendee's personalized digital QR pass. The pass link is also sent via email and WhatsApp for effortless gate check-in.",
          },
          {
            q: "Can I collect custom registration questions along with the UPI payment?",
            a: "Yes! In your event registration settings, you can add custom questions for College Name, Roll Number, T-shirt Size, or Company GSTIN before the attendee proceeds to UPI checkout.",
          },
        ],

        ctaTitle: "Sell event tickets with instant UPI",
        ctaDescription:
          "PhonePe & GPay checkout · 0% commission · Direct T+2 bank deposits · Sub-second phone scanning",
      }}
    />
  );
}
