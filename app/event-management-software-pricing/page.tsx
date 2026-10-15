import type { Metadata } from "next";
import { Banknote, CheckCircle2, ShieldCheck, Zap, Receipt, Users, Clock, Award } from "lucide-react";
import SEOPage from "@/components/landing/SEOPage";

export const metadata: Metadata = {
  title: "Event Registration Software Pricing in India — ₹29 Intro Offer | URPASS",
  description:
    "Transparent event registration software pricing in India. Get started with our ₹29 introductory offer, 0% platform ticket commission, and pay-as-you-go single-event passes.",
  keywords: [
    "event management software pricing",
    "event registration software pricing in india",
    "event ticketing software pricing india",
    "zero commission event ticketing india",
    "cheap event registration software india",
    "eventbrite alternative pricing india",
    "razorpay event ticketing cost",
  ],
  alternates: {
    canonical: "https://urpass.space/event-management-software-pricing",
  },
  openGraph: {
    title: "Event Registration Software Pricing in India | URPASS",
    description:
      "Transparent event registration software pricing for Indian organizers. ₹29 introductory offer, 0% ticket commission, and pay-as-you-go passes.",
    url: "https://urpass.space/event-management-software-pricing",
    locale: "en_IN",
    type: "website",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};

export default function EventManagementSoftwarePricingPage() {
  return (
    <SEOPage
      config={{
        badge: "TRANSPARENT INR PRICING",
        h1: "Event Registration Software Pricing in India",
        canonicalUrl: "https://urpass.space/event-management-software-pricing",
        description:
          "Zero percentage commissions, direct Razorpay UPI settlements, and predictable flat pricing. Start with our ₹29 introductory offer for the first 2 months.",
        ctaLabel: "Get Started for ₹29 →",
        ctaHref: "/signup?plan=pro&from=event-management-software-pricing",
        secondaryCtaLabel: "View All Plans",
        secondaryCtaHref: "/pricing",
        directAnswer: {
          title: "How Much Does Event Registration Software Cost in India?",
          summary:
            "Unlike legacy ticketing portals that charge 3% to 8% plus convenience fees on every ticket sold, URPASS operates on 0% platform ticket commissions. Indian organizers can get started with an introductory offer of ₹29/month for their first 2 months on Starter (₹499/mo renewal) or Pro (₹999/mo renewal) plans, or choose single-event passes starting at ₹299 with zero recurring commitment.",
          keyPoints: [
            "₹29 introductory offer for the first 2 consecutive months on monthly plans",
            "0% platform commission on paid ticket revenue — retain 100% of ticket sales",
            "Direct T+2 bank deposits via your verified Razorpay merchant gateway",
            "Pay-as-you-go single-event passes starting at ₹299 for one-off college fests",
          ],
        },
        whatIs: {
          title: "Why Flat Pricing Beats Percentage-Based Ticketing in India",
          definition:
            "Percentage-based ticketing platforms penalize organizers as their events grow. If you sell 1,000 passes at ₹500, a typical 5% aggregator fee siphons ₹25,000 directly from your event budget. Flat software subscription pricing fixes your technology costs, allowing you to maximize event revenue.",
          details: [
            "Save ₹20,000 to ₹1,50,000+ per event compared to Eventbrite or Townscript",
            "Automated 18% GST tax invoices with HSN/SAC codes for institutional compliance",
            "Instant UPI QR checkout (Google Pay, PhonePe, Paytm, Cred) reduces cart abandonment",
            "Sub-second (<0.3s) mobile browser QR entry scanning included across all tiers",
          ],
        },
        keyFactsTable: {
          title: "URPASS India Pricing & Plan Matrix",
          subtitle: "All plans include 0% ticket commission and sub-second browser scanning.",
          headers: ["Plan Tier", "Pricing (INR)", "Event & Registration Limits"],
          rows: [
            {
              col1: "Starter Plan",
              col2: "₹29/mo (First 2 Months), then ₹499/mo + GST",
              col3: "10 events/mo · 500 registrations/mo · 2 organizer seats",
            },
            {
              col1: "Pro Plan (Recommended)",
              col2: "₹29/mo (First 2 Months), then ₹999/mo + GST",
              col3: "Unlimited events · 2,500 registrations/mo · 5 seats · Ticket Studio pass branding",
            },
            {
              col1: "Business Plan",
              col2: "₹29/mo (First 2 Months), then ₹2,499/mo + GST",
              col3: "Unlimited events · 10,000 registrations/mo · 15 seats · API & webhooks",
            },
            {
              col1: "Event Pass (Single Event)",
              col2: "₹299 one-time",
              col3: "1 event · Up to 300 registrations · Full QR scanning",
            },
            {
              col1: "Event Plus (Single Event)",
              col2: "₹599 one-time",
              col3: "1 event · Up to 1,000 registrations · Full QR scanning",
            },
            {
              col1: "Event Pro (Single Event)",
              col2: "₹999 one-time",
              col3: "1 event · Up to 3,000 registrations · Full QR scanning",
            },
          ],
        },
        featuresTitle: "Why Indian Event Teams Choose URPASS",
        featuresSubtitle: "Built for college fests, corporate conferences, hackathons, and workshops.",
        features: [
          {
            icon: Banknote,
            title: "0% Ticket Commission",
            desc: "Keep 100% of your ticket sales. We never take a percentage cut of your revenue.",
          },
          {
            icon: Zap,
            title: "₹29 Introductory Offer",
            desc: "Launch your first 2 months for just ₹29/month with full access to sub-second QR entry check-in.",
          },
          {
            icon: Receipt,
            title: "Automated GST Invoicing",
            desc: "Download compliant B2B and B2C tax invoices with your organization's GSTIN and SAC codes.",
          },
          {
            icon: ShieldCheck,
            title: "Direct Razorpay UPI",
            desc: "Ticket payments settle directly into your bank account on standard T+2 rolling payout cycles.",
          },
          {
            icon: Users,
            title: "Volunteer Scanner PINs",
            desc: "Volunteers scan passes on their own smartphones with zero hardware rentals or app downloads.",
          },
          {
            icon: Clock,
            title: "Pay-As-You-Go Single Passes",
            desc: "Hosting just one annual college symposium? Choose single-event passes without monthly commitments.",
          },
        ],
        faqs: [
          {
            q: "How does the ₹29 introductory offer work?",
            a: "When you subscribe to Starter, Pro, or Business monthly plans, you pay only ₹29 for your first month and ₹29 for your second month. Starting from month three, billing continues at the standard monthly rate (₹499/mo for Starter, ₹999/mo for Pro, ₹2,499/mo for Business + GST). You can cancel anytime in 1 click from Billing settings.",
          },
          {
            q: "Does URPASS take any commission on ticket sales?",
            a: "No. URPASS charges 0% per-ticket platform commission. You only pay standard payment gateway fees charged by Razorpay (typically ~2% for UPI and domestic cards).",
          },
          {
            q: "Can I host a single event without a monthly subscription?",
            a: "Yes. URPASS offers pay-as-you-go single-event passes: Event Pass (₹299 for up to 300 attendees), Event Plus (₹599 for up to 1,000 attendees), and Event Pro (₹999 for up to 3,000 attendees).",
          },
          {
            q: "Are GST tax invoices provided?",
            a: "Yes. Every subscription or single-event pass purchase generates a tax-compliant GST invoice that you can download directly from your Billing dashboard for accounting and institutional reimbursements.",
          },
          {
            q: "Can I upgrade or downgrade my plan at any time?",
            a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly inside your account. Changes take effect on your next renewal date.",
          },
        ],
        relatedLinks: [
          { title: "Pricing & Plans", href: "/pricing", category: "Product" },
          { title: "Ticket Fee Calculator", href: "/ticket-fee-calculator", category: "Product" },
          { title: "Event Registration Software India", href: "/event-registration-software-india", category: "Use Case" },
          { title: "Eventbrite Alternative India", href: "/eventbrite-alternative-india", category: "Comparison" },
          { title: "College Event Management Software", href: "/college-event-management-software", category: "Use Case" },
        ],
        ctaTitle: "Start for ₹29 Today",
        ctaDescription: "₹29 introductory offer for first 2 months · 0% ticket commission · Cancel anytime",
      }}
    />
  );
}
