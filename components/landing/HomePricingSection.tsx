"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
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

  function handleMarketChange(target: "IN" | "GB") {
    setCountry(target);
    persistCountryPreference(target);
  }

  const isUk = country === "GB";

  const plans = isUk
    ? [
        {
          name: "Free",
          price: "£0",
          period: "forever",
          recommended: false,
          cta: "Start free",
          href: "/signup",
          subtext: "Free forever",
          features: [
            "2 events/month",
            "100 registrations/month",
            "QR passes & check-in",
            "Attendee approval",
            "Basic analytics",
          ],
        },
        {
          name: "Starter",
          price: "£15",
          period: "/month +VAT",
          recommended: false,
          cta: "Try Starter Free",
          href: "/signup?plan=starter&trial=true&country=GB",
          subtext: "30 days £0 · No credit card required",
          features: [
            "10 events/month",
            "500 registrations/month",
            "2 organizers",
            "CSV import & export",
            "Standard analytics",
          ],
        },
        {
          name: "Pro",
          price: "£35",
          period: "/month +VAT",
          recommended: true,
          cta: "Try Pro Free",
          href: "/signup?plan=pro&trial=true&country=GB",
          subtext: "30 days £0 · No credit card required",
          features: [
            "Unlimited events",
            "2,500 registrations/month",
            "5 organizers",
            "Custom pass design",
            "Advanced analytics",
            "Priority support",
          ],
        },
        {
          name: "Business",
          price: "£79",
          period: "/month +VAT",
          recommended: false,
          cta: "Try Business Free",
          href: "/signup?plan=business&trial=true&country=GB",
          subtext: "30 days £0 · No credit card required",
          features: [
            "Unlimited events",
            "10,000 registrations/month",
            "15 organizers",
            "Custom domain",
            "API & webhooks",
          ],
        },
      ]
    : [
        {
          name: "Free",
          price: "₹0",
          period: "forever",
          recommended: false,
          cta: "Start free",
          href: "/signup",
          subtext: "Free forever",
          features: [
            "2 events/month",
            "100 registrations/month",
            "QR passes & check-in",
            "Attendee approval",
            "Basic analytics",
          ],
        },
        {
          name: "Starter",
          price: "₹499",
          period: "/month +GST",
          recommended: false,
          cta: "Try Starter Free",
          href: "/signup?plan=starter&trial=true",
          subtext: "30 days ₹0 · AutoPay required",
          features: [
            "10 events/month",
            "500 registrations/month",
            "2 organizers",
            "CSV import & export",
            "Standard analytics",
          ],
        },
        {
          name: "Pro",
          price: "₹999",
          period: "/month +GST",
          recommended: true,
          cta: "Try Pro Free",
          href: "/signup?plan=pro&trial=true",
          subtext: "30 days ₹0 · AutoPay required",
          features: [
            "Unlimited events",
            "2,500 registrations/month",
            "5 organizers",
            "Custom pass design",
            "Advanced analytics",
            "Priority support",
          ],
        },
        {
          name: "Business",
          price: "₹2,499",
          period: "/month +GST",
          recommended: false,
          cta: "Try Business Free",
          href: "/signup?plan=business&trial=true",
          subtext: "30 days ₹0 · AutoPay required",
          features: [
            "Unlimited events",
            "10,000 registrations/month",
            "15 organizers",
            "Custom domain",
            "API & webhooks",
          ],
        },
      ];

  const founderPriceTitle = isUk
    ? "URPASS Founder Lifetime Access — £249 One-Time"
    : "URPASS Founder Lifetime Access — ₹19,999 One-Time";

  const founderDealHref = isUk ? "/founder-lifetime-deal?country=GB" : "/founder-lifetime-deal";

  const subheaderText = isUk
    ? "Direct UK activation · No credit card required · Instant access · One free trial per account"
    : "30 days ₹0 · AutoPay required · Cancel anytime · Instant access";

  return (
    <section id="pricing" className="py-14 sm:py-28 px-4 sm:px-8 bg-neutral-50">
      <div className="max-w-5xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3">
              YOUR FIRST 30 DAYS ARE FREE
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
              Choose any plan. Get your first 30 days free.
            </h2>
            <p className="mt-2 sm:mt-3 text-neutral-500 text-xs sm:text-sm">
              {subheaderText}
            </p>

          </div>
        </AnimateIn>

        {/* ── Founder Lifetime Plan Callout Banner ── */}
        <AnimateIn delay={60} from="up">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 text-white shadow-sm mb-8 sm:mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 border border-neutral-700 text-neutral-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FOUNDER DEAL · LIMITED TO 20 ACCOUNTS ONLY</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {founderPriceTitle}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
                  Permanent access to all currently available URPASS features for a one-time payment. Zero renewal fees forever. Valid for the lifetime of URPASS platform.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Link
                  href={founderDealHref}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs sm:text-sm transition-colors text-center whitespace-nowrap shadow-sm"
                >
                  <span>View Lifetime Deal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {plans.map((plan, i) => (
            <AnimateIn key={plan.name} delay={i * 90} from="up">
              <div
                className={`relative rounded-2xl flex flex-col p-5 sm:p-7 h-full ${
                  plan.recommended
                    ? "bg-neutral-900 text-white shadow-xl"
                    : "bg-white border border-neutral-100"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest bg-brand text-white px-3 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                )}
                <p
                  className={`text-xs font-semibold tracking-widest mb-3 sm:mb-4 ${
                    plan.recommended ? "text-white/50" : "text-neutral-400"
                  }`}
                >
                  {plan.name.toUpperCase()}
                </p>
                <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-semibold">{plan.price}</span>
                  <span
                    className={`text-xs sm:text-sm ${
                      plan.recommended ? "text-white/40" : "text-neutral-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="flex flex-col gap-2 sm:gap-2.5 flex-1 mb-6 sm:mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <svg
                        className={`w-4 h-4 shrink-0 ${
                          plan.recommended ? "text-brand-200" : "text-brand"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={plan.recommended ? "text-white/70" : "text-neutral-600"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-1.5">
                  <Link
                    href={plan.href}
                    className={`w-full text-center py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-colors ${
                      plan.recommended
                        ? "bg-white text-neutral-900 hover:bg-neutral-100"
                        : "bg-neutral-900 text-white hover:bg-neutral-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                  {plan.subtext && (
                    <p
                      className={`text-[10px] text-center ${
                        plan.recommended ? "text-white/40" : "text-neutral-400"
                      }`}
                    >
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
  );
}
