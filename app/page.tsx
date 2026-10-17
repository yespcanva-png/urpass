import type { Metadata } from "next";
import Link from "next/link";
import { headers, cookies } from "next/headers";
import Navbar from "@/components/landing/Navbar";
import FAQSection from "@/components/landing/FAQSection";
import AnimateIn from "@/components/ui/AnimateIn";
import Footer from "@/components/landing/Footer";
import HomePricingSection from "@/components/landing/HomePricingSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import { RequestEventSetupButton } from "@/components/landing/RequestEventSetupModal";
import { detectCountryFromHeaders } from "@/lib/country-config";
import {
  FileText,
  Clock,
  EyeOff,
  GraduationCap,
  Monitor,
  Trophy,
  Megaphone,
  Users2,
  Mic,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "UrPass — Event Management Platform | Your event. Your way.",
  description:
    "Manage registrations, digital QR passes, ticketing, and attendee check-ins with UrPass. High-speed check-ins, custom passes, and zero platform commission.",
  keywords: [
    "URPASS",
    "event management platform",
    "event registration software",
    "QR check-in software",
    "event ticketing platform",
    "digital event pass",
    "college event registration",
    "hackathon check in",
    "Razorpay event ticketing",
    "conference session check in",
  ],
  alternates: { canonical: "https://urpass.space" },
  openGraph: {
    title: "UrPass — Event Management Platform | Your event. Your way.",
    description:
      "Manage registrations, digital QR passes, ticketing, and attendee check-ins with UrPass. Choose the software or let our team help you set up.",
    url: "https://urpass.space",
    type: "website",
  },
};

// ─── Decorative QR SVG ────────────────────────────────────────────────────────
function QRPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x={0}  y={0}  width={7} height={7} /><rect x={1}  y={1}  width={5} height={5} fill="white" /><rect x={2}  y={2}  width={3} height={3} />
      <rect x={14} y={0}  width={7} height={7} /><rect x={15} y={1}  width={5} height={5} fill="white" /><rect x={16} y={2}  width={3} height={3} />
      <rect x={0}  y={14} width={7} height={7} /><rect x={1}  y={15} width={5} height={5} fill="white" /><rect x={2}  y={16} width={3} height={3} />
      <rect x={8}  y={6}  width={1} height={1} /><rect x={10} y={6}  width={1} height={1} /><rect x={12} y={6}  width={1} height={1} />
      <rect x={6}  y={8}  width={1} height={1} /><rect x={6}  y={10} width={1} height={1} /><rect x={6}  y={12} width={1} height={1} />
      <rect x={8}  y={8}  width={2} height={2} /><rect x={11} y={8}  width={1} height={1} /><rect x={13} y={8}  width={2} height={1} /><rect x={16} y={8}  width={2} height={2} /><rect x={19} y={8}  width={2} height={1} />
      <rect x={8}  y={11} width={1} height={2} /><rect x={10} y={11} width={3} height={1} /><rect x={14} y={11} width={1} height={1} /><rect x={16} y={11} width={2} height={1} /><rect x={19} y={11} width={2} height={2} />
      <rect x={8}  y={13} width={3} height={1} /><rect x={12} y={13} width={2} height={1} /><rect x={15} y={13} width={1} height={1} />
      <rect x={8}  y={7}  width={1} height={1} /><rect x={10} y={7}  width={2} height={1} /><rect x={13} y={7}  width={1} height={1} />
      <rect x={7}  y={14} width={1} height={1} /><rect x={9}  y={14} width={2} height={2} /><rect x={12} y={14} width={1} height={1} /><rect x={14} y={14} width={3} height={1} /><rect x={18} y={14} width={1} height={1} /><rect x={20} y={14} width={1} height={1} />
      <rect x={7}  y={16} width={2} height={1} /><rect x={10} y={16} width={1} height={1} /><rect x={12} y={16} width={3} height={2} /><rect x={16} y={16} width={1} height={1} /><rect x={18} y={16} width={3} height={1} />
      <rect x={7}  y={18} width={3} height={1} /><rect x={11} y={18} width={2} height={1} /><rect x={14} y={18} width={1} height={2} /><rect x={16} y={18} width={2} height={1} /><rect x={19} y={18} width={2} height={1} />
      <rect x={7}  y={20} width={1} height={1} /><rect x={9}  y={20} width={2} height={1} /><rect x={12} y={20} width={1} height={1} /><rect x={15} y={20} width={1} height={1} /><rect x={17} y={20} width={4} height={1} />
    </svg>
  );
}

// ─── Digital pass card ────────────────────────────────────────────────────────
function PassCard() {
  return (
    <div className="relative w-64 sm:w-72 max-w-full mx-auto select-none">
      <div className="relative bg-white rounded-2xl border border-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="bg-neutral-900 px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <span className="text-xs font-bold tracking-widest text-white/80">URPASS</span>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">VALID PASS</span>
        </div>
        <div className="px-5 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6">
          <p className="text-[10px] font-semibold tracking-widest text-neutral-400 mb-1">EVENT</p>
          <h3 className="font-semibold text-base sm:text-lg leading-snug text-neutral-900 mb-4 sm:mb-5">Tech Workshop 2026</h3>
          <div className="flex items-center gap-0 mb-4 sm:mb-5">
            <div className="w-4 sm:w-5 h-4 sm:w-5 rounded-full bg-neutral-100 -ml-7 sm:-ml-9 shrink-0 border-r border-neutral-200" />
            <div className="flex-1 border-t border-dashed border-neutral-200 mx-1" />
            <div className="w-4 sm:w-5 h-4 sm:w-5 rounded-full bg-neutral-100 -mr-7 sm:-mr-9 shrink-0 border-l border-neutral-200" />
          </div>
          <p className="text-[10px] font-semibold tracking-widest text-neutral-400 mb-1">ATTENDEE</p>
          <p className="font-semibold text-sm sm:text-base text-neutral-900">Srinithin S</p>
          <span className="inline-block mt-1.5 text-[10px] font-semibold tracking-wider text-neutral-700 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-md">
            PARTICIPANT
          </span>
          <div className="mt-4 sm:mt-5 flex flex-col items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 p-2.5 sm:p-3 bg-white border border-neutral-200/80 rounded-xl shadow-xs">
              <QRPattern className="w-full h-full text-neutral-900" />
            </div>
            <p className="mt-2 text-[10px] text-neutral-400 tracking-widest font-mono">SCAN TO VERIFY</p>
          </div>
          <div className="mt-4 sm:mt-5 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-400 font-medium">
            <span>29 AUG 2026</span>
            <span>CHENNAI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard mockup ─────────────────────────────────────────────────────────
function DashboardMockup() {
  const rows = [
    { name: "Srinithin S", type: "Participant", status: "checked_in" },
    { name: "Rahul K",     type: "Participant", status: "checked_in" },
    { name: "Priya M",     type: "VIP",         status: "pending"    },
    { name: "Arun T",      type: "Participant", status: "checked_in" },
    { name: "Meena R",     type: "Speaker",     status: "pending"    },
  ];
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 shadow-md overflow-hidden w-full max-w-lg">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
        </div>
        <span className="text-[11px] font-mono text-neutral-400">app.urpass.space</span>
        <div className="w-10" />
      </div>
      <div className="p-4 sm:p-5">
        <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 mb-3 sm:mb-4">AI Workshop 2026</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {[{ label: "Applications", value: "250" }, { label: "Passes", value: "180" }, { label: "Checked In", value: "127" }].map((s) => (
            <div key={s.label} className="bg-neutral-50 border border-neutral-100 rounded-lg p-2.5 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">{s.value}</p>
              <p className="text-[9px] sm:text-[10px] text-neutral-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-neutral-100">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2 sm:py-2.5">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-semibold text-neutral-600 shrink-0">
                  {row.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-900">{row.name}</p>
                  <p className="text-[10px] text-neutral-400">{row.type}</p>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ${row.status === "checked_in" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-neutral-100 text-neutral-500 border border-neutral-200"}`}>
                {row.status === "checked_in" ? "Checked in" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scanner result ───────────────────────────────────────────────────────────
function ScanResult() {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-6 sm:px-8 sm:py-8 text-center w-full max-w-[240px] sm:w-60">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-400 flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-[11px] sm:text-xs font-bold tracking-widest text-white/60 mb-1">VALID PASS</p>
      <p className="font-semibold text-white text-base sm:text-lg">Srinithin S</p>
      <p className="text-xs text-white/60 mt-0.5">Participant</p>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/50">Checked in</p>
        <p className="text-sm font-semibold text-white mt-0.5">9:42 AM</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function LandingPage() {
  const [reqHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  const cookieCountry = cookieStore.get("urpass_country")?.value?.toUpperCase();
  const headerCountry = detectCountryFromHeaders(reqHeaders);
  const country: "IN" | "GB" =
    headerCountry === "IN"
      ? "IN"
      : cookieCountry === "GB" || cookieCountry === "UK"
      ? "GB"
      : headerCountry === "GB"
      ? "GB"
      : "IN";

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://urpass.space/#yesp",
                "name": "Yesp Corporation",
                "url": "https://yespstudio.com"
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://urpass.space/#urpass",
                "name": "URPASS",
                "alternateName": [
                  "URPASS by Yesp",
                  "Yesp URPASS"
                ],
                "url": "https://urpass.space",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "publisher": {
                  "@id": "https://urpass.space/#yesp"
                },
                "description": "URPASS by Yesp Corporation is an event registration, ticketing, digital QR pass and event check-in platform for colleges, universities, conferences, hackathons, workshops, corporate events and communities."
              },
              {
                "@type": "WebApplication",
                name: "URPASS",
                applicationCategory: "BusinessApplication",
                applicationSubCategory: "Event Ticketing & Check-In Platform",
                operatingSystem: "Web, iOS, Android",
                url: "https://urpass.space",
                description:
                  country === "GB"
                    ? "Digital event registration, QR pass and check-in platform for universities, conferences, hackathons, workshops and corporate events in the UK."
                    : "An India-focused digital event registration, QR pass and check-in platform for colleges, conferences, hackathons, workshops and corporate events.",
                offers: country === "GB" ? [
                  { "@type": "Offer", name: "Starter Tier", price: "15", priceCurrency: "GBP", description: "10 events/month, 500 registrations/month" },
                  { "@type": "Offer", name: "Pro Tier", price: "35", priceCurrency: "GBP", description: "Unlimited events, 2,500 registrations/month" },
                  { "@type": "Offer", name: "Business Tier", price: "79", priceCurrency: "GBP", description: "Unlimited events, 10,000 registrations/month" },
                  { "@type": "Offer", name: "Founder Lifetime Deal", price: "249", priceCurrency: "GBP", description: "Lifetime access to all URPASS features, zero platform fees" },
                ] : [
                  { "@type": "Offer", name: "Starter Tier Intro", price: "29", priceCurrency: "INR", description: "Introductory offer for first 2 months. Then ₹499/month +GST. 10 events/month, 500 registrations/month" },
                  { "@type": "Offer", name: "Pro Tier Intro", price: "29", priceCurrency: "INR", description: "Introductory offer for first 2 months. Then ₹999/month +GST. Unlimited events, 2,500 registrations/month" },
                  { "@type": "Offer", name: "Business Tier Intro", price: "29", priceCurrency: "INR", description: "Introductory offer for first 2 months. Then ₹2,499/month +GST. Unlimited events, 10,000 registrations/month" },
                  { "@type": "Offer", name: "Founder Lifetime Deal", price: "19999", priceCurrency: "INR", description: "Lifetime access to all URPASS features, zero platform fees" },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Do attendees need an account?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No. Attendees apply through a public link and receive their pass without creating an account.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Do attendees need an app?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No. Their digital pass works directly in any mobile browser. No app download required.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can I use URPASS for college events?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes — it's designed exactly for this. Workshops, hackathons, seminars, fests, community meetups.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How does check-in work?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Each approved attendee gets a unique QR pass. Staff opens the scanner on any device, scans the QR, and URPASS instantly validates and records the check-in in under 0.3s.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Can one pass be scanned twice?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No. Each pass can only be checked in once. If a second scan is attempted, URPASS shows an 'Already Checked In' result with the original timestamp.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How does URPASS pricing work?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: country === "GB"
                        ? "UK pricing is available as Starter £15/month, Pro £35/month, and Business £79/month, with direct activation and cancel-anytime renewal."
                        : "India pricing starts with an introductory ₹29/month offer for the first 2 months on Starter, Pro, or Business. Regular monthly pricing applies after the introductory period.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />
      <Navbar />

      {/* ── 01 HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-14 sm:pt-40 sm:pb-28 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">

          {/* Left: text — CSS animations (always above fold, no observer) */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-6 sm:mb-8">
              <span className="hero-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-brand/10 text-brand border border-brand/20 shadow-2xs">
                URPASS · EVENT MANAGEMENT PLATFORM
              </span>
              <Link
                href="/mcp-event-management"
                className="hero-badge group inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200/90 bg-neutral-50/70 hover:bg-neutral-100/80 hover:border-neutral-300 transition-all text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-neutral-600 font-medium">MCP Supported</span>
                <span className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-transform text-xs font-medium">&rarr;</span>
              </Link>
            </div>

            <h1 className="hero-line-1 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.08] mb-4 sm:mb-6">
              Your event. Your way.
            </h1>

            <p className="hero-sub text-base sm:text-xl text-neutral-600 leading-relaxed max-w-xl mb-8 sm:mb-10">
              Manage registrations, digital QR passes, ticketing, and attendee check-ins with UrPass. High-speed smartphone check-ins with zero platform commission.
            </p>

            <div className="hero-ctas flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-3">
              <a href="#pricing" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors text-center shadow-xs">
                Explore Plans
                <ArrowRight className="w-4 h-4" />
              </a>
              <RequestEventSetupButton />
              <Link href="/contact?subject=Book%20a%20Demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-200 bg-white px-5 py-3.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-colors text-center shadow-2xs">
                Book a Demo
              </Link>
            </div>

            <p className="hero-meta mt-6 sm:mt-8 text-xs text-neutral-500">
              {country === "GB" ? "Plans from £15/month · Direct UK activation" : "Plans from ₹499/mo (Intro ₹29/mo) · Autopay required"} ·{" "}
              <Link href="/mcp-event-management" className="text-neutral-700 hover:text-brand hover:underline font-medium">
                Model Context Protocol (MCP) supported
              </Link>
            </p>
          </div>

          {/* Right: pass card */}
          <div className="hero-card flex items-center justify-center lg:justify-end py-4 sm:py-8">
            <PassCard />
          </div>
        </div>
      </section>

      {/* ── MCP BANNER CALLOUT ─────────────────────────────────────────── */}
      <div className="py-4 px-4 sm:px-8 bg-neutral-50/60 border-y border-neutral-200/80">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-violet-50/90 via-white to-purple-50/80 border border-violet-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="font-mono font-bold text-xs">MCP</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-bold text-neutral-950 tracking-tight">Model Context Protocol</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Official Standard
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Native Model Context Protocol support — control tickets, registrations, and check-ins directly inside Claude Desktop &amp; Cursor.
              </p>
            </div>
          </div>
          <Link
            href="/mcp-event-management"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-white bg-white hover:bg-violet-600 border border-violet-200 hover:border-violet-600 px-4 py-2 rounded-xl transition-all shadow-2xs shrink-0 group self-stretch sm:self-auto justify-center"
          >
            <span>Explore MCP</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ── 02 FEATURES ─────────────────────────────────────────────────── */}
      <FeaturesSection />

      {/* ── 03B PRODUCT SHOWCASE (DASHBOARD & SCANNER PREVIEWS) ─────────── */}
      <section className="py-14 sm:py-24 px-4 sm:px-8 bg-neutral-50/70 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <AnimateIn from="left">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand mb-3 sm:mb-4">ORGANIZER DASHBOARD</p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-4 sm:mb-6">
                Your event. Your passes.
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Manage everything you need from one simple dashboard. Real-time attendee verification, bulk actions, and multi-tier pass controls.
              </p>
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {[
                  "See applications as they come in",
                  "Approve or reject attendees with one click",
                  "Generate cryptographically verified digital passes",
                  "Track live check-ins across multiple entrances",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-700">
                    <span className="w-5 h-5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>

          <AnimateIn from="right" delay={80}>
            <div className="flex justify-center lg:justify-end">
              <DashboardMockup />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── 03C SCANNER PREVIEW ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 px-4 sm:px-8 bg-neutral-900 overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <AnimateIn from="left">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand-200 mb-3 sm:mb-4">QR CHECK-IN</p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4 sm:mb-6">
                Entry takes one scan.
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6">
                Open the scanner on any phone or tablet browser, point at the pass, and URPASS instantly validates the QR code in under 0.3 seconds.
              </p>
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {[
                  "Duplicate check-ins are blocked immediately with alerts",
                  "Invalid and expired passes are flagged on screen",
                  "Audio and haptic cues for fast throughput",
                  "Zero app installation required for staff or attendees",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs sm:text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 block shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>

          <AnimateIn from="scale" delay={100}>
            <div className="flex justify-center">
              <ScanResult />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── 03D EVENT TYPES ──────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-3 sm:mb-4">
              From workshops to college fests.
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base mb-8 sm:mb-12 max-w-md mx-auto">
              If you&apos;re organizing an event, URPASS keeps entry simple and secure.
            </p>
          </AnimateIn>

          <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">
            {[
              { Icon: GraduationCap, label: "College Events", href: "/college-events" },
              { Icon: Monitor,       label: "Workshops", href: "/workshops" },
              { Icon: Trophy,        label: "Hackathons", href: "/hackathons" },
              { Icon: Megaphone,     label: "Seminars", href: "/seminars" },
              { Icon: Users2,        label: "Community Events", href: "/community-events" },
              { Icon: Mic,           label: "Conferences", href: "/conferences" },
            ].map(({ Icon, label, href }, i) => (
              <AnimateIn key={label} delay={i * 55} from="scale">
                <Link
                  href={href}
                  className="flex items-center gap-2 sm:gap-2.5 border border-neutral-200/80 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 hover:border-neutral-300 hover:bg-neutral-50 shadow-xs transition-all group"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 group-hover:text-neutral-900 transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">{label}</span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 PRICING ─────────────────────────────────────────────────── */}
      <HomePricingSection initialCountry={country} />

      {/* ── 05 CUSTOMER TESTIMONIALS & REAL EVENT EXAMPLES ────────────────── */}
      <TestimonialsSection />

      {/* ── 08 GEO / AI ENTITY ANSWERS ───────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 bg-neutral-50/70 border-y border-neutral-100">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand block mb-2">Entity Specifications &amp; Overview</span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                URPASS by Yesp Corporation — At a Glance
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 mb-2">What is URPASS?</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  URPASS is an event registration, ticketing and QR check-in platform developed by Yesp Corporation. It helps organizers create events, collect registrations, issue digital QR passes, accept payments and verify attendees at event entrances using smartphones.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 mb-2">Who is URPASS for?</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  URPASS is designed for colleges, universities, conferences, hackathons, workshops, corporate events, community events and professional event organizers.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 mb-2">What company owns URPASS?</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  URPASS is a product of Yesp Corporation, a technology company developing digital products and business software. Explore our <Link href="/yesp-urpass" className="text-brand font-medium hover:underline">Yesp URPASS</Link> and <Link href="/company" className="text-brand font-medium hover:underline">Company</Link> profiles.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── 09 FAQ ───────────────────────────────────────────────────────── */}
      <FAQSection initialCountry={country} />

      {/* ── 09 FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-28 px-4 sm:px-8 bg-neutral-950 text-center text-white relative">
        <AnimateIn>
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-brand/10 text-brand-200 border border-brand/20 mb-4">
              URPASS · EVENT MANAGEMENT PLATFORM
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Modernize your event entry today.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Launch registration in minutes, issue digital passes, and check in attendees at your entrance doors in under 0.3 seconds.
            </p>
          </div>
        </AnimateIn>
        <AnimateIn delay={100} from="scale">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-neutral-950 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors shadow-sm"
            >
              <span>Explore Plans</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              href="/contact?subject=Book%20a%20Demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-800 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Book a Demo
            </Link>
          </div>
          <p className="mt-6 text-xs text-neutral-400">
            {country === "GB"
              ? "Plans from £15/mo · Direct UK activation · Cancel renewal anytime"
              : "Plans from ₹499/mo (Intro ₹29/mo) · Autopay required · Cancel renewal anytime"}
          </p>
        </AnimateIn>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
