import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import EventImporter from "@/components/importer/EventImporter";
import Link from "next/link";
import {
  Link2,
  ArrowRight,
  CheckCircle2,
  Percent,
  ScanLine,
  ShieldCheck,
  Zap,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Switch to URPASS: 1-Click Event Migration | 0% Ticket Fees",
  description:
    "Migrate your event from Eventbrite, Luma, Townscript, or Google Forms to URPASS in seconds. Eliminate platform commissions, unlock sub-0.3s QR check-in, and accept native UPI.",
  keywords: [
    "switch to urpass",
    "migrate from eventbrite",
    "eventbrite alternative import",
    "switch from townscript",
    "import google forms event",
    "0 commission event ticketing",
    "event migration tool",
  ],
  alternates: {
    canonical: "https://urpass.space/switch-to-urpass",
  },
  openGraph: {
    title: "Switch to URPASS: 1-Click Event Migration | 0% Ticket Fees",
    description:
      "Paste your existing event URL to switch to URPASS in under 30 seconds. Zero ticket commissions and fast in-browser QR scanning.",
    url: "https://urpass.space/switch-to-urpass",
    locale: "en_IN",
    type: "website",
  },
};

const FAQS = [
  {
    q: "How does the 1-click event import work?",
    a: "Simply paste the public link of your event from Eventbrite, Luma, Google Forms, Townscript, or Meetup. Our migration engine parses your event title, description, and settings, and pre-configures a fee-free URPASS event page ready for publishing.",
  },
  {
    q: "Can I import attendees who have already registered on Google Forms or another site?",
    a: "Yes. Once your event is created on URPASS, you can use our CSV Bulk Import tool in the Attendees dashboard to upload your existing spreadsheet. URPASS will automatically issue cryptographic digital QR passes to each attendee via email.",
  },
  {
    q: "Can I run URPASS alongside my existing ticketing page?",
    a: "Yes. Many organizers use URPASS exclusively for on-ground door scanning, VIP check-ins, or workshop registrations alongside an existing event listing.",
  },
  {
    q: "How much will I save by switching to URPASS?",
    a: "Legacy platforms take 3.7% to 10% of your gross ticket sales in platform convenience fees. On URPASS, you pay 0% per-ticket platform commission. On ₹5,00,000 in ticket sales, switching saves you upwards of ₹25,000.",
  },
  {
    q: "Do my gate volunteers need to download an app to scan tickets?",
    a: "No. Unlike other platforms that mandate installing native apps, URPASS gate scanners run natively inside any mobile browser (Safari, Chrome). Staff open a secure scanner link on their phones and scan in under 0.3 seconds.",
  },
];

export default function SwitchToUrpassPage() {
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
      { "@type": "ListItem", position: 2, name: "Switch to URPASS", item: "https://urpass.space/switch-to-urpass" },
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

        {/* Hero Section with Importer */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-5 sm:px-8 border-b border-neutral-200/80 bg-white">
          <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
              <Link2 className="w-3.5 h-3.5" />
              INSTANT PLATFORM MIGRATION
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Switch to URPASS in Under 30 Seconds
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Stop losing 4% to 7% of your revenue to ticketing platform commissions. Paste your existing event link below to migrate instantly.
            </p>
          </div>

          <EventImporter />
        </section>

        {/* 3 Step Migration Process */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950">
              How Simple Is It to Switch?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Three seamless steps with zero disruption to your existing ticket holders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-3xl font-black text-violet-600 font-mono mb-2 block">01</span>
              <h3 className="text-base font-bold text-neutral-900">Paste & Import</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Paste your current Eventbrite, Luma, Townscript, or Google Form URL. URPASS auto-extracts your event title, agenda, and tier configuration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-3xl font-black text-violet-600 font-mono mb-2 block">02</span>
              <h3 className="text-base font-bold text-neutral-900">Upload Past Attendees</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Have attendees who already bought tickets or registered on Google Forms? Upload your CSV spreadsheet to issue dynamic QR passes in bulk.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-3xl font-black text-violet-600 font-mono mb-2 block">03</span>
              <h3 className="text-base font-bold text-neutral-900">Scan & Keep 100%</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Use our sub-0.3s browser scanner at the venue entrance. New ticket sales process via native UPI/Cards with zero platform cuts.
              </p>
            </div>
          </div>

          {/* FAQs */}
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
              Ready to eliminate your event ticketing fees?
            </h2>
            <p className="mt-3 text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Launch your fee-free registration page on URPASS today. Permanent free tier available, with no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup?ref=switch-cta"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm transition-all shadow-md"
              >
                Create Your Free Account →
              </Link>
              <Link
                href="/ticket-fee-calculator"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Calculate Fee Savings
              </Link>
            </div>
            <p className="text-[11px] text-neutral-400 mt-4">
              ₹0 forever free tier · 0% ticketing commission · Sub-0.3s camera check-in
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
