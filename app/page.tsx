import type { Metadata } from "next";
import Link from "next/link";
import { headers, cookies } from "next/headers";
import Navbar from "@/components/landing/Navbar";
import FAQSection from "@/components/landing/FAQSection";
import AnimateIn from "@/components/ui/AnimateIn";
import Footer from "@/components/landing/Footer";
import HomePricingSection from "@/components/landing/HomePricingSection";
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
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS — Official Website | Digital Event Passes & Lightning QR Check-In",
  description:
    "URPASS (pronounced 'Your Pass' / urpass.space) by Yesp Corporation is the all-in-one digital event pass and lightning QR check-in platform. Create events, issue digital passes, accept payments with 0% commission, and scan entry QR codes in under 0.3s.",
  keywords: [
    "URPASS",
    "urpass",
    "urpass.space",
    "URPASS official site",
    "URPASS event passes",
    "URPASS QR check in",
    "URPASS ticketing",
    "URPASS login",
    "digital event pass",
    "QR check-in",
    "college event registration",
    "hackathon check in",
    "Razorpay event ticketing",
  ],
  alternates: { canonical: "https://urpass.space" },
  openGraph: {
    title: "URPASS — Official Website | Digital Event Passes & Lightning QR Check-In",
    description:
      "URPASS (pronounced 'Your Pass' / urpass.space) is the all-in-one digital event pass and lightning QR check-in platform. Create events, issue digital passes, accept payments with 0% commission, and scan entry QR codes in under 0.3s.",
    url: "https://urpass.space",
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
                "description": "Event registration, ticketing and QR check-in platform developed by Yesp Corporation."
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
                  { "@type": "Offer", name: "Free Tier", price: "0", priceCurrency: "GBP", description: "2 events/month, 100 registrations/month" },
                  { "@type": "Offer", name: "Starter Tier", price: "15", priceCurrency: "GBP", description: "10 events/month, 500 registrations/month" },
                  { "@type": "Offer", name: "Pro Tier", price: "35", priceCurrency: "GBP", description: "Unlimited events, 2,500 registrations/month" },
                  { "@type": "Offer", name: "Business Tier", price: "79", priceCurrency: "GBP", description: "Unlimited events, 10,000 registrations/month" },
                  { "@type": "Offer", name: "Founder Lifetime Deal", price: "249", priceCurrency: "GBP", description: "Lifetime access to all URPASS features, zero platform fees" },
                ] : [
                  { "@type": "Offer", name: "Free Tier", price: "0", priceCurrency: "INR", description: "2 events/month, 100 registrations/month" },
                  { "@type": "Offer", name: "Starter Tier", price: "499", priceCurrency: "INR", description: "10 events/month, 500 registrations/month" },
                  { "@type": "Offer", name: "Pro Tier", price: "999", priceCurrency: "INR", description: "Unlimited events, 2,500 registrations/month" },
                  { "@type": "Offer", name: "Business Tier", price: "2499", priceCurrency: "INR", description: "Unlimited events, 10,000 registrations/month" },
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
                    name: "Can I start for free or try a paid plan?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: country === "GB"
                        ? "Yes. The permanent free tier lets you host 2 events/month with up to 100 registrations/month at £0 forever with no credit card required. You can also try any paid plan (Starter, Pro, or Business) free for 30 days."
                        : "Yes. The permanent free tier lets you host 2 events/month with up to 100 registrations/month at ₹0 forever with no credit card required. You can also try any paid plan (Starter, Pro, or Business) free for 30 days.",
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
            <Link
              href="/mcp-event-management"
              className="hero-badge group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-neutral-200/90 bg-neutral-50/70 hover:bg-neutral-100/80 hover:border-neutral-300 transition-all mb-6 sm:mb-8 text-xs max-w-full"
            >
              <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 bg-white border border-neutral-200 px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase shrink-0 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Digital Pass OS
              </span>
              <span className="text-neutral-600 font-medium truncate">
                MCP Supported for Claude &amp; Cursor
              </span>
              <span className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-transform text-xs shrink-0 font-medium">
                &rarr;
              </span>
            </Link>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-4 sm:mb-6">
              <span className="sr-only">URPASS — Digital Event Passes &amp; QR Check-in: </span>
              <span className="hero-line-1 block">Create.</span>
              <span className="hero-line-2 block">Share.</span>
              <span className="hero-line-3 block text-brand">Scan.</span>
            </h1>

            <p className="hero-sub text-base sm:text-xl text-neutral-500 leading-relaxed max-w-md mb-8 sm:mb-10">
              <strong className="font-semibold text-neutral-900">URPASS</strong> turns event registrations into digital passes with sub-second QR check-in. Create your event, share the link, issue passes, and scan attendees at the entrance.
            </p>

            <div className="hero-ctas flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors text-center shadow-xs">
                Create Your Event
                <span className="text-neutral-400">→</span>
              </Link>
              <Link href="/contact?subject=Book%20a%20Demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-300 bg-white px-5 py-3.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors text-center shadow-2xs">
                Book a Demo
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors text-center">
                See how it works ↓
              </a>
            </div>

            <p className="hero-meta mt-6 sm:mt-8 text-xs text-neutral-400">
              Free to start · Try any paid plan free for 30 days ·{" "}
              <Link href="/mcp-event-management" className="text-neutral-600 hover:text-brand hover:underline font-medium">
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

      {/* ── MCP ONE-LINE STRIP ─────────────────────────────────────────── */}
      <div className="border-y border-neutral-200/70 bg-neutral-50/80 py-2.5 px-4 text-center">
        <p className="text-xs sm:text-sm text-neutral-600">
          <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-900 bg-neutral-200/70 border border-neutral-300/80 px-2 py-0.5 rounded-md text-[11px] mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Model Context Protocol
          </span>
          Native Model Context Protocol support — control tickets, registrations and check-ins directly inside Claude Desktop &amp; Cursor.{" "}
          <Link href="/mcp-event-management" className="font-semibold text-neutral-900 hover:underline ml-1 inline-flex items-center gap-0.5">
            Explore MCP &rarr;
          </Link>
        </p>
      </div>

      {/* ── 02 PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 px-4 sm:px-8 bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white text-center mb-8 sm:mb-14">
              Stop managing event entry manually.
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-10 sm:mb-16">
            {[
              { Icon: FileText, title: "Manual lists",       desc: "Names scattered across spreadsheets, forms, and WhatsApp threads." },
              { Icon: Clock,    title: "Long queues",        desc: "Attendees wait at the entrance while names are checked one by one." },
              { Icon: EyeOff,   title: "No live visibility", desc: "You don't know who has actually arrived until the event is over." },
            ].map(({ Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 110} from="up">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 h-full">
                  <Icon className="w-5 h-5 text-white/40 mb-3" />
                  <h3 className="font-semibold text-white mb-1.5 sm:mb-2 text-base sm:text-lg">{title}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={200}>
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-semibold text-white">
                URPASS fixes the last step.
              </p>
              <p className="mt-2 sm:mt-3 text-white/50 text-xs sm:text-sm">
                From registration to check-in — in one tool.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── 03 HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-14 sm:py-28 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-10 sm:mb-16">
              <p className="text-xs font-semibold tracking-widest text-brand mb-2 sm:mb-3">HOW IT WORKS</p>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">One simple workflow</h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
            {[
              { n: "01", title: "Create", desc: "Create your event and application form." },
              { n: "02", title: "Share",  desc: "Share the application link with your audience." },
              { n: "03", title: "Pass",   desc: "Approve attendees. Passes are generated instantly." },
              { n: "04", title: "Scan",   desc: "Scan the QR code at the entrance." },
              { n: "05", title: "Track",  desc: "Dashboard updates in real time." },
            ].map((step, i) => (
              <AnimateIn key={step.n} delay={i * 80} from="up">
                <div className="relative h-full">
                  {i < 4 && (
                    <div className="hidden sm:block absolute top-5 left-full w-full h-px bg-neutral-100 z-0" />
                  )}
                  <div className="relative bg-white border border-neutral-100 rounded-2xl p-4 sm:p-5 hover:border-brand-200 hover:shadow-sm transition-all h-full">
                    <span className="text-xs font-mono text-neutral-300 mb-2 sm:mb-3 block">{step.n}</span>
                    <h3 className="font-semibold text-sm sm:text-base text-neutral-900 mb-1 sm:mb-1.5">{step.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 PRODUCT SHOWCASE ──────────────────────────────────────────── */}
      <section className="py-14 sm:py-28 px-4 sm:px-8 bg-neutral-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <AnimateIn from="left">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand mb-3 sm:mb-4">ORGANIZER DASHBOARD</p>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight mb-4 sm:mb-6">
                Your event. Your passes.
              </h2>
              <p className="text-neutral-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Manage everything you need from one simple dashboard. No complicated tools.
              </p>
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {[
                  "See applications as they come in",
                  "Approve or reject attendees",
                  "Generate passes with one click",
                  "Track check-ins in real time",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-600">
                    <span className="w-5 h-5 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
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

      {/* ── 05 SCANNER SECTION ───────────────────────────────────────────── */}
      <section className="py-14 sm:py-28 px-4 sm:px-8 bg-neutral-900 overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <AnimateIn from="left">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand-200 mb-3 sm:mb-4">QR CHECK-IN</p>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white mb-4 sm:mb-6">
                Entry takes one scan.
              </h2>
              <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6">
                Open the scanner on any phone or tablet, point at the pass, and URPASS instantly validates the QR code and records the check-in.
              </p>
              <ul className="flex flex-col gap-2 sm:gap-2.5">
                {[
                  "Duplicate check-ins are blocked",
                  "Invalid passes are flagged immediately",
                  "Expired passes are caught",
                  "No app required for attendees",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs sm:text-sm text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand block shrink-0" />
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

      {/* ── 06 EVENT TYPES ───────────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <AnimateIn>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight mb-3 sm:mb-4">
              From workshops to college fests.
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base mb-8 sm:mb-12 max-w-md mx-auto">
              If you&apos;re organizing an event, URPASS keeps entry simple.
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

      {/* ── 07 PRICING ───────────────────────────────────────────────────── */}
      <HomePricingSection initialCountry={country} />

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
      <section className="py-16 sm:py-28 px-4 sm:px-8 bg-neutral-900 text-center">
        <AnimateIn>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4 sm:mb-5 leading-tight">
              Your next event deserves a simpler entry.
            </h2>
            <p className="text-white/50 text-sm sm:text-base mb-3">
              Create your event. Share the link. Scan the passes.
            </p>
          </div>
        </AnimateIn>
        <AnimateIn delay={120} from="scale">
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-8 py-3.5 sm:py-4 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors shadow-xs">
              Create Your Event <span>→</span>
            </Link>
            <Link href="/contact?subject=Book%20a%20Demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-700 bg-neutral-800 text-white px-8 py-3.5 sm:py-4 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors">
              Book a Demo
            </Link>
          </div>
          <p className="mt-4 sm:mt-5 text-xs text-white/30">Start free · No credit card required</p>
        </AnimateIn>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
