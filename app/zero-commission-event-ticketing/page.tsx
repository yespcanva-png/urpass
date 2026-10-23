import type { Metadata } from "next";
import { BarChart3, CreditCard, QrCode, ScanLine, ShieldCheck, Users } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "0% Commission Event Ticketing | UrPass",
  description: "Sell paid event tickets with 0% UrPass platform commission. Connect Razorpay, collect attendee registrations and manage QR ticket entry.",
  keywords: ["zero commission event ticketing","0% commission event ticketing","sell event tickets without platform commission","no fee event ticketing","flat rate event ticketing software","event ticketing without commission"],
  alternates: {
    canonical: "https://urpass.space/zero-commission-event-ticketing",
  },
  openGraph: {
    title: "0% Commission Event Ticketing | UrPass",
    description: "Sell paid event tickets with 0% UrPass platform commission. Connect Razorpay, collect attendee registrations and manage QR ticket entry.",
    url: "https://urpass.space/zero-commission-event-ticketing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "0% Commission Event Ticketing | UrPass",
    description: "Sell paid event tickets with 0% UrPass platform commission. Connect Razorpay, collect attendee registrations and manage QR ticket entry.",
  },
};

export default function ZeroCommissionEventTicketingPage() {
  return (
    <SEOPage
      config={{
        badge: "0% TICKETING COMMISSION",
        h1: "Sell Event Tickets Without Platform Commission",
        canonicalUrl: "https://urpass.space/zero-commission-event-ticketing",
        description: "Sell paid event tickets with 0% UrPass platform commission. Connect Razorpay, collect attendee registrations and manage QR ticket entry.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=zero-commission-event-ticketing",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Retain 100% of Your Ticket Revenue",
        ctaDescription: "Stop surrendering 5% to 10% of your gross ticket sales. Connect your own payment gateway and pay flat, predictable subscription pricing.",
        directAnswer: {
        "title": "What is Zero-Commission Event Ticketing?",
        "summary": "Zero-commission event ticketing is a ticketing model where the software provider charges zero percentage cuts on ticket sales. Instead of surrendering 5% to 10% of revenue to aggregators, organizers connect direct gateways like Razorpay or Stripe to receive 100% of ticket sales directly into their own bank accounts.",
        "keyPoints": [
                "0% platform commission on all paid ticket sales",
                "Direct bank settlements via your own Razorpay or Stripe gateway",
                "Automatic digital QR pass generation and instant multi-channel delivery",
                "Predictable flat subscription model starting with introductory ₹499/mo offer"
        ]
},
        whatIs: {
        "title": "How UrPass Delivers 0% Commission Ticketing",
        "definition": "UrPass replaces predatory percentage-based ticketing aggregator models with a modern SaaS subscription. Organizers pay a predictable flat subscription starting from ₹499/mo (introductory offer) or £15/mo in the UK, connect their merchant gateway, and keep every rupee or pound of ticket revenue minus standard payment processor interchange fees.",
        "details": [
                "Saves event producers thousands in variable ticketing aggregator cuts",
                "Eliminates multi-week payout holds by settling ticket revenue directly to your merchant account",
                "Provides 100% attendee data ownership with zero third-party ads on checkout pages",
                "Includes full QR gate check-in scanners and visual badge designer at no extra cost"
        ]
},
        keyFactsTable: {
        "title": "Financial Comparison: Aggregators vs UrPass 0% Commission",
        "subtitle": "See how much revenue you retain across different event ticket volumes.",
        "headers": [
                "Ticket Revenue",
                "Aggregators (5% to 8% Fee)",
                "UrPass (0% Commission)"
        ],
        "rows": [
                {
                        "col1": "₹1,00,000 (100 tickets @ ₹1,000)",
                        "col2": "₹6,000 to ₹8,000 lost to platform fees",
                        "col3": "0% commission; plans from ₹499/mo"
                },
                {
                        "col1": "₹5,00,000 (500 tickets @ ₹1,000)",
                        "col2": "₹30,000 to ₹40,000 lost to platform fees",
                        "col3": "₹0 commission; full revenue retained"
                },
                {
                        "col1": "₹25,00,000 (2,500 tickets @ ₹1,000)",
                        "col2": "₹1,50,000 to ₹2,00,000 lost to platform fees",
                        "col3": "₹0 commission; direct bank deposits"
                },
                {
                        "col1": "Payout Schedule",
                        "col2": "Platform holds your money until weeks after the event",
                        "col3": "Direct settlement to your bank account via Razorpay/Stripe"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "CASH FLOW",
                "title": "Immediate Bank Deposits Instead of Delayed Payouts",
                "paragraphs": [
                        "Traditional ticketing portals operate as financial intermediaries: they collect your attendees' money into their own accounts, hold the funds for weeks or months to earn float, and only release payouts after your event has successfully concluded.",
                        "This model is devastating for event organizers who need immediate cash flow to pay venue booking advances, sound system vendors, and keynote speakers. With UrPass, you connect your own merchant account directly. Every ticket purchase settles straight into your bank on standard payment gateway cycles (T+2)."
                ],
                "bullets": [
                        "No platform escrow or delayed post-event payout terms",
                        "Direct settlement to your business or institutional bank account",
                        "Real-time revenue telemetry and downloadable sales ledgers",
                        "Transparent accounting with automated attendee GST tax receipts"
                ],
                "takeaway": "Direct gateway settlement gives you full financial control and immediate operational liquidity."
        },
        {
                "badge": "BRAND INTEGRITY",
                "title": "White-Label Ticketing with Zero Competitor Ads",
                "paragraphs": [
                        "When you send potential attendees to ticketing aggregators, your checkout page is cluttered with competing event recommendations, external ads, and aggregator branding. Many organizers inadvertently drive their own audience to rival events.",
                        "UrPass provides clean, white-label event registration pages. Your ticket page showcases your event branding, schedule, speaker bios, and sponsor logos without any third-party ads or platform cross-promotions."
                ],
                "bullets": [
                        "Clean corporate aesthetics with your logos and brand palette",
                        "Zero third-party advertisement banners or sponsored event links",
                        "Full attendee privacy: attendee contact info is never shared or remarketed",
                        "Custom subdomain and link sharing for seamless social media campaigns"
                ],
                "takeaway": "Retain 100% of your audience's attention on your own event brand."
        }
],
        featuresTitle: "Core Capabilities Built for Event Organizers",
        featuresSubtitle: "Engineered for speed, reliability, and zero ticketing commission.",
        features: [
          {
            icon: CreditCard,
            title: "0% Commission on Tickets",
            desc: "Keep 100% of your gross ticket revenue. No per-ticket platform cuts or percentage deductions.",
          },
          {
            icon: ShieldCheck,
            title: "Direct Gateway Settlement",
            desc: "Connect Razorpay or Stripe to receive ticket funds directly into your verified bank account.",
          },
          {
            icon: QrCode,
            title: "Instant QR Pass Generation",
            desc: "Automated issuance of secure, encrypted digital QR passes immediately upon checkout completion.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Camera Check-In",
            desc: "Scan and validate attendee passes at the door using any volunteer smartphone browser.",
          },
          {
            icon: Users,
            title: "100% Attendee Data Ownership",
            desc: "Export complete attendee lists, custom question answers, and contact info anytime.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Sales Dashboard",
            desc: "Track sales velocity, tier capacity, and gross revenue live from your organizer control room.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Set Up Your Event",
                "desc": "Create your event page and specify ticket tiers, early-bird pricing, and capacities."
        },
        {
                "n": "02",
                "title": "Link Payment Gateway",
                "desc": "Connect your Razorpay or Stripe account in one click."
        },
        {
                "n": "03",
                "title": "Share Ticket Link",
                "desc": "Publish your high-converting, ad-free ticketing page across social media and email."
        },
        {
                "n": "04",
                "title": "Collect Direct Payments",
                "desc": "Attendees pay via UPI, cards, or net banking, with funds depositing directly to your bank."
        },
        {
                "n": "05",
                "title": "Scan Attendees at Gates",
                "desc": "Use volunteer smartphones to validate passes in <0.3s on event day."
        }
],
        whoShouldUse: {
        "title": "Who Needs Zero-Commission Event Ticketing?",
        "subtitle": "Any organizer who wants to keep their ticket revenue and control their finances.",
        "personas": [
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Conferences & Summits",
                        "desc": "Save tens of thousands in aggregator fees on high-ticket delegate passes and issue automatic tax invoices."
                },
                {
                        "badge": "COLLEGES",
                        "title": "College Fests & Student Clubs",
                        "desc": "Retain 100% of student ticket revenue for campus activities instead of paying commercial platform fees."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Professional Masterclasses",
                        "desc": "Sell workshop seats directly and verify enrolled participants at the door in seconds."
                },
                {
                        "badge": "FESTIVALS",
                        "title": "Music Festivals & Nightlife",
                        "desc": "Sell thousands of tickets with zero per-ticket cuts and clear entrance gates rapidly with smartphone scanners."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Check-In Operates on Zero-Commission Ticketing",
        "subtitle": "Complete gate control included with your subscription.",
        "description": "Unlike platforms that force you to rent proprietary handheld barcode scanners, UrPass includes our high-speed mobile browser scanner at zero additional cost. Point any smartphone camera at attendee digital passes to validate entries in under 0.3 seconds.",
        "points": [
                "Volunteers scan passes on personal Android or iPhone devices.",
                "Atomic duplicate blocking catches screenshot sharing across multiple gates.",
                "Audible audio chimes confirm entry in loud venue environments.",
                "Complete timestamped audit trail exported to CSV after the event."
        ]
},
        faqs: [
        {
                "q": "Does UrPass really charge 0% commission on ticket sales?",
                "a": "Yes. UrPass charges zero percentage fees on your ticket revenue. You pay only our transparent subscription (starting with our plans starting from ₹499/mo in India or £15/mo in the UK) and standard payment processing fees directly to Razorpay or Stripe."
        },
        {
                "q": "When do I receive my ticket money?",
                "a": "Because you connect your own merchant account (such as Razorpay in India or Stripe in the UK), your ticket funds deposit directly into your bank account on standard merchant settlement schedules (typically T+2 business days)."
        },
        {
                "q": "What payment methods can my attendees use?",
                "a": "In India, attendees can pay with instant UPI apps (Google Pay, PhonePe, Paytm, Cred), debit/credit cards, and net banking. Internationally, attendees can pay with Visa, Mastercard, American Express, Apple Pay, and Google Pay."
        },
        {
                "q": "Can I sell both free and paid tickets for the same event?",
                "a": "Yes. You can configure multiple ticket tiers including free registration passes, early bird tickets, standard admission, and VIP packages within the same event registration form."
        },
        {
                "q": "Are there any limits on the number of tickets I can sell?",
                "a": "UrPass plans include generous attendee and ticket allowances tailored to your event scale. Check our pricing page for exact plan limits and upgrades."
        }
],
      }}
    />
  );
}
