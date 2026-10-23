"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Ticket, QrCode, BarChart3, Check } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";

const steps = [
  {
    phase: "Registration",
    title: "Create & Register",
    desc: "Build custom registration forms, manage approvals, and issue digital passes automatically.",
    icon: ClipboardList,
    highlights: [
      "Custom form fields & branding",
      "Automated digital pass issue",
      "Instant approval workflows",
    ],
  },
  {
    phase: "Ticketing",
    title: "Sell Tickets",
    desc: "Create ticket categories, collect online payments, and manage bookings in one place.",
    icon: Ticket,
    highlights: [
      "Tiered pricing & discount codes",
      "Direct UPI & card checkouts",
      "Zero platform commission",
    ],
  },
  {
    phase: "QR Entry",
    title: "Scan & Check In",
    desc: "Scan QR passes using smartphones, prevent duplicate entries, and manage multiple gates.",
    icon: QrCode,
    highlights: [
      "0.3s camera scan check-in",
      "Anti-passback duplicate block",
      "Multi-gate real-time sync",
    ],
  },
  {
    phase: "Analytics",
    title: "Track & Analyze",
    desc: "Monitor attendance in real time, track sessions, and export event reports.",
    icon: BarChart3,
    highlights: [
      "Live arrival curve monitoring",
      "Session attendance logs",
      "Instant audit-ready CSV exports",
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-28 px-4 sm:px-8 bg-white border-t border-neutral-100 relative">
      <div id="how-it-works" className="absolute -top-16 left-0 pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-50 text-violet-700 border border-violet-200/80 mb-3.5">
              ALL-IN-ONE EVENT PLATFORM
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 mb-3.5">
              Everything you need. One seamless event journey.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              From the first registration to the final check-in, UrPass keeps everything connected.
            </p>

            {/* Clean 4-Phase Flow Strip (No numbering) */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-neutral-50 border border-neutral-200/80 rounded-full">
              {steps.map((s, idx) => (
                <div key={s.phase} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-neutral-700 bg-white border border-neutral-200/60 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                    <span>{s.phase}</span>
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="text-neutral-400 text-xs font-bold select-none">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>

        {/* ── Redesigned 4 Cards (No icon numbers, unified container) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <AnimateIn key={item.phase} delay={i * 80} from="up">
                <div className="relative bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs hover:border-violet-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden group">
                  {/* Subtle top hover accent bar */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Top row: Icon container + Phase tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 border border-violet-100/90 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-violet-700 bg-violet-50/80 border border-violet-100 px-2.5 py-0.5 rounded-full">
                        {item.phase}
                      </span>
                    </div>

                    {/* Card Title & Description */}
                    <h3 className="text-lg font-bold text-neutral-950 mb-2 tracking-tight group-hover:text-violet-950 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <div className="pt-4 border-t border-neutral-100 space-y-2 mt-auto">
                    {item.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2 text-xs text-neutral-600">
                        <div className="w-4 h-4 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-violet-600" />
                        </div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>

        {/* ── Single Direct CTA ── */}
        <AnimateIn delay={120} from="scale">
          <div className="mt-12 sm:mt-16 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all group"
            >
              <span>Start Your First Event</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <p className="mt-3 text-xs text-neutral-400">
              Free setup · Plans from ₹499/mo · Zero commission fees
            </p>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
