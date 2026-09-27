"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import CheckoutModal from "./CheckoutModal";

interface Props {
  isLoggedIn: boolean;
  userEmail?: string | null;
  userName?: string | null;
  className?: string;
  variant?: "gradient" | "white" | "billing";
  children?: React.ReactNode;
}

export default function FounderCheckoutCta({
  isLoggedIn,
  userEmail,
  userName,
  className = "",
  variant = "gradient",
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  // Auto-open if redirected back from login with ?claim=true or ?checkout=true
  useEffect(() => {
    if (isLoggedIn && (searchParams.get("claim") === "true" || searchParams.get("checkout") === "true")) {
      setOpen(true);
    }
  }, [isLoggedIn, searchParams]);

  if (!isLoggedIn) {
    const signupHref = "/signup?next=" + encodeURIComponent("/founder-lifetime-deal?claim=true");
    if (children) {
      return (
        <Link href={signupHref} className={className}>
          {children}
        </Link>
      );
    }

    if (variant === "white") {
      return (
        <Link
          href={signupHref}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-neutral-950 hover:bg-neutral-100 shadow-xl transition-all inline-flex items-center justify-center gap-2 ${className}`}
        >
          <span>Claim Lifetime Access — ₹19,999</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      );
    }

    return (
      <Link
        href={signupHref}
        className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand to-purple-600 hover:from-brand-light hover:to-purple-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all transform active:scale-95 text-center ${className}`}
      >
        <span>Claim Founder Account</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          children
            ? className
            : variant === "white"
            ? `w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-neutral-950 hover:bg-neutral-100 shadow-xl transition-all inline-flex items-center justify-center gap-2 ${className}`
            : variant === "billing"
            ? `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-purple-600 hover:from-brand-light hover:to-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg active:scale-95 text-center whitespace-nowrap ${className}`
            : `inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand to-purple-600 hover:from-brand-light hover:to-purple-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all transform active:scale-95 text-center ${className}`
        }
      >
        {children ? (
          children
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Pay &amp; Claim Founder Account — ₹19,999</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <CheckoutModal
        isOpen={open}
        onClose={() => setOpen(false)}
        planSlug="founder"
        planName="Founder Lifetime"
        billingCycle="lifetime"
        userEmail={userEmail ?? ""}
        userName={userName ?? ""}
        priceMonthly={19999}
        annualTotal={19999}
      />
    </>
  );
}
