import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  Building,
  Target,
  Lightbulb,
  Cpu,
  Globe,
  MapPin,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The Company Behind URPASS | Built by Yesp Corporation",
  description:
    "Learn about Yesp Corporation, the technology company behind URPASS. Discover our mission to simplify event registration, digital passes, and QR entrance check-in globally.",
  keywords: [
    "URPASS company",
    "URPASS founder",
    "who owns URPASS",
    "URPASS Yesp Corporation",
    "Yesp Corporation",
    "event technology company",
  ],
  alternates: { canonical: "https://urpass.space/company" },
  openGraph: {
    title: "The Company Behind URPASS | Built by Yesp Corporation",
    description:
      "Learn about Yesp Corporation, the technology company behind URPASS. Discover our mission to simplify event registration, digital passes, and QR entrance check-in globally.",
    url: "https://urpass.space/company",
    type: "website",
  },
};

export default function CompanyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://urpass.space/#yesp",
        "name": "Yesp Corporation",
        "url": "https://yespstudio.com",
        "description": "Technology company building modern digital products and business infrastructure.",
        "foundingLocation": "India",
        "knowsAbout": [
          "Event Ticketing Software",
          "QR Code Verification Systems",
          "SaaS Infrastructure",
          "Fintech & Payment Integration"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://urpass.space/#urpass",
        "name": "URPASS",
        "alternateName": ["URPASS by Yesp Corporation", "Yesp URPASS"],
        "url": "https://urpass.space",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, iOS, Android",
        "publisher": {
          "@id": "https://urpass.space/#yesp"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div>
        <Navbar />

        {/* Hero Section */}
        <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              COMPANY PROFILE &amp; LEADERSHIP
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              The Company Behind URPASS
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-8 font-medium">
              URPASS is developed and operated by <strong>Yesp Corporation</strong> — building simple, reliable digital products for organizers, colleges, and enterprises worldwide.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
              <a
                href="https://yespstudio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-semibold hover:border-neutral-300 transition-colors shadow-2xs"
              >
                <Building className="w-3.5 h-3.5 text-brand" />
                Yesp Corporation Official Site ↗
              </a>
              <Link
                href="/yesp-urpass"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                Yesp URPASS Overview →
              </Link>
            </div>
          </div>
        </section>

        {/* Narrative & Mission */}
        <section className="py-20 sm:py-28 px-5 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto space-y-20">

            {/* Why we built URPASS */}
            <AnimateIn>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand block mb-2">Our Genesis</span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                    Why We Built URPASS
                  </h2>
                </div>
                <div className="md:col-span-8 space-y-4 text-neutral-600 leading-relaxed text-sm sm:text-base">
                  <p>
                    Every year, thousands of colleges, tech communities, and corporate coordinators host vital conferences, cultural fests, and hackathons. Yet, the technology organizing these gatherings remained deeply fragmented.
                  </p>
                  <p>
                    Organizers spent grueling hours stitching together Google Forms, running clunky spreadsheets, paying exorbitant 7%–10% per-ticket commission fees, and dealing with paper rosters or rented laser barcode scanners at the entrance.
                  </p>
                  <p>
                    Yesp Corporation built URPASS to eliminate this operational friction. We envisioned a fast, unified web platform where an organizer can set up registration in minutes, collect payments directly, issue tamper-proof digital passes, and scan attendees in 0.3 seconds from standard smartphone browsers.
                  </p>
                </div>
              </div>
            </AnimateIn>

            {/* What URPASS Solves */}
            <AnimateIn>
              <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200 bg-neutral-50/60">
                <span className="text-xs font-bold uppercase tracking-widest text-brand block mb-2">Core Solutions</span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mb-6">
                  What URPASS Solves
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Zero Platform Commissions", desc: "Keep 100% of event revenue without punitive per-ticket charges." },
                    { title: "No App Downloads for Attendees", desc: "Passes open instantly in mobile browsers and Apple/Google Wallet." },
                    { title: "Sub-Second Entrance Verification", desc: "Turn any mobile browser into an instant QR credential scanner." },
                    { title: "Anti-Fraud Pass Protection", desc: "Cryptographic single-use tokens prevent duplicate entry and pass sharing." },
                    { title: "Multi-Counter Live Synchronization", desc: "Gates sync in real-time with sub-millisecond cloud replication." },
                    { title: "Direct Payment Settlement", desc: "Integrated with native rails like UPI & Razorpay directly to creator accounts." },
                  ].map((sol) => (
                    <div key={sol.title} className="p-4 rounded-xl bg-white border border-neutral-200/80">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="text-sm font-bold text-neutral-900">{sol.title}</h4>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed pl-6">{sol.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            {/* Geographic Operations */}
            <AnimateIn>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand block mb-2">Global Presence</span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-6">
                  Where URPASS Operates
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
                  URPASS is architected with multi-region cloud infrastructure, delivering low latency and native compliance across three core geographic operational units:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* India */}
                  <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="text-2xl mb-3">🇮🇳</div>
                    <h4 className="text-base font-bold text-neutral-900 mb-1">URPASS India</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                      Event technology by Yesp Corporation tailored for Indian engineering colleges, university cultural fests, Bangalore tech summits, and pan-India hackathons. Powered by INR pricing, native UPI, and Razorpay.
                    </p>
                    <Link href="/in" className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1">
                      Explore URPASS India Hub →
                    </Link>
                  </div>

                  {/* UK */}
                  <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="text-2xl mb-3">🇬🇧</div>
                    <h4 className="text-base font-bold text-neutral-900 mb-1">URPASS UK</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                      Event registration &amp; QR check-in by Yesp designed for UK university student unions, London summits, Manchester festivals, and Edinburgh academic conferences with GBP (£) pricing and UK GDPR compliance.
                    </p>
                    <Link href="/uk" className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1">
                      Explore URPASS UK Hub →
                    </Link>
                  </div>

                  {/* Global */}
                  <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="text-2xl mb-3">🌐</div>
                    <h4 className="text-base font-bold text-neutral-900 mb-1">URPASS Global</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                      International event ticketing and credential scanning for distributed organizations, global developer hackathons, and international exhibitions across 150+ countries.
                    </p>
                    <Link href="/global" className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1">
                      Explore URPASS Global →
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateIn>

            {/* Contact Yesp / URPASS */}
            <AnimateIn>
              <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-300 block mb-2">Corporate Inquiry</span>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Contact Yesp / URPASS</h3>
                  <p className="text-sm text-neutral-400 max-w-md">
                    For partnership inquiries, enterprise agreements, institution-wide licensing, or questions about Yesp Corporation software products.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-6 py-3 rounded-xl text-xs font-semibold hover:bg-neutral-100 transition-colors shrink-0"
                  >
                    Contact Team
                  </Link>
                  <a
                    href="mailto:support@yespstudio.com"
                    className="inline-flex items-center justify-center gap-2 bg-neutral-800 text-white px-6 py-3 rounded-xl text-xs font-semibold border border-neutral-700 hover:bg-neutral-750 transition-colors shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    support@yespstudio.com
                  </a>
                </div>
              </div>
            </AnimateIn>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
