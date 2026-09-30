import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import TicketFeeCalculator from "@/components/calculator/TicketFeeCalculator";
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
} from "lucide-react";

export const metadata: Metadata = {
  title: "Event Ticket Fee Calculator: Compare Platform Commissions | URPASS",
  description:
    "Calculate how much money you lose to ticketing platform fees on Eventbrite, Townscript, and Luma. See your exact savings with URPASS's 0% ticket commission model.",
  keywords: [
    "ticket fee calculator",
    "event ticketing fee calculator",
    "eventbrite fee calculator",
    "townscript fees",
    "zero commission event ticketing",
    "event registration fee comparison",
    "free event ticketing platform",
  ],
  alternates: {
    canonical: "https://urpass.space/ticket-fee-calculator",
  },
  openGraph: {
    title: "Event Ticket Fee Calculator: Compare Platform Commissions | URPASS",
    description:
      "Calculate ticketing platform fees across Eventbrite, Townscript, Luma, and URPASS. Keep 100% of your ticket revenue.",
    url: "https://urpass.space/ticket-fee-calculator",
    locale: "en_IN",
    type: "website",
  },
};

const FAQS = [
  {
    q: "How does the URPASS 0% ticket commission model work?",
    a: "Unlike legacy ticketing aggregators that take 3.7% to 10% from every ticket sale, URPASS does not take any percentage cut from your ticket revenue. Organizers pay only a flat, predictable monthly software subscription or use the ₹0 forever Free Tier. Standard payment processor interchange fees (such as Razorpay or Stripe) settle directly to your merchant account.",
  },
  {
    q: "How much does Eventbrite charge per ticket?",
    a: "Eventbrite typically charges up to 3.7% plus a flat fee per ticket (approx ₹70 in India or £0.79 in the UK, $1.79 in the US) on paid events, in addition to payment processing fees. Eventbrite also limits free events to 25 attendees on basic organizer plans.",
  },
  {
    q: "How much does Townscript charge Indian event organizers?",
    a: "Townscript charges approximately 3.99% plus ₹10 per ticket transaction convenience fee. For an event selling 1,000 tickets at ₹500, this equates to roughly ₹25,000 to ₹30,000 in deducted platform fees.",
  },
  {
    q: "Can I use URPASS for free events without paying anything?",
    a: "Yes. URPASS offers a permanent ₹0 Free Tier that includes up to 2 active events per month and 100 attendee registrations per month with full QR code generation, email pass delivery, and mobile browser camera scanning included. No credit card is required.",
  },
  {
    q: "When and how do I receive the money from ticket sales?",
    a: "Ticket revenue never sits in a third-party aggregator pool. Because you connect your own Razorpay or Stripe account directly, ticket funds are deposited straight into your bank account on a standard T+2 settlement cycle.",
  },
];

export default function TicketFeeCalculatorPage() {
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://urpass.space" },
      { "@type": "ListItem", position: 2, name: "Ticket Fee Calculator", item: "https://urpass.space/ticket-fee-calculator" },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col justify-between selection:bg-violet-100 selection:text-violet-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div>
        <Navbar />

        {/* Hero & Interactive Calculator Section */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8 border-b border-neutral-200/80 bg-white">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
              <Percent className="w-3.5 h-3.5" />
              INTERACTIVE REVENUE SAVINGS TOOL
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Event Ticket Fee Calculator
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Compare platform commission deductions across Eventbrite, Townscript, Luma, and URPASS in real time. Keep 100% of your event earnings.
            </p>
          </div>

          {/* Interactive Calculator Component */}
          <TicketFeeCalculator />
        </section>

        {/* Deep Dive Breakdown */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
                3.7%+
              </div>
              <h3 className="text-base font-bold text-neutral-900">The Commission Trap</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Aggregators deduct percentage cuts from every single ticket sold. As your event scales and sells more tickets, your software cost skyrockets unnecessarily.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                ₹0
              </div>
              <h3 className="text-base font-bold text-neutral-900">Predictable Flat SaaS</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                URPASS operates on 0% per-ticket platform commission. You pay a predictable, flat monthly plan (or ₹0 on the free tier), keeping 100% of ticket sales.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4">
                T+2
              </div>
              <h3 className="text-base font-bold text-neutral-900">Direct Merchant Payouts</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Funds never sit in an aggregator escrow account waiting for post-event clearance. Payments flow straight through your Razorpay account into your bank.
              </p>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="mt-16 bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
              <h2 className="text-lg font-bold text-neutral-900">Platform Commission Comparison</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Based on publicly documented pricing structures.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
                  <tr>
                    <th className="py-3.5 px-5">Platform</th>
                    <th className="py-3.5 px-5">Platform Commission</th>
                    <th className="py-3.5 px-5">Payout Timeline</th>
                    <th className="py-3.5 px-5">Free Plan Allowance</th>
                    <th className="py-3.5 px-5">Door Scanner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  <tr className="bg-emerald-50/30 font-semibold text-neutral-900">
                    <td className="py-4 px-5 text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      URPASS
                    </td>
                    <td className="py-4 px-5 font-bold text-emerald-700">0% per ticket</td>
                    <td className="py-4 px-5">Direct T+2 to your bank</td>
                    <td className="py-4 px-5">100 registrations/month (₹0 forever)</td>
                    <td className="py-4 px-5">Sub-0.3s browser camera (No apps)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-5 font-medium">Eventbrite</td>
                    <td className="py-4 px-5">3.7% + flat fee per ticket</td>
                    <td className="py-4 px-5">After event completion</td>
                    <td className="py-4 px-5">Limited to 25 attendees</td>
                    <td className="py-4 px-5">Eventbrite Organizer app required</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-5 font-medium">Townscript</td>
                    <td className="py-4 px-5">3.99% + ₹10 per ticket</td>
                    <td className="py-4 px-5">Post-event disbursement</td>
                    <td className="py-4 px-5">Basic free event tier</td>
                    <td className="py-4 px-5">Dedicated app required</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-5 font-medium">Luma (lu.ma)</td>
                    <td className="py-4 px-5">5.0% platform fee</td>
                    <td className="py-4 px-5">Stripe payout schedule</td>
                    <td className="py-4 px-5">Free events with branding</td>
                    <td className="py-4 px-5">Web RSVP / app check-in</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-black text-neutral-950 text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-neutral-900">{faq.q}</h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Conversion CTA */}
          <div className="mt-20 bg-gradient-to-br from-neutral-900 to-violet-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to stop paying ticketing commissions?
            </h2>
            <p className="mt-3 text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Create your event on URPASS in under 30 seconds. Permanent free tier available, with no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup?ref=calculator-cta"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm transition-all shadow-md"
              >
                Create Your Event Free →
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                View Flat Plans
              </Link>
            </div>
            <p className="text-[11px] text-neutral-400 mt-4">
              ₹0 forever free tier · 30-day free trial on paid plans · No credit card required
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
