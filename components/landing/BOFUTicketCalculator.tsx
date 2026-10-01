"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2, Percent, Sparkles, TrendingUp } from "lucide-react";

interface BOFUTicketCalculatorProps {
  currency?: "INR" | "GBP";
  defaultTicketPrice?: number;
  defaultAttendees?: number;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
}

export default function BOFUTicketCalculator({
  currency = "INR",
  defaultTicketPrice = currency === "GBP" ? 25 : 500,
  defaultAttendees = 2000,
  primaryCtaLabel = "Start selling tickets",
  primaryCtaHref = "/signup",
}: BOFUTicketCalculatorProps) {
  const isUk = currency === "GBP";
  const sym = isUk ? "£" : "₹";

  const [ticketPrice, setTicketPrice] = useState<number>(defaultTicketPrice);
  const [attendees, setAttendees] = useState<number>(defaultAttendees);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(5.0);

  const grossRevenue = Math.max(0, ticketPrice * attendees);
  const platformFeeDeducted = Math.round(grossRevenue * (platformFeePercent / 100));
  const urpassPlatformFee = 0; // 0% per-ticket commission
  const netSavings = platformFeeDeducted;

  function fmt(val: number) {
    if (isUk) {
      return `£${Math.round(val).toLocaleString("en-GB")}`;
    }
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-neutral-900 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Percent className="w-3.5 h-3.5" />
              Interactive Fee Comparison
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ticket Revenue Calculator
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              See how much revenue percentage-based platform fees take from your event.
            </p>
          </div>
          <div className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-neutral-300 self-start sm:self-auto">
            0% Ticket Commission
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Ticket Price */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold text-neutral-800 mb-2">
              <span>Ticket price</span>
              <span className="font-mono text-brand font-bold">{fmt(ticketPrice)}</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-sm">
                {sym}
              </span>
              <input
                type="number"
                min={0}
                max={isUk ? 500 : 50000}
                step={isUk ? 1 : 50}
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          {/* Attendees */}
          <div>
            <div className="flex justify-between items-center text-sm font-semibold text-neutral-800 mb-2">
              <span>Expected attendees</span>
              <span className="font-mono text-brand font-bold">{attendees.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={50}
              max={10000}
              step={50}
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1 font-mono">
              <span>50</span>
              <span>2,000</span>
              <span>5,000</span>
              <span>10,000+</span>
            </div>
          </div>

          {/* Platform fee input */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-700">
              <span>Example percentage platform fee</span>
              <span className="font-mono font-bold text-neutral-900">{platformFeePercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={2}
                max={10}
                step={0.5}
                value={platformFeePercent}
                onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                className="w-full accent-neutral-800 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-neutral-500 leading-tight">
              Most commission-based portals charge between 4% and 8% per ticket, plus convenience fees.
            </p>
          </div>
        </div>

        {/* Output & Comparison */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-gradient-to-br from-neutral-50 via-white to-brand-50/20 rounded-2xl border border-neutral-200/80 p-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">Gross Event Revenue</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-0.5 font-mono">
                {fmt(grossRevenue)}
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-3 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Traditional {platformFeePercent}% platform fee:</span>
                <span className="font-mono font-semibold text-rose-600">-{fmt(platformFeeDeducted)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-neutral-900 bg-white p-2 rounded-xl border border-neutral-100">
                <span className="flex items-center gap-1.5 text-brand">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  URPASS per-ticket fee:
                </span>
                <span className="font-mono text-emerald-600">{fmt(urpassPlatformFee)} (0%)</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200/70 rounded-xl p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Revenue Kept With URPASS
                </span>
                <span className="text-xs font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  +{fmt(netSavings)}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1">
                URPASS charges flat software pricing (starting at {isUk ? "£0/mo" : "₹0/mo"}), not a cut of your hard-earned ticket sales.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-5 border-t border-neutral-200 mt-4 text-center sm:text-left">
            <h4 className="text-sm font-bold text-neutral-900 mb-1">
              Keep more of your ticket revenue.
            </h4>
            <Link
              href={primaryCtaHref}
              className="inline-flex items-center justify-center gap-2 w-full bg-neutral-900 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <span>{primaryCtaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
