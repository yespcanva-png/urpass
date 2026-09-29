"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import CheckoutButton from "./CheckoutButton";
import SwitchPlanButton from "./SwitchPlanButton";
import EventPassCheckoutModal from "./EventPassCheckoutModal";
import TrialConfirmationModal from "./TrialConfirmationModal";
import FounderCheckoutCta from "./FounderCheckoutCta";
import { activateUkPlan } from "@/app/actions/billing";
import { activateUkEventPass } from "@/app/actions/event-passes";

const UK_PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
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
    slug: "free",
    name: "Free",
    priceMonthly: 0,
    annualTotal: 0,
    features: [
      "2 events/month",
      "100 registrations/month",
      "1 organizer seat",
      "QR passes & check-in",
      "Attendee approval",
      "Basic analytics",
    ],
  },
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

type PlanSlug = (typeof PLANS)[number]["slug"];
const PLAN_ORDER: Record<PlanSlug, number> = { free: 0, starter: 1, pro: 2, business: 3 };
const PLAN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  free: Sparkles,
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
  trialUsed?: boolean;
  country?: "IN" | "GB";
}

export default function PlanGrid({
  currentPlanSlug,
  currentPlanIndex,
  userEmail,
  userName,
  trialUsed = false,
  country = "IN",
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"subscription" | "one-event" | "lifetime" | "all">("subscription");
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [activatingSlug, setActivatingSlug] = useState<string | null>(null);
  const [trialModal, setTrialModal] = useState<{ planSlug: string; planName: string } | null>(null);
  const [passModal, setPassModal] = useState<{
    passType: string;
    passName: string;
    priceRupees: number;
    registrationLimit: number;
  } | null>(null);
  const [activatingPass, setActivatingPass] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: "error" | "success"; message: string } | null>(null);

  return (
    <div>
      {/* ── Sub-Navigation Tabs ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
            {tab === "subscription"
              ? "Recurring Memberships · 4 Tiers"
              : tab === "one-event"
              ? "Pay As You Go · Single Event Passes"
              : tab === "lifetime"
              ? "Permanent License · Founder Deal"
              : "All Plans & Passes"}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            Select Your Plan or Pass
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200/80 rounded-lg p-1 shrink-0 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setTab("subscription")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === "subscription"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Subscriptions
          </button>
          <button
            type="button"
            onClick={() => setTab("one-event")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === "one-event"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Single Events
          </button>
          <button
            type="button"
            onClick={() => setTab("lifetime")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              tab === "lifetime"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lifetime Deal</span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-800">
              {country === "GB" ? "£249" : "₹19,999"}
            </span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium shadow-xs ${
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
            className="p-1 rounded-md hover:bg-black/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Subscription section ─────────────────────────────── */}
      {(tab === "subscription" || tab === "all") && (
        <section className={tab === "all" ? "mb-10" : ""}>
          {/* Corporate 30-Day Free Trial Notice */}
          {!trialUsed && (
            <div className="mb-6 rounded-xl p-4 bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-800 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-blue-950">
                      30-Day Free Trial Included
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wide">
                      {country === "GB" ? "No Card Needed" : "AutoPay Protected"}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700/90 mt-0.5">
                    {country === "GB"
                      ? "Activate Starter, Pro, or Business with 30 days £0 trial. Cancel anytime."
                      : "Explore Starter, Pro, or Business for 30 days free. Cancel anytime before your first billing."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Billing cycle toggle & section title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                Recurring Membership
              </p>
              <h3 className="text-base font-bold tracking-tight text-slate-900">
                Monthly &amp; Annual Subscriptions
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200/80 rounded-lg p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCycle("monthly")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  cycle === "monthly"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCycle("annual")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                  cycle === "annual"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Annual
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Clean corporate plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p) => {
              const isCurrent = p.slug === currentPlanSlug;
              const isMostPopular = p.slug === "pro" && !isCurrent;
              const planIndex = PLAN_ORDER[p.slug as PlanSlug] ?? 0;
              const isUpgrade = !isCurrent && planIndex > currentPlanIndex;
              const Icon = PLAN_ICONS[p.slug] ?? Sparkles;
              const ukPlan = UK_PLAN_PRICES[p.slug] ?? { monthly: 35, annual: 300 };

              const displayPrice =
                p.priceMonthly === 0
                  ? "Free"
                  : country === "GB"
                  ? cycle === "annual"
                    ? `£${ukPlan.annual}`
                    : `£${ukPlan.monthly}`
                  : cycle === "annual"
                  ? `₹${p.annualTotal.toLocaleString("en-IN")}`
                  : `₹${p.priceMonthly.toLocaleString("en-IN")}`;

              const displayPeriod =
                p.priceMonthly === 0 ? "" : cycle === "annual" ? "/yr" : "/mo";

              const monthlyEquiv =
                cycle === "annual" && (country === "GB" ? ukPlan.annual > 0 : p.annualTotal > 0)
                  ? country === "GB"
                    ? `£${Math.round(ukPlan.annual / 12)}/mo`
                    : `₹${Math.round(p.annualTotal / 12).toLocaleString("en-IN")}/mo`
                  : null;

              return (
                <div
                  key={p.slug}
                  className={`relative rounded-xl p-5 flex flex-col gap-4 transition-all bg-white shadow-xs ${
                    isCurrent
                      ? "border-2 border-emerald-600 ring-2 ring-emerald-500/10"
                      : isMostPopular
                      ? "border-2 border-slate-900"
                      : "border border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-2.5 left-4 text-[9px] font-bold tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                      Active Plan
                    </span>
                  )}
                  {isMostPopular && (
                    <span className="absolute -top-2.5 left-4 text-[9px] font-bold tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-slate-100 border border-slate-200/60 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold tracking-wider uppercase mb-1 text-slate-500">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight tabular-nums text-slate-900">
                        {displayPrice}
                      </span>
                      {displayPeriod && (
                        <span className="text-xs text-slate-500">{displayPeriod}</span>
                      )}
                    </div>
                    {monthlyEquiv && (
                      <p className="text-[11px] mt-0.5 tabular-nums text-slate-500">
                        {monthlyEquiv} equivalent
                      </p>
                    )}
                  </div>

                  <ul className="flex flex-col gap-2 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 border border-slate-200/60">
                          <Check className="w-2.5 h-2.5 text-slate-700" />
                        </span>
                        <span className="text-xs leading-relaxed text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    {isCurrent ? (
                      <div className="w-full text-center text-xs font-semibold py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                        Current Plan
                      </div>
                    ) : !trialUsed && p.priceMonthly > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTrialModal({ planSlug: p.slug, planName: p.name })}
                          className="w-full py-2.5 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
                        >
                          Start 30-Day Free Trial
                        </button>
                        <p className="text-[10px] text-center text-slate-500 font-medium">
                          {country === "GB"
                            ? "£0 for 30 days · Cancel anytime"
                            : "₹0 for 30 days · Cancel anytime"}
                        </p>
                      </div>
                    ) : p.priceMonthly > 0 ? (
                      country === "GB" ? (
                        <button
                          type="button"
                          onClick={async () => {
                            setActivatingSlug(p.slug);
                            setActionNotice(null);
                            try {
                              const res = await activateUkPlan(p.slug, cycle);
                              if (res?.error) {
                                setActionNotice({ type: "error", message: res.error });
                              } else {
                                router.push(`/billing?upgraded=true&plan=${encodeURIComponent(p.name)}`);
                                router.refresh();
                              }
                            } catch (err) {
                              setActionNotice({
                                type: "error",
                                message: err instanceof Error ? err.message : "Failed to activate plan.",
                              });
                            } finally {
                              setActivatingSlug(null);
                            }
                          }}
                          disabled={activatingSlug === p.slug}
                          className="w-full py-2.5 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
                        >
                          {activatingSlug === p.slug
                            ? "Activating..."
                            : isUpgrade
                            ? `Upgrade to ${p.name}`
                            : `Switch to ${p.name}`}
                        </button>
                      ) : (
                        <CheckoutButton
                          planSlug={p.slug}
                          planName={p.name}
                          billingCycle={cycle}
                          userEmail={userEmail}
                          userName={userName}
                          className="w-full py-2.5 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
                        >
                          {isUpgrade ? `Upgrade to ${p.name}` : `Switch to ${p.name}`}
                        </CheckoutButton>
                      )
                    ) : (
                      <SwitchPlanButton
                        planSlug={p.slug}
                        planName={p.name}
                        className="w-full py-2.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                      />
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
        <section className={tab === "all" ? "mt-12 pt-10 border-t border-slate-200/80" : ""}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 text-[10px] font-bold tracking-wider uppercase text-slate-700 mb-1">
                Pay As You Go
              </div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">Single Event Passes</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Don&apos;t run events every month? Pay only for your next event with zero recurring renewal fees. Passes remain attached to your account until used.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 self-start sm:self-auto shrink-0">
              3 Single-Event Tiers
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
                  className="relative rounded-xl p-5 flex flex-col gap-4 bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all"
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-slate-100 border border-slate-200/60 text-slate-700">
                      <p.Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-bold tracking-wider uppercase mb-1 text-slate-500">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                        {displayOneTimePrice}
                      </span>
                      <span className="text-xs text-slate-500">/event</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">{displayTaxSub}</p>
                  </div>

                  <p className="text-xs font-medium text-slate-600 -mt-2">{p.bestFor}</p>

                  <ul className="flex flex-col gap-2 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-slate-100 border border-slate-200/60">
                          <Check className="w-2.5 h-2.5 text-slate-700" />
                        </span>
                        <span className="text-xs leading-relaxed text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={async () => {
                      if (country === "GB") {
                        setActivatingPass(p.slug);
                        setActionNotice(null);
                        try {
                          const res = await activateUkEventPass(p.slug);
                          if (res?.error) {
                            setActionNotice({ type: "error", message: res.error });
                          } else {
                            router.push(`/billing?pass=purchased&plan=${encodeURIComponent(p.name)}`);
                            router.refresh();
                          }
                        } catch (err) {
                          setActionNotice({
                            type: "error",
                            message: err instanceof Error ? err.message : "Failed to activate event pass.",
                          });
                        } finally {
                          setActivatingPass(null);
                        }
                      } else {
                        setPassModal({
                          passType: p.slug,
                          passName: p.name,
                          priceRupees: p.price,
                          registrationLimit: p.registrationLimit,
                        });
                      }
                    }}
                    disabled={activatingPass === p.slug}
                    className="w-full py-2.5 text-xs font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
                  >
                    {activatingPass === p.slug ? "Activating..." : `Buy ${p.name}`}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>One-time payment · No recurring renewal charges · Attach to any event after purchase</span>
          </div>
        </section>
      )}

      {/* ── Lifetime License section ────────────────────────── */}
      {(tab === "lifetime" || tab === "all") && (
        <section className={tab === "all" ? "mt-10 pt-8 border-t border-slate-200/80" : ""}>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-bold tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Permanent Founder License</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  URPASS Founder Lifetime Access — {country === "GB" ? "£249" : "₹19,999"} One-Time
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Permanent operational access to all core URPASS capabilities with zero recurring renewal fees forever (Term 2125). Includes unlimited events, unlimited registrations, and 50 organizer seats.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Unlimited Events Forever
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Unlimited Registrations
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    50 Team Organizer Seats
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Custom Pass Design &amp; Branding
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    API, Webhooks &amp; Custom Domain
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
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
          userEmail={userEmail}
          userName={userName}
        />
      )}

      {/* 30-Day Free Trial Modal */}
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
