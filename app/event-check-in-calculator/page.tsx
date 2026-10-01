import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import EventCheckInCalculator from "@/components/calculator/EventCheckInCalculator";
import FAQItemSection from "@/components/landing/FAQItemSection";
import Link from "next/link";
import {
  ScanLine,
  DoorOpen,
  ShieldCheck,
  Zap,
  Users,
  Smartphone,
  ArrowRight,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Event Check-In Speed & Gate Calculator | URPASS",
  description:
    "Calculate event door entry capacity, required entrance gates, scanner staffing, and queue clearance times. Model 0.3-second QR check-in speeds for large venues.",
  keywords: [
    "event check-in calculator",
    "event gate capacity calculator",
    "qr code event check in speed",
    "event entrance staffing calculator",
    "multi gate event check in",
    "event attendee queue time calculator",
    "conference entry management",
  ],
  alternates: {
    canonical: "https://urpass.space/event-check-in-calculator",
  },
  openGraph: {
    title: "Event Check-In Speed & Gate Calculator | URPASS",
    description:
      "Model attendee arrival curves, entrance gate throughput, and scanner staffing for conferences, college fests, and expos.",
    url: "https://urpass.space/event-check-in-calculator",
    type: "website",
  },
};

const FAQS = [
  {
    q: "How fast can URPASS scan attendee QR tickets at the gate?",
    a: "URPASS scans and validates tickets in under 0.3 seconds directly inside mobile Safari or Chrome. Volunteers do not need to download an app or log into an account; they simply open a secure gate link or scan PIN.",
  },
  {
    q: "How many gates do I need for a 5,000-person event?",
    a: "Assuming attendees arrive over a 60-minute peak window and each scanner operates at standard 1-second cadence, 3 to 5 gates with 1 scanner each can comfortably process 3,000 to 5,000 attendees per hour. With URPASS's sub-0.3s optical speed, a single gate can process up to 30 attendees per minute.",
  },
  {
    q: "Can multiple gates scan simultaneously without duplicate entries?",
    a: "Yes. URPASS utilizes database-level atomic row locking. If two attendees attempt to use the exact same QR code or shared screenshot at two different gates simultaneously, the first scanner receives an instant green approval while the second receives an immediate amber duplicate alert with audio buzz and timestamp of the first entry.",
  },
  {
    q: "What happens if venue WiFi or cellular internet disconnects?",
    a: "URPASS includes an offline IndexedDB fallback. Gate scanners continue verifying cryptographic ticket hashes offline and automatically sync validation logs the moment network connectivity is re-established.",
  },
  {
    q: "Do volunteers need expensive barcode rental hardware?",
    a: "No. URPASS turns any standard iOS or Android smartphone into an enterprise-grade optical scanner using its built-in camera, eliminating thousands of rupees in hardware rental fees.",
  },
];

export default function EventCheckInCalculatorPage() {
  const canonical = "https://urpass.space/event-check-in-calculator";

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
    name: "URPASS Event Check-In Speed & Gate Calculator",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Event Gate Calculator",
    operatingSystem: "Web, iOS, Android",
    url: canonical,
    publisher: {
      "@type": "Organization",
      name: "URPASS",
      url: "https://urpass.space",
    },
    description:
      "Interactive queue science and gate capacity calculator for event organizers to estimate scanner throughput, entrance gates, and staffing requirements.",
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
        name: "Event Check-In Speed & Gate Calculator",
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
            <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-800 text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6 border border-cyan-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 inline-block" />
              VENUE ENTRANCE &amp; QUEUE SCIENCE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] mb-6">
              Event Check-In Speed &amp; Gate Calculator
            </h1>

            <p className="text-lg sm:text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-10">
              Model gate capacity, queue clearance times, and volunteer staffing requirements. Prevent venue lobby bottlenecks before event day.
            </p>

            <div className="inline-flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-neutral-600 bg-white border border-neutral-200/80 px-4 py-2.5 rounded-2xl shadow-2xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;0.3s Optical Browser Scan
              </span>
              <span className="text-neutral-300">•</span>
              <span>Zero App Downloads</span>
              <span className="text-neutral-300">•</span>
              <span>Atomic Anti-Duplicate Locks</span>
              <span className="text-neutral-300">•</span>
              <span>Multi-Gate Live Sync</span>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Section */}
        <section className="pb-24 px-5 sm:px-8">
          <EventCheckInCalculator />
        </section>

        {/* Deep Dive Queue Science */}
        <section className="py-20 px-5 sm:px-8 bg-neutral-50/70 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Arrival Science</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1">
                How to Eliminate Entrance Queues at Large Events
              </h2>
              <p className="text-sm text-neutral-500 mt-2">
                Why scan speed per attendee is the single biggest factor in venue safety and guest satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-4 font-bold">
                  <ScanLine className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Sub-0.3s In-Browser Scanning</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Every 1-second delay in validation adds 16 minutes to queue clearance for 1,000 attendees. URPASS utilizes low-latency web streams to validate codes in under 300 milliseconds.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Zero App Installation</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Volunteers open a simple link in Chrome or Safari. No App Store accounts, no logins, and zero volunteer training required before the doors open.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-4 font-bold">
                  <DoorOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Synchronized Gates</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Whether operating 2 gates or 20 gates across separate arena entrances, duplicate passes are blocked instantly with haptic vibration alerts.
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
                Frequently Asked Questions About Gate Check-In &amp; Scanning
              </h2>
            </div>
            <FAQItemSection faqs={FAQS} />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-5 sm:px-8 bg-neutral-900 text-white">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to streamline your event entry?
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Equip your door volunteers with fast, browser-based QR scanners in seconds. Free for up to 100 attendees per month.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-7 py-3.5 rounded-xl text-sm font-bold hover:bg-neutral-100 transition-colors"
              >
                <span>Try scanner for free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Book Enterprise Demo
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
