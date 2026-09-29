import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Building2,
  Smartphone,
  Banknote,
  Users,
  Zap,
  Clock,
  Sparkles,
  Layers,
  MapPin,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration & QR Check-In Software Belfast | URPASS",
  description:
    "High-speed event registration and QR check-in software for Belfast conferences, ICC Belfast exhibitions, and Queen's University Belfast societies. 0.28s phone scanning, 0% ticket commission, and UK GDPR compliance.",
  keywords: [
    "event registration software belfast",
    "qr event check-in belfast",
    "event ticketing software belfast northern ireland",
    "queens university belfast society tickets",
    "icc belfast event check in app",
    "eventbrite alternative belfast",
    "titanic belfast conference registration",
  ],
  alternates: { canonical: "https://urpass.space/uk/belfast" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Belfast | URPASS",
    description:
      "Run seamless event check-ins across Belfast venues. Sub-second QR scanning, multi-gate sync, and 0% ticket commission.",
    url: "https://urpass.space/uk/belfast",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-BFS",
    "geo.placename": "Belfast",
    "geo.position": "54.5973;-5.9301",
    "ICBM": "54.5973, -5.9301",
  },
};

export default function BelfastEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/belfast",
        badge: "BELFAST & NORTHERN IRELAND EVENT TECH",
        h1: "Event Registration & QR Check-In Software for Belfast Events",
        description:
          "Keep entrance lines flowing across ICC Belfast, Titanic Belfast, Queen's University Belfast, and Ulster University venues. Turn volunteer smartphones into instant QR scanners with <0.28s validation, real-time multi-gate sync, and 0% platform ticket fees.",
        ctaLabel: "Start free in Belfast",

        geo: {
          region: "Northern Ireland",
          placename: "Belfast",
          position: "54.5973;-5.9301",
          latitude: 54.5973,
          longitude: -5.9301,
          country: "United Kingdom",
          countryCode: "GB",
        },

        directAnswer: {
          title: "How Event Organizers in Belfast Use URPASS",
          summary:
            "Belfast is home to a booming technology ecosystem in the Cathedral Quarter and Titanic Quarter, alongside major academic conferences at Queen's University Belfast and high-capacity expos at ICC Belfast. URPASS enables local event organizers to set up custom registration forms, automatically deliver mobile QR tickets with Apple Wallet integration, and check in delegates in under 0.28 seconds using any smartphone browser.",
          keyPoints: [
            "Queen's University & Ulster: Ideal for student society balls, hackathons, and academic seminars",
            "In-Browser Scanner: <0.28s gate validation without downloading native apps from app stores",
            "Zero Platform Fees: 0% per-ticket commission, plus a permanent free tier for free events",
            "UK GDPR & PECR Compliant: Data stored with strict privacy standards and full organizer ownership",
          ],
        },

        productProof: {
          badge: "SUB-SECOND GATE ENTRY",
          title: "Instant In-Browser Phone Scanner",
          description:
            "Volunteers open a simple link in Safari or Chrome. Instant optical QR decoding with audible chimes and anti-fraud duplicate detection.",
          type: "scanner",
        },

        features: [
          {
            icon: QrCode,
            title: "Digital Passes & Apple Wallet",
            desc: "Personalized mobile passes delivered upon registration, complete with anti-counterfeit QR codes and Apple/Google Wallet support.",
          },
          {
            icon: ScanLine,
            title: "0.28s Gate Check-In",
            desc: "Turn any volunteer's smartphone camera into an ultra-fast scanner with sub-second optical verification and haptic feedback.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Fraud Duplicate Lock",
            desc: "Prevent ticket forwarding and screenshot re-use. Tickets lock across all venue doors immediately upon first scan.",
          },
          {
            icon: Banknote,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your ticket revenues. Direct daily or T+2 payouts via Stripe into your UK business bank account.",
          },
          {
            icon: Users,
            title: "Student ID & Custom Fields",
            desc: "Collect Queen's University student IDs, company names, or dietary requirements directly on your registration form.",
          },
          {
            icon: Building2,
            title: "Multi-Gate Cloud Sync",
            desc: "Coordinate entry teams across multiple doors at ICC Belfast, Titanic Belfast, or university lecture halls.",
          },
        ],

        steps: [
          { n: "01", title: "Create Event", desc: "Set up your Belfast event details, ticket categories, and capacity limits in 2 minutes." },
          { n: "02", title: "Share Public Link", desc: "Share your clean event URL across student societies, WhatsApp, and social media." },
          { n: "03", title: "Deliver Passes", desc: "Attendees receive verified mobile QR passes with instant wallet sync." },
          { n: "04", title: "Scan at Doors", desc: "Volunteers scan attendee passes in under 0.28s with zero door queues." },
        ],

        callout: {
          badge: "NORTHERN IRELAND READY",
          title: "Built for Belfast student societies, conferences, and community gatherings",
          description:
            "Say goodbye to printed paper rosters and slow name lookups. URPASS brings modern, professional entry control to events across Northern Ireland.",
          bullets: [
            "Permanent free plan available for free community & society events",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Instant multi-door cloud sync across venue entry gates",
            "Full UK GDPR compliance with one-click CSV attendance exports",
          ],
        },

        useCases: [
          "Queen's University Belfast & Ulster University society events",
          "Tech, Cybersecurity & FinTech meetups in Cathedral Quarter",
          "ICC Belfast industry conferences & commercial expos",
          "Creative arts & cultural events in Titanic Quarter",
          "Charity fundraisers, sports tournaments & community socials",
        ],

        faqs: [
          {
            q: "Can student societies in Belfast use URPASS for free?",
            a: "Yes! URPASS provides a permanent free plan with no credit card required, allowing student societies to host up to 50 attendees per event with digital QR passes and unlimited scanning.",
          },
          {
            q: "Do Belfast event staff need special scanning equipment?",
            a: "No! Organizers share a private scanner link. Staff simply open it in Safari or Chrome on their personal smartphones and begin scanning passes in under 0.28 seconds.",
          },
          {
            q: "Does URPASS charge per-ticket fees for paid events in Northern Ireland?",
            a: "No! URPASS charges 0% platform ticket fees. You only pay standard Stripe payment processing fees, and payouts flow directly into your UK bank account in GBP (£).",
          },
          {
            q: "Is attendee personal data handled in accordance with UK GDPR?",
            a: "Yes. All attendee data is encrypted and handled in strict compliance with the UK Data Protection Act 2018 and UK GDPR.",
          },
        ],

        ctaTitle: "Power your Belfast event with URPASS",
        ctaDescription: "Permanent free plan · Apple Wallet passes · 0.28s gate scanning · 0% ticket fees",
      }}
    />
  );
}
