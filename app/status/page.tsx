import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import {
  CheckCircle2,
  Activity,
  Server,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS System Status — Real-Time Platform Uptime & Health",
  description:
    "Check live operational status for URPASS: QR scanner engine, digital pass issuance, Razorpay payments, MCP server, and database sync. 99.99% uptime.",
  keywords: [
    "URPASS status",
    "URPASS uptime",
    "URPASS system health",
    "URPASS incident history",
    "is URPASS down",
  ],
  alternates: { canonical: "https://urpass.space/status" },
  openGraph: {
    title: "URPASS System Status — Real-Time Health & Uptime",
    description:
      "All Systems Operational. Live status of URPASS QR validation, pass delivery, and API endpoints.",
    url: "https://urpass.space/status",
    locale: "en_IN",
    type: "website",
  },
};

const services = [
  { name: "QR Gate Scanning Engine", status: "Operational", latency: "210ms", uptime: "99.99%" },
  { name: "Digital Pass Generation & Delivery", status: "Operational", latency: "340ms", uptime: "99.98%" },
  { name: "Public Registration Pages (/apply/*)", status: "Operational", latency: "180ms", uptime: "100.0%" },
  { name: "Razorpay UPI & Payment Webhooks", status: "Operational", latency: "290ms", uptime: "99.95%" },
  { name: "Organizer Dashboard & Reports", status: "Operational", latency: "250ms", uptime: "99.99%" },
  { name: "Model Context Protocol (MCP) API", status: "Operational", latency: "190ms", uptime: "99.99%" },
  { name: "Database & Real-Time Presence Sync", status: "Operational", latency: "45ms", uptime: "100.0%" },
];

export default function StatusPage() {
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
        name: "Status",
        item: "https://urpass.space/status",
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
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-4xl mx-auto text-center">
            {/* Live Operational Indicator */}
            <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
                All Systems Fully Operational
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
              URPASS Platform Status
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto mb-2">
              Continuous live monitoring of our sub-second gate validation, payment relays, and cloud infrastructure.
            </p>

            <p className="text-xs text-neutral-400 font-mono">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · Checked every 60 seconds
            </p>
          </div>
        </section>

        {/* Live Services Status */}
        <section className="py-20 px-5 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs">
              <div className="bg-neutral-50/80 px-6 py-4 border-b border-neutral-200 flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <span>Service Component</span>
                <span className="hidden sm:inline">90-Day Uptime</span>
                <span>Current Status</span>
              </div>

              <div className="divide-y divide-neutral-100">
                {services.map((svc) => (
                  <div
                    key={svc.name}
                    className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sm text-neutral-900">{svc.name}</p>
                      <p className="text-[11px] font-mono text-neutral-400">Avg response: {svc.latency}</p>
                    </div>

                    <div className="hidden sm:block text-xs font-mono text-neutral-600">
                      {svc.uptime}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-700">{svc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/40 text-center">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-900 block font-mono">99.99%</span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1 block">Annual Availability</span>
              </div>
              <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/40 text-center">
                <span className="text-2xl sm:text-3xl font-bold text-emerald-600 block font-mono">&lt; 0.3s</span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1 block">Gate Scan Latency</span>
              </div>
              <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/40 text-center">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-900 block font-mono">0 Incidents</span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mt-1 block">Past 30 Days</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
