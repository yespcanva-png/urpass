"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  DollarSign,
  Info,
  Percent,
  Receipt,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function EventTicketingCostCalculator() {
  const [ticketPrice, setTicketPrice] = useState<number>(500);
  const [ticketCount, setTicketCount] = useState<number>(1000);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(5.0);
  const [gatewayFeePercent, setGatewayFeePercent] = useState<number>(2.0);
  const [gstPercent, setGstPercent] = useState<number>(18.0);

  // Financial calculations
  const grossRevenue = Math.max(0, ticketPrice * ticketCount);
  const platformFees = grossRevenue * (platformFeePercent / 100);
  const gatewayFees = grossRevenue * (gatewayFeePercent / 100);
  const gstOnFees = (platformFees + gatewayFees) * (gstPercent / 100);
  const totalDeductions = platformFees + gatewayFees + gstOnFees;
  const netEarnings = Math.max(0, grossRevenue - totalDeductions);

  // URPASS Model (0% ticket commission, direct Razorpay gateway, flat ₹999/mo plan)
  const urpassPlatformFees = 0;
  const urpassGatewayFees = gatewayFees; // same standard PG rate
  const urpassGstOnFees = urpassGatewayFees * (gstPercent / 100);
  const urpassSubscription = grossRevenue > 0 ? 999 : 0;
  const urpassNetEarnings = Math.max(
    0,
    grossRevenue - (urpassGatewayFees + urpassGstOnFees + urpassSubscription)
  );
  const extraMoneyKept = Math.max(0, urpassNetEarnings - netEarnings);

  function fmt(val: number) {
    return `₹${Math.round(val).toLocaleString("en-IN")}`;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Calculator Card */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-neutral-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Calculator className="w-3.5 h-3.5" />
                India Event Fee Breakdown
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Event Ticketing Fee &amp; Cost Calculator
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1">
                Enter your ticket economics below to see platform cuts, gateway deductions, GST, and net profit.
              </p>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-neutral-300 self-start sm:self-auto">
              GST SAC: 998596
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              1. Your Event Parameters
            </h3>

            {/* Ticket Price */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-neutral-800 mb-1.5">
                <label htmlFor="ticketPrice">Ticket Price (INR)</label>
                <span className="font-mono text-brand font-bold">{fmt(ticketPrice)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-sm">
                  ₹
                </span>
                <input
                  id="ticketPrice"
                  type="number"
                  min={0}
                  max={100000}
                  step={50}
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {/* Number of Tickets */}
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-neutral-800 mb-1.5">
                <label htmlFor="ticketCount">Number of Tickets</label>
                <span className="font-mono text-brand font-bold">{ticketCount.toLocaleString("en-IN")}</span>
              </div>
              <input
                id="ticketCount"
                type="number"
                min={1}
                max={50000}
                step={50}
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand mb-2"
              />
              <input
                type="range"
                min={50}
                max={10000}
                step={50}
                value={ticketCount}
                onChange={(e) => setTicketCount(Number(e.target.value))}
                className="w-full accent-brand cursor-pointer"
              />
            </div>

            {/* Platform Fee % */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-800">
                <label htmlFor="platformFee">Platform Commission Rate</label>
                <span className="font-mono font-bold text-rose-600">{platformFeePercent}%</span>
              </div>
              <input
                id="platformFee"
                type="range"
                min={0}
                max={12}
                step={0.5}
                value={platformFeePercent}
                onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <p className="text-[11px] text-neutral-500">
                Typical aggregators charge 4% to 8% per ticket sold.
              </p>
            </div>

            {/* Gateway Fee % */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-800">
                <label htmlFor="gatewayFee">Payment Gateway Fee (Razorpay / UPI)</label>
                <span className="font-mono font-bold text-neutral-900">{gatewayFeePercent}%</span>
              </div>
              <input
                id="gatewayFee"
                type="range"
                min={1.5}
                max={3.5}
                step={0.1}
                value={gatewayFeePercent}
                onChange={(e) => setGatewayFeePercent(Number(e.target.value))}
                className="w-full accent-neutral-800 cursor-pointer"
              />
              <p className="text-[11px] text-neutral-500">
                Standard payment gateway interchange fee in India is ~2.0% + GST.
              </p>
            </div>

            {/* GST Rate */}
            <div className="flex items-center justify-between text-xs font-medium text-neutral-600 px-1">
              <span>GST on Platform &amp; Payment Services</span>
              <span className="font-mono font-bold text-neutral-800">{gstPercent}% GST</span>
            </div>
          </div>

          {/* Results Comparison Section */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              2. Financial Deductions &amp; Net Earnings
            </h3>

            {/* Gross Revenue Card */}
            <div className="bg-neutral-900 text-white rounded-2xl p-5 shadow-xs">
              <span className="text-xs uppercase font-bold text-neutral-400">Total Ticket Revenue</span>
              <div className="text-3xl font-extrabold text-white font-mono mt-1">
                {fmt(grossRevenue)}
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                {ticketCount.toLocaleString("en-IN")} tickets × {fmt(ticketPrice)}
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-5 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-neutral-700">
                <span>Platform Commission ({platformFeePercent}%):</span>
                <span className="font-mono font-bold text-rose-600">-{fmt(platformFees)}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-700">
                <span>Payment Gateway ({gatewayFeePercent}%):</span>
                <span className="font-mono font-medium text-neutral-700">-{fmt(gatewayFees)}</span>
              </div>
              <div className="flex justify-between items-center text-neutral-700">
                <span>18% GST on Services:</span>
                <span className="font-mono font-medium text-neutral-700">-{fmt(gstOnFees)}</span>
              </div>
              <div className="border-t border-neutral-200 pt-2.5 flex justify-between items-center font-bold text-neutral-900">
                <span>Total Fees Deducted:</span>
                <span className="font-mono text-rose-600">-{fmt(totalDeductions)}</span>
              </div>
              <div className="border-t border-neutral-200 pt-2.5 flex justify-between items-center font-bold text-neutral-900 text-base">
                <span>Your Net Earnings:</span>
                <span className="font-mono text-neutral-900">{fmt(netEarnings)}</span>
              </div>
            </div>

            {/* URPASS Comparison Callout */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-brand-50/30 border-2 border-emerald-500/30 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold text-emerald-950">
                  See what the same event could look like with URPASS
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-neutral-500 block">URPASS Platform Cut:</span>
                  <span className="text-base font-extrabold text-emerald-600 font-mono">₹0 (0%)</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100">
                  <span className="text-neutral-500 block">Flat Software Fee:</span>
                  <span className="text-base font-extrabold text-neutral-900 font-mono">₹999/mo</span>
                </div>
              </div>

              <div className="bg-emerald-600 text-white rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-emerald-100 block">
                    Extra Profit Kept In Your Account:
                  </span>
                  <div className="text-2xl font-extrabold font-mono mt-0.5">
                    +{fmt(extraMoneyKept)}
                  </div>
                </div>
                <CheckCircle2 className="w-7 h-7 text-emerald-200" />
              </div>

              <div className="pt-2">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 w-full bg-neutral-900 text-white py-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-neutral-800 transition-colors"
                >
                  <span>Compare URPASS Pricing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
