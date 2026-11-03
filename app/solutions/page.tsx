import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  ClipboardList,
  Globe,
  QrCode,
  ScanLine,
  Ticket,
  BarChart3,
  Sparkles,
  Sliders,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Event Solutions & Registration Workflows | UrPass",
  description:
    "Explore UrPass solutions for event registration, digital QR ticketing, gate check-in, attendance tracking, and custom form builders.",
  alternates: { canonical: "https://urpass.space/solutions" },
  openGraph: {
    title: "Event Solutions & Registration Workflows | UrPass",
    description:
      "Modern solutions for conference producers, college fest committees, corporate planners, and independent workshop leaders.",
    url: "https://urpass.space/solutions",
    locale: "en_IN",
    type: "website",
  },
};

const SOLUTIONS = [
  {
    title: "Event Registration Software",
    href: "/solutions/event-registration-software",
    icon: ClipboardList,
    badge: "Core Software",
    description:
      "Build registration forms, review attendee approvals, enforce capacity limits, and issue instant digital QR passes.",
  },
  {
    title: "Online Event Registration Platform",
    href: "/solutions/online-event-registration",
    icon: Globe,
    badge: "High Conversion",
    description:
      "Frictionless, mobile-optimized online signups with zero mandatory attendee logins and instant confirmation.",
  },
  {
    title: "QR Code Event Ticketing Software",
    href: "/solutions/qr-code-ticketing",
    icon: QrCode,
    badge: "Fraud Proof",
    description:
      "Cryptographic single-use QR passes delivered via WhatsApp and Apple Wallet that lock out duplicate screenshots.",
  },
  {
    title: "Event Check-In Software with QR Scanning",
    href: "/solutions/event-check-in-software",
    icon: ScanLine,
    badge: "Sub-0.3s Entry",
    description:
      "Turn any volunteer smartphone into an enterprise ticket scanner in seconds with zero app store downloads.",
  },
  {
    title: "Online Event Ticket Booking System",
    href: "/solutions/event-ticket-booking-system",
    icon: Ticket,
    badge: "0% Commission",
    description:
      "Sell tickets online with direct Razorpay & Stripe payouts, multi-tier categories, and automated GST receipts.",
  },
  {
    title: "Event Attendance Tracking Software",
    href: "/solutions/event-attendance-tracking",
    icon: BarChart3,
    badge: "Live Analytics",
    description:
      "Track live arrival headcounts, monitor peak check-in curves, record breakout sessions, and export audit-ready CSV logs.",
  },
  {
    title: "Digital Event Pass Generator",
    href: "/solutions/digital-event-pass-generator",
    icon: Sparkles,
    badge: "Pass Studio",
    description:
      "Design branded digital passes with Apple Wallet integration and dynamic attendee attributes with zero paper waste.",
  },
  {
    title: "Event Registration Form Builder",
    href: "/solutions/event-registration-form-builder",
    icon: Sliders,
    badge: "Custom Forms",
    description:
      "Construct custom attendee questionnaires with document uploads, conditional logic, and automatic quota limits.",
  },
  {
    title: "Event Ticket Management Software",
    href: "/solutions/event-ticket-management",
    icon: Layers,
    badge: "Administration",
    description:
      "Centralized ticket inventory, attendee reassignments, 1-click pass resends, and multi-tier quota controls.",
  },
  {
    title: "Event Registration and Check-In Platform",
    href: "/solutions/registration-and-check-in",
    icon: ShieldCheck,
    badge: "All-in-One",
    description:
      "Bridge pre-event registration and entrance gate check-in into a single unified database with zero data discrepancies.",
  },
  {
    title: "Corporate Event Registration Software",
    href: "/solutions/corporate-event-registration-software",
    icon: Building2,
    badge: "Enterprise",
    description:
      "Tailored registration and executive check-in for corporate conferences, town halls, offsites, and partner summits.",
  },
];

export default function SolutionsDirectoryPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-violet-600 selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300 mb-6">
            <Sparkles className="size-3.5" />
            UrPass Event Solutions
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Modern Solutions for Every Event Workflow
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            From custom registration forms and 0% commission ticket sales to sub-second phone camera gate check-in, explore tailored solutions built for modern event organizers.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((sol) => {
            const Icon = sol.icon;
            return (
              <Link
                key={sol.href}
                href={sol.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-violet-500/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center rounded-xl bg-violet-600/20 p-3 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Icon className="size-6" />
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {sol.badge}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                    {sol.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {sol.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-violet-400 group-hover:text-violet-300">
                  <span>Explore solution</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Global CTA Section */}
        <div className="mt-20 rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Streamline Your Event Operations?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            Create your first event in less than three minutes. Free for up to 50 attendees with full access to QR passes, forms, and phone scanning.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Create Your Event Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              View Transparent Pricing
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
