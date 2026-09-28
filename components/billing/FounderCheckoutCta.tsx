"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
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
      if (isUk) {
        handleUkClaim();
      } else {
        setOpen(true);
      }
    }
  }, [isLoggedIn, searchParams, isUk]);

  async function handleUkClaim() {
    setLoading(true);
    try {
      const res = await activateUkPlan("founder", "lifetime");
      if (res?.error) {
        alert(res.error);
        setLoading(false);
      } else {
        router.push("/billing?claim=success");
        router.refresh();
      }
    } catch {
      alert("Failed to activate Founder account. Please contact support.");
      setLoading(false);
    }
  }

  function handleAction() {
    if (isUk) {
      handleUkClaim();
    } else {
      setOpen(true);
    }
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
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-neutral-950 hover:bg-neutral-100 shadow-xl transition-all inline-flex items-center justify-center gap-2 ${className}`}
        >
          <span>Claim Lifetime Access — {founderPriceText}</span>
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
        onClick={handleAction}
        disabled={loading}
        className={
          children
            ? className
            : variant === "white"
            ? `w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm bg-white text-neutral-950 hover:bg-neutral-100 shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 ${className}`
            : variant === "billing"
            ? `inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand to-purple-600 hover:from-brand-light hover:to-purple-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg active:scale-95 text-center whitespace-nowrap disabled:opacity-50 ${className}`
            : `inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-brand to-purple-600 hover:from-brand-light hover:to-purple-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all transform active:scale-95 text-center disabled:opacity-50 ${className}`
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

      {!isUk && (
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
      )}
    </>
  );
}
