"use client";

import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

// Must match PLANS in app/billing/page.tsx
const PLAN_PRICES: Record<string, { priceMonthly: number; annualTotal: number }> = {
  starter:  { priceMonthly: 499,  annualTotal: 4990 },
  pro:      { priceMonthly: 999,  annualTotal: 9990 },
  business: { priceMonthly: 2499, annualTotal: 24990 },
};

interface Props {
  planSlug: string;
  planName: string;
  billingCycle?: "monthly" | "annual";
  userEmail: string;
  userName: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function CheckoutButton({
  planSlug, planName,
  billingCycle = "monthly",
  userEmail, userName,
  children, className = "", style,
}: Props) {
  const [open, setOpen] = useState(false);
  const prices = PLAN_PRICES[planSlug] ?? { priceMonthly: 0, annualTotal: 0 };

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
        priceMonthly={prices.priceMonthly}
        annualTotal={prices.annualTotal}
      />
    </>
  );
}
