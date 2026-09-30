import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SponsorshipForm from "@/components/sponsorship/SponsorshipForm";
import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ScanLine,
  Layers,
  Percent,
  ShieldCheck,
  Zap,
  Users,
  Building,
  HeartHandshake,
} from "lucide-react";

export const metadata: Metadata = {
  title: "College Fest & Hackathon Sponsorship Program | URPASS",
  description:
    "Free ticketing and QR check-in software sponsorship for college technical symposiums, cultural fests, and hackathons. Get free Pro tier access, custom pass branding, and sub-0.3s volunteer scanners.",
  keywords: [
    "college fest sponsorship",
    "hackathon sponsorship",
    "event ticketing sponsorship",
    "free event software for students",
    "college symposium qr tickets",
    "hackathon check in software",
    "student club event tools",
  ],
  alternates: {
    canonical: "https://urpass.space/sponsorship",
  },
  openGraph: {
    title: "College Fest & Hackathon Sponsorship Program | URPASS",
    description:
      "100% Free Pro tier sponsorship for college fests, technical symposiums, and student hackathons. Custom digital QR passes, sub-0.3s mobile scanning, and 0% ticket commissions.",
    url: "https://urpass.space/sponsorship",
    locale: "en_IN",
    type: "website",
  },
};

const FAQS = [
  {
    q: "Who is eligible for the URPASS Campus Sponsorship Program?",
    a: "Any verified student club, technical society (IEEE, ACM, CSI, GDG On Campus), college cultural fest committee, academic department, or hackathon organizing team at an accredited university or college is eligible for 100% free sponsorship.",
  },
  {
    q: "What perks do sponsored college events receive?",
    a: "Sponsored events receive full access to the URPASS Pro tier (valued at ₹999/month to ₹2,499/month) completely free of charge. This includes unlimited attendee registrations, custom Ticket Studio pass branding (college and sponsor logos), volunteer sub-0.3s mobile browser camera scanners, offline gate check-in sync, and 0% per-ticket commission.",
  },
  {
    q: "What does URPASS ask for in return?",
    a: "We only ask for simple mutual partnership visibility: (1) Add 'Ticketing Partner: URPASS' with a link to https://urpass.space on your official fest website, Unstop, or Devfolio portal, and (2) Use the URPASS browser scanner at your venue registration desks.",
  },
  {
    q: "Can we use URPASS if our college fest charges an entry fee or workshop fee?",
    a: "Yes. You can sell paid workshop or fest passes directly via UPI QR (PhonePe, Google Pay, Paytm) with 0% platform commission on URPASS. All ticket funds settle directly to your college or club merchant bank account on a T+2 schedule.",
  },
  {
    q: "How fast will our sponsorship application be approved?",
    a: "Applications are reviewed by our campus partnership team within 12 hours. Once verified, we will email your student coordinator an instant activation voucher granting full Pro access.",
  },
];

export default function SponsorshipPage() {
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
      { "@type": "ListItem", position: 2, name: "College Sponsorship", item: "https://urpass.space/sponsorship" },
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
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-5 sm:px-8 border-b border-neutral-200/80 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                COLLEGE & HACKATHON SPONSORSHIP PROGRAM
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
                Free Ticketing & QR Check-In for Student Events
              </h1>
              <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
                Hosting a college fest, hackathon, or technical symposium? URPASS sponsors student communities with 100% free Pro event software, custom badge passes, and sub-0.3s volunteer door scanners.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Pro tier upgrade (Unlimited attendees & custom branding)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sub-0.3s phone camera scanner (No app downloads for volunteers)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Native Indian UPI QR checkouts with 0% platform commission</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-gate duplicate entry protection and live arrival telemetry</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Form */}
            <div className="lg:col-span-6">
              <SponsorshipForm />
            </div>
          </div>
        </section>

        {/* Perks Grid */}
        <section className="py-16 sm:py-24 px-5 sm:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950">
              Everything Your Student Organizing Team Needs
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Built for high-energy campus environments, packed auditorium entrances, and multi-track hackathons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Custom Ticket Studio</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Design custom digital tickets featuring your college logo, department insignia, and sponsor banners in vertical badge, horizontal pass, or square wallet cards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                <ScanLine className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Sub-0.3s Browser Scanner</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Student volunteers simply open a secure link in Safari or Chrome to scan attendee QR codes. Zero app store downloads, loud audio chimes, and instant duplicate lockout.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-4">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">0% Commission Ticketing</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Collecting fees for specialized workshops, masterclasses, or concert nights? Attendees pay via PhonePe, GPay, or Paytm, and your club keeps 100% of revenue.
              </p>
            </div>
          </div>

          {/* Partnership Agreement Section */}
          <div className="mt-16 bg-gradient-to-br from-violet-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <span className="p-3 rounded-2xl bg-white/10 text-violet-200 inline-block mb-4">
                <HeartHandshake className="w-8 h-8" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">Our Simple Partnership Terms</h2>
              <p className="text-xs sm:text-sm text-violet-200 mt-3 leading-relaxed">
                We believe in supporting the next generation of engineers, designers, and student leaders. In exchange for free software sponsorship, we ask only for:
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="p-5 rounded-2xl bg-white/10 border border-white/10 text-xs">
                  <p className="font-bold text-white text-sm">1. Website / Portal Partner Logo</p>
                  <p className="text-violet-200 mt-1">
                    Display &ldquo;Ticketing Partner: URPASS&rdquo; linking to https://urpass.space on your fest site, registration portal, or social link tree.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/10 border border-white/10 text-xs">
                  <p className="font-bold text-white text-sm">2. Door Scanner Utilization</p>
                  <p className="text-violet-200 mt-1">
                    Use URPASS mobile browser check-in scanner at your venue registration desks to validate attendees and eliminate queue congestion.
                  </p>
                </div>
              </div>
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
        </section>
      </div>

      <Footer />
    </div>
  );
}
