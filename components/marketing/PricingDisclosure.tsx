"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function PricingDisclosure() {
  return (
    <section className="py-16 md:py-20 bg-white border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-3">
            0% Ticket Commissions. Predictable Flat Fees.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            Unlike ticketing aggregators that take 5% to 10% of every ticket sold, UrPass gives you 100% of your revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Self-Service Subscription Tier */}
          <div className="rounded-3xl border border-neutral-200/90 bg-neutral-50/40 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 bg-white px-3 py-1 rounded-full border border-neutral-200">
                  Self-Service Subscriptions
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Direct Control
                </span>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 mb-1">Monthly Event Subscriptions</h3>
              <p className="text-xs text-neutral-600 mb-6">Create and publish events yourself using the UrPass dashboard.</p>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Free Tier</h4>
                    <p className="text-xs text-neutral-500">1 active event · 100 registrations/mo · No card required</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-emerald-700">₹0</span>
                    <span className="text-xs text-neutral-500"> forever</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Starter Tier</h4>
                    <p className="text-xs text-neutral-500">3 active events · 500 registrations/mo · CSV export</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-neutral-900">₹499</span>
                    <span className="text-xs text-neutral-500">/mo</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-violet-300 ring-1 ring-violet-200 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
                    POPULAR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Pro Tier</h4>
                    <p className="text-xs text-neutral-500">10 active events · 2,500 reg/mo · Custom pass designer</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-violet-700">₹999</span>
                    <span className="text-xs text-neutral-500">/mo</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Business Tier</h4>
                    <p className="text-xs text-neutral-500">Unlimited active events* · 10,000 reg/mo · Custom domain & API</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-neutral-900">₹2,499</span>
                    <span className="text-xs text-neutral-500">/mo</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200/80">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900 transition-colors"
              >
                <span>View complete self-service plan comparison</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Remote Managed Service Tier */}
          <div className="rounded-3xl border border-violet-300 bg-gradient-to-b from-violet-50/60 to-white p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-800 bg-violet-100 px-3 py-1 rounded-full border border-violet-200">
                  Remote Managed Packages
                </span>
                <span className="text-xs font-bold text-violet-700 bg-white px-2.5 py-0.5 rounded-full border border-violet-200">
                  Per-Event Setup
                </span>
              </div>

              <h3 className="text-xl font-bold text-neutral-900 mb-1">Done-For-You Remote Configuration</h3>
              <p className="text-xs text-neutral-600 mb-6">Our operations team configures tickets, forms, passes, and scanner orientations.</p>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-violet-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Essential Package</h4>
                    <p className="text-xs text-neutral-500">Up to 1,000 attendees · Basic form & pass setup</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-neutral-900">₹2,999</span>
                    <span className="text-xs text-neutral-500">/event</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-violet-300 ring-1 ring-violet-200 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-violet-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
                    MOST REQUESTED
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Pro Package</h4>
                    <p className="text-xs text-neutral-500">Up to 5,000 attendees · Custom pass design, VIP tiers & staff training</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-violet-700">₹7,999</span>
                    <span className="text-xs text-neutral-500">/event</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-violet-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Premium Package</h4>
                    <p className="text-xs text-neutral-500">Up to 15,000 attendees · Multi-gate routing & active live standby</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-neutral-900">₹14,999</span>
                    <span className="text-xs text-neutral-500">/event</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-violet-100 flex items-center justify-between text-xs text-neutral-600">
              <span>Need 15,000+ or annual multi-event scope?</span>
              <strong className="text-violet-800">Enterprise Quote</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
