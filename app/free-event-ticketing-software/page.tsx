import type { Metadata } from "next";
import {
  Ticket,
  QrCode,
  ScanLine,
  Gift,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Free Event Ticketing Software with QR Check-In | URPASS",
  description:
    "Free event ticketing software for workshops, college events, and conferences. Issue digital QR tickets, scan attendees at the entrance, and manage RSVPs at ₹0 forever.",
  keywords: [
    "free event ticketing software",
    "free event ticketing platform",
    "free qr ticketing software",
    "free online event ticketing",
    "event ticketing software free",
    "free ticket generator for events",
  ],
  alternates: {
    canonical: "https://urpass.space/free-event-ticketing-software",
  },
  openGraph: {
    title: "Free Event Ticketing Software with QR Check-In | URPASS",
    description:
      "Ticket your free events at zero cost. Digital QR tickets, mobile phone gate scanning, and permanent free plan with no credit card required.",
    url: "https://urpass.space/free-event-ticketing-software",
    locale: "en_IN",
    type: "website",
  },
};

export default function FreeEventTicketingSoftwarePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/free-event-ticketing-software",
        badge: "PERMANENT FREE TIER",
        h1: "Free Event Ticketing Software With QR Check-In",
        description:
          "Ticket your community events, student meetups, and workshops at zero cost. Issue encrypted mobile QR tickets, scan attendees at the door using any phone camera, and monitor attendance in real time.",
        ctaLabel: "Create Your Event Free",
        directAnswer: {
          title: "Is There Free Event Ticketing Software with QR Passes?",
          summary:
            "Yes. URPASS offers a permanent free tier specifically designed for non-profit gatherings, university clubs, and community organizers. Unlike commercial ticketing engines that charge per-ticket fees or impose 14-day trials, URPASS provides automated digital QR ticket generation, custom registration fields, and in-browser camera scanning for up to 50 attendees per event at ₹0 forever with no credit card required.",
          keyPoints: [
            "Permanently Free: ₹0 forever for up to 50 attendees per event (no trial expiration)",
            "Zero Setup Fees: No credit card or billing information needed to launch",
            "Digital QR Passes: Personalized mobile tickets delivered directly to attendees",
            "Phone Camera Scanner: <0.28s in-browser gate validation with duplicate prevention",
          ],
        },
        productProof: {
          badge: "ZERO COST TICKETING",
          title: "Complete Ticketing & Scanning Toolkit",
          description:
            "Create your ticket types, configure registration questions, and scan attendees at the venue entrance without downloading native apps.",
          type: "passes",
        },
        features: [
          {
            icon: Ticket,
            title: "Multiple Ticket Tiers",
            desc: "Configure General Admission, Student Pass, or VIP tiers with customized capacity limits and automated sold-out triggers.",
          },
          {
            icon: QrCode,
            title: "Automated QR Passes",
            desc: "Every attendee receives a personalized mobile pass with anti-fraud verification and Apple/Google Wallet integration.",
          },
          {
            icon: ScanLine,
            title: "Sub-Second In-Browser Scanner",
            desc: "Scan and validate ticket barcodes in under 0.28s directly in any mobile browser without installing third-party apps.",
          },
          {
            icon: ShieldCheck,
            title: "Duplicate Ticket Lockout",
            desc: "Prevent ticket forwarding and screenshot fraud. Each digital pass can only be checked in once at the gates.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Gate Analytics",
            desc: "Monitor live check-in counts, arrival velocity, and gate capacity from your centralized organizer dashboard.",
          },
          {
            icon: Gift,
            title: "Zero Hidden Fees",
            desc: "No transaction fees, no per-ticket deductions, and no credit card required to access the permanent free tier.",
          },
        ],
        steps: [
          { n: "01", title: "Create Tickets", desc: "Set up your event name, ticket tiers, and capacity in 2 minutes." },
          { n: "02", title: "Publish Link", desc: "Share your clean, fast-loading event link across messaging apps and social." },
          { n: "03", title: "Deliver Passes", desc: "Attendees register and receive encrypted QR passes instantly." },
          { n: "04", title: "Scan at Door", desc: "Volunteers scan attendee badges with any smartphone camera." },
        ],
        callout: {
          badge: "COMMUNITY-FIRST ARCHITECTURE",
          title: "Ticket your free event at zero cost forever",
          description:
            "Stop paying platform fees for zero-cost community events. URPASS gives you enterprise-grade ticketing and access control at ₹0.",
          bullets: [
            "Permanent free plan with no credit card required",
            "Up to 50 attendees free per event",
            "In-browser smartphone camera scanning (<0.28s)",
            "One-click CSV exports with verified arrival timestamps",
          ],
        },
        useCases: [
          "College tech fests & campus workshops",
          "Student club meetups & hackathons",
          "Professional webinars & skill seminars",
          "Open source developer meetups",
          "Non-profit & community social events",
        ],
        faqs: [
          {
            q: "Is URPASS free ticketing software really free?",
            a: "Yes! URPASS provides a permanent free plan with ₹0 platform fees for up to 50 attendees per event (and up to 100 registrations per month across events) with full QR pass issuance and in-browser camera scanning.",
          },
          {
            q: "Can I upgrade to paid tickets later?",
            a: "Yes. When you are ready to sell paid tickets, you can connect Razorpay (for India UPI/cards) or Stripe (for global cards) and upgrade to Starter or Pro plans with 0% ticketing commission.",
          },
          {
            q: "How do volunteers scan tickets at the door?",
            a: "Organizers share a secure scanner link. Volunteers open it in Safari or Chrome on their smartphones, grant camera access, and scan tickets in under 0.28 seconds.",
          },
          {
            q: "Does URPASS display ads on my free event pages?",
            a: "No! URPASS never displays third-party ads or competitor listings on your registration pages. Your event remains clean and branded.",
          },
        ],
        ctaTitle: "Start ticketing your free event today",
        ctaDescription: "₹0 to start · No credit card · QR passes included",
      }}
    />
  );
}
