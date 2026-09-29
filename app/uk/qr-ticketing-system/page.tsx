import type { Metadata } from "next";
import {
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Lock,
  Zap,
  CheckCircle2,
  Banknote,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "QR Ticketing System UK — Digital Passes & Gate Control | URPASS",
  description:
    "End-to-end QR ticketing system for UK events. Issue branded digital QR passes, eliminate paper tickets, scan attendees in <0.3s with smartphone browsers, and prevent fraud. 0% ticket commission.",
  keywords: [
    "qr ticketing system uk",
    "uk digital ticket system",
    "qr code ticketing platform uk",
    "electronic event ticketing uk",
    "mobile qr tickets uk",
    "anti fraud qr ticketing uk",
  ],
  alternates: {
    canonical: "https://urpass.space/uk/qr-ticketing-system",
    languages: {
      "en-GB": "https://urpass.space/uk/qr-ticketing-system",
      "x-default": "https://urpass.space/qr-ticketing-system",
    },
  },
  openGraph: {
    title: "QR Ticketing System UK — Digital Passes & Gate Control | URPASS",
    description:
      "Generate cryptographic digital QR tickets and scan attendees seamlessly with standard smartphone browsers across the United Kingdom.",
    url: "https://urpass.space/uk/qr-ticketing-system",
    locale: "en_GB",
    type: "website",
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
  },
};

export default function UkQrTicketingSystemPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/uk/qr-ticketing-system",
        badge: "UK QR TICKETING · SECURE DIGITAL PASSES",
        h1: "QR Ticketing System for UK Events & Venues",
        description:
          "Replace outdated paper tickets and generic PDFs with modern, cryptographically signed digital QR tickets. Deliver passes instantly to attendee smartphones and validate admissions in under 0.3 seconds.",
        ctaLabel: "Generate Your First Pass Free",

        directAnswer: {
          title: "How does the URPASS UK QR ticketing system work?",
          summary:
            "The URPASS QR ticketing system combines secure digital pass generation with browser-based gate scanning. When an attendee registers or purchases a ticket, the system automatically creates a unique, encrypted QR code embedded within a branded digital mobile pass. At the venue entrance, door staff scan the code using standard smartphone cameras, verifying attendance in under 0.3 seconds while preventing duplicate entries.",
          keyPoints: [
            "Encrypted QR codes prevent ticket duplication, screenshots, and forgery",
            "Delivered automatically via email and responsive mobile web passes",
            "Browser-based camera scanning (<0.3s) without mobile app downloads",
            "0% commission on ticket sales with transparent GBP pricing",
          ],
        },

        features: [
          {
            icon: QrCode,
            title: "Cryptographic QR Generation",
            desc: "Each ticket features a tamper-proof encrypted payload that ties uniquely to the attendee record and event instance.",
          },
          {
            icon: Smartphone,
            title: "Mobile-First Digital Passes",
            desc: "Passes open instantly in any mobile browser with high-contrast QR display, event schedule, and venue directions.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second Browser Scanner",
            desc: "Scan passes with instant visual verification in <0.3s using ordinary smartphone cameras without app store installs.",
          },
          {
            icon: Lock,
            title: "Anti-Passback Protection",
            desc: "Once scanned, the ticket status updates across all entrance doors in real time to prevent pass-sharing or reuse.",
          },
          {
            icon: ShieldCheck,
            title: "UK GDPR Compliant",
            desc: "Data minimization principles ensure that attendee information is stored securely in compliance with UK privacy standards.",
          },
          {
            icon: Banknote,
            title: "Zero Commission Model",
            desc: "Collect 100% of your ticket sales without giving up 5–8% per ticket to legacy marketplace intermediaries.",
          },
        ],

        useCases: [
          "UK University Events & Campus Festivals",
          "Industry Conferences & Trade Expos",
          "Live Music, Theatre & Cultural Shows",
          "Corporate Product Launches & Seminars",
          "Sports Fixtures & Club Tournaments",
          "Charity Galas & Award Dinners",
        ],

        relatedLinks: [
          {
            title: "QR Code Event Check-In UK",
            href: "/uk/qr-code-event-check-in",
            category: "Product",
          },
          {
            title: "Event Ticketing Software UK",
            href: "/uk/event-ticketing-software",
            category: "Product",
          },
          {
            title: "Eventbrite Alternative UK",
            href: "/uk/eventbrite-alternative",
            category: "Comparison",
          },
          {
            title: "Digital Event Passes UK",
            href: "/uk/digital-event-passes",
            category: "Product",
          },
          {
            title: "London Event Registration & Check-In",
            href: "/uk/london",
            category: "Location",
          },
        ],

        faqs: [
          {
            q: "Can attendees print out their QR tickets?",
            a: "Yes. While URPASS is designed for digital mobile screens, attendees can easily print their pass. The high-contrast QR code scans just as fast from physical paper as it does from a phone screen.",
          },
          {
            q: "How does the system prevent ticket scalping and counterfeiting?",
            a: "Every QR code contains an encrypted token tied directly to the attendee's database record. When scanned at the door, the system checks whether the ticket has already been used and immediately flags duplicated or forged passes.",
          },
          {
            q: "Do attendees need to install an app to show their QR ticket?",
            a: "No. The ticket arrives as an email confirmation with a clean web pass link. Attendees simply tap the link in their email or messaging app to display the full-screen QR pass.",
          },
        ],

        ctaTitle: "Upgrade to modern QR ticketing",
        ctaDescription:
          "Start your 30-day free trial on URPASS today. Cryptographic passes, lightning check-in, and 0% ticket commission.",
      }}
    />
  );
}
