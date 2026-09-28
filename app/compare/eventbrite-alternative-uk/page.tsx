import type { Metadata } from "next";
import {
  Banknote,
  QrCode,
  ScanLine,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Smartphone,
  Users,
  Zap,
  BarChart3,
  HelpCircle,
  Percent,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "UK Eventbrite Alternative — 0% Ticket Fees & Fast QR Check-In | URPASS",
  description:
    "The leading UK Eventbrite alternative. Eliminate 6.95% + £0.59 per-ticket fees with flat GBP pricing. 0% ticket commission, browser-based QR check-in, UK GDPR compliance, and 30-day free trial without a credit card.",
  keywords: [
    "eventbrite alternative uk",
    "event ticketing without fees uk",
    "zero commission event ticketing uk",
    "cheaper than eventbrite uk",
    "students union ticketing software",
    "qr ticket check in uk",
    "event management software uk",
  ],
  alternates: { canonical: "https://urpass.space/compare/eventbrite-alternative-uk" },
  openGraph: {
    title: "The UK Eventbrite Alternative with 0% Platform Fees | URPASS",
    description:
      "Stop paying high per-ticket commission in the UK. URPASS offers flat GBP plans, 0% ticket fees, sub-second browser scanning, and full UK GDPR compliance.",
    url: "https://urpass.space/compare/eventbrite-alternative-uk",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "geo.position": "55.3781;-3.4360",
    "ICBM": "55.3781, -3.4360",
  },
};

export default function EventbriteAlternativeUkPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/compare/eventbrite-alternative-uk",
        badge: "UK EVENTBRITE ALTERNATIVE · 0% TICKET COMMISSION",
        h1: "The UK Eventbrite Alternative with 0% Platform Fees & Fast QR Check-In",
        description:
          "Stop losing 5–8% of every ticket sold to legacy aggregators. URPASS gives UK organisers flat monthly GBP pricing, 0% commission on ticket sales, sub-second browser QR scanning, and full UK GDPR compliance.",
        ctaLabel: "Start free trial — no card required",

        // 10-Point Standard: Direct Answer (40–60 words)
        directAnswer: {
          title: "Why is URPASS the Best Eventbrite Alternative in the UK?",
          summary:
            "URPASS is the leading UK alternative to Eventbrite, engineered for university societies, students' unions, conferences, and independent organisers looking to avoid steep 6.95% + £0.59 per-ticket commissions. URPASS provides flat monthly GBP subscriptions with 0% ticket fees, sub-second browser QR check-in on volunteer smartphones, strict UK GDPR compliance, and a 30-day free trial with zero credit card required.",
          keyPoints: [
            "0% commission on ticket sales: save up to £1,200+ on a typical 500-person event",
            "No charges to publish events with more than 25 attendees",
            "Door check-in runs in any phone browser — no app store downloads required",
            "30-day free trial for UK organisers with immediate access and no card needed",
          ],
        },

        // 10-Point Standard: Competitor Comparison Table
        competitorComparison: {
          title: "Side-by-Side Comparison: URPASS UK vs Eventbrite UK",
          subtitle: "Detailed breakdown of fees, restrictions, attendee privacy, and door hardware.",
          competitorName: "Eventbrite UK",
          rows: [
            {
              criteria: "Platform Commission on Paid Tickets",
              urpass: "0% Commission (Flat GBP monthly subscription)",
              competitor: "6.95% + £0.59 taken from every single ticket",
              urpassAdvantage: true,
            },
            {
              criteria: "Cost to Publish Free Events",
              urpass: "£0 forever (Up to 100 registrations/month free)",
              competitor: "Charges 'Eventbrite Flex' or 'Pro' fees for events >25 guests",
              urpassAdvantage: true,
            },
            {
              criteria: "Buyer Surcharge at Checkout",
              urpass: "£0 (Attendees pay only ticket face value)",
              competitor: "Convenience charges added to attendee basket",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Check-In Hardware",
              urpass: "Any smartphone browser (sub-second camera scan, 0 app downloads)",
              competitor: "Requires downloading dedicated Eventbrite Organiser app",
              urpassAdvantage: true,
            },
            {
              criteria: "Offline Gate Operation",
              urpass: "Dual-layer offline cache: scans continue without Wi-Fi or 4G/5G",
              competitor: "Frequent sync errors and slow validations in basement venues",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Data Privacy & Cross-Promotion",
              urpass: "100% data sovereignty; zero ads, no cross-selling competing events",
              competitor: "Promotes competing events directly to your attendees via email",
              urpassAdvantage: true,
            },
            {
              criteria: "UK Free Trial Experience",
              urpass: "30 days full trial with zero credit card or payment details required",
              competitor: "Immediate credit card capture or transaction deductions",
              urpassAdvantage: true,
            },
          ],
        },

        // 10-Point Standard: Visual Product Proof
        productProof: {
          badge: "FEE SAVINGS CALCULATOR",
          title: "Save Thousands of Pounds in Ticketing Fees Across Your Academic Year",
          description:
            "On Eventbrite UK, selling 1,000 tickets at £20 costs your organisation over £1,980 in platform fees. On URPASS, you pay a flat £35/month for the Pro plan — putting over £1,900 back into your society or event budget.",
          type: "analytics",
        },

        features: [
          {
            icon: Percent,
            title: "0% Commission on Tickets",
            desc: "Keep 100% of your ticket revenue. Pay predictable monthly or annual GBP (£) software subscriptions starting at £15/mo.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Browser Scanner",
            desc: "Equip your door volunteers with instant camera scanners in their mobile browser. Validates valid vs duplicate passes in under 300ms.",
          },
          {
            icon: Zap,
            title: "Unbreakable Offline Mode",
            desc: "Don't let dead mobile reception at UK venues delay entry. Attendee lists are cached locally in the browser so queues keep moving.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "We never remarket competing events to your attendees or sell their data. Enjoy full privacy notice compliance and Article 17 erasure requests.",
          },
          {
            icon: Building2,
            title: "Students' Union & Society Friendly",
            desc: "Customise checkout forms with Student ID, university department, society membership numbers, and dietary requirements.",
          },
          {
            icon: Users,
            title: "Multi-Gate Sync in Real-Time",
            desc: "Prevent ticket sharing across different entrance doors. Central sync instantly flags duplicate presentations with exact timestamps.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Create Your Branded Event",
            desc: "Set event dates in DD/MM/YYYY, upload your banner, and configure custom attendee questions like Student ID.",
          },
          {
            n: "02",
            title: "Share Your Clean Event Link",
            desc: "Distribute your registration link without third-party competitor advertisements or intrusive tracking pixels.",
          },
          {
            n: "03",
            title: "Issue Instant Digital Passes",
            desc: "Attendees receive clean, modern digital passes with scannable QR codes straight to their email inboxes.",
          },
          {
            n: "04",
            title: "Scan at the Door via Browser",
            desc: "Door staff open the scanner URL and scan QR codes in <0.3s. No apps from the App Store required.",
          },
          {
            n: "05",
            title: "Real-Time Attendance Analytics",
            desc: "Track total check-ins, velocity, and attendance ratios live on your organiser dashboard.",
          },
        ],

        deepDiveSections: [
          {
            badge: "FEE ANALYSIS",
            title: "The True Cost of Eventbrite in the UK: Why Flat Subscriptions Win",
            paragraphs: [
              "When Eventbrite introduced fees for publishing free events with more than 25 attendees and increased per-ticket commissions to 6.95% + £0.59, thousands of UK community organisers, charities, and students' unions felt the financial squeeze.",
              "For an organiser hosting 4 events a year with 250 attendees paying £15 each, Eventbrite claims over £1,630 in transaction fees. With URPASS's flat pricing, you pay as little as £15/mo for Starter or £35/mo for Pro, saving over 75% on software costs while gaining a faster browser check-in scanner.",
            ],
            bullets: [
              "Eventbrite: 6.95% + £0.59 per ticket + pay-to-publish fees on free events",
              "URPASS: 0% per-ticket commission on all plans with flat GBP pricing",
              "No penalties for scaling attendee numbers",
              "Predictable annual budgeting for university societies and charities",
            ],
            takeaway: "Eliminate unpredictable ticketing tax with transparent flat software plans.",
          },
          {
            badge: "VOLUNTEER FRIENDLY",
            title: "Why Door Volunteers Prefer Browser Scanning Over the Eventbrite App",
            paragraphs: [
              "Managing student volunteers or casual event staff on event morning is notoriously tricky. Asking 8 volunteers to download an 80MB app from the App Store, remember Apple IDs, create organiser accounts, and troubleshoot permissions causes immense entrance delays.",
              "URPASS requires zero app installation. Organisers simply share a secure check-in PIN. Volunteers open Safari or Chrome on their own phone, grant temporary camera access, and immediately start scanning passes with sub-300ms verification.",
            ],
            bullets: [
              "No App Store or Google Play downloads needed",
              "Works on any modern iPhone, Android, iPad, or laptop webcam",
              "Instant haptic feedback so volunteers know a ticket is valid without looking at screen",
              "Prevents screenshot sharing and duplicate entries across multiple doors",
            ],
            takeaway: "Onboard entrance volunteers in 10 seconds flat on event day.",
          },
        ],

        useCases: [
          "UK University Societies & Students' Unions",
          "Tech Conferences, Meetups & Hackathons",
          "Independent Music Venues & Gigs",
          "Charity Galas & Community Fundraisers",
          "Corporate Workshops & Training Seminars",
          "Food & Drink Festivals & Expos",
          "Alumni Networking & Society Dinners",
          "Sports Club Tournaments & Award Nights",
        ],

        relatedLinks: [
          {
            title: "UK Event Ticketing Master Hub",
            href: "/uk",
            category: "Location",
          },
          {
            title: "London Event Check-In Software",
            href: "/uk/london",
            category: "Location",
          },
          {
            title: "Zero Commission Event Ticketing",
            href: "/zero-commission-event-ticketing",
            category: "Product",
          },
          {
            title: "Multiple Gate Event Check-In",
            href: "/multiple-gate-event-check-in",
            category: "Product",
          },
          {
            title: "Offline QR Event Check-In",
            href: "/offline-qr-event-check-in",
            category: "Product",
          },
          {
            title: "Google Forms Alternative for Events",
            href: "/google-forms-alternative-for-events",
            category: "Comparison",
          },
        ],

        faqs: [
          {
            q: "How does URPASS compare to Eventbrite for UK event organisers?",
            a: "URPASS charges 0% commission on your ticket sales, operating on a transparent flat GBP monthly subscription (£0 Free, £15 Starter, £35 Pro, £79 Business). Eventbrite charges 6.95% + £0.59 per ticket plus fees to host free events over 25 attendees. Furthermore, URPASS gate check-in runs directly in any phone browser without requiring volunteers to download an app.",
          },
          {
            q: "Does Eventbrite market other events to my attendees?",
            a: "Yes. Eventbrite is an aggregator marketplace that frequently emails your attendees recommending competing events in your area. URPASS is private software for your organisation: your attendees are never exposed to competitor events or third-party advertising.",
          },
          {
            q: "How does the 30-day free trial work for UK organisers?",
            a: "UK organisers can activate a full 30-day free trial of any paid plan (Starter, Pro, or Business) directly from their dashboard without entering any credit card or payment gateway details. You get full access to all features immediately.",
          },
          {
            q: "Can I collect custom registration fields like Student ID?",
            a: "Yes. Unlike basic forms, URPASS allows you to collect custom information including Student IDs, course names, society membership tiers, dietary preferences, and emergency contact details.",
          },
          {
            q: "Is URPASS fully compliant with UK GDPR?",
            a: "Yes. URPASS is built in full compliance with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and PECR. Your attendee data is kept secure, never monetized, and can be exported or permanently deleted at any time.",
          },
          {
            q: "Can I import my existing guest lists from Eventbrite into URPASS?",
            a: "Yes. You can export your attendee CSV from Eventbrite and import it directly into URPASS with one click. Digital QR passes will be generated and dispatched automatically.",
          },
          {
            q: "What happens if our venue Wi-Fi drops at the door?",
            a: "URPASS includes an intelligent offline scanning engine. The attendee roster is pre-cached on the volunteer's browser, allowing check-in to continue smoothly even without an internet connection, and synchronising automatically when reconnected.",
          },
        ],

        ctaTitle: "Switch from Eventbrite UK and keep 100% of your ticket sales",
        ctaDescription: "Start your 30-day free trial today. No credit card required. Up and running in minutes.",
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
