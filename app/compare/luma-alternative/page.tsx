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
  title: "Luma Alternative: 0% Ticket Fees & Fast QR Check-In | URPASS",
  description:
    "Looking for a Luma (lu.ma) alternative? URPASS offers 0% ticket commissions, native Indian UPI and global card checkouts, sub-0.3s browser QR gate scanning, and custom Ticket Studio passes.",
  keywords: [
    "luma alternative",
    "lu.ma alternative",
    "luma alternative india",
    "free luma alternative",
    "luma competitor",
    "event registration software",
    "qr code event check in",
  ],
  alternates: {
    canonical: "https://urpass.space/compare/luma-alternative",
  },
  openGraph: {
    title: "Luma Alternative: 0% Ticket Fees & Fast QR Check-In | URPASS",
    description:
      "Looking for a Luma (lu.ma) alternative? 0% ticket commissions, native UPI checkout, sub-0.3s mobile browser scanning, and custom Ticket Studio passes.",
    url: "https://urpass.space/compare/luma-alternative",
    locale: "en_IN",
    type: "article",
  },
};

export default function LumaAlternativePage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/compare/luma-alternative",
        badge: "0% COMMISSION ALTERNATIVE",
        h1: "The 0% Commission Luma Alternative for Modern Events",
        description:
          "Upgrade from Luma (lu.ma) to URPASS. Keep 100% of your ticket sales without giving up 5% in platform commissions. Get native Indian UPI checkout, instant sub-0.3s browser QR check-in, and customizable digital passes.",
        ctaLabel: "Switch from Luma free",
        directAnswer: {
          title: "Why Switch from Luma to URPASS?",
          summary:
            "While Luma is popular for casual social RSVPs, organizers of paid summits, college conferences, and developer meetups often encounter its 5% platform commission and lack of native Indian UPI support. URPASS provides a modern, fast alternative with flat subscription pricing, 0% ticket commission, native UPI (GPay, PhonePe, Paytm) integration, sub-0.3s mobile browser camera check-in, and offline attendance synchronization.",
          keyPoints: [
            "0% Ticket Commission: Keep 100% of revenue without paying Luma's 5% cut",
            "Native UPI Payments: Instant QR checkouts via PhonePe, Google Pay, Paytm, and RuPay with T+2 payouts",
            "In-Browser Scanner: Zero app installation required for volunteers or door staff",
            "Ticket Studio: Custom multi-ratio digital passes (380x680, 780x340, 440x640) with custom hex colors",
          ],
        },
        competitorComparison: {
          title: "URPASS vs Luma: Feature Comparison",
          subtitle: "Documented platform differences for event organizers.",
          competitorName: "Luma (lu.ma)",
          sourceCitations: [
            "Luma Pricing and Platform Terms",
            "URPASS Documentation & Capabilities",
          ],
          rows: [
            {
              criteria: "Ticket Platform Commission",
              urpass: "0% per ticket (Keep 100% of ticket sales)",
              competitor: "5% platform fee per ticket",
              urpassAdvantage: true,
            },
            {
              criteria: "Indian UPI Payments",
              urpass: "Native Razorpay UPI QR, PhonePe, GPay, Paytm, RuPay",
              competitor: "Primarily international Stripe cards",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Scanner Speed",
              urpass: "Sub-0.3s browser camera scan with audio confirmation",
              competitor: "Basic dashboard check-in / app scanning",
              urpassAdvantage: true,
            },
            {
              criteria: "Volunteer Gate Setup",
              urpass: "Instant PIN-verified browser link — No app install",
              competitor: "Requires mobile app or account login",
              urpassAdvantage: true,
            },
            {
              criteria: "Offline Gate Reliability",
              urpass: "IndexedDB offline caching for connectivity blackouts",
              competitor: "Requires consistent internet connection",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Tier Allowance",
              urpass: "₹0 forever for up to 100 registrations/month",
              competitor: "Free events with standard branding",
              urpassAdvantage: false,
            },
            {
              criteria: "Organization Multi-Tenancy",
              urpass: "Workspaces, venues, and role-based permissions (Admin, Gatekeeper)",
              competitor: "Basic team calendar sharing",
              urpassAdvantage: true,
            },
          ],
        },
        features: [
          {
            icon: Percent,
            title: "Zero Ticketing Commission",
            desc: "Stop paying 5% on every attendee registration. On ₹10,00,000 in ticket sales, you save ₹50,000 in platform fees.",
          },
          {
            icon: CreditCard,
            title: "Direct UPI & Card Payouts",
            desc: "Process tickets in INR or GBP directly via Razorpay and Stripe with direct bank settlements on a T+2 schedule.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Browser Camera Scanner",
            desc: "Admit attendees in under 0.3 seconds per scan using standard smartphone cameras in Safari and Chrome. No app downloads.",
          },
          {
            icon: ShieldCheck,
            title: "Multi-Gate Duplicate Blocking",
            desc: "Prevent pass sharing and screenshot fraud. Each ticket token is locked in real-time across all entrance gates.",
          },
          {
            icon: Layers,
            title: "Ticket Studio Multi-Ratio Passes",
            desc: "Create vertical badges, horizontal event passes, or mobile wallet cards with your custom branding and logo.",
          },
          {
            icon: Users,
            title: "Multi-Role Organization Workspaces",
            desc: "Manage multiple events, venues, and team members with granular access controls for admins, editors, and door staff.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Create Event in 30 Seconds",
            desc: "Define ticket classes, set prices, and add custom registration fields.",
          },
          {
            n: "02",
            title: "Style Your Tickets in Studio",
            desc: "Customize colors, logos, and pass layouts to match your brand.",
          },
          {
            n: "03",
            title: "Share Clean Public Link",
            desc: "Publish your fast, mobile-optimized page with instant UPI checkout.",
          },
          {
            n: "04",
            title: "Auto-Deliver QR Passes",
            desc: "Attendees get dynamic digital passes via email and direct link.",
          },
          {
            n: "05",
            title: "Scan at Doors Without Apps",
            desc: "Volunteers open the scanner URL and admit guests at sub-0.3s speed.",
          },
        ],
        callout: {
          badge: "MIGRATION OFFER",
          title: "Switch to URPASS with ₹0 upfront cost.",
          description:
            "Test URPASS risk-free. Create your free event in under a minute with up to 100 registrations per month for ₹0 forever, or activate a 30-day free trial on any premium tier without entering a credit card.",
          bullets: [
            "0% commission on all ticket tiers",
            "Instant UPI QR & Card checkouts with direct bank payouts",
            "Sub-0.3s browser camera scanning with audio chimes",
            "No credit card required to start",
          ],
        },
        faqs: [
          {
            q: "What makes URPASS the best alternative to Luma?",
            a: "URPASS eliminates Luma's 5% ticketing platform fee, supports native Indian UPI payments with direct T+2 bank deposits, provides sub-0.3s mobile browser camera check-in that requires zero app downloads, and includes multi-ratio Ticket Studio pass customization.",
          },
          {
            q: "Can I collect payments in Indian Rupees (INR) using UPI on URPASS?",
            a: "Yes. Through native Razorpay integration, URPASS supports instant UPI QR code checkouts (PhonePe, Google Pay, Paytm, BHIM, Cred), RuPay, Indian Net Banking across major banks, and credit/debit cards.",
          },
          {
            q: "How does gate check-in work without downloading an app?",
            a: "Gate volunteers simply open a secure PIN-verified scanner link on their mobile browser (Safari, Chrome). The scanner uses the phone camera to detect and validate attendee QR passes in under 0.3 seconds.",
          },
          {
            q: "Does URPASS have an attendee limit on free events?",
            a: "The permanent ₹0 Free Tier includes up to 2 events per month and 100 registrations per month. For larger events, Starter, Pro, and Business plans offer generous limits and include a 30-day free trial with no credit card required.",
          },
          {
            q: "Can I export all attendee data to CSV?",
            a: "Yes. You have 100% ownership of your attendee list. You can export complete registration details, custom answers, and timestamped arrival logs to CSV at any time.",
          },
        ],
        relatedLinks: [
          { title: "URPASS vs Luma Comparison", href: "/compare/urpass-vs-luma", category: "Comparison" },
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
