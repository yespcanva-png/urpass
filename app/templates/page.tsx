import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import EventSetupAcceleratorGallery from "@/components/templates/EventSetupAcceleratorGallery";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Event Templates — Launch Proven Event Setups | URPASS",
  description:
    "Start with proven event setups preconfiguring registration forms, attendee QR passes, approval flows, and camera turnstiles for corporate summits, university fests, and exhibitions.",
  alternates: {
    canonical: "https://urpass.space/templates",
  },
  openGraph: {
    title: "Event Templates — Launch Proven Event Setups | URPASS",
    description:
      "Start with proven event setups preconfiguring registration forms, attendee QR passes, approval flows, and camera turnstiles for corporate summits, university fests, and exhibitions.",
    url: "https://urpass.space/templates",
    locale: "en_IN",
    type: "website",
  },
};

const TEMPLATE_FAQS = [
  {
    q: "What does 'Start with a proven event setup' mean?",
    a: "Unlike generic graphic templates, each URPASS event template preconfigures your registration questions, approval flow, attendee QR pass design, and camera check-in gates in one click.",
  },
  {
    q: "Can I customize the fields and branding after creating the event?",
    a: "Yes. Using a template creates an independent copy of the configuration for your event. You can modify form fields, customize branding, add ticket tiers, and change gate rules at any time without affecting the template.",
  },
  {
    q: "Can enterprise companies and university departments save their own templates?",
    a: "Yes. Enterprise teams can save any configured event as an Organization Template with role-based permissions, governance, and versioning across all upcoming events.",
  },
  {
    q: "How fast is QR scanning at event turnstiles?",
    a: "Sub-0.3 seconds. Scanners run directly in standard mobile browsers with encrypted offline verification tokens, requiring zero app downloads for gate staff.",
  },
];

export default function TemplatesPage() {
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

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div>
        <Navbar />

        {/* Enterprise Event Templates Surface */}
        <div className="pt-24 sm:pt-28 pb-16 bg-white min-h-screen">
          <EventSetupAcceleratorGallery />

          {/* FAQs Section */}
          <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto border-t border-neutral-100 mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3.5">
              {TEMPLATE_FAQS.map((faq, idx) => (
                <div key={idx} className="bg-white border border-neutral-200 rounded-xl p-5 shadow-2xs">
                  <h3 className="text-sm font-semibold text-neutral-900">{faq.q}</h3>
                  <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            {/* Bottom Enterprise CTA Banner */}
            <div className="mt-16 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 sm:p-12 text-center text-white shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Accelerate your event operations
              </h2>
              <p className="mt-2.5 text-neutral-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                Launch your complete registration page, turnstile gates, and accredited QR passes in under 5 minutes.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/create-event"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                >
                  Create Event from Scratch →
                </Link>
                <Link
                  href="/ticket-templates"
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs sm:text-sm transition-colors border border-neutral-700"
                >
                  Browse Ticket Pass Designs
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
