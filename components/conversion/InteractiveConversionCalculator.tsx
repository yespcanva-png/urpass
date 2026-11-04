"use client";

import React, { useState } from "react";
import { Users, Sparkles, TrendingUp, ShieldCheck, ArrowRight, RefreshCw, DollarSign } from "lucide-react";
import Link from "next/link";

interface InteractiveConversionCalculatorProps {
  initialVisitors?: number;
  initialSignupRate?: number;
  initialActivationRate?: number;
  initialPaidRate?: number;
  className?: string;
  ctaUrl?: string;
  ctaText?: string;
}

export default function InteractiveConversionCalculator({
  initialVisitors = 5000,
  initialSignupRate = 5.0,
  initialActivationRate = 40.0,
  initialPaidRate = 15.0,
  className = "",
  ctaUrl = "/signup",
  ctaText = "Start Free Event",
}: InteractiveConversionCalculatorProps) {
  const [visitors, setVisitors] = useState<number>(initialVisitors);
  const [signupRate, setSignupRate] = useState<number>(initialSignupRate);
  const [activationRate, setActivationRate] = useState<number>(initialActivationRate);
  const [paidRate, setPaidRate] = useState<number>(initialPaidRate);
  const [avgTicketVolume, setAvgTicketVolume] = useState<number>(300);
  const [avgTicketPrice, setAvgTicketPrice] = useState<number>(500);

  // Computations
  const signups = Math.round((visitors * signupRate) / 100);
  const activatedOrganizers = Math.round((signups * activationRate) / 100);
  const payingCustomers = Math.max(1, Math.round((activatedOrganizers * paidRate) / 100));

  // Platform Commission Savings (vs 7.5% average third-party ticketing fee)
  const totalPaidTicketsProcessed = payingCustomers * avgTicketVolume;
  const grossTicketVolume = totalPaidTicketsProcessed * avgTicketPrice;
  const competitorFeeDeduction = Math.round(grossTicketVolume * 0.075); // 7.5% typical Eventbrite fee

  // Preset Handlers
  const applyPreset = (preset: "conservative" | "baseline" | "highIntent") => {
    if (preset === "conservative") {
      setVisitors(2500);
      setSignupRate(3.0);
      setActivationRate(25.0);
      setPaidRate(8.0);
    } else if (preset === "baseline") {
      setVisitors(5000);
      setSignupRate(5.0);
      setActivationRate(40.0);
      setPaidRate(15.0);
    } else if (preset === "highIntent") {
      setVisitors(10000);
      setSignupRate(8.0);
      setActivationRate(55.0);
      setPaidRate(20.0);
    }
  };

  return (
    <div
      className={`rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 md:p-10 shadow-xl ${className}`}
      id="conversion-calculator"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-800 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-violet-700" />
            <span>Interactive Acquisition Simulator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Event Organizer Conversion Funnel Calculator
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Model organic visitor throughput from SEO and AI discovery to activated event organizers.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-xl shrink-0">
          <span className="text-xs font-semibold text-neutral-500 px-2">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset("conservative")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg text-neutral-700 hover:bg-white hover:shadow-xs transition-all"
          >
            Modest
          </button>
          <button
            type="button"
            onClick={() => applyPreset("baseline")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-violet-800 shadow-xs transition-all"
          >
            Baseline (5k)
          </button>
          <button
            type="button"
            onClick={() => applyPreset("highIntent")}
            className="px-2.5 py-1 text-xs font-medium rounded-lg text-neutral-700 hover:bg-white hover:shadow-xs transition-all"
          >
            Optimized (10k)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Input Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Monthly Organic Visitors */}
          <div>
            <div className="flex items-center justify-between text-sm font-bold text-neutral-900 mb-2">
              <label htmlFor="visitors-range">1. Monthly Organic Visitors</label>
              <span className="font-mono text-base text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-lg border border-violet-200">
                {visitors.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              id="visitors-range"
              type="range"
              min={500}
              max={25000}
              step={250}
              value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>500</span>
              <span>10,000</span>
              <span>25,000+</span>
            </div>
          </div>

          {/* 2. Visitor -> Signup Conversion % */}
          <div>
            <div className="flex items-center justify-between text-sm font-bold text-neutral-900 mb-2">
              <label htmlFor="signup-rate-range">2. Visitor → Signup Rate</label>
              <span className="font-mono text-base text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-lg border border-violet-200">
                {signupRate.toFixed(1)}%
              </span>
            </div>
            <input
              id="signup-rate-range"
              type="range"
              min={1.0}
              max={15.0}
              step={0.5}
              value={signupRate}
              onChange={(e) => setSignupRate(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Boosted when search intent matches landing page CTA (e.g. &ldquo;Design My Badge&rdquo; vs generic &ldquo;Sign Up&rdquo;).
            </p>
          </div>

          {/* 3. Signup -> First Event Created % */}
          <div>
            <div className="flex items-center justify-between text-sm font-bold text-neutral-900 mb-2">
              <label htmlFor="activation-rate-range">3. Signup → First Event Created</label>
              <span className="font-mono text-base text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-lg border border-violet-200">
                {activationRate.toFixed(0)}%
              </span>
            </div>
            <input
              id="activation-rate-range"
              type="range"
              min={10}
              max={70}
              step={5}
              value={activationRate}
              onChange={(e) => setActivationRate(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Driven by preconfigured onboarding templates carrying event name and capacity.
            </p>
          </div>

          {/* 4. Activated -> Paid Conversion % */}
          <div>
            <div className="flex items-center justify-between text-sm font-bold text-neutral-900 mb-2">
              <label htmlFor="paid-rate-range">4. Activated Organizer → Paid Plan</label>
              <span className="font-mono text-base text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-lg border border-violet-200">
                {paidRate.toFixed(0)}%
              </span>
            </div>
            <input
              id="paid-rate-range"
              type="range"
              min={3}
              max={30}
              step={1}
              value={paidRate}
              onChange={(e) => setPaidRate(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Organizers upgrading to Starter (1,000), Pro (5,000), Business (15,000), or ₹299 One-Time Pass.
            </p>
          </div>
        </div>

        {/* Results Metrics Output Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-neutral-800">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
            <span className="text-xs font-mono text-violet-400 font-bold uppercase tracking-wider">
              Projected Monthly Output
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">Monthly Run-rate</span>
          </div>

          {/* Funnel Metrics Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/90 border border-neutral-800">
              <div>
                <span className="text-xs text-neutral-400 block">1. New Signups</span>
                <span className="text-xs text-neutral-500">From organic visitors</span>
              </div>
              <span className="text-2xl font-extrabold text-white font-mono">
                {signups.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/90 border border-neutral-800">
              <div>
                <span className="text-xs text-emerald-400 font-semibold block">2. Activated Organizers</span>
                <span className="text-xs text-neutral-500">First event draft launched</span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {activatedOrganizers.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-violet-950/60 border border-violet-700/60">
              <div>
                <span className="text-xs text-violet-300 font-bold block">3. Paying Customers</span>
                <span className="text-xs text-violet-400/80">Monthly / One-Time paid plans</span>
              </div>
              <span className="text-2xl font-extrabold text-violet-300 font-mono">
                {payingCustomers.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Platform Ticketing Savings Highlight */}
          <div className="mt-5 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>0% Platform Commission Advantage</span>
            </div>
            <p className="text-xs text-neutral-300 leading-snug">
              At {totalPaidTicketsProcessed.toLocaleString("en-IN")} tickets sold across these events, UrPass charges <strong className="text-white">₹0 commission</strong>. Conventional platforms deducting 7.5% would take <strong className="text-emerald-300">₹{competitorFeeDeduction.toLocaleString("en-IN")}</strong>.
            </p>
          </div>

          {/* Action CTA */}
          <div className="mt-6">
            <Link
              href={ctaUrl}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition-all text-center"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-[10px] text-neutral-500 text-center mt-3">
            Illustrative conversion model for event marketing planning. Actual performance varies with traffic quality and event seasonality.
          </p>
        </div>
      </div>
    </div>
  );
}
