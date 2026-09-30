"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Percent,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

type Currency = "INR" | "GBP" | "USD";

const CURRENCY_CONFIG: Record<Currency, { symbol: string; name: string; defaultPrice: number; defaultAttendees: number; maxPrice: number }> = {
  INR: { symbol: "₹", name: "Indian Rupee (INR)", defaultPrice: 499, defaultAttendees: 300, maxPrice: 10000 },
  GBP: { symbol: "£", name: "British Pound (GBP)", defaultPrice: 15, defaultAttendees: 200, maxPrice: 500 },
  USD: { symbol: "$", name: "US Dollar (USD)", defaultPrice: 25, defaultAttendees: 250, maxPrice: 1000 },
};

export default function TicketFeeCalculator() {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [ticketPrice, setTicketPrice] = useState<number>(CURRENCY_CONFIG.INR.defaultPrice);
  const [attendees, setAttendees] = useState<number>(CURRENCY_CONFIG.INR.defaultAttendees);

  const cfg = CURRENCY_CONFIG[currency];
  const grossRevenue = ticketPrice * attendees;

  // Competitor fee models (Standard documented platform cuts, excluding card interchange):
  // 1. Eventbrite: 3.7% + per-ticket flat fee (approx ₹70 in IN, £0.79 in UK, $1.79 in US)
  const eventbriteFlat = currency === "INR" ? 70 : currency === "GBP" ? 0.79 : 1.79;
  const eventbriteFee = grossRevenue > 0 ? (grossRevenue * 0.037) + (attendees * eventbriteFlat) : 0;

  // 2. Townscript (India): 3.99% + ₹10 per ticket
  const townscriptFlat = currency === "INR" ? 10 : currency === "GBP" ? 0.25 : 0.5;
  const townscriptFee = grossRevenue > 0 ? (grossRevenue * 0.0399) + (attendees * townscriptFlat) : 0;

  // 3. Luma (lu.ma): 5.0% platform fee
  const lumaFee = grossRevenue * 0.05;

  // 4. URPASS: 0% per-ticket commission
  const urpassCommission = 0;

  // Maximum fee lost
  const maxLostFee = Math.max(eventbriteFee, townscriptFee, lumaFee);
  const avgLostFee = Math.round((eventbriteFee + townscriptFee + lumaFee) / 3);

  function formatMoney(amount: number) {
    if (currency === "INR") {
      return `₹${Math.round(amount).toLocaleString("en-IN")}`;
    }
    return `${cfg.symbol}${Math.round(amount).toLocaleString("en-US")}`;
  }

  function handleCurrencyChange(newCur: Currency) {
    setCurrency(newCur);
    setTicketPrice(CURRENCY_CONFIG[newCur].defaultPrice);
    setAttendees(CURRENCY_CONFIG[newCur].defaultAttendees);
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Percent className="w-3.5 h-3.5" />
              0% Ticket Commission Calculator
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              See How Much You Save on URPASS
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm mt-1">
              Legacy platforms take 4% to 7% of your gross ticket revenue. Calculate your exact savings.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl self-start sm:self-auto border border-white/10">
            {(["INR", "GBP", "USD"] as Currency[]).map((cur) => (
              <button
                key={cur}
                onClick={() => handleCurrencyChange(cur)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === cur
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {cur === "INR" ? "₹ INR" : cur === "GBP" ? "£ GBP" : "$ USD"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Controls & Results Grid */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Input 1: Ticket Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Average Ticket Price
              </label>
              <span className="text-base font-bold font-mono text-neutral-900 bg-neutral-100 px-3 py-1 rounded-lg">
                {cfg.symbol}{ticketPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={currency === "INR" ? 100 : 5}
              max={cfg.maxPrice}
              step={currency === "INR" ? 50 : 1}
              value={ticketPrice}
              onChange={(e) => setTicketPrice(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>{cfg.symbol}{currency === "INR" ? "100" : "5"}</span>
              <span>{cfg.symbol}{cfg.maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Input 2: Number of Expected Attendees */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Expected Attendees / Tickets Sold
              </label>
              <span className="text-base font-bold font-mono text-neutral-900 bg-neutral-100 px-3 py-1 rounded-lg">
                {attendees.toLocaleString()} tickets
              </span>
            </div>
            <input
              type="range"
              min={25}
              max={5000}
              step={25}
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>25 tickets</span>
              <span>5,000 tickets</span>
            </div>
          </div>

          {/* Gross Event Revenue Badge */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-neutral-500" />
              <div>
                <p className="text-xs text-neutral-500 font-medium">Estimated Gross Ticket Sales</p>
                <p className="text-lg font-black text-neutral-900 font-mono">
                  {formatMoney(grossRevenue)}
                </p>
              </div>
            </div>
            <span className="text-xs text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium">
              {attendees} × {cfg.symbol}{ticketPrice}
            </span>
          </div>

          {/* Fee Comparison Bars */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Platform Fee Deductions Compared
            </h3>

            {/* Eventbrite */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-800">Eventbrite</span>
                <span className="text-neutral-400 ml-1.5">(3.7% + per-ticket fee)</span>
              </div>
              <span className="font-mono font-bold text-rose-600">
                - {formatMoney(eventbriteFee)}
              </span>
            </div>

            {/* Townscript / Aggregator */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-800">Townscript</span>
                <span className="text-neutral-400 ml-1.5">(3.99% + fee)</span>
              </div>
              <span className="font-mono font-bold text-rose-600">
                - {formatMoney(townscriptFee)}
              </span>
            </div>

            {/* Luma */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-neutral-800">Luma (lu.ma)</span>
                <span className="text-neutral-400 ml-1.5">(5% platform cut)</span>
              </div>
              <span className="font-mono font-bold text-rose-600">
                - {formatMoney(lumaFee)}
              </span>
            </div>

            {/* URPASS */}
            <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 flex items-center justify-between text-xs shadow-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-950">URPASS</span>
                <span className="text-emerald-700 font-semibold ml-1 bg-emerald-200/60 px-2 py-0.5 rounded-full text-[10px]">
                  0% Commission
                </span>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                ₹0.00 Fee
              </span>
            </div>
          </div>
        </div>

        {/* Right Summary Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-violet-900 to-indigo-950 rounded-2xl p-6 sm:p-7 text-white flex flex-col justify-between shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Your Estimated Savings
            </div>

            <p className="text-xs text-violet-200 font-medium uppercase tracking-wider">
              Total Revenue Saved on URPASS
            </p>
            <p className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-1">
              {formatMoney(maxLostFee)}
            </p>
            <p className="text-xs text-violet-200/80 mt-2 leading-relaxed">
              That&apos;s money kept in your event budget instead of surrendered to ticketing platform commissions.
            </p>

            <div className="my-6 border-t border-white/10 pt-4 space-y-2.5 text-xs text-violet-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Keep 100% of your ticket revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct T+2 payouts straight to your bank</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sub-0.3s phone camera scanner included</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Permanent ₹0 Free tier available</span>
              </div>
            </div>
          </div>

          <Link
            href="/signup?ref=fee-calculator"
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-md group cursor-pointer"
          >
            <span>Create Free Event Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
