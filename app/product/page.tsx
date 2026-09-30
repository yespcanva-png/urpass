import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  QrCode,
  Users,
  CheckCircle2,
  Workflow,
  Globe2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS Product Overview — The Modern Event Operating System",
  description:
    "Discover how the URPASS product suite unifies event registration, digital QR ticketing, automated approvals, entrance gate validation, and post-event attendee feedback into one seamless ecosystem.",
  keywords: [
    "URPASS product",
    "URPASS event OS",
    "digital pass software",
    "event ticketing architecture",
    "QR entrance software",
    "URPASS platform overview",
  ],
  alternates: { canonical: "https://urpass.space/product" },
  openGraph: {
    title: "URPASS Product Overview — Complete Event Operating System",
    description:
      "A complete walkthrough of the URPASS event product architecture, from public registration to lightning entry check-in.",
    url: "https://urpass.space/product",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "URPASS Product Suite",
      },
    ],
  },
};

export default function ProductPage() {
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
        name: "Product Overview",
        item: "https://urpass.space/product",
      },
    ],
  };

  const productLayers = [
    {
      step: "01",
      title: "Public Event Registration & Ticket Tier Engine",
      description:
        "Every event gets a lightning-fast, mobile-optimized public landing page at urpass.space/apply/[your-event]. Collect custom attendee questions, student IDs, company titles, and accept instant Razorpay payments with zero platform commission.",
      link: "/online-event-registration",
      tag: "Registration Layer",
    },
    {
      step: "02",
      title: "Encrypted Digital Pass & QR Issuance",
      description:
        "Once approved or paid, attendees instantly receive dynamic web passes featuring encrypted QR signatures, attendee name badges, seat or tier designations, and calendar reminders. No mobile app download required.",
      link: "/digital-event-pass",
      tag: "Pass Delivery Layer",
    },
    {
      step: "03",
      title: "Sub-0.3s Entrance Check-in & Gate Access Control",
      description:
        "Staff open the URPASS scanner on any standard iOS or Android browser. Scanning takes under 300ms. An atomic database lock prevents screenshot passes or duplicate reuse across multiple entrance gates.",
      link: "/qr-event-check-in",
      tag: "Gate Control Layer",
    },
    {
      step: "04",
      title: "Live Operations Dashboard & Analytics",
      description:
        "Track entrance velocity, gate throughput, VIP arrival notifications, no-show rates, and export full audit records with timestamps to CSV for post-event compliance and sponsor reports.",
      link: "/event-analytics",
      tag: "Analytics Layer",
    },
    {
      step: "05",
      title: "AI-Powered Event Management (MCP)",
      description:
        "Integrate directly with Claude Desktop, Cursor, or your internal LLMs via Model Context Protocol. Query attendance numbers, send pass reminders, or trigger approvals with natural language prompts.",
      link: "/mcp-event-management",
      tag: "AI Layer",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div>
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              THE URPASS PLATFORM
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              The URPASS Product Suite
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-8">
              A unified operating system engineered to eliminate gate chaos, manual spreadsheets, and predatory ticketing commissions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                Create Event on URPASS
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-5 py-3.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                Explore All Features
              </Link>
            </div>
          </div>
        </section>

        {/* Architecture Flow */}
        <section className="py-24 px-5 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 block mb-2">
                End-to-End Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                How URPASS Powers Your Event
              </h2>
              <p className="text-sm text-neutral-600">
                Five tightly coordinated layers engineered for flawless on-ground execution.
              </p>
            </div>

            <div className="space-y-6">
              {productLayers.map((layer, idx) => (
                <AnimateIn key={layer.step} delay={idx * 60} from="up">
                  <div className="p-8 rounded-2xl border border-neutral-200 bg-neutral-50/40 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800">
                          {layer.step}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
                          {layer.tag}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">
                        {layer.title}
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {layer.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <Link
                        href={layer.link}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-emerald-600 bg-white border border-neutral-200 px-4 py-2 rounded-xl transition-all shadow-2xs hover:shadow-xs"
                      >
                        Explore Layer
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-5 sm:px-8 border-t border-neutral-100 bg-neutral-50 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
              Ready to modernize your event entry?
            </h2>
            <p className="text-neutral-600 text-sm mb-6 max-w-xl mx-auto">
              Get started for free or test our Pro plan with a 30-day trial. Zero credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                Launch Your First Event
              </Link>
              <Link
                href="/pricing"
                className="border border-neutral-300 bg-white text-neutral-800 px-5 py-3 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-colors"
              >
                See Pricing Breakdown
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
