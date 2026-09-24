import type { Metadata } from "next";
import {
  MapPin,
  QrCode,
  Users,
  ScanLine,
  Ticket,
  BarChart3,
  CreditCard,
  ShieldCheck,
  Zap,
  Smartphone,
  CheckCircle2,
  Building2,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Platform for India — URPASS",
  description:
    "India-focused digital event registration, QR pass and check-in platform for colleges, conferences, hackathons, workshops and corporate events. Instant UPI payments, 0% commission, and phone camera check-in.",
  keywords: [
    "event registration software India",
    "QR event check-in India",
    "event ticketing platform India",
    "Razorpay event ticketing",
    "college event passes India",
    "digital ticket generator India",
    "event attendance tracking India",
    "UPI event ticketing",
  ],
  alternates: { canonical: "https://urpass.space/in" },
  openGraph: {
    title: "Event Registration & QR Check-In Platform for India | URPASS",
    description:
      "India's event registration, QR pass and check-in platform. Instant UPI payments, zero ticket commission, and sub-second phone scanning.",
    url: "https://urpass.space/in",
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

export default function IndiaPage() {
  return (
    <SEOPage
      config={{
        badge: "URPASS INDIA",
        h1: "Digital Event Registration, QR Pass & Check-In Platform for India",
        canonicalUrl: "https://urpass.space/in",
        geo: {
          region: "IN",
          placename: "India",
          position: "20.5937;78.9629",
          latitude: 20.5937,
          longitude: 78.9629,
        },
        description:
          "An India-focused digital event registration, QR pass and check-in platform for colleges, conferences, hackathons, workshops and corporate events across India with native INR pricing, UPI payments, and zero ticket commission.",
        ctaLabel: "Start free in India",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "Why Choose URPASS for Indian Events?",
          summary:
            "URPASS is an India-focused digital event registration, QR pass and check-in platform engineered for colleges, conferences, hackathons, workshops and corporate events across India. Built natively for the Indian ecosystem, URPASS provides zero-commission ticketing, direct Razorpay integration with instant UPI QR checkout (PhonePe, GPay, Paytm), automated GST tax invoices, WhatsApp pass distribution, and sub-second phone camera check-in at venue gates.",
          keyPoints: [
            "0% commission on ticket sales — keep 100% of your ticket price",
            "Instant UPI payments (PhonePe, Google Pay, Paytm) with direct T+2 bank deposits",
            "Automated GST-compliant invoices with HSN/SAC codes for business delegates",
            "In-browser smartphone QR scanner (<0.3s) with audio chimes and haptic feedback",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "India Event Infrastructure & Commercial Specifications",
          subtitle: "How URPASS is specifically optimized for Indian payment gateways, regulatory compliance, and venue operations.",
          headers: ["Capability / Feature", "URPASS Specification", "Global Legacy Platforms (Eventbrite / etc.)"],
          rows: [
            {
              col1: "Platform Commission on Tickets",
              col2: "0% (Flat subscription starting at ₹499/mo)",
              col3: "3.7% to 8% per ticket sold + fixed fees",
            },
            {
              col1: "Payment Methods Supported",
              col2: "Instant UPI QR, PhonePe, GPay, Paytm, RuPay, Net Banking",
              col3: "Predominantly international credit cards; clunky UPI redirects",
            },
            {
              col1: "Fund Settlement Schedule",
              col2: "Direct T+2 business day settlement via linked Razorpay",
              col3: "Held until 5–14 days after the event concludes",
            },
            {
              col1: "Tax Compliance & GST",
              col2: "Automated GSTIN capture and compliant B2B tax invoices",
              col3: "Foreign billing entities; no Indian GST tax credits",
            },
            {
              col1: "Gate Check-In Speed",
              col2: "< 0.3s on volunteer smartphones (Safari/Chrome)",
              col3: "3.5 to 6s per ticket; requires app store downloads",
            },
            {
              col1: "Pass Delivery",
              col2: "Mobile web pass + instant WhatsApp notification",
              col3: "Email attachments only (often lost in spam/promotions)",
            },
            {
              col1: "Free Community Tier",
              col2: "₹0 forever for 2 events/mo & 100 registrations/mo",
              col3: "Strict attendee limits or mandatory paid plan",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: CreditCard,
            title: "0% Commission UPI Ticketing",
            desc: "Sell paid tickets directly through your connected Razorpay account. No 5-8% platform cut deducted from your ticket earnings.",
          },
          {
            icon: QrCode,
            title: "Branded Digital QR Passes",
            desc: "Design passes in Ticket Studio across Digital (380x680), Printable (780x340), and Lanyard Badge (440x640) formats.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Phone Gate Scanner",
            desc: "Volunteers open a PIN link in mobile Safari or Chrome. Instant green chime and haptic buzz validate attendees in <0.3s.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Anti-Duplicate Protection",
            desc: "Database-level row locks ensure shared screenshots or forwarded passes cannot be used twice across any entrance gate.",
          },
          {
            icon: Users,
            title: "College & Corporate Screening",
            desc: "Collect college IDs, roll numbers, or company GSTINs with customizable registration forms and 1-click approval queues.",
          },
          {
            icon: BarChart3,
            title: "Live Multi-City Analytics",
            desc: "Track real-time check-in velocity, gate bottlenecks, attendance percentages, and registration spikes from any browser.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "REAL PRODUCT PROOF",
          title: "Tested Across High-Velocity Indian Venues",
          description:
            "From college auditoriums in Chennai and tech summits in Bengaluru to corporate workshops in Mumbai, URPASS ensures smooth gate flow.",
          type: "ticket-studio",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Engineered for India's Rapid Event Landscape",
          subtitle: "Frictionless checkout, transparent INR pricing, and compliance with Indian commercial norms.",
          items: [
            {
              title: "Instant UPI QR Checkout",
              description:
                "Attendees pay in 5 seconds directly on mobile via PhonePe, Google Pay, Paytm, or Cred, drastically reducing drop-offs.",
              badge: "UPI 2.0",
            },
            {
              title: "T+2 Direct Bank Settlements",
              description:
                "Funds deposit directly into your Indian bank account on standard T+2 cycles, keeping event cash flow healthy.",
              badge: "Cashflow",
            },
            {
              title: "Automated GST Invoicing",
              description:
                "Generate automated tax invoices with your GSTIN and HSN/SAC codes for B2B conference delegates claiming input tax credit.",
              badge: "Compliance",
            },
            {
              title: "Spotty Venue Network Buffer",
              description:
                "Auditorium basements and outdoor festival grounds often drop signal. Offline IndexedDB mode ensures entry never stops.",
              badge: "Offline Ready",
            },
            {
              title: "College Fest Multi-Gate Setup",
              description:
                "Deploy 10 volunteer smartphones simultaneously across North, South, and VIP gates with instant anti-duplicate protection.",
              badge: "Campus Ready",
            },
            {
              title: "Transparent INR Pricing",
              description:
                "Flat monthly subscriptions from ₹499/mo with zero per-ticket commissions, plus a ₹0 free forever tier for community meetups.",
              badge: "Transparent INR",
            },
          ],
        },

        // 10-Point Standard: Deep Useful Content
        deepDiveSections: [
          {
            badge: "COMMISSION-FREE TICKETING",
            title: "Why Indian Organizers are Ditching 8% Ticketing Commissions",
            paragraphs: [
              "For years, event organizers in India were forced to use legacy ticketing aggregators that charge 4% to 8% platform commissions plus extra 2% to 4% 'convenience fees' tagged onto the ticket buyer. For a tech conference, workshop series, or college cultural fest generating ₹5,00,000 to ₹25,00,000 in revenue, organizers lose between ₹35,000 and ₹2,00,000 just in ticketing fees.",
              "URPASS disrupts this outdated model with flat, predictable software pricing. Organizers connect their own Razorpay account, collect payments directly via UPI and cards, and pay 0% platform commission on ticket volume. You keep 100% of your earnings, and ticket buyers pay exactly the listed ticket price with no hidden surcharges.",
            ],
            bullets: [
              "0% ticketing commission across all plans",
              "Zero surprise convenience fees for attendees",
              "Direct merchant settlements (T+2) directly into your bank",
              "Full ownership of your attendee contact database",
            ],
            takeaway:
              "Eliminating ticket commissions allows organizers to reinvest tens of thousands of rupees directly back into better production, speakers, and venue facilities.",
          },
          {
            badge: "CAMPUS & FEST OPERATIONS",
            title: "High-Volume Gate Check-In for College Fests & Hackathons",
            paragraphs: [
              "College fests and technical symposiums face unique logistical hurdles: thousands of students arrive simultaneously within a 30-minute window, volunteer staff rotates hourly, and cellular networks get congested. Traditional paper printouts or complex mobile apps create massive lines outside the campus gates.",
              "URPASS simplifies gate operations to a single secure URL. Student volunteers scan a QR setup code with their phone cameras to launch the scanner in Safari or Chrome. passes are validated in under 0.3 seconds with distinct audio and haptic feedback. Even if campus WiFi slows to a crawl, URPASS offline mode caches check-ins and synchronizes atomically when reconnected.",
            ],
            bullets: [
              "No volunteer app store downloads or password logins",
              "Sub-second verification (<0.3s) keeps campus queues moving",
              "High chime for entry approval; double low tone for duplicate passes",
              "Multi-gate synchronization blocks cross-entrance pass sharing",
            ],
            takeaway:
              "Fast gate technology transforms chaotic fest entrances into professional, secure access points that leave a stellar first impression.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS vs. Traditional Ticketing Portals in India",
          subtitle: "Compare ticketing commissions, UPI checkout speeds, pass customization, and hardware requirements.",
          competitorName: "Legacy Ticketing Aggregators",
          sourceCitations: [
            "Official competitor commercial schedules in India",
            "URPASS live plan specifications (lib/plan.ts)",
          ],
          rows: [
            {
              criteria: "Ticket Sales Commission",
              urpass: "0% Commission (Keep 100% of ticket sales)",
              competitor: "4% to 8% commission per ticket sold",
              urpassAdvantage: true,
            },
            {
              criteria: "Buyer Surcharge / Convenience Fee",
              urpass: "₹0 (Attendees pay exact face value)",
              competitor: "2% to 4% extra charged to buyer",
              urpassAdvantage: true,
            },
            {
              criteria: "Payout Settlement Timing",
              urpass: "Direct T+2 bank deposits via Razorpay",
              competitor: "Held until after event completion",
              urpassAdvantage: true,
            },
            {
              criteria: "Pass Visual Design & Studio",
              urpass: "Ticket Studio (12 customizable templates, dynamic tokens)",
              competitor: "Generic black-and-white ticket receipt",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Scanner Hardware",
              urpass: "Any smartphone browser (no app download)",
              competitor: "App download required or expensive laser guns",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Forever Tier",
              urpass: "₹0 for 2 events/mo & 100 registrations/mo",
              competitor: "Zero free events or heavy restrictions",
              urpassAdvantage: true,
            },
          ],
        },

        // Event-Specific Use Cases
        useCases: [
          "College Fests & Culturals — Chennai & Coimbatore",
          "Tech Conferences & Summits — Bengaluru & Hyderabad",
          "Inter-College Hackathons — Pune & Delhi NCR",
          "Hands-On Masterclasses & Bootcamps — Mumbai",
          "Startup Meetups & Demo Days — Kochi & Ahmedabad",
          "Music Concerts & Cultural Fests — Kolkata",
          "Corporate Townhalls & Product Summits — Pan-India",
          "Exhibitions & Industry Trade Expos — All India",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing Software",
            href: "/event-ticketing-software",
            category: "Product",
          },
          {
            title: "QR Ticketing System & Check-In",
            href: "/qr-ticketing-system",
            category: "Product",
          },
          {
            title: "Event Registration Software",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "Event Ticketing with UPI",
            href: "/event-ticketing-with-upi",
            category: "Product",
          },
          {
            title: "Event Ticket Payment Gateway (Razorpay)",
            href: "/event-ticket-payment-gateway",
            category: "Guide",
          },
          {
            title: "Compare: Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
          {
            title: "Compare: Zoho Backstage Alternative India",
            href: "/compare/zoho-backstage-alternative-india",
            category: "Comparison",
          },
          {
            title: "Event Registration Bengaluru",
            href: "/in/bangalore",
            category: "Location",
          },
          {
            title: "Event Registration Chennai",
            href: "/in/chennai",
            category: "Location",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "Is URPASS an Indian event management platform?",
            a: "Yes. URPASS is an India-focused digital event registration, QR pass and check-in platform for colleges, conferences, hackathons, workshops and corporate events across India with native INR pricing, Razorpay UPI payments, and zero ticket commissions.",
          },
          {
            q: "What payment methods does URPASS support in India?",
            a: "URPASS integrates directly with Razorpay, supporting instant UPI (Google Pay, PhonePe, Paytm, BHIM), debit and credit cards (Visa, Mastercard, RuPay), net banking across 50+ Indian banks, and mobile wallets.",
          },
          {
            q: "How does 0% commission work on paid tickets?",
            a: "Unlike legacy platforms that deduct 5% to 8% of your ticket revenue, URPASS operates on a transparent monthly software subscription starting at ₹499/mo. You connect your own Razorpay account, and 100% of ticket sales settle directly into your bank account.",
          },
          {
            q: "Is there a free tier for Indian colleges and meetups?",
            a: "Yes. The URPASS Free tier allows you to host up to 2 events per month with up to 100 registrations per month at ₹0 forever with no credit card required. Paid plans also come with a 30-day free trial.",
          },
          {
            q: "How do volunteers scan passes at the entrance?",
            a: "Volunteers do not need to install an app or create an account. The organizer provides a secure PIN scanner link that opens in mobile Safari or Chrome. Passes are validated in under 0.3 seconds with distinct confirmation audio and vibration cues.",
          },
          {
            q: "Can I generate GST tax invoices for business attendees?",
            a: "Yes. You can capture attendee GSTINs during registration or ticket checkout and automatically generate compliant tax receipts containing your organization's GST details and proper SAC codes.",
          },
        ],

        ctaTitle: "Start your event in India today",
        ctaDescription:
          "₹0 to start · Instant UPI payments · 0% ticket commission · Built for Indian events",
      }}
    />
  );
}
