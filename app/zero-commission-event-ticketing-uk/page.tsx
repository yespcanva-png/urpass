import type { Metadata } from "next";
import {
  Banknote,
  Percent,
  QrCode,
  ScanLine,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Zap,
  Building2,
  Lock,
  ArrowRight,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Zero Commission Event Ticketing UK | 0% Platform Fee | URPASS",
  description:
    "Sell event tickets in the UK with 0% ticketing commission. Flat GBP pricing (£0–£79/mo), sub-second mobile QR scanning, HMRC-compliant VAT receipts, and UK GDPR compliance. Keep 100% of your box office revenue.",
  keywords: [
    "zero commission event ticketing uk",
    "0 commission ticketing platform uk",
    "eventbrite alternative uk no fees",
    "free event ticketing software uk",
    "no fee ticketing platform uk",
    "cheapest event ticketing software uk",
    "flat rate ticketing software uk",
    "uk event registration 0 platform fee",
  ],
  alternates: { canonical: "https://urpass.space/zero-commission-event-ticketing-uk" },
  openGraph: {
    title: "Zero Commission Event Ticketing UK | 0% Platform Fee | URPASS",
    description:
      "Keep 100% of your UK event ticket revenue. Sub-second phone QR check-in, transparent monthly plans in GBP, and no per-ticket cuts.",
    url: "https://urpass.space/zero-commission-event-ticketing-uk",
    locale: "en_GB",
    type: "website",
  },
};

export default function ZeroCommissionEventTicketingUkPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/zero-commission-event-ticketing-uk",
        badge: "0% UK COMMISSION · KEEP 100% OF TICKET SALES",
        h1: "Zero Commission Event Ticketing Software in the UK",
        description:
          "Stop losing 6.95% + £0.59 on every ticket sold. URPASS provides UK event organisers with high-speed registration, digital QR ticketing, and sub-second gate check-in for a simple, flat monthly GBP fee with 0% per-ticket commission.",
        ctaLabel: "Start 30-day free UK trial",

        directAnswer: {
          title: "How Does Zero Commission Event Ticketing Work in the UK?",
          summary:
            "URPASS is a zero-commission event ticketing and gate management platform built for UK organisers, conferences, and university societies. Instead of deducting 5% to 7% from every ticket sale, URPASS operates on transparent flat monthly subscriptions (£0 to £79/mo in GBP). Organisers keep 100% of their box office revenue while benefiting from sub-second smartphone QR scanning, offline check-in resilience, HMRC-compliant VAT invoicing, and UK GDPR conformity.",
          keyPoints: [
            "0% platform commission on all paid and free ticket registrations",
            "Keep up to £2,500+ per event compared to Eventbrite UK percentage cuts",
            "Sub-second (<0.3s) camera scanning on standard volunteer smartphones",
            "Instant 30-day free trial for UK organisers with no credit card required",
          ],
        },

        keyFactsTable: {
          title: "UK Event Ticketing Fee Benchmark: 500 Tickets at £50 (£25,000 Box Office)",
          subtitle: "Compare what you actually keep when selling 500 tickets across major UK platforms.",
          headers: ["Ticketing Platform", "Commission & Platform Pricing", "Net Revenue Kept on £25k Event"],
          rows: [
            {
              col1: "URPASS Pro (£35/mo)",
              col2: "0% commission (flat £35/mo)",
              col3: "£24,965.00 (99.86% retained)",
            },
            {
              col1: "Eventbrite UK (Professional)",
              col2: "6.95% + £0.59 per ticket",
              col3: "£22,967.50 (Lost £2,032.50 to fees)",
            },
            {
              col1: "Ticket Tailor",
              col2: "£0.50 to £0.65 per ticket flat",
              col3: "£24,675.00 (Lost £325.00 to fees)",
            },
            {
              col1: "Citizen Ticket",
              col2: "£0.60 to £1.00 + % per ticket",
              col3: "£24,400.00 (Lost £600.00 to fees)",
            },
            {
              col1: "Fatsoma UK",
              col2: "10% + £0.50 per ticket booking fee",
              col3: "£22,250.00 (Lost £2,750.00 to fees)",
            },
          ],
        },

        productProof: {
          badge: "REVENUE RETENTION",
          title: "Keep Your Money Where It Belongs: In Your Event Budget",
          description:
            "Whether you are hosting a high-level London summit, a student society gala in Manchester, or an Edinburgh arts festival, paying high percentage commissions punishes your success. URPASS gives you world-class registration tools without skimming your revenue.",
          type: "scanner",
        },

        features: [
          {
            icon: Percent,
            title: "0% Ticketing Commission",
            desc: "Zero platform deductions on ticket sales. The price your attendees pay goes straight to your bottom line.",
          },
          {
            icon: Banknote,
            title: "Predictable GBP Plans",
            desc: "Choose Free (£0), Starter (£15/mo), Pro (£35/mo), or Business (£79/mo). No surprise fees or checkout markup.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Smartphone Scanning",
            desc: "Turn any steward's iPhone or Android into a high-speed scanner. Validate passes in under 300ms without app downloads.",
          },
          {
            icon: Receipt,
            title: "HMRC 20% VAT Invoicing",
            desc: "Automated, compliant VAT breakdown receipts with seller details, net/gross lines, and standard UK tax wording.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR Compliance",
            desc: "Complete privacy protection compliant with the UK Data Protection Act 2018. Zero ad tracking or audience retargeting.",
          },
          {
            icon: Zap,
            title: "Offline Gate Resilience",
            desc: "Keep validating tickets even if venue Wi-Fi crashes or basement cellular service drops. Syncs automatically when back online.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Create Your Event in 60 Seconds",
            desc: "Set your event title, Europe/London timezone (GMT/BST), venue address, and ticket tiers.",
          },
          {
            n: "02",
            title: "Publish Custom Registration Page",
            desc: "Launch your branded event page at urpass.space/apply/[your-slug] with customized attendee questions.",
          },
          {
            n: "03",
            title: "Distribute Digital QR Passes",
            desc: "Attendees receive clean, tamper-resistant QR passes with instant calendar download links.",
          },
          {
            n: "04",
            title: "Check In Guests at the Door",
            desc: "Volunteers open the browser scanner with a 6-digit PIN and scan passes at up to 50 guests per minute.",
          },
          {
            n: "05",
            title: "Keep 100% of Revenue",
            desc: "All ticket proceeds belong to you. Download complete attendee data and financial receipts in one click.",
          },
        ],

        deepDiveSections: [
          {
            badge: "FINANCIAL REALITY",
            title: "The Math: Why Percentage Ticketing Fees Hurt UK Event Organisers",
            paragraphs: [
              "When you organize an event in the UK, your overheads are already steep: venue hire, catering, AV equipment, security stewards, and marketing. When ticketing platforms demand 5% to 8% of your gross turnover, they become one of your largest expense lines.",
              "Consider a 400-person conference charging £75 per ticket (£30,000 gross). Eventbrite UK extracts over £2,300 in fees. With URPASS Pro at £35 per month, your software cost is £35. You save more than £2,200 on that single event alone — money that can fund better speakers, better catering, or return to your society treasury.",
            ],
            bullets: [
              "Save £1,000 to £5,000+ on every mid-sized to large event",
              "No per-ticket booking fee passed along to irritate your attendees",
              "Flat monthly fee covers unlimited events during your billing cycle",
              "Cancel or upgrade anytime with zero long-term lock-in",
            ],
            takeaway: "Stop paying thousands in software commission for simple gate access.",
          },
          {
            badge: "HMRC & DATA COMPLIANCE",
            title: "HMRC-Compliant VAT Invoicing & UK Data Governance",
            paragraphs: [
              "UK corporate attendees and university procurement departments require official VAT invoices showing 20% VAT breakdowns, company registration, and compliant tax invoice numbering.",
              "URPASS generates professional, compliant VAT invoices automatically upon registration. Every receipt contains the statutory seller name, UK address, 20% VAT line, and unique sequence number, making company expense reimbursement effortless.",
            ],
            bullets: [
              "Standard 20% UK VAT itemised line on all receipts",
              "English currency spelling in GBP pounds and pence",
              "Full compliance with HMRC invoicing standards",
              "Zero third-party marketing tracking pixels on attendee pages",
            ],
            takeaway: "Effortless compliance for UK corporate sponsors, delegates, and universities.",
          },
        ],

        useCases: [
          "UK Technology Conferences & Developer Summits",
          "University Students' Union Galas & Society Balls",
          "Independent Music & Arts Gigs across the UK",
          "B2B Corporate Seminars & Trade Exhibitions",
          "Charity Fundraisers & Community Gala Dinners",
          "Professional Workshops & CPD Training Seminars",
          "College Freshers' Week & Welcome Fairs",
          "Creative Pop-Ups & Fashion Exhibitions",
        ],

        relatedLinks: [
          {
            title: "UK Event Ticketing Master Hub",
            href: "/uk",
            category: "Location",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Manchester Event Registration & Check-In",
            href: "/uk/manchester",
            category: "Location",
          },
          {
            title: "University Society Event Ticketing",
            href: "/university-society-event-ticketing",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK Comparison",
            href: "/compare/eventbrite-alternative-uk",
            category: "Comparison",
          },
        ],

        faqs: [
          {
            q: "Does URPASS charge any per-ticket fee in the UK?",
            a: "No. URPASS charges 0% per-ticket commission. You pay a transparent monthly flat subscription in GBP (£0 for Free, £15/mo for Starter, £35/mo for Pro, £79/mo for Business). Every penny from your ticket sales remains with you.",
          },
          {
            q: "How does URPASS compare to Eventbrite UK for pricing?",
            a: "Eventbrite UK charges up to 6.95% + £0.59 per ticket. For an event with 500 attendees paying £50, Eventbrite takes over £2,030. On URPASS Pro (£35/mo), you pay just £35, saving you approximately £2,000 on a single event.",
          },
          {
            q: "How do I activate the 30-day free trial in the UK?",
            a: "Simply sign up on urpass.space and select your preferred plan. For all UK organizers, your 30-day free trial activates instantly with no credit card or payment gateway setup required.",
          },
          {
            q: "Can I generate HMRC-compliant VAT receipts for UK delegates?",
            a: "Yes. URPASS automatically generates compliant UK tax invoices with 20% VAT itemization, seller registration details, gross and net amounts, and downloadable PDF receipts.",
          },
          {
            q: "Do door staff need to download an app to scan tickets?",
            a: "No app download is needed. Stewards or volunteers simply open the scanner URL in Safari or Chrome on their smartphones, enter your 6-digit PIN, and scan QR passes in under 0.3 seconds.",
          },
          {
            q: "What happens if our UK venue loses mobile signal?",
            a: "URPASS includes an offline-first caching engine. When staff load the scanner, attendee credentials are pre-cached in device memory. Scanning continues smoothly offline and synchronises when connectivity returns.",
          },
        ],

        ctaTitle: "Keep 100% of your UK ticket revenue",
        ctaDescription: "Join UK organisers saving thousands on ticketing fees. Start your 30-day free trial today.",
        geo: {
          region: "GB",
          placename: "United Kingdom",
          position: "55.3781;-3.4360",
          latitude: 55.3781,
          longitude: -3.4360,
          country: "United Kingdom",
          countryCode: "GB",
        },
      }}
    />
  );
}
