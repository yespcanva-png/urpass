import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import FAQSection from "@/components/landing/FAQSection";
import AnimateIn from "@/components/ui/AnimateIn";
import Footer from "@/components/landing/Footer";
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
  Bot,
  Terminal,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS — Digital Event Passes & QR Check-in India",
  description: "Create digital event passes in minutes. Manage attendees, scan QR codes at entry, and issue branded passes — free to start. Trusted by colleges and event organizers across India.",
  alternates: { canonical: "https://urpass.space" },
  openGraph: {
    title: "URPASS — Digital Event Passes & QR Check-in",
    description: "Create digital passes, manage attendees, and scan QR codes at the door. Free plan available.",
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
      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 sm:translate-x-5 sm:translate-y-5 bg-brand-100 rounded-3xl animate-float-delayed" />
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 sm:translate-x-2.5 sm:translate-y-2.5 bg-brand-200 rounded-3xl" />
      <div className="relative bg-white rounded-3xl border border-neutral-150 shadow-2xl overflow-hidden animate-float">
        <div className="bg-neutral-900 px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest text-white/60">URPASS</span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-white bg-white/10 px-2.5 py-1 rounded-full">VALID</span>
        </div>
        <div className="px-5 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6">
          <p className="text-[10px] font-semibold tracking-widest text-neutral-400 mb-1">EVENT</p>
          <h3 className="font-semibold text-base sm:text-lg leading-snug text-neutral-900 mb-4 sm:mb-5">Tech Workshop 2026</h3>
          <div className="flex items-center gap-0 mb-4 sm:mb-5">
            <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-neutral-100 -ml-7 sm:-ml-9 shrink-0" />
            <div className="flex-1 border-t border-dashed border-neutral-200 mx-1" />
            <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-neutral-100 -mr-7 sm:-mr-9 shrink-0" />
          </div>
          <p className="text-[10px] font-semibold tracking-widest text-neutral-400 mb-1">ATTENDEE</p>
          <p className="font-semibold text-sm sm:text-base text-neutral-900">Srinithin S</p>
          <span className="inline-block mt-1.5 text-[10px] font-semibold tracking-widest text-brand bg-brand-50 px-2.5 py-1 rounded-full">
            PARTICIPANT
          </span>
          <div className="mt-4 sm:mt-5 flex flex-col items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 p-2.5 sm:p-3 bg-white border border-neutral-100 rounded-2xl shadow-sm">
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
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-lg overflow-hidden w-full max-w-lg">
      <div className="px-4 pt-3 pb-2 border-b border-neutral-100 flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
      </div>
      <div className="p-4 sm:p-5">
        <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 mb-3 sm:mb-4">AI Workshop 2026</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {[{ label: "Applications", value: "250" }, { label: "Passes", value: "180" }, { label: "Checked In", value: "127" }].map((s) => (
            <div key={s.label} className="bg-neutral-50 rounded-xl p-2.5 sm:p-3 text-center">
              <p className="text-lg sm:text-xl font-semibold text-neutral-900">{s.value}</p>
              <p className="text-[9px] sm:text-[10px] text-neutral-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col divide-y divide-neutral-50">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-2 sm:py-2.5">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-semibold text-neutral-500 shrink-0">
                  {row.name[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-900">{row.name}</p>
                  <p className="text-[10px] text-neutral-400">{row.type}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${row.status === "checked_in" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-400"}`}>
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

// ─── MCP Agent Mockup ────────────────────────────────────────────────────────
function McpMockup() {
  return (
    <div className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden w-full max-w-lg text-left font-sans">
      {/* Window Title Bar */}
      <div className="px-4 sm:px-5 py-3.5 bg-neutral-950/90 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          <span className="ml-2 text-xs font-mono text-neutral-400">Claude Desktop · URPASS MCP</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-mono border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          10 tools active
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="p-4 sm:p-6 flex flex-col gap-3.5 text-xs">
        {/* User Prompt 1 */}
        <div className="flex items-start gap-2.5 justify-end">
          <div className="bg-brand text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed shadow-sm">
            How is gate throughput looking for today&apos;s AI Summit?
          </div>
        </div>

        {/* Tool Invocation 1 */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800/80 border border-neutral-700/60 rounded-xl text-[11px] text-neutral-300 font-mono self-start">
          <Cpu className="w-3.5 h-3.5 text-brand-200 shrink-0" />
          <span>Called <strong className="text-white">get_event_stats</strong>(event_id: &quot;ai-summit-2026&quot;)</span>
        </div>

        {/* Assistant Response 1 */}
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-4 text-neutral-300 space-y-3">
          <p className="leading-relaxed">
            Attendance velocity is at its morning peak. Here is the live telemetry:
          </p>
          <div className="grid grid-cols-3 gap-2 py-0.5">
            <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800 text-center">
              <p className="text-base sm:text-lg font-bold text-white">742</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Checked In</p>
            </div>
            <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800 text-center">
              <p className="text-base sm:text-lg font-bold text-emerald-400">84.3%</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Turnout</p>
            </div>
            <div className="bg-neutral-900/90 p-2.5 rounded-xl border border-neutral-800 text-center">
              <p className="text-base sm:text-lg font-bold text-brand-300">42/min</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">Velocity</p>
            </div>
          </div>
          <p className="text-[11px] text-neutral-400 leading-normal">
            North Gate is handling 65% of arrivals. You have 12 pending VIP speaker applications waiting for approval.
          </p>
        </div>

        {/* User Prompt 2 */}
        <div className="flex items-start gap-2.5 justify-end">
          <div className="bg-brand text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed shadow-sm">
            Approve all 12 speakers and issue their digital passes.
          </div>
        </div>

        {/* Tool Invocation 2 */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800/80 border border-neutral-700/60 rounded-xl text-[11px] text-neutral-300 font-mono self-start">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>Called <strong className="text-white">approve_attendee</strong> (12 attendees)</span>
        </div>

        {/* Assistant Response 2 */}
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-2xl p-3.5 text-neutral-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>12 speaker passes generated and emailed with Apple Wallet links.</span>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="px-4 sm:px-5 py-3 bg-neutral-950/90 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-500">
        <span className="flex items-center gap-2 text-neutral-400">
          <Terminal className="w-3.5 h-3.5 text-brand-300" />
          npx urpass-mcp
        </span>
        <span className="text-neutral-500">stdio transport</span>
      </div>
    </div>
  );
}

// ─── Plans ────────────────────────────────────────────────────────────────────
const plans = [
  { name: "Free",     price: "₹0",      period: "forever",           recommended: false, cta: "Start free",        href: "/signup",                         subtext: "Free forever",                  features: ["2 events/month", "100 registrations/month", "QR passes & check-in", "Attendee approval", "Basic analytics"] },
  { name: "Starter",  price: "₹499",    period: "/month +GST",       recommended: false, cta: "Try Starter Free",  href: "/signup?plan=starter&trial=true", subtext: "30 days ₹0 · No credit card required", features: ["10 events/month", "500 registrations/month", "2 organizers", "CSV import & export", "Standard analytics"] },
  { name: "Pro",      price: "₹999",    period: "/month +GST",       recommended: true,  cta: "Try Pro Free",      href: "/signup?plan=pro&trial=true",     subtext: "30 days ₹0 · No credit card required", features: ["Unlimited events", "2,500 registrations/month", "5 organizers", "Custom pass design", "Advanced analytics", "Priority support"] },
  { name: "Business", price: "₹2,499",  period: "/month +GST",       recommended: false, cta: "Try Business Free", href: "/signup?plan=business&trial=true",subtext: "30 days ₹0 · No credit card required", features: ["Unlimited events", "10,000 registrations/month", "15 organizers", "Custom domain", "API & webhooks"] },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      {/* ── 01 HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-28 pb-14 sm:pt-40 sm:pb-28 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">

          {/* Left: text — CSS animations (always above fold, no observer) */}
          <div>
            <div className="hero-badge inline-flex items-center gap-2 bg-brand-50 text-brand text-[11px] sm:text-xs font-semibold tracking-wider px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
              SIMPLE DIGITAL EVENT PASSES
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-4 sm:mb-6">
              <span className="hero-line-1 block">Create.</span>
              <span className="hero-line-2 block">Share.</span>
              <span className="hero-line-3 block text-brand">Scan.</span>
            </h1>

            <p className="hero-sub text-base sm:text-xl text-neutral-500 leading-relaxed max-w-md mb-8 sm:mb-10">
              Turn event registrations into digital passes with QR check-in. Create your event, share the link, issue passes, and scan attendees at the entrance.
            </p>

            <div className="hero-ctas flex flex-col sm:flex-row gap-3">
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-700 transition-colors text-center">
                Create Your Event
                <span className="text-neutral-400">→</span>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-200 px-6 py-3.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors text-center">
                See how it works ↓
              </a>
            </div>

            <p className="hero-meta mt-6 sm:mt-8 text-xs text-neutral-400">
              Free to start · Try any paid plan free for 30 days
            </p>
          </div>

          {/* Right: pass card */}
          <div className="hero-card flex items-center justify-center lg:justify-end py-4 sm:py-8">
            <PassCard />
          </div>
        </div>
      </section>

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

      {/* ── 06 MODEL CONTEXT PROTOCOL (MCP) ─────────────────────────────── */}
      <section id="mcp" className="py-16 sm:py-28 px-4 sm:px-8 bg-neutral-950 text-white border-t border-neutral-800/80 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Column: Copy & Value Props */}
          <AnimateIn from="left">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] sm:text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                MODEL CONTEXT PROTOCOL (MCP)
              </div>

              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.1] mb-5 sm:mb-6">
                Manage your events with AI. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-brand-300 to-indigo-300">
                  Inside Claude &amp; Cursor.
                </span>
              </h2>

              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                URPASS is the first event ticketing platform with native Model Context Protocol support.
                Connect Claude Desktop, Cursor, or autonomous agents to query attendance, approve registrations, issue passes, and manage gate check-ins conversationally.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-8">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2.5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-1">Conversational Ops</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Ask: &quot;How many checked in at North Gate?&quot; or &quot;Approve all speaker passes.&quot;
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 mb-2.5">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-1">1-Minute Setup</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Add <code className="text-purple-300 font-mono text-[11px]">npx urpass-mcp</code> to your Claude Desktop or Cursor config.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-2.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-1">10 Production Tools</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Typed schemas for events, attendee rosters, stats, pass tokens, and check-in.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-2.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-white mb-1">Scoped Security</h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Strict Bearer token auth sandboxed to your organizer account and database RLS.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/mcp-event-management"
                  className="inline-flex items-center gap-2 bg-brand text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
                >
                  Explore MCP Platform
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/docs#mcp"
                  className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-3 rounded-xl text-xs sm:text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  View Setup Docs
                </Link>
              </div>
            </div>
          </AnimateIn>

          {/* Right Column: Interactive Claude Desktop MCP Mockup */}
          <AnimateIn from="right" delay={100}>
            <div className="flex justify-center lg:justify-end">
              <McpMockup />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── 07 EVENT TYPES ───────────────────────────────────────────────── */}
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
                  className="flex items-center gap-2 sm:gap-2.5 border border-neutral-100 rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 hover:border-brand-200 hover:bg-brand-50 transition-all group"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:text-brand transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-neutral-700 group-hover:text-brand transition-colors">{label}</span>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08 PRICING ───────────────────────────────────────────────────── */}
      <section id="pricing" className="py-14 sm:py-28 px-4 sm:px-8 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3">
                YOUR FIRST 30 DAYS ARE FREE
              </div>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">Choose any plan. Get your first 30 days free.</h2>
              <p className="mt-2 sm:mt-3 text-neutral-500 text-xs sm:text-sm">No credit card or AutoPay required · Instant access · One free trial per account</p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {plans.map((plan, i) => (
              <AnimateIn key={plan.name} delay={i * 90} from="up">
                <div className={`relative rounded-2xl flex flex-col p-5 sm:p-7 h-full ${plan.recommended ? "bg-neutral-900 text-white shadow-xl" : "bg-white border border-neutral-100"}`}>
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest bg-brand text-white px-3 py-1 rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                  <p className={`text-xs font-semibold tracking-widest mb-3 sm:mb-4 ${plan.recommended ? "text-white/50" : "text-neutral-400"}`}>
                    {plan.name.toUpperCase()}
                  </p>
                  <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                    <span className="text-3xl sm:text-4xl font-semibold">{plan.price}</span>
                    <span className={`text-xs sm:text-sm ${plan.recommended ? "text-white/40" : "text-neutral-400"}`}>{plan.period}</span>
                  </div>
                  <ul className="flex flex-col gap-2 sm:gap-2.5 flex-1 mb-6 sm:mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-xs sm:text-sm">
                        <svg className={`w-4 h-4 shrink-0 ${plan.recommended ? "text-brand-200" : "text-brand"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.recommended ? "text-white/70" : "text-neutral-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-1.5">
                    <Link href={plan.href} className={`w-full text-center py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-colors ${plan.recommended ? "bg-white text-neutral-900 hover:bg-neutral-100" : "bg-neutral-900 text-white hover:bg-neutral-700"}`}>
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

      {/* ── 09 FAQ ───────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── 10 FINAL CTA ─────────────────────────────────────────────────── */}
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
          <div className="mt-8 sm:mt-10">
            <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-8 py-3.5 sm:py-4 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors">
              Create Your Event <span>→</span>
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
