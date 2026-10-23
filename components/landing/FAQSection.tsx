"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { detectCountryClient } from "@/lib/country-config";

interface Props {
  initialCountry?: "IN" | "GB";
}

export default function FAQSection({ initialCountry = "IN" }: Props) {
  const [open, setOpen] = useState<number | null>(null);
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

  const faqs = [
    {
      q: "What is the difference between Self-Service and Managed Events?",
      a: "With Self-Service, you use our intuitive dashboard to create events, configure registration forms, issue passes, and scan attendees yourself on any phone. With Managed Events, our specialist team takes care of the technical setup for you — configuring forms, designing branded tickets, setting up payment gateways, and training your gate crew.",
    },
    {
      q: "What is included in the Managed Event Setup packages?",
      a: isUk
        ? "We offer four managed tiers: Essential (£25) for simple event configuration and forms; Professional (£99) for branded pass designs and scanner team training; Business (£299) for multi-gate operations and live event-day standby; and Enterprise (£799+) for custom multi-event management with dedicated account management."
        : "We offer four managed tiers: Essential (₹1,000) for simple event setup and forms; Professional (₹5,000) for custom branded passes, payment links, and team training; Business (₹15,000) for multi-gate operations, bulk imports, and live event-day standby; and Enterprise (₹49,000+) for multi-event custom operational roadmaps with on-ground technical assistance.",
    },
    {
      q: "Are managed-service fees separate from software subscriptions?",
      a: "Yes. Managed-service pricing covers our specialist setup and operational support services and is separate from software subscriptions, payment gateway processing fees, and applicable taxes. You can confirm all inclusions with our team before publishing.",
    },
    {
      q: "Do attendees need an app or account to receive their QR pass?",
      a: "No. Attendees register through a simple browser link and receive their pass via email or instant link. The digital pass displays immediately in mobile Safari, Chrome, or any browser without downloading an app or creating a password.",
    },
    {
      q: "How does the entry scanner work, and what hardware is needed?",
      a: "Staff members simply open our scanner web page on any iPhone, Android phone, or tablet camera. The camera scans the QR pass in under 0.3 seconds. No dedicated hardware or barcode scanners are required.",
    },
    {
      q: "Can a QR pass be scanned or shared twice?",
      a: "No. Each QR pass contains a cryptographically signed unique token that is atomically checked in on our servers. If someone attempts to scan an already checked-in pass, the scanner immediately flashes an 'Already Checked In' warning with the original check-in timestamp and gate name.",
    },
    {
      q: "How does UrPass pricing work for organizers?",
      a: isUk
        ? "Organizers can choose self-service monthly subscriptions: Starter (£15/mo), Pro (£35/mo), or Business (£79/mo) with direct activation and cancel-anytime renewal. Alternatively, one-off event passes (£5 / £10 / £19) are available if you only host occasional events."
        : "Organizers can choose self-service plans (Starter ₹499/mo, Pro ₹999/mo, Business ₹2,499/mo) with transparent cancel-anytime renewal. Alternatively, single event passes (₹299 / ₹599 / ₹999) are available for one-off events.",
    },
    {
      q: "Does UrPass take a cut of my ticket sales?",
      a: "No. UrPass charges zero per-ticket commission fees. You connect your own Razorpay account (or Stripe for UK) and receive 100% of your ticket revenue directly into your bank account.",
    },
  ];

  return (
    <section id="faqs" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-t border-neutral-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-brand block mb-2">GOT QUESTIONS?</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Everything you need to know about UrPass self-service software and managed event packages.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-neutral-100 border-y border-neutral-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-brand transition-colors"
              >
                <span className="text-sm sm:text-base font-semibold text-neutral-900">
                  {faq.q}
                </span>
                <span className="shrink-0 text-neutral-400">
                  {open === i ? (
                    <Minus className="w-4 h-4 text-brand" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              {open === i && (
                <p className="pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
