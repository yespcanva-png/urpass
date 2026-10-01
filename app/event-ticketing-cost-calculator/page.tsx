import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import EventTicketingCostCalculator from "@/components/calculator/EventTicketingCostCalculator";
import FAQItemSection from "@/components/landing/FAQItemSection";
import Link from "next/link";
import {
  Percent,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  Receipt,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Event Ticketing Fee Calculator India | Calculate Your Event Costs | URPASS",
  description:
    "Calculate event ticketing fees, payment gateway cuts, and GST in India. Enter your ticket price and volume to see platform deductions vs. URPASS 0% commission.",
  keywords: [
    "event ticketing fee calculator india",
    "ticket cost calculator",
    "event fee calculator india",
    "event ticketing payment gateway fees",
    "zero commission event ticketing india",
    "razorpay event ticketing fee",
    "gst on event tickets india",
    "townscript fee calculator",
    "eventbrite india fee calculator",
  ],
  alternates: {
    canonical: "https://urpass.space/event-ticketing-cost-calculator",
  },
  openGraph: {
    title: "Event Ticketing Fee Calculator India | Calculate Your Event Costs | URPASS",
    description:
      "Enter your ticket price, ticket volume, platform cut, and GST to see your net earnings vs URPASS 0% platform commission.",
    url: "https://urpass.space/event-ticketing-cost-calculator",
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

const FAQS = [
  {
    q: "How does the URPASS 0% platform commission work?",
    a: "Unlike traditional Indian ticketing portals that deduct between 4% and 8% per ticket sold, URPASS takes 0% commission on your ticket revenue. Organizers only pay standard payment gateway interchange fees (approx 2% via linked Razorpay) and a transparent flat monthly subscription starting at ₹0 for free events or ₹999/mo for Pro.",
  },
  {
    q: "What payment gateway fees apply to event tickets in India?",
    a: "Payment gateways in India typically charge approximately 2.0% + 18% GST on transactions for domestic debit cards, net banking, and UPI. Credit cards and international cards may incur slightly higher standard interchange rates. On URPASS, these payments settle directly into your bank account on standard T+2 cycles.",
  },
  {
    q: "Is GST applicable on event ticketing platform fees in India?",
    a: "Yes. Under Indian GST law, event ticketing and software services fall under SAC 998596 and attract 18% GST on the service fees charged by platforms and payment gateways. When platforms charge large percentage cuts, the GST on those fees further reduces your net take-home revenue.",
  },
  {
    q: "Can I issue automated GST invoices to attendees?",
    a: "Yes. URPASS enables organizers to collect attendee GSTIN numbers during registration and automatically generates compliant B2B tax PDF receipts with your organization's GST details, SAC code, and reverse charge annotations.",
  },
  {
    q: "When do ticket sales deposit into my bank account?",
    a: "Because you connect your own verified Razorpay account to URPASS, your ticket revenue settles directly into your Indian bank account on standard T+2 business days. URPASS never holds your funds until after the event concludes.",
  },
];

export default function EventTicketingCostCalculatorPage() {
  const canonical = "https://urpass.space/event-ticketing-cost-calculator";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "URPASS Event Ticketing Fee Calculator",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Event Cost Calculator",
    operatingSystem: "Web, iOS, Android",
    url: canonical,
    publisher: {
      "@type": "Organization",
      name: "URPASS",
      url: "https://urpass.space",
    },
    description:
      "Interactive fee calculator for Indian event organizers to calculate ticket revenue, platform commissions, gateway interchange fees, and GST deductions.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "0",
      highPrice: "999",
      offerCount: "3",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://urpass.space",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: "https://urpass.space/ticket-fee-calculator",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Event Ticketing Fee Calculator India",
        item: canonical,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div>
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8 bg-gradient-to-b from-neutral-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              INDIA TICKETING COST ANALYSIS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] mb-6">
              Event Ticketing Fee Calculator India
            </h1>

            <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-10">
              Calculate your exact platform cuts, payment gateway fees, and 18% GST deductions. See how much money you keep by switching to URPASS.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200/80 px-4 py-2.5 rounded-2xl shadow-2xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> ₹0 to Start
              </span>
              <span className="text-neutral-300">•</span>
              <span>Direct Razorpay Bank Settlements</span>
              <span className="text-neutral-300">•</span>
              <span>0% Platform Commission</span>
              <span className="text-neutral-300">•</span>
              <span>Automated GST Invoices</span>
            </div>
          </div>
        </section>

        {/* Calculator Widget */}
        <section className="pb-24 px-5 sm:px-8">
          <EventTicketingCostCalculator />
        </section>

        {/* Breakdown Explanation */}
        <section className="py-20 px-5 sm:px-8 bg-neutral-50/70 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Fee Transparency</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
                Where Do Your Ticket Fees Actually Go?
              </h2>
              <p className="text-sm text-neutral-500 mt-2">
                Understanding the 3 distinct cost components of online ticketing in India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 font-bold">
                  %
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">1. Platform Commission</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Traditional aggregators charge between 4% and 8% per ticket, or add convenience fees to buyers. URPASS eliminates this with a 0% commission subscription model.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">2. Payment Gateway</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Banks and UPI networks charge interchange (~2.0%). By connecting your own Razorpay account, you pay genuine interchange rates without inflated platform markups.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">3. GST Compliance</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  18% GST applies to software and gateway fees. URPASS automates GSTIN capture at checkout and generates compliant tax invoices for your attendees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-5 sm:px-8 bg-white border-t border-neutral-100">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Common Questions</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
                Frequently Asked Questions About Indian Event Ticketing Fees
              </h2>
            </div>
            <FAQItemSection faqs={FAQS} />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-5 sm:px-8 bg-neutral-900 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Keep 100% of your ticket revenue.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Start your first event on URPASS today. Set up in 5 minutes with zero platform commission.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-neutral-100 transition-colors"
              >
                <span>Start selling tickets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Compare URPASS Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
