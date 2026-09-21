import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import FAQSection from "@/components/landing/FAQSection";
import AnimateIn from "@/components/ui/AnimateIn";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "Event Registration & QR Check-In Software for Modern Events | URPASS",
  },
  description: "Create event registration forms, issue digital QR passes, manage attendees and check guests in from any phone with URPASS. Built for college fests, conferences, hackathons, workshops, corporate events and communities.",
  keywords: [
    "event registration software",
    "QR event check-in",
    "event registration platform",
    "online event registration system",
    "digital event pass",
    "college fest registration software",
    "hackathon registration platform",
    "conference check-in software",
    "event attendance software",
    "event pass management",
    "event check-in app India",
    "Razorpay event ticketing",
    "free event registration",
    "URPASS",
  ],
  alternates: { canonical: "https://urpass.space" },
  openGraph: {
    title: "Event Registration & QR Check-In Software for Modern Events | URPASS",
    description: "Create event registration forms, issue digital QR passes, manage attendees and check guests in from any phone with URPASS.",
    url: "https://urpass.space",
    siteName: "URPASS",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@urpass",
    creator: "@urpass",
    title: "Event Registration & QR Check-In Software for Modern Events | URPASS",
    description: "Create event registration forms, issue digital QR passes, manage attendees and check guests in from any phone with URPASS.",
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
  },
};
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
  Ticket,
  QrCode,
  ScanLine,
  Users,
  BarChart3,
  Palette,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Building2,
  School,
  Presentation,
  Sparkles,
} from "lucide-react";

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
    <div className="relative w-72 mx-auto select-none">
      <div className="absolute inset-0 translate-x-5 translate-y-5 bg-brand-100 rounded-3xl animate-float-delayed" />
      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 bg-brand-200 rounded-3xl" />
      <div className="relative bg-white rounded-3xl border border-neutral-150 shadow-2xl overflow-hidden animate-float">
        <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest text-white/60">URPASS</span>
          <span className="text-xs font-semibold tracking-wide text-white bg-white/10 px-2.5 py-1 rounded-full">VALID</span>
        </div>
        <div className="px-6 pt-5 pb-6">
          <p className="text-[10px] font-semibold tracking-widest text-neutral-400 mb-1">EVENT</p>
          <h3 className="font-semibold text-lg leading-snug text-neutral-900 mb-5">Tech Workshop 2026</h3>
          <div className="flex items-center gap-0 mb-5">
            <div className="w-5 h-5 rounded-full bg-neutral-100 -ml-9 shrink-0" />
            <div className="flex-1 border-t border-dashed border-neutral-200 mx-1" />
            <div className="w-5 h-5 rounded-full bg-neutral-100 -mr-9 shrink-0" />
          </div>
          <p className="text-[10px] font-semibold tracking-widest text-neutral-400 mb-1">ATTENDEE</p>
          <p className="font-semibold text-neutral-900">Srinithin S</p>
          <span className="inline-block mt-1.5 text-[10px] font-semibold tracking-widest text-brand bg-brand-50 px-2.5 py-1 rounded-full">
            PARTICIPANT
          </span>
          <div className="mt-5 flex flex-col items-center">
            <div className="w-28 h-28 p-3 bg-white border border-neutral-100 rounded-2xl shadow-sm">
              <QRPattern className="w-full h-full text-neutral-900" />
            </div>
            <p className="mt-2 text-[10px] text-neutral-400 tracking-widest font-mono">SCAN TO VERIFY</p>
          </div>
          <div className="mt-5 flex items-center justify-between text-[11px] text-neutral-400 font-medium">
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
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-lg overflow-hidden w-full max-w-lg">
      <div className="px-4 pt-3 pb-2 border-b border-neutral-100 flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
      </div>
      <div className="p-5">
        <h4 className="font-semibold text-sm text-neutral-900 mb-4">AI Workshop 2026</h4>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[{ label: "Applications", value: "250" }, { label: "Passes", value: "180" }, { label: "Checked In", value: "127" }].map((s) => (
            <div key={s.label} className="bg-neutral-50 rounded-xl p-3 text-center">
              <p className="text-xl font-semibold text-neutral-900">{s.value}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-neutral-50">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-semibold text-neutral-500">
                  {row.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-900">{row.name}</p>
                  <p className="text-[10px] text-neutral-400">{row.type}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${row.status === "checked_in" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"}`}>
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
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-8 text-center w-60">
      <div className="w-14 h-14 rounded-full bg-emerald-400 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-xs font-bold tracking-widest text-white/60 mb-1">VALID PASS</p>
      <p className="font-semibold text-white text-lg">Srinithin S</p>
      <p className="text-xs text-white/60 mt-0.5">Participant</p>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-white/50">Checked in</p>
        <p className="text-sm font-semibold text-white mt-0.5">9:42 AM</p>
      </div>
    </div>
  );
}

// ─── Plans ────────────────────────────────────────────────────────────────────
const plans = [
  { name: "Free",     price: "₹0",      period: "forever",           recommended: false, cta: "Start free",        href: "/signup",                         subtext: "Free forever",                  features: ["2 events/month", "100 registrations/month", "QR passes & check-in", "Attendee approval", "Basic analytics"] },
  { name: "Starter",  price: "₹499",    period: "/month +GST",       recommended: false, cta: "Try Starter Free",  href: "/signup?plan=starter&trial=true", subtext: "30 days ₹0 · AutoPay required", features: ["10 events/month", "500 registrations/month", "2 organizers", "CSV import & export", "Standard analytics"] },
  { name: "Pro",      price: "₹999",    period: "/month +GST",       recommended: true,  cta: "Try Pro Free",      href: "/signup?plan=pro&trial=true",     subtext: "30 days ₹0 · AutoPay required", features: ["Unlimited events", "2,500 registrations/month", "5 organizers", "Custom pass design", "Advanced analytics", "Priority support"] },
  { name: "Business", price: "₹2,499",  period: "/month +GST",       recommended: false, cta: "Try Business Free", href: "/signup?plan=business&trial=true",subtext: "30 days ₹0 · AutoPay required", features: ["Unlimited events", "10,000 registrations/month", "15 organizers", "Custom domain", "API & webhooks"] },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      {/* ── 01 HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28 px-5 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: text — CSS animations (always above fold, no observer) */}
          <div>
            <div className="hero-badge inline-flex items-center gap-2 bg-brand-50 text-brand text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              EVENT REGISTRATION &amp; QR CHECK-IN PLATFORM
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.12] mb-5 text-neutral-900">
              Event Registration &amp; QR Check-In Software for Modern Events
            </h1>

            <p className="hero-sub text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl mb-3">
              Create event registration forms, issue digital QR passes, manage attendees and check guests in from any phone with URPASS.
            </p>

            <p className="text-xs sm:text-sm font-semibold tracking-wide text-brand mb-8">
              Built for college fests, conferences, hackathons, workshops, corporate events and communities.
            </p>

            <div className="hero-ctas flex flex-col sm:flex-row gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors">
                Create Your Event
                <span className="text-neutral-400">→</span>
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 border border-neutral-200 px-6 py-3.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                See how it works ↓
              </a>
            </div>

            <p className="hero-meta mt-8 text-xs text-neutral-400">
              Free to start · Try any paid plan free for 30 days · No credit card required
            </p>
          </div>

          {/* Right: pass card */}
          <div className="hero-card flex items-center justify-center lg:justify-end py-8">
            <PassCard />
          </div>
        </div>
      </section>

      {/* ── 02 PROBLEM ──────────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-neutral-900">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white text-center mb-14">
              Stop managing event entry manually.
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {[
              { Icon: FileText, title: "Manual lists",       desc: "Names scattered across spreadsheets, forms, and WhatsApp threads." },
              { Icon: Clock,    title: "Long queues",        desc: "Attendees wait at the entrance while names are checked one by one." },
              { Icon: EyeOff,   title: "No live visibility", desc: "You don't know who has actually arrived until the event is over." },
            ].map(({ Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 110} from="up">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                  <Icon className="w-5 h-5 text-white/40 mb-3" />
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={200}>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-semibold text-white">
                URPASS fixes the last step.
              </p>
              <p className="mt-3 text-white/50 text-sm">
                From registration to check-in — in one tool.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── 03 HOW IT WORKS (Create. Share. Scan.) ─────────────────────── */}
      <section id="how-it-works" className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-brand mb-3 uppercase">WORKFLOW</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-4">
                Create. Share. Scan.
              </h2>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">
                Bring the complete registration-to-entry workflow into one simple system.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { n: "01", title: "Create", desc: "Create your event in minutes." },
              { n: "02", title: "Share",  desc: "Share a registration link with your attendees." },
              { n: "03", title: "Approve",desc: "Approve registrations and automatically issue unique digital QR passes." },
              { n: "04", title: "Scan",   desc: "Scan passes at the entrance using any phone or tablet." },
              { n: "05", title: "Track",  desc: "Track attendance and check-ins from one simple dashboard." },
            ].map((step, i) => (
              <AnimateIn key={step.n} delay={i * 80} from="up">
                <div className="relative h-full">
                  {i < 4 && (
                    <div className="hidden sm:block absolute top-5 left-full w-full h-px bg-neutral-100 z-0" />
                  )}
                  <div className="relative bg-white border border-neutral-100 rounded-2xl p-5 hover:border-brand-200 hover:shadow-sm transition-all h-full">
                    <span className="text-xs font-mono text-neutral-300 mb-3 block">{step.n}</span>
                    <h3 className="font-semibold text-neutral-900 mb-1.5">{step.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03.5 EVERYTHING YOU NEED TO RUN EVENT ENTRY ──────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-brand mb-3 uppercase">CORE CAPABILITIES</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-4">
                Everything You Need to Run Event Entry
              </h2>
              <p className="text-neutral-500 text-base max-w-xl mx-auto">
                A complete event toolkit from registration collection to real-time check-in.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Online Event Registration",
                desc: "Create customizable registration forms and collect attendee information online.",
                href: "/event-registration-software",
              },
              {
                icon: QrCode,
                title: "Digital QR Event Passes",
                desc: "Issue a unique QR pass to every approved attendee.",
                href: "/digital-event-pass",
              },
              {
                icon: ScanLine,
                title: "Fast QR Check-In",
                desc: "Turn a phone or tablet into an event check-in scanner.",
                href: "/qr-code-scanner",
              },
              {
                icon: Users,
                title: "Attendee Management",
                desc: "View registrations, approve attendees and manage participant information from one dashboard.",
                href: "/attendee-management",
              },
              {
                icon: BarChart3,
                title: "Real-Time Attendance Tracking",
                desc: "See who has arrived and monitor check-ins while your event is running.",
                href: "/event-attendance-tracking",
              },
              {
                icon: Palette,
                title: "Custom Ticket Design",
                desc: "Create branded digital passes and tickets for your event.",
                href: "/custom-pass-design",
              },
            ].map((f, i) => (
              <AnimateIn key={f.title} delay={i * 70} from="up">
                <Link
                  href={f.href}
                  className="block bg-white rounded-2xl border border-neutral-200/80 p-6 h-full hover:border-brand-300 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <f.icon className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 text-base mb-2 group-hover:text-brand transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {f.desc}
                  </p>
                  <span className="text-xs font-semibold text-brand flex items-center gap-1">
                    Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 PRODUCT SHOWCASE ──────────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8 bg-neutral-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimateIn from="left">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand mb-4">ORGANIZER DASHBOARD</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6">
                Your event. Your passes.
              </h2>
              <p className="text-neutral-500 text-base leading-relaxed mb-8">
                Manage everything you need from one simple dashboard. No complicated tools.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "See applications as they come in",
                  "Approve or reject attendees",
                  "Generate passes with one click",
                  "Track check-ins in real time",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-neutral-600">
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
      <section className="py-28 px-5 sm:px-8 bg-neutral-900 overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimateIn from="left">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand-200 mb-4">QR CHECK-IN</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-6">
                Entry takes one scan.
              </h2>
              <p className="text-white/50 text-base leading-relaxed mb-6">
                Open the scanner on any phone or tablet, point at the pass, and URPASS instantly validates the QR code and records the check-in.
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Duplicate check-ins are blocked",
                  "Invalid passes are flagged immediately",
                  "Expired passes are caught",
                  "No app required for attendees",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                    <span className="w-1 h-1 rounded-full bg-brand block shrink-0" />
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

      {/* ── 06 BUILT FOR EVERY KIND OF EVENT ────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-white border-t border-neutral-100">
        <div className="max-w-5xl mx-auto text-center">
          <AnimateIn>
            <p className="text-xs font-semibold tracking-widest text-brand mb-3 uppercase">USE CASES</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Built for Every Kind of Event
            </h2>
            <p className="text-neutral-500 mb-12 max-w-lg mx-auto">
              Whether you are running a 50-person department workshop or a 10,000-attendee annual fest, URPASS handles entry seamlessly.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 justify-center">
            {[
              { Icon: GraduationCap, label: "College fests and culturals", href: "/college-fests" },
              { Icon: Trophy,        label: "Hackathons and buildathons", href: "/hackathons" },
              { Icon: Monitor,       label: "Workshops and masterclasses", href: "/workshops" },
              { Icon: Mic,           label: "Technology conferences",     href: "/conferences" },
              { Icon: Building2,     label: "Corporate events and summits", href: "/corporate-events" },
              { Icon: Megaphone,     label: "Seminars & Lectures",        href: "/seminars" },
              { Icon: Users2,        label: "Community meetups",          href: "/community-events" },
              { Icon: School,        label: "Campus events",              href: "/campus-events" },
              { Icon: Presentation,  label: "Exhibitions & Expos",        href: "/exhibitions" },
              { Icon: Sparkles,      label: "Networking events",          href: "/networking-events" },
            ].map(({ Icon, label, href }, i) => (
              <AnimateIn key={label} delay={i * 45} from="scale">
                <Link
                  href={href}
                  className="flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-neutral-200/80 bg-white hover:border-brand-300 hover:bg-brand-50/50 hover:shadow-xs transition-all h-full group"
                >
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center mb-2.5 group-hover:bg-brand-100 transition-colors">
                    <Icon className="w-5 h-5 text-neutral-600 group-hover:text-brand transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-800 leading-snug">{label}</span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06.5 EVENT REGISTRATION SOFTWARE BUILT FOR INDIA ─────────────── */}
      <section className="py-20 px-5 sm:px-8 bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateIn from="left">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-brand-200 text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6">
                  <MapPin className="w-3.5 h-3.5 text-brand-300" />
                  EVENT REGISTRATION SOFTWARE BUILT FOR INDIA
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-5 leading-tight">
                  Run registrations, QR passes and event check-ins from one platform.
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-6">
                  URPASS supports Indian event organizers with INR pricing, online payments via Razorpay (UPI, cards, net banking), digital ticketing, and browser-based QR check-in.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-white/60 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>INR Pricing &amp; GST Invoicing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant UPI &amp; Card Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>No App Downloads Required</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors"
                  >
                    Start your first event for free
                    <span>→</span>
                  </Link>
                  <Link
                    href="/in"
                    className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Explore India Hub
                  </Link>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn from="right" delay={100}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xs">
                <p className="text-xs font-semibold tracking-widest text-brand-200 uppercase mb-4">Supported Indian Hubs</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { city: "Bengaluru", note: "Tech conferences & Hackathons", href: "/in/bangalore" },
                    { city: "Chennai", note: "College culturals & Symposiums", href: "/in/chennai" },
                    { city: "Mumbai", note: "Corporate summits & Expos", href: "/in/mumbai" },
                    { city: "Hyderabad", note: "Developer meetups & Buildathons", href: "/in/hyderabad" },
                    { city: "Delhi NCR", note: "Seminars & Industry meets", href: "/in/delhi" },
                    { city: "Pune", note: "Student fests & Tech meets", href: "/in/pune" },
                    { city: "Coimbatore", note: "Engineering fests & Workshops", href: "/in/coimbatore" },
                    { city: "Kochi", note: "Startups & Creator fests", href: "/in/kochi" },
                  ].map((hub) => (
                    <Link
                      key={hub.city}
                      href={hub.href}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-white/10 transition-all block"
                    >
                      <span className="font-semibold text-white block">{hub.city}</span>
                      <span className="text-[10px] text-white/50 block mt-0.5">{hub.note}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── 07 PRICING ───────────────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-5 sm:px-8 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand text-xs font-bold tracking-wider uppercase mb-3">
                YOUR FIRST 30 DAYS ARE FREE
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Choose any plan. Get your first 30 days free.</h2>
              <p className="mt-3 text-neutral-500 text-sm">AutoPay setup required · Cancel before renewal · One free trial per account</p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {plans.map((plan, i) => (
              <AnimateIn key={plan.name} delay={i * 90} from="up">
                <div className={`relative rounded-2xl flex flex-col p-7 h-full ${plan.recommended ? "bg-neutral-900 text-white shadow-xl" : "bg-white border border-neutral-100"}`}>
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest bg-brand text-white px-3 py-1 rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                  <p className={`text-xs font-semibold tracking-widest mb-4 ${plan.recommended ? "text-white/50" : "text-neutral-400"}`}>
                    {plan.name.toUpperCase()}
                  </p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-semibold">{plan.price}</span>
                    <span className={`text-sm ${plan.recommended ? "text-white/40" : "text-neutral-400"}`}>{plan.period}</span>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <svg className={`w-4 h-4 shrink-0 ${plan.recommended ? "text-brand-200" : "text-brand"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.recommended ? "text-white/70" : "text-neutral-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-1.5">
                    <Link href={plan.href} className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors ${plan.recommended ? "bg-white text-neutral-900 hover:bg-neutral-100" : "bg-neutral-900 text-white hover:bg-neutral-700"}`}>
                      {plan.cta}
                    </Link>
                    {plan.subtext && (
                      <p className={`text-[10px] text-center ${plan.recommended ? "text-white/40" : "text-neutral-400"}`}>
                        {plan.subtext}
                      </p>
                    )}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08 FAQ ───────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── 09 FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8 bg-neutral-900 text-center">
        <AnimateIn>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white mb-5 leading-tight">
              Your next event deserves a simpler entry.
            </h2>
            <p className="text-white/50 text-base mb-3">
              Create your event. Share the link. Scan the passes.
            </p>
          </div>
        </AnimateIn>
        <AnimateIn delay={120} from="scale">
          <div className="mt-10">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors">
              Create Your Event <span>→</span>
            </Link>
          </div>
          <p className="mt-5 text-xs text-white/30">Start free · No credit card required</p>
        </AnimateIn>
      </section>

      {/* ── JSON-LD Structured Data for SEO ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "URPASS",
            operatingSystem: "All, Web, iOS, Android",
            applicationCategory: "BusinessApplication",
            url: "https://urpass.space",
            offers: [
              {
                "@type": "Offer",
                name: "Free Tier",
                price: "0",
                priceCurrency: "INR",
                description: "2 events/month, 100 registrations/month, QR passes & check-in.",
              },
              {
                "@type": "Offer",
                name: "Starter 30-Day Free Trial",
                price: "0",
                priceCurrency: "INR",
                description: "Try Starter plan free for 30 days (₹499/mo after). AutoPay setup required.",
              },
              {
                "@type": "Offer",
                name: "Pro 30-Day Free Trial",
                price: "0",
                priceCurrency: "INR",
                description: "Try Pro plan free for 30 days (₹999/mo after). AutoPay setup required.",
              },
              {
                "@type": "Offer",
                name: "Business 30-Day Free Trial",
                price: "0",
                priceCurrency: "INR",
                description: "Try Business plan free for 30 days (₹2,499/mo after). AutoPay setup required.",
              },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "168",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
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
                  text: "Each approved attendee gets a unique QR pass. Staff opens the scanner on any device, scans the QR, and URPASS instantly validates and records the check-in in under 0.3 seconds.",
                },
              },
              {
                "@type": "Question",
                name: "Can I start for free or try a paid plan?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. The permanent free tier lets you host 2 events/month with up to 100 registrations/month at ₹0 forever with no credit card required. You can also try any paid plan (Starter, Pro, or Business) free for 30 days.",
                },
              },
              {
                "@type": "Question",
                name: "Does URPASS charge per-ticket commission fees?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Unlike platforms like Eventbrite that take 3.7%+ per ticket, URPASS charges zero per-ticket platform fees. You only pay your flat monthly subscription or use the free plan.",
                },
              },
              {
                "@type": "Question",
                name: "How fast is the entry check-in scanner?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Passes scan in under 0.3 seconds directly inside any mobile browser. Entry staff can scan passes smoothly and continuously without installing any mobile app.",
                },
              },
            ],
          }),
        }}
      />

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
