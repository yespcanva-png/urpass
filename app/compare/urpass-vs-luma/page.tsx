import type { Metadata } from "next";
import {
  Zap,
  Percent,
  CreditCard,
  ScanLine,
  ShieldCheck,
  Users,
  BarChart3,
  Smartphone,
  Layers,
  Sparkles,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "URPASS vs Luma (lu.ma): 2026 Head-to-Head Comparison",
  description:
    "Compare URPASS vs Luma (lu.ma) for event registration, ticketing commissions, mobile gate check-in, and UPI payments. See why organizers choose URPASS for 0% ticket fees and instant browser QR scanning.",
  keywords: [
    "urpass vs luma",
    "luma vs urpass",
    "luma alternative",
    "lu.ma alternative",
    "luma event ticketing fees",
    "luma upi payments",
    "qr code event check in",
  ],
  alternates: {
    canonical: "https://urpass.space/compare/urpass-vs-luma",
  },
  openGraph: {
    title: "URPASS vs Luma (lu.ma): 2026 Head-to-Head Comparison | URPASS",
    description:
      "Compare URPASS vs Luma for event registration, ticket fees, gate check-in, and UPI payments. 0% ticket commission, browser QR scanning, and Ticket Studio.",
    url: "https://urpass.space/compare/urpass-vs-luma",
    locale: "en_IN",
    type: "article",
  },
};

export default function UrpassVsLumaPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/compare/urpass-vs-luma",
        badge: "HEAD-TO-HEAD COMPARISON",
        h1: "URPASS vs Luma: Feature & Pricing Comparison",
        description:
          "Luma (lu.ma) has built a slick interface for community RSVPs, but takes up to a 5% platform fee on paid tickets and lacks localized payment rails like native Indian UPI. URPASS delivers zero ticketing commission, sub-0.3s browser gate scanning, Ticket Studio multi-ratio passes, and direct payouts.",
        ctaLabel: "Create free event on URPASS",
        directAnswer: {
          title: "URPASS vs Luma (lu.ma) in 30 Seconds",
          summary:
            "Luma is popular for tech social gatherings, but charges a 5% platform fee on paid registrations and relies primarily on Stripe checkout. URPASS is engineered for organizers running professional conferences, college fests, workshops, and meetups who want 0% per-ticket commission, instant Indian UPI (Google Pay, PhonePe, Paytm) integration, sub-0.3s browser camera scanning without requiring volunteers to download apps, and full Ticket Studio pass customization.",
          keyPoints: [
            "Platform Fee: URPASS charges 0% per-ticket commission vs Luma taking 5% on ticket sales",
            "Payment Rails: Native Razorpay UPI QR & Net Banking + Stripe vs Luma's Stripe-centric checkout",
            "Gate Check-In: Sub-0.3s mobile browser scanner with PIN verification vs Luma basic mobile check-in",
            "Pass Design: Multi-ratio Ticket Studio (380x680, 780x340, 440x640) with custom hex colors",
          ],
        },
        competitorComparison: {
          title: "Detailed Capability Breakdown: URPASS vs Luma",
          subtitle: "Documented features and operational workflows compared side by side.",
          competitorName: "Luma (lu.ma)",
          sourceCitations: [
            "Luma Pricing & Documentation (2025/2026)",
            "URPASS Platform Technical Specifications",
          ],
          rows: [
            {
              criteria: "Platform Ticket Commission",
              urpass: "0% per-ticket fee (Flat subscription or ₹0 Free tier)",
              competitor: "5% platform fee per paid registration",
              urpassAdvantage: true,
            },
            {
              criteria: "Indian UPI Payment Rails",
              urpass: "Native UPI QR, PhonePe, Google Pay, Paytm, RuPay via Razorpay",
              competitor: "Stripe-based card payments (limited UPI support)",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Scanner Setup",
              urpass: "In-browser web camera (<0.3s) — Zero app download required",
              competitor: "Requires mobile app or desktop dashboard check-in",
              urpassAdvantage: true,
            },
            {
              criteria: "Offline Gate Check-In",
              urpass: "IndexedDB offline manifest caching during network dropouts",
              competitor: "Requires active internet connectivity",
              urpassAdvantage: true,
            },
            {
              criteria: "Custom Ticket Design Studio",
              urpass: "Ticket Studio: 3 card ratios, hex colors, logos, and badge layouts",
              competitor: "Standard fixed RSVP pass styling",
              urpassAdvantage: true,
            },
            {
              criteria: "Multi-Gate Duplicate Protection",
              urpass: "Atomic transaction lock with audio chime & red duplicate banner",
              competitor: "Check-in state update via API",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Plan Attendee Limit",
              urpass: "Permanent ₹0 Free tier (up to 100 registrations/month)",
              competitor: "Free events supported with branding",
              urpassAdvantage: false,
            },
            {
              criteria: "AI & Model Context Protocol (MCP)",
              urpass: "Official 10-tool MCP server for Claude Desktop & Cursor",
              competitor: "No Model Context Protocol integration",
              urpassAdvantage: true,
            },
          ],
        },
        features: [
          {
            icon: Percent,
            title: "0% Ticket Commission",
            desc: "Don't sacrifice 5% of your event revenue. Keep every rupee or pound earned on paid tickets through flat software pricing.",
          },
          {
            icon: CreditCard,
            title: "Native UPI & Instant Payouts",
            desc: "Attendees pay in seconds using their preferred UPI apps (PhonePe, GPay, Paytm) with direct T+2 settlement into your bank account.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Mobile Browser Scanner",
            desc: "Volunteers open a secure link on any smartphone browser to scan attendee QR codes in under 0.3 seconds. No app installs needed.",
          },
          {
            icon: ShieldCheck,
            title: "Atomic Anti-Duplicate Lockout",
            desc: "Prevent ticket forwarding and screenshot fraud. Once scanned, passes immediately lock across all entrance gates.",
          },
          {
            icon: Layers,
            title: "Ticket Studio Customization",
            desc: "Choose from vertical badge (380x680), horizontal boarding pass (780x340), or square wallet pass (440x640) with custom hex accents.",
          },
          {
            icon: Sparkles,
            title: "Model Context Protocol (MCP) AI Ops",
            desc: "Connect your event directly to Claude or AI agents to monitor attendance, query registration lists, and automate gate check-ins.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Create Event & Ticket Tiers",
            desc: "Configure paid or free tickets, capacity caps, and custom registration fields.",
          },
          {
            n: "02",
            title: "Design Custom Passes",
            desc: "Use Ticket Studio to pick aspect ratios, upload brand logos, and apply color palettes.",
          },
          {
            n: "03",
            title: "Share Fast Registration Link",
            desc: "Distribute your clean, mobile-first registration page with zero competitor ads.",
          },
          {
            n: "04",
            title: "Auto-Deliver Dynamic Passes",
            desc: "Attendees receive cryptographically signed QR tickets with instant calendar additions.",
          },
          {
            n: "05",
            title: "Sub-0.3s Door Admission",
            desc: "Gate staff scan passes at high speed using their phone cameras with zero app downloads.",
          },
        ],
        callout: {
          badge: "FEE SAVINGS",
          title: "Save 5% on every paid ticket sale.",
          description:
            "On a ₹2,000 conference ticket with 250 attendees (₹5,00,000 total revenue), a 5% platform commission costs you ₹25,000 in platform fees alone. URPASS charges zero per-ticket commission, saving you money from day one.",
          bullets: [
            "0% commission on all ticket tiers",
            "Native UPI QR payments with direct T+2 bank deposits",
            "Sub-0.3s mobile browser check-in with offline caching",
            "Permanent ₹0 Free tier for community events & meetups",
          ],
        },
        faqs: [
          {
            q: "Why do organizers choose URPASS over Luma for paid events?",
            a: "The biggest factor is pricing and local payment support. Luma charges a 5% platform fee on paid tickets and relies on Stripe, whereas URPASS charges 0% per-ticket commission and integrates natively with Razorpay for direct Indian UPI (PhonePe, GPay, Paytm) and net banking settlements.",
          },
          {
            q: "How does gate check-in on URPASS compare to Luma?",
            a: "URPASS features a purpose-built sub-0.3s browser camera scanner. Gate volunteers do not need to install an app; they simply open a secure PIN-verified link on mobile Safari or Chrome to scan QR tickets at lightning speed with audible chimes and duplicate lockout.",
          },
          {
            q: "Can I customize the design of tickets on URPASS?",
            a: "Yes. URPASS includes Ticket Studio, which allows you to design passes in multiple aspect ratios (vertical badge 380x680, horizontal pass 780x340, and square card 440x640) with custom brand hex colors, logos, and attendee metadata.",
          },
          {
            q: "Does URPASS work if internet connection drops at the venue?",
            a: "Yes. URPASS caches attendee manifests in the browser using IndexedDB. If venue Wi-Fi or cellular service experiences interruptions, gate staff can continue validating passes offline with automatic re-synchronization when back online.",
          },
          {
            q: "Is there a free tier on URPASS?",
            a: "Yes. URPASS offers a permanent ₹0 Free Tier that includes up to 2 events per month and 100 registrations per month with full QR code generation and mobile browser scanning included. No credit card is required to sign up.",
          },
        ],
        relatedLinks: [
          { title: "Luma Alternative for Events", href: "/compare/luma-alternative", category: "Comparison" },
          { title: "URPASS vs Eventbrite Comparison", href: "/compare/urpass-vs-eventbrite", category: "Comparison" },
          { title: "URPASS vs Townscript Comparison", href: "/compare/urpass-vs-townscript", category: "Comparison" },
          { title: "Zero Fee Ticket Platform", href: "/zero-fee-ticket-platform", category: "Product" },
          { title: "Fastest Event Check-In Software", href: "/fastest-event-check-in-software", category: "Product" },
          { title: "Instant UPI Event Ticketing", href: "/instant-upi-event-ticketing", category: "Product" },
        ],
      }}
    />
  );
}
