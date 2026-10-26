"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight, Zap, Building2, Sparkles, CreditCard, Clock } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import { detectCountryClient, persistCountryPreference } from "@/lib/country-config";

interface Props {
  initialCountry?: "IN" | "GB";
}

export default function HomePricingSection({ initialCountry = "IN" }: Props) {
  const [country, setCountry] = useState<"IN" | "GB">(initialCountry);

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

  const isUk = country === "GB";

  const plans = isUk
    ? [
        {
          id: "free",
          name: "Free",
          target: "Run your first real event with zero software cost",
          price: "£0",
          period: "forever",
          renewalNotice: "Free forever · No credit card required",
          recommended: false,
          cta: "Start Free",
          href: "/signup?from=home-pricing&plan=free",
          features: [
            "1 active event",
            "100 registrations per month",
            "1 organizer team seat",
            "Basic QR pass & camera scanner",
            "Standard registration forms",
            "UrPass pass watermark",
          ],
        },
        {
          id: "starter",
          name: "Starter",
          target: "For small workshops, meetups & single sessions",
          price: "£15",
          period: "/month +VAT",
          renewalNotice: "UK direct activation · Cancel anytime",
          recommended: false,
          cta: "Choose Starter",
          href: "/signup?from=home-pricing&plan=starter&country=GB&next=/billing",
          features: [
            "3 active events",
            "500 registrations per month",
            "2 organizer team seats",
            "Custom registration form fields",
            "Instant digital QR passes",
            "CSV bulk attendee import & export",
            "Standard attendance analytics",
          ],
        },
        {
          id: "pro",
          name: "Pro",
          target: "For college fests, hackathons & conferences",
          price: "£35",
          period: "/month +VAT",
          renewalNotice: "UK direct activation · Cancel anytime",
          recommended: true,
          cta: "Choose Pro",
          href: "/signup?from=home-pricing&plan=pro&country=GB&next=/billing",
          features: [
            "10 active events",
            "2,500 registrations per month",
            "5 organizer team seats",
            "Session attendance tracking",
            "Custom branded pass design & logo",
            "Multi-gate scanner synchronization",
            "Advanced attendance analytics",
            "Priority support",
          ],
        },
        {
          id: "business",
          name: "Business",
          target: "For multi-track summits, agencies & universities",
          price: "£79",
          period: "/month +VAT",
          renewalNotice: "UK direct activation · Cancel anytime",
          recommended: false,
          cta: "Choose Business",
          href: "/signup?from=home-pricing&plan=business&country=GB&next=/billing",
          features: [
            "Unlimited active events*",
            "10,000 registrations per month",
            "15 organizer team seats",
            "Developer API & webhooks",
            "Session attendance tracking",
            "Role-based staff permissions",
            "Cross-event analytics",
          ],
        },
      ]
    : [
        {
          id: "free",
          name: "Free",
          target: "Run your first real event with zero software cost",
          price: "₹0",
          period: "forever",
          renewalNotice: "Free forever · No credit card required",
          recommended: false,
          cta: "Start Free",
          href: "/signup?from=home-pricing&plan=free",
          features: [
            "1 active event",
            "100 registrations per month",
            "1 organizer team seat",
            "Basic QR pass & camera scanner",
            "Standard registration forms",
            "UrPass pass watermark",
          ],
        },
        {
          id: "starter",
          name: "Starter",
          target: "For small workshops, meetups & single sessions",
          price: "₹499",
          period: "/month",
          renewalNotice: "Flat SaaS pricing +18% GST · Cancel anytime",
          recommended: false,
          cta: "Choose Starter",
          href: "/signup?from=home-pricing&plan=starter&next=/billing",
          features: [
            "3 active events",
            "500 registrations per month",
            "2 organizer team seats",
            "Custom registration form fields",
            "Instant digital QR passes",
            "CSV bulk attendee import & export",
            "Standard attendance analytics",
          ],
        },
        {
          id: "pro",
          name: "Pro",
          target: "For college fests, hackathons & conferences",
          price: "₹999",
          period: "/month",
          renewalNotice: "Flat SaaS pricing +18% GST · Cancel anytime",
          recommended: true,
          cta: "Choose Pro",
          href: "/signup?from=home-pricing&plan=pro&next=/billing",
          features: [
            "10 active events",
            "2,500 registrations per month",
            "5 organizer team seats",
            "Session attendance tracking",
            "Custom branded pass design & logo",
            "Multi-gate scanner synchronization",
            "Advanced attendance analytics",
            "Priority support",
          ],
        },
        {
          id: "business",
          name: "Business",
          target: "For multi-track summits, agencies & universities",
          price: "₹2,499",
          period: "/month",
          renewalNotice: "Flat SaaS pricing +18% GST · Cancel anytime",
          recommended: false,
          cta: "Choose Business",
          href: "/signup?from=home-pricing&plan=business&next=/billing",
          features: [
            "Unlimited active events*",
            "10,000 registrations per month",
            "15 organizer team seats",
            "Developer API & webhooks",
            "Session attendance tracking",
            "Role-based staff permissions",
            "Cross-event analytics",
          ],
        },
      ];

  const founderPriceTitle = isUk
    ? "UrPass Founder Lifetime Access — £249 One-Time"
    : "UrPass Founder Lifetime Access — ₹19,999 One-Time";

  const founderDealHref = isUk ? "/founder-lifetime-deal?country=GB" : "/founder-lifetime-deal";

  return (
    <section id="pricing" className="py-16 sm:py-28 px-4 sm:px-8 bg-neutral-50/70 border-t border-neutral-100 relative">
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12 sm:mb-16">
            {/* Interactive Currency Switcher */}
            <div className="inline-flex items-center p-1 rounded-xl bg-neutral-200/80 border border-neutral-300/80 mb-4 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setCountry("IN");
                  persistCountryPreference("IN");
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  country === "IN"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                🇮🇳 India (₹)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCountry("GB");
                  persistCountryPreference("GB");
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  country === "GB"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                🇬🇧 UK (£)
              </button>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950">
              Predictable pricing for modern event teams
            </h2>
            <p className="mt-3.5 text-neutral-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {isUk
                ? "Start free with 1 event and 100 registrations, or choose flat-rate monthly subscriptions with 0% platform fee on ticket sales."
                : "Start free with 1 active event and 100 registrations. Upgrade to Starter, Pro, or Business as your events and team scale."}
            </p>

            {/* Corporate Value Strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-neutral-600 font-medium">
              <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3 py-1 rounded-full shadow-2xs">
                <CreditCard className="w-3.5 h-3.5 text-brand" />
                0% UrPass Platform Fee (standard gateway charges apply)
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3 py-1 rounded-full shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-brand" />
                Sub-Second Smartphone QR Scan
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-200/80 px-3 py-1 rounded-full shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                Direct UPI / Bank Payouts
              </span>
            </div>
          </div>
        </AnimateIn>

        {/* ── Founder Lifetime Plan Callout Banner ── */}
        <AnimateIn delay={60} from="up">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 p-6 sm:p-7 text-white shadow-xl mb-10 sm:mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>FOUNDER DEAL · 7 OF 20 SLOTS REMAINING</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  {founderPriceTitle}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                  Permanent access to all currently available UrPass Pro and Business features for a one-time payment. Zero renewal fees forever. Valid for the lifetime of the UrPass platform.
                </p>
              </div>

              <div className="shrink-0 flex items-center">
                <Link
                  href={founderDealHref}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs sm:text-sm transition-colors text-center whitespace-nowrap shadow-sm"
                >
                  <span>View Lifetime Deal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* ── 4 Corporate Pricing Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-10 sm:mb-12">
          {plans.map((plan, i) => (
            <AnimateIn key={plan.name} delay={i * 80} from="up">
              <div
                className={`relative rounded-3xl flex flex-col justify-between p-6 sm:p-8 h-full transition-all ${
                  plan.recommended
                    ? "bg-neutral-950 text-white border-2 border-violet-500 shadow-2xl shadow-violet-950/20"
                    : "bg-white text-neutral-900 border border-neutral-200/90 hover:border-neutral-300 shadow-xs hover:shadow-md"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold tracking-widest bg-violet-600 text-white px-3.5 py-1 rounded-full shadow-md uppercase">
                    MOST POPULAR
                  </span>
                )}

                <div>
                  <div className="mb-4">
                    <p
                      className={`text-xs font-bold uppercase tracking-wider ${
                        plan.recommended ? "text-violet-300" : "text-neutral-500"
                      }`}
                    >
                      {plan.name}
                    </p>
                    <p
                      className={`text-xs mt-1 leading-snug min-h-[34px] ${
                        plan.recommended ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      {plan.target}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        plan.recommended ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <div
                    className={`rounded-lg px-2.5 py-1.5 text-[11px] mb-6 font-medium ${
                      plan.recommended
                        ? "bg-neutral-900 border border-neutral-800 text-violet-300"
                        : "bg-neutral-100 border border-neutral-200/80 text-neutral-600"
                    }`}
                  >
                    {plan.renewalNotice}
                  </div>

                  <div
                    className={`border-t pt-5 mb-6 ${
                      plan.recommended ? "border-neutral-800/80" : "border-neutral-100"
                    }`}
                  >
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-wider mb-3.5 ${
                        plan.recommended ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      Plan Inclusions:
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              plan.recommended ? "text-violet-400" : "text-brand"
                            }`}
                          />
                          <span
                            className={plan.recommended ? "text-neutral-300" : "text-neutral-700"}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href={plan.href}
                    className={`w-full text-center py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
                      plan.recommended
                        ? "bg-violet-600 text-white hover:bg-violet-500 shadow-md"
                        : "bg-neutral-950 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  <p
                    className={`text-[10px] text-center ${
                      plan.recommended ? "text-neutral-500" : "text-neutral-400"
                    }`}
                  >
                    {plan.id === "free"
                      ? "No credit card required · Free forever"
                      : "Instant account activation · Cancel renewal anytime"}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* ── Footnote & Value Comparisons ── */}
        <div className="mb-10 text-center space-y-3 max-w-3xl mx-auto">
          <p className="text-xs text-neutral-500">
            <span className="font-semibold text-neutral-700">*Unlimited active events:</span> Business tier includes unlimited active events subject to our Fair Usage Policy (up to 50 concurrent active events). Need more concurrency? Contact enterprise.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs">
            <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
              ⚡ Annual billing available: Save 20% on Starter, Pro, and Business plans
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-medium shadow-2xs">
              💡 Why UrPass vs. Eventbrite / Townscript? 0% ticket commission (vs. 5–10% per ticket fee)
            </span>
          </div>
        </div>

        {/* ── Enterprise / Custom Inquiry Card ── */}
        <AnimateIn delay={120} from="up">
          <div className="rounded-2xl bg-white border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-800">
                <Building2 className="w-5 h-5 text-neutral-700" />
              </div>
              <div>
                <p className="font-semibold text-sm sm:text-base text-neutral-900">
                  Universities, Large Summits &amp; Enterprise Requirements
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                  Need custom attendee limits, multi-campus licensing, tailored ERP integration, or GST billing?
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/contact?subject=Enterprise%20Inquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 transition-colors"
              >
                <span>Talk to Enterprise Sales</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
