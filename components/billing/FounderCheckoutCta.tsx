"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Loader2, AlertCircle, Sparkles } from "lucide-react";
import CheckoutModal from "./CheckoutModal";
import { detectCountryClient } from "@/lib/country-config";
import { activateUkPlan } from "@/app/actions/billing";

interface Props {
  isLoggedIn: boolean;
  userEmail?: string | null;
  userName?: string | null;
  className?: string;
  variant?: "gradient" | "white" | "billing";
  country?: "IN" | "GB";
  children?: React.ReactNode;
}

export default function FounderCheckoutCta({
  isLoggedIn,
  userEmail,
  userName,
  className = "",
  variant = "gradient",
  country: propCountry,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [country, setCountry] = useState<"IN" | "GB">(propCountry || "IN");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!propCountry) {
      setCountry(detectCountryClient());
    }
  }, [propCountry]);

  const isUk = country === "GB";
  const founderPriceText = isUk ? "£249" : "₹19,999";

  // Auto-open if redirected back from login with ?claim=true or ?checkout=true
  useEffect(() => {
    if (isLoggedIn && (searchParams.get("claim") === "true" || searchParams.get("checkout") === "true")) {
      setOpen(true);
    }
  }, [isLoggedIn, searchParams]);

  function handleAction() {
    setError("");
    setOpen(true);
  }

  if (!isLoggedIn) {
    const signupHref =
      "/signup?from=founder-lifetime-deal&next=" +
      encodeURIComponent("/billing?claim=true");
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
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-xs bg-white text-neutral-950 hover:bg-neutral-100 shadow-xs transition-colors inline-flex items-center justify-center gap-2 ${className}`}
        >
          <span>Claim Lifetime Access — {founderPriceText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      );
    }

    return (
      <Link
        href={signupHref}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs bg-white text-neutral-950 hover:bg-neutral-100 shadow-xs transition-colors text-center ${className}`}
      >
        <span>Claim Founder Account</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-center sm:items-start gap-1.5">
      <button
        type="button"
        onClick={handleAction}
        disabled={loading}
        className={
          children
            ? className
            : variant === "white"
            ? `w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-neutral-950 hover:bg-neutral-100 shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 ${className}`
            : variant === "billing"
            ? `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand to-purple-700 hover:opacity-90 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95 text-center whitespace-nowrap disabled:opacity-50 ${className}`
            : `inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand to-purple-600 hover:opacity-90 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all transform active:scale-95 text-center disabled:opacity-50 ${className}`
        }
      >
        {children ? (
          children
        ) : loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Claiming Founder Access...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Pay &amp; Claim Founder Account — {founderPriceText}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {error && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-300 text-xs mt-1">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <CheckoutModal
        isOpen={open}
        onClose={() => setOpen(false)}
        planSlug="founder"
        planName="Founder Lifetime"
        billingCycle="lifetime"
        userEmail={userEmail ?? ""}
        userName={userName ?? ""}
        currency={isUk ? "GBP" : "INR"}
        priceMonthly={isUk ? 249 : 19999}
        annualTotal={isUk ? 249 : 19999}
      />
    </div>
  );
}
