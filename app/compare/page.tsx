import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import { GitCompare, ArrowRight, ShieldCheck, Check, Zap, Percent, Smartphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Event Software Comparisons & Alternatives",
  description: "Factual, side-by-side comparisons of URPASS against Eventbrite, Zoho Backstage, Townscript, AllEvents, and Google Forms for event registration and QR check-in.",
  alternates: { canonical: "https://urpass.space/compare" },
  openGraph: {
    title: "Event Software Comparisons & Alternatives | URPASS",
    description: "Compare URPASS with Eventbrite, Zoho Backstage, Townscript, and Google Forms.",
    url: "https://urpass.space/compare",
    locale: "en_IN",
    type: "website",
  },
};

const COMPARISONS = [
  {
    title: "URPASS vs Eventbrite: Head-to-Head Comparison",
    href: "/compare/urpass-vs-eventbrite",
    badge: "0% COMMISSION",
    description: "Compare URPASS vs Eventbrite. Zero per-ticket percentage cuts, sub-0.3s browser-based camera scanning, and direct Razorpay / Stripe payouts.",
    points: [
      "0% per-ticket fees vs Eventbrite 3.7% + fees",
      "In-browser mobile scanning (<0.28s) — Zero app downloads",
      "Permanent ₹0 Free tier for up to 100 registrations/month",
      "Direct UPI, cards, and net banking settlement",
    ],
  },
  {
    title: "URPASS vs Luma (lu.ma): Head-to-Head Comparison",
    href: "/compare/urpass-vs-luma",
    badge: "MODERN TECH MEETS",
    description: "Compare URPASS vs Luma. Eliminate 5% ticket commissions, unlock native Indian UPI QR checkouts, and get high-speed mobile browser check-in.",
    points: [
      "0% per-ticket cut vs Luma 5% platform fee",
      "Native Razorpay UPI QR, PhonePe, GPay, Paytm with T+2 payouts",
      "Sub-0.3s volunteer camera scanner with audio chimes",
      "Ticket Studio multi-ratio passes (vertical, horizontal, square)",
    ],
  },
  {
    title: "Luma Alternative for Modern Events",
    href: "/compare/luma-alternative",
    badge: "COMMISSION-FREE",
    description: "Looking for a Luma (lu.ma) alternative? Host developer conferences, founder meetups, and workshops with 0% ticket fees and instant check-in.",
    points: [
      "Keep 100% of your ticket sales without 5% platform cuts",
      "Native UPI checkout & direct bank settlements",
      "Tamper-proof cryptographic QR passes with anti-duplicate lock",
      "Offline gate check-in with IndexedDB sync",
    ],
  },
  {
    title: "URPASS vs Townscript: Head-to-Head Comparison",
    href: "/compare/urpass-vs-townscript",
    badge: "INDIAN TICKETING",
    description: "Compare URPASS vs Townscript. Eliminate high transaction cuts (up to 3.99% + ₹10), get direct T+2 bank deposits, and scan attendees in 0.3s.",
    points: [
      "0% per-ticket commission vs ~3.99% + ₹10 fees",
      "Direct T+2 settlement into your bank account via Razorpay",
      "Sub-0.3s phone camera scanner with zero app downloads",
      "Multi-gate cloud lock prevents duplicate screenshots",
    ],
  },
  {
    title: "URPASS vs Meetup.com: Head-to-Head Comparison",
    href: "/compare/urpass-vs-meetup",
    badge: "COMMUNITY PLATFORMS",
    description: "Stop paying Meetup's $19–$35/month recurring group fee. URPASS offers a permanent ₹0 Free Tier, digital QR tickets, and 100% data ownership.",
    points: [
      "₹0 monthly organizer fee vs Meetup $19–$35/month",
      "0% ticketing fee on paid workshops and sessions",
      "Sub-0.3s phone camera QR scanning at the door",
      "100% full attendee email & data ownership with CSV export",
    ],
  },
  {
    title: "Google Forms vs URPASS for Event Registration",
    href: "/compare/google-forms-vs-urpass",
    badge: "WORKFLOW COMPARISON",
    description: "Why Google Forms works for survey data collection but falls short for QR passes, entrance scanning, and duplicate entry prevention.",
    points: [
      "Instant digital QR passes vs plain spreadsheet rows",
      "Sub-second camera scanning vs manual name search",
      "Automated single-use duplicate lockout",
      "Real-time attendance metrics & post-event feedback",
    ],
  },
  {
    title: "URPASS vs Zoho Backstage",
    href: "/compare/urpass-vs-zoho-backstage",
    badge: "AGILE ALTERNATIVE",
    description: "A lightweight, rapid alternative to Zoho Backstage. 5-minute setup without enterprise bloat, ideal for colleges, hackathons, and workshops.",
    points: [
      "Zero enterprise software complexity or steep learning curve",
      "Instant mobile browser scanning for volunteers",
      "Permanent free tier for up to 100 registrations/month",
      "Built for agile fests, meetups, and academic symposiums",
    ],
  },
  {
    title: "Townscript Alternative for Event Organizers",
    href: "/compare/townscript-alternative",
    badge: "FLAT PRICING",
    description: "Compare Townscript and URPASS. How modern Indian organizers eliminate high ticketing transaction fees and simplify door check-in.",
    points: [
      "Flat subscription model instead of per-ticket transaction cuts",
      "Instant pass generation and QR verification",
      "Integrated post-event feedback surveys",
      "Full exportable attendee database ownership",
    ],
  },
  {
    title: "AllEvents Alternative for Modern Ticketing",
    href: "/compare/allevents-alternative",
    badge: "DIRECT TICKETING",
    description: "Looking for an AllEvents.in alternative? Host clean, white-labeled registration pages without distracting competitor ads.",
    points: [
      "Ad-free, dedicated event registration links",
      "Custom branded passes with your organization colors",
      "Fast multi-gate volunteer QR scanning",
      "Comprehensive real-time check-in analytics",
    ],
  },
  {
    title: "Eventbrite Alternative for India",
    href: "/compare/eventbrite-alternative-india",
    badge: "PRICING & LOCAL PAYMENTS",
    description: "Compare URPASS with Eventbrite. Zero per-ticket commission, flat monthly pricing, and native UPI/Razorpay integration for Indian organizers.",
    points: [
      "Zero per-ticket percentage cuts (keep 100% of revenue)",
      "Native UPI (Google Pay, PhonePe, Paytm) integration",
      "Mobile browser scanning with zero app downloads",
      "Affordable flat monthly plans with 30-day free trial",
    ],
  },
];

export default function CompareHubPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://urpass.space" },
      { "@type": "ListItem", position: 2, name: "Comparisons & Alternatives", item: "https://urpass.space/compare" },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div>
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              <GitCompare className="w-3.5 h-3.5 text-brand" />
              FACTUAL SOFTWARE COMPARISONS
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6 leading-tight">
              Event Software Comparisons &amp; Alternatives
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Explore honest, side-by-side breakdowns of how URPASS compares with legacy event ticketing platforms, enterprise suites, and spreadsheet-based workflows.
            </p>
          </div>
        </section>

        {/* Comparison Cards */}
        <section className="py-20 px-5 sm:px-8 bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPARISONS.map((item) => (
              <div
                key={item.title}
                className="p-6 sm:p-8 rounded-3xl border border-neutral-200 bg-neutral-50/40 hover:bg-white hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-brand uppercase bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full inline-block mb-4">
                    {item.badge}
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900 mb-3 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {item.points.map((pt) => (
                      <li key={pt} className="text-xs text-neutral-700 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={item.href}
                  className="inline-flex items-center justify-between w-full py-3 px-4 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-900 hover:border-brand hover:text-brand transition-colors"
                >
                  <span>Read full comparison</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
