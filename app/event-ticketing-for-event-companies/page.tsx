import type { Metadata } from "next";
import { AlertTriangle, BarChart3, Building2, CheckCircle2, Lock, ScanLine, ShieldCheck, Users, Zap } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Software for Event Companies | Zero Commission | UrPass",
  description: "Professional event ticketing engine with 0% commission, instant payment gateway integration, branded QR tickets, and rapid smartphone door scanning.",
  keywords: [
    "ticketing software for event companies",
    "ticketing software for event companies online",
    "ticketing software for event companies platform",
    "ticketing software for event companies check in",
    "ticketing software for event companies qr code",
  ],
  alternates: {
    canonical: "https://urpass.space/event-ticketing-for-event-companies",
  },
  openGraph: {
    title: "Event Ticketing Software for Event Companies | Zero Commission | UrPass",
    description: "Professional event ticketing engine with 0% commission, instant payment gateway integration, branded QR tickets, and rapid smartphone door scanning.",
    url: "https://urpass.space/event-ticketing-for-event-companies",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "EVENT COMPANIES & PROMOTERS",
        h1: "Event Ticketing & Digital Pass Software for Event Companies",
        canonicalUrl: "https://urpass.space/event-ticketing-for-event-companies",
        description: "Professional event ticketing engine with 0% commission, instant payment gateway integration, branded QR tickets, and rapid smartphone door scanning.",
        ctaLabel: "Start Selling Tickets Free",
        ctaHref: "/signup",
        secondaryCtaLabel: "View 0% Fee Model",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "What is the best ticketing software for commercial event companies?",
          summary: "UrPass is an event registration, digital ticketing and QR check-in platform by Yesp Corporation. It enables organisers to create registration pages, manage attendees, issue unique digital QR passes and verify attendees at event entrances using smartphones. For event companies, UrPass provides a 0% commission ticketing model, direct Stripe and Razorpay payment settlement, multi-tier pass creation, and smartphone-based QR check-in across multiple gates.",
          keyPoints: ["0% platform commission on paid ticket sales—keep 100% of your event earnings","Direct instant payout integration via Stripe (global) and Razorpay (India UPI/cards)","Multi-tier ticket categories (Early Bird, VIP, Tables, Workshops) with independent caps","Instant automated QR ticket delivery with Apple Wallet and Google Wallet support"],
        },
        whatIs: {
          title: "What is Event Ticketing Software for Event Companies?",
          definition: "Event ticketing software for event companies is a commercial sales and admission infrastructure that allows professional organizers to sell tickets online, collect instant customer payments, and verify digital passes at venue doors without paying exorbitant percentage fees.",
          details: ["Eliminates 3% to 8% legacy ticket ticketing commissions, saving thousands per event","Provides direct, instant cash flow by depositing funds directly into company bank accounts","Coordinates door check-in across dozens of staff smartphones simultaneously","Secures gate access with atomic duplicate prevention and cryptographic QR codes"],
        },
        featuresTitle: "Core Platform Capabilities Engineered for High Performance",
        featuresSubtitle: "Everything you need to register attendees, issue digital QR passes, and verify door check-ins without hardware.",
        features: [
          {
            icon: Zap,
            title: "Zero Ticket Commission",
            desc: "Keep 100% of your ticket revenue. Pay flat software pricing without per-ticket percentage cuts.",
          },
          {
            icon: Lock,
            title: "Direct Payment Settlement",
            desc: "Integrate Stripe or Razorpay to receive instant payouts directly into your corporate bank account.",
          },
          {
            icon: Users,
            title: "Multi-Tier Ticket Architecture",
            desc: "Configure Early Bird, VIP, Group Bundles, and Student passes with custom availability windows.",
          },
          {
            icon: ScanLine,
            title: "0.28s Mobile Gate Scanning",
            desc: "Scan digital QR passes on any iPhone or Android phone at high speed without hardware rentals.",
          },
          {
            icon: CheckCircle2,
            title: "Branded Digital Passes",
            desc: "Deliver beautiful digital tickets featuring company logos, sponsor branding, and venue maps.",
          },
          {
            icon: BarChart3,
            title: "Live Revenue & Ingress Telemetry",
            desc: "Track live ticket sales volume, revenue totals, arrival velocity, and gate throughput in one view.",
          },
        ],
        deepDiveSections: [
          {
            badge: "PROFITABILITY & CASHFLOW",
            title: "Why Event Companies are Switching to 0% Commission Ticketing",
            paragraphs: ["Commercial event companies selling $50,000 in tickets per event lose between $2,000 and $4,500 on every single event when using legacy ticketing platforms that charge 4%–9% commission. Furthermore, legacy platforms frequently hold ticket funds in escrow until weeks after the event concludes, strangling company cash flow.","UrPass eliminates this predatory model. With UrPass, event companies connect their own Stripe or Razorpay accounts. Funds hit company accounts instantly, and UrPass charges zero percentage commission. Event companies save tens of thousands annually while gaining faster mobile door check-in."],
            bullets: ["Saves commercial promoters $2,000–$10,000+ per event in ticketing commission fees","Instant merchant payouts provide crucial working capital for venue and talent deposits","Turn staff smartphones into high-speed scanners with zero rental hardware costs","Atomic database locking prevents duplicate screenshot entry at concert doors"],
            takeaway: "UrPass maximizes profit margins and accelerates cash flow for professional event companies worldwide.",
          },
        ],
        keyFactsTable: {
          title: "Platform Comparison & Operational Benchmarks",
          subtitle: "How UrPass delivers faster processing, zero commission fees, and foolproof duplicate protection.",
          headers: ["Ticketing Feature","Legacy Ticketing Monopolies","UrPass Commercial Platform"],
          rows: [{"col1":"Platform Commission Fee","col2":"3.5% to 8.5% + $1.50 per ticket","col3":"0% ticket commission (keep 100%)"},{"col1":"Payout Settlement Time","col2":"Held until 7–14 days after event","col3":"Instant direct deposit to your gateway"},{"col1":"Scanner Hardware Cost","col2":"$250–$600 per scanner rental","col3":"$0 (uses any smartphone camera)"},{"col1":"Door Check-In Speed","col2":"1.5–3.0 seconds per scan","col3":"0.28s ultra-fast mobile optical scan"}],
        },
        whoShouldUse: {
          title: "Built for High-Stakes Event Leaders",
          subtitle: "Tailored workflows for organizing committees, operations crew, and security staff.",
          personas: [{"title":"Music Concert Promoters","desc":"Sell out gig tickets and admit thousands of attendees rapidly across arena gates.","badge":"CONCERTS"},{"title":"Business Conference Producers","desc":"Manage delegate registrations, sponsor passes, and VIP executive admissions.","badge":"CONFERENCES"},{"title":"Food & Nightlife Festivals","desc":"Distribute tasting passes and evening wristband redemption QR codes.","badge":"FESTIVALS"},{"title":"Sports Tournament Directors","desc":"Sell spectator tickets and manage multi-day gate access passes.","badge":"SPORTS"}],
        },
        relatedLinks: [
        {
                "title": "QR Code Check-In System",
                "href": "/qr-code-check-in-system",
                "category": "Product"
        },
        {
                "title": "Multi-Gate Event Check-In",
                "href": "/multiple-gate-event-check-in",
                "category": "Product"
        },
        {
                "title": "Zero Commission Event Ticketing",
                "href": "/zero-commission-event-ticketing",
                "category": "Product"
        },
        {
                "title": "Event Pricing & Free Plan",
                "href": "/pricing",
                "category": "Product"
        },
        {
                "title": "URPASS Sitelinks Directory",
                "href": "/sitelinks",
                "category": "Guide"
        }
],
        faqs: [
          {
                    "q": "Does UrPass take a percentage cut of our ticket sales?",
                    "a": "No. UrPass charges 0% commission on ticket sales. You only pay standard merchant processing fees to your payment gateway (Stripe or Razorpay)."
          },
          {
                    "q": "When do we receive the money from ticket sales?",
                    "a": "Immediately. Because ticket sales process directly through your connected Stripe or Razorpay account, funds are deposited directly according to your standard merchant payout schedule."
          },
          {
                    "q": "Can we create multiple ticket types with different prices and limits?",
                    "a": "Yes. You can configure unlimited ticket tiers—such as Early Bird, General Admission, VIP, and Group Passes—with custom prices, inventory caps, and sale dates."
          },
          {
                    "q": "How do our staff scan tickets at the door?",
                    "a": "Staff simply open the UrPass scanner link on their smartphones and scan QR codes using their device camera. No expensive hardware rentals are needed."
          },
          {
                    "q": "Can we prevent attendees from sharing ticket screenshots?",
                    "a": "Yes. UrPass marks tickets as checked in immediately across all scanners in <150ms. If a shared screenshot is scanned again, the system sounds an instant red duplicate alarm."
          },
          {
                    "q": "Can we add sponsor logos and custom branding to tickets?",
                    "a": "Yes. You can customize the look of your digital tickets, registration pages, and confirmation emails with company and sponsor branding."
          },
          {
                    "q": "How easy is it to migrate our events from other ticketing platforms to UrPass?",
                    "a": "You can set up a new event in under 5 minutes, connect your payment gateway with a few clicks, and import existing attendee lists effortlessly."
          }
],
        ctaTitle: "Event Ticketing & Digital Pass Software for Event Companies",
        ctaDescription: "Launch your event registration in minutes. Permanent free plan available with no credit card required.",
      }}
    />
  );
}
