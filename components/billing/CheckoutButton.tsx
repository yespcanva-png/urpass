"use client";

import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

// Must match PLANS in app/billing/page.tsx
const PLAN_PRICES_INR: Record<string, { priceMonthly: number; annualTotal: number }> = {
  starter:  { priceMonthly: 499,   annualTotal: 4990 },
  pro:      { priceMonthly: 999,   annualTotal: 9990 },
  business: { priceMonthly: 2499,  annualTotal: 24990 },
  founder:  { priceMonthly: 19999, annualTotal: 19999 },
  lifetime: { priceMonthly: 19999, annualTotal: 19999 },
};

const PLAN_PRICES_GBP: Record<string, { priceMonthly: number; annualTotal: number }> = {
  starter:  { priceMonthly: 15,  annualTotal: 120 },
  pro:      { priceMonthly: 35,  annualTotal: 300 },
  business: { priceMonthly: 79,  annualTotal: 699 },
  founder:  { priceMonthly: 249, annualTotal: 249 },
  lifetime: { priceMonthly: 249, annualTotal: 249 },
};

interface Props {
  planSlug: string;
  planName: string;
  billingCycle?: "monthly" | "annual" | "lifetime";
  userEmail: string;
  userName: string;
  currency?: "INR" | "GBP";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function CheckoutButton({
  planSlug, planName,
  billingCycle = "monthly",
  userEmail, userName,
  currency = "INR",
  children, className = "", style,
}: Props) {
  const [open, setOpen] = useState(false);
  const isUk = (currency || "").toUpperCase() === "GBP";
  const priceMap = isUk ? PLAN_PRICES_GBP : PLAN_PRICES_INR;
  const prices = priceMap[planSlug] ?? { priceMonthly: 0, annualTotal: 0 };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center gap-2 ${className}`}
        style={style}
      >
        {children}
      </button>

      <CheckoutModal
        isOpen={open}
        onClose={() => setOpen(false)}
        planSlug={planSlug}
        planName={planName}
        billingCycle={billingCycle}
        userEmail={userEmail}
        userName={userName}
        currency={currency}
        priceMonthly={prices.priceMonthly}
        annualTotal={prices.annualTotal}
      />
    </>
  );
}
