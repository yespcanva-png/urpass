import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  ScanLine,
  Ticket,
  CreditCard,
  Users2,
  BarChart3,
  Bot,
  Palette,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe2,
  Lock,
  Smartphone,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS Features — Everything for Digital Passes & Lightning QR Entry",
  description:
    "Explore the full feature suite of URPASS: sub-second QR code entry validation, custom ticket designer, zero commission payments, multi-gate sync, offline check-in, and AI event management with MCP.",
  keywords: [
    "URPASS features",
    "URPASS platform capabilities",
    "QR event scanner features",
    "digital pass designer",
    "zero commission event ticketing",
    "multi-gate event check-in",
    "offline QR check in",
    "URPASS MCP",
    "event registration features",
  ],
  alternates: { canonical: "https://urpass.space/features" },
  openGraph: {
    title: "URPASS Features — Complete Event Operating System",
    description:
      "Explore all URPASS features: sub-second QR check-in, pass designer, zero commission payments, and real-time attendance analytics.",
    url: "https://urpass.space/features",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://urpass.space/og-image.png",
        width: 1200,
        height: 630,
        alt: "URPASS Features Suite",
      },
    ],
  },
};

const featureList = [
  {
    icon: ScanLine,
    title: "Sub-Second QR Entry Scanner (<0.3s)",
    description:
      "Turn any smartphone, tablet, or laptop into a high-speed laser scanner. Validate tickets with atomic anti-duplicate locks in under 300 milliseconds without requiring app downloads.",
    href: "/qr-event-check-in",
    highlight: "Under 0.3s Scan Time",
  },
  {
    icon: Ticket,
    title: "Bespoke Digital Pass Maker",
    description:
      "Generate elegant, encrypted digital event passes with unique QR codes, custom attendee metadata, seating tiers, and dynamic event details accessible right from mobile browsers.",
    href: "/digital-event-pass",
    highlight: "No App Required",
  },
  {
    icon: CreditCard,
    title: "0% Commission Instant Ticketing",
    description:
      "Collect ticket payments directly into your Razorpay account via UPI, credit cards, debit cards, and net banking with zero platform commissions taking a bite out of your revenue.",
    href: "/zero-commission-event-ticketing",
    highlight: "0% Per-Ticket Fee",
  },
  {
    icon: Palette,
    title: "Ticket Studio & Custom Badge Designer",
    description:
      "Customize badge orientations, brand colors, sponsor logos, attendee badges, and printable lanyard formats with a pixel-perfect visual editor.",
    href: "/ticket-templates",
    highlight: "Drag & Drop Studio",
  },
  {
    icon: Users2,
    title: "Automated Approval & Guestlist Management",
    description:
      "Screen applicants, review custom registration responses, trigger auto-admissions, enforce capacity caps, and maintain clean guestlists effortlessly.",
    href: "/event-guest-list-software",
    highlight: "Auto-Admit Workflows",
  },
  {
    icon: BarChart3,
    title: "Real-Time Attendance Analytics",
    description:
      "Monitor incoming attendee velocity, peak gate arrival hours, capacity percentages, and check-in logs in real-time across your organizer dashboard.",
    href: "/event-analytics",
    highlight: "Live Gate Metrics",
  },
  {
    icon: Bot,
    title: "Model Context Protocol (MCP) AI Support",
    description:
      "The world's first event ticketing platform with a native Model Context Protocol server. Manage events, query attendees, and verify check-ins directly via Claude Desktop or Cursor.",
    href: "/mcp-event-management",
    highlight: "AI-Native Event OS",
  },
  {
    icon: Layers,
    title: "Multi-Gate & Scanner Staff Sync",
    description:
      "Deploy multiple entrance volunteers across North, South, and VIP gates. Live cloud synchronization ensures a ticket scanned at Gate 1 cannot enter Gate 2.",
    href: "/multi-gate-qr-scanner",
    highlight: "Multi-Entrance Sync",
  },
  {
    icon: ShieldCheck,
    title: "Offline Gate Failover & Local Sync",
    description:
      "Never worry about poor campus Wi-Fi or crowded venue reception. Scanners securely cache attendee manifests locally and sync automatically when signal recovers.",
    href: "/how-qr-ticket-validation-works",
    highlight: "100% Offline Capable",
  },
  {
    icon: FileSpreadsheet,
    title: "Instant CSV Import & One-Click Export",
    description:
      "Migrate existing attendee lists from Google Forms, Eventbrite, or Luma via CSV import, and export verified check-in data with full timestamps in seconds.",
    href: "/import",
    highlight: "Google Forms Migration",
  },
];

export default function FeaturesPage() {
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
        name: "Features",
        item: "https://urpass.space/features",
      },
    ],
  };

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
              PRODUCT CAPABILITIES &amp; ARCHITECTURE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.12]">
              URPASS Features
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Built to eradicate long queues, clunky spreadsheets, and ticketing commissions. Here is everything URPASS does for modern organizers.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                Start Free with URPASS
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-5 py-3.5 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
              >
                View Plans &amp; Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-5 sm:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureList.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <AnimateIn key={feat.title} delay={idx * 40} from="up">
                    <div className="p-7 rounded-2xl border border-neutral-200/90 bg-neutral-50/40 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between h-full group">
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-900 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors shadow-2xs">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                            {feat.highlight}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-neutral-900 mb-2.5 tracking-tight group-hover:text-emerald-700 transition-colors">
                          {feat.title}
                        </h2>

                        <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                          {feat.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-200/60 flex items-center justify-between">
                        <Link
                          href={feat.href}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-emerald-600 transition-colors"
                        >
                          Learn more details
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison Callout */}
        <section className="py-20 px-5 sm:px-8 bg-neutral-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 block mb-3">
              Why Organizers Choose URPASS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Stop paying 5% to 15% ticket commissions.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Legacy ticketing platforms siphon away thousands in ticket fees and force attendees to download apps. URPASS gives you zero-commission direct payouts and instant browser check-in.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 bg-white text-neutral-900 px-6 py-3 rounded-xl text-xs font-semibold hover:bg-neutral-100 transition-colors"
              >
                Compare URPASS vs Eventbrite &amp; Townscript
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
