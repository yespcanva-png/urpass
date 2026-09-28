"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
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
    <>
      <button
        type="button"
        onClick={handleAction}
        disabled={loading}
        className={
          children
            ? className
            : variant === "white"
            ? `w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-xs bg-white text-neutral-950 hover:bg-neutral-100 shadow-xs transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 ${className}`
            : variant === "billing"
            ? `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs transition-colors shadow-xs text-center whitespace-nowrap disabled:opacity-50 ${className}`
            : `inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-xs bg-white text-neutral-950 hover:bg-neutral-100 shadow-xs transition-colors text-center disabled:opacity-50 ${className}`
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
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pay &amp; Claim Founder Account — {founderPriceText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
