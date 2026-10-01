"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { detectCountryClient } from "@/lib/country-config";

interface Props {
  initialCountry?: "IN" | "GB";
}

export default function HeroBanner({ initialCountry = "IN" }: Props) {
  const [country, setCountry] = useState<"IN" | "GB">(initialCountry);

  useEffect(() => {
    const detected = detectCountryClient();
    if (detected) {
      setCountry(detected);
    }

    const onCountryChanged = (e: Event) => {
      const custom = e as CustomEvent<{ country: "IN" | "GB" }>;
      if (custom.detail?.country) {
        setCountry(custom.detail.country);
      }
    };
    window.addEventListener("urpass_country_changed", onCountryChanged);
    return () => window.removeEventListener("urpass_country_changed", onCountryChanged);
  }, []);

  const isUk = country === "GB";

  return (
    <Link
      href="/platform"
      className="hero-badge group relative inline-flex items-center gap-2.5 sm:gap-3 p-1 pr-3 sm:pr-4 rounded-full border border-neutral-200/90 bg-white/95 hover:bg-white hover:border-neutral-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(109,40,217,0.12)] transition-all duration-300 max-w-full text-xs"
      aria-label="Learn more about Conference & Agenda Management"
    >
      {/* Shimmer gradient highlight */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-brand-100/40 to-transparent -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
      </div>

      {/* Pulsing Pill Tag */}
      <span className="relative inline-flex items-center gap-1.5 font-semibold text-white bg-neutral-900 px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase shrink-0 shadow-xs">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
        </span>
        <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
        <span>New Release</span>
      </span>

      {/* Main Copy */}
      <span className="text-neutral-700 font-medium truncate text-[11px] sm:text-xs">
        <span className="font-semibold text-neutral-900">Conference &amp; Agenda Management</span>
        <span className="mx-1.5 text-neutral-300">·</span>
        <span>Multi-Track Schedule, Speakers &amp; Digital Passes</span>
      </span>

      {/* Arrow Icon */}
      <span className="inline-flex items-center gap-0.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all text-xs shrink-0 font-medium ml-auto">
        <span className="hidden md:inline text-[11px] text-neutral-500 font-normal">Learn More</span>
        <ArrowRight className="w-3 h-3" />
      </span>
    </Link>
  );
}
