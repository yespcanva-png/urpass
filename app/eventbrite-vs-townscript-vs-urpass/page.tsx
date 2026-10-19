import type { Metadata } from "next";
import { CreditCard, QrCode, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Eventbrite vs Townscript vs UrPass",
  description: "Compare Eventbrite, Townscript and UrPass on ticketing fees, payment options, attendee registration and QR entry management.",
  keywords: ["eventbrite vs townscript vs urpass","eventbrite alternative india","townscript alternative","best event ticketing platform india","eventbrite vs townscript","lowest fee ticketing platform"],
  alternates: {
    canonical: "https://urpass.space/eventbrite-vs-townscript-vs-urpass",
  },
  openGraph: {
    title: "Eventbrite vs Townscript vs UrPass",
    description: "Compare Eventbrite, Townscript and UrPass on ticketing fees, payment options, attendee registration and QR entry management.",
    url: "https://urpass.space/eventbrite-vs-townscript-vs-urpass",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventbrite vs Townscript vs UrPass",
    description: "Compare Eventbrite, Townscript and UrPass on ticketing fees, payment options, attendee registration and QR entry management.",
  },
};

export default function EventbriteVsTownscriptVsUrpassPage() {
  return (
    <SEOPage
      config={{
        badge: "TICKETING COMPARISON",
        h1: "Eventbrite vs Townscript vs UrPass: Which Fits Your Event?",
        canonicalUrl: "https://urpass.space/eventbrite-vs-townscript-vs-urpass",
        description: "Compare Eventbrite, Townscript and UrPass on ticketing fees, payment options, attendee registration and QR entry management.",
        ctaLabel: "Create Your Event",
        ctaHref: "/signup?from=eventbrite-vs-townscript-vs-urpass",
        secondaryCtaLabel: "View Pricing",
        secondaryCtaHref: "/pricing",
        ctaTitle: "Stop Paying 5% to 10% on Every Ticket Sale",
        ctaDescription: "Switch to 0% platform ticket commission, direct bank settlements via Razorpay or Stripe, and sub-second phone scanning.",
        directAnswer: {
        "title": "Eventbrite vs Townscript vs UrPass: Quick Comparison",
        "summary": "Comparing Eventbrite, Townscript, and UrPass: Eventbrite charges high percentage fees (3.7% + per-ticket fees) and delays payouts until weeks after your event. Townscript deducts up to 5-7% per ticket on Indian events. UrPass charges 0% platform ticket commission, lets organizers connect their own Razorpay or Stripe accounts for immediate payouts, and provides sub-second smartphone check-in.",
        "keyPoints": [
                "UrPass charges 0% platform ticket commission vs Eventbrite (up to 3.7% + fees) and Townscript (up to 5-7%)",
                "Direct payment settlement to your bank via Razorpay/Stripe vs aggregator payout delays",
                "Sub-0.3s smartphone camera scanner with atomic duplicate blocking vs slow manual check-in apps",
                "100% white-label checkout with zero competitor ads or event cross-promotions"
        ]
},
        whatIs: {
        "title": "Understanding the Business Models: Aggregators vs UrPass SaaS",
        "definition": "Eventbrite and Townscript operate as ticketing aggregators and marketplace directories: they take a percentage cut of every ticket sold, hold your revenue until after the event, and place ads for competitor events on your checkout page. UrPass operates on a modern SaaS model: you pay a flat, predictable subscription, connect your own payment gateway, and keep 100% of your ticket sales.",
        "details": [
                "Ticketing aggregators act as financial middlemen, creating cash flow delays for organizers",
                "UrPass connects directly to your merchant gateway (Razorpay / Stripe) for instant T+2 bank deposits",
                "Aggregators promote rival events to your ticket buyers during and after checkout",
                "UrPass provides 100% white-label registration pages focused solely on your event brand"
        ]
},
        keyFactsTable: {
        "title": "Three-Way Feature Matrix: Eventbrite vs Townscript vs UrPass",
        "subtitle": "Factual comparison across fee structures, payouts, and entrance gate operations.",
        "headers": [
                "Ticketing Dimension",
                "Aggregators (Eventbrite / Townscript)",
                "UrPass Platform"
        ],
        "rows": [
                {
                        "col1": "Platform Ticketing Fee",
                        "col2": "3.7% to 7% deducted per ticket sale",
                        "col3": "0% platform ticket fee; flat subscription"
                },
                {
                        "col1": "Payout Timing",
                        "col2": "Delayed payouts held until days/weeks post-event",
                        "col3": "Direct settlement to your bank via Razorpay/Stripe (T+2)"
                },
                {
                        "col1": "Competitor Ads on Checkout",
                        "col2": "Yes; suggests rival events on confirmation pages",
                        "col3": "No; 100% ad-free white-label registration"
                },
                {
                        "col1": "Entrance Gate Scan Speed",
                        "col2": "0.8s - 2.0s per attendee via native mobile apps",
                        "col3": "Sub-0.3s camera check-in via standard phone browsers"
                }
        ]
},
        deepDiveSections: [
        {
                "badge": "FEE ANALYSIS",
                "title": "The Math of Ticketing Fees: How Much Do You Actually Keep?",
                "paragraphs": [
                        "Ticketing aggregator percentage cuts sound modest until calculated on total event revenue. On an event generating ₹10,00,000 (£10,000) in ticket sales, an aggregator taking 6% to 8% deducts ₹60,000 to ₹80,000 (£600 to £800) straight from your profit margin.",
                        "With UrPass, you pay zero platform ticket commission. You pay only our transparent monthly subscription (starting from ₹29/mo intro offer / £15/mo in UK) and standard payment processor interchange fees directly to Razorpay or Stripe. You retain tens of thousands in profit that would otherwise be lost to aggregators."
                ],
                "bullets": [
                        "Save 5% to 8% of your gross ticket revenue on every paid event",
                        "No per-ticket attendee surcharges that artificially inflate ticket prices",
                        "Transparent accounting: ticket proceeds deposit directly into your business bank account",
                        "Predictable software budgeting with zero variable commission penalties"
                ],
                "takeaway": "Eliminating platform ticket commissions allows organizers to reinvest revenue into their event."
        },
        {
                "badge": "GATE PERFORMANCE",
                "title": "Entrance Scanning & Anti-Fraud Comparison",
                "paragraphs": [
                        "Both Eventbrite and Townscript provide mobile organizer apps for gate scanning, but both suffer from common operational limitations: volunteer staff must download dedicated native apps, log in with organizer credentials, and deal with frequent synchronization lags across multiple doors.",
                        "UrPass provides browser-based camera scanning. Door staff scan an organizer QR code to launch the scanner in Safari or Chrome in 10 seconds. WebAssembly decoding validates passes in under 300 milliseconds, while atomic row locking eliminates ticket screenshot sharing across gates."
                ],
                "bullets": [
                        "Zero app downloads: volunteers scan passes directly in mobile Safari and Chrome",
                        "Sub-0.3s validation speed clears 1,000 attendees in approximately 15 minutes",
                        "Atomic row locking catches duplicate passes across all doors within 150ms",
                        "Real-time gate telemetry reveals arrival flow and crowd velocity live"
                ],
                "takeaway": "High-speed browser scanning eliminates entrance bottlenecks and rental hardware costs."
        }
],
        featuresTitle: "Key Comparison Advantages",
        featuresSubtitle: "Honest architectural comparisons built for discerning organizers.",
        features: [
          {
            icon: CreditCard,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your ticket price. No percentage deductions or per-ticket aggregator surcharges.",
          },
          {
            icon: Zap,
            title: "Direct Gateway Payouts",
            desc: "Connect Razorpay or Stripe to receive ticket funds directly on rolling T+2 bank cycles.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Phone Scanning",
            desc: "Turn volunteer smartphones into instant entrance scanners with zero mobile app downloads.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Duplicate Blocking",
            desc: "Prevent ticket screenshot sharing across multiple entrance doors with database-level row locks.",
          },
          {
            icon: QrCode,
            title: "Branded Digital Passes",
            desc: "Design professional passes across 12 templates with Ticket Studio and Apple Wallet integration.",
          },
          {
            icon: Users,
            title: "100% Attendee Ownership",
            desc: "Export complete attendee records anytime with zero competitor ads or cross-promotions.",
          }
        ],
        steps: [
        {
                "n": "01",
                "title": "Create Your Event",
                "desc": "Configure event details, ticket tiers, capacity caps, and custom registration fields."
        },
        {
                "n": "02",
                "title": "Connect Direct Gateway",
                "desc": "Link Razorpay or Stripe to receive ticket proceeds directly into your verified bank."
        },
        {
                "n": "03",
                "title": "Publish Ticket Page",
                "desc": "Share your high-converting, ad-free ticketing page across social media and email."
        },
        {
                "n": "04",
                "title": "Collect Direct Payments",
                "desc": "Attendees pay via UPI, cards, or net banking with immediate digital pass delivery."
        },
        {
                "n": "05",
                "title": "Scan at the Entrance",
                "desc": "Door staff scan passes with phone cameras in <0.3s on event day for rapid entry."
        }
],
        whoShouldUse: {
        "title": "Which Platform Fits Your Event?",
        "subtitle": "Choose the platform that aligns with your financial and operational goals.",
        "personas": [
                {
                        "badge": "URPASS BEST FIT",
                        "title": "Organizers Driving Their Own Audience",
                        "desc": "If you market your own event, UrPass gives you 0% ticket fees, direct bank payouts, and fast phone scanning."
                },
                {
                        "badge": "COLLEGES",
                        "title": "College Fests & Student Clubs",
                        "desc": "Retain 100% of ticket revenue for student activities instead of surrendering cuts to aggregators."
                },
                {
                        "badge": "CONFERENCES",
                        "title": "B2B Conferences & Summits",
                        "desc": "Collect high-ticket delegate fees with corporate tax invoices and executive Apple Wallet badges."
                },
                {
                        "badge": "WORKSHOPS",
                        "title": "Independent Creators & Trainers",
                        "desc": "Sell masterclasses directly with instant UPI checkout and automated calendar invites."
                }
        ]
},
        howQrCheckInWorks: {
        "title": "How Gate Check-In Compares Across Platforms",
        "subtitle": "Sub-second validation engineered for rapid queue clearing.",
        "description": "Unlike Eventbrite and Townscript where gate staff must download native apps and log into master accounts, UrPass turns any smartphone browser into a secure scanner. Staff scan an organizer setup QR code to activate the scanner, validating attendee passes in under 300 milliseconds.",
        "points": [
                "Volunteers scan on personal phones with zero app downloads or account logins.",
                "Audible green chime confirms valid admission in noisy venue environments.",
                "Atomic database row locking prevents pass reuse across multiple entrance doors.",
                "Quick manual search allows backup check-in if an attendee phone is uncharged."
        ]
},
        faqs: [
        {
                "q": "What is the primary difference between UrPass and Eventbrite or Townscript?",
                "a": "Eventbrite and Townscript are ticketing aggregators that charge 5% to 10% in platform fees, hold ticket revenues until after the event, and advertise competitor events. UrPass is a SaaS ticketing platform charging 0% ticket commission, settling funds directly into your bank via Razorpay or Stripe, and providing sub-0.3s smartphone check-in."
        },
        {
                "q": "When do I get paid for ticket sales on UrPass?",
                "a": "Because you connect your own verified merchant account (Razorpay in India or Stripe in the UK/US), your ticket funds deposit directly into your bank account on standard merchant settlement schedules (typically T+2 business days)."
        },
        {
                "q": "Can attendees pay using Indian UPI apps like Google Pay and PhonePe?",
                "a": "Yes. In India, UrPass connects with Razorpay to provide native support for all UPI apps (Google Pay, PhonePe, Paytm, Cred, BHIM), debit/credit cards, and net banking."
        },
        {
                "q": "Do volunteer scanners need to download an app from Google Play or the App Store?",
                "a": "No. The UrPass scanner operates entirely within modern mobile web browsers such as Apple Safari and Google Chrome. Volunteers simply scan an organizer QR code to activate the scanner immediately."
        },
        {
                "q": "How much does UrPass cost?",
                "a": "UrPass offers an introductory offer of ₹29/month for your first 2 months in India (£15/month in the UK) with 0% platform ticket commissions. Pay-as-you-go single-event options start at ₹299 (UK: £5)."
        }
],
      }}
    />
  );
}
