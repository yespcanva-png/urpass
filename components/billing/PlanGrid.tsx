"use client";

import { useState } from "react";
import {
  Check, Sparkles, Zap, Crown, TrendingUp,
  CalendarCheck, Zap as ZapIcon, Star,
} from "lucide-react";
import CheckoutButton from "./CheckoutButton";
import SwitchPlanButton from "./SwitchPlanButton";
import EventPassCheckoutModal from "./EventPassCheckoutModal";

// ── Subscription plans ────────────────────────────────────────
const PLANS = [
  {
    slug: "free", name: "Free",
    priceMonthly: 0, annualTotal: 0,
    features: ["2 events/month","100 registrations/month","1 organizer","QR passes & check-in","Attendee approval","Basic analytics"],
  },
  {
    slug: "starter", name: "Starter",
    priceMonthly: 499, annualTotal: 4990,
    features: ["10 events/month","500 registrations/month","2 organizer seats","CSV import & export","10 custom fields","Standard analytics"],
  },
  {
    slug: "pro", name: "Pro",
    priceMonthly: 999, annualTotal: 9990,
    features: ["Unlimited events","2,500 registrations/month","5 organizer seats","Custom pass design & branding","Advanced analytics","Priority support"],
  },
  {
    slug: "business", name: "Business",
    priceMonthly: 2499, annualTotal: 24990,
    features: ["Unlimited events","10,000 registrations/month","15 organizer seats","Custom domain, API & webhooks","Advanced permissions","Cross-event analytics"],
  },
] as const;

type PlanSlug = typeof PLANS[number]["slug"];
const PLAN_ORDER: Record<PlanSlug, number> = { free: 0, starter: 1, pro: 2, business: 3 };
const PLAN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  free: Sparkles, starter: Zap, pro: Crown, business: TrendingUp,
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
}

export default function PlanGrid({ currentPlanSlug, currentPlanIndex, userEmail, userName }: Props) {
  const [tab, setTab]     = useState<"subscription" | "one-event">("subscription");
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly");
  const [passModal, setPassModal] = useState<{
    passType: string; passName: string; priceRupees: number; registrationLimit: number;
  } | null>(null);

  return (
    <div>
      {/* ── Top-level tab ────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
          {tab === "subscription" ? `Available plans · ${PLANS.length}` : "One-Event passes · 3"}
        </p>

        <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setTab("subscription")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "subscription"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => setTab("one-event")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              tab === "one-event"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            One-Event
          </button>
        </div>
      </div>

      {/* ── Subscription tab ─────────────────────────────────── */}
      {tab === "subscription" && (
        <>
          {/* Billing cycle toggle */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
              <button
                onClick={() => setCycle("monthly")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  cycle === "monthly"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle("annual")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  cycle === "annual"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Annual
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  2 months free
                </span>
              </button>
            </div>
          </div>

          {/* Plan cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((p) => {
              const isCurrent    = p.slug === currentPlanSlug;
              const isMostPopular = p.slug === "pro" && !isCurrent;
              const planIndex    = PLAN_ORDER[p.slug as PlanSlug] ?? 0;
              const isUpgrade    = !isCurrent && planIndex > currentPlanIndex;
              const Icon         = PLAN_ICONS[p.slug] ?? Sparkles;

              const displayPrice =
                p.priceMonthly === 0 ? "Free"
                : cycle === "annual"  ? `₹${p.annualTotal.toLocaleString("en-IN")}`
                :                       `₹${p.priceMonthly.toLocaleString("en-IN")}`;

              const displayPeriod =
                p.priceMonthly === 0 ? ""
                : cycle === "annual"  ? "/yr"
                :                       "/mo";

              const monthlyEquiv =
                cycle === "annual" && p.annualTotal > 0
                  ? `₹${Math.round(p.annualTotal / 12).toLocaleString("en-IN")}/mo`
                  : null;

              return (
                <div
                  key={p.slug}
                  className={`relative rounded-2xl p-5 flex flex-col gap-4 transition-all ${
                    isCurrent
                      ? "bg-neutral-900 text-white shadow-xl"
                      : isMostPopular
                      ? "bg-white border-2 border-brand shadow-sm"
                      : "bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-sm"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-3 left-4 text-[10px] font-bold tracking-widest bg-brand text-white px-3 py-1 rounded-full uppercase">
                      Your plan
                    </span>
                  )}
                  {isMostPopular && (
                    <span className="absolute -top-3 left-4 text-[10px] font-bold tracking-widest bg-brand text-white px-3 py-1 rounded-full uppercase">
                      Most popular
                    </span>
                  )}

                  <div>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${isCurrent ? "bg-white/10" : "bg-brand-50 border border-brand-100"}`}>
                      <Icon className={`w-4 h-4 ${isCurrent ? "text-white" : "text-brand"}`} />
                    </div>
                    <p className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${isCurrent ? "text-white/40" : "text-neutral-400"}`}>
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold tracking-tight ${isCurrent ? "text-white" : "text-neutral-900"}`}>
                        {displayPrice}
                      </span>
                      {displayPeriod && (
                        <span className={`text-xs ${isCurrent ? "text-white/40" : "text-neutral-400"}`}>
                          {displayPeriod}
                        </span>
                      )}
                    </div>
                    {monthlyEquiv && (
                      <p className={`text-[11px] mt-0.5 ${isCurrent ? "text-white/30" : "text-neutral-400"}`}>
                        {monthlyEquiv} equivalent
                      </p>
                    )}
                  </div>

                  <ul className="flex flex-col gap-2 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isCurrent ? "bg-white/10" : "bg-brand-50 border border-brand-100"}`}>
                          <Check className={`w-2 h-2 ${isCurrent ? "text-white/70" : "text-brand"}`} />
                        </span>
                        <span className={`text-xs leading-relaxed ${isCurrent ? "text-white/65" : "text-neutral-600"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div>
                    {isCurrent ? (
                      <div className="w-full text-center text-xs font-semibold py-2.5 rounded-xl border border-white/10 text-white/30">
                        Active plan
                      </div>
                    ) : p.priceMonthly > 0 ? (
                      <CheckoutButton
                        planSlug={p.slug}
                        planName={p.name}
                        billingCycle={cycle}
                        userEmail={userEmail}
                        userName={userName}
                        className="w-full py-2.5 text-sm font-semibold rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{ background: "#6D28D9" }}
                      >
                        {isUpgrade ? `Upgrade to ${p.name}` : `Switch to ${p.name}`}
                      </CheckoutButton>
                    ) : (
                      <SwitchPlanButton
                        planSlug={p.slug}
                        planName={p.name}
                        className="w-full py-2.5 text-xs font-medium rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── One-Event tab ─────────────────────────────────────── */}
      {tab === "one-event" && (
        <>
          <p className="text-xs text-neutral-500 mb-4">
            Buy a pass for a single event — no subscription needed. The pass stays on your account until you attach it to an event.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EVENT_PASSES.map((p) => {
              const gst   = Math.round(p.price * 18) / 100;
              const total = Math.round((p.price + gst) * 100) / 100;

              return (
                <div
                  key={p.slug}
                  className="relative rounded-2xl p-5 flex flex-col gap-4 bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3 bg-brand-50 border border-brand-100">
                      <p.Icon className="w-4 h-4 text-brand" />
                    </div>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1 text-neutral-400">
                      {p.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight text-neutral-900">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-400">/event</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} incl. GST
                    </p>
                  </div>

                  <p className="text-[11px] font-medium text-neutral-500 -mt-2">{p.bestFor}</p>

                  <ul className="flex flex-col gap-2 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-brand-50 border border-brand-100">
                          <Check className="w-2 h-2 text-brand" />
                        </span>
                        <span className="text-xs leading-relaxed text-neutral-600">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() =>
                      setPassModal({
                        passType:          p.slug,
                        passName:          p.name,
                        priceRupees:       p.price,
                        registrationLimit: p.registrationLimit,
                      })
                    }
                    className="w-full py-2.5 text-sm font-semibold rounded-xl text-white hover:opacity-90 transition-opacity"
                    style={{ background: "#6D28D9" }}
                  >
                    Buy {p.name}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-neutral-400 mt-4 text-center">
            One-time payment · No recurring charges · Attach to any event after purchase
          </p>
        </>
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
    </div>
  );
}
