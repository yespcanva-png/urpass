"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, ChevronDown, Sparkles } from "lucide-react";
import TrialConfirmationModal from "@/components/billing/TrialConfirmationModal";

type Cycle = "monthly" | "annual";

// ─── Plan definitions ──────────────────────────────────────────────────────────

const PLANS = [
  {
    slug: "free",
    name: "Free",
    desc: "For trying URPASS and running small events.",
    monthly: 0,
    annual: 0,
    popular: false,
    highlight: false,
    cta: "Start Free",
    href: "/signup",
    bullets: [
      "2 events/month",
      "100 registrations/month",
      "1 organizer",
      "Registration forms (3 custom fields)",
      "Digital QR passes & check-in",
      "Attendee approval",
      "Basic analytics",
    ],
  },
  {
    slug: "starter",
    name: "Starter",
    desc: "For individual organizers and small event teams.",
    monthly: 499,
    annual: 4990,
    popular: false,
    highlight: false,
    cta: "Choose Starter",
    href: "/signup",
    bullets: [
      "10 events/month",
      "500 registrations/month",
      "2 organizer seats",
      "10 custom registration fields",
      "CSV import & export",
      "Standard analytics",
      "Full email notifications",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    desc: "For growing event teams, colleges and professional organizers.",
    monthly: 999,
    annual: 9990,
    popular: true,
    highlight: true,
    cta: "Choose Pro",
    href: "/signup",
    bullets: [
      "Unlimited events",
      "2,500 registrations/month",
      "5 organizer seats",
      "Custom pass design & branding",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    slug: "business",
    name: "Business",
    desc: "For organizations managing events at scale.",
    monthly: 2499,
    annual: 24990,
    popular: false,
    highlight: false,
    cta: "Choose Business",
    href: "/signup",
    bullets: [
      "Unlimited events",
      "10,000 registrations/month",
      "15 organizer seats",
      "Custom domain, API & webhooks",
      "Advanced team permissions",
      "Cross-event analytics",
    ],
  },
];

// ─── Feature comparison table ──────────────────────────────────────────────────

type CellValue = boolean | string;

type TableRow =
  | { type: "category"; label: string }
  | { type: "row"; feature: string; free: CellValue; starter: CellValue; pro: CellValue; business: CellValue };

const TABLE: TableRow[] = [
  { type: "category", label: "Usage" },
  { type: "row", feature: "Events / month",          free: "2",     starter: "10",    pro: "Unlimited", business: "Unlimited" },
  { type: "row", feature: "Registrations / month",  free: "100",   starter: "500",   pro: "2,500",     business: "10,000" },
  { type: "row", feature: "Organizer seats",         free: "1",     starter: "2",     pro: "5",         business: "15" },

  { type: "category", label: "Core" },
  { type: "row", feature: "Registration forms",          free: true, starter: true, pro: true, business: true },
  { type: "row", feature: "Digital QR passes",           free: true, starter: true, pro: true, business: true },
  { type: "row", feature: "QR check-in",                 free: true, starter: true, pro: true, business: true },
  { type: "row", feature: "Duplicate scan prevention",   free: true, starter: true, pro: true, business: true },
  { type: "row", feature: "Attendee approval",           free: true, starter: true, pro: true, business: true },
  { type: "row", feature: "Attendance tracking",         free: true, starter: true, pro: true, business: true },

  { type: "category", label: "Data" },
  { type: "row", feature: "Email notifications",         free: "Basic",    starter: true,       pro: true,        business: true },
  { type: "row", feature: "CSV attendee import",         free: false,      starter: true,       pro: true,        business: true },
  { type: "row", feature: "CSV export",                  free: false,      starter: true,       pro: true,        business: true },
  { type: "row", feature: "Analytics",                   free: "Basic",    starter: "Standard", pro: "Advanced",  business: "Advanced" },

  { type: "category", label: "Customisation" },
  { type: "row", feature: "Custom registration fields",  free: "3 fields", starter: "10 fields", pro: "Unlimited", business: "Unlimited" },
  { type: "row", feature: "Custom pass design",          free: false,      starter: false,       pro: true,        business: true },
  { type: "row", feature: "Remove URPASS branding",      free: false,      starter: false,       pro: true,        business: true },

  { type: "category", label: "Scale" },
  { type: "row", feature: "Team permissions",            free: false, starter: false, pro: "Basic",  business: "Advanced" },
  { type: "row", feature: "Custom domain",               free: false, starter: false, pro: false,    business: true },
  { type: "row", feature: "API access",                  free: false, starter: false, pro: false,    business: true },
  { type: "row", feature: "Webhooks",                    free: false, starter: false, pro: false,    business: true },
  { type: "row", feature: "Support",                     free: "Standard", starter: "Standard", pro: "Priority", business: "Priority" },
];

// ─── One-event passes ──────────────────────────────────────────────────────────

const EVENT_PASSES = [
  {
    name: "Event",
    price: 299,
    regs: "250 registrations",
    features: ["1 event", "QR passes & check-in", "Attendee approval", "CSV export", "Basic analytics"],
  },
  {
    name: "Event Plus",
    price: 599,
    regs: "1,000 registrations",
    features: ["1 event", "QR passes & check-in", "Attendee approval", "CSV export", "Analytics", "Custom pass design"],
  },
  {
    name: "Large Event",
    price: 999,
    regs: "2,500 registrations",
    features: ["1 event", "QR passes & check-in", "Attendee approval", "CSV export", "Analytics", "Custom pass design", "Remove branding"],
  },
];

// ─── FAQ ───────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your billing settings at any time. You keep access until the end of your current billing period — no prorated refunds, no lock-in.",
  },
  {
    q: "What happens when I reach my registration limit?",
    a: "New registrations are paused and a notice is shown to you in the dashboard. Your existing attendee data, passes, and check-in records are always accessible — nothing is deleted.",
  },
  {
    q: "Can I change plans mid-cycle?",
    a: "Yes. Upgrades take effect immediately. Downgrades take effect at the start of your next billing period so you keep what you paid for.",
  },
  {
    q: "Do attendees need a URPASS account?",
    a: "No. Attendees receive their QR pass by email or a shareable link. No account, app download, or login required on their side.",
  },
  {
    q: "Can I purchase URPASS for a single event?",
    a: "Yes. Event passes (₹299 / ₹599 / ₹999) let you run one event without a monthly subscription. You pick the tier based on expected registrations.",
  },
  {
    q: "Can I sell paid tickets?",
    a: "Paid ticketing is coming soon. You can contact us to join the early-access list.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your event and attendee data is retained for 30 days after cancellation, giving you time to export everything. After 30 days, data is permanently deleted.",
  },
];

// ─── Helper components ─────────────────────────────────────────────────────────

function Cell({ value }: { value: CellValue }) {
  if (value === true)  return <Check className="w-4 h-4 text-brand mx-auto" />;
  if (value === false) return <Minus className="w-4 h-4 text-neutral-200 mx-auto" />;
  return <span className="text-xs text-neutral-500">{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-medium text-neutral-900">{q}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="pb-5 text-sm text-neutral-500 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

interface Props {
  isAuthenticated?: boolean;
  trialUsed?: boolean;
  userEmail?: string;
  userName?: string;
}

export default function PricingContent({
  isAuthenticated = false,
  trialUsed = false,
  userEmail = "",
  userName = "",
}: Props = {}) {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [trialModal, setTrialModal] = useState<{ planSlug: string; planName: string } | null>(null);

  function displayPrice(plan: typeof PLANS[0]) {
    if (plan.monthly === 0) return { price: "₹0", sub: "forever" };
    if (cycle === "monthly") return { price: `₹${plan.monthly.toLocaleString("en-IN")}`, sub: "/month +GST" };
    const perMonth = Math.round(plan.annual / 12);
    return {
      price: `₹${perMonth.toLocaleString("en-IN")}`,
      sub: `/month · ₹${plan.annual.toLocaleString("en-IN")}/year`,
    };
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ── */}
      <header className="border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-base text-neutral-900">URPASS</Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link href="/dashboard" className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Log in</Link>
              <Link href="/signup" className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors">Get started</Link>
            </>
          )}
        </div>
      </header>

      <main className="px-5 sm:px-8">

        {/* ── 01 Hero + Toggle ── */}
        <section className="max-w-5xl mx-auto text-center pt-20 pb-14">
          {!trialUsed ? (
            <>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand text-xs font-bold tracking-wider uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                YOUR FIRST 30 DAYS ARE FREE
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-4">
                TRY ANY URPASS PLAN FREE FOR 30 DAYS
              </h1>
              <p className="text-neutral-600 max-w-2xl mx-auto mb-3 text-base sm:text-lg">
                Choose Starter, Pro, or Business and unlock all features of that plan for 30 days.
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 mb-8 bg-neutral-100 px-3.5 py-1.5 rounded-full flex-wrap justify-center">
                <span>AutoPay setup required</span>
                <span>&middot;</span>
                <span>Cancel before renewal</span>
                <span>&middot;</span>
                <span>One free activation per account</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold tracking-widest text-brand mb-4">PRICING</p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
                Simple pricing for every event.
              </h1>
              <p className="text-neutral-500 mb-10 text-base">
                Start free. Upgrade when your events grow. No complicated setup.
              </p>
            </>
          )}

          {/* Monthly / Annual toggle */}
          <div className="inline-flex items-center bg-neutral-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${cycle === "monthly" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle("annual")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${cycle === "annual" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              Annual
              <span className="text-[10px] font-bold tracking-wider text-brand bg-brand-50 px-2 py-0.5 rounded-full">
                SAVE 2 MO
              </span>
            </button>
          </div>
          {cycle === "annual" && (
            <p className="mt-3 text-xs text-neutral-400">Save 2 months with annual billing</p>
          )}
        </section>

        {/* ── 02 Plan Cards ── */}
        <section className="max-w-5xl mx-auto pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {PLANS.map((plan) => {
              const { price, sub } = displayPrice(plan);
              return (
                <div
                  key={plan.slug}
                  className={`relative flex flex-col rounded-2xl p-6 h-full ${plan.highlight ? "bg-neutral-900 text-white" : "bg-white border border-neutral-100"}`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest bg-brand text-white px-3 py-1 rounded-full whitespace-nowrap">
                      MOST POPULAR
                    </span>
                  )}
                  <p className={`text-xs font-semibold tracking-widest mb-1 ${plan.highlight ? "text-white/50" : "text-neutral-400"}`}>
                    {plan.name.toUpperCase()}
                  </p>
                  <p className={`text-xs mb-5 leading-relaxed ${plan.highlight ? "text-white/40" : "text-neutral-400"}`}>
                    {plan.desc}
                  </p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-semibold">{price}</span>
                    <span className={`text-xs ${plan.highlight ? "text-white/40" : "text-neutral-400"}`}>{sub}</span>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1 mb-7">
                    {plan.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm">
                        <svg className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-brand-200" : "text-brand"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.highlight ? "text-white/70" : "text-neutral-600"}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {!trialUsed && plan.monthly > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      {isAuthenticated ? (
                        <button
                          onClick={() => setTrialModal({ planSlug: plan.slug, planName: plan.name })}
                          className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                            plan.highlight
                              ? "bg-white text-neutral-900 hover:bg-neutral-100"
                              : "bg-neutral-900 text-white hover:bg-neutral-800"
                          }`}
                        >
                          Try {plan.name} Free
                        </button>
                      ) : (
                        <Link
                          href={`/signup?plan=${plan.slug}&trial=true`}
                          className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                            plan.highlight
                              ? "bg-white text-neutral-900 hover:bg-neutral-100"
                              : "bg-neutral-900 text-white hover:bg-neutral-800"
                          }`}
                        >
                          Try {plan.name} Free
                        </Link>
                      )}
                      <p className={`text-[10px] text-center ${plan.highlight ? "text-white/40" : "text-neutral-400"}`}>
                        30 days ₹0 &middot; AutoPay required
                      </p>
                    </div>
                  ) : (
                    <Link
                      href={plan.monthly === 0 ? (isAuthenticated ? "/dashboard" : "/signup") : (isAuthenticated ? "/billing" : "/signup")}
                      className={`w-full text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                        plan.highlight
                          ? "bg-white text-neutral-900 hover:bg-neutral-100"
                          : "bg-neutral-900 text-white hover:bg-neutral-700"
                      }`}
                    >
                      {plan.monthly === 0 ? "Start Free" : `Choose ${plan.name}`}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 03 Compare All Features ── */}
        <section className="max-w-5xl mx-auto pb-24">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 mb-8">Compare all features</h2>
          <div className="overflow-x-auto rounded-2xl border border-neutral-100">
            <table className="w-full min-w-[640px] text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-neutral-400 w-[40%]">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.slug} className={`px-4 py-4 text-xs font-semibold text-center ${p.highlight ? "bg-neutral-900 text-white" : "text-neutral-700"}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE.map((row, i) => {
                  if (row.type === "category") {
                    return (
                      <tr key={i} className="bg-neutral-50">
                        <td colSpan={5} className="px-5 py-3 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                          {row.label}
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={i} className="border-t border-neutral-50 hover:bg-neutral-50/50">
                      <td className="px-5 py-3.5 text-sm text-neutral-600">{row.feature}</td>
                      <td className="px-4 py-3.5 text-center"><Cell value={row.free} /></td>
                      <td className="px-4 py-3.5 text-center"><Cell value={row.starter} /></td>
                      <td className="px-4 py-3.5 text-center bg-neutral-900/[0.02]"><Cell value={row.pro} /></td>
                      <td className="px-4 py-3.5 text-center"><Cell value={row.business} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 04 One-Event Passes ── */}
        <section className="max-w-5xl mx-auto pb-24">
          <div className="bg-neutral-50 rounded-3xl p-10">
            <p className="text-xs font-semibold tracking-widest text-brand mb-3">ONE EVENT?</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
              Don&apos;t run events every month?
            </h2>
            <p className="text-neutral-500 mb-10">
              Pay only for your next event. No subscription required.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {EVENT_PASSES.map((pass) => (
                <div key={pass.name} className="bg-white border border-neutral-100 rounded-2xl p-6 flex flex-col">
                  <p className="text-xs font-semibold tracking-widest text-neutral-400 mb-1">{pass.name.toUpperCase()}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-semibold">₹{pass.price}</span>
                    <span className="text-xs text-neutral-400">one-time</span>
                  </div>
                  <p className="text-sm font-medium text-neutral-700 mb-5">{pass.regs}</p>
                  <ul className="flex flex-col gap-2 flex-1 mb-7">
                    {pass.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                        <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-700 transition-colors">
                    Create One Event
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 05 Paid Ticketing Teaser ── */}
        <section className="max-w-5xl mx-auto pb-24">
          <div className="border border-neutral-100 rounded-3xl p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand mb-2">PAID EVENTS</p>
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900 mb-2">
                Sell tickets. Issue QR passes. Check attendees in.
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-lg">
                Accept online payments and issue QR tickets automatically — early bird, general, VIP, student, and more.
                Ticketing pricing coming soon.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 border border-neutral-900 text-neutral-900 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap"
            >
              Contact Sales →
            </Link>
          </div>
        </section>

        {/* ── 06 Campus ── */}
        <section className="max-w-5xl mx-auto pb-24">
          <div className="bg-neutral-900 rounded-3xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-brand-200 mb-3">URPASS CAMPUS</p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-4 leading-snug">
                One platform for every event across your campus.
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Departments, clubs, and organizers — all under one institution account. Registration, QR check-in, and analytics across every event, every semester.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors"
                >
                  Talk to URPASS →
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-sm font-semibold text-white mb-1">Campus Starter</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-semibold text-white">from ₹9,999</span>
                  <span className="text-xs text-white/40">/year</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">For colleges with multiple departments and clubs running regular events.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-sm font-semibold text-white mb-1">University / Institution</p>
                <p className="text-2xl font-semibold text-white mb-2">Custom</p>
                <p className="text-xs text-white/40 leading-relaxed">Dedicated support, custom SLAs, volume pricing, and onboarding help.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 FAQ ── */}
        <section className="max-w-2xl mx-auto pb-28">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 mb-6">Frequently asked questions</h2>
          <div className="bg-white border border-neutral-100 rounded-2xl px-6">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-neutral-400">
            Still have questions?{" "}
            <Link href="/contact" className="text-brand hover:underline underline-offset-2">
              Contact us
            </Link>
          </p>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">© 2026 URPASS · urpass.space</p>
          <div className="flex items-center gap-6">
            {[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }, { label: "Terms", href: "/terms" }].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ── 30-Day Free Trial Modal ── */}
      {trialModal && (
        <TrialConfirmationModal
          isOpen={Boolean(trialModal)}
          onClose={() => setTrialModal(null)}
          planSlug={trialModal.planSlug}
          planName={trialModal.planName}
          userEmail={userEmail}
          userName={userName}
        />
      )}

    </div>
  );
}
