"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnimateIn from "@/components/ui/AnimateIn";
import ManagedSetupLeadForm from "@/components/landing/ManagedSetupLeadForm";
import { cn } from "@/lib/utils";
import { detectCountryClient } from "@/lib/country-config";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  CreditCard,
  QrCode,
  ScanLine,
  Layers,
  Users2,
  ShieldCheck,
  Zap,
  Building2,
  GraduationCap,
  Briefcase,
  Store,
  Compass,
  Award,
  Check,
  Clock,
  Plus,
  Minus,
  Smartphone,
  ChevronRight,
  BarChart3,
  Globe,
  Radio,
  BadgeCheck,
  CheckCheck,
  Shield,
  ShieldAlert,
} from "lucide-react";

interface ManagedEventSetupContentProps {
  canonicalUrl?: string;
}

const pillars = [
  {
    icon: Calendar,
    title: "Event Website & Registration Page",
    desc: "Create a professional, mobile-friendly event registration experience tailored to your audience.",
    points: [
      "Event information and multi-track schedule",
      "Event banner and brand identity design",
      "Custom registration forms with validation",
      "Registration capacity and ticket deadlines",
      "Automated and manual approval workflows",
    ],
  },
  {
    icon: CreditCard,
    title: "Ticketing & Payment Setup",
    desc: "Configure ticketing according to your event revenue structure and attendee classifications.",
    points: [
      "Free, early bird, and paid ticket categories",
      "General, VIP, speaker, and student tiers",
      "Single-day and multi-day pass structures",
      "Group and team ticket configurations",
      "Inventory caps and release windows",
      "Payment gateway configuration assistance",
    ],
  },
  {
    icon: QrCode,
    title: "Branded QR Pass Configuration",
    desc: "Create a consistent, high-impact attendee entry experience delivered via email and WhatsApp.",
    points: [
      "Digital QR ticket layout customization",
      "Event-branded pass color palettes and badges",
      "Cryptographically unique attendee QR codes",
      "Individual and bulk pass generation",
      "Verification workflow and attendee tokens",
    ],
  },
  {
    icon: ScanLine,
    title: "Gate & Entry Management",
    desc: "Prepare your venue's entry operations with the UrPass sub-second smartphone check-in system.",
    points: [
      "Browser QR-based entry scanning (no apps needed)",
      "Gate operator roles and security PIN routing",
      "Entry, exit, and re-entry scan workflows",
      "Instant duplicate scan detection",
      "Gate-wise attendance tracking metrics",
      "Pre-event scanner rehearsal and load testing",
    ],
  },
  {
    icon: Layers,
    title: "Session & Access Management",
    desc: "Built for multi-track conferences, summits, and workshops with tiered access requirements.",
    points: [
      "Session-wise access permissions and hall rules",
      "Workshop and executive lounge access setup",
      "Multi-level pass privileges and badge tags",
      "Room capacity settings and crowd control",
      "Session-level attendance tracking workflows",
    ],
  },
  {
    icon: Users2,
    title: "Attendee Management & Reporting",
    desc: "Organize your attendee information, guest lists, and data exports before the event begins.",
    points: [
      "Attendee CSV list cleansing and bulk import",
      "Registration data structure configuration",
      "Custom attendee fields and tracking tags",
      "Real-time attendance velocity monitoring",
      "One-click audit-ready CSV data exports",
      "Complete organizer dashboard walkthrough",
    ],
  },
];

const steps = [
  {
    step: "01",
    title: "Tell Us About Your Event",
    desc: "Share your event name, dates, venue, expected attendance, ticket categories, and entry requirements.",
  },
  {
    step: "02",
    title: "We Plan Your Setup",
    desc: "Our event engineering team reviews your requirements and proposes the registration, ticketing, and QR check-in configuration.",
  },
  {
    step: "03",
    title: "We Configure UrPass",
    desc: "Following scope approval, we prepare your event pages, registration forms, ticket categories, pass designs, and applicable access workflows.",
  },
  {
    step: "04",
    title: "Review, Test & Rehearse",
    desc: "We verify the registration journey, payment configuration where applicable, QR pass delivery, and check-in workflow before your event goes live.",
  },
  {
    step: "05",
    title: "Manage & Monitor Live",
    desc: "Your organizer dashboard provides live access to registrations, attendees, and arrival information. Additional operational support may be arranged separately.",
  },
];

const eventTypes = [
  {
    icon: Briefcase,
    title: "Corporate Conferences & Summits",
    desc: "Professional delegate registration, VIP ticketing, QR entry, and session-wise attendance tracking.",
  },
  {
    icon: GraduationCap,
    title: "College Fests & University Events",
    desc: "Student registration, individual and group passes, workshop access, and volunteer check-in operations.",
  },
  {
    icon: Store,
    title: "Exhibitions & Trade Shows",
    desc: "Visitor registration, exhibitor categories, multi-hall access control, and live arrival analytics.",
  },
  {
    icon: Compass,
    title: "Workshops & Training Programs",
    desc: "Participant enrollment, strict capacity limits, digital passes, and verified completion records.",
  },
  {
    icon: Award,
    title: "Business Networking & Product Launches",
    desc: "Branded invitations, guest list verification, controlled entrance, and attendee interaction tracking.",
  },
  {
    icon: Building2,
    title: "Multi-Day & Multi-Venue Events",
    desc: "Multi-day ticket configuration, daily gate access rules, and session-specific entrance workflows.",
  },
];

const faqs = [
  {
    q: "What is a managed event setup service?",
    a: "A managed event setup service helps organizers configure event technology without completing every technical setup task themselves. UrPass Managed Setup can cover registration pages, ticket categories, digital QR passes, and entry workflows based on an agreed project scope.",
  },
  {
    q: "Can UrPass set up ticketing for a college festival?",
    a: "Yes. UrPass supports event registration, ticket categories, and QR-based check-in workflows suited to college festivals. Managed setup can assist with configuring those workflows, setting up student and external tiers, and preparing volunteer scanners.",
  },
  {
    q: "Can you configure paid event registration?",
    a: "Yes. Managed setup can include paid ticket categories and assistance configuring supported payment workflows (such as Razorpay or Stripe), subject to payment gateway availability and merchant approval.",
  },
  {
    q: "Can UrPass configure multiple gates?",
    a: "Yes. The setup can include gate configurations, operator roles, and QR verification workflows supported by your UrPass plan to ensure smooth check-in across multiple venue entrances.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "No development experience is required. Our technical team handles the platform configuration and walks your team through how to operate the organizer dashboard and mobile camera scanner.",
  },
  {
    q: "Is onsite event support included?",
    a: "Not automatically. Managed setup primarily covers platform configuration, branded design, and pre-launch preparation. Onsite staff, dedicated hardware, and event-day coordinators require separate scope confirmation.",
  },
  {
    q: "How long does managed event setup take?",
    a: "The timeline depends on the complexity of the event, the completeness of the information provided, and third-party dependencies (such as payment gateway approval). A delivery schedule is agreed during scoping, typically within 24–72 hours.",
  },
  {
    q: "How much does managed event setup cost?",
    a: "UrPass offers four transparent managed service packages: Essential (₹1,000 / £25 per event) for simple workshops and meetups; Professional (₹5,000 / £99 per event) for college fests, conferences, and hackathons with custom branded passes; Business (₹15,000 / £299 per event) for multi-track summits with multi-gate routing and live standby; and Enterprise (₹49,000+ / £799+ custom scope) for multi-event university or corporate portfolios with dedicated technical management. Select a package above to pre-fill your quote request.",
  },
  {
    q: "Can I manage the event after setup is complete?",
    a: "Yes. After handover, authorized organizers have complete access to manage registrations, attendees, and live check-ins using the UrPass dashboard, subject to account permissions.",
  },
  {
    q: "Is managed setup available for events outside India?",
    a: "Yes. UrPass is a web-based event platform operating internationally. Contact our team to confirm managed service availability, supported payment arrangements, and delivery requirements for your location.",
  },
];

export default function ManagedEventSetupContent({
  canonicalUrl = "https://urpass.space/managed-setup",
}: ManagedEventSetupContentProps) {
  const [country, setCountry] = useState<"IN" | "GB">("IN");
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<
    "pass" | "scanner" | "portal" | "dashboard"
  >("pass");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const detected = detectCountryClient();
    if (detected === "GB") {
      setCountry("GB");
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

  const handleSelectPlan = (planName: string, attendeeParam: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("urpass_select_setup_plan", {
          detail: { attendees: attendeeParam, plan: planName },
        })
      );
      const formEl =
        document.getElementById("quote-form") || document.getElementById("final-setup-form");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isUk = country === "GB";

  const managedPlans = [
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
      attendeeParam: "Under 500",
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
      attendeeParam: "500–2,000",
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
      attendeeParam: "2,000–10,000",
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
      attendeeParam: "10,000+",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        name: "UrPass Managed Event Setup Service",
        serviceType: "Event Technology Configuration and Management Service",
        provider: {
          "@type": "Organization",
          name: "UrPass by Yesp Corporation",
          url: "https://urpass.space",
        },
        description:
          "Done-for-you event technology setup covering custom registration forms, ticket categories, branded digital QR passes, and multi-gate check-in workflows.",
        areaServed: ["IN", "GB", "US", "Global"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://urpass.space",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Managed Event Setup",
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-violet-100 selection:text-violet-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-20">
        {/* ── EXECUTIVE SPLIT HERO ── */}
        <section className="px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16 sm:mb-20">
            {/* Hero Left: Value Positioning */}
            <div className="lg:col-span-7">
              <AnimateIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-50 text-violet-700 border border-violet-200/90 mb-5 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>WHITE-GLOVE ONBOARDING · DONE-FOR-YOU EVENT TECH</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-neutral-950 mb-5 leading-[1.12]">
                  Managed Event Setup Services{" "}
                  <span className="text-violet-600 block sm:inline">
                    — We Set Up Your Entire Event.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-6 max-w-2xl">
                  Planning an event but don&apos;t want to wrestle with registration forms, payment gateways, QR pass designs, and gate check-in rules? The UrPass engineering team configures, tests, and delivers your entire event technology stack so you can focus 100% on hosting.
                </p>

                {/* Micro Value Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 text-xs sm:text-sm text-neutral-700 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>0% Platform Ticket Cut (Direct Bank Payout)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24–48h Rapid Delivery &amp; Live Test</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Sub-second Mobile Browser Scanners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Complete Attendee Data Ownership</span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3.5">
                  <a
                    href="#managed-pricing"
                    className="inline-flex items-center justify-center gap-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-md shadow-violet-600/20 hover:shadow-lg transition-all group"
                  >
                    <span>View Managed Pricing Plans</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#quote-form"
                    className="inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200/90 text-neutral-800 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all"
                  >
                    <span>Request Custom Quote</span>
                  </a>
                </div>
              </AnimateIn>
            </div>

            {/* Hero Right: Live Interactive Deliverables Showcase */}
            <div className="lg:col-span-5">
              <AnimateIn delay={100} from="up">
                <div className="bg-neutral-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-neutral-800 text-white relative overflow-hidden">
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Header of Showcase Card */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono font-semibold tracking-wider text-neutral-300 uppercase">
                        UrPass Deliverables Preview
                      </span>
                    </div>
                    <span className="text-[10px] bg-violet-950 text-violet-300 font-semibold px-2 py-0.5 rounded-full border border-violet-800/60">
                      We Build This For You
                    </span>
                  </div>

                  {/* Showcase Tabs */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-950/80 rounded-xl mb-5 text-[11px] font-semibold relative z-10 border border-neutral-800/80">
                    <button
                      type="button"
                      onClick={() => setActiveShowcaseTab("pass")}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-center transition-all",
                        activeShowcaseTab === "pass"
                          ? "bg-violet-600 text-white shadow-xs"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      QR Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveShowcaseTab("scanner")}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-center transition-all",
                        activeShowcaseTab === "scanner"
                          ? "bg-violet-600 text-white shadow-xs"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      Scanner
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveShowcaseTab("portal")}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-center transition-all",
                        activeShowcaseTab === "portal"
                          ? "bg-violet-600 text-white shadow-xs"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      Portal
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveShowcaseTab("dashboard")}
                      className={cn(
                        "py-1.5 px-2 rounded-lg text-center transition-all",
                        activeShowcaseTab === "dashboard"
                          ? "bg-violet-600 text-white shadow-xs"
                          : "text-neutral-400 hover:text-white"
                      )}
                    >
                      Live Hub
                    </button>
                  </div>

                  {/* Showcase Dynamic Content */}
                  <div className="relative z-10 min-h-[300px] flex items-center justify-center">
                    {activeShowcaseTab === "pass" && (
                      <div className="w-full bg-neutral-950 rounded-2xl border border-neutral-800 p-5 shadow-inner">
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                            URPASS VERIFIED PASS
                          </span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                            VALID TICKET
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="text-sm font-extrabold text-white">
                              Dr. Sarah Jenkins
                            </div>
                            <div className="text-xs text-neutral-400">
                              Global AI Summit · Delegate
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-mono font-bold text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/40">
                              GATE 1 · VIP
                            </span>
                          </div>
                        </div>

                        {/* Visual Mock QR */}
                        <div className="bg-white p-3 rounded-xl mx-auto w-36 h-36 flex items-center justify-center shadow-md my-2 relative">
                          <QrCode className="w-28 h-28 text-neutral-950" />
                          <div className="absolute inset-x-0 h-0.5 bg-violet-600 animate-bounce" />
                        </div>

                        <div className="text-center mt-3 pt-3 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-400">
                          TOKEN: #UP-2026-98124 · 100% Anti-Duplicate
                        </div>
                      </div>
                    )}

                    {activeShowcaseTab === "scanner" && (
                      <div className="w-full bg-neutral-950 rounded-2xl border border-neutral-800 p-5 shadow-inner text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-3">
                          <Zap className="w-3 h-3" />
                          <span>SUB-SECOND SCANNER HUD</span>
                        </div>

                        <div className="relative border-2 border-dashed border-emerald-500/60 rounded-xl p-4 bg-emerald-950/20 mb-3">
                          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                            ✓ SCAN VERIFIED
                          </div>
                          <div className="text-base font-extrabold text-white">
                            Alex Vance
                          </div>
                          <div className="text-xs text-neutral-300">
                            Delegate Pass · Access Granted
                          </div>
                          <div className="text-[10px] text-emerald-300/80 font-mono mt-1">
                            Scan Latency: 0.22s · 0 Duplicate Risk
                          </div>
                        </div>

                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          Runs in any mobile browser on iOS &amp; Android. Zero app store downloads for your gate team.
                        </p>
                      </div>
                    )}

                    {activeShowcaseTab === "portal" && (
                      <div className="w-full bg-neutral-950 rounded-2xl border border-neutral-800 p-5 shadow-inner text-left">
                        <div className="flex items-center gap-1.5 pb-3 border-b border-neutral-800 mb-3 text-[10px] font-mono text-neutral-400">
                          <Globe className="w-3.5 h-3.5 text-neutral-400" />
                          <span>summit2026.urpass.space</span>
                        </div>

                        <div className="space-y-2.5">
                          <div className="h-4 bg-neutral-800 rounded w-3/4" />
                          <div className="h-3 bg-neutral-800/60 rounded w-1/2" />
                          <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">VIP Delegate</span>
                            <span className="text-violet-400 font-mono font-bold">
                              {isUk ? "£149" : "₹4,999"}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">General Pass</span>
                            <span className="text-violet-400 font-mono font-bold">
                              {isUk ? "£49" : "₹1,499"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between">
                          <span>Custom Form Fields Configured</span>
                          <span className="text-emerald-400 font-semibold">SSL Secured</span>
                        </div>
                      </div>
                    )}

                    {activeShowcaseTab === "dashboard" && (
                      <div className="w-full bg-neutral-950 rounded-2xl border border-neutral-800 p-5 shadow-inner text-left">
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            REAL-TIME GATE ANALYTICS
                          </span>
                          <span className="text-[10px] font-mono text-violet-400">
                            LIVE SYNC
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
                            <div className="text-[10px] text-neutral-400 uppercase">Checked In</div>
                            <div className="text-lg font-extrabold text-white">
                              1,482 <span className="text-[10px] text-emerald-400 font-normal">/ 1,800</span>
                            </div>
                          </div>
                          <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800">
                            <div className="text-[10px] text-neutral-400 uppercase">Peak Velocity</div>
                            <div className="text-lg font-extrabold text-violet-400">
                              24 <span className="text-[10px] text-neutral-400 font-normal">scans/min</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-[11px] text-neutral-300">
                          <div className="flex justify-between py-1 border-b border-neutral-900">
                            <span>Main Gate (Auditorium)</span>
                            <span className="font-mono text-emerald-400">894 checked in</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-neutral-900">
                            <span>VIP / Speaker Lounge</span>
                            <span className="font-mono text-violet-400">142 checked in</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Guarantee Note */}
                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      100% Tested Prior to Launch
                    </span>
                    <a
                      href="#managed-pricing"
                      className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
                    >
                      Select Plan <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>

          {/* ── METRICS & TRUST STRIP ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-6 px-6 sm:px-8 bg-neutral-50 rounded-2xl border border-neutral-200/80 mb-20 shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 font-bold">
                0%
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-neutral-950">
                  Zero Commission
                </div>
                <div className="text-[11px] text-neutral-500">
                  Direct merchant settlement
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                &lt;0.3s
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-neutral-950">
                  Gate Scan Speed
                </div>
                <div className="text-[11px] text-neutral-500">
                  Sub-second camera latency
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold">
                24-48h
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-neutral-950">
                  Fast Handover
                </div>
                <div className="text-[11px] text-neutral-500">
                  Ready before event doors open
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                100%
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-neutral-950">
                  Data Ownership
                </div>
                <div className="text-[11px] text-neutral-500">
                  Full attendee CSV export
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT IS MANAGED SETUP ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-neutral-50/70 border-y border-neutral-100">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 block mb-2">
                  OVERVIEW &amp; PHILOSOPHY
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-4">
                  What Is UrPass Managed Event Setup?
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  UrPass Managed Event Setup is a done-for-you event technology configuration service designed for organizers who need professional assistance setting up event registration, ticketing, attendee management, and QR-based entry.
                </p>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <AnimateIn delay={80}>
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 h-full shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center mb-4">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-950 mb-3">
                      We Configure. You Direct.
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                      Instead of configuring forms, payment webhooks, and pass templates yourself, you share your requirements with our dedicated engineers. We build and test your complete event architecture on the UrPass platform.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 text-xs font-semibold text-violet-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Saves 15–30 hours of manual setup effort</span>
                  </div>
                </div>
              </AnimateIn>

              <AnimateIn delay={120}>
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 h-full shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-950 mb-3">
                      You Retain Complete Control
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                      All event data, attendee lists, ticket revenue, and credentials belong 100% to your organization. You retain full administrative access to your dashboard throughout and after the event.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 text-xs font-semibold text-violet-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Full data ownership &amp; direct payout settlement</span>
                  </div>
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>

        {/* ── 6 PILLARS: EVERYTHING PROFESSIONALLY CONFIGURED ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
          <AnimateIn>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-50 text-violet-700 border border-violet-200/80 mb-3">
                END-TO-END DELIVERABLES
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-4">
                Everything Your Event Needs, Professionally Configured
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                From public launch to the final attendee entrance scan, our team handles the technology stack with obsessive precision.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <AnimateIn key={pillar.title} delay={idx * 60} from="up">
                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs hover:border-violet-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center mb-5 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-2xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-2 tracking-tight group-hover:text-violet-950 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 space-y-2 mt-auto">
                      {pillar.points.map((pt) => (
                        <div key={pt} className="flex items-start gap-2 text-xs text-neutral-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </section>

        {/* ── 5-STEP PROCESS: HOW MANAGED SETUP WORKS ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-neutral-950 text-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <AnimateIn>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-900/60 text-violet-300 border border-violet-700/60 mb-3">
                  WORKFLOW &amp; TIMELINE
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                  How Managed Event Setup Works
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  A structured 5-step collaborative journey ensuring zero surprises on event day.
                </p>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6">
              {steps.map((st, i) => (
                <AnimateIn key={st.step} delay={i * 70} from="up">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full group hover:border-violet-500/80 transition-all">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/40 flex items-center justify-center font-mono font-bold text-sm mb-4">
                        {st.step}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                        {st.title}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── BUILT FOR EVERY EVENT TYPE ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
          <AnimateIn>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 block mb-2">
                VERSATILE PLATFORM
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-4">
                Built for Every Type of Event
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Whether you are hosting 100 executive guests or 10,000 festival attendees, our configuration scales seamlessly.
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map((et, idx) => {
              const Icon = et.icon;
              return (
                <AnimateIn key={et.title} delay={idx * 60} from="up">
                  <div className="bg-neutral-50/60 rounded-2xl border border-neutral-200/80 p-6 flex flex-col justify-between h-full hover:bg-white hover:border-violet-300 hover:shadow-sm transition-all duration-300">
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-violet-600 mb-4 shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-neutral-950 mb-2">
                        {et.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                        {et.desc}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </section>

        {/* ── COMPARISON: SELF-SERVICE VS MANAGED SETUP ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-neutral-50/80 border-y border-neutral-200/70">
          <div className="max-w-4xl mx-auto">
            <AnimateIn>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 block mb-2">
                  CHOOSE YOUR APPROACH
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-4">
                  Self-Service or Managed Setup — Choose What Works for You
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Both options use the UrPass platform. Managed Setup adds a professional configuration service; it does not replace your UrPass subscription.
                </p>
              </div>
            </AnimateIn>

            <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="py-4 px-5 font-bold text-neutral-900 w-1/2">
                      Self-Service UrPass
                    </th>
                    <th className="py-4 px-5 font-bold text-violet-900 bg-violet-50/70 w-1/2 border-l border-neutral-200">
                      Managed Event Setup
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-3.5 px-5 text-neutral-700">Configure everything yourself</td>
                    <td className="py-3.5 px-5 text-neutral-900 font-medium bg-violet-50/30 border-l border-neutral-200">Our team assists with configuration</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 text-neutral-700">Use standard setup tools</td>
                    <td className="py-3.5 px-5 text-neutral-900 font-medium bg-violet-50/30 border-l border-neutral-200">Setup based on agreed requirements</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 text-neutral-700">Design your own passes</td>
                    <td className="py-3.5 px-5 text-neutral-900 font-medium bg-violet-50/30 border-l border-neutral-200">Branded pass setup assistance</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 text-neutral-700">Configure your own gate workflows</td>
                    <td className="py-3.5 px-5 text-neutral-900 font-medium bg-violet-50/30 border-l border-neutral-200">Assisted gate configuration &amp; rehearsal</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 text-neutral-700">Test your own registration journey</td>
                    <td className="py-3.5 px-5 text-neutral-900 font-medium bg-violet-50/30 border-l border-neutral-200">Guided pre-launch testing</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 text-neutral-700">Standard platform support</td>
                    <td className="py-3.5 px-5 text-neutral-900 font-medium bg-violet-50/30 border-l border-neutral-200">Project-specific setup assistance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── MANAGED EVENT SETUP PRICING PLANS (REDESIGNED #managed-pricing) ── */}
        <section
          id="managed-pricing"
          className="py-20 sm:py-28 px-4 sm:px-8 max-w-6xl mx-auto scroll-mt-24"
        >
          <AnimateIn>
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-50 text-violet-700 border border-violet-200/80 mb-4 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TRANSPARENT VALUE-BASED PRICING</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 mb-4">
                Choose Your Managed Setup Plan
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Done-for-you technical onboarding and event configuration by UrPass engineers. Zero platform ticket commission — 100% of your ticket sales settle directly into your bank.
              </p>

              {/* Currency & Region Switcher */}
              <div className="inline-flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl border border-neutral-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setCountry("IN")}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                    country === "IN"
                      ? "bg-white text-neutral-950 shadow-xs border border-neutral-200/80"
                      : "text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  🇮🇳 India (₹ INR)
                </button>
                <button
                  type="button"
                  onClick={() => setCountry("GB")}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                    country === "GB"
                      ? "bg-white text-neutral-950 shadow-xs border border-neutral-200/80"
                      : "text-neutral-600 hover:text-neutral-900"
                  )}
                >
                  🇬🇧 UK &amp; Global (£ GBP)
                </button>
              </div>
            </div>
          </AnimateIn>

          {/* 4 Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-10">
            {managedPlans.map((plan, idx) => (
              <AnimateIn key={plan.id} delay={idx * 70} from="up">
                <div
                  className={cn(
                    "relative rounded-3xl p-6 flex flex-col justify-between h-full transition-all duration-300",
                    plan.popular
                      ? "bg-white border-2 border-violet-600 shadow-xl shadow-violet-500/10 -translate-y-1 lg:-translate-y-2 ring-4 ring-violet-50"
                      : "bg-white border border-neutral-200/90 shadow-xs hover:shadow-md hover:border-neutral-300"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Sparkles className="w-3 h-3" />
                      <span>MOST POPULAR</span>
                    </div>
                  )}

                  <div>
                    {/* Plan Header */}
                    <div className="mb-3">
                      <h3 className="text-xl font-extrabold text-neutral-950">
                        {plan.name}
                      </h3>
                      <p className="text-xs font-semibold text-violet-700 mt-0.5">
                        {plan.subtitle}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-100 mb-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold tracking-tight text-neutral-950">
                          {plan.price}
                        </span>
                        <span className="text-xs text-neutral-500 font-medium">
                          {plan.period}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        {plan.id === "enterprise"
                          ? "Tailored scope & custom SLA"
                          : "One-time setup fee · 0% ticket commission"}
                      </p>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed mb-5 min-h-[44px]">
                      {plan.desc}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2.5 mb-6">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                        Package Inclusions:
                      </p>
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-neutral-700">
                          <CheckCircle2
                            className={cn(
                              "w-3.5 h-3.5 shrink-0 mt-0.5",
                              plan.popular ? "text-violet-600" : "text-emerald-600"
                            )}
                          />
                          <span
                            className={
                              feat.startsWith("Everything in")
                                ? "font-semibold text-neutral-950"
                                : ""
                            }
                          >
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 border-t border-neutral-100 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.name, plan.attendeeParam)}
                      className={cn(
                        "w-full inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs group cursor-pointer",
                        plan.popular
                          ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20"
                          : "bg-neutral-900 hover:bg-neutral-800 text-white"
                      )}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          {/* Mandatory Explicit Fee Separation Disclosure Note */}
          <div className="mb-12 rounded-2xl bg-neutral-50 border border-neutral-200/80 p-5 sm:p-6 text-neutral-600 text-xs sm:text-sm leading-relaxed flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center shrink-0 text-violet-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-neutral-950 mb-0.5">Fee Separation &amp; Terms Disclosure</p>
              <p className="text-xs text-neutral-600">
                Managed-service pricing is separate from software subscriptions, payment processing fees, and applicable taxes. 100% of attendee ticket revenue settles directly into your payment gateway or bank account with 0% platform commission taken by UrPass.
              </p>
            </div>
          </div>

          {/* Guarantee Badges Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-50/70 via-neutral-50/80 to-purple-50/70 border border-violet-200/80 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-950">
                  0% Ticket Commission
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                  100% of your ticket revenue settles directly into your payment gateway or bank account. UrPass never takes a platform cut.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-950">
                  Complete Data Ownership
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                  All attendee records, emails, check-in timestamps, and financial logs belong strictly to your organization.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-950">
                  Rapid Technical Turnaround
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                  Pre-event configuration delivered within 24–48 hours with live gate scanner load tests and volunteer walkthroughs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE URPASS ── */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-neutral-50/70 border-t border-neutral-200/70">
          <div className="max-w-5xl mx-auto">
            <AnimateIn>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 block mb-2">
                  VALUE DELIVERED
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-4">
                  Why Choose UrPass?
                </h2>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "One Connected Event Platform",
                  desc: "Keep registration, ticketing, digital passes, check-in, and reporting together in one unified system.",
                },
                {
                  title: "Configured Around Your Event",
                  desc: "Prepare workflows that suit your actual ticket categories, venue gates, and access requirements.",
                },
                {
                  title: "Professional Event Branding",
                  desc: "Present a consistent experience across registration pages, confirmation emails, and digital passes.",
                },
                {
                  title: "Reduce Manual Setup Work",
                  desc: "Let our engineering team handle the agreed platform configuration so your team can focus on programming.",
                },
                {
                  title: "Maintain Organizer Control",
                  desc: "Your team can continue managing registrations, tickets, and attendee information directly from UrPass.",
                },
                {
                  title: "Sub-Second Gate Operations",
                  desc: "Validate attendees in under 0.3 seconds on any smartphone camera with instant duplicate prevention.",
                },
              ].map((item, idx) => (
                <AnimateIn key={item.title} delay={idx * 60}>
                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 h-full shadow-xs">
                    <h3 className="text-base font-bold text-neutral-950 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── SINGLE AUTHORITATIVE QUOTE & SETUP REQUEST FORM ── */}
        <section id="quote-form" className="py-20 sm:py-28 px-4 sm:px-8 bg-neutral-950 text-white scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            <AnimateIn>
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-violet-900/60 text-violet-300 border border-violet-700/60 mb-3">
                  CONFIRM YOUR EVENT PARAMETERS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
                  Request Managed Event Setup
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
                  Submit your event parameters below. Our operations team will review your requirements and follow up promptly with your custom quote and setup plan.
                </p>
              </div>
            </AnimateIn>

            <AnimateIn delay={100} from="up">
              <ManagedSetupLeadForm
                id="final-setup-form"
                title="Tell Us About Your Event"
                subtitle="Share your requirements and expected attendance. Selecting a pricing plan above auto-fills your estimated attendee tier."
              />
            </AnimateIn>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS (CLEAN INLINE ACCORDION) ── */}
        <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 block mb-2">
                QUESTIONS &amp; ANSWERS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-neutral-600">
                Everything you need to know about our done-for-you managed setup service.
              </p>
            </div>
          </AnimateIn>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-neutral-200/90 rounded-2xl overflow-hidden transition-all duration-200 hover:border-neutral-300 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4 bg-white hover:bg-neutral-50/60 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-neutral-900">
                    {faq.q}
                  </span>
                  <span className="shrink-0 text-neutral-500 bg-neutral-100 p-1.5 rounded-full">
                    {openFaq === i ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── TOPIC CLUSTER & INTERNAL LINKS ── */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 bg-neutral-50/80 border-t border-neutral-200/70">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 block mb-1">
                EXPLORE PLATFORM &amp; SERVICES
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950">
                Related UrPass Solutions &amp; Resources
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { title: "Platform Overview", href: "/" },
                { title: "Pricing & Plans", href: "/pricing" },
                { title: "QR Ticketing System", href: "/qr-ticketing-system" },
                { title: "Event Registration", href: "/event-registration-software" },
                { title: "Ticketing Software", href: "/ticketing-software-for-events" },
                { title: "Contact & Demo", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="bg-white border border-neutral-200/80 rounded-xl p-3 text-center text-xs font-semibold text-neutral-700 hover:text-violet-700 hover:border-violet-300 hover:shadow-2xs transition-all flex items-center justify-center"
                >
                  {link.title}
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200/60 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700">Regional Setup Availability:</span>
              <Link href="/in" className="hover:text-violet-700 transition-colors">
                India (₹ UPI &amp; Razorpay)
              </Link>
              <span>·</span>
              <Link href="/uk" className="hover:text-violet-700 transition-colors">
                United Kingdom (£ GBP)
              </Link>
              <span>·</span>
              <Link href="/in/bangalore" className="hover:text-violet-700 transition-colors">
                Bangalore
              </Link>
              <span>·</span>
              <Link href="/in/mumbai" className="hover:text-violet-700 transition-colors">
                Mumbai
              </Link>
              <span>·</span>
              <Link href="/uk/london" className="hover:text-violet-700 transition-colors">
                London
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
