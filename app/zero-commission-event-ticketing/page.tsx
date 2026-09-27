import type { Metadata } from "next";
import {
  Percent,
  IndianRupee,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Zap,
  CreditCard,
  QrCode,
  TrendingUp,
  Sliders,
  DollarSign,
  Scale,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Zero Commission Event Ticketing — 0% Platform Fees in India | URPASS",
  description:
    "Sell event tickets with 0% platform commission. Connect your own payment gateway (Razorpay), receive direct bank settlements, and stop paying 5%–10% per ticket to event portals.",
  keywords: [
    "zero commission event ticketing",
    "0 commission event ticketing india",
    "no commission ticketing platform",
    "free event ticketing software india",
    "sell tickets zero commission",
    "event ticketing without commission",
    "townscript alternative zero commission",
    "eventbrite alternative zero fees",
    "URPASS zero commission",
  ],
  alternates: { canonical: "https://urpass.space/zero-commission-event-ticketing" },
  openGraph: {
    title: "Zero Commission Event Ticketing Software | URPASS",
    description:
      "Keep 100% of your ticket sales. URPASS charges 0% per-ticket commission with direct bank deposits and sub-second QR entrance passes.",
    url: "https://urpass.space/zero-commission-event-ticketing",
    locale: "en_IN",
    type: "website",
  },
};

export default function ZeroCommissionEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/zero-commission-event-ticketing",
        badge: "0% PLATFORM COMMISSION",
        h1: "Zero Commission Event Ticketing: Keep 100% of Your Ticket Sales",
        description:
          "Stop paying 6% to 10% on every ticket you sell. URPASS connects directly to your Razorpay account so registration revenue deposits straight into your bank with ₹0 platform deductions.",
        ctaLabel: "Start Selling with 0% Commission",

        // 10-Point Standard: Direct Answer at the Top (40-80 words)
        directAnswer: {
          title: "What is Zero Commission Event Ticketing?",
          summary:
            "Zero commission event ticketing is a software pricing model where the ticketing platform charges no percentage cut on ticket sales. Instead of surrendering 5% to 10% of gross revenue to ticketing portals like Townscript or Eventbrite, organizers use URPASS under a predictable flat plan. Funds flow directly through the organizer's own Razorpay or payment gateway into their Indian bank account, subject only to standard payment processing costs (~2%).",
          keyPoints: [
            "0% URPASS platform cut: keep 100% of your ticket proceeds on every tier sold",
            "Direct merchant settlement: funds land directly in your Indian bank account on T+2 schedule",
            "Zero portal escrow lockup: no waiting 15–30 days after your event ends to receive your funds",
            "No surprise 'convenience fees' or booking charges tacked onto attendee checkout screens",
            "Includes Ticket Studio, sub-second QR gate scanner, and WhatsApp pass distribution",
          ],
        },

        // 10-Point Standard: Key Facts & Specifications Table
        keyFactsTable: {
          title: "Gross Revenue Retained Across Different Event Sizes",
          subtitle: "Financial comparison showing how much money you keep with URPASS vs traditional 6%–10% portals.",
          headers: ["Ticket Revenue", "URPASS (0% Commission)", "Traditional Portals (Townscript / Eventbrite)"],
          rows: [
            {
              col1: "₹1,00,000 (Small Fest / 200 tickets @ ₹500)",
              col2: "₹1,00,000 kept (Save ₹8,400+)",
              col3: "₹79,500–₹91,600 kept (Portal takes ₹8,400–₹20,500)",
            },
            {
              col1: "₹5,00,000 (Conference / 500 tickets @ ₹1,000)",
              col2: "₹5,00,000 kept (Save ₹38,000+)",
              col3: "₹428,000–₹462,000 kept (Portal takes ₹38,000–₹72,000)",
            },
            {
              col1: "₹10,00,000 (College Culturals / 2,000 tickets @ ₹500)",
              col2: "₹10,00,000 kept (Save ₹85,000+)",
              col3: "₹820,000–₹915,000 kept (Portal takes ₹85,000–₹1,80,000)",
            },
            {
              col1: "₹25,00,000 (Flagship Expo / 5,000 tickets @ ₹500)",
              col2: "₹25,00,000 kept (Save ₹2,15,000+)",
              col3: "₹20,40,000–₹22,85,000 kept (Portal takes ₹2,15,000–₹4,60,000)",
            },
            {
              col1: "Payout Timeline",
              col2: "Direct daily/T+2 deposits to your bank",
              col3: "Held until 10–30 days after event ends",
            },
          ],
        },

        // Core Features
        features: [
          {
            icon: Percent,
            title: "0% Platform Commission",
            desc: "Sell 100 tickets or 10,000 passes without paying a single rupee of commission to URPASS. Your ticket earnings belong entirely to you.",
          },
          {
            icon: Building2,
            title: "Direct Merchant Settlement",
            desc: "Link your verified Razorpay merchant ID. Ticket sales deposit straight into your corporate or institutional bank account with automated reconciliation.",
          },
          {
            icon: Zap,
            title: "Real-Time Cash Flow",
            desc: "Stop waiting weeks after your festival ends to collect funds. Daily settlements provide continuous liquidity to pay stage, audio, and venue vendors.",
          },
          {
            icon: QrCode,
            title: "Automated QR Passes",
            desc: "Every purchase automatically provisions a tamper-proof digital pass with dynamic QR codes delivered straight to the attendee via WhatsApp and Email.",
          },
          {
            icon: ShieldCheck,
            title: "1-Click Refund Management",
            desc: "Execute instant or partial attendee refunds directly from your organizer console with automated pass revocation across all gate scanners.",
          },
          {
            icon: Scale,
            title: "GST Invoice Generation",
            desc: "Collect attendee GSTINs and automatically issue compliant tax invoices for corporate ticket buyers without manual bookkeeping.",
          },
        ],

        // 10-Point Standard: Real Product Proof
        productProof: {
          badge: "FEE COMPARISON CALCULATOR",
          title: "Calculated Savings: Over ₹45 Lakhs Saved by Indian Organizers",
          description:
            "College unions, tech associations, and independent event producers retain thousands of rupees on every single event by adopting URPASS's flat SaaS model.",
          type: "analytics",
        },

        // 10-Point Standard: India-Specific Details
        indiaHighlights: {
          title: "Built for Indian Event Budgets & Cash-Flow Realities",
          subtitle: "Why 0% commission ticketing is revolutionizing event production across India.",
          items: [
            {
              title: "Funding Vendor Advances on Time",
              description:
                "Indian sound, lighting, venue, and celebrity vendors require 50% advances days before showtime. Commission portals holding funds until post-event create severe budget crises. Direct settlements solve this completely.",
              badge: "Vendor Liquidity",
            },
            {
              title: "Transparent Attendee Checkouts",
              description:
                "Indian ticket buyers hate surprise 'Internet Handling Fees' and hidden checkout charges. With URPASS, the price you advertise is the exact amount the attendee pays.",
              badge: "Zero Buyer Fatigue",
            },
            {
              title: "College & Non-Profit Preservation",
              description:
                "Student departmental symposiums operate on shoestring budgets funded by ticket entries. Surrendering ₹40,000 in portal commissions often erases the entire prize money pool.",
              badge: "Student Friendly",
            },
            {
              title: "Native UPI Dominance",
              description:
                "Zero commission applies seamlessly across PhonePe, Google Pay, Paytm, and net banking, allowing fast checkout on the payment rails Indians prefer.",
              badge: "UPI Integrated",
            },
          ],
        },

        // Step-by-Step Workflow
        steps: [
          {
            n: "01",
            title: "Connect Your Payment Gateway",
            desc: "Paste your Razorpay Key ID and Key Secret in settings. Connects in under 2 minutes with instant test mode verification.",
          },
          {
            n: "02",
            title: "Set Your Ticket Tiers & Prices",
            desc: "Create early bird, general admission, or VIP tiers with custom capacities, pricing in INR, and custom registration fields.",
          },
          {
            n: "03",
            title: "Keep 100% of Your Revenue",
            desc: "Share your branded registration link. Attendee payments deposit directly to your bank account with zero commission deducted by URPASS.",
          },
        ],

        // Deep Dive Educational Sections
        deepDiveSections: [
          {
            badge: "PRICING ECONOMICS",
            title: "Why Percentage-Based Ticketing Portals Are Obsolete",
            paragraphs: [
              "When ticketing platforms launched in the early 2000s, charging a 5% to 10% fee was justified by the high cost of manual server provisioning, specialized physical ticket printing, and proprietary gate hardware.",
              "In 2026, the marginal cloud cost of issuing a cryptographic digital QR pass and updating a database is less than ₹0.05. Charging ₹50 on a ₹500 ticket represents an exorbitant 1,000x markup on underlying technology costs.",
              "URPASS operates like modern cloud infrastructure providers: you pay a flat, predictable software subscription (or use our free tier for smaller events), and connect your own payment rails. Whether you sell 200 tickets or 10,000 tickets, your software costs stay fixed while your profit grows.",
            ],
            bullets: [
              "Software infrastructure costs do not increase proportionally with ticket price",
              "Flat subscription models align platform incentives with organizer success",
              "You never face penalty fees for selling higher-priced VIP packages",
              "Complete freedom from proprietary merchant lock-in",
            ],
            takeaway:
              "Fixed software pricing replaces predatory percentage fees with transparent, predictable budgeting.",
          },
          {
            badge: "CASH FLOW FREEDOM",
            title: "The Hidden Danger of Ticket Aggregator Escrow Holds",
            paragraphs: [
              "Few first-time organizers read the fine print of legacy ticketing portals. Most contracts state that all ticket revenue is held in the portal's escrow account until 7 to 30 days after the event concludes successfully.",
              "This lockup forces organizers to take high-interest short-term loans or pay out of personal savings to cover security deposits, artist fees, catering, and venue rental advances.",
              "With URPASS, you are the merchant of record. Every ticket payment is processed through your own Razorpay account and settles directly to your bank account via standard banking settlement schedules (T+2 days). You retain continuous control over your working capital.",
            ],
            bullets: [
              "Direct merchant settlement ensures daily cash flow leading up to the event",
              "Zero risk of portal insolvency or unilateral payout freezes",
              "Immediate processing of refunds without bureaucratic third-party ticket queues",
              "Clean bank statements that match internal accounting ledgers 1-to-1",
            ],
            takeaway:
              "Direct merchant settlement gives organizers full financial independence and immediate liquidity.",
          },
        ],

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "URPASS Zero Commission vs Major Ticketing Portals",
          subtitle: "Detailed breakdown of platform fees, payout terms, and attendee experience.",
          competitorName: "Commission Ticketing Aggregators",
          rows: [
            {
              criteria: "Platform Ticketing Commission",
              urpass: "0% Commission",
              competitor: "5% to 10% taken per ticket",
              urpassAdvantage: true,
            },
            {
              criteria: "Payout Timing",
              urpass: "Direct T+2 daily bank deposits",
              competitor: "Held for 15–30 days after event ends",
              urpassAdvantage: true,
            },
            {
              criteria: "Added 'Convenience Fee' to Buyer",
              urpass: "₹0 (Clean transparent checkout)",
              competitor: "₹25–₹150 surprise fee added at final checkout step",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Data Ownership",
              urpass: "100% owned by organizer (Exportable CSV anytime)",
              competitor: "Portal retains data and markets competitor events to your guests",
              urpassAdvantage: true,
            },
            {
              criteria: "Entrance Gate Scanner Included",
              urpass: "Yes (Sub-second in-browser phone scanner included free)",
              competitor: "Requires paying for rental devices or scanner apps",
              urpassAdvantage: true,
            },
            {
              criteria: "Digital Pass Maker / Ticket Studio",
              urpass: "Full drag-and-drop designer included",
              competitor: "Generic uncustomizable portal template",
              urpassAdvantage: true,
            },
          ],
        },

        // Target Event Formats
        useCases: [
          "College Technical Symposiums & Cultural Fests",
          "Tech Conferences, Developer Summits & Hackathons",
          "Music Festivals, Concerts & Comedy Shows",
          "Corporate Summits & Business Offsites",
          "Paid Workshops, Bootcamps & Masterclasses",
          "Trade Shows, Consumer Expos & B2B Summits",
        ],

        // Topic Cluster Internal Links
        relatedLinks: [
          {
            title: "Event Ticketing Software Pillar",
            href: "/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Event Registration Software Pillar",
            href: "/event-registration-software",
            category: "Product",
          },
          {
            title: "Event Registration with UPI",
            href: "/event-registration-with-upi",
            category: "Product",
          },
          {
            title: "Pricing & Plans",
            href: "/pricing",
            category: "Product",
          },
          {
            title: "Townscript Alternative India",
            href: "/compare/townscript-alternative",
            category: "Comparison",
          },
          {
            title: "Eventbrite Alternative India",
            href: "/compare/eventbrite-alternative-india",
            category: "Comparison",
          },
          {
            title: "Digital Event Pass Maker",
            href: "/digital-event-pass",
            category: "Product",
          },
        ],

        // Comprehensive FAQs
        faqs: [
          {
            q: "How can URPASS offer 0% commission on event tickets?",
            a: "URPASS operates on a transparent SaaS subscription model (with plans starting from ₹0 on our permanent Free tier up to flat monthly plans) rather than taking a percentage cut of your revenue. You connect your own payment gateway (Razorpay), so you never pay URPASS a commission per ticket.",
          },
          {
            q: "What payment processing fees will I still pay?",
            a: "You only pay the standard payment gateway transaction fee charged directly by your gateway provider (e.g. ~2% for Razorpay UPI/Cards). URPASS takes 0% on top of that.",
          },
          {
            q: "How quickly do ticket funds reach my bank account?",
            a: "Because payments are processed through your own merchant gateway, funds settle according to your gateway's standard settlement cycle (typically T+2 business days in India). You do not have to wait for URPASS to approve or release payouts.",
          },
          {
            q: "Can I sell free tickets alongside paid tickets?",
            a: "Yes. You can configure free tiers (such as Volunteer or Speaker passes) and paid tiers (Early Bird, General Admission, VIP) within the same event registration form.",
          },
          {
            q: "Is there any setup fee to start using zero-commission ticketing?",
            a: "No. You can sign up, create your event, and connect your payment gateway with zero setup fees and zero credit card required.",
          },
          {
            q: "Can I offer discount promo codes to attendees?",
            a: "Yes. You can generate percentage-off or flat-rupee discount coupon codes with custom usage limits and expiration dates.",
          },
        ],
      }}
    />
  );
}
