import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TicketTemplateList from "@/components/templates/TicketTemplateList";
import Link from "next/link";
import { Sparkles, Palette, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Event Ticket & Pass Templates: Free & Premium Designs | URPASS",
  description:
    "Browse production-ready event pass templates, mobile ticket designs, and conference badges. 6 Free templates and premium designs from just ₹49 with instant Razorpay UPI.",
  keywords: [
    "ticket templates",
    "event pass templates",
    "conference badge template",
    "printable ticket template",
    "digital ticket design",
    "free event ticket templates",
    "hackathon pass template",
    "college fest ticket template",
    "vip event badge design",
  ],
  alternates: {
    canonical: "https://urpass.space/ticket-templates",
  },
  openGraph: {
    title: "Event Ticket & Pass Templates: Free & Premium Designs | URPASS",
    description:
      "Choose from digital mobile passes, conference badges, and printable stubs. 6 Free templates and premium designs from just ₹49 with instant Razorpay UPI.",
    url: "https://urpass.space/ticket-templates",
    locale: "en_IN",
    type: "website",
  },
};

const TEMPLATE_FAQS = [
  {
    q: "Are the free ticket templates completely free to use?",
    a: "Yes. All 6 free templates (including Minimal Monochrome, College Fest, Academic Conference, and Workshop Masterclass) are 100% free with unlimited attendee issuance and sub-0.3s camera QR check-in on URPASS.",
  },
  {
    q: "How does the ₹49 Razorpay payment work for premium templates?",
    a: "When you select a premium template, our Razorpay checkout opens instantly. You can pay via any UPI app (Google Pay, PhonePe, Paytm, Cred) or debit/credit card. Once approved, the template is permanently unlocked on your account with an unlimited commercial license.",
  },
  {
    q: "What is the ₹99 All-Access Master Pack?",
    a: "The All-Access Master Pack unlocks all 12 current and future pro templates for just ₹99 one-time. You get lifetime access across all your past, present, and future events.",
  },
  {
    q: "Can I customize the template with my college logo and brand colors?",
    a: "Absolutely. Once selected, any template can be opened directly inside our visual Ticket Studio. You can drag and drop your organization logo, modify hex accent colors, adjust font sizes, and toggle dynamic attendee fields.",
  },
  {
    q: "What ticket formats are supported?",
    a: "URPASS templates support 3 standard production formats: Digital Mobile Passes (380x680, optimized for smartphone screens), Conference Badges (440x640, with lanyard hole cutouts), and Printable Tickets (780x340, with perforated tear-off stubs).",
  },
];

export default function TicketTemplatesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TEMPLATE_FAQS.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Ticket Templates", item: "https://urpass.space/ticket-templates" },
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

        {/* Hero Section */}
        <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 px-5 sm:px-8 border-b border-neutral-200/80 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
              <Palette className="w-3.5 h-3.5" />
              TICKET STUDIO & TEMPLATE DIRECTORY
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Event Ticket & Pass Templates
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Choose from production-ready digital mobile passes, conference lanyard badges, and printable ticket stubs. 6 Free designs included, premium templates from just ₹49 with instant UPI.
            </p>
          </div>
        </section>

        {/* Interactive Template List Component */}
        <TicketTemplateList />

        {/* FAQs */}
        <section className="py-16 px-5 sm:px-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-neutral-950 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {TEMPLATE_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900">{faq.q}</h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 bg-gradient-to-br from-neutral-950 to-violet-950 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to design passes for your next event?
            </h2>
            <p className="mt-3 text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Launch your fee-free registration page with custom branded passes in minutes. Zero ticket commissions and sub-0.3s browser camera scanning.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup?ref=templates-cta"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm transition-all shadow-md"
              >
                Create Your Free Account →
              </Link>
              <Link
                href="/free-qr-ticket-generator"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
              >
                Free QR Ticket Generator
              </Link>
            </div>
            <p className="text-[11px] text-neutral-400 mt-4">
              ₹0 forever free tier · Instant Razorpay UPI checkout · Sub-0.3s gate camera scanning
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
