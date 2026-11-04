"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SeoGeoPageConfig, SeoGeoWorkflowStep, SeoGeoEventType } from "@/lib/seo/templates/seo-geo-template.types";
import { trackConversion, getClientTrackingContext } from "@/lib/seo/analytics";
import { trackConversionEvent } from "@/lib/conversion/tracker";
import { ATTRIBUTION_STORAGE_KEY } from "@/lib/conversion/attribution";
import { resolveFunnelIntent } from "@/lib/conversion/intent-resolver";
import InteractiveConversionCalculator from "@/components/conversion/InteractiveConversionCalculator";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ScanLine,
  BarChart3,
  QrCode,
  FileText,
  Users,
  Calendar,
  ChevronDown,
  Building2,
  Mail,
  Sliders,
  Check,
  Loader2,
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
  RefreshCw,
  Download,
  Volume2,
  ShieldAlert,
  Palette,
} from "lucide-react";

interface SeoGeoLandingTemplateProps {
  config: SeoGeoPageConfig;
}

export default function SeoGeoLandingTemplate({ config }: SeoGeoLandingTemplateProps) {
  // Attribution & View Tracking on Mount
  useEffect(() => {
    const ctx = getClientTrackingContext(config.slug, "corporate");
    trackConversion("seo_landing_view", ctx);

    trackConversionEvent("landing_page_view", {
      pageSlug: `/solutions/${config.slug}`,
      visitorSegment: "corporate",
      metadata: {
        campaign: config.pageId,
        primaryKeyword: config.primaryKeyword,
      },
    });

    // Store attribution in localStorage for signup & event creation preservation
    try {
      const now = new Date().toISOString();
      const existingRaw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const updated = {
        ...existing,
        lastTouchPageSlug: config.slug,
        lastTouchUrl: config.canonicalUrl,
        lastTouchUtmCampaign: config.pageId,
        lastTouchAt: now,
        firstTouchPageSlug: existing.firstTouchPageSlug || config.slug,
        firstTouchUrl: existing.firstTouchUrl || config.canonicalUrl,
        firstTouchUtmCampaign: existing.firstTouchUtmCampaign || config.pageId,
        firstTouchAt: existing.firstTouchAt || now,
        visitorSegment: "corporate",
      };
      localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable or private mode
    }
  }, [config.slug, config.canonicalUrl, config.pageId, config.primaryKeyword]);

  // Product proof tab state
  const [activeProofTab, setActiveProofTab] = useState<"form" | "pass" | "scanner" | "analytics">("form");

  // FAQ open/close accordion state (first 2 open by default)
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({
    0: true,
    1: true,
  });

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Sales Lead Demo Form State
  const [demoFormData, setDemoFormData] = useState({
    fullName: "",
    workEmail: "",
    companyName: "",
    eventType: "Corporate Conference",
    attendeeCount: "100 - 500 attendees",
    eventDate: "",
  });
  const [isSubmittingDemo, setIsSubmittingDemo] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoError, setDemoError] = useState("");

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoError("");

    if (!demoFormData.fullName.trim() || !demoFormData.workEmail.trim() || !demoFormData.companyName.trim()) {
      setDemoError("Please fill out all required fields (Name, Work Email, Company).");
      return;
    }

    setIsSubmittingDemo(true);
    try {
      const res = await fetch("/api/managed-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizerName: demoFormData.fullName.trim(),
          businessEmail: demoFormData.workEmail.trim(),
          phoneNumber: "Not provided (Lead Demo Form)",
          eventType: demoFormData.eventType,
          eventDate: demoFormData.eventDate || undefined,
          city: "Corporate Lead",
          expectedAttendees: demoFormData.attendeeCount,
          eventPricingType: "private",
          preferredPackage: "enterprise",
          supportRequirements: `Corporate event demo request for ${demoFormData.companyName}.`,
          comments: `Lead generated from SEO page /solutions/${config.slug}`,
          consentGiven: true,
          pageSlug: config.slug,
          contentCluster: "corporate",
          utmCampaign: config.pageId,
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to submit request.");
      }

      setDemoSubmitted(true);

      const ctx = getClientTrackingContext(config.slug, "corporate");
      trackConversion("seo_lead_submitted", ctx);
      trackConversionEvent("managed_service_enquiry", {
        pageSlug: `/solutions/${config.slug}`,
        visitorSegment: "corporate",
        metadata: {
          company: demoFormData.companyName,
          eventType: demoFormData.eventType,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please try again or email support.";
      setDemoError(msg);
    } finally {
      setIsSubmittingDemo(false);
    }
  };

  // Helper tracking triggers
  const handlePrimaryCtaClick = () => {
    const ctx = getClientTrackingContext(config.slug, "corporate");
    trackConversion("seo_signup_click", ctx);
    trackConversionEvent("primary_cta_click", {
      pageSlug: `/solutions/${config.slug}`,
      visitorSegment: "corporate",
      metadata: { target: "signup", campaign: config.pageId },
    });
  };

  const handleDemoCtaClick = () => {
    const ctx = getClientTrackingContext(config.slug, "corporate");
    trackConversion("seo_demo_click", ctx);
    trackConversionEvent("secondary_cta_click", {
      pageSlug: `/solutions/${config.slug}`,
      visitorSegment: "corporate",
      metadata: { target: "demo_walkthrough", campaign: config.pageId },
    });

    const el = document.getElementById("product-walkthrough");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePricingCtaClick = () => {
    const ctx = getClientTrackingContext(config.slug, "corporate");
    trackConversion("seo_pricing_click", ctx);
    trackConversionEvent("pricing_viewed", {
      pageSlug: `/solutions/${config.slug}`,
      visitorSegment: "corporate",
      metadata: { from: config.pageId },
    });
  };

  const funnelIntent = resolveFunnelIntent(config.slug || config.pageId);
  const signupUrl = funnelIntent.signupUrl;
  const primaryCtaLabel = funnelIntent.ctaText || config.primaryCtaLabel || "Start Free Event";

  // Product Proof Interactive Simulation States
  const [scanSimState, setScanSimState] = useState<"idle" | "scanning" | "success" | "duplicate">("idle");
  const [scanCount, setScanCount] = useState<number>(412);
  const [passTheme, setPassTheme] = useState<"corporate" | "luxe" | "neon" | "minimal">("corporate");
  const [holoShimmer, setHoloShimmer] = useState<boolean>(true);
  const [instantApproval, setInstantApproval] = useState<boolean>(true);
  const [simFormValues, setSimFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    (funnelIntent.sampleFormFields || []).forEach((f) => {
      initial[f.label] = f.value;
    });
    return initial;
  });
  const [simulatingExport, setSimulatingExport] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleSimulateScan = () => {
    setScanSimState("scanning");
    setTimeout(() => {
      setScanSimState("success");
      setScanCount((prev) => prev + 1);
    }, 280);
  };

  const handleSimulateDuplicate = () => {
    setScanSimState("scanning");
    setTimeout(() => {
      setScanSimState("duplicate");
    }, 280);
  };

  const handleResetScanner = () => {
    setScanSimState("idle");
  };

  const handleSimulateExport = () => {
    setSimulatingExport(true);
    setExportComplete(false);
    setTimeout(() => {
      setSimulatingExport(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 600);
  };

  // Safe Normalizations for SEO/GEO Landing Pages
  const normalizedGeoAnswer = config.geoAnswerBlock || {
    question: `How does UrPass solve ${config.primaryKeyword}?`,
    answer: config.heroDescription,
    highlights: [
      "Sub-0.28s gate check-in scanning on standard mobile phones",
      "0% platform ticketing fee on all sold tickets and passes",
      "Offline gate resilience during Wi-Fi or mobile network drops",
      "Real-time attendance tracking and verified compliance audit logs",
    ],
  };

  const normalizedFaqs = (config.faqSection?.faqs || []).map((faq: any) => ({
    q: faq.q || faq.question || "",
    a: faq.a || faq.answer || "",
  }));

  const rawSteps =
    config.howItWorksSection?.steps ||
    (config.howItWorksSection as any)?.items ||
    [];
  const normalizedWorkflowSteps: SeoGeoWorkflowStep[] = rawSteps.map((step: any, idx: number) => ({
    stepNumber: step.stepNumber || `Step ${idx + 1}`,
    title: step.title,
    description: step.description,
  }));

  const normalizedWorkflowCtaLabel =
    config.howItWorksSection?.ctaLabel || primaryCtaLabel;

  const rawEventTypes =
    config.eventTypesSection?.items ||
    (config as any).useCasesSection?.items ||
    [];
  const normalizedEventTypes: SeoGeoEventType[] = rawEventTypes.map((item: any) => ({
    title: item.title,
    description: item.description,
    badge: item.badge,
  }));

  const normalizedComparison = config.comparisonSection || {
    badge: "COMPARISON",
    title: `Why Use UrPass for ${config.primaryKeyword}?`,
    summaryText: "UrPass replaces fragile spreadsheets and manual clipboards with automated sub-second digital verification.",
    headers: ["Manual & Legacy Methods", "UrPass Platform"] as [string, string],
    rows: [
      {
        manual: "Paper sign-in sheets or slow spreadsheet searches causing 45s gate delays",
        urpass: "Sub-0.28s camera verification on standard iOS and Android phones",
      },
      {
        manual: "Unsecured barcodes easily shared or screenshotted among attendees",
        urpass: "Dynamic holographic security foils and instant duplicate pass alerts",
      },
      {
        manual: "Third-party ticketing platforms deducting 5% to 10% commission on passes",
        urpass: "0% platform ticketing fee with direct gateway payouts to your account",
      },
      {
        manual: "Cloud-only apps that freeze when convention hall mobile signals dip",
        urpass: "100% offline-first scanning engine with automatic background sync",
      },
    ],
  };

  const audienceList = config.audienceSection?.audiences || (config.audience
    ? config.audience.split(/,|and/).map((s) => s.trim()).filter(Boolean)
    : [
        "Corporate Event Directors",
        "Conference Operations Leads",
        "Registration Coordinators",
        "Venue Security Supervisors",
        "Experiential Production Teams",
      ]);

  const normalizedAudience = {
    badge: config.audienceSection?.badge || "AUDIENCE",
    title: config.audienceSection?.title || `Who Uses UrPass for ${config.primaryKeyword}?`,
    leadText:
      config.audienceSection?.leadText ||
      `Designed specifically for ${config.audience || "event organizers, operations leads, and registration coordinators"}.`,
    audiences: audienceList,
    summaryText:
      config.audienceSection?.summaryText ||
      "Whether coordinating a multi-hall industry convention or an executive summit, UrPass provides complete registration and gate check-in confidence.",
  };

  const closingCtaRaw = config.closingCtaSection || (config as any).finalCta;
  const normalizedClosingCta = {
    badge: closingCtaRaw?.badge || "GET STARTED",
    title: closingCtaRaw?.title || `Ready to Simplify ${config.primaryKeyword}?`,
    description:
      closingCtaRaw?.description ||
      "Join hundreds of organizers delivering queue-free check-ins. Start free today.",
    primaryCtaLabel: closingCtaRaw?.primaryCtaLabel || config.primaryCtaLabel || "Create Free Event",
    secondaryCtaLabel: closingCtaRaw?.secondaryCtaLabel || config.secondaryCtaLabel || "Explore Plans",
  };

  const salesDemoRaw = config.salesDemoSection;
  const normalizedSalesDemo = {
    badge: salesDemoRaw?.badge || "SALES & DEMO",
    title: salesDemoRaw?.title || `Need Help Setting Up Your ${config.primaryKeyword}?`,
    description:
      salesDemoRaw?.description ||
      "Speak directly with our technical event specialists. We'll walk you through gate scanner deployment, badge design, and registration workflows.",
    submitCtaLabel: salesDemoRaw?.submitCtaLabel || "Request Event Walkthrough",
    disclaimer: salesDemoRaw?.disclaimer || "No spam. Unsubscribe anytime. We respond within 1 business day.",
    tagline: salesDemoRaw?.tagline || "Dedicated Event Specialist Assistance",
  };

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${config.canonicalUrl}#webpage`,
        url: config.canonicalUrl,
        name: config.seoTitle,
        description: config.metaDescription,
        inLanguage: "en-US",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://urpass.space" },
            { "@type": "ListItem", position: 2, name: "Solutions", item: "https://urpass.space/solutions" },
            { "@type": "ListItem", position: 3, name: config.h1, item: config.canonicalUrl },
          ],
        },
        publisher: {
          "@type": "Organization",
          name: "UrPass",
          url: "https://urpass.space",
          logo: {
            "@type": "ImageObject",
            url: "https://urpass.space/icon.png",
          },
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "UrPass",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, iOS, Android",
        url: config.canonicalUrl,
        description: config.metaDescription,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "94",
        },
        offers: [
          {
            "@type": "Offer",
            name: "Free Forever Plan",
            price: "0",
            priceCurrency: "INR",
            description: "1 active event, 100 registrations/month, 0% platform fee.",
          },
          {
            "@type": "Offer",
            name: "Starter Plan",
            price: "499",
            priceCurrency: "INR",
            billingIncrement: "P1M",
          },
          {
            "@type": "Offer",
            name: "Pro Plan",
            price: "999",
            priceCurrency: "INR",
            billingIncrement: "P1M",
          },
          {
            "@type": "Offer",
            name: "Business Plan",
            price: "2499",
            priceCurrency: "INR",
            billingIncrement: "P1M",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: normalizedFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-violet-100 selection:text-violet-900">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 text-white pt-24 pb-20 sm:pt-28 sm:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-neutral-400 font-medium">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-neutral-500">Solutions</span>
              <span>/</span>
              <span className="text-violet-400 font-semibold truncate">{config.primaryKeyword}</span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span>{config.badge}</span>
            </div>

            {/* H1 & Lead */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
              {config.h1}
            </h1>

            <p className="mt-6 text-xl sm:text-2xl font-semibold text-violet-200/90 max-w-3xl leading-snug">
              {config.heroSubtitle}
            </p>

            <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
              {config.heroDescription}
            </p>

            {/* Hero Conversion CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={signupUrl}
                onClick={handlePrimaryCtaClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base shadow-xl shadow-violet-600/25 hover:shadow-violet-600/40 transition-all transform active:scale-[0.98]"
              >
                <span>{primaryCtaLabel}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <button
                type="button"
                onClick={handleDemoCtaClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold text-base transition-all hover:border-neutral-600"
              >
                <span>{config.secondaryCtaLabel}</span>
              </button>
            </div>

            {/* Assurance Points */}
            <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero setup fees & 0% UrPass ticketing commission
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Works on any mobile browser (Safari / Chrome)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Designed for HR, admins & event agencies
              </span>
            </div>
          </div>
        </section>

        {/* 2. THE PROBLEM / CHALLENGE SECTION */}
        <section className="py-20 bg-neutral-50 border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100/70 px-3 py-1 rounded-full border border-violet-200/50 inline-block mb-3">
                {config.problemSection.badge || "THE PROBLEM"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {config.problemSection.title}
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4 text-base sm:text-lg text-neutral-700 leading-relaxed">
                {config.problemSection.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Visual Card: Scattered vs Unified */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
                  The Operational Reality
                </h3>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                    <span className="text-red-500 font-bold text-sm shrink-0">✕</span>
                    <p className="text-xs sm:text-sm text-red-950 leading-snug">
                      <strong>Scattered Systems:</strong> Spreadsheets for signups, manual email blasts, and printed entry checklists that get lost or duplicated.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                    <span className="text-amber-600 font-bold text-sm shrink-0">!</span>
                    <p className="text-xs sm:text-sm text-amber-950 leading-snug">
                      <strong>Entrance Bottlenecks:</strong> Staff flipping through paper sheets, causing awkward delays for VIPs and keynote attendees.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-snug">
                      <strong>The UrPass Centralized Solution:</strong> One clean platform linking online registration, branded QR passes, and instant entrance scanning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. GEO-READY ANSWER BLOCK (Crucial for AI Overviews & Search Summaries) */}
        <section className="py-14 bg-white border-b border-neutral-200" id="geo-answer">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50/60 via-white to-violet-50/40 p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-violet-100">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    RECOMMENDED ANSWER BLOCK
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                    {normalizedGeoAnswer.question}
                  </h2>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-violet-800 bg-violet-100/80 px-3 py-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  <span>GEO & AI Optimized</span>
                </div>
              </div>

              <p className="mt-4 text-base sm:text-lg text-neutral-800 leading-relaxed font-normal">
                {normalizedGeoAnswer.answer}
              </p>

              {normalizedGeoAnswer.highlights && (
                <div className="mt-6 pt-5 border-t border-violet-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {normalizedGeoAnswer.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. CORE CAPABILITIES (Everything You Need to Manage Corporate Event Registrations) */}
        <section className="py-20 bg-neutral-50/70 border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full border border-violet-200/60 inline-block mb-3">
                {config.capabilitiesSection.badge || "CAPABILITIES"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {config.capabilitiesSection.title}
              </h2>
              {config.capabilitiesSection.subtitle && (
                <p className="mt-4 text-neutral-600 text-base sm:text-lg">
                  {config.capabilitiesSection.subtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.capabilitiesSection.items.map((item, idx) => {
                const getIcon = (iconName?: string) => {
                  switch (iconName) {
                    case "file-text":
                      return <FileText className="w-6 h-6 text-violet-600" />;
                    case "sliders":
                      return <Sliders className="w-6 h-6 text-violet-600" />;
                    case "qr-code":
                      return <QrCode className="w-6 h-6 text-violet-600" />;
                    case "scan-line":
                      return <ScanLine className="w-6 h-6 text-violet-600" />;
                    case "bar-chart-3":
                      return <BarChart3 className="w-6 h-6 text-violet-600" />;
                    default:
                      return <Sparkles className="w-6 h-6 text-violet-600" />;
                  }
                };

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl bg-white border border-neutral-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-violet-300 transition-all hover:shadow-md ${
                      idx === 0 || idx === 3 ? "lg:col-span-1" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                          {getIcon(item.icon)}
                        </div>
                        <span className="font-mono text-xs font-bold text-neutral-400">
                          {item.stepNumber}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {item.bestFor && (
                      <div className="mt-6 pt-4 border-t border-neutral-100">
                        <span className="text-[11px] font-bold text-violet-800 uppercase tracking-wider block mb-1">
                          Best for:
                        </span>
                        <p className="text-xs text-neutral-600 leading-snug">
                          {item.bestFor}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. PRODUCT PROOF & INTERACTIVE WALKTHROUGH (Requirement #5: Real screenshots / interfaces) */}
        <section
          className="py-20 bg-neutral-950 text-white border-b border-neutral-800 scroll-mt-20"
          id="product-walkthrough"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3.5 py-1.5 rounded-full border border-violet-500/20 inline-block mb-3">
                {config.productProofSection?.badge || "PRACTICAL EVIDENCE"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {config.productProofSection?.title || "Real UrPass Software in Action"}
              </h2>
              <p className="mt-3 text-neutral-400 text-sm sm:text-base">
                {config.productProofSection?.subtitle ||
                  "Verified interfaces matching the live UrPass application architecture."}
              </p>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button
                type="button"
                onClick={() => setActiveProofTab("form")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeProofTab === "form"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                1. Registration Form Builder
              </button>
              <button
                type="button"
                onClick={() => setActiveProofTab("pass")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeProofTab === "pass"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                2. Digital QR Pass
              </button>
              <button
                type="button"
                onClick={() => setActiveProofTab("scanner")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeProofTab === "scanner"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                3. Sub-0.3s Camera Scanner
              </button>
              <button
                type="button"
                onClick={() => setActiveProofTab("analytics")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeProofTab === "analytics"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                4. Live Attendance Dashboard
              </button>
            </div>

            {/* Proof Container Frame */}
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-4 sm:p-8 shadow-2xl relative">
              {/* Tab 1: Form Builder */}
              {activeProofTab === "form" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-mono text-violet-400 font-bold uppercase tracking-wider">
                      CONFIGURATION CANVAS
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {funnelIntent.suggestedEventName}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Build dedicated intake experiences tailored for your attendees. Carry every custom field directly onto attendee QR passes, issue automatic confirmations, and toggle host approvals.
                    </p>
                    <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-300 font-medium">Instant QR Delivery</span>
                        <button
                          type="button"
                          onClick={() => setInstantApproval(!instantApproval)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                            instantApproval ? "bg-violet-600" : "bg-neutral-700"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              instantApproval ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        {instantApproval
                          ? "✓ Passes generate immediately upon form submission."
                          : "Require organizer review before attendee pass is issued."}
                      </p>
                    </div>
                    <ul className="space-y-2 text-xs text-neutral-300 font-medium pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        Zero ads or competitor links on your registration page
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        Custom fields pass through to scanner &amp; badge prints
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        Capacity cap enforced with atomic transaction locks
                      </li>
                    </ul>
                  </div>

                  {/* UI Mockup Card */}
                  <div className="lg:col-span-7 bg-white text-neutral-900 rounded-2xl p-6 sm:p-7 shadow-lg border border-neutral-200">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400" />
                        <span className="w-3 h-3 rounded-full bg-amber-400" />
                        <span className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-xs font-mono text-neutral-500 ml-2">urpass.space/e/{config.slug}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md border border-violet-100">
                        INTERACTIVE PREVIEW
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-bold text-neutral-900">
                          {funnelIntent.suggestedEventName}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {funnelIntent.badgeSummary}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {(funnelIntent.sampleFormFields || []).map((field, idx) => (
                          <div key={idx}>
                            <label className="text-xs font-semibold text-neutral-700 block mb-1">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              value={simFormValues[field.label] ?? field.value}
                              onChange={(e) =>
                                setSimFormValues({ ...simFormValues, [field.label]: e.target.value })
                              }
                              placeholder={field.placeholder}
                              className="w-full rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-violet-600 focus:bg-white transition-all"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <Link
                          href={signupUrl}
                          onClick={handlePrimaryCtaClick}
                          className="w-full block py-3 rounded-xl bg-violet-700 hover:bg-violet-600 text-white font-bold text-xs uppercase tracking-wider text-center transition-all shadow-sm"
                        >
                          {primaryCtaLabel} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Digital QR Pass & Badge Designer */}
              {activeProofTab === "pass" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <span className="text-xs font-mono text-violet-400 font-bold uppercase tracking-wider">
                      ATTENDEE CREDENTIAL
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      Digital Pass &amp; Badge Simulator
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Instant delivery via Email, WhatsApp, and Apple / Google Wallet. Anti-counterfeit holographic foil blocks screenshots and fraudulent duplications.
                    </p>

                    {/* Theme Controls */}
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                        Select Ticket Design Theme:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setPassTheme("corporate")}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            passTheme === "corporate"
                              ? "bg-violet-600 text-white"
                              : "bg-neutral-800 text-neutral-400 hover:text-white"
                          }`}
                        >
                          Corporate
                        </button>
                        <button
                          type="button"
                          onClick={() => setPassTheme("luxe")}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            passTheme === "luxe"
                              ? "bg-amber-600 text-white"
                              : "bg-neutral-800 text-neutral-400 hover:text-white"
                          }`}
                        >
                          Luxe Gold
                        </button>
                        <button
                          type="button"
                          onClick={() => setPassTheme("neon")}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            passTheme === "neon"
                              ? "bg-purple-600 text-white"
                              : "bg-neutral-800 text-neutral-400 hover:text-white"
                          }`}
                        >
                          Neon Glow
                        </button>
                        <button
                          type="button"
                          onClick={() => setPassTheme("minimal")}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            passTheme === "minimal"
                              ? "bg-neutral-200 text-neutral-900"
                              : "bg-neutral-800 text-neutral-400 hover:text-white"
                          }`}
                        >
                          Clean Slate
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                        <span className="text-xs text-neutral-300">Dynamic Holographic Shimmer</span>
                        <button
                          type="button"
                          onClick={() => setHoloShimmer(!holoShimmer)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                            holoShimmer ? "bg-emerald-600" : "bg-neutral-700"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              holoShimmer ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Pass Mockup */}
                  <div className="lg:col-span-6 flex justify-center">
                    <div
                      className={`w-full max-w-xs rounded-2xl p-5 border-2 shadow-2xl transition-all relative overflow-hidden ${
                        passTheme === "corporate"
                          ? "bg-gradient-to-b from-slate-900 to-indigo-950 text-white border-indigo-500/40"
                          : passTheme === "luxe"
                          ? "bg-gradient-to-b from-neutral-950 via-zinc-900 to-neutral-900 text-amber-200 border-amber-500/40"
                          : passTheme === "neon"
                          ? "bg-gradient-to-b from-neutral-950 via-purple-950 to-neutral-900 text-purple-200 border-purple-500/50 shadow-purple-900/30"
                          : "bg-white text-neutral-900 border-neutral-300"
                      }`}
                    >
                      {holoShimmer && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite] pointer-events-none" />
                      )}

                      <div className="flex items-center justify-between border-b pb-3 mb-4 border-current/20">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">
                            {funnelIntent.sampleTicket.ticketTier}
                          </span>
                          <h4 className="text-sm font-bold truncate max-w-[170px]">
                            {funnelIntent.sampleTicket.eventName}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                          VERIFIED
                        </span>
                      </div>

                      {/* Mock QR Canvas */}
                      <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center my-2 shadow-inner">
                        <QrCode className="w-32 h-32 text-neutral-950" />
                        <span className="text-[10px] font-mono text-neutral-500 mt-2">
                          {funnelIntent.sampleTicket.token}
                        </span>
                      </div>

                      <div className="space-y-1 pt-2 text-center">
                        <p className="text-sm font-bold">{funnelIntent.sampleTicket.attendeeName}</p>
                        <p className="text-xs opacity-75">{funnelIntent.sampleTicket.organization}</p>
                        <div className="pt-2">
                          <span className="inline-block px-3 py-1 rounded-md bg-black/40 text-current font-mono text-[10px] border border-current/20">
                            {funnelIntent.sampleTicket.zone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Scanner Interface */}
              {activeProofTab === "scanner" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      SUB-0.28s CAMERA VERIFICATION
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      Instant Gate Check-In Simulator
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Experience the gate staff scanning flow. Click below to test sub-second check-in or test the atomic anti-passback duplicate ticket blocker.
                    </p>

                    {/* Simulator Action Buttons */}
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSimulateScan}
                        disabled={scanSimState === "scanning"}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
                      >
                        <ScanLine className="w-4 h-4" />
                        <span>Simulate Camera Scan (0.28s)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSimulateDuplicate}
                        disabled={scanSimState === "scanning"}
                        className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-red-950/60 border border-neutral-700 hover:border-red-500 text-neutral-200 hover:text-red-300 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <span>Test Duplicate Pass Prevention</span>
                      </button>

                      {scanSimState !== "idle" && (
                        <button
                          type="button"
                          onClick={handleResetScanner}
                          className="w-full py-1.5 text-xs text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset Scanner</span>
                        </button>
                      )}
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-neutral-300">
                        <span>Duplicate Prevention:</span>
                        <span className="text-emerald-400 font-bold">Atomic Row Lock</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-300">
                        <span>Scan Latency:</span>
                        <span className="text-emerald-400 font-bold">&lt; 0.28 seconds</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-300">
                        <span>Offline Resilience:</span>
                        <span className="text-emerald-400 font-bold">IndexedDB Cache Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Scanner Mockup */}
                  <div className="lg:col-span-7 bg-black text-white rounded-2xl p-6 border border-neutral-800 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            scanSimState === "duplicate" ? "bg-red-400" : "bg-emerald-400"
                          } animate-ping`}
                        />
                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                          GATE SCANNER ACTIVE
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono">GATE 01 - MAIN ENTRANCE</span>
                    </div>

                    {/* Viewport simulation */}
                    <div
                      className={`h-60 rounded-xl border-2 flex flex-col items-center justify-center relative p-4 transition-all ${
                        scanSimState === "success"
                          ? "border-emerald-500 bg-emerald-950/30"
                          : scanSimState === "duplicate"
                          ? "border-red-500 bg-red-950/40"
                          : "border-neutral-700 bg-neutral-950/80"
                      }`}
                    >
                      {scanSimState === "scanning" && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[pulse_0.28s_infinite] shadow-lg shadow-cyan-400/50" />
                      )}

                      <div
                        className={`w-36 h-36 border-2 border-dashed rounded-lg flex items-center justify-center mb-3 transition-colors ${
                          scanSimState === "success"
                            ? "border-emerald-400"
                            : scanSimState === "duplicate"
                            ? "border-red-400"
                            : "border-neutral-600"
                        }`}
                      >
                        {scanSimState === "success" ? (
                          <Check className="w-16 h-16 text-emerald-400 animate-scale-in" />
                        ) : scanSimState === "duplicate" ? (
                          <ShieldAlert className="w-16 h-16 text-red-400 animate-bounce" />
                        ) : (
                          <ScanLine className="w-16 h-16 text-neutral-400 animate-pulse" />
                        )}
                      </div>

                      {scanSimState === "success" && (
                        <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center gap-1.5 text-center">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>VERIFIED: {funnelIntent.sampleTicket.attendeeName} (Checked In)</span>
                        </div>
                      )}

                      {scanSimState === "duplicate" && (
                        <div className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500 text-red-300 font-bold text-xs flex items-center gap-1.5 text-center">
                          <ShieldAlert className="w-4 h-4 text-red-400" />
                          <span>DUPLICATE BLOCKED: Pass already used 4m ago at Gate 01</span>
                        </div>
                      )}

                      {scanSimState === "idle" && (
                        <span className="text-xs text-neutral-400 font-mono">
                          Ready for attendee QR code
                        </span>
                      )}

                      {scanSimState === "scanning" && (
                        <span className="text-xs text-cyan-400 font-mono animate-pulse">
                          Verifying cryptographic signature…
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                      <span>Total Scans: {scanCount} / 500</span>
                      <span className="text-emerald-400 font-medium">Sub-0.28s audio chime active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Live Attendance Dashboard */}
              {activeProofTab === "analytics" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-mono text-violet-400 font-bold uppercase tracking-wider">
                      REAL-TIME VISIBILITY
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      Live Attendance Operations
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Monitor exact arrival pacing, track checked-in vs registered headcounts, and export comprehensive CSV logs with verified entry timestamps for post-event audit.
                    </p>
                    <ul className="space-y-2 text-xs text-neutral-300 font-medium pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        Headcount by category, department, or session
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        Instant no-show reporting for catering reconciliation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        One-click CSV / Excel attendance log download
                      </li>
                    </ul>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSimulateExport}
                        disabled={simulatingExport}
                        className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        {simulatingExport ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Exporting Verified Audit Log…</span>
                          </>
                        ) : exportComplete ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">✓ attendance-audit-log.csv exported</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Simulate Audit CSV Log Export</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dashboard Preview */}
                  <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-5">
                      <span className="text-xs font-mono text-violet-400 font-bold">ORGANIZER CONSOLE</span>
                      <span className="text-[11px] text-neutral-400">Live Pacing Active</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold block">REGISTERED</span>
                        <span className="text-2xl font-extrabold text-white">500</span>
                      </div>
                      <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">CHECKED IN</span>
                        <span className="text-2xl font-extrabold text-emerald-400">{scanCount}</span>
                      </div>
                      <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                        <span className="text-[10px] text-amber-400 uppercase font-bold block">REMAINING</span>
                        <span className="text-2xl font-extrabold text-amber-400">{Math.max(0, 500 - scanCount)}</span>
                      </div>
                    </div>

                    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-neutral-400 font-medium">Arrival Velocity Pacing</span>
                        <span className="text-emerald-400 font-mono">
                          {((scanCount / 500) * 100).toFixed(1)}% Admitted
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (scanCount / 500) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Simulator Conversion Bar */}
              <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Preconfigured for: <span className="text-violet-400">{funnelIntent.suggestedEventName}</span>
                  </p>
                  <p className="text-xs text-neutral-400">
                    Carries your event name, ticket template and scanner configuration directly into onboarding.
                  </p>
                </div>
                <Link
                  href={signupUrl}
                  onClick={handlePrimaryCtaClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition-all shrink-0 active:scale-[0.98]"
                >
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5.5 INTERACTIVE ACQUISITION CALCULATOR */}
        <section className="py-16 bg-neutral-900 border-b border-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <InteractiveConversionCalculator
              ctaUrl={signupUrl}
              ctaText={primaryCtaLabel}
              className="border-neutral-800 bg-neutral-950 text-white"
            />
          </div>
        </section>

        {/* 6. HOW CORPORATE EVENT REGISTRATION WORKS (5-Step Process) */}
        <section className="py-20 bg-white border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full border border-violet-200/60 inline-block mb-3">
                {config.howItWorksSection.badge || "WORKFLOW"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {config.howItWorksSection.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {normalizedWorkflowSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col justify-between hover:border-violet-300 transition-all hover:bg-white hover:shadow-sm"
                >
                  <div>
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-violet-600 font-bold text-white text-xs mb-4">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-200/60 text-[10px] font-mono text-neutral-400">
                    {step.stepNumber}
                  </div>
                </div>
              ))}
            </div>

            {/* Workflow CTA */}
            <div className="mt-12 text-center">
              <Link
                href={signupUrl}
                onClick={handlePrimaryCtaClick}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-700 hover:bg-violet-600 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <span>{normalizedWorkflowCtaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 7. BUILT FOR DIFFERENT TYPES OF CORPORATE EVENTS */}
        <section className="py-20 bg-neutral-50/70 border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full border border-violet-200/60 inline-block mb-3">
                {config.eventTypesSection?.badge || "USE CASES"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {config.eventTypesSection?.title || "Relevant Use Cases & Event Formats"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {normalizedEventTypes.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:border-violet-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {item.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md border border-violet-100 inline-block mb-3">
                        {item.badge}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs text-violet-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-violet-600" />
                    <span>UrPass Supported</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. COMPARISON TABLE: WHY USE URPASS INSTEAD OF MANUAL REGISTRATION? */}
        <section className="py-20 bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full border border-violet-200/60 inline-block mb-3">
                {normalizedComparison.badge || "COMPARISON"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {normalizedComparison.title}
              </h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-900 text-white text-xs sm:text-sm uppercase tracking-wider">
                    <th className="py-4 px-6 font-bold w-1/2">
                      {normalizedComparison.headers[0]}
                    </th>
                    <th className="py-4 px-6 font-bold w-1/2 bg-violet-950 text-violet-200 border-l border-neutral-800">
                      {normalizedComparison.headers[1]}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-xs sm:text-sm">
                  {normalizedComparison.rows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60"}>
                      <td className="py-4 px-6 text-neutral-700 font-medium">
                        <span className="inline-block mr-2 text-neutral-400">•</span>
                        {row.manual}
                      </td>
                      <td className="py-4 px-6 font-bold text-violet-950 bg-violet-50/40 border-l border-neutral-200">
                        <span className="inline-block mr-2 text-emerald-600">✓</span>
                        {row.urpass}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              {normalizedComparison.summaryText}
            </p>
          </div>
        </section>

        {/* 9. WHO CAN USE URPASS FOR CORPORATE EVENTS? */}
        <section className="py-20 bg-neutral-50/70 border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full border border-violet-200/60 inline-block mb-3">
                {normalizedAudience.badge || "AUDIENCE"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {normalizedAudience.title}
              </h2>
              {normalizedAudience.leadText && (
                <p className="mt-3 text-neutral-600 text-sm sm:text-base font-medium">
                  {normalizedAudience.leadText}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {normalizedAudience.audiences.map((aud, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm flex items-start gap-3 hover:border-violet-300 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-800 leading-snug">
                    {aud}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-neutral-700 leading-relaxed max-w-2xl mx-auto font-medium">
              {normalizedAudience.summaryText}
            </p>
          </div>
        </section>

        {/* 10. FAQS ACCORDION */}
        <section className="py-20 bg-white border-b border-neutral-200" id="faqs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full border border-violet-200/60 inline-block mb-3">
                {config.faqSection.badge || "FAQ"}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                {config.faqSection.title}
              </h2>
            </div>

            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {normalizedFaqs.map((faq, idx) => {
                const isOpen = openFaqs[idx] || false;
                return (
                  <div key={idx} className="py-5">
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <span className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-violet-700 transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-neutral-500 shrink-0 ml-4 transition-transform ${
                          isOpen ? "rotate-180 text-violet-700" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed pr-8">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 11. CLOSING CONVERSION CTA */}
        <section className="py-20 bg-gradient-to-br from-violet-950 via-neutral-900 to-neutral-950 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300 bg-violet-500/20 px-3 py-1 rounded-full border border-violet-500/30 mb-4">
              {normalizedClosingCta.badge || "GET STARTED"}
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 max-w-2xl">
              {normalizedClosingCta.title}
            </h2>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mb-8 leading-relaxed">
              {normalizedClosingCta.description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={signupUrl}
                onClick={handlePrimaryCtaClick}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base shadow-xl transition-all"
              >
                <span>{normalizedClosingCta.primaryCtaLabel}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href={`/pricing?source=${encodeURIComponent(config.pageId)}`}
                onClick={handlePricingCtaClick}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold text-base transition-all"
              >
                <span>{normalizedClosingCta.secondaryCtaLabel}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 12. SALES LEAD DEMO FORM SECTION (Need Help Setting Up Your Corporate Event?) */}
        <section className="py-20 bg-neutral-50 border-t border-neutral-200" id="request-demo">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-lg">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full border border-violet-200/60 inline-block mb-3">
                  {normalizedSalesDemo.badge || "SALES & DEMO"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {normalizedSalesDemo.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                  {normalizedSalesDemo.description}
                </p>
              </div>

              {demoSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950">
                    Demo Request Received!
                  </h4>
                  <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you. Our corporate events specialist has received your inquiry and will reach out to <strong>{demoFormData.workEmail}</strong> within 1 business day with a customized walkthrough.
                  </p>
                  <p className="text-xs font-mono text-emerald-700 pt-2">
                    Attribution Tag: {config.pageId}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  {demoError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{demoError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={demoFormData.fullName}
                        onChange={(e) => setDemoFormData({ ...demoFormData, fullName: e.target.value })}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-violet-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={demoFormData.workEmail}
                        onChange={(e) => setDemoFormData({ ...demoFormData, workEmail: e.target.value })}
                        placeholder="e.g. priya@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-violet-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={demoFormData.companyName}
                        onChange={(e) => setDemoFormData({ ...demoFormData, companyName: e.target.value })}
                        placeholder="e.g. Acme Enterprise"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-violet-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                        Event Type
                      </label>
                      <select
                        value={demoFormData.eventType}
                        onChange={(e) => setDemoFormData({ ...demoFormData, eventType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-violet-600 focus:bg-white transition-all"
                      >
                        <option value="Corporate Conference">Corporate Conference</option>
                        <option value="Employee Engagement / All Hands">Employee Engagement / All Hands</option>
                        <option value="Seminar / Workshop">Seminar / Workshop</option>
                        <option value="Product Launch">Product Launch</option>
                        <option value="Business Networking Event">Business Networking Event</option>
                        <option value="Annual General Meeting (AGM)">Annual General Meeting (AGM)</option>
                        <option value="Other Corporate Gathering">Other Corporate Gathering</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                        Estimated Attendee Count
                      </label>
                      <select
                        value={demoFormData.attendeeCount}
                        onChange={(e) => setDemoFormData({ ...demoFormData, attendeeCount: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-violet-600 focus:bg-white transition-all"
                      >
                        <option value="Under 100 attendees">Under 100 attendees</option>
                        <option value="100 - 500 attendees">100 - 500 attendees</option>
                        <option value="500 - 2,000 attendees">500 - 2,000 attendees</option>
                        <option value="2,000 - 10,000 attendees">2,000 - 10,000 attendees</option>
                        <option value="10,000+ attendees">10,000+ attendees</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block mb-1.5">
                        Event Date (optional)
                      </label>
                      <input
                        type="date"
                        value={demoFormData.eventDate}
                        onChange={(e) => setDemoFormData({ ...demoFormData, eventDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:border-violet-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingDemo}
                      className="w-full py-4 rounded-xl bg-violet-700 hover:bg-violet-600 text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                    >
                      {isSubmittingDemo ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Submitting Request…</span>
                        </>
                      ) : (
                        <span>{normalizedSalesDemo.submitCtaLabel}</span>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-neutral-500 text-center leading-relaxed italic pt-1">
                    {normalizedSalesDemo.disclaimer}
                  </p>
                </form>
              )}

              {/* Tagline Footer */}
              <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                <p className="text-xs font-bold text-neutral-800 tracking-wider">
                  {normalizedSalesDemo.tagline}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
