"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Minus, ChevronDown, ShieldCheck, ArrowRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import TrialConfirmationModal from "@/components/billing/TrialConfirmationModal";
import FounderSpotCounter from "@/components/billing/FounderSpotCounter";
import { detectCountryClient, persistCountryPreference } from "@/lib/country-config";

type Cycle = "monthly" | "annual";

// ─── Plan definitions ──────────────────────────────────────────────────────────

const PLANS = [
  {
    slug: "starter",
    name: "Starter",
    desc: "For individual organizers and small event teams.",
    monthly: 499,
    introMonthly: 29,
    annual: 4990,
    ukMonthly: 15,
    ukAnnual: 120,
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
    introMonthly: 29,
    annual: 9990,
    ukMonthly: 35,
    ukAnnual: 300,
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
    introMonthly: 29,
    annual: 24990,
    ukMonthly: 79,
    ukAnnual: 699,
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
  | { type: "row"; feature: string; starter: CellValue; pro: CellValue; business: CellValue };

const TABLE: TableRow[] = [
  { type: "category", label: "Usage" },
  { type: "row", feature: "Events / month",          starter: "10",    pro: "Unlimited", business: "Unlimited" },
  { type: "row", feature: "Registrations / month",  starter: "500",   pro: "2,500",     business: "10,000" },
  { type: "row", feature: "Organizer seats",         starter: "2",     pro: "5",         business: "15" },

  { type: "category", label: "Core" },
  { type: "row", feature: "Registration forms",          starter: true, pro: true, business: true },
  { type: "row", feature: "Digital QR passes",           starter: true, pro: true, business: true },
  { type: "row", feature: "QR check-in",                 starter: true, pro: true, business: true },
  { type: "row", feature: "Duplicate scan prevention",   starter: true, pro: true, business: true },
  { type: "row", feature: "Attendee approval",           starter: true, pro: true, business: true },
  { type: "row", feature: "Attendance tracking",         starter: true, pro: true, business: true },

  { type: "category", label: "Data" },
  { type: "row", feature: "Email notifications",         starter: true,       pro: true,        business: true },
  { type: "row", feature: "CSV attendee import",         starter: true,       pro: true,        business: true },
  { type: "row", feature: "CSV export",                  starter: true,       pro: true,        business: true },
  { type: "row", feature: "Analytics",                   starter: "Standard", pro: "Advanced",  business: "Advanced" },

  { type: "category", label: "Customisation" },
  { type: "row", feature: "Custom registration fields",  starter: "10 fields", pro: "Unlimited", business: "Unlimited" },
  { type: "row", feature: "Custom pass design",          starter: false,       pro: true,        business: true },
  { type: "row", feature: "Remove URPASS branding",      starter: false,       pro: true,        business: true },

  { type: "category", label: "Scale" },
  { type: "row", feature: "Team permissions",            starter: false, pro: "Basic",  business: "Advanced" },
  { type: "row", feature: "Enterprise SSO (SAML 2.0 & OIDC)", starter: false, pro: false, business: true },
  { type: "row", feature: "Custom domain",               starter: false, pro: false,    business: true },
  { type: "row", feature: "API access",                  starter: false, pro: false,    business: true },
  { type: "row", feature: "Webhooks",                    starter: false, pro: false,    business: true },
  { type: "row", feature: "Support",                     starter: "Standard", pro: "Priority", business: "Priority" },
];

// ─── One-event passes ──────────────────────────────────────────────────────────

const EVENT_PASSES = [
  {
    name: "Event",
    price: 299,
    ukPrice: 5,
    regs: "250 registrations",
    features: ["1 event", "QR passes & check-in", "Attendee approval", "CSV export", "Basic analytics"],
  },
  {
    name: "Event Plus",
    price: 599,
    ukPrice: 10,
    regs: "1,000 registrations",
    features: ["1 event", "QR passes & check-in", "Attendee approval", "CSV export", "Analytics", "Custom pass design"],
  },
  {
    name: "Large Event",
    price: 999,
    ukPrice: 19,
    regs: "2,500 registrations",
    features: ["1 event", "QR passes & check-in", "Attendee approval", "CSV export", "Analytics", "Custom pass design", "Remove branding"],
  },
];

// ─── FAQ ───────────────────────────────────────────────────────────────────────

function getFaqs(country: "IN" | "GB") {
  return [
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
      a:
        country === "GB"
          ? "Yes. Event passes (£5 / £10 / £19) let you run one event without a monthly subscription. You pick the tier based on expected registrations."
          : "Yes. Event passes (₹299 / ₹599 / ₹999) let you run one event without a monthly subscription. You pick the tier based on expected registrations.",
    },
    {
      q: "Can I sell paid tickets?",
      a:
        country === "GB"
          ? "Yes. URPASS supports paid ticket sales with zero per-ticket platform commissions, direct payouts, and full UK GDPR compliance."
          : "Yes. Connect Razorpay to sell paid tickets with direct payouts to your Indian bank account via UPI, cards, and net banking — with zero per-ticket platform commissions from URPASS.",
    },
    {
      q: "What happens to my data if I cancel?",
      a: "Your event and attendee data is retained for 30 days after cancellation, giving you time to export everything. After 30 days, data is permanently deleted.",
    },
  ];
}

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
  initialCountry?: "IN" | "GB";
}

export default function PricingContent({
  isAuthenticated = false,
  trialUsed = false,
  userEmail = "",
  userName = "",
  initialCountry = "IN",
}: Props = {}) {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [country, setCountry] = useState<"IN" | "GB">(initialCountry);
  const [trialModal, setTrialModal] = useState<{ planSlug: string; planName: string } | null>(null);

  useEffect(() => {
    const detected = detectCountryClient();
    if (detected) {
      setCountry(detected);
    }

    const onCountryChanged = (e: Event) => {
      const custom = e as CustomEvent<{ country: "IN" | "GB" }>;
      if (custom.detail?.country) {
        setCountry(custom.detail.country);
      }
    };
    window.addEventListener("urpass_country_changed", onCountryChanged);
    return () => window.removeEventListener("urpass_country_changed", onCountryChanged);
  }, []);

  function handleCountryChange(newCountry: "IN" | "GB") {
    setCountry(newCountry);
    persistCountryPreference(newCountry);
  }

  function displayPrice(plan: typeof PLANS[0]) {
    if (country === "GB") {
      if (cycle === "monthly") return { price: `£${plan.ukMonthly}`, sub: "/month +VAT", intro: null };
      const perMonth = Math.round(plan.ukAnnual / 12);
      return {
        price: `£${perMonth}`,
        sub: `/month · £${plan.ukAnnual}/year`,
        intro: null,
      };
    }
    if (cycle === "monthly") {
      return {
        price: `₹${plan.introMonthly ?? 29}`,
        sub: `/month for 2 mos · then ₹${plan.monthly.toLocaleString("en-IN")}/mo +GST`,
        intro: "₹29 INTRO OFFER (2 MONTHS)",
      };
    }
    const perMonth = Math.round(plan.annual / 12);
    return {
      price: `₹${perMonth.toLocaleString("en-IN")}`,
      sub: `/month · ₹${plan.annual.toLocaleString("en-IN")}/year +GST`,
      intro: null,
    };
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ── */}
      <header className="border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-base text-neutral-900">URPASS</Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Corporate Regional Market Switcher */}
          <div className="inline-flex items-center p-0.5 rounded-xl border border-neutral-200/90 bg-neutral-100/80 shadow-2xs">
            <span className="pl-2 pr-1 text-neutral-400 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </span>
            <button
              type="button"
              onClick={() => handleCountryChange("IN")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1",
                country !== "GB"
                  ? "bg-white text-neutral-900 font-bold shadow-xs border border-neutral-200/70"
                  : "text-neutral-500 hover:text-neutral-800"
              )}
              title="India Edition (INR · ₹)"
              aria-label="Switch to India (INR ₹)"
            >
              <span>INR</span>
              <span className={country !== "GB" ? "text-neutral-500 font-normal" : "text-neutral-400 font-normal"}>₹</span>
            </button>
            <button
              type="button"
              onClick={() => handleCountryChange("GB")}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1",
                country === "GB"
                  ? "bg-white text-neutral-900 font-bold shadow-xs border border-neutral-200/70"
                  : "text-neutral-500 hover:text-neutral-800"
              )}
              title="UK Edition (GBP · £)"
              aria-label="Switch to UK (GBP £)"
            >
              <span>GBP</span>
              <span className={country === "GB" ? "text-neutral-500 font-normal" : "text-neutral-400 font-normal"}>£</span>
            </button>
          </div>

          {isAuthenticated ? (
            <Link href="/dashboard" className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login?from=pricing&next=/billing" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Log in</Link>
              <Link href="/signup?from=pricing&next=/billing" className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors">Get started</Link>
            </>
          )}
        </div>
      </header>

      <main className="px-5 sm:px-8">

        {/* ── 01 Hero + Toggle ── */}
        <section className="max-w-5xl mx-auto text-center pt-20 pb-14">

          {!trialUsed ? (
            <>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold tracking-wider uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                {country === "GB" ? "FLEXIBLE EVENT PLANS" : "INTRODUCTORY OFFER · ₹29/MONTH"}
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-4">
                {country === "GB"
                  ? "SIMPLE PRICING FOR EVERY EVENT"
                  : "GET STARTED FOR ₹29/MONTH"}
              </h1>
              <p className="text-neutral-600 max-w-2xl mx-auto mb-3 text-base sm:text-lg">
                {country === "GB"
                  ? "Choose Starter, Pro, or Business. Unlock powerful QR check-in, bespoke pass design, and analytics."
                  : "Subscribe to Starter, Pro, or Business at ₹29/month for your first 2 months. Autopay required · Cancel renewal anytime."}
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 mb-8 bg-neutral-100 px-3.5 py-1.5 rounded-full flex-wrap justify-center">
                <span>
                  {country === "GB"
                    ? "£15 / £35 / £79 monthly · Direct UK activation"
                    : "₹29/month for first 2 months · Then regular monthly price · Autopay required"}
                </span>
                <span>·</span>
                <span>Instant full access</span>
                <span>·</span>
                <span>Cancel renewal anytime</span>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold tracking-widest text-brand mb-4">PRICING</p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
                Standard Subscription Pricing
              </h1>
              <p className="text-neutral-500 mb-10 text-base">
                Upgrade or renew your plan. Choose Starter, Pro, or Business.
              </p>
            </>
          )}

          {/* Toggles Container */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Monthly / Annual billing cycle toggle */}
            <div className="inline-flex items-center bg-neutral-100 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => setCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${cycle === "monthly" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCycle("annual")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${cycle === "annual" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                Annual
                <span className="text-[10px] font-bold tracking-wider text-brand bg-brand-50 px-2 py-0.5 rounded-full">
                  SAVE 2 MO
                </span>
              </button>
            </div>

            {/* Corporate Market / Currency toggle */}
            <div className="inline-flex items-center bg-neutral-100 rounded-xl p-1 gap-1 border border-neutral-200/60">
              <span className="pl-2 pr-1 text-neutral-400 flex items-center">
                <Globe className="w-3.5 h-3.5" />
              </span>
              <button
                type="button"
                onClick={() => handleCountryChange("IN")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${country === "IN" ? "bg-white text-neutral-900 font-semibold shadow-xs" : "text-neutral-500 hover:text-neutral-700"}`}
                title="View India pricing in INR (₹) with UPI & Razorpay"
              >
                <span>India · INR (₹)</span>
              </button>
              <button
                type="button"
                onClick={() => handleCountryChange("GB")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${country === "GB" ? "bg-white text-neutral-900 font-semibold shadow-xs" : "text-neutral-500 hover:text-neutral-700"}`}
                title="View UK pricing in GBP (£) with Razorpay & 0% fee"
              >
                <span>United Kingdom · GBP (£)</span>
              </button>
            </div>
          </div>
          {cycle === "annual" && (
            <div className="mt-3 text-xs text-neutral-500 flex items-center justify-center gap-2 flex-wrap">
              <span>Save 2 months with annual billing.</span>
              <span className="text-neutral-300">·</span>
              <span>Looking for university or multi-department plans?</span>
              <Link
                href="/campus-event-management-platform"
                className="font-semibold text-emerald-600 hover:text-emerald-700 underline"
              >
                View Campus Licensing (From ₹9,999/year) &rarr;
              </Link>
            </div>
          )}
        </section>

        {/* ── Founder Lifetime Plan Callout Banner ── */}
        <section className="max-w-5xl mx-auto mb-12">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 text-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 border border-neutral-700 text-neutral-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FOUNDER DEAL · LIMITED TO 20 ACCOUNTS ONLY</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {country === "GB"
                    ? "URPASS Founder Lifetime Access — £249 One-Time"
                    : "URPASS Founder Lifetime Access — ₹19,999 One-Time"}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                  Get permanent access to all currently available URPASS features for a one-time payment. Create event landing pages on urpass.space and lock in all features for lifetime (Term 2125).
                </p>

                <div className="pt-2 max-w-lg">
                  <FounderSpotCounter
                    claimedCount={14}
                    totalCount={20}
                    variant="compact"
                    showFeaturesLock={true}
                  />
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Link
                  href={country === "GB" ? "/founder-lifetime-deal?country=GB" : "/founder-lifetime-deal"}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs sm:text-sm transition-colors text-center whitespace-nowrap shadow-sm"
                >
                  <span>View Lifetime Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 Plan Cards ── */}
        <section className="max-w-5xl mx-auto pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
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
                  {cycle === "monthly" && country !== "GB" && (
                    <span className="mb-2 inline-block text-[10px] font-extrabold tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full w-fit">
                      ₹29/MO · 2 MONTHS INTRO OFFER
                    </span>
                  )}
                  <p className={`text-xs font-semibold tracking-widest mb-1 ${plan.highlight ? "text-white/50" : "text-neutral-400"}`}>
                    {plan.name.toUpperCase()}
                  </p>
                  <p className={`text-xs mb-5 leading-relaxed ${plan.highlight ? "text-white/40" : "text-neutral-400"}`}>
                    {plan.desc}
                  </p>
                  <div className="flex flex-col mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                      <span className={`text-xs font-medium ${plan.highlight ? "text-white/60" : "text-neutral-500"}`}>/month</span>
                    </div>
                    {cycle === "monthly" && country !== "GB" ? (
                      <div className="mt-1">
                        <p className={`text-xs font-semibold ${plan.highlight ? "text-emerald-400" : "text-emerald-700"}`}>
                          For your first 2 months
                        </p>
                        <p className={`text-xs ${plan.highlight ? "text-white/60" : "text-neutral-500"}`}>
                          Then ₹{plan.monthly.toLocaleString("en-IN")}/month +GST
                        </p>
                      </div>
                    ) : (
                      <span className={`text-xs mt-1 ${plan.highlight ? "text-white/60" : "text-neutral-500"}`}>{sub}</span>
                    )}
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

                  <div className="flex flex-col gap-1.5">
                    <Link
                      href={
                        isAuthenticated
                          ? `/billing${country === "GB" ? "?country=GB" : ""}`
                          : `/signup?from=pricing&plan=${plan.slug}${country === "GB" ? "&country=GB" : ""}&next=/billing`
                      }
                      className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                        plan.highlight
                          ? "bg-white text-neutral-900 hover:bg-neutral-100"
                          : "bg-neutral-900 text-white hover:bg-neutral-800"
                      }`}
                    >
                      {cycle === "monthly" && country !== "GB"
                        ? "Get Started for ₹29"
                        : `Choose ${plan.name}`}
                    </Link>
                    <p className={`text-[10px] text-center ${plan.highlight ? "text-white/50" : "text-neutral-500"}`}>
                      {country === "GB"
                        ? "UK Direct Activation · Cancel renewal anytime"
                        : cycle === "monthly"
                        ? "Autopay required · Cancel renewal anytime"
                        : "Billed annually · Cancel renewal anytime"}
                    </p>
                  </div>
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
                        <td colSpan={4} className="px-5 py-3 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                          {row.label}
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={i} className="border-t border-neutral-50 hover:bg-neutral-50/50">
                      <td className="px-5 py-3.5 text-sm text-neutral-600">{row.feature}</td>
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
                    <span className="text-3xl font-semibold">
                      {country === "GB" ? `£${pass.ukPrice}` : `₹${pass.price}`}
                    </span>
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
                  <Link href={isAuthenticated ? "/billing" : "/signup?from=pricing&next=/billing"} className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-700 transition-colors">
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
                  <span className="text-2xl font-semibold text-white">
                    {country === "GB" ? "from £149" : "from ₹9,999"}
                  </span>
                  <span className="text-xs text-white/40">/year</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                  {country === "GB"
                    ? "For universities, students' unions, and student societies running regular campus events."
                    : "For colleges with multiple departments and clubs running regular events."}
                </p>
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
            {getFaqs(country).map((faq) => (
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
          cycle={cycle}
          country={country}
          userEmail={userEmail}
          userName={userName}
        />
      )}
    </div>
  );
}
