import type { Metadata } from "next";
import {
  Ticket,
  QrCode,
  ScanLine,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  BarChart3,
  CheckCircle2,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "How to Create QR Tickets for an Event: Step-by-Step Guide | URPASS",
  description:
    "Learn how to create digital QR tickets for your event in 4 simple steps. Free online ticket generator with phone scanning and anti-fraud duplicate lockout.",
  keywords: [
    "how to create qr tickets for an event",
    "create qr code tickets for event",
    "generate event qr code tickets",
    "event qr ticket generator free",
    "how to make qr passes for event",
    "qr code event ticketing guide",
  ],
  alternates: {
    canonical: "https://urpass.space/how-to-create-qr-tickets-for-an-event",
  },
  openGraph: {
    title: "How to Create QR Tickets for an Event | URPASS",
    description:
      "Complete step-by-step guide to generating digital QR tickets for events. Free online ticket generator with in-browser smartphone scanning.",
    url: "https://urpass.space/how-to-create-qr-tickets-for-an-event",
    locale: "en_IN",
    type: "article",
  },
};

export default function HowToCreateQrTicketsForAnEventPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/how-to-create-qr-tickets-for-an-event",
        badge: "STEP-BY-STEP TUTORIAL",
        h1: "How to Create QR Tickets for an Event",
        description:
          "Generating secure, digital QR tickets for your event does not require hiring developers or purchasing expensive barcode printers. Follow this 4-step guide to launch your event registration and issue encrypted QR passes in under 3 minutes.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "How to Generate QR Code Tickets in 4 Steps",
          summary:
            "To create QR tickets for an event: 1. Sign up on a modern ticketing platform like URPASS (free forever tier available). 2. Set your event details, ticket categories (General, VIP), and capacity limits. 3. Share your registration link with your audience so attendees can sign up and receive personalized digital QR passes. 4. Open your phone camera scanner at the door to validate badges in 0.28 seconds with zero lines.",
          keyPoints: [
            "Step 1: Create an account on URPASS (takes 30 seconds, no credit card required)",
            "Step 2: Configure event details, dates, venue, and ticket types",
            "Step 3: Publish registration link; attendees register and receive digital QR passes automatically",
            "Step 4: Scan passes at the door using any smartphone camera in under 0.28 seconds",
          ],
        },
        productProof: {
          badge: "TICKET GENERATOR",
          title: "Automated Ticket Generation Engine",
          description:
            "Create branded tickets with attendee name, ticket category, and anti-counterfeiting QR signature.",
          type: "passes",
        },
        features: [
          {
            icon: Ticket,
            title: "Automated QR Generation",
            desc: "Every time someone registers, the system automatically generates an encrypted, unique QR pass with their verified details.",
          },
          {
            icon: Smartphone,
            title: "Apple & Google Wallet Ready",
            desc: "Attendees can view tickets on mobile web, save them as offline images, or add them directly to their smartphone wallet.",
          },
          {
            icon: ScanLine,
            title: "In-Browser Phone Scanner",
            desc: "No dedicated barcode hardware needed. Turn any volunteer's smartphone camera into a sub-0.28s gate scanner.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Counterfeiting Security",
            desc: "Cryptographically signed QR tokens prevent screenshot reuse, forged tickets, and gate-crashing.",
          },
          {
            icon: Zap,
            title: "UPI & Card Payments",
            desc: "For paid events, tickets are issued automatically upon successful payment via Google Pay, PhonePe, UPI, or cards.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Verification",
            desc: "Track which tickets have been scanned at the entrance in real time and download verified attendance reports.",
          },
        ],
        steps: [
          { n: "01", title: "Create Your Event", desc: "Sign up free and input your event title, date, venue, and ticket capacity." },
          { n: "02", title: "Share Public Link", desc: "Share your dedicated registration page via WhatsApp, social media, or email." },
          { n: "03", title: "Automated Pass Delivery", desc: "Registrants receive personalized digital QR passes with instant mobile access." },
          { n: "04", title: "Scan at Venue Doors", desc: "Point any smartphone camera at attendee badges for instant 0.28s verification." },
        ],
        callout: {
          badge: "ZERO COST",
          title: "Generate up to 50 QR tickets for free forever",
          description:
            "Host your student meetups, workshops, and community events with professional digital QR ticketing without paying a rupee.",
          bullets: [
            "Permanent free plan with no credit card required",
            "Personalized digital passes with Apple/Google Wallet support",
            "In-browser smartphone camera scanner (<0.28s)",
            "Instant duplicate ticket warning across all entrance gates",
          ],
        },
        useCases: [
          "College fests, symposiums & hackathons",
          "Workshops, training sessions & masterclasses",
          "Conferences, expos & industry summits",
          "Community networking & club meetups",
          "Private parties & corporate gatherings",
        ],
        faqs: [
          {
            q: "Can I generate QR tickets for free?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 attendees per event, including full digital QR pass generation and unlimited gate scanning.",
          },
          {
            q: "Do I need to design the QR code manually?",
            a: "No! URPASS automatically generates the QR code and ticket layout with the attendee's name, ticket tier, and anti-fraud verification hash.",
          },
          {
            q: "How do attendees show their QR tickets at the event?",
            a: "Attendees can open the ticket link on their smartphone, show the downloaded pass image, or present it from Apple Wallet or Google Wallet.",
          },
          {
            q: "How do I scan the tickets on event day?",
            a: "Simply open your organizer dashboard on any smartphone and tap 'Open Scanner'. Point your phone camera at the attendee's QR badge for instant validation in under 0.28 seconds.",
          },
        ],
        ctaTitle: "Create your event QR tickets now",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
