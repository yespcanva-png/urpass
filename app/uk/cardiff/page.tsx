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
  title: "Event Registration & QR Check-In Software Cardiff | URPASS",
  description:
    "High-speed event registration and QR check-in software for Cardiff events, university societies at Cardiff University, and conferences across South Wales. 0.28s phone scanning, 0% ticket commission, and UK GDPR compliance.",
  keywords: [
    "event registration software cardiff",
    "qr event check-in cardiff",
    "event ticketing software cardiff wales",
    "cardiff university society ticketing",
    "wales event ticketing software",
    "eventbrite alternative cardiff",
    "cardiff conference check in",
  ],
  alternates: { canonical: "https://urpass.space/uk/cardiff" },
  openGraph: {
    title: "Event Registration & QR Check-In Software Cardiff | URPASS",
    description:
      "Run seamless event check-ins across Cardiff venues. Sub-second QR scanning, multi-gate sync, and 0% ticket commission.",
    url: "https://urpass.space/uk/cardiff",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB-CRF",
    "geo.placename": "Cardiff",
    "geo.position": "51.4816;-3.1791",
    "ICBM": "51.4816, -3.1791",
  },
};

export default function CardiffEventTicketingPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/cardiff",
        badge: "CARDIFF & SOUTH WALES EVENT TECH",
        h1: "Event Registration & QR Check-In Software for Cardiff Events",
        description:
          "Keep entrance lines flowing across Cardiff University, Cardiff Metropolitan, Wales Millennium Centre, and South Wales venues. Turn volunteer smartphones into instant QR scanners with <0.28s validation, real-time multi-gate sync, and 0% platform ticket fees.",
        ctaLabel: "Start free in Cardiff",

        geo: {
          region: "Wales",
          placename: "Cardiff",
          position: "51.4816;-3.1791",
          latitude: 51.4816,
          longitude: -3.1791,
          country: "United Kingdom",
          countryCode: "GB",
        },

        directAnswer: {
          title: "How Event Organizers in Cardiff Use URPASS",
          summary:
            "Cardiff has a vibrant event ecosystem spanning student societies at Cardiff Students' Union, tech meetups in the Welsh capital, academic conferences, and cultural events. URPASS provides local event organizers with an intuitive platform to create custom registration forms, automatically issue mobile QR passes with Apple Wallet integration, and check in attendees at venue doors in under 0.28 seconds using any smartphone browser.",
          keyPoints: [
            "Cardiff University & Societies: Ideal for student union balls, club workshops, and academic talks",
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
            desc: "Personalized mobile passes sent immediately upon registration, complete with anti-fraud QR signatures and Apple/Google Wallet support.",
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
            desc: "Collect Cardiff student roll numbers, dietary preferences, or company designations directly on the registration form.",
          },
          {
            icon: Building2,
            title: "Multi-Gate Cloud Sync",
            desc: "Coordinate entry teams across multiple doors at Motorpoint Arena, Cardiff City Stadium, or university halls.",
          },
        ],

        steps: [
          { n: "01", title: "Create Event", desc: "Set up your Cardiff event details, ticket categories, and capacity limits in 2 minutes." },
          { n: "02", title: "Share Public Link", desc: "Share your clean event URL across student societies, WhatsApp, and social media." },
          { n: "03", title: "Deliver Passes", desc: "Attendees receive verified mobile QR passes with instant wallet sync." },
          { n: "04", title: "Scan at Doors", desc: "Volunteers scan attendee passes in under 0.28s with zero door queues." },
        ],

        callout: {
          badge: "WALES READY",
          title: "Built for Cardiff student societies, conferences, and community gatherings",
          description:
            "Say goodbye to printed paper rosters and slow name lookups. URPASS brings modern, professional entry control to events across South Wales.",
          bullets: [
            "Permanent free plan available for free community & society events",
            "In-browser scanner runs on any mobile device (<0.28s)",
            "Instant multi-door cloud sync across venue entry gates",
            "Full UK GDPR compliance with one-click CSV attendance exports",
          ],
        },

        useCases: [
          "Cardiff University & Cardiff Met student society events",
          "Tech, Web & AI meetups in Cardiff Bay and Central Square",
          "South Wales academic symposiums & medical conferences",
          "Creative arts & cultural events at Wales Millennium Centre",
          "Charity fundraisers, sports tournaments & community socials",
        ],

        faqs: [
          {
            q: "Can student societies at Cardiff University use URPASS for free?",
            a: "Yes! URPASS provides a permanent free plan with no credit card required, allowing student societies to host up to 50 attendees per event with digital QR passes and unlimited scanning.",
          },
          {
            q: "Do Cardiff event staff need special scanning equipment?",
            a: "No! Organizers share a private scanner link. Staff simply open it in Safari or Chrome on their personal smartphones and begin scanning passes in under 0.28 seconds.",
          },
          {
            q: "Does URPASS charge per-ticket fees for paid events in Wales?",
            a: "No! URPASS charges 0% platform ticket fees. You only pay standard Stripe payment processing fees, and payouts flow directly into your UK bank account.",
          },
          {
            q: "Is attendee personal data handled in accordance with UK GDPR?",
            a: "Yes. All attendee data is encrypted and handled in strict compliance with the UK Data Protection Act 2018 and UK GDPR.",
          },
        ],

        ctaTitle: "Power your Cardiff event with URPASS",
        ctaDescription: "Permanent free plan · Apple Wallet passes · 0.28s gate scanning · 0% ticket fees",
      }}
    />
  );
}
