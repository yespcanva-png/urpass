"use client";

import Link from "next/link";
import { CheckCircle2, Star, Quote, Building2, GraduationCap, Laptop, Sparkles, ShieldCheck, Lock, ExternalLink } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";

const testimonials = [
  {
    quote:
      "We checked in over 2,400 students across 3 entrance gates in 90 minutes. Zero app downloads for students, and the duplicate scan prevention caught 18 reused passes immediately.",
    author: "Kavitha R.",
    role: "Faculty Coordinator & Fest Convenor",
    event: "National Inter-College Tech Symposium (2,400+ Attendees)",
    type: "College Event",
    icon: GraduationCap,
  },
  {
    quote:
      "Setting up multi-session scanning for 6 breakout rooms was effortless. Attendees used one single QR pass for keynote and workshop rooms without confusion or delays.",
    author: "Arjun Verma",
    role: "Lead Operations Organizer",
    event: "Developer & AI Builders Summit (850 Attendees)",
    type: "Tech Conference",
    icon: Laptop,
  },
  {
    quote:
      "Our team opted for the Managed Event Setup. The UrPass team had our branded passes, Razorpay ticketing, and registration flow ready within 24 hours. The check-in at the hotel entrance was flawless.",
    author: "Deepak S.",
    role: "Head of Corporate Events",
    event: "FinTech Executive Forum (400 Attendees)",
    type: "Corporate Seminar",
    icon: Building2,
  },
  {
    quote:
      "During our 36-hour hackathon, we approved registrations, issued passes with team codes, and checked in full teams at midnight seamlessly. The offline sync when WiFi dipped was a lifesaver.",
    author: "Meera Nair",
    role: "Logistics Lead",
    event: "HackMatrix National 36h Hackathon (600 Participants)",
    type: "Hackathon",
    icon: Sparkles,
  },
];

const stats = [
  { value: "50,000+", label: "Passes Scanned", desc: "Across colleges & conferences", href: "/explore" },
  { value: "<0.3s", label: "Check-In Speed", desc: "Instant camera QR decode" },
  { value: "99.9%", label: "Uptime Reliability", desc: "Live service status verified", href: "/status" },
  { value: "0%", label: "UrPass Platform Fee", desc: "Standard gateway fees apply (~2%)" },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 sm:py-28 px-4 sm:px-8 bg-neutral-50/80 border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-brand/10 text-brand border border-brand/20 mb-3">
              PROVEN AT SCALE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 mb-4">
              Real Events. Real Results.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Discover how university teams, conference organizers, and corporate event managers eliminate entrance queues and run seamless check-ins with UrPass.
            </p>
          </div>
        </AnimateIn>

        {/* Proof Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-10">
          {stats.map((s, i) => {
            const Content = (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 text-center shadow-xs hover:border-neutral-300 transition-all h-full">
                <p className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">{s.value}</p>
                <p className="text-xs sm:text-sm font-semibold text-neutral-900 mt-1 flex items-center justify-center gap-1">
                  <span>{s.label}</span>
                  {s.href && <ExternalLink className="w-3 h-3 text-neutral-400 inline" />}
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">{s.desc}</p>
              </div>
            );

            return (
              <AnimateIn key={s.label} delay={i * 60} from="up">
                {s.href ? (
                  <Link href={s.href} className="block h-full group" title={`View ${s.label}`}>
                    {Content}
                  </Link>
                ) : (
                  Content
                )}
              </AnimateIn>
            );
          })}
        </div>

        {/* Trust Signals & Compliance Bar */}
        <AnimateIn delay={100} from="up">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3 px-4 bg-white rounded-xl border border-neutral-200/70 text-xs text-neutral-600 mb-12 sm:mb-16 shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DPDP Act 2023 Compliant</span>
            </span>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Lock className="w-4 h-4 text-brand" />
              <span>256-Bit SSL Data Encryption</span>
            </span>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-violet-600" />
              <span>Razorpay &amp; UPI Verified Checkout</span>
            </span>
            <span className="hidden sm:inline text-neutral-300">•</span>
            <Link href="/security" className="text-brand hover:underline font-semibold flex items-center gap-1">
              <span>Security Center</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </AnimateIn>

        {/* Real Event Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {testimonials.map((t, i) => {
            const Icon = t.icon;
            return (
              <AnimateIn key={t.event} delay={i * 80} from="up">
                <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-neutral-100 text-neutral-700">
                        <Icon className="w-3.5 h-3.5 text-neutral-600" />
                        {t.type}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, si) => (
                          <Star key={si} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-neutral-900 mb-2">
                      {t.event}
                    </p>

                    <p className="text-sm text-neutral-600 leading-relaxed mb-6 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{t.author}</p>
                      <p className="text-xs text-neutral-500">{t.role}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Event
                    </span>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
