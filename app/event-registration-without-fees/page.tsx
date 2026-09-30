import type { Metadata } from "next";
import { CreditCard, ShieldCheck, Zap, Ticket, Users, BarChart3, CheckCircle2, DollarSign } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Without Fees | 0% Commission | URPASS",
  description:
    "Sell event tickets and manage registrations without per-ticket percentage cuts. Transparent flat pricing, free forever community tier, and direct payments.",
  keywords: [
    "event registration without fees",
    "zero fee event registration",
    "no commission event ticketing",
    "free event ticketing platform",
    "eventbrite zero fee alternative",
    "0 percent ticketing commission",
  ],
  alternates: { canonical: "https://urpass.space/event-registration-without-fees" },
  openGraph: {
    title: "Event Registration Without Fees | 0% Commission | URPASS",
    description: "Sell event tickets and manage registrations without per-ticket percentage cuts.",
    url: "https://urpass.space/event-registration-without-fees",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "0% PLATFORM COMMISSIONS",
        h1: "Event Registration Without Per-Ticket Fees",
        canonicalUrl: "https://urpass.space/event-registration-without-fees",
        description:
          "Keep 100% of your ticket sales revenue. No 5% to 10% platform cuts, no surprise attendee convenience fees, and direct payouts to your bank account.",
        ctaLabel: "Start Fee-Free Registration",
        directAnswer: {
          title: "How Does URPASS Provide Event Registration Without Per-Ticket Fees?",
          summary:
            "Unlike legacy ticketing platforms that extract 3.7% to 10% of gross ticket sales plus per-ticket surcharges, URPASS operates purely on transparent flat software subscriptions starting at ₹499/mo ($9/mo) and a permanent ₹0 free tier for up to 100 registrations/month. Payments flow directly to the organizer's connected merchant account with 0% platform commission.",
          keyPoints: [
            "0% per-ticket platform commission across all free and paid plans",
            "Keep 100% of your ticket price — zero hidden attendee service fees added at checkout",
            "Direct payment settlement (T+2) directly into your bank via your linked Razorpay/Stripe account",
            "Permanent Free Tier: ₹0 / $0 forever for up to 100 registrations per month",
          ],
        },
        keyFactsTable: {
          title: "Fee Structure Comparison: URPASS vs Legacy Ticketing",
          subtitle: "Financial comparison on $50,000 / ₹40,00,000 in gross ticket sales.",
          headers: ["Cost Category", "URPASS Cost Model", "Legacy Aggregators (Eventbrite / etc.)"],
          rows: [
            { col1: "Platform Commission on Tickets", col2: "0% (Zero platform cut)", col3: "3.7% to 8.0% of gross sales" },
            { col1: "Per-Ticket Flat Surcharge", col2: "$0 / ₹0 per ticket", col3: "$0.99 to $1.99 + per ticket sold" },
            { col1: "Attendee Convenience Surcharges", col2: "None; buyer pays exact face value", col3: "Hidden 2% to 5% fees added at cart" },
            { col1: "Payout Settlement Schedule", col2: "Direct T+2 business day settlement", col3: "Funds withheld until days after event" },
            { col1: "Free Community Events", col2: "100% free forever (100 reg/mo)", col3: "Attendee limits or mandatory plan" },
          ],
        },
        features: [
          { icon: CreditCard, title: "100% Revenue Retention", desc: "Every cent from your ticket sales goes directly to you. We never take a percentage cut of your event's commercial success." },
          { icon: Zap, title: "Direct Merchant Settlements", desc: "Funds flow directly through your linked payment gateway (Razorpay / Stripe) on standard T+2 cycles, eliminating escrow delays." },
          { icon: Ticket, title: "Bespoke Digital QR Passes", desc: "Issue branded digital passes, printable tickets, or conference lanyard badges with single-use cryptographic security." },
          { icon: ShieldCheck, title: "Sub-0.3s Browser Camera Check-In", desc: "Turn any volunteer smartphone into a lightning-fast gate scanner without hardware rentals or app store downloads." },
          { icon: Users, title: "Application Screening Queues", desc: "Review registrant profiles, screen custom qualification responses, and approve attendees with a single click." },
          { icon: BarChart3, title: "Real-Time Revenue Analytics", desc: "Track ticket sales volume, tier breakdown, gate arrival curves, and export CSV financial reports instantly." },
        ],
        steps: [
          { n: "01", title: "Set Up Your Event", desc: "Configure event details, ticket tiers (Free, Early-bird, VIP), and pricing in under 3 minutes." },
          { n: "02", title: "Connect Payment Account", desc: "Link your verified Razorpay or Stripe account for direct, commission-free deposits." },
          { n: "03", title: "Publish Registration URL", desc: "Share your high-converting, mobile-first registration page with zero checkout drop-off fees." },
          { n: "04", title: "Instant Pass Delivery", desc: "Attendees receive clean digital QR passes automatically via email upon payment confirmation." },
          { n: "05", title: "Scan at the Gates", desc: "Check in guests in under 0.3s per scan using standard smartphone cameras." },
        ],
        callout: {
          badge: "REINVEST YOUR SAVINGS",
          title: "Save $2,000 to $10,000 on your next conference or festival.",
          description: "Don't subsidize expensive legacy ticketing middlemen. Switch to flat software pricing and reinvest your ticket revenues directly into better venue amenities, keynote speakers, and attendee experiences.",
          bullets: [
            "0% commission on all ticket tiers regardless of volume",
            "Transparent monthly software pricing with 30-day free trial",
            "Permanent Free Tier for community events up to 100 registrations/month",
            "Full data privacy with complete ownership of your attendee roster",
          ],
        },
        faqs: [
          { q: "Is there really zero commission on paid tickets?", a: "Yes. URPASS charges 0% platform commission on ticket sales. You only pay standard gateway processing fees directly to Razorpay or Stripe, keeping 100% of your ticket price." },
          { q: "Does URPASS add convenience fees for ticket buyers?", a: "No. Ticket buyers pay the exact ticket price listed by the organizer with zero surprise convenience charges added at checkout." },
          { q: "How does URPASS make money if there are no ticket commissions?", a: "URPASS operates as a modern software subscription platform (SaaS). We offer a permanent Free Tier, alongside transparent monthly plans (Starter ₹499/mo, Pro ₹999/mo, Business ₹2,499/mo) for organizers who need higher capacity and enterprise features." },
          { q: "Can I try paid features for free?", a: "Yes. All paid URPASS plans include a full 30-day free trial with ₹0 due today and no credit card required." },
        ],
        relatedLinks: [
          { title: "Pricing & 30-Day Free Trial", href: "/pricing", category: "Product" },
          { title: "Eventbrite Alternative", href: "/compare/eventbrite-alternative", category: "Comparison" },
          { title: "Zero Commission Event Ticketing", href: "/zero-commission-event-ticketing", category: "Product" },
          { title: "Conference Registration Software", href: "/conference-registration-software", category: "Use Case" },
        ],
      }}
    />
  );
}
