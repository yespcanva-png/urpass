"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldAlert, Users, CalendarCheck, Zap, Headphones } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";
import { detectCountryClient } from "@/lib/country-config";
import { openRequestEventSetupModal } from "@/components/landing/RequestEventSetupModal";

interface Props {
  initialCountry?: "IN" | "GB";
}

export default function ManagedEventsSection({ initialCountry = "IN" }: Props) {
  const [country, setCountry] = useState<"IN" | "GB">(initialCountry);

  useEffect(() => {
    const detected = detectCountryClient();
    if (detected) setCountry(detected);

    const onCountryChanged = (e: Event) => {
      const custom = e as CustomEvent<{ country: "IN" | "GB" }>;
      if (custom.detail?.country) setCountry(custom.detail.country);
    };
    window.addEventListener("urpass_country_changed", onCountryChanged);
    return () => window.removeEventListener("urpass_country_changed", onCountryChanged);
  }, []);

  const isUk = country === "GB";

  const packages = [
    {
      id: "essential",
      name: "Essential",
      subtitle: "Simple event setup",
      price: isUk ? "£25" : "₹1,000",
      period: "per event",
      popular: false,
      desc: "For small meetups, workshops, and single-session events needing quick, accurate configuration.",
      features: [
        "Event configuration & basic scheduling",
        "Registration form setup (up to 5 fields)",
        "Standard digital QR ticket pass template",
        "Automated confirmation email dispatch",
        "Self-service scanner test run validation",
        "Email support during business hours",
      ],
      cta: "Request Event Setup",
      href: "/contact?subject=Request%20Event%20Setup%20-%20Essential%20Package&type=managed&package=essential",
    },
    {
      id: "professional",
      name: "Professional",
      subtitle: "Branded event setup",
      price: isUk ? "£99" : "₹5,000",
      period: "per event",
      popular: true,
      desc: "For college fests, conferences, and hackathons wanting custom branding and tailored pass tiers.",
      features: [
        "Everything in Essential, plus:",
        "Custom branded pass design with logo & theme",
        "Multiple ticket tiers (VIP, Speaker, Attendee)",
        "Custom registration fields with file uploads",
        "Payment gateway link & UPI test validation",
        "Staff scanner team orientation & walkthrough",
        "WhatsApp & priority email support",
      ],
      cta: "Request Event Setup",
      href: "/contact?subject=Request%20Event%20Setup%20-%20Professional%20Package&type=managed&package=professional",
    },
    {
      id: "business",
      name: "Business",
      subtitle: "Advanced event operations",
      price: isUk ? "£299" : "₹15,000",
      period: "per event",
      popular: false,
      desc: "For multi-track summits, exhibitions, and high-volume events requiring dedicated operational oversight.",
      features: [
        "Everything in Professional, plus:",
        "Multi-gate scanner routing & staff access setup",
        "Session-level QR permissions & tracking",
        "Attendee list data cleansing & bulk CSV import",
        "Pre-event entrance simulation & gate test",
        "Live event-day coordinator on active standby",
        "Comprehensive post-event attendance report",
      ],
      cta: "Request Event Setup",
      href: "/contact?subject=Request%20Event%20Setup%20-%20Business%20Package&type=managed&package=business",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      subtitle: "Custom and multi-event engagement",
      price: isUk ? "£799+" : "₹49,000+",
      period: "custom scope",
      popular: false,
      desc: "For universities, corporate networks, and event management agencies with multi-event calendars.",
      features: [
        "Annual or multi-event operational roadmap",
        "Dedicated UrPass technical account manager",
        "On-ground technical supervision at venue (select cities)",
        "Custom API, CRM & university ERP integration",
        "Tailored contract, GST compliance & billing",
        "Dedicated 24/7 emergency entrance hotline",
      ],
      cta: "Request Event Setup",
      href: "/contact?subject=Request%20Event%20Setup%20-%20Enterprise%20Package&type=managed&package=enterprise",
    },
  ];

  return (
    <section id="managed-events" className="py-16 sm:py-28 px-4 sm:px-8 bg-neutral-900 text-white relative">
      <div className="max-w-6xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-3">
              MANAGED EVENT PACKAGES
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Managed-Service Pricing
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Let the UrPass team handle your complete event setup — from forms and branded passes to ticket tiers and entry gate configuration.
            </p>
          </div>
        </AnimateIn>

        {/* 4 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch mb-10 sm:mb-12">
          {packages.map((pkg, i) => (
            <AnimateIn key={pkg.id} delay={i * 80} from="up">
              <div
                className={`relative rounded-3xl p-6 flex flex-col justify-between h-full transition-all ${
                  pkg.popular
                    ? "bg-neutral-950 border-2 border-violet-500 shadow-2xl shadow-violet-950/50"
                    : "bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold tracking-widest bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-3 py-1 rounded-full shadow-md uppercase">
                    MOST POPULAR
                  </span>
                )}

                <div>
                  <div className="mb-4">
                    <p className={`text-xs font-bold uppercase tracking-wider ${pkg.popular ? "text-violet-300" : "text-neutral-400"}`}>
                      {pkg.name}
                    </p>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">{pkg.subtitle}</p>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{pkg.price}</span>
                    <span className="text-xs text-neutral-400">{pkg.period}</span>
                  </div>

                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed min-h-[48px]">
                    {pkg.desc}
                  </p>

                  <div className="border-t border-neutral-800/80 pt-5 mb-6">
                    <p className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                      Package Inclusions:
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {pkg.features.map((feature, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${pkg.popular ? "text-violet-400" : "text-neutral-400"}`} />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openRequestEventSetupModal}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all text-center inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                    pkg.popular
                      ? "bg-violet-600 text-white hover:bg-violet-500 shadow-md"
                      : "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700"
                  }`}
                >
                  <span>{pkg.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Mandatory Explicit Fee Separation Disclosure Note */}
        <AnimateIn delay={100} from="up">
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 p-5 sm:p-6 text-neutral-400 text-xs sm:text-sm leading-relaxed flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white mb-1">Fee Separation &amp; Terms Disclosure</p>
              <p>
                Managed-service pricing is separate from software subscriptions, payment processing fees, and applicable taxes. Confirm inclusions before publishing.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/contact?subject=Book%20a%20Demo"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
              >
                <span>Book a Demo</span>
              </Link>
              <Link
                href="/contact?type=managed"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors"
              >
                <span>Talk to Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
