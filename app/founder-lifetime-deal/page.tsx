import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import { createClient } from "@/lib/supabase/server";
import FounderCheckoutCta from "@/components/billing/FounderCheckoutCta";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Flame,
  HelpCircle,
  Layers,
  QrCode,
  ScanLine,
  BarChart3,
  Palette,
  Users,
  Smartphone,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS Founder Lifetime Plan — ₹19,999 One-Time Access",
  description:
    "Get lifetime access to all currently available URPASS features for a one-time payment of ₹19,999. Zero renewal fees. Strictly limited to the first 20 customers.",
  keywords: [
    "URPASS lifetime deal",
    "event management lifetime plan",
    "founder lifetime access event ticketing",
    "one time payment event registration",
    "zero subscription event ticketing software",
    "event qr check in lifetime deal",
  ],
  alternates: { canonical: "https://urpass.space/founder-lifetime-deal" },
  openGraph: {
    title: "URPASS Founder Lifetime Plan | ₹19,999 One-Time Access",
    description:
      "Exclusive Founder Lifetime Plan: Permanent access to all current URPASS features for ₹19,999. Valid for the lifetime of URPASS. Limited to 20 accounts only.",
    url: "https://urpass.space/founder-lifetime-deal",
    locale: "en_IN",
    type: "website",
  },
};

const includedFeatures = [
  {
    icon: Layers,
    title: "Unlimited Events Creation",
    desc: "Host technical symposiums, cultural fests, corporate conferences, and workshops without monthly event count caps.",
  },
  {
    icon: Palette,
    title: "Full Ticket Studio Designer",
    desc: "Complete visual drag-and-drop designer for branded digital passes, custom badges, sponsor banners, and custom shapes.",
  },
  {
    icon: ScanLine,
    title: "Sub-Second In-Browser Scanner",
    desc: "Ultra-fast (<0.3s) QR scanning on any smartphone or hardware laser gun (Zebra, Honeywell) with audio & haptic feedback.",
  },
  {
    icon: Smartphone,
    title: "Screen Wake Lock & Low-Light Torch",
    desc: "Enterprise gate tools including display sleep prevention, continuous auto-focus, and camera flashlight toggle.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Gate & Anti-Duplicate Security",
    desc: "Sub-50ms atomic distributed validation across unlimited gates preventing double-entry and counterfeit tickets.",
  },
  {
    icon: Zap,
    title: "Resilient Offline Sync Mode",
    desc: "IndexedDB manifest caching and automatic background sync queueing for venues with zero cellular or Wi-Fi connectivity.",
  },
  {
    icon: QrCode,
    title: "Custom Form Builder & QR Passes",
    desc: "Custom attendee registration fields, auto-approval workflows, instant digital QR pass issuance, and direct WhatsApp sharing.",
  },
  {
    icon: BarChart3,
    title: "Realtime Analytics & CSV Exports",
    desc: "Live check-in velocity, gate breakdown charts, attendance percentages, and one-click full attendee CSV data exports.",
  },
  {
    icon: Users,
    title: "Team & Check-In Staff Access",
    desc: "Add multiple event organizers and gate check-in volunteers with restricted gate roles across your organization.",
  },
];

const faqs = [
  {
    q: "What exactly is the URPASS Founder Lifetime Plan?",
    a: "The Founder Lifetime Plan grants you permanent access to all currently available URPASS event management, ticketing, and scanning features for a single one-time payment of ₹19,999 (+GST). There are zero monthly or annual renewal fees.",
  },
  {
    q: "How many Lifetime Accounts are available?",
    a: "Only exactly 20 Lifetime Accounts will ever be issued under this founder cohort. Once all 20 spots are claimed, this offer will close permanently.",
  },
  {
    q: "How long is this lifetime license valid?",
    a: "Your license is valid for the operational lifetime of the URPASS platform with no expiration date, no renewal invoices, and no recurring subscriptions.",
  },
  {
    q: "What features are included in this plan?",
    a: "The plan covers all features currently available on the URPASS platform at the time of purchase — including unlimited events, Ticket Studio pass design, sub-second scanning, multi-gate check-in, offline sync, custom forms, Razorpay payments integration, and realtime analytics.",
  },
  {
    q: "What is not included in the lifetime plan?",
    a: "Future standalone premium products, new third-party integrations, enterprise custom add-ons, or major newly introduced products released in subsequent years may be billed separately. Additionally, third-party pass-through costs (such as Razorpay's standard ~2% payment processing fee, external WhatsApp Cloud API fees, and custom SMS/email overages) are paid directly to those respective service providers.",
  },
  {
    q: "How do I claim one of the 20 Founder accounts?",
    a: "You can click 'Claim Founder Account' below to complete the one-time payment, or reach out directly to the founding team on WhatsApp or via email at srinithin@yespstudio.com for instant account provisioning and GST invoice generation.",
  },
];

export default async function FounderLifetimeDealPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);
  const userEmail = user?.email ?? null;
  const userName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "URPASS Founder Lifetime Plan",
        description:
          "Permanent access to all currently available URPASS event registration and check-in features for a one-time payment of ₹19,999. Valid for the lifetime of URPASS. Limited to 20 customers only.",
        brand: { "@type": "Brand", name: "URPASS" },
        offers: {
          "@type": "Offer",
          price: "19999",
          priceCurrency: "INR",
          availability: "https://schema.org/LimitedAvailability",
          url: "https://urpass.space/founder-lifetime-deal",
          validFrom: "2026-09-01",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://urpass.space" },
          { "@type": "ListItem", position: 2, name: "Pricing", item: "https://urpass.space/pricing" },
          { "@type": "ListItem", position: 3, name: "Founder Lifetime Plan", item: "https://urpass.space/founder-lifetime-deal" },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white selection:bg-brand selection:text-white pt-24 pb-20 overflow-hidden">
        {/* Ambient background glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-brand/20 blur-[140px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Scarcity Pill */}
          <AnimateIn>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>STRICTLY LIMITED TO 20 CUSTOMERS ONLY</span>
              </span>
            </div>
          </AnimateIn>

          {/* Hero Header */}
          <AnimateIn delay={50}>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                URPASS Founder <br />
                <span className="bg-gradient-to-r from-purple-400 via-brand-light to-amber-300 bg-clip-text text-transparent">
                  Lifetime Plan
                </span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8">
                Get full access to all <strong className="text-white">currently available URPASS features</strong> for a single one-time payment of{" "}
                <span className="text-amber-300 font-bold">₹19,999</span>. Never pay a monthly or annual subscription fee again.
              </p>
            </div>
          </AnimateIn>

          {/* Pricing Highlight Card */}
          <AnimateIn delay={100}>
            <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl mb-16 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-3xl rounded-full pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-white/10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Permanent Operational License</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                    ₹19,999{" "}
                    <span className="text-base font-normal text-neutral-400">
                      one-time (+GST)
                    </span>
                  </h2>
                  <p className="text-sm text-neutral-400">
                    No recurring fees · No renewal invoices · Valid for the lifetime of URPASS
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <FounderCheckoutCta
                    isLoggedIn={isLoggedIn}
                    userEmail={userEmail}
                    userName={userName}
                    variant="gradient"
                  />

                  <a
                    href="https://wa.me/919944621539?text=Hi%20Srinithin%2C%20I%20am%20interested%20in%20claiming%20one%20of%20the%2020%20URPASS%20Founder%20Lifetime%20Accounts%20(₹19%2C999)."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Talk on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">All Current Features</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Full access to unlimited events, Ticket Studio, scanner, and forms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">Zero Renewal Fees</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Never pay a monthly or annual subscription invoice again.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">Lifetime Validity</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Valid for the full operational lifespan of the URPASS platform.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">20 Accounts Max</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Strictly capped founder cohort with direct founding team support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Included Features Grid */}
          <div className="mb-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                What's Included in Your Lifetime License
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Every tool built into URPASS today is yours without ongoing software subscription fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {includedFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all hover:bg-white/[0.05]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand-light mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1.5">{feat.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Important Transparent Boundaries Box */}
          <AnimateIn delay={150}>
            <div className="bg-amber-500/[0.06] border border-amber-500/20 rounded-3xl p-6 sm:p-8 mb-16">
              <div className="flex items-center gap-2.5 text-amber-300 font-semibold text-sm mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>Important Terms & Feature Scope</span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                <p>
                  • <strong>Feature Scope:</strong> This lifetime plan covers all features available at the time of purchase. Future major standalone products, premium add-ons, or custom enterprise integrations introduced in later versions may be charged separately.
                </p>
                <p>
                  • <strong>Third-Party Pass-Through Costs:</strong> External pass-through services — such as Razorpay payment gateway transaction charges (~2%), WhatsApp Business Cloud API template message costs, transactional SMS, and high-volume email overages — are third-party operational fees and are paid to the respective providers.
                </p>
                <p>
                  • <strong>Strict 20-Customer Limit:</strong> To preserve service quality and dedicated engineering support, exactly 20 Founder Lifetime accounts will be released.
                </p>
              </div>
            </div>
          </AnimateIn>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Everything you need to know about the URPASS Founder Lifetime Plan.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5"
                >
                  <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Claim CTA Banner */}
          <AnimateIn delay={200}>
            <div className="text-center bg-gradient-to-r from-brand/20 via-purple-900/30 to-brand/20 border border-brand/30 rounded-3xl p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to secure your Founder Lifetime Account?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto mb-6">
                Join our exclusive founding organizer cohort. Claim your spot before the 20-account allocation is exhausted.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <FounderCheckoutCta
                  isLoggedIn={isLoggedIn}
                  userEmail={userEmail}
                  userName={userName}
                  variant="white"
                />
                <a
                  href="mailto:srinithin@yespstudio.com?subject=URPASS%20Founder%20Lifetime%20Plan%20Inquiry"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white transition-all border border-white/15"
                >
                  Email Founder Directly
                </a>
              </div>
            </div>
          </AnimateIn>
        </div>
      </main>

      <Footer />
    </>
  );
}
