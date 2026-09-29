import type { Metadata } from "next";
import {
  Zap,
  QrCode,
  CreditCard,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Smartphone,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "URPASS vs Eventbrite: 2026 Head-to-Head Comparison",
  description:
    "Compare URPASS vs Eventbrite for event registration, digital QR ticketing, gate check-in speed, and pricing. Discover why organizers switch to URPASS for flat pricing and 0% per-ticket commission.",
  keywords: [
    "urpass vs eventbrite",
    "eventbrite alternative",
    "eventbrite competitor",
    "event ticketing comparison",
    "free event registration software",
    "qr code event check in",
  ],
  alternates: {
    canonical: "https://urpass.space/compare/urpass-vs-eventbrite",
  },
  openGraph: {
    title: "URPASS vs Eventbrite: 2026 Head-to-Head Comparison | URPASS",
    description:
      "Compare URPASS vs Eventbrite for event registration, digital QR passes, and check-in speed. Flat pricing, 0% ticket commission, and permanent free tier.",
    url: "https://urpass.space/compare/urpass-vs-eventbrite",
    locale: "en_IN",
    type: "article",
  },
};

export default function UrpassVsEventbritePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/compare/urpass-vs-eventbrite",
        badge: "HEAD-TO-HEAD COMPARISON",
        h1: "URPASS vs Eventbrite: Feature & Pricing Comparison",
        description:
          "Eventbrite is an established global marketplace, but charges steep per-ticket fees and requires downloading separate apps. URPASS provides an agile, flat-rate platform with 0% ticketing commission, in-browser phone scanning, and a permanent free tier.",
        ctaLabel: "Create free event on URPASS",
        directAnswer: {
          title: "URPASS vs Eventbrite in 30 Seconds",
          summary:
            "Eventbrite is optimized for consumer discovery and large commercial ticket sales, but charges organizers up to 3.7% + per-ticket fees and restricts free tiers to 25 attendees. URPASS is designed for event organizers who want full control over their registration, zero per-ticket platform commissions, instant in-browser QR check-in (<0.28s), and a permanent free plan with up to 50 attendees per event.",
          keyPoints: [
            "Platform Commission: URPASS charges 0% per-ticket fee vs Eventbrite's 3.7% + fee per ticket",
            "Gate Scanner: URPASS runs in any mobile browser (<0.28s) vs Eventbrite requiring dedicated app download",
            "Free Tier: URPASS offers a permanent free tier (₹0 forever) vs Eventbrite limiting free events to 25 tickets",
            "Payment Gateways: Direct payouts via Razorpay (UPI, RuPay, Cards) and Stripe",
          ],
        },
        competitorComparison: {
          title: "Detailed Capability Breakdown: URPASS vs Eventbrite",
          subtitle: "Documented features and operational workflows compared side by side.",
          competitorName: "Eventbrite",
          sourceCitations: [
            "Eventbrite Pricing & Organizer Documentation (2025/2026)",
            "URPASS Platform Capabilities",
          ],
          rows: [
            {
              criteria: "Platform Ticket Commission",
              urpass: "0% per-ticket fee (Flat subscription or ₹0 Free tier)",
              competitor: "Up to 3.7% + per-ticket service fee",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Plan Attendee Limit",
              urpass: "Up to 50 attendees free per event (₹0 forever)",
              competitor: "Restricted to 25 attendees on basic tier",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Scanner Access",
              urpass: "In-browser web camera (<0.28s) — Zero app installation",
              competitor: "Requires downloading Eventbrite Organizer app",
              urpassAdvantage: true,
            },
            {
              criteria: "Regional Payments (India UPI / QR)",
              urpass: "Native Razorpay integration (Google Pay, PhonePe, UPI, Netbanking)",
              competitor: "Primarily credit cards / Eventbrite Payment Processing",
              urpassAdvantage: true,
            },
            {
              criteria: "Duplicate Entry & Re-scan Lock",
              urpass: "Instant multi-gate cloud lock with audible & visual alert",
              competitor: "Supported via mobile app",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Data Ownership",
              urpass: "100% organizer owned; instant CSV export with timestamps",
              competitor: "Eventbrite promotes other events to your attendees",
              urpassAdvantage: true,
            },
            {
              criteria: "Custom Pass Studio & Wallet Passes",
              urpass: "Custom branded passes with Apple Wallet & Google Wallet sync",
              competitor: "Standard Eventbrite ticket layout / PDF receipt",
              urpassAdvantage: true,
            },
          ],
        },
        features: [
          {
            icon: DollarSign,
            title: "Zero Ticket Commission",
            desc: "Keep 100% of your ticket revenues. URPASS never takes a percentage cut of your sales.",
          },
          {
            icon: Smartphone,
            title: "App-Free Gate Scanning",
            desc: "Volunteers open a simple link in Chrome or Safari. Scan barcodes and QR codes in under 0.28 seconds.",
          },
          {
            icon: ShieldCheck,
            title: "Anti-Fraud Verification",
            desc: "Cryptographically signed QR tickets prevent forged screenshots, duplicate entries, and unauthorized gate access.",
          },
          {
            icon: CreditCard,
            title: "Direct Bank Deposits",
            desc: "Payments flow directly into your payment gateway account with standard daily or T+2 settlement schedules.",
          },
          {
            icon: Users,
            title: "Attendee Management",
            desc: "Approve or deny registrations, filter by ticket tier, and send announcements from one unified portal.",
          },
          {
            icon: BarChart3,
            title: "Live Attendance Analytics",
            desc: "Track hourly entry velocity, total gate arrivals, and no-show percentages in real time.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Set Up Event",
            desc: "Configure event dates, venue location, custom questions, and capacity caps in 2 minutes.",
          },
          {
            n: "02",
            title: "Publish Registration",
            desc: "Share your clean, fast-loading event link across social channels, messaging apps, and email.",
          },
          {
            n: "03",
            title: "Issue QR Passes",
            desc: "Attendees receive personalized digital QR passes with instant Apple & Google Wallet integration.",
          },
          {
            n: "04",
            title: "Scan at the Door",
            desc: "Station volunteers at entry gates with any phone camera. Validate tickets with instant confirmation chimes.",
          },
        ],
        callout: {
          badge: "THE URPASS DIFFERENCE",
          title: "Software for organizers, not a marketplace promoting competitors",
          description:
            "When you send attendees to Eventbrite, they are often shown competing events right below your listing. URPASS provides a dedicated, branded registration environment where your brand stays front and center.",
          bullets: [
            "Clean event landing page with zero third-party ads",
            "Permanent free tier for community events and workshops",
            "Integrated UPI and credit card processing via Razorpay & Stripe",
            "Instant CSV and Excel exports of all attendee data",
          ],
        },
        useCases: [
          "College tech fests & cultural meets",
          "Workshops, hackathons & masterclasses",
          "Conferences & summits",
          "Corporate webinars & product launches",
          "Community & alumni gatherings",
        ],
        faqs: [
          {
            q: "Why should I switch from Eventbrite to URPASS?",
            a: "If you want flat, transparent software pricing with 0% ticketing commission, instant in-browser QR scanning without requiring volunteers to download mobile apps, and direct payment settlements via Razorpay or Stripe, URPASS is designed specifically for you.",
          },
          {
            q: "How does URPASS pricing compare to Eventbrite?",
            a: "Eventbrite charges up to 3.7% + per-ticket service fees on paid tickets and restricts free events. URPASS has a permanent Free tier (₹0 for up to 50 attendees per event) and flat subscriptions for larger events with 0% platform ticket fees.",
          },
          {
            q: "Can volunteers scan tickets without creating accounts?",
            a: "Yes! Event organizers can generate a secure gate scanner link. Volunteers simply open the URL in any smartphone browser, allow camera access, and begin scanning immediately.",
          },
          {
            q: "Does URPASS support Indian payment methods like UPI and RuPay?",
            a: "Yes. URPASS connects directly with Razorpay, allowing attendees in India to pay seamlessly via Google Pay, PhonePe, Paytm, BHIM UPI, Netbanking, and domestic credit/debit cards.",
          },
        ],
        ctaTitle: "Ready to switch to modern event registration?",
        ctaDescription: "Join organizers hosting faster, simpler events with URPASS.",
      }}
    />
  );
}
