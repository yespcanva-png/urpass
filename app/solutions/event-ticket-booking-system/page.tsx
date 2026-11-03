import type { Metadata } from "next";
import {
  CreditCard,
  DollarSign,
  Ticket,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BarChart3,
  QrCode,
  Sliders,
  Send,
  Building2,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Online Event Ticket Booking System — 0% Platform Commission | UrPass",
  description:
    "Sell event tickets online with zero commission. Direct Razorpay & Stripe payouts, multi-tier ticket categories, instant QR pass delivery, and automated GST invoices.",
  keywords: [
    "online event ticket booking system",
    "event ticket booking software",
    "zero commission event ticketing",
    "sell tickets online without fees",
    "event ticketing system for organizers",
    "event ticket booking platform",
  ],
  alternates: {
    canonical: "https://urpass.space/solutions/event-ticket-booking-system",
  },
  openGraph: {
    title: "Online Event Ticket Booking System — 0% Platform Commission | UrPass",
    description:
      "Sell tickets online and keep 100% of your earnings. Direct payouts, multi-tier inventory, automated pass generation, and live sales analytics.",
    url: "https://urpass.space/solutions/event-ticket-booking-system",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Event Ticket Booking System | UrPass",
    description:
      "0% platform commission ticket booking for workshops, summits, concerts, and festivals.",
  },
};

export default function EventTicketBookingSystemSolutionPage() {
  return (
    <SEOPage
      config={{
        badge: "CORE SOLUTION // TICKET BOOKING",
        h1: "Online Event Ticket Booking System with 0% Platform Fees",
        canonicalUrl: "https://urpass.space/solutions/event-ticket-booking-system",
        description:
          "Launch direct-to-consumer ticket sales in minutes. Enjoy instant merchant payouts, multi-tier ticket management, automated digital QR passes, and zero platform commission.",
        ctaLabel: "Start Selling Tickets Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "Calculate Fee Savings",
        secondaryCtaHref: "/ticket-fee-calculator",

        // GEO Direct Answer
        directAnswer: {
          title: "How Does a 0% Commission Event Ticket Booking System Benefit Organizers?",
          summary:
            "An online event ticket booking system processes customer payments, manages ticket tiers, and delivers admission credentials. Legacy ticketing portals charge 3% to 7% per ticket plus buyer booking fees. In contrast, UrPass operates on a 0% ticketing commission model with predictable flat monthly plans. Ticket revenues route directly into your own Razorpay or Stripe account with instant settlement, saving organizers thousands of dollars per event.",
          keyPoints: [
            "0% platform ticketing fee: keep 100% of the face value of every ticket sold",
            "Direct merchant integration: payments settle directly to your Razorpay or Stripe account",
            "Multi-tier ticket categories: Early Bird, VIP, General Admission, and Student Passes",
            "Automated GST invoice generation and tax-compliant transaction records",
            "Instant digital QR code delivery via WhatsApp, email, and Apple Wallet upon payment confirmation",
          ],
        },

        whatIs: {
          title: "Direct Ticketing vs. Marketplace Intermediaries",
          definition:
            "A direct event ticket booking system gives organizers full control over their brand, ticket pricing, and attendee contact information. Instead of listing your event on a third-party marketplace that displays competing events next to yours and takes a percentage cut, direct ticketing provides a dedicated checkout portal where your brand takes center stage.",
          details: [
            "Protects your customer database from being retargeted with competitors' events",
            "Eliminates delayed payouts where ticketing companies hold event funds for weeks",
            "Provides transparent, itemized checkout without surprise 'convenience fees' for buyers",
          ],
        },

        keyFactsTable: {
          title: "UrPass Direct Ticket Booking vs. Marketplace Portals",
          subtitle: "Fee comparison and financial cash flow breakdown.",
          headers: ["Financial / Operational Feature", "UrPass Ticket Booking", "Eventbrite Marketplace", "BookMyShow / Traditional Portals"],
          rows: [
            {
              col1: "Platform Commission on Sales",
              col2: "0% (Flat monthly software plan)",
              col3: "3.7% + per-ticket service fee",
              col4: "5%–10% per ticket + convenience fees",
            },
            {
              col1: "Payout Schedule",
              col2: "Direct to your gateway (Daily / T+2)",
              col3: "Bi-weekly or held until post-event",
              col4: "Held in escrow until event concludes",
            },
            {
              col1: "Attendee Data Ownership",
              col2: "100% owned by organizer (full export)",
              col3: "Eventbrite markets other events to them",
              col4: "Portal retains primary customer relationship",
            },
            {
              col1: "Regional Payment Options (India)",
              col2: "UPI, GPay, PhonePe, Cards, Netbanking",
              col3: "Primarily international credit cards",
              col4: "UPI & cards with high convenience fees",
            },
            {
              col1: "Ticket Revenue on $25,000 Event",
              col2: "Full $25,000 kept by organizer",
              col3: "~$1,450+ lost in platform deductions",
              col4: "~$2,000+ lost in commissions & fees",
            },
          ],
        },

        featuresTitle: "Complete Ticketing & Sales Management Infrastructure",
        featuresSubtitle: "Equipped with everything required to maximize event ticket conversion.",
        features: [
          {
            icon: DollarSign,
            title: "Zero Ticketing Commission",
            desc: "Never surrender a percentage of your box office revenue. Pay a modest flat SaaS fee and keep every penny you earn.",
          },
          {
            icon: CreditCard,
            title: "Direct Gateway Payouts",
            desc: "Connect your Razorpay or Stripe merchant account in 1 click. Sales settle directly into your bank account under your standard merchant schedule.",
          },
          {
            icon: Sliders,
            title: "Customizable Ticket Tiers",
            desc: "Set up Early Bird discounts, VIP packages, General Admission, and Student categories with individual inventory limits and timed cutoffs.",
          },
          {
            icon: QrCode,
            title: "Instant Digital Pass Issuance",
            desc: "As soon as payment succeeds, the attendee receives an encrypted digital QR pass on the confirmation screen, by email, and via WhatsApp.",
          },
          {
            icon: Building2,
            title: "Automated GST Invoicing",
            desc: "Generate professional GST tax invoices for Indian corporate attendees automatically, saving your finance department days of manual invoicing.",
          },
          {
            icon: BarChart3,
            title: "Live Box Office Analytics",
            desc: "Track real-time gross revenue, sales velocity across tiers, remaining available seats, and conversion rates from your dashboard.",
          },
        ],

        howItWorksTitle: "How to Sell Tickets Online with UrPass",
        howItWorksSubtitle: "Four simple stages to start accepting paid reservations.",
        steps: [
          { n: "01", title: "Create Ticket Types", desc: "Define pricing, quantities, sale start/end dates, and descriptions for each ticket category." },
          { n: "02", title: "Connect Payment Account", desc: "Link your existing Razorpay or Stripe account with a single API key configuration." },
          { n: "03", title: "Publish Sales Page", desc: "Share your dedicated ticket booking URL across social media, email campaigns, and event ads." },
          { n: "04", title: "Track Revenue & Check-In", desc: "Watch payouts roll in and validate tickets at the door using your smartphone camera on event day." },
        ],

        deepDiveSections: [
          {
            badge: "PROFITABILITY CASE STUDY",
            title: "How an Annual Conference Saved Over ₹1,80,000 in Ticketing Fees",
            paragraphs: [
              "When an independent tech conference sold 800 delegate passes at ₹3,000 each (₹24,00,000 total ticket gross), legacy marketplace ticketing platforms quoted a 5% commission fee plus payment processing. That totaled ₹1,20,000 in platform fees, plus delayed payouts until after the event completed.",
              "By switching to UrPass, the conference organizer connected their own Razorpay account and paid just ₹1,499/month for the software subscription. The entire ₹24,00,000 settled into their corporate bank account within 48 hours of sale, saving ₹1,18,000 in platform fees and drastically improving cash flow for upfront venue deposits.",
            ],
            bullets: [
              "No escrow delays: funds arrive immediately to pay venue and speaker deposits",
              "Zero per-ticket penalty on ticket price increases",
              "Full attendee profile and contact ownership for future event promotions",
            ],
            takeaway: "Direct ticketing models safeguard your margins and improve operational cash flow.",
          },
        ],

        whoShouldUse: {
          title: "Designed for Independent Event Creators & Businesses",
          subtitle: "Empowering organizers who value cash flow and financial independence.",
          personas: [
            {
              title: "Conference & Summit Organizers",
              desc: "Sell multi-day conference passes, networking dinner tickets, and masterclass addons with GST receipts.",
              badge: "Conferences",
            },
            {
              title: "Independent Workshop Trainers",
              desc: "Host paid masterclasses and creative workshops with instant UPI ticket booking and zero commission overhead.",
              badge: "Workshops",
            },
            {
              title: "Music Concert & Festival Promoters",
              desc: "Sell phased Early Bird, Phase 1, and VIP passes with fast mobile checkout and fraud-proof QR tickets.",
              badge: "Concerts",
            },
            {
              title: "Sports Tournaments & Marathons",
              desc: "Register runners, collect emergency medical info, and issue bib-collection digital passes seamlessly.",
              badge: "Sports",
            },
          ],
        },

        faqs: [
          {
            q: "Can I offer discount promo codes to sponsors and VIPs?",
            a: "Yes. You can create customized promo codes with percentage discounts (e.g., 20% off) or fixed amount discounts (e.g., ₹500 off) with usage caps.",
          },
          {
            q: "How quickly do ticket sale proceeds reach my bank account?",
            a: "Because UrPass connects directly to your own Razorpay or Stripe account, payouts follow your gateway's standard merchant settlement schedule—typically 24 to 48 hours.",
          },
          {
            q: "What payment methods are supported for buyers?",
            a: "Through Razorpay (India), buyers can pay via UPI (Google Pay, PhonePe, Paytm), RuPay, Credit/Debit cards, and Netbanking. Through Stripe (International), all major credit and debit cards are supported.",
          },
          {
            q: "Can I refund an attendee if they are unable to attend?",
            a: "Yes. Organizers can issue full or partial refunds directly from their payment gateway dashboard. Refunding an attendee immediately marks their digital pass as cancelled.",
          },
        ],

        relatedLinks: [
          { title: "Event Ticket Management Software", href: "/solutions/event-ticket-management", category: "Product" },
          { title: "How Much Does Event Registration Software Cost?", href: "/guides/event-registration-software-cost", category: "Guide" },
          { title: "UrPass vs. Eventbrite Comparison", href: "/compare/urpass-vs-eventbrite", category: "Comparison" },
          { title: "UrPass Flat Pricing & Plans", href: "/pricing", category: "Product" },
        ],
      }}
    />
  );
}
