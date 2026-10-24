"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Minus,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  ShieldAlert,
  Headphones,
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
import LeadCaptureModal from "@/components/marketing/LeadCaptureModal";

interface Props {
  isAuthenticated?: boolean;
  userEmail?: string;
  initialCountry?: "IN" | "GB";
}

export default function PricingContent({
  isAuthenticated = false,
  userEmail = "",
  initialCountry = "IN",
}: Props) {
  const [serviceModel, setServiceModel] = useState<ServiceModel>("self_service");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [managedModalOpen, setManagedModalOpen] = useState(false);
  const [selectedManagedPackage, setSelectedManagedPackage] = useState<
    "essential" | "pro" | "premium" | "enterprise"
  >("pro");

  function handleOpenManagedModal(pkgCode: "essential" | "pro" | "premium" | "enterprise") {
    setSelectedManagedPackage(pkgCode);
    setManagedModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-violet-500/30">
      {/* ── Top Navigation Bar ── */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
            UP
          </div>
          <span className="font-extrabold tracking-tight text-lg text-white">
            UrPass<span className="text-violet-400">.</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/remote-managed-event-services"
            className="hidden sm:inline-flex text-xs text-slate-300 hover:text-white transition-colors"
          >
            Remote Managed Services
          </Link>
          <Link
            href="/self-service-vs-managed-events"
            className="hidden sm:inline-flex text-xs text-slate-300 hover:text-white transition-colors"
          >
            Compare Models
          </Link>
          {isAuthenticated ? (
            <Link
              href="/dashboard/billing"
              className="text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Billing Portal
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login?from=pricing"
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/login?intent=signup&plan=free"
                className="text-xs font-semibold bg-white hover:bg-slate-100 text-slate-950 px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Start Free
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* ── Hero Section ── */}
        <section className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            Transparent Event Pricing · 0% Ticket Commission
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            Simple, Transparent Pricing <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              for Every Event
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Choose independent Self-Service SaaS tools with 0% ticket commissions, or delegate full technical setup to our remote operations engineers.
          </p>

          {/* ── Model Selector (Dual Engine) ── */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl max-w-md mx-auto w-full mb-8">
            <button
              type="button"
              onClick={() => setServiceModel("self_service")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                serviceModel === "self_service"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Zap className="w-4 h-4" />
              Self-Service Subscriptions
            </button>
            <button
              type="button"
              onClick={() => setServiceModel("remote_managed")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
                serviceModel === "remote_managed"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Headphones className="w-4 h-4" />
              Remote Managed Service
            </button>
          </div>

          {/* Monthly / Annual Toggle for Self-Service */}
          {serviceModel === "self_service" && (
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center bg-slate-900/80 rounded-xl p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCycle("monthly")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    cycle === "monthly"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setCycle("annual")}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    cycle === "annual"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  Annual Billing
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    SAVE 2 MONTHS
                  </span>
                </button>
              </div>
              {cycle === "annual" && (
                <p className="text-[11px] text-amber-300/80 flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  Annual billing uses configured catalog rates (10x monthly equivalent). Razorpay annual mandates are scheduled per merchant agreement.
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── SECTION A: SELF-SERVICE SUBSCRIPTION CARDS ── */}
        {serviceModel === "self_service" && (
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SELF_SERVICE_PLANS.map((plan) => {
                const isMonthly = cycle === "monthly";
                const baseInr = isMonthly ? plan.priceMonthlyInr : Math.round(plan.priceAnnualInr / 12);
                const basePaise = isMonthly ? plan.priceMonthlyPaise : plan.priceAnnualPaise;
                const tax = calculateGst(basePaise);
                const totalInrWithGst = isMonthly
                  ? plan.priceMonthlyInr === 0
                    ? 0
                    : Math.round(tax.totalAmountPaise) / 100
                  : Math.round(tax.totalAmountPaise) / 100;

                return (
                  <div
                    key={plan.slug}
                    className={cn(
                      "relative flex flex-col rounded-2xl p-6 sm:p-7 transition-all border",
                      plan.popular
                        ? "bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-violet-500/60 shadow-2xl shadow-violet-950/40 lg:-translate-y-2"
                        : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                    )}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-600 text-white shadow-md">
                        {plan.badge}
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-white mb-1.5">{plan.name}</h3>
                      <p className="text-xs text-slate-400 min-h-[32px]">{plan.tagline}</p>
                    </div>

                    {/* Price Block */}
                    <div className="mb-6 pb-6 border-b border-slate-800/80">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-extrabold text-white">
                          {formatInr(baseInr)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {plan.priceMonthlyInr === 0 ? "forever" : "/ month"}
                        </span>
                      </div>
                      {plan.priceMonthlyInr > 0 && (
                        <div className="mt-1.5 text-[11px] text-slate-400">
                          <span>+18% GST ({formatInr(tax.taxAmountInr)})</span>
                          <span className="text-slate-500"> · </span>
                          <span className="text-slate-300 font-medium">
                            {formatInr(totalInrWithGst)} total
                          </span>
                        </div>
                      )}
                      {plan.priceMonthlyInr === 0 && (
                        <p className="text-[11px] text-emerald-400 font-medium mt-1.5">
                          Zero card or autopay required
                        </p>
                      )}
                    </div>

                    {/* Quick Allowances */}
                    <div className="space-y-2 mb-6 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Active Events:</span>
                        <span className="font-bold text-white">
                          {plan.limits.activeEvents === "unlimited" ? "Unlimited" : plan.limits.activeEvents}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Attendees / Event:</span>
                        <span className="font-bold text-white">
                          {plan.limits.attendeesPerEvent === "unlimited"
                            ? "Unlimited"
                            : plan.limits.attendeesPerEvent.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Team Seats:</span>
                        <span className="font-bold text-white">{plan.limits.teamSeats}</span>
                      </div>
                    </div>

                    {/* Feature Bullets */}
                    <ul className="space-y-2.5 mb-8 flex-1 text-xs text-slate-300">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.restrictions?.map((restriction, idx) => (
                        <li key={`rest-${idx}`} className="flex items-start gap-2.5 text-slate-500">
                          <Minus className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                          <span>{restriction}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
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
                        "w-full py-3 px-4 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5",
                        plan.popular
                          ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
                          : "bg-slate-800 hover:bg-slate-700 text-white"
                      )}
                    >
                      {plan.ctaText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SECTION B: REMOTE MANAGED SERVICE CARDS ── */}
        {serviceModel === "remote_managed" && (
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {REMOTE_MANAGED_PACKAGES.map((pkg) => {
                const tax = calculateGst(pkg.pricePaise);
                const totalInrWithGst = pkg.priceInr === 0 ? 0 : Math.round(tax.totalAmountPaise) / 100;
                const depositInr = Math.floor(totalInrWithGst / 2);

                return (
                  <div
                    key={pkg.code}
                    className={cn(
                      "relative flex flex-col rounded-2xl p-6 sm:p-7 transition-all border",
                      pkg.popular
                        ? "bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-violet-500/60 shadow-2xl shadow-violet-950/40 lg:-translate-y-2"
                        : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                    )}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-600 text-white shadow-md">
                        {pkg.badge}
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-white mb-1.5">{pkg.name}</h3>
                      <p className="text-xs text-slate-400 min-h-[32px]">{pkg.tagline}</p>
                    </div>

                    {/* Price Block */}
                    <div className="mb-6 pb-6 border-b border-slate-800/80">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-extrabold text-white">
                          {pkg.priceInr === 0 ? "Custom" : formatInr(pkg.priceInr)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {pkg.priceInr === 0 ? "quote" : "/ event"}
                        </span>
                      </div>
                      {pkg.priceInr > 0 ? (
                        <div className="mt-1.5 text-[11px] text-slate-400">
                          <span>+18% GST ({formatInr(tax.taxAmountInr)})</span>
                          <span className="text-slate-500"> · </span>
                          <span className="text-slate-300 font-medium">
                            {formatInr(totalInrWithGst)} total
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-violet-400 font-medium mt-1.5">
                          Capacity over 15,000 attendees
                        </p>
                      )}
                    </div>

                    {/* Deposit Structure Pill */}
                    {pkg.priceInr > 0 && (
                      <div className="mb-6 bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl text-xs space-y-1.5">
                        <div className="flex justify-between items-center text-slate-300">
                          <span>50% Advance Deposit:</span>
                          <span className="font-bold text-violet-300">{formatInr(depositInr)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 text-[11px]">
                          <span>50% Balance Due:</span>
                          <span>Before Event Launch</span>
                        </div>
                      </div>
                    )}

                    {/* Feature Bullets */}
                    <ul className="space-y-2.5 mb-8 flex-1 text-xs text-slate-300">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenManagedModal(pkg.code)}
                      className={cn(
                        "w-full py-3 px-4 rounded-xl text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5",
                        pkg.popular
                          ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
                          : "bg-slate-800 hover:bg-slate-700 text-white"
                      )}
                    >
                      {pkg.ctaText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── SECTION C: DETAILED SELF-SERVICE FEATURE COMPARISON TABLE ── */}
        <section className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Compare Self-Service Plan Features
            </h2>
            <p className="text-sm text-slate-400">
              Every plan includes 0% platform ticket commissions, sub-second smartphone QR scanning, and automated attendee confirmations.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80">
                  <th className="py-4 px-6 font-bold text-white w-1/3">Features & Entitlements</th>
                  <th className="py-4 px-4 font-bold text-slate-300 text-center">Free (₹0)</th>
                  <th className="py-4 px-4 font-bold text-slate-300 text-center">Starter (₹499)</th>
                  <th className="py-4 px-4 font-bold text-violet-300 text-center bg-violet-950/20">Pro (₹999)</th>
                  <th className="py-4 px-4 font-bold text-slate-300 text-center">Business (₹2,499)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* Limits */}
                <tr className="bg-slate-950/40">
                  <td colSpan={5} className="py-2.5 px-6 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Event & Attendee Capacity
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Active Events Simultaneously</td>
                  <td className="py-3 px-4 text-center">1 active event</td>
                  <td className="py-3 px-4 text-center">3 active events</td>
                  <td className="py-3 px-4 text-center bg-violet-950/10 font-bold text-white">10 active events</td>
                  <td className="py-3 px-4 text-center">30 active events</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Max Attendees / Registrations Per Event</td>
                  <td className="py-3 px-4 text-center">100 attendees</td>
                  <td className="py-3 px-4 text-center">1,000 attendees</td>
                  <td className="py-3 px-4 text-center bg-violet-950/10 font-bold text-white">5,000 attendees</td>
                  <td className="py-3 px-4 text-center">15,000 attendees</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Team Member Seats</td>
                  <td className="py-3 px-4 text-center">1 seat</td>
                  <td className="py-3 px-4 text-center">2 seats</td>
                  <td className="py-3 px-4 text-center bg-violet-950/10 font-bold text-white">5 seats</td>
                  <td className="py-3 px-4 text-center">15 seats</td>
                </tr>

                {/* Ticketing */}
                <tr className="bg-slate-950/40">
                  <td colSpan={5} className="py-2.5 px-6 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Ticketing & Payment Processing
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Platform Ticket Commission Fee</td>
                  <td className="py-3 px-4 text-center text-slate-500">Free events only</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">0% Commission</td>
                  <td className="py-3 px-4 text-center bg-violet-950/10 text-emerald-400 font-bold">0% Commission</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-bold">0% Commission</td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Direct Indian Payment Gateway (UPI, Cards)</td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center bg-violet-950/10"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Tiered Pricing & Early Bird Drops</td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center">Standard</td>
                  <td className="py-3 px-4 text-center bg-violet-950/10 font-bold text-white">Advanced Tiers</td>
                  <td className="py-3 px-4 text-center font-bold text-white">Advanced Tiers</td>
                </tr>

                {/* Check-in & Gate Operations */}
                <tr className="bg-slate-950/40">
                  <td colSpan={5} className="py-2.5 px-6 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Gate Check-in & Pass Verification
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Smartphone QR Camera Scanning</td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center bg-violet-950/10"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Duplicate Scan Detection (Anti-Fraud)</td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center bg-violet-950/10"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Group QR Tickets & Partial Gate Entry</td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center bg-violet-950/10"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Multi-Gate Configuration & Gate Captains</td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center bg-violet-950/10"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>

                {/* Data, API & Customization */}
                <tr className="bg-slate-950/40">
                  <td colSpan={5} className="py-2.5 px-6 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    Data, Branding & Integrations
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">CSV Attendee Import & Export</td>
                  <td className="py-3 px-4 text-center text-slate-500">Basic Export</td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center bg-violet-950/10"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-violet-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">Custom Pass Colors & Branding</td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center bg-violet-950/10"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-3 px-6 text-slate-200 font-medium">REST API Access & Real-Time Webhooks</td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center bg-violet-950/10"><Minus className="w-4 h-4 text-slate-600 mx-auto" /></td>
                  <td className="py-3 px-4 text-center"><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SECTION D: STRICT MANAGED SERVICE BOUNDARY DISCLOSURE ── */}
        <section className="mb-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {REMOTE_MANAGED_SERVICE_BOUNDARIES.headline}
              </h3>
              <p className="text-xs text-slate-400">
                Transparent expectations for our paid technical assistance packages
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {REMOTE_MANAGED_SERVICE_BOUNDARIES.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-slate-950/80 p-5 rounded-xl border border-red-500/20 space-y-2.5">
              <span className="font-bold text-red-400 block mb-2 uppercase tracking-wider text-[11px]">
                Strict Service Exclusions
              </span>
              {REMOTE_MANAGED_SERVICE_BOUNDARIES.exclusions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <Minus className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-950/80 p-5 rounded-xl border border-emerald-500/20 space-y-2.5">
              <span className="font-bold text-emerald-400 block mb-2 uppercase tracking-wider text-[11px]">
                Organizer On-Site Responsibilities
              </span>
              {REMOTE_MANAGED_SERVICE_BOUNDARIES.organizerResponsibilities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION E: GST & TRANSACTION TRANSPARENCY ── */}
        <section className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-3">
              0%
            </div>
            <h4 className="font-bold text-white text-base mb-1.5">Zero Ticket Commission</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never take 5%, 8%, or 10% of your ticket sales. You pay only your flat subscription or managed fee. You keep 100% of ticket sales revenue.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold mb-3">
              18%
            </div>
            <h4 className="font-bold text-white text-base mb-1.5">Indian GST Invoicing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All displayed prices are exclusive of 18% GST. Enter your company GSTIN during checkout to receive official tax deduction invoices.
            </p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-3">
              ₹0
            </div>
            <h4 className="font-bold text-white text-base mb-1.5">No Cancellation Fees</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cancel recurring subscription renewals anytime from your dashboard. Keep full access until the end of your current period with zero penalties.
            </p>
          </div>
        </section>

        {/* ── SECTION F: BILLING FAQ ── */}
        <section className="mb-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">
              Clear, transparent answers about payments, subscriptions, and managed services.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What is the difference between Self-Service and Remote Managed Service?",
                a: "Self-Service gives you full access to our cloud software to create, customize, and manage your events yourself on a monthly subscription. Remote Managed Services assigns our engineering coordinators to configure everything remotely for you (forms, tiers, QR passes, coordinator training) for a single flat fee per event.",
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
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-left"
              >
                <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION G: FINAL CONVERSION CTA ── */}
        <section className="rounded-3xl bg-gradient-to-r from-violet-900/60 via-purple-900/40 to-slate-900 border border-violet-500/30 p-10 sm:p-14 text-center max-w-5xl mx-auto shadow-2xl shadow-violet-950/50">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Launch Your Event?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Create your account in under 60 seconds with our Free Forever tier, or talk to our operations team for a complete remote setup.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?intent=signup&plan=free"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-md"
            >
              Create Free Account
            </Link>
            <button
              type="button"
              onClick={() => handleOpenManagedModal("pro")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              Request Remote Managed Setup
            </button>
          </div>
        </section>
      </main>

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
