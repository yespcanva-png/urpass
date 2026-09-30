import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TicketTemplateList from "@/components/templates/TicketTemplateList";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Templates — Launch Your Event Faster | URPASS",
  description:
    "Start with proven event setups preconfiguring registration forms, attendee QR passes, approval flows, and camera check-in gates for conferences, college fests, VIP galas, and workshops.",
  keywords: [
    "event templates",
    "conference event setup",
    "college fest registration template",
    "event pass templates",
    "conference badge template",
    "RSVP event template",
    "hackathon registration template",
    "VIP event pass design",
    "QR check-in templates",
    "URPASS templates",
  ],
  alternates: {
    canonical: "https://urpass.space/ticket-templates",
  },
  openGraph: {
    title: "Templates — Launch Your Event Faster | URPASS",
    description:
      "Start with proven event setups preconfiguring registration forms, attendee QR passes, approval flows, and camera check-in gates for conferences, college fests, and workshops.",
    url: "https://urpass.space/ticket-templates",
    locale: "en_IN",
    type: "website",
  },
};

const TEMPLATE_FAQS = [
  {
    q: "What does 'Start with a proven event setup' mean?",
    a: "Unlike generic graphic galleries, each URPASS template preconfigures your registration form questions, attendee digital QR pass / lanyard badge design, approval rules, and gate check-in permissions in one click.",
  },
  {
    q: "Can I customize the fields and branding before publishing?",
    a: "Yes. Once you click 'Use Template', your event is created with pre-filled defaults. You can add or remove custom form questions, modify colors, upload your institution logo, and change venue details at any time.",
  },
  {
    q: "What ticket & pass formats are included in each template?",
    a: "Every template standardizes 4 matching assets: the public Event Page, the Registration Form, the Digital QR Pass (for Apple/Google Wallet & mobile browser), and printable Lanyard Badges.",
  },
  {
    q: "Can colleges and enterprises save their own custom templates?",
    a: "Yes. In our Template Studio, organizers can build bespoke multi-gate setups with organization branding and save them as reusable templates across 50+ campus or corporate events.",
  },
  {
    q: "How fast is QR scanning at the gate?",
    a: "Sub-0.3 seconds. Scanners run directly in your smartphone browser with encrypted offline verification tokens, zero app download required for gate staff.",
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
      { "@type": "ListItem", position: 2, name: "Templates", item: "https://urpass.space/ticket-templates" },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
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

        {/* Templates Hub Canvas */}
        <div className="pt-24 sm:pt-32 pb-16 bg-white min-h-screen">
          <TicketTemplateList />

          {/* FAQs */}
          <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
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
            <div className="mt-16 bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Ready to launch your event entry?
              </h2>
              <p className="mt-3 text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Launch your registration page with custom branded passes in minutes. Zero ticket commissions and sub-0.3s camera gate scanning.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup?ref=templates-cta"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm transition-all shadow-md"
                >
                  Create Your Free Account →
                </Link>
                <Link
                  href="/studio"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
                >
                  Launch Template Studio
                </Link>
              </div>
              <p className="text-[11px] text-neutral-400 mt-4">
                ₹0 forever free tier · Instant setup accelerator · Sub-0.3s gate camera scanning
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
