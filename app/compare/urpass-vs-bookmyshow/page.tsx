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
  Lock,
} from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "URPASS vs BookMyShow: Event Software vs Consumer Marketplace",
  description:
    "Compare URPASS vs BookMyShow for event ticketing and registration. Keep 100% of your attendee data, pay 0% ticket commission, and eliminate high convenience fees for your buyers.",
  keywords: [
    "urpass vs bookmyshow",
    "bookmyshow alternative",
    "event ticketing software india",
    "college event registration",
    "zero commission event ticketing",
  ],
  alternates: {
    canonical: "https://urpass.space/compare/urpass-vs-bookmyshow",
  },
  openGraph: {
    title: "URPASS vs BookMyShow: Platform Comparison | URPASS",
    description:
      "URPASS vs BookMyShow. Compare platform fees, attendee data ownership, gate scanning speed, and payout timelines.",
    url: "https://urpass.space/compare/urpass-vs-bookmyshow",
    locale: "en_IN",
    type: "article",
  },
};

export default function UrpassVsBookMyShowPage() {
  return (
    <SEOPage
      config={{
        canonicalUrl: "https://urpass.space/compare/urpass-vs-bookmyshow",
        badge: "SOFTWARE VS MARKETPLACE",
        h1: "URPASS vs BookMyShow: Which Platform is Right for Your Event?",
        description:
          "BookMyShow is India's leading consumer entertainment portal for stadium concerts and movie shows. But for conferences, college fests, workshops, and business events, organizers use URPASS to eliminate high convenience fees, retain 100% attendee data ownership, and get paid directly.",
        ctaLabel: "Start free with URPASS",
        directAnswer: {
          title: "URPASS vs BookMyShow: Key Differences",
          summary:
            "BookMyShow acts as a consumer ticketing distributor—they own the customer relationship, charge your attendees up to 10–15% in platform convenience fees, take an organizer commission, and often hold ticket payouts until weeks after the event concludes. URPASS is an organizer-first software platform: you pay 0% ticket commissions, your attendees pay zero convenience fees, all attendee emails and contact details belong exclusively to you, and payments settle directly to your payment gateway account.",
          keyPoints: [
            "Data Ownership: On URPASS, you own 100% of attendee contact information. BookMyShow restricts direct organizer contact access",
            "Platform Fees: URPASS charges 0% per-ticket commission vs BookMyShow's commission and consumer convenience fees",
            "Payout Velocity: Direct daily/T+2 settlements via Razorpay on URPASS vs BookMyShow post-event settlement holding",
            "Gate Check-In: Instant in-browser smartphone scanning (<0.28s) on URPASS vs proprietary hardware scanners",
          ],
        },
        competitorComparison: {
          title: "Head-to-Head Comparison: URPASS vs BookMyShow",
          subtitle: "Comparison of fee models, attendee ownership, and entry gate technology.",
          competitorName: "BookMyShow",
          sourceCitations: [
            "BookMyShow Partner Guidelines & Consumer Fee Policies",
            "URPASS Operating Architecture",
          ],
          rows: [
            {
              criteria: "Platform Ticket Commission",
              urpass: "0% ticketing fee (Flat subscription or ₹0 Free tier)",
              competitor: "Standard organizer commission per ticket sold",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Convenience Fees",
              urpass: "₹0 convenience fee added to attendee checkout",
              competitor: "10% to 15% booking/internet handling fee added",
              urpassAdvantage: true,
            },
            {
              criteria: "Attendee Data & Marketing Rights",
              urpass: "100% owned by organizer (export names, phones, emails anytime)",
              competitor: "Owned by BookMyShow platform",
              urpassAdvantage: true,
            },
            {
              criteria: "Gate Scanning Technology",
              urpass: "Any smartphone camera in Safari/Chrome (<0.28s)",
              competitor: "Dedicated handheld hardware / proprietary scanning app",
              urpassAdvantage: true,
            },
            {
              criteria: "Payout & Fund Settlement",
              urpass: "Direct daily / T+2 settlement to your bank via Razorpay",
              competitor: "Funds held until after event completion and reconciliation",
              urpassAdvantage: true,
            },
            {
              criteria: "Free Event Support",
              urpass: "Permanent free tier (₹0 forever for up to 50 attendees)",
              competitor: "Not designed for zero-cost community or college registrations",
              urpassAdvantage: true,
            },
            {
              criteria: "Consumer Discovery Network",
              urpass: "Private branded registration link for your audience",
              competitor: "Massive public consumer marketplace & app listing",
              urpassAdvantage: false,
            },
          ],
        },
        features: [
          {
            icon: DollarSign,
            title: "0% Ticketing Commission",
            desc: "Never lose a portion of your ticket sales to high distributor percentages. Keep your hard-earned revenue.",
          },
          {
            icon: Users,
            title: "You Own Your Attendee List",
            desc: "Your attendees are your community, not leads for a third-party marketplace to market other events to.",
          },
          {
            icon: CreditCard,
            title: "Instant Direct Settlements",
            desc: "Payments process through your own Razorpay account with standard banking settlement directly into your bank.",
          },
          {
            icon: Smartphone,
            title: "Zero Specialized Hardware",
            desc: "Turn any volunteer's smartphone into a lightning-fast gate scanner without renting expensive barcode scanners.",
          },
          {
            icon: ShieldCheck,
            title: "Duplicate Entry Lockout",
            desc: "Real-time gate synchronization prevents ticket duplication, fraudulent screenshots, and multi-entry loopholes.",
          },
          {
            icon: BarChart3,
            title: "Live Door Intelligence",
            desc: "Monitor arrival flow, peak entrance times, and current venue capacity in real-time on your dashboard.",
          },
        ],
        steps: [
          { n: "01", title: "Set Up", desc: "Create your registration form and set ticket tiers in 2 minutes." },
          { n: "02", title: "Connect Gateway", desc: "Link your Razorpay or Stripe account for direct bank settlements." },
          { n: "03", title: "Promote", desc: "Share your dedicated event link directly with your community." },
          { n: "04", title: "Scan", desc: "Check in hundreds of attendees per gate with zero lines." },
        ],
        callout: {
          badge: "COMMUNITY-FIRST ARCHITECTURE",
          title: "Stop sending your community to third-party marketplaces",
          description:
            "When you build an audience for your workshop, college summit, or tech conference, you shouldn't force them to pay booking fees or give up their data to entertainment portals. URPASS gives you clean software that puts your brand first.",
          bullets: [
            "No internet handling fees added to your ticket price",
            "Complete exportable roster of phone numbers and emails",
            "Permanent free plan available for free events",
            "In-browser phone camera scanning with sub-0.3s validation",
          ],
        },
        useCases: [
          "College tech fests & campus symposiums",
          "Tech meetups, hackathons & code jams",
          "Business conferences & industry summits",
          "Workshops, bootcamps & certification seminars",
          "Private corporate & alumni reunions",
        ],
        faqs: [
          {
            q: "Can URPASS replace BookMyShow for my event?",
            a: "If your attendees discover your event through your own channels (social media, student groups, WhatsApp, website, or email newsletters), URPASS is vastly superior because you save heavy commission fees and retain complete data ownership. If you rely solely on BookMyShow's app for random public consumer discovery, they provide a marketplace.",
          },
          {
            q: "Do my attendees have to pay convenience fees on URPASS?",
            a: "No! Unlike BookMyShow which adds significant convenience fees to every ticket, URPASS never charges your attendees an extra platform fee.",
          },
          {
            q: "How do payouts work on URPASS?",
            a: "Ticket proceeds go directly through your integrated Razorpay or Stripe account straight into your registered bank account on normal banking schedules (typically T+2 days), with zero delay after the event.",
          },
          {
            q: "Can I manage free events on URPASS?",
            a: "Yes. URPASS has a permanent free tier for up to 50 attendees per event (and up to 100 registrations per month across events) with full QR pass issuance and in-browser camera scanning.",
          },
        ],
        ctaTitle: "Take back control of your event ticketing",
        ctaDescription: "0% ticket commission · 100% data ownership · Instant QR passes",
      }}
    />
  );
}
