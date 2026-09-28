import type { Metadata } from "next";
import Link from "next/link";
import { headers, cookies } from "next/headers";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import { createClient } from "@/lib/supabase/server";
import FounderCheckoutCta from "@/components/billing/FounderCheckoutCta";
import FounderSpotCounter from "@/components/billing/FounderSpotCounter";
import { detectCountryFromHeaders } from "@/lib/country-config";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  HelpCircle,
  Layers,
  QrCode,
  ScanLine,
  BarChart3,
  Palette,
  Users,
  Smartphone,
  MessageCircle,
  Globe,
  Send,
  IndianRupee,
  Banknote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "URPASS Founder Lifetime Plan — Permanent Operational Access",
  description:
    "Get lifetime access to all currently available URPASS features for a one-time payment. Zero renewal fees. Strictly limited to the first 20 customers.",
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
    title: "URPASS Founder Lifetime Plan | One-Time Operational Access",
    description:
      "Exclusive Founder Lifetime Plan: Permanent access to all current URPASS features for lifetime. Valid for the lifetime of URPASS. Limited to 20 accounts only.",
    url: "https://urpass.space/founder-lifetime-deal",
    locale: "en_IN",
    type: "website",
  },
};

export default async function FounderLifetimeDealPage(props: {
  searchParams?: Promise<{ country?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const [reqHeaders, cookieStore] = await Promise.all([headers(), cookies()]);
  const cookieCountry = cookieStore.get("urpass_country")?.value?.toUpperCase();
  const headerCountry = detectCountryFromHeaders(reqHeaders);
  const requestedCountry = searchParams?.country?.toUpperCase();

  const country: "IN" | "GB" =
    requestedCountry === "GB" || requestedCountry === "UK"
      ? "GB"
      : requestedCountry === "IN"
      ? "IN"
      : cookieCountry === "GB" || cookieCountry === "UK"
      ? "GB"
      : cookieCountry === "IN"
      ? "IN"
      : headerCountry === "GB"
      ? "GB"
      : "IN";
  const isUk = country === "GB";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);
  const userEmail = user?.email ?? null;
  const userName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? null;

  const founderPrice = isUk ? "£249" : "₹19,999";
  const founderTaxSuffix = isUk ? "(+VAT)" : "(+GST)";

  const includedFeatures = [
    {
      icon: Layers,
      title: "Unlimited Events Creation",
      desc: "Host symposiums, cultural fests, corporate conferences, and workshops without monthly event count caps.",
    },
    {
      icon: Palette,
      title: "Full Ticket Studio Designer",
      desc: "Complete visual drag-and-drop designer for branded digital passes, custom badges, sponsor banners, custom fonts, and shapes.",
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
      desc: "Custom attendee registration fields, auto-approval workflows, instant digital QR pass issuance, and direct sharing.",
    },
    {
      icon: Send,
      title: isUk ? "Digital QR Ticket Delivery" : "WhatsApp Ticket Distribution",
      desc: isUk
        ? "Instant digital ticket dispatch to attendee inbox or download link with verified QR badges and mobile pass support."
        : "One-click digital ticket dispatch straight to attendee WhatsApp with verified QR badges and instant Apple/Google Wallet links.",
    },
    {
      icon: isUk ? Banknote : IndianRupee,
      title: isUk ? "0% Commission Ticketing" : "Zero Commission & Direct UPI",
      desc: isUk
        ? "Keep 100% of your box office revenue. Valid across all UK university society events, balls, and conferences with zero platform percentage fee."
        : "Connect your own Razorpay or UPI gateway. Collect 100% of your ticket revenue directly into your bank with 0% platform fee.",
    },
    {
      icon: BarChart3,
      title: "Realtime Analytics & CSV Exports",
      desc: "Live check-in velocity, gate breakdown charts, attendance percentages, and one-click full attendee CSV data exports.",
    },
    {
      icon: Users,
      title: "50 Organizer & Gate Volunteer Seats",
      desc: "Add up to 50 co-organizers and gate check-in volunteers with fine-grained scanner and committee role permissions.",
    },
    {
      icon: Globe,
      title: "Branded Event Landing Pages on urpass.space",
      desc: "Host dedicated event registration landing pages at urpass.space/apply/[your-event] or your custom domain, with Ticket Studio, zero commissions, and lifetime feature lock.",
    },
  ];

  const faqs = [
    {
      q: "What exactly is the URPASS Founder Lifetime Plan?",
      a: isUk
        ? "The Founder Lifetime Plan grants you permanent access to all currently available URPASS event management, ticketing, and scanning features for a single one-time payment of £249 (+20% VAT = £298.80). There are zero monthly or annual renewal fees."
        : "The Founder Lifetime Plan grants you permanent access to all currently available URPASS event management, ticketing, and scanning features for a single one-time payment of ₹19,999 (+18% GST = ₹23,599). There are zero monthly or annual renewal fees.",
    },
    {
      q: "How many Lifetime Accounts are available?",
      a: "Only exactly 20 Lifetime Accounts will ever be issued under this founder cohort. Once all 20 spots are claimed, this offer will close permanently.",
    },
    {
      q: "How long is this lifetime license valid?",
      a: "Your license is valid for the operational lifetime of the URPASS platform with no expiration date, no renewal invoices, and no recurring subscriptions (provisioned through year 2125 in our database).",
    },
    {
      q: "What features are included in this plan?",
      a: "The plan covers unlimited events, unlimited monthly registrations, full Ticket Studio visual pass designer, sub-second scanning, 50 team seats, multi-gate check-in, offline sync mode, custom forms, zero platform commission ticketing, and realtime analytics.",
    },
    {
      q: "What happens if I subscribe to an upgraded tier or add-on later?",
      a: "Your Founder Lifetime status is permanently protected and never lost. If you ever need to subscribe to an upgraded version (e.g. specialized campus network packs, custom enterprise SLA tiers, or temporary seasonal upgrades), you can subscribe and enjoy those upgraded benefits. Once that subscription ends, cancels, or expires, your account automatically continues with your Founder Lifetime Plan. You will never drop to the Free plan.",
    },
    {
      q: "What is not included in the lifetime plan?",
      a: "Future standalone premium products, new third-party integrations, enterprise custom add-ons, or major newly introduced products released in subsequent years may be billed separately. Additionally, third-party pass-through costs (such as gateway processing fees or external SMS/messaging overages) are handled directly with respective providers.",
    },
    {
      q: "How do I claim one of the 20 Founder accounts?",
      a: isUk
        ? "You can click 'Claim Lifetime Access' below for instant direct activation with a statutory UK VAT tax invoice, or reach out directly to Srinithin on WhatsApp at +91 90012 70298 or via email at srinithin@yespstudio.com."
        : "You can click 'Claim Lifetime Access' below to complete the one-time payment with instant 18% GST tax invoice generation, or reach out directly to the founder on WhatsApp at +91 90012 70298 or via email at srinithin@yespstudio.com for instant account provisioning and GST invoice generation.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "URPASS Founder Lifetime Plan",
        description: `Permanent access to all currently available URPASS event registration and check-in features for a one-time payment of ${founderPrice}. Valid for the lifetime of URPASS. Limited to 20 customers only.`,
        brand: { "@type": "Brand", name: "URPASS" },
        offers: {
          "@type": "Offer",
          price: isUk ? "249" : "19999",
          priceCurrency: isUk ? "GBP" : "INR",
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

  const whatsappMessage = `Hi Srinithin, I am interested in claiming one of the 20 URPASS Founder Lifetime Accounts (${founderPrice}).`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="min-h-screen bg-neutral-950 text-white selection:bg-brand selection:text-white pt-24 pb-20 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Scarcity Pill */}
          <AnimateIn>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FOUNDER CHARTER · LIMITED TO 20 ACCOUNTS</span>
              </span>
            </div>
          </AnimateIn>

          {/* Hero Header */}
          <AnimateIn delay={50}>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                URPASS Founder <br />
                <span className="text-white">
                  Lifetime Access
                </span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8">
                Get full access to all <strong className="text-white">currently available URPASS features</strong> for a single one-time payment of{" "}
                <span className="text-white font-bold underline decoration-brand decoration-2 underline-offset-4">{founderPrice}</span>. Never pay a monthly or annual subscription fee again.
              </p>
            </div>
          </AnimateIn>

          {/* Live Founder Spot Allocation Counter */}
          <AnimateIn delay={75}>
            <div className="max-w-2xl mx-auto mb-10">
              <FounderSpotCounter
                claimedCount={14}
                totalCount={20}
                variant="gradient"
                showFeaturesLock={true}
              />
            </div>
          </AnimateIn>

          {/* Pricing Highlight Card */}
          <AnimateIn delay={100}>
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-sm mb-16 overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-neutral-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Permanent Operational License</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                    {founderPrice}{" "}
                    <span className="text-base font-normal text-neutral-400">
                      one-time {founderTaxSuffix}
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
                    country={country}
                  />

                  <a
                    href={`https://wa.me/919001270298?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-white transition-colors text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Talk on WhatsApp (+91 90012 70298)</span>
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
                    <p className="text-xs font-semibold text-white">Strictly 20 Accounts</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Strictly capped founder cohort with direct founding team support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* Features Grid */}
          <div className="mb-20">
            <AnimateIn>
              <div className="text-center mb-10">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
                  COMPREHENSIVE CAPABILITIES
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Everything Included in the Founder Lifetime Plan
                </h2>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {includedFeatures.map((feat, i) => (
                <AnimateIn key={feat.title} delay={i * 30}>
                  <div className="h-full bg-white/[0.03] border border-white/5 hover:border-white/15 rounded-2xl p-5 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3.5">
                        <feat.icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1.5">{feat.title}</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>

          {/* Terms, Boundaries & Guarantees */}
          <AnimateIn>
            <div className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 mb-20">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-brand-light" />
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Transparent Terms &amp; Founder Covenant
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300 leading-relaxed">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    What You Are Guaranteed
                  </h4>
                  <p>
                    • Permanent operational access to the complete URPASS event management software suite (unlimited events, forms, Ticket Studio, check-in scanning, and exports).
                  </p>
                  <p>
                    • Continuous bug fixes, performance optimizations, security patches, and browser compatibility updates.
                  </p>
                  <p>
                    • Permanent protection: if you ever upgrade to temporary seasonal packages, your account always reverts safely to Founder Lifetime status upon expiration.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    Scope &amp; Fair Boundaries
                  </h4>
                  <p>
                    • This offer strictly applies to the core URPASS software platform. Major newly built separate product lines or custom enterprise SLA contracts launched in future years are not included.
                  </p>
                  <p>
                    • External gateway pass-through fees (e.g. gateway transaction charges) and external messaging volume overages are paid directly to third-party providers.
                  </p>
                </div>
              </div>
            </div>
          </AnimateIn>

          {/* FAQs */}
          <div className="mb-20">
            <AnimateIn>
              <div className="text-center mb-10">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
                  QUESTIONS &amp; ANSWERS
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Frequently Asked Questions
                </h2>
              </div>
            </AnimateIn>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <AnimateIn key={faq.q} delay={i * 30}>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-2 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed pl-6">{faq.a}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>

          {/* Final Callout CTA */}
          <AnimateIn>
            <div className="text-center bg-gradient-to-r from-brand/20 via-purple-900/30 to-amber-500/10 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                Secure Your Spot in the 20-Account Founder Cohort
              </h2>
              <p className="text-neutral-300 text-sm max-w-xl mx-auto mb-8">
                Lock in lifetime operational access to URPASS for a single one-time payment of {founderPrice}. Once the 20 spots are filled, this deal will never be offered again.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <FounderCheckoutCta
                  isLoggedIn={isLoggedIn}
                  userEmail={userEmail}
                  userName={userName}
                  variant="white"
                  country={country}
                />
                <a
                  href={`https://wa.me/919001270298?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-semibold text-sm bg-white/10 hover:bg-white/15 text-white transition-all text-center flex items-center justify-center gap-2 border border-white/10"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Founding Team</span>
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
