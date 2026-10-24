"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Minus,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  Zap,
  ShieldAlert,
  Headphones,
  Percent,
  Receipt,
  CheckCircle2,
  Globe,
  Sparkles,
  CreditCard,
  Building2,
  QrCode,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SELF_SERVICE_PLANS,
  REMOTE_MANAGED_PACKAGES,
  REMOTE_MANAGED_SERVICE_BOUNDARIES,
  ServiceModel,
  BillingCycle,
} from "@/lib/billing/catalog";
import { calculateGst, formatInr } from "@/lib/billing/tax";
import { persistCountryPreference, detectCountryClient } from "@/lib/country-config";
import LeadCaptureModal from "@/components/marketing/LeadCaptureModal";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface Props {
  isAuthenticated?: boolean;
  userEmail?: string;
  initialCountry?: "IN" | "GB";
}

// UK GBP price catalog mapping
const GBP_PRICES: Record<
  string,
  { monthly: number; annual: number }
> = {
  free: { monthly: 0, annual: 0 },
  starter: { monthly: 15, annual: 120 },
  pro: { monthly: 35, annual: 300 },
  business: { monthly: 79, annual: 699 },
};

const GBP_MANAGED_PRICES: Record<string, number> = {
  essential: 49,
  pro: 129,
  premium: 249,
  enterprise: 0,
};

export default function PricingContent({
  isAuthenticated = false,
  userEmail = "",
  initialCountry = "IN",
}: Props) {
  const [country, setCountry] = useState<"IN" | "GB">(initialCountry);
  const [serviceModel, setServiceModel] = useState<ServiceModel>("self_service");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [managedModalOpen, setManagedModalOpen] = useState(false);
  const [selectedManagedPackage, setSelectedManagedPackage] = useState<
    "essential" | "pro" | "premium" | "enterprise"
  >("pro");

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync client-side country detection if not explicitly passed
  useEffect(() => {
    const detected = detectCountryClient();
    if (detected) {
      setCountry(detected);
    }
  }, []);

  const handleCountryToggle = (newCountry: "IN" | "GB") => {
    setCountry(newCountry);
    persistCountryPreference(newCountry);
  };

  function handleOpenManagedModal(
    pkgCode: "essential" | "pro" | "premium" | "enterprise"
  ) {
    setSelectedManagedPackage(pkgCode);
    setManagedModalOpen(true);
  }

  const currencySymbol = country === "GB" ? "£" : "₹";

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 antialiased selection:bg-violet-500/20 flex flex-col justify-between overflow-x-hidden relative">
      {/* ── Soft Ambient Background Lights ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-violet-200/40 via-purple-100/20 to-transparent blur-[110px] rounded-full" />
        <div className="absolute top-[35%] -left-[10%] w-[500px] h-[500px] bg-indigo-100/30 blur-[130px] rounded-full" />
        <div className="absolute top-[65%] -right-[10%] w-[500px] h-[500px] bg-purple-100/30 blur-[130px] rounded-full" />
      </div>

      {/* ── Official Site Corporate Navbar ── */}
      <div className="relative z-50">
        <Navbar isAuthenticated={isAuthenticated} />
      </div>

      <main
        style={{ paddingTop: "calc(var(--pwa-top-bar-height, 0px) + 7rem)" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 transition-[padding-top] duration-200 relative z-10"
      >
        {/* ── Hero Section ── */}
        <section className="text-center max-w-4xl mx-auto mb-14">
          {/* Top Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200/90 text-neutral-800 text-xs font-semibold tracking-wide shadow-2xs mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>0% Platform Ticket Commission · Direct Gateway Payouts</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 mb-5 leading-[1.15]">
            Simple, Transparent Pricing <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              for Every Modern Event
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Never pay 5% to 10% ticketing commissions again. Choose independent self-service SaaS with sub-second QR check-in, or delegate full technical setup to our remote engineers.
          </p>



          {/* ── Compact Model Selector (Self-Service vs Remote Managed) ── */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-neutral-200/60 rounded-2xl border border-neutral-300/70 shadow-inner">
              {/* Option 1: Self-Service Software */}
              <button
                type="button"
                onClick={() => setServiceModel("self_service")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer",
                  serviceModel === "self_service"
                    ? "bg-white text-neutral-950 shadow-sm border border-neutral-200/90"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-white/50"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                    serviceModel === "self_service"
                      ? "bg-violet-50 border-violet-200 text-violet-600"
                      : "bg-neutral-100 border-neutral-200 text-neutral-500"
                  )}
                >
                  <Zap className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-950">Self-Service</span>
                    {serviceModel === "self_service" && (
                      <span className="w-2 h-2 rounded-full bg-violet-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">
                    Independent SaaS platform
                  </p>
                </div>
              </button>

              {/* Option 2: Remote Managed Setup */}
              <button
                type="button"
                onClick={() => setServiceModel("remote_managed")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer",
                  serviceModel === "remote_managed"
                    ? "bg-white text-neutral-950 shadow-sm border border-neutral-200/90"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-white/50"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors",
                    serviceModel === "remote_managed"
                      ? "bg-violet-50 border-violet-200 text-violet-600"
                      : "bg-neutral-100 border-neutral-200 text-neutral-500"
                  )}
                >
                  <Headphones className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-neutral-950">Remote Managed</span>
                    {serviceModel === "remote_managed" && (
                      <span className="w-2 h-2 rounded-full bg-violet-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">
                    Engineers set up for you
                  </p>
                </div>
              </button>
            </div>

            {/* Contextual Sub-bar for active selection */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-white/95 border border-neutral-200/80 rounded-2xl p-2.5 sm:px-4 shadow-xs">
              {/* Currency Selector */}
              <div className="inline-flex items-center gap-1 text-xs">
                <span className="text-neutral-500 font-medium flex items-center gap-1 mr-1">
                  <Globe className="w-3.5 h-3.5 text-neutral-400" /> Currency:
                </span>
                <button
                  type="button"
                  onClick={() => handleCountryToggle("IN")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold",
                    country === "IN"
                      ? "bg-neutral-950 text-white shadow-2xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  )}
                >
                  India (₹ INR)
                </button>
                <button
                  type="button"
                  onClick={() => handleCountryToggle("GB")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold",
                    country === "GB"
                      ? "bg-neutral-950 text-white shadow-2xs"
                      : "text-neutral-600 hover:text-neutral-950"
                  )}
                >
                  UK (£ GBP)
                </button>
              </div>

              {/* Mode-specific context */}
              {serviceModel === "self_service" ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 font-medium hidden sm:inline">Billing:</span>
                  <div className="inline-flex items-center bg-neutral-100 rounded-xl p-1 border border-neutral-200/80">
                    <button
                      type="button"
                      onClick={() => setCycle("monthly")}
                      className={cn(
                        "px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        cycle === "monthly"
                          ? "bg-white text-neutral-950 shadow-xs font-bold"
                          : "text-neutral-600 hover:text-neutral-950"
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setCycle("annual")}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        cycle === "annual"
                          ? "bg-white text-neutral-950 shadow-xs font-bold"
                          : "text-neutral-600 hover:text-neutral-950"
                      )}
                    >
                      <span>Annual</span>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                        SAVE 2 MOS
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-violet-700 font-semibold bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-200/80">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Flat fee per event · 50% deposit · No subscription</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SECTION A: SELF-SERVICE SUBSCRIPTION CARDS ── */}
        {serviceModel === "self_service" && (
          <section className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {SELF_SERVICE_PLANS.map((plan) => {
                const isUk = country === "GB";
                const isMonthly = cycle === "monthly";

                // Prices
                let displayPrice = 0;
                let taxDetails = "";
                let subPriceNote = "";

                if (isUk) {
                  const gbp = GBP_PRICES[plan.slug] || { monthly: 0, annual: 0 };
                  displayPrice = isMonthly ? gbp.monthly : Math.round(gbp.annual / 12);
                  if (displayPrice > 0) {
                    taxDetails = isMonthly
                      ? `+20% VAT (£${(displayPrice * 1.2).toFixed(1)} total)`
                      : `Billed £${gbp.annual}/yr (+VAT)`;
                  } else {
                    subPriceNote = "Zero card or autopay required";
                  }
                } else {
                  const baseInr = isMonthly
                    ? plan.priceMonthlyInr
                    : Math.round(plan.priceAnnualInr / 12);
                  const basePaise = isMonthly ? plan.priceMonthlyPaise : plan.priceAnnualPaise;
                  const tax = calculateGst(basePaise);
                  displayPrice = baseInr;

                  if (plan.priceMonthlyInr > 0) {
                    const totalInrWithGst = Math.round(tax.totalAmountPaise) / 100;
                    taxDetails = `+18% GST (${formatInr(totalInrWithGst)} total)`;
                  } else {
                    subPriceNote = "Zero card or autopay required";
                  }
                }

                return (
                  <div
                    key={plan.slug}
                    className={cn(
                      "relative flex flex-col rounded-3xl p-7 transition-all duration-300 justify-between",
                      plan.popular
                        ? "bg-neutral-950 text-white border-2 border-violet-500 shadow-2xl shadow-violet-950/20 lg:-translate-y-2 z-10"
                        : "bg-white text-neutral-900 border border-neutral-200/90 hover:border-neutral-300 hover:shadow-xl shadow-xs"
                    )}
                  >
                    {/* Badge */}
                    {plan.popular ? (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-300/30 flex items-center gap-1.5 whitespace-nowrap">
                        <Sparkles className="w-3.5 h-3.5 text-violet-200 stroke-[2]" />
                        <span>MOST POPULAR</span>
                      </div>
                    ) : plan.badge ? (
                      <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200">
                        {plan.badge}
                      </div>
                    ) : null}

                    <div>
                      {/* Card Title */}
                      <div className="mb-4 mt-1">
                        <h3
                          className={cn(
                            "text-xl font-black mb-1 flex items-center justify-between",
                            plan.popular ? "text-white" : "text-neutral-950"
                          )}
                        >
                          <span>{plan.name}</span>
                          {plan.popular && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                              High ROI
                            </span>
                          )}
                        </h3>
                        <p
                          className={cn(
                            "text-xs min-h-[34px] leading-relaxed",
                            plan.popular ? "text-neutral-400" : "text-neutral-500"
                          )}
                        >
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Price Block */}
                      <div
                        className={cn(
                          "mb-6 pb-6 border-b",
                          plan.popular ? "border-neutral-800" : "border-neutral-100"
                        )}
                      >
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-4xl sm:text-5xl font-black tracking-tight">
                            {currencySymbol}
                            {displayPrice.toLocaleString(country === "GB" ? "en-GB" : "en-IN")}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              plan.popular ? "text-neutral-400" : "text-neutral-500"
                            )}
                          >
                            {displayPrice === 0 ? "forever" : "/ month"}
                          </span>
                        </div>

                        {taxDetails ? (
                          <div className="mt-2 text-[11px] flex items-center gap-1.5">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-md font-mono text-[11px]",
                                plan.popular
                                  ? "bg-neutral-900 border border-neutral-800 text-violet-300"
                                  : "bg-neutral-100 border border-neutral-200 text-neutral-600"
                              )}
                            >
                              {taxDetails}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{subPriceNote}</span>
                          </p>
                        )}
                      </div>



                      {/* Included Features */}
                      <div className="mb-6">
                        <p
                          className={cn(
                            "text-[11px] uppercase tracking-wider font-bold mb-3",
                            plan.popular ? "text-neutral-400" : "text-neutral-500"
                          )}
                        >
                          Included Features
                        </p>
                        <ul className="space-y-2.5 text-xs">
                          {plan.features.slice(0, 7).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 leading-snug">
                              <Check
                                className={cn(
                                  "w-4 h-4 shrink-0 mt-0.5",
                                  plan.popular ? "text-violet-400" : "text-violet-600"
                                )}
                              />
                              <span
                                className={
                                  plan.popular ? "text-neutral-300" : "text-neutral-700"
                                }
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                          {plan.restrictions?.slice(0, 2).map((restriction, idx) => (
                            <li
                              key={`rest-${idx}`}
                              className="flex items-start gap-2.5 text-neutral-400 leading-snug opacity-80"
                            >
                              <Minus className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                              <span>{restriction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <Link
                        href={
                          isAuthenticated
                            ? plan.slug === "free"
                              ? "/dashboard"
                              : `/billing?plan=${plan.slug}`
                            : plan.slug === "free"
                            ? "/login?intent=signup&plan=free"
                            : `/billing?plan=${plan.slug}`
                        }
                        className={cn(
                          "w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center transition-all duration-200 flex items-center justify-center gap-2 group/btn",
                          plan.popular
                            ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
                            : "bg-neutral-950 hover:bg-neutral-800 text-white shadow-xs"
                        )}
                      >
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SECTION B: REMOTE MANAGED SERVICE CARDS ── */}
        {serviceModel === "remote_managed" && (
          <section className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {REMOTE_MANAGED_PACKAGES.map((pkg) => {
                const isUk = country === "GB";
                const gbpPrice = GBP_MANAGED_PRICES[pkg.code] ?? 0;
                const baseInr = pkg.priceInr;
                const tax = calculateGst(pkg.pricePaise);
                const totalInrWithGst =
                  pkg.priceInr === 0 ? 0 : Math.round(tax.totalAmountPaise) / 100;

                const displayPrice = isUk ? gbpPrice : baseInr;

                return (
                  <div
                    key={pkg.code}
                    className={cn(
                      "relative flex flex-col rounded-3xl p-7 transition-all duration-300 justify-between",
                      pkg.popular
                        ? "bg-neutral-950 text-white border-2 border-violet-500 shadow-2xl shadow-violet-950/20 lg:-translate-y-2 z-10"
                        : "bg-white text-neutral-900 border border-neutral-200/90 hover:border-neutral-300 hover:shadow-xl shadow-xs"
                    )}
                  >
                    {/* Badge */}
                    {pkg.popular ? (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 border border-violet-300/30 flex items-center gap-1.5 whitespace-nowrap">
                        <Sparkles className="w-3.5 h-3.5 text-violet-200 stroke-[2]" />
                        <span>MOST POPULAR SETUP</span>
                      </div>
                    ) : pkg.badge ? (
                      <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200">
                        {pkg.badge}
                      </div>
                    ) : null}

                    <div>
                      {/* Header */}
                      <div className="mb-4 mt-1">
                        <h3
                          className={cn(
                            "text-xl font-black mb-1",
                            pkg.popular ? "text-white" : "text-neutral-950"
                          )}
                        >
                          {pkg.name}
                        </h3>
                        <p
                          className={cn(
                            "text-xs min-h-[34px] leading-relaxed",
                            pkg.popular ? "text-neutral-400" : "text-neutral-500"
                          )}
                        >
                          {pkg.tagline}
                        </p>
                      </div>

                      {/* Price Block */}
                      <div
                        className={cn(
                          "mb-6 pb-6 border-b",
                          pkg.popular ? "border-neutral-800" : "border-neutral-100"
                        )}
                      >
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-4xl sm:text-5xl font-black tracking-tight">
                            {displayPrice === 0 ? "Custom" : `${currencySymbol}${displayPrice.toLocaleString()}`}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              pkg.popular ? "text-neutral-400" : "text-neutral-500"
                            )}
                          >
                            {displayPrice === 0 ? "quote" : "/ event"}
                          </span>
                        </div>

                        {displayPrice > 0 ? (
                          <div className="mt-2 text-[11px]">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-md font-mono text-[11px]",
                                pkg.popular
                                  ? "bg-neutral-900 border border-neutral-800 text-violet-300"
                                  : "bg-neutral-100 border border-neutral-200 text-neutral-600"
                              )}
                            >
                              {isUk
                                ? `+20% VAT (£${(displayPrice * 1.2).toFixed(1)} total)`
                                : `+18% GST (${formatInr(totalInrWithGst)} total)`}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-violet-500 font-medium mt-2">
                            High concurrency / multi-day summits
                          </p>
                        )}
                      </div>



                      {/* Key Deliverables */}
                      <div className="mb-6">
                        <p
                          className={cn(
                            "text-[11px] uppercase tracking-wider font-bold mb-3",
                            pkg.popular ? "text-neutral-400" : "text-neutral-500"
                          )}
                        >
                          What Engineers Handle
                        </p>
                        <ul className="space-y-2.5 text-xs">
                          {pkg.features.slice(0, 7).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 leading-snug">
                              <Check
                                className={cn(
                                  "w-4 h-4 shrink-0 mt-0.5",
                                  pkg.popular ? "text-violet-400" : "text-violet-600"
                                )}
                              />
                              <span
                                className={
                                  pkg.popular ? "text-neutral-300" : "text-neutral-700"
                                }
                              >
                                {feat}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenManagedModal(pkg.code)}
                        className={cn(
                          "w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group/btn",
                          pkg.popular
                            ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
                            : "bg-neutral-950 hover:bg-neutral-800 text-white shadow-xs"
                        )}
                      >
                        <span>{pkg.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}



        {/* ── SECTION D: DETAILED FEATURE COMPARISON TABLE ── */}
        <section className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mb-3">
              Full Feature &amp; Capability Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Compare self-service plans side-by-side. Upgrade, downgrade, or cancel anytime with zero lock-in contracts.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-neutral-200/90 bg-white shadow-md">
            <table className="w-full text-left text-xs text-neutral-700 border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/90 sticky top-0 z-10">
                  <th className="py-4 px-6 font-bold text-neutral-950 w-1/3">
                    Features &amp; Specifications
                  </th>
                  <th className="py-4 px-4 font-bold text-neutral-900 text-center">
                    {country === "GB" ? "Free (£0)" : "Free (₹0)"}
                  </th>
                  <th className="py-4 px-4 font-bold text-neutral-900 text-center">Starter</th>
                  <th className="py-4 px-4 font-bold text-violet-700 text-center bg-violet-50/70">
                    Pro (Popular)
                  </th>
                  <th className="py-4 px-4 font-bold text-neutral-900 text-center">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {/* Category 1 */}
                <tr className="bg-neutral-50/60">
                  <td
                    colSpan={5}
                    className="py-3 px-6 font-black text-[11px] text-violet-700 uppercase tracking-wider"
                  >
                    1. Event &amp; Attendee Capacity
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Concurrent Active Events
                  </td>
                  <td className="py-3 px-4 text-center">1 event</td>
                  <td className="py-3 px-4 text-center">3 events</td>
                  <td className="py-3 px-4 text-center bg-violet-50/30 font-bold text-neutral-950">
                    10 events
                  </td>
                  <td className="py-3 px-4 text-center">30 events</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Max Registrations / Event
                  </td>
                  <td className="py-3 px-4 text-center">100 attendees</td>
                  <td className="py-3 px-4 text-center">1,000 attendees</td>
                  <td className="py-3 px-4 text-center bg-violet-50/30 font-bold text-neutral-950">
                    5,000 attendees
                  </td>
                  <td className="py-3 px-4 text-center">15,000 attendees</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">Team Member Seats</td>
                  <td className="py-3 px-4 text-center">1 seat</td>
                  <td className="py-3 px-4 text-center">2 seats</td>
                  <td className="py-3 px-4 text-center bg-violet-50/30 font-bold text-neutral-950">
                    5 seats
                  </td>
                  <td className="py-3 px-4 text-center">15 seats</td>
                </tr>

                {/* Category 2 */}
                <tr className="bg-neutral-50/60">
                  <td
                    colSpan={5}
                    className="py-3 px-6 font-black text-[11px] text-violet-700 uppercase tracking-wider"
                  >
                    2. Ticketing &amp; Payments
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Platform Ticket Commission
                  </td>
                  <td className="py-3 px-4 text-center text-neutral-400">Free events only</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">0% Commission</td>
                  <td className="py-3 px-4 text-center bg-violet-50/30 text-emerald-600 font-bold">
                    0% Commission
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">0% Commission</td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Direct Payment Gateway (UPI, Cards, Netbanking)
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center bg-violet-50/30">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Tiered Pricing &amp; Early Bird Drops
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">Standard Tiers</td>
                  <td className="py-3 px-4 text-center bg-violet-50/30 font-bold text-neutral-950">
                    Advanced Tiers
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-neutral-950">Advanced Tiers</td>
                </tr>

                {/* Category 3 */}
                <tr className="bg-neutral-50/60">
                  <td
                    colSpan={5}
                    className="py-3 px-6 font-black text-[11px] text-violet-700 uppercase tracking-wider"
                  >
                    3. QR Verification &amp; Gate Operations
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Browser Smartphone QR Scanning
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center bg-violet-50/30">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Anti-Fraud Duplicate Scan Block
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center bg-violet-50/30">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Group QR Tickets &amp; Partial Entry
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center bg-violet-50/30">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Multi-Gate Scanner Sync &amp; Routing
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center bg-violet-50/30">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                </tr>

                {/* Category 4 */}
                <tr className="bg-neutral-50/60">
                  <td
                    colSpan={5}
                    className="py-3 px-6 font-black text-[11px] text-violet-700 uppercase tracking-wider"
                  >
                    4. Data, Customization &amp; Integrations
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    CSV Attendee Import &amp; Export
                  </td>
                  <td className="py-3 px-4 text-center text-neutral-400">Basic Export</td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center bg-violet-50/30">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-violet-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    Custom Pass Branding &amp; Color Themes
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center bg-violet-50/30">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-6 text-neutral-900 font-medium">
                    REST API Access &amp; Webhooks
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center bg-violet-50/30">
                    <Minus className="w-4 h-4 text-neutral-300 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION E: STRICT MANAGED SERVICE BOUNDARY DISCLOSURE ── */}
        <section className="mb-24 rounded-3xl bg-white border border-neutral-200/90 p-6 sm:p-10 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-950">
                {REMOTE_MANAGED_SERVICE_BOUNDARIES.headline}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Clear expectations guarantee operational excellence between our engineering team and your on-site event staff.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-600 mb-8 leading-relaxed">
            {REMOTE_MANAGED_SERVICE_BOUNDARIES.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Exclusions */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-red-200/80 space-y-3">
              <span className="font-bold text-red-600 block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Minus className="w-4 h-4" />
                <span>Strict Remote Exclusions</span>
              </span>
              {REMOTE_MANAGED_SERVICE_BOUNDARIES.exclusions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-neutral-700 leading-snug">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Organizer Responsibilities */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-emerald-200/80 space-y-3">
              <span className="font-bold text-emerald-700 block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Organizer On-Site Responsibilities</span>
              </span>
              {REMOTE_MANAGED_SERVICE_BOUNDARIES.organizerResponsibilities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-neutral-700 leading-snug">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION F: GST & COMPLIANCE BENTO ── */}
        <section className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 border border-emerald-200">
              <Percent className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-neutral-950 text-lg mb-2">Zero Ticket Commission</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We never take 5%, 8%, or 10% of your ticket sales. Keep 100% of your ticket sales revenue. Flat monthly or per-event billing only.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4 border border-violet-200">
              <Receipt className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-neutral-950 text-lg mb-2">Tax Compliant Invoicing</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Transparent invoicing with official GSTIN (India 18% GST) or UK VAT registration. Download compliant tax invoices with your corporate tax ID during checkout.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4 border border-blue-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-neutral-950 text-lg mb-2">Zero Cancellation Penalty</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Cancel recurring subscription renewals anytime directly from your dashboard. Retain full access until the end of your billing cycle with zero penalty fees.
            </p>
          </div>
        </section>

        {/* ── SECTION G: INTERACTIVE ACCORDION FAQ ── */}
        <section className="mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Direct, transparent answers regarding ticketing, payments, subscriptions, and managed services.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What is the difference between Self-Service and Remote Managed Service?",
                a: "Self-Service gives you full access to our cloud software to create, customize, and manage your events yourself on a monthly subscription. Remote Managed Services assigns our engineering coordinators to configure everything remotely for you (forms, tiers, QR passes, coordinator training) for a single flat fee per event.",
              },
              {
                q: "Does UrPass charge commission on paid ticket sales?",
                a: "No! Unlike traditional ticketing portals that deduct 5% to 8% plus booking fees, UrPass charges 0% platform commission on all paid plans (Starter, Pro, Business). Ticket revenues settle directly into your connected Razorpay payment gateway.",
              },
              {
                q: "Do I have to buy a monthly subscription if I choose Remote Managed Service?",
                a: "No. Remote Managed Service is billed once per event. You do not need an active recurring subscription to purchase a managed setup package.",
              },
              {
                q: "How does the 50% deposit work for Remote Managed Services?",
                a: "To begin configuration and reserve operational capacity, a 50% deposit is paid upon order approval via Razorpay one-time payment. The remaining 50% balance is collected after you review and approve the setup before event launch.",
              },
              {
                q: "What happens if our event exceeds our plan's attendee capacity?",
                a: "We never cancel your event or delete attendee records. When you reach 100% capacity, registration is paused until you either upgrade your subscription or add extra capacity for managed events.",
              },
              {
                q: "Can I sell paid tickets on the Free plan?",
                a: "No. The Free plan is limited to free RSVP events up to 100 attendees. To sell paid tickets with 0% platform commission, choose Starter (₹499), Pro (₹999), or Business (₹2,499).",
              },
              {
                q: "Does UrPass provide barcode scanners or phones at the gates?",
                a: "No. UrPass QR codes are verified using standard web browsers on any modern smartphone camera. Your event volunteers simply open the scanner web link on their own phones — no hardware rental required.",
              },
            ].map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/70 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-neutral-950">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-violet-600 shrink-0 transition-transform duration-200",
                        isOpen && "rotate-180 text-violet-700"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── FINAL FULL-WIDTH CTA (Site-Wide Standard) ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-neutral-950 text-center text-white relative">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-4">
            URPASS · EVENT MANAGEMENT PLATFORM
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Modernize your event entry today.
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Launch registration in minutes, issue digital passes, and check in attendees at your entrance doors in under 0.3 seconds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          <Link
            href="/login?intent=signup&plan=free"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-neutral-950 px-7 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors shadow-sm"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleOpenManagedModal("pro")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-800 bg-neutral-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Headphones className="w-4 h-4" />
            <span>Request Remote Setup</span>
          </button>
        </div>

        <p className="mt-6 text-xs text-neutral-400">
          {country === "GB"
            ? "Plans from £15/mo · Direct UK activation · Cancel renewal anytime"
            : "Plans from ₹499/mo · Autopay required · Cancel renewal anytime"}
        </p>
      </section>

      {/* ── Official Site Footer ── */}
      <Footer />

      {/* ── Remote Managed Service Inquiry Modal ── */}
      <LeadCaptureModal
        isOpen={managedModalOpen}
        onClose={() => setManagedModalOpen(false)}
        defaultPackage={selectedManagedPackage}
        pageSlug="pricing"
        contentCluster="pricing"
      />
    </div>
  );
}
