"use client";

import Link from "next/link";
import { persistCountryPreference } from "@/lib/country-config";

interface Props {
  currentCountry: "IN" | "GB";
}

export default function BillingMarketSwitcher({ currentCountry }: Props) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="inline-flex items-center bg-white/10 p-1 rounded-xl gap-1 text-xs">
        <Link
          href="/billing?country=IN"
          onClick={() => persistCountryPreference("IN")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            currentCountry === "IN"
              ? "bg-white text-neutral-900 shadow-sm font-semibold"
              : "text-white/60 hover:text-white"
          }`}
        >
          🇮🇳 India (INR ₹)
        </Link>
        <Link
          href="/billing?country=GB"
          onClick={() => persistCountryPreference("GB")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            currentCountry === "GB"
              ? "bg-white text-neutral-900 shadow-sm font-semibold"
              : "text-white/60 hover:text-white"
          }`}
        >
          🇬🇧 United Kingdom (GBP £)
        </Link>
      </div>
    </div>
  );
}
