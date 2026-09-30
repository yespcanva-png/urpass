import type { Metadata } from "next";
import {
  Zap,
  Percent,
  CreditCard,
  ScanLine,
  ShieldCheck,
  Users,
  BarChart3,
  CheckCircle2,
  Smartphone,
  Layers,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "URPASS vs Townscript: 2026 Head-to-Head Comparison",
  description:
    "Compare URPASS vs Townscript for Indian event registration, ticketing commissions, gate check-in latency, and UPI settlement. Discover how URPASS saves organizers 100% of per-ticket cuts.",
  keywords: [
    "urpass vs townscript",
    "townscript vs urpass",
    "townscript alternative",
    "townscript fees",
    "event ticketing software india",
    "zero commission event ticketing",
    "qr code event check in",
  ],
  alternates: {
    canonical: "https://urpass.space/compare/urpass-vs-townscript",
  },
  openGraph: {
    title: "URPASS vs Townscript: 2026 Head-to-Head Comparison | URPASS",
    description:
      "Compare URPASS vs Townscript for event registration, ticketing fees, and door check-in speed. Flat pricing, 0% ticket commission, and direct Razorpay T+2 settlement.",
    url: "https://urpass.space/compare/urpass-vs-townscript",
    locale: "en_IN",
    type: "article",
  },
};

export default function UrpassVsTownscriptPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/compare/urpass-vs-townscript",
        badge: "HEAD-TO-HEAD COMPARISON",
        h1: "URPASS vs Townscript: Feature & Pricing Comparison",
        description:
          "Townscript is a legacy Indian ticketing aggregator that takes percentage cuts plus flat convenience fees on every attendee transaction. URPASS offers modern, flat-rate event software with 0% ticketing commission, instant sub-0.3s mobile browser check-in, and direct T+2 bank deposits.",
        ctaLabel: "Start free event on URPASS",
        directAnswer: {
          title: "URPASS vs Townscript in 30 Seconds",
          summary:
            "Townscript operates on a commission marketplace model, charging organizers up to 3.99% + ₹10 per ticket sold, while holding attendee funds until post-event reconciliation. URPASS is a modern software platform charging 0% per-ticket commission, connecting directly to your own Razorpay account for instant T+2 payouts, and providing in-browser QR scanning without requiring volunteers to download mobile apps.",
          keyPoints: [
            "Ticketing Commission: URPASS charges 0% per-ticket commission vs Townscript taking ~3.99% + ₹10 per ticket",
            "Door Check-In: URPASS scans QR passes in under 0.3s directly inside phone browsers vs Townscript app requirements",
            "Fund Settlements: URPASS routes ticket money directly via Razorpay T+2 vs Townscript delayed organizer disbursements",
            "Free Tier: URPASS includes a permanent ₹0 free tier (up to 100 registrations/month) with no credit card required",
          ],
        },
        competitorComparison: {
          title: "Detailed Capability Breakdown: URPASS vs Townscript",
          subtitle: "Documented features and operational workflows compared side by side.",
          competitorName: "Townscript",
          sourceCitations: [
            "Townscript Pricing & Organizer Terms (2025/2026)",
            "URPASS Platform Technical Specifications",
          ],
          rows: [
            {
              criteria: "Platform Ticket Commission",
              urpass: "0% per-ticket cut (Flat subscription or ₹0 Free tier)",
              competitor: "Up to 3.99% + ₹10 per ticket convenience fee",
              urpassAdvantage: true,
            },
            {
              criteria: "Payout & Fund Settlement",
              urpass: "Direct T+2 settlement to your bank via Razorpay",
              competitor: "Aggregator payout processed after event conclusion",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Scanner Access",
              urpass: "Sub-0.3s camera scanner running in any mobile browser",
              competitor: "Requires downloading Townscript Organizer app",
              urpassAdvantage: true,
            },
            {
              criteria: "UPI Payment Acceptance",
              urpass: "Native UPI QR, PhonePe, GPay, Paytm, RuPay, Net Banking",
              competitor: "Supported via aggregator payment gateway",
              urpassAdvantage: false,
            },
            {
              criteria: "Multi-Gate Duplicate Prevention",
              urpass: "Instant cloud synchronization with audio chime & red warning",
              competitor: "Supported via organizer app sync",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Tier Allowance",
              urpass: "₹0 forever for up to 100 registrations per month",
              competitor: "Free events supported with limited feature set",
              urpassAdvantage: true,
            },
            {
              criteria: "Custom Pass Design Studio",
              urpass: "Multi-ratio pass studio (380x680, 780x340, 440x640) with custom hex branding",
              competitor: "Fixed template PDF ticket layout",
              urpassAdvantage: true,
            },
            {
              criteria: "Model Context Protocol (MCP) AI Support",
              urpass: "Native 10-tool MCP server for AI agent operations",
              competitor: "No AI or MCP integration",
              urpassAdvantage: true,
            },
          ],
        },
        features: [
          {
            icon: Percent,
            title: "Zero Per-Ticket Commission",
            desc: "Keep 100% of your ticket revenue. On 1,000 tickets at ₹500, you save upwards of ₹25,000 compared to legacy ticketing platforms.",
          },
          {
            icon: CreditCard,
            title: "Direct UPI & Razorpay Settlement",
            desc: "Money never sits in a third-party aggregator account. Funds settle directly into your bank on a standard T+2 cycle.",
          },
          {
            icon: ScanLine,
            title: "Sub-0.3s Browser Gate Scanner",
            desc: "Volunteers scan attendee QR codes immediately on standard mobile browsers (Safari, Chrome) without downloading apps from app stores.",
          },
          {
            icon: ShieldCheck,
            title: "Cryptographic Duplicate Lockout",
            desc: "Atomic database transactions prevent duplicate entry when an attendee attempts to share a screenshot across multiple gates.",
          },
          {
            icon: Layers,
            title: "Ticket Studio Multi-Ratio Passes",
            desc: "Customize vertical badge cards, horizontal passes, and mobile wallet cards with organizer logos and brand accent colors.",
          },
          {
            icon: BarChart3,
            title: "Real-Time Gate Telemetry",
            desc: "Track live check-in counts, peak arrival throughput, and remaining expected guests across all active entrance gates simultaneously.",
          },
        ],
        steps: [
          {
            n: "01",
            title: "Create Your Event in 30 Seconds",
            desc: "Set ticket tiers, prices in INR, capacity caps, and custom registration fields.",
          },
          {
            n: "02",
            title: "Connect UPI & Payment Gateway",
            desc: "Link your Razorpay account for direct UPI QR, card, and net banking checkouts.",
          },
          {
            n: "03",
            title: "Publish Clean Registration Link",
            desc: "Distribute your fast, mobile-optimized landing page with zero competitor ads.",
          },
          {
            n: "04",
            title: "Instant QR Pass Delivery",
            desc: "Registrants receive verified cryptographic QR passes via email and instant link.",
          },
          {
            n: "05",
            title: "Scan Attendees at Gates",
            desc: "Gate staff scan passes in under 0.3 seconds on their phones with zero app installs.",
          },
        ],
        callout: {
          badge: "COMMISSION COMPARISON",
          title: "Stop losing 4% to 7% of your gross ticket sales.",
          description:
            "If your event generates ₹5,00,000 in ticket sales, legacy commission platforms deduct between ₹20,000 and ₹35,000 in transaction cuts. URPASS charges flat software pricing with zero per-ticket commission, preserving your event budget.",
          bullets: [
            "0% commission on all free and paid tickets",
            "Permanent ₹0 Free tier for community meetups and college clubs",
            "Direct T+2 payouts straight to your merchant bank account",
            "In-browser mobile scanning with audible pass verification",
          ],
        },
        faqs: [
          {
            q: "How does URPASS compare to Townscript on ticket fees?",
            a: "Townscript deducts approximately 3.99% + ₹10 per paid ticket sold. In contrast, URPASS operates on a 0% ticket commission model. On URPASS, organizers pay only a flat monthly software subscription or use the ₹0 free tier, keeping 100% of their ticket revenue.",
          },
          {
            q: "Do attendees or volunteers need to install an app to scan tickets?",
            a: "No. While Townscript requires gate staff to download an organizer application from Google Play or the App Store, URPASS runs natively inside any mobile browser (Safari, Chrome). Gate volunteers simply open a secure PIN-verified scanner link and scan in under 0.3 seconds.",
          },
          {
            q: "How does payout settlement work on URPASS compared to Townscript?",
            a: "On Townscript, ticket revenue is collected into Townscript's merchant account and disbursed to the organizer after event completion or milestone requests. On URPASS, payments route directly through your own Razorpay account, giving you direct T+2 settlement into your bank.",
          },
          {
            q: "Can I use URPASS for free events like college fests and community meetups?",
            a: "Yes. URPASS provides a permanent ₹0 Free Tier that includes up to 2 events per month and 100 registrations per month with full QR code pass generation and browser gate scanning included. No credit card is required to start.",
          },
          {
            q: "Does URPASS prevent attendees from sharing ticket screenshots?",
            a: "Yes. Each URPASS QR code contains a unique, cryptographically signed UUID token. The moment a pass is scanned at any gate, it is atomically locked in the database. If a duplicate screenshot is scanned at another gate, the scanner immediately flashes red with a loud error tone and displays the exact time and location of the initial check-in.",
          },
        ],
        relatedLinks: [
          { title: "Townscript Alternative for India", href: "/compare/townscript-alternative", category: "Comparison" },
          { title: "URPASS vs Eventbrite Comparison", href: "/compare/urpass-vs-eventbrite", category: "Comparison" },
          { title: "URPASS vs Google Forms Comparison", href: "/compare/urpass-vs-google-forms", category: "Comparison" },
          { title: "Zero Fee Ticket Platform", href: "/zero-fee-ticket-platform", category: "Product" },
          { title: "Instant UPI Event Ticketing", href: "/instant-upi-event-ticketing", category: "Product" },
          { title: "GST Compliant Event Ticketing", href: "/gst-compliant-event-ticketing", category: "Product" },
        ],
      }}
    />
  );
}
