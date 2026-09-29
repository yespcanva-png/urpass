import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Building2,
  Banknote,
  Users,
  Zap,
  BarChart3,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Ticketing Software UK — 0% Commission | URPASS",
  description:
    "UK event ticketing software with 0% platform commission. Issue digital QR tickets, manage registrations, scan attendees in <0.3s with smartphone browsers, and stay fully UK GDPR compliant. Transparent GBP (£) pricing.",
  keywords: [
    "event ticketing software uk",
    "uk event ticketing platform",
    "zero commission event ticketing uk",
    "digital qr ticketing software uk",
    "online ticket sales uk",
    "student union ticketing software",
    "conference ticketing software uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/event-ticketing-software",
    languages: {
      "en-GB": "https://urpass.space/uk/event-ticketing-software",
      "x-default": "https://urpass.space/event-ticketing-software",
    },
  },
  openGraph: {
    title: "Event Ticketing Software UK — 0% Commission | URPASS",
    description:
      "Sell tickets and issue digital QR passes across the United Kingdom with 0% platform commission. Fast browser check-in, UK GDPR compliance, and transparent GBP plans.",
    url: "https://urpass.space/uk/event-ticketing-software",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkEventTicketingSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/event-ticketing-software",
        badge: "UK EVENT TICKETING · ZERO COMMISSION PLATFORM",
        h1: "Event Ticketing Software for UK Organisers & Venues",
        description:
          "Create branded registration pages, issue secure digital QR tickets, and admit attendees in under 0.3 seconds using standard smartphone browsers. Retain 100% of your ticket revenue with transparent GBP plans and strict UK GDPR compliance.",
        ctaLabel: "Start Free in the UK",

        // AI / GEO Direct Answer Block
        directAnswer: {
          title: "What makes URPASS the best event ticketing software in the UK?",
          summary:
            "URPASS provides UK event organisers with a zero-commission ticketing and entry management platform. Unlike traditional ticketing directories that charge 5% to 8% booking fees per ticket, URPASS operates on transparent flat monthly or annual plans in GBP (£). It includes instant digital QR tickets, browser-based gate scanning on volunteer smartphones without app downloads, and full UK GDPR and Data Protection Act 2018 compliance.",
          keyPoints: [
            "0% commission on ticket sales — save thousands compared to legacy platforms",
            "Sub-second browser QR scanning on iOS and Android devices without installing apps",
            "Automatic digital QR ticket delivery via email and shareable links",
            "Full UK GDPR compliance with self-service attendee data erasure",
          ],
        },

        // Key Facts Table
        keyFactsTable: {
          title: "UK Event Ticketing Platform Comparison",
          subtitle:
            "How URPASS delivers higher margins and smoother gate operations for British event organisers.",
          headers: ["Capability / Feature", "URPASS UK", "Traditional UK Ticketing Services"],
          rows: [
            {
              col1: "Platform Commission",
              col2: "0% Commission (Keep 100% of ticket sales)",
              col3: "5% to 8% + booking fee per ticket",
            },
            {
              col1: "Ticket Format",
              col2: "Mobile-optimised digital QR passes (no app download needed)",
              col3: "PDF attachments or proprietary mobile app tickets",
            },
            {
              col1: "Gate Check-In Speed",
              col2: "<0.3 seconds per attendee via browser camera",
              col3: "2–4 seconds via third-party app or paper lists",
            },
            {
              col1: "Hardware Requirements",
              col2: "Standard smartphones (Safari, Chrome, Edge)",
              col3: "Rented handheld laser scanners or dedicated devices",
            },
            {
              col1: "Data Privacy & Governance",
              col2: "Strict UK GDPR, DPA 2018, PECR compliance",
              col3: "Attendee data pooled for marketplace remarketing",
            },
            {
              col1: "UK Free Trial",
              col2: "30-day instant free trial (no card required)",
              col3: "Immediate setup charges or percentage deductions",
            },
          ],
        },

        features: [
          {
            icon: QrCode,
            title: "Dynamic Digital QR Tickets",
            desc: "Issue cryptographically signed digital QR tickets that prevent forgery and duplicate entrance. Passes render cleanly on smartphones.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Smartphone Scanner",
            desc: "Admit attendees with a rapid <0.3s camera scan. Volunteers simply open a link in their phone browser without installing anything.",
          },
          {
            icon: Banknote,
            title: "Zero Commission on Ticket Sales",
            desc: "Keep 100% of your ticket earnings. Simple subscription plans in GBP (£) from £0 to £79/mo with zero per-ticket cuts.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR & DPA 2018 Compliant",
            desc: "Designed from the ground up for UK data protection laws. Your attendees' information is private and never sold or remarketed.",
          },
          {
            icon: Zap,
            title: "Offline Entrance Resilience",
            desc: "Local browser caching ensures that scanning continues uninterrupted even if Wi-Fi or cellular service drops at the entrance.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Intelligence",
            desc: "Monitor real-time entrance velocity, peak arrival times, and check-in percentages across all doors on your organiser dashboard.",
          },
        ],

        steps: [
          {
            n: "01",
            title: "Build Your Event Page",
            desc: "Customise your event details, date, venue, ticket tiers, and required attendee information fields.",
          },
          {
            n: "02",
            title: "Distribute Ticketing Link",
            desc: "Share your clean event registration URL directly with your audience across email, social media, and web channels.",
          },
          {
            n: "03",
            title: "Automated Ticket Delivery",
            desc: "Attendees receive their personalised digital QR tickets immediately upon registration or approval.",
          },
          {
            n: "04",
            title: "Scan at the Entrance",
            desc: "Door staff open the browser scanner on their smartphones and scan QR passes with instant green verification cues.",
          },
          {
            n: "05",
            title: "Review Analytics & Export",
            desc: "Access instant attendance statistics, export CSV reports, and analyze check-in timing across your entrances.",
          },
        ],

        deepDiveSections: [
          {
            badge: "FINANCIAL ADVANTAGE",
            title: "How Eliminating Ticket Commission Protects Your Event Budget",
            paragraphs: [
              "When ticketing platforms deduct 6% to 8% of every ticket, large UK events lose thousands of pounds that should fund venue hire, catering, or marketing. On a 1,000-ticket London conference at £50 per ticket, commission fees alone total upwards of £3,500.",
              "URPASS eliminates per-ticket fees entirely. Whether you sell 50 tickets or 5,000 tickets, you pay only your predictable subscription fee in GBP (£). This transparent structure ensures that every pound earned stays within your budget.",
            ],
            bullets: [
              "Predictable monthly or annual accounting in GBP (£)",
              "No surprise deductions or currency conversion fees",
              "Direct attendee payouts through your chosen merchant setup",
              "Zero attendee booking surcharges at checkout",
            ],
            takeaway: "Maximise event margins with zero-commission ticketing technology built for UK organisers.",
          },
          {
            badge: "VENUE RESILIENCE",
            title: "Fast Gate Throughput for UK Weather and Busy Venues",
            paragraphs: [
              "British weather makes entrance speed critical: slow scanning causes outdoor queues in the rain, attendee frustration, and delayed event starts. URPASS utilizes camera-optimised WebRTC scanning capable of reading QR codes from 30 centimetres away in under 300 milliseconds.",
              "Even in basement exhibition centres or historic listed buildings where mobile reception is poor, URPASS caches attendee rosters locally in the scanner browser so entry never stops.",
            ],
            bullets: [
              "Haptic vibration and visual sound feedback on successful scan",
              "Immediate red warning for duplicate or previously scanned passes",
              "Works reliably in low-light and dim auditorium conditions",
              "Multi-door synchronization in real-time across unlimited devices",
            ],
            takeaway: "Eliminate queue bottlenecks and protect attendee experience with sub-second gate validation.",
          },
        ],

        useCases: [
          "Commercial Conferences & Summits",
          "University Students' Union Events",
          "Music & Arts Performances",
          "Technology & Developer Meetups",
          "Corporate Workshops & Training",
          "Charity Galas & Award Evenings",
        ],

        relatedLinks: [
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "UK Event Registration Software",
            href: "/uk/event-registration-software",
            category: "Product",
          },
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "University Event Management Software UK",
            href: "/uk/university-event-software",
            category: "Use Case",
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
        ],

        faqs: [
          {
            q: "How does 0% commission event ticketing work in the UK?",
            a: "With URPASS, you do not pay any percentage commission or per-ticket fee on your registrations or ticket sales. You simply subscribe to a transparent monthly or annual plan in GBP (£) (or use our Free tier for up to 100 registrations/month). All ticket revenue is collected directly by you without deductions.",
          },
          {
            q: "Can I try URPASS before committing to a paid plan in the UK?",
            a: "Yes. UK organisers can activate a 30-day free trial of Starter, Pro, or Business directly with no credit card required. You get immediate, unrestricted access to explore all ticketing, registration, and check-in tools.",
          },
          {
            q: "What devices can door staff use to scan tickets?",
            a: "Any modern smartphone, tablet, or laptop equipped with a web browser and camera can scan tickets. Organisers share a secure scanner link with volunteers, who can scan passes immediately without downloading an app from the App Store or Google Play Store.",
          },
          {
            q: "Is attendee data compliant with UK GDPR regulations?",
            a: "Yes. URPASS is built in full compliance with the UK GDPR, Data Protection Act 2018, and PECR. Attendee information is encrypted, securely stored, never sold or shared with third-party advertisers, and can be exported or purged on demand.",
          },
          {
            q: "Can I sell both free and paid tickets for the same event?",
            a: "Yes. URPASS allows you to configure multiple ticket categories, such as Early Bird, General Admission, VIP, or Free Student passes, each with their own capacity limits and custom registration fields.",
          },
        ],

        ctaTitle: "Upgrade your UK event ticketing today",
        ctaDescription:
          "Start your 30-day free trial on URPASS. Zero commission, rapid browser scanning, and full UK GDPR compliance.",
      }}
    />
  );
}
