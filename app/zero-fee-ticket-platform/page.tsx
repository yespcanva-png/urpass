import type { Metadata } from "next";
import { CreditCard, DollarSign, ShieldCheck, Zap, Ticket, Users, BarChart3, CheckCircle2 } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Zero Fee Ticket Platform | 0% Commission Event Ticketing | URPASS",
  description:
    "The zero fee ticket platform for modern organizers. Keep 100% of your ticket revenue with 0% platform cuts, transparent flat plans, and direct bank payouts.",
  keywords: [
    "zero fee ticket platform",
    "0 commission ticketing",
    "no fee event tickets",
    "event ticketing without commission",
    "transparent event ticketing",
    "eventbrite zero fee alternative",
  ],
  alternates: { canonical: "https://urpass.space/zero-fee-ticket-platform" },
  openGraph: {
    title: "Zero Fee Ticket Platform | 0% Commission Event Ticketing | URPASS",
    description: "Keep 100% of your ticket revenue with 0% platform cuts and direct payouts.",
    url: "https://urpass.space/zero-fee-ticket-platform",
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return (
    <SEOPage
      config={{
        badge: "TRANSPARENT SOFTWARE PRICING",
        h1: "Zero Fee Ticket Platform. 0% Commission on Ticket Sales.",
        canonicalUrl: "https://urpass.space/zero-fee-ticket-platform",
        description:
          "Stop paying 5% to 10% of your ticket revenue to ticketing intermediaries. URPASS charges zero per-ticket platform commission, allowing organizers to retain 100% of their earnings.",
        ctaLabel: "Start Zero-Fee Ticketing",
        directAnswer: {
          title: "How Does a Zero Fee Ticket Platform Work?",
          summary:
            "A zero fee ticket platform separates payment processing from ticketing software. Instead of deducting a percentage commission (like 3.7% to 10%) from every ticket sold, URPASS operates as a predictable software subscription starting at ₹499/mo ($9/mo) and a permanent ₹0 free tier. All ticket payments settle directly to your connected merchant account with 0% platform cut.",
          keyPoints: [
            "0% ticketing platform commission on all ticket tiers and registration volumes",
            "Keep 100% of your ticket price — zero hidden attendee service fees added at checkout",
            "Direct T+2 settlement into your bank account via your connected payment gateway",
            "Includes sub-0.3s mobile QR check-in, Ticket Studio pass design, and real-time analytics",
          ],
        },
        keyFactsTable: {
          title: "Fee Economics: URPASS vs Legacy Commission Aggregators",
          subtitle: "Revenue retention analysis on an event with $25,000 / ₹20,00,000 in gross ticket sales.",
          headers: ["Financial Component", "URPASS Zero-Fee Platform", "Legacy Commission Platforms (Eventbrite / etc.)"],
          rows: [
            { col1: "Platform Percentage Commission", col2: "0% ($0 / ₹0 deducted)", col3: "3.7% to 7.5% ($925 to $1,875 deducted)" },
            { col1: "Per-Ticket Surcharge", col2: "$0 / ₹0 per ticket", col3: "$0.99 to $1.79 added per ticket" },
            { col1: "Net Revenue Retained by Organizer", col2: "100% (minus standard gateway fee)", col3: "90% to 94% of gross revenue" },
            { col1: "Payout Timeline", col2: "Direct T+2 business days to your bank", col3: "Withheld until 5–14 days post-event" },
            { col1: "Free Community Events", col2: "Free forever (up to 100 reg/mo)", col3: "Restricted attendee caps or paid tier" },
          ],
        },
        features: [
          { icon: CreditCard, title: "0% Platform Commission", desc: "Keep 100% of your gross ticket sales. We never take a cut of your hard-earned event revenue." },
          { icon: Zap, title: "Direct Bank Settlements", desc: "Ticket funds deposit directly into your connected Indian or international bank account on standard T+2 cycles." },
          { icon: Ticket, title: "Custom Ticket Studio", desc: "Design bespoke digital passes, printable tickets, or conference lanyard badges with your branding and dynamic QR codes." },
          { icon: ShieldCheck, title: "Sub-0.3s Camera Check-In", desc: "Scan passes at venue doors in under 0.3s using standard volunteer smartphones with zero app downloads." },
          { icon: Users, title: "Application Screening Queues", desc: "Review registrant applications, screen custom questions, and approve attendees with 1 click." },
          { icon: BarChart3, title: "Real-Time Sales Telemetry", desc: "Track sales velocity, tier breakdown, and gate arrival percentages live from any organizer screen." },
        ],
        steps: [
          { n: "01", title: "Create Event Details", desc: "Set event dates, venue location, ticket tiers, and pricing in under 3 minutes." },
          { n: "02", title: "Link Payment Gateway", desc: "Connect your verified Razorpay or Stripe account for direct, commission-free deposits." },
          { n: "03", title: "Share Registration URL", desc: "Publish your high-converting, mobile-optimized page with zero surprise checkout fees." },
          { n: "04", title: "Automated Pass Dispatch", desc: "Attendees receive cryptographically signed digital QR passes immediately upon purchase." },
          { n: "05", title: "Sub-Second Gate Entry", desc: "Staff scan tickets at venue gates with smartphone cameras for rapid entry." },
        ],
        callout: {
          badge: "HONEST PRICING",
          title: "Eliminate commission middlemen and fund your event directly.",
          description: "When you sell tickets through legacy ticketing sites, you surrender thousands of dollars that should be funding keynote speakers, catering, and venue improvements. URPASS gives you enterprise ticketing for a simple, flat subscription.",
          bullets: [
            "0% commission across all ticket tiers and pricing levels",
            "Permanent Free Tier for community events up to 100 registrations/month",
            "30-day free trial on all paid plans with ₹0 due today and no credit card required",
            "Complete ownership and exportability of your attendee contact data",
          ],
        },
        faqs: [
          { q: "Are there any hidden fees or setup charges?", a: "No. URPASS charges zero setup fees, zero per-ticket commissions, and zero attendee convenience fees. You only pay standard gateway processing fees directly to Razorpay or Stripe." },
          { q: "How quickly do ticket funds reach my bank account?", a: "Because you connect your own payment gateway (Razorpay or Stripe), payouts settle on standard T+2 business day cycles directly into your bank without being held by URPASS." },
          { q: "Can I use URPASS for completely free events?", a: "Yes. Our permanent Free Tier allows you to host up to 2 events per month and issue up to 100 passes per month completely free of charge." },
          { q: "Can I test paid features before subscribing?", a: "Yes. All paid URPASS plans (Starter, Pro, Business) feature a full 30-day free trial with no credit card required." },
        ],
        relatedLinks: [
          { title: "Pricing & 30-Day Free Trial", href: "/pricing", category: "Product" },
          { title: "Event Registration Without Fees", href: "/event-registration-without-fees", category: "Product" },
          { title: "Eventbrite Alternative", href: "/compare/eventbrite-alternative", category: "Comparison" },
          { title: "Conference Registration Software", href: "/conference-registration-software", category: "Use Case" },
        ],
      }}
    />
  );
}
