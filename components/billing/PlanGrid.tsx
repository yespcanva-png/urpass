"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  TrendingUp,
  CalendarCheck,
  Zap as ZapIcon,
  Star,
  ShieldCheck,
  AlertCircle,
  X,
  ArrowRight,
  Download,
  Receipt,
} from "lucide-react";
import CheckoutButton from "./CheckoutButton";
import EventPassCheckoutModal from "./EventPassCheckoutModal";
import FounderCheckoutCta from "./FounderCheckoutCta";

const UK_PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  starter: { monthly: 15, annual: 120 },
  pro: { monthly: 35, annual: 300 },
  business: { monthly: 79, annual: 699 },
};

const UK_EVENT_PASS_PRICES: Record<string, number> = {
  event: 5,
  event_plus: 10,
  event_pro: 19,
};

// ── Subscription plans ────────────────────────────────────────
const PLANS = [
  {
    slug: "starter",
    name: "Starter",
    priceMonthly: 499,
    annualTotal: 4990,
    features: [
      "10 events/month",
      "500 registrations/month",
      "2 organizer seats",
      "CSV import & export",
      "10 custom fields",
      "Standard analytics",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    priceMonthly: 999,
    annualTotal: 9990,
    features: [
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
    priceMonthly: 2499,
    annualTotal: 24990,
    features: [
      "Unlimited events",
      "10,000 registrations/month",
      "15 organizer seats",
      "Custom domain, API & webhooks",
      "Advanced permissions",
      "Cross-event analytics",
    ],
  },
] as const;

const PLAN_ORDER: Record<string, number> = { free: 0, starter: 1, pro: 2, business: 3 };
const PLAN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  starter: Zap,
  pro: Crown,
  business: TrendingUp,
};

// ── One-event passes ──────────────────────────────────────────
const EVENT_PASSES = [
  {
    slug: "event",
    name: "Event",
    price: 299,
    registrationLimit: 250,
    bestFor: "Small events & meetups",
    Icon: CalendarCheck,
    features: [
      "250 registrations",
      "QR passes & check-in",
      "Attendee approval",
      "Basic analytics",
      "Valid for 1 event",
    ],
  },
  {
    slug: "event_plus",
    name: "Event Plus",
    price: 599,
    registrationLimit: 1000,
    bestFor: "College events & workshops",
    Icon: ZapIcon,
    features: [
      "1,000 registrations",
      "QR passes & check-in",
      "CSV export",
      "Standard analytics",
      "Valid for 1 event",
    ],
  },
  {
    slug: "event_pro",
    name: "Event Pro",
    price: 999,
    registrationLimit: 2500,
    bestFor: "Large conferences",
    Icon: Star,
    features: [
      "2,500 registrations",
      "QR passes & check-in",
      "CSV import & export",
      "Advanced analytics",
      "Valid for 1 event",
    ],
  },
] as const;

interface Props {
  currentPlanSlug: string;
  currentPlanIndex: number;
  userEmail: string;
  userName: string;
  userPhone?: string;
  trialUsed?: boolean;
  country?: "IN" | "GB";
  invoices?: Array<{
    id: string;
    invoice_number: string;
    total_amount: number | string | null;
    invoice_date: string;
  }>;
}

export default function PlanGrid({
  currentPlanSlug,
  currentPlanIndex,
  userEmail,
  userName,
  userPhone,
  trialUsed = false,
  country = "IN",
  invoices = [],
}: Props) {
  const [tab, setTab] = useState<"subscription" | "one-event" | "lifetime" | "all">("subscription");
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [passModal, setPassModal] = useState<{
    passType: string;
    passName: string;
    priceRupees: number;
    registrationLimit: number;
  } | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: "error" | "success"; message: string } | null>(null);

  const isNiveditha = (userEmail || "").toLowerCase() === "niveditha@client.urpass.space";

  if (isNiveditha) {
    const isPlanActive = currentPlanSlug === "managed_enterprise";
    const latestInvoice = invoices && invoices.length > 0 ? invoices[0] : null;

    return (
      <div className="space-y-6">
        {/* Clean Corporate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-[11px] font-semibold text-neutral-700 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              <span>Enterprise Agreement · niveditha@client.urpass.space</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Managed Enterprise Agreement
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Dedicated operational support, custom branding capabilities, and unmetered attendee throughput.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 shadow-xs">
              <span className={`w-2 h-2 rounded-full ${isPlanActive ? "bg-emerald-500" : "bg-neutral-400"}`} />
              <span>{isPlanActive ? "Active Subscription" : "Pre-Approved Quotation"}</span>
            </span>
          </div>
        </div>

        {/* Tax Invoice Banner (when payment completed) */}
        {latestInvoice && (
          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900">
                    Official GST Tax Invoice · {latestInvoice.invoice_number}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    Paid
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Amount: ₹7,080.00 (₹6,000.00 + 18% GST) · Issued on {new Date(latestInvoice.invoice_date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <a
                href={`/api/invoices/${latestInvoice.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 shadow-xs transition-colors"
              >
                View Invoice
              </a>
              <a
                href={`/api/invoices/${latestInvoice.id}/pdf?download=1`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-800 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        )}

        {/* Corporate Agreement Specification & Pricing Card */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Commercial Quotation & Financial Breakdown */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    <span>Commercial Summary</span>
                    <span>·</span>
                    <span>Monthly Agreement</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                    Managed Enterprise Agreement
                  </h3>
                </div>

                {/* Line Item Financial Breakdown */}
                <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Standard Enterprise Rate</span>
                    <span className="text-neutral-400 line-through tabular-nums font-medium">₹7,000.00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium">Agreed Commercial Discount</span>
                    <span className="text-emerald-700 font-semibold tabular-nums">-₹1,000.00</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                    <span className="text-neutral-700 font-medium">Taxable Base Amount</span>
                    <span className="text-neutral-900 font-bold tabular-nums">₹6,000.00</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-600">Goods &amp; Services Tax (GST 18%)</span>
                      <span className="text-[10px] text-neutral-400 font-mono">SAC 997331</span>
                    </div>
                    <span className="text-neutral-900 font-medium tabular-nums">₹1,080.00</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-300 flex items-baseline justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Total Net Payable</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Recurring Monthly · Cancel anytime</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
                        ₹7,080.00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corporate CTA */}
                <div className="space-y-2 pt-1">
                  {isPlanActive ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Agreement Active · Managed Support &amp; Custom Branding Enabled</span>
                      </div>
                      {latestInvoice && (
                        <a
                          href={`/api/invoices/${latestInvoice.id}/pdf?download=1`}
                          className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-neutral-900 text-xs font-semibold text-white hover:bg-neutral-800 shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Tax Invoice</span>
                        </a>
                      )}
                    </div>
                  ) : (
                    <CheckoutButton
                      planSlug="managed_enterprise"
                      planName="Managed Enterprise Plan"
                      billingCycle="monthly"
                      userEmail={userEmail}
                      userName={userName}
                      userPhone={userPhone}
                      currency="INR"
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Proceed to Payment — ₹7,080.00</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </CheckoutButton>
                  )}
                  <p className="text-[11px] text-neutral-500 leading-normal">
                    Payment is processed securely via Razorpay. An official B2B GST tax invoice with full SAC 997331 attribution is generated automatically with a one-click download button.
                  </p>
                </div>
              </div>

              {/* Right Column: Corporate Entitlements Table */}
              <div className="lg:col-span-6 bg-neutral-50/60 rounded-xl border border-neutral-200/80 p-5 sm:p-6 space-y-4">
                <div className="border-b border-neutral-200/80 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Agreement Scope &amp; Deliverables
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Authorized features and SLA allocations for this account.
                  </p>
                </div>

                <div className="space-y-3.5 divide-y divide-neutral-200/60 text-xs">
                  <div className="pt-2 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                      <span className="font-semibold text-neutral-900">Dedicated Managed Support</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 pl-3.5 mt-0.5 leading-relaxed">
                      Assigned 1-on-1 event account manager, bespoke registration form and pass template engineering, plus priority standby during live event days.
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                      <span className="font-semibold text-neutral-900">Custom Branding (UrPass Branding Removed)</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 pl-3.5 mt-0.5 leading-relaxed">
                      Complete removal of UrPass watermarks and logos across attendee registration pages, digital passes, automated confirmations, and check-in portals.
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                      <span className="font-semibold text-neutral-900">Unmetered Event &amp; Attendee Capacity</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 pl-3.5 mt-0.5 leading-relaxed">
                      Unlimited events and registrations with high-throughput QR ticket verification and multi-device scanner synchronization.
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                      <span className="font-semibold text-neutral-900">Custom Domain &amp; Bespoke Pass Architecture</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 pl-3.5 mt-0.5 leading-relaxed">
                      Vanity subdomain routing, institutional color themes, and tailored sponsor/delegation badge configurations.
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                      <span className="font-semibold text-neutral-900">B2B GST Tax Invoicing with 1-Click PDF Download</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 pl-3.5 mt-0.5 leading-relaxed">
                      Official tax invoices with SAC code 997331 generated automatically with an instant download button available in your dashboard.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Sub-Navigation Tabs ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
            {tab === "subscription"
              ? "Recurring Memberships · Starter, Pro, Business"
              : tab === "one-event"
              ? "Pay As You Go · Single Event Passes"
              : tab === "lifetime"
              ? "Permanent License · Founder Deal"
              : "All Plans & Passes"}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 mt-0.5">
            Select Your Plan or Pass
          </h2>
        </div>

        <div className="inline-flex items-center gap-1 bg-neutral-100/90 border border-neutral-200/80 rounded-xl p-1 shrink-0 self-start sm:self-auto flex-wrap shadow-xs">
          <button
            type="button"
            onClick={() => setTab("subscription")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "subscription"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Subscriptions
          </button>
          <button
            type="button"
            onClick={() => setTab("one-event")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "one-event"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Single Events
          </button>
          <button
            type="button"
            onClick={() => setTab("lifetime")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              tab === "lifetime"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand" />
            <span>Lifetime Deal</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60">
              {country === "GB" ? "£249" : "₹19,999"}
            </span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-medium shadow-xs ${
            actionNotice.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionNotice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="p-1 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Subscription section ─────────────────────────────── */}
      {(tab === "subscription" || tab === "all") && (
        <section className={tab === "all" ? "mb-10" : ""}>
          {/* Introductory paid offer notice */}
          {!trialUsed && country !== "GB" && (
            <div className="mb-6 rounded-2xl p-4 bg-brand-50/60 border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-neutral-800 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-100/70 border border-brand-200/80 flex items-center justify-center text-brand shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-neutral-900">
                      ₹29 Monthly Introductory Offer
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-100 text-brand-700 uppercase tracking-wide">
                      New monthly subscriptions
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Starter, Pro, or Business starts at ₹29/month for the first 2 paid billing cycles. Autopay is required and regular renewal pricing is shown before activation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing cycle toggle & section title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                Recurring Membership
              </p>
              <h3 className="text-base font-bold tracking-tight text-neutral-900">
                Monthly &amp; Annual Subscriptions
              </h3>
            </div>
            <div className="inline-flex items-center gap-1 bg-neutral-100/90 border border-neutral-200/80 rounded-xl p-1 self-start sm:self-auto shadow-xs">
              <button
                type="button"
                onClick={() => setCycle("monthly")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  cycle === "monthly"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCycle("annual")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  cycle === "annual"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Annual
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-brand-50 text-brand border border-brand-100">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Clean corporate plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLANS.map((p) => {
              const isCurrent = p.slug === currentPlanSlug;
              const isMostPopular = p.slug === "pro" && !isCurrent;
              const planIndex = PLAN_ORDER[p.slug] ?? 0;
              const isUpgrade = !isCurrent && planIndex > currentPlanIndex;
              const Icon = PLAN_ICONS[p.slug] ?? Sparkles;
              const ukPlan = UK_PLAN_PRICES[p.slug] ?? { monthly: 35, annual: 300 };

              const isIntroEligible = !trialUsed && country !== "GB" && cycle === "monthly" && ["starter", "pro", "business"].includes(p.slug);

              const displayPrice =
                isIntroEligible
                  ? "₹29"
                  : country === "GB"
                  ? cycle === "annual"
                    ? `£${ukPlan.annual}`
                    : `£${ukPlan.monthly}`
                  : cycle === "annual"
                  ? `₹${p.annualTotal.toLocaleString("en-IN")}`
                  : `₹${p.priceMonthly.toLocaleString("en-IN")}`;

              const displayPeriod =
                isIntroEligible
                  ? "/mo (2 mos)"
                  : cycle === "annual"
                  ? "/yr"
                  : "/mo";

              const monthlyEquiv =
                cycle === "annual" && (country === "GB" ? ukPlan.annual > 0 : p.annualTotal > 0)
                  ? country === "GB"
                    ? `£${Math.round(ukPlan.annual / 12)}/mo`
                    : `₹${Math.round(p.annualTotal / 12).toLocaleString("en-IN")}/mo`
                  : null;

              return (
                <div
                  key={p.slug}
                  className={`relative rounded-2xl p-6 flex flex-col gap-4 transition-all bg-white ${
                    isCurrent
                      ? "border-2 border-emerald-600 ring-2 ring-emerald-500/10 shadow-sm"
                      : isMostPopular
                      ? "border-2 border-brand ring-2 ring-brand/10 shadow-md"
                      : "border border-neutral-200/80 hover:border-neutral-300 shadow-sm"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-2.5 left-4 text-[9px] font-bold tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                      Active Plan
                    </span>
                  )}
                  {isMostPopular && (
                    <span className="absolute -top-2.5 left-4 text-[9px] font-bold tracking-wider bg-brand text-white px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${
                        p.slug === "pro"
                          ? "bg-brand-50 border-brand-100 text-brand"
                          : p.slug === "starter"
                          ? "bg-purple-50 border-purple-100 text-purple-600"
                          : p.slug === "business"
                          ? "bg-sky-50 border-sky-100 text-sky-600"
                          : "bg-neutral-100 border-neutral-200 text-neutral-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold tracking-wider uppercase mb-1 text-neutral-400">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight tabular-nums text-neutral-900">
                        {displayPrice}
                      </span>
                      {displayPeriod && (
                        <span className="text-xs text-neutral-400">{displayPeriod}</span>
                      )}
                    </div>
                    {isIntroEligible && (
                      <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                        For your first 2 months · Then ₹{p.priceMonthly.toLocaleString("en-IN")}/mo +GST
                      </p>
                    )}
                    {monthlyEquiv && (
                      <p className="text-[11px] mt-0.5 tabular-nums text-neutral-400">
                        {monthlyEquiv} equivalent
                      </p>
                    )}
                  </div>

                  <ul className="flex flex-col gap-2 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-brand-50 border border-brand-100/60">
                          <Check className="w-2.5 h-2.5 text-brand" />
                        </span>
                        <span className="text-xs leading-relaxed text-neutral-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    {isCurrent ? (
                      <div className="w-full text-center text-xs font-semibold py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-400">
                        Current Plan
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <CheckoutButton
                          planSlug={p.slug}
                          planName={p.name}
                          billingCycle={cycle}
                          userEmail={userEmail}
                          userName={userName}
                          userPhone={userPhone}
                          currency={country === "GB" ? "GBP" : "INR"}
                          introOfferEligible={isIntroEligible}
                          className={`w-full py-2.5 text-xs font-semibold rounded-xl text-white shadow-xs transition-all hover:opacity-90 cursor-pointer ${
                            isMostPopular
                              ? "bg-brand hover:bg-brand-600"
                              : "bg-neutral-900 hover:bg-neutral-800"
                          }`}
                          style={
                            isMostPopular
                              ? { background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }
                              : undefined
                          }
                        >
                          {isIntroEligible
                            ? "Get Started for ₹29"
                            : isUpgrade
                            ? `Upgrade to ${p.name}`
                            : `Choose ${p.name}`}
                        </CheckoutButton>
                        <p className="text-[10px] text-center text-neutral-400 font-medium">
                          {isIntroEligible
                            ? "Autopay required · Cancel renewal anytime"
                            : country === "GB"
                            ? "UK Direct Activation · Cancel renewal anytime"
                            : cycle === "annual"
                            ? "Billed annually · Cancel renewal anytime"
                            : "Autopay required · Cancel renewal anytime"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Single Event Passes section ────────────────────── */}
      {(tab === "one-event" || tab === "all") && (
        <section className={tab === "all" ? "mt-12 pt-10 border-t border-neutral-200/80" : ""}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-50 border border-brand-100 text-[10px] font-bold tracking-wider uppercase text-brand mb-1">
                Pay As You Go
              </div>
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">Single Event Passes</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Don&apos;t run events every month? Pay only for your next event with zero recurring renewal fees. Passes remain attached to your account until used.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200 self-start sm:self-auto shrink-0">
              3 Single-Event Passes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EVENT_PASSES.map((p) => {
              const gst = Math.round(p.price * 18) / 100;
              const total = Math.round((p.price + gst) * 100) / 100;
              const ukPassPrice = UK_EVENT_PASS_PRICES[p.slug] ?? 10;
              const displayOneTimePrice = country === "GB" ? `£${ukPassPrice}` : `₹${p.price.toLocaleString("en-IN")}`;
              const displayTaxSub =
                country === "GB"
                  ? `£${Math.round(ukPassPrice * 1.2)} incl. VAT`
                  : `₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} incl. GST`;

              return (
                <div
                  key={p.slug}
                  className="relative rounded-2xl p-6 flex flex-col gap-4 bg-white border border-neutral-200/80 hover:border-neutral-300 shadow-sm transition-all"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 bg-brand-50 border border-brand-100/60 text-brand">
                      <p.Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold tracking-wider uppercase mb-1 text-neutral-400">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight text-neutral-900 tabular-nums">
                        {displayOneTimePrice}
                      </span>
                      <span className="text-xs text-neutral-400">/event</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5 tabular-nums">{displayTaxSub}</p>
                  </div>

                  <p className="text-xs font-medium text-neutral-600 -mt-2">{p.bestFor}</p>

                  <ul className="flex flex-col gap-2 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-brand-50 border border-brand-100/60">
                          <Check className="w-2.5 h-2.5 text-brand" />
                        </span>
                        <span className="text-xs leading-relaxed text-neutral-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      const passPrice = country === "GB" ? (UK_EVENT_PASS_PRICES[p.slug] ?? 5) : p.price;
                      setPassModal({
                        passType: p.slug,
                        passName: p.name,
                        priceRupees: passPrice,
                        registrationLimit: p.registrationLimit,
                      });
                    }}
                    className="w-full py-2.5 text-xs font-semibold rounded-xl text-white bg-neutral-900 hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    Buy {p.name}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-neutral-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>One-time payment · No recurring renewal charges · Attach to any event after purchase</span>
          </div>
        </section>
      )}

      {/* ── Lifetime License section ────────────────────────── */}
      {(tab === "lifetime" || tab === "all") && (
        <section className={tab === "all" ? "mt-10 pt-8 border-t border-neutral-200/80" : ""}>
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Permanent Founder License</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  URPASS Founder Lifetime Access — {country === "GB" ? "£249" : "₹19,999"} One-Time
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Permanent operational access to all core URPASS capabilities with zero recurring renewal fees forever (Term 2125). Includes unlimited events, unlimited registrations, and 50 organizer seats.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                    Unlimited Events Forever
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                    Unlimited Registrations
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                    50 Team Organizer Seats
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                    Custom Pass Design &amp; Branding
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                    API, Webhooks &amp; Custom Domain
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand shrink-0" />
                    Zero Renewal Fees
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <FounderCheckoutCta
                  isLoggedIn={true}
                  userEmail={userEmail}
                  userName={userName}
                  variant="billing"
                />
                <Link
                  href="/founder-lifetime-deal"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-semibold text-xs transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Event Pass Checkout Modal */}
      {passModal && (
        <EventPassCheckoutModal
          isOpen
          onClose={() => setPassModal(null)}
          passType={passModal.passType}
          passName={passModal.passName}
          priceRupees={passModal.priceRupees}
          registrationLimit={passModal.registrationLimit}
          currency={country === "GB" ? "GBP" : "INR"}
          userEmail={userEmail}
          userName={userName}
        />
      )}
    </div>
  );
}
