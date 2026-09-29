"use client";

import { Zap, ShieldCheck, CreditCard, Smartphone, Check } from "lucide-react";

export default function HeroTrustBanner() {
  const items = [
    {
      icon: Zap,
      label: "0.28s Gate Check-In",
      desc: "Sub-second camera scan with offline failover",
      badge: "Zero Queues",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    {
      icon: ShieldCheck,
      label: "Anti-Duplicate Shield",
      desc: "Cryptographic QR tokens prevent screenshot reuse",
      badge: "100% Verified",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    {
      icon: CreditCard,
      label: "Direct Razorpay Payouts",
      desc: "UK (GBP £) & India (INR ₹) with 0% platform cut",
      badge: "Direct Settlement",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
    },
    {
      icon: Smartphone,
      label: "Apple & Google Wallet",
      desc: "1-tap pass storage with zero app installation",
      badge: "Native Pass",
      badgeColor: "bg-neutral-100 text-neutral-800 border-neutral-200/80",
    },
  ];

  return (
    <div className="w-full mt-12 sm:mt-16 pt-8 border-t border-neutral-200/70">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="group relative flex flex-col p-4 sm:p-5 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 hover:bg-white hover:border-neutral-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 text-neutral-800" />
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">
                {item.label}
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed mt-1">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
