import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Smartphone,
  Banknote,
  Users,
  Zap,
  BarChart3,
  CalendarCheck,
  Lock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "UK Event Ticketing & QR Check-In Software — 0% Commission | URPASS",
  description:
    "The modern UK event ticketing and QR check-in platform. 0% ticket commission, transparent GBP (£) plans, 30-day free trial with no credit card required, UK GDPR compliant, and sub-second browser-based QR scanning.",
  keywords: [
    "uk event ticketing software",
    "event check-in software uk",
    "qr ticket scanner uk",
    "zero commission event ticketing uk",
    "eventbrite alternative uk",
    "students union event ticketing",
    "university society event management uk",
    "conference qr check-in london",
  ],
  alternates: { canonical: "https://urpass.space/uk" },
  openGraph: {
    title: "UK Event Ticketing & QR Check-In Software | 0% Commission | URPASS",
    description:
      "Sell tickets and check in attendees across the UK with 0% platform commission. Browser-based QR scanning in <0.3s, UK GDPR compliance, and transparent GBP plans.",
    url: "https://urpass.space/uk",
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

export default function UkEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk",
        badge: "UK EVENT OS · 0% PLATFORM COMMISSION",
        h1: "UK Event Ticketing & QR Check-In Software for Universities, Conferences & Organisers",
        description:
          "Launch branded registration pages, issue digital QR passes, and check in thousands of attendees in <0.3s using standard smartphone browsers. Fully compliant with UK GDPR, with transparent GBP pricing and no per-ticket fees.",
        ctaLabel: "Start free in the UK",

        // 10-Point Standard: Direct Answer (40–60 words)
        directAnswer: {
          title: "What is URPASS UK Event Ticketing & Check-In?",
          summary:
            "URPASS is dedicated UK event management and gate check-in software built for university societies, students' unions, corporate conferences, and independent organisers. It eliminates punitive 5–8% per-ticket booking fees with transparent flat monthly plans in GBP (£), features sub-second browser scanning without app downloads, and complies strictly with UK GDPR and PECR regulations.",
          keyPoints: [
            "0% commission on ticket sales: retain 100% of your event revenue",
            "Instant browser QR check-in (<0.3s scan) on any volunteer's smartphone",
            "30-day full free trial activated directly with zero credit card required",
            "Strict UK GDPR, Data Protection Act 2018, and PECR compliance",
          ],
        },

        // 10-Point Standard: Key Facts & Comparison Table
        keyFactsTable: {
          title: "UK Ticketing Comparison & Technical Specifications",
          subtitle: "How URPASS compares against legacy UK ticketing providers across fees, gate hardware, and data privacy.",
          headers: ["Evaluation Parameter", "URPASS UK", "Legacy Platforms (Eventbrite UK / Ticket Tailor)"],
          rows: [
            {
              col1: "Platform Commission per Ticket",
              col2: "0% Commission (Free plan £0, paid tiers from £15/mo)",
              col3: "6.95% + £0.59 per ticket sold",
            },
            {
              col1: "Attendee Booking Surcharge",
              col2: "£0 (Attendees pay only face value)",
              col3: "2% to 4% added to checkout basket",
            },
            {
              col1: "Gate Scanner Hardware",
              col2: "Any smartphone browser (no app store download required)",
              col3: "Requires proprietary scanner app or rented handheld hardware",
            },
            {
              col1: "Offline Gate Operation",
              col2: "Built-in offline cache: scans continue seamlessly without Wi-Fi",
              col3: "Frequent network freeze errors at underground / low-signal venues",
            },
            {
              col1: "Data Privacy & Compliance",
              col2: "UK GDPR compliant, DPA 2018 notice, PECR cookie banner",
              col3: "Third-party ad remarketing and attendee data sharing",
            },
            {
              col1: "UK Free Trial Access",
              col2: "30-day instant free trial with no card or payment gateway needed",
              col3: "Immediate card capture or per-transaction deductions",
            },
          ],
        },

        // 10-Point Standard: Visual Product Proof
        productProof: {
          badge: "REAL-TIME ENTRY VALIDATION",
          title: "High-Speed Gate Scanning for UK Venues & Campuses",
          description:
            "From historic university halls in Oxford and Edinburgh to busy event venues in London and Manchester, volunteer staff scan attendee QR codes in under 300ms using only their phone cameras. Duplicate entries are blocked immediately across all doors.",
          type: "scanner",
        },

        features: [
          {
            icon: QrCode,
            title: "Instant Digital QR Passes",
            desc: "Attendees receive clean, branded digital QR passes via email or direct shareable link. No app download, account creation, or login required.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Browser Scanner",
            desc: "Turn any phone, tablet, or laptop into a fast gate scanner. Instant haptic feedback and clear visual cues validate valid vs duplicate tickets in <0.3s.",
          },
          {
            icon: Zap,
            title: "Offline Scanning Engine",
            desc: "Scans validate locally using cached attendee databases when venue Wi-Fi or mobile reception drops, syncing back automatically when reconnected.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & PECR Compliant",
            desc: "Your attendee data belongs exclusively to you. Built with strict UK Data Protection Act 2018 controls, Article 17 erasure requests, and compliant cookie consent.",
          },
          {
            icon: Building2,
            title: "Students' Union & Society Ready",
            desc: "Capture university-specific fields including Student ID, department, society membership number, dietary requirements, and emergency contacts.",
          },
          {
            icon: Banknote,
            title: "Zero Commission Ticketing",
            desc: "Keep 100% of your ticket revenue. Simple monthly or annual subscriptions in GBP (£) with zero per-ticket percentage cuts.",
          },
        ],

        // 10-Point Standard: 5 Step How It Works
        steps: [
          {
            n: "01",
            title: "Create Your Event",
            desc: "Set up your event title, date in DD/MM/YYYY, venue, and customise registration fields like Student ID and society name.",
          },
          {
            n: "02",
            title: "Distribute Registration Link",
            desc: "Share your clean event URL across WhatsApp, Instagram, email newsletters, or embed directly into your website.",
          },
          {
            n: "03",
            title: "Issue QR Passes",
            desc: "Approve registrations automatically or manually. Attendees receive instant digital QR passes directly to their inbox.",
          },
          {
            n: "04",
            title: "Scan at the Entrance",
            desc: "Open the scanner URL on volunteer smartphones. Point the camera at attendee QR passes for instant green check-in.",
          },
          {
            n: "05",
            title: "Track Live Attendance",
            desc: "Watch real-time check-in percentages, entrance velocity, and gate analytics update live on your organiser dashboard.",
          },
        ],

        // 10-Point Standard: Deep-Dive Sections
        deepDiveSections: [
          {
            badge: "COMMISSION-FREE TICKETING",
            title: "Why UK Organisers Are Moving Away from Eventbrite's Commission Model",
            paragraphs: [
              "For years, UK event organisers, students' unions, and professional meetup hosts have been forced to give up 5% to 8% of every ticket sold to ticketing giants. On a 500-person conference charging £30 per ticket, legacy platforms skim over £1,100 in arbitrary processing fees and convenience charges.",
              "URPASS operates on a transparent SaaS subscription model: you pay a flat monthly fee starting at £15/mo for Starter, £35/mo for Pro, or £79/mo for Business — or use our Free plan for small events. Every single pound from your ticket sales stays with your organisation.",
            ],
            bullets: [
              "No surprise per-ticket deduction upon payout",
              "No buyer surcharge added at checkout basket",
              "Direct attendee relationship with zero third-party cross-selling",
              "Unlimited check-ins across multiple entrances included in all plans",
            ],
            takeaway: "Save thousands of pounds each semester or conference cycle by switching to zero-commission software.",
          },
          {
            badge: "CAMPUS & HIGHER EDUCATION",
            title: "Built Specifically for UK Universities, Students' Unions & Societies",
            paragraphs: [
              "University events face unique logistical challenges: committee handovers every academic year, strict data privacy guidelines, large freshers' fair crowds, and fluctuating budgets. Traditional tools require clunky hardware or charge commercial rates that drain society funds.",
              "URPASS gives students' unions and societies full control over multi-gate entry, attendee capacity limits, and custom registration questionnaires. Committee members can run check-ins from their personal phones without installing any app from the App Store or Google Play.",
            ],
            bullets: [
              "Custom fields for Student ID, course, college, and dietary needs",
              "Multi-committee access with role-based permissions",
              "Sub-second verification preventing queue buildup in unpredictable UK weather",
              "Comprehensive CSV exports for university administration reporting",
            ],
            takeaway: "Empower student committees with enterprise-grade event technology that respects student budgets.",
          },
        ],

        useCases: [
          "Students' Union Events & Freshers' Fairs",
          "University Academic Conferences & Symposiums",
          "Tech Meetups & Developer Hackathons",
          "Corporate Seminars & Training Days",
          "Independent Music & Arts Performances",
          "Society AGMs & Social Mixers",
          "Charity Galas & Fundraising Dinners",
          "Sports Club Matches & Tournaments",
        ],

        relatedLinks: [
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
            title: "Birmingham Event Registration & Check-In",
            href: "/uk/birmingham",
            category: "Location",
          },
          {
            title: "Edinburgh Event Registration & Check-In",
            href: "/uk/edinburgh",
            category: "Location",
          },
          {
            title: "Bristol Event Registration & Check-In",
            href: "/uk/bristol",
            category: "Location",
          },
          {
            title: "Zero Commission Event Ticketing UK",
            href: "/zero-commission-event-ticketing-uk",
            category: "Product",
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

        // 10-Point Standard: 5–8 FAQs
        faqs: [
          {
            q: "How does the 30-day free trial work for UK organisers?",
            a: "UK organisers can activate a 30-day free trial of Starter, Pro, or Business directly from their account dashboard. No credit card, debit card, or payment gateway details are required. You get immediate, full access to all features of that plan for 30 days.",
          },
          {
            q: "What are the UK pricing plans after the free trial?",
            a: "URPASS offers simple, transparent GBP pricing: Free (£0 forever for up to 100 registrations/month), Starter (£15/month or £120/year for 500 registrations), Pro (£35/month or £300/year for 2,500 registrations), and Business (£79/month or £699/year for 10,000 registrations). Unlike Eventbrite, we take 0% commission on your ticket sales.",
          },
          {
            q: "Do volunteer scanners need to download an app from the App Store?",
            a: "No. URPASS gate scanning runs entirely in any modern web browser (Safari, Chrome, Edge) on iOS and Android smartphones. Organisers simply share a secure check-in PIN or link with volunteers. Volunteers open the camera in the browser and scan tickets in <0.3s.",
          },
          {
            q: "How does URPASS comply with UK GDPR and PECR?",
            a: "URPASS is fully compliant with the UK General Data Protection Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and Electronic Communications Regulations (PECR). Attendee data is stored securely, never sold or shared with advertisers, and can be exported or permanently deleted at any time upon request.",
          },
          {
            q: "What happens if venue Wi-Fi drops at the entrance doors?",
            a: "URPASS features an intelligent offline caching engine. When your door staff load the scanner session, the approved attendee roster is cached in the browser. Passes validate in real-time even with zero internet signal, and synchronize automatically when connectivity is restored.",
          },
          {
            q: "Can we collect university Student IDs during registration?",
            a: "Yes. URPASS allows you to configure unlimited custom registration fields on paid plans (and up to 3 on Free). You can easily require Student ID, college affiliation, year of study, dietary requirements, and custom disclaimers.",
          },
          {
            q: "Can multiple entrances scan tickets simultaneously?",
            a: "Yes. URPASS synchronises check-in records across unlimited scanner devices in real-time. If an attendee tries to present the same QR code at Entrance A and Entrance B, the second scan immediately flags a prominent red 'ALREADY CHECKED IN' alert with exact timestamp.",
          },
        ],

        ctaTitle: "Ready to run your next UK event with 0% commission?",
        ctaDescription: "Activate your 30-day free trial today. No credit card required. Up and running in minutes.",
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
