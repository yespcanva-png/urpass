"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  STUDIO_TEMPLATES,
  type StudioTemplateDefinition,
  SINGLE_TEMPLATE_PRICE_INR,
  ALL_ACCESS_BUNDLE_PRICE_INR,
} from "@/lib/studio/templates";
import { parseUnlockedCookie, isTemplateUnlocked } from "@/lib/studio/purchases";
import TicketVisualShowcase from "./TicketVisualShowcase";
import TemplateShowcaseModal from "./TemplateShowcaseModal";
import TemplateCheckoutModal from "./TemplateCheckoutModal";
import {
  Sparkles,
  Smartphone,
  Ticket,
  CreditCard,
  Check,
  Zap,
  ArrowRight,
  Filter,
  CheckCircle2,
  Lock,
  Eye,
  Maximize2,
  ShieldCheck,
  Search,
} from "lucide-react";

interface TicketTemplateListProps {
  initialUnlocked?: string[];
  isPro?: boolean;
  userEmail?: string;
  isInApp?: boolean;
}

export default function TicketTemplateList({
  initialUnlocked = [],
  isPro = false,
  userEmail: propUserEmail,
  isInApp = false,
}: TicketTemplateListProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<"all" | "free" | "paid">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [unlockedList, setUnlockedList] = useState<string[]>(initialUnlocked);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isInApp);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(propUserEmail || "");

  // Showcase Popup Modal State
  const [selectedShowcaseTemplate, setSelectedShowcaseTemplate] =
    useState<StudioTemplateDefinition | null>(null);

  // Checkout Modal State
  const [activeCheckoutModal, setActiveCheckoutModal] = useState<{
    isOpen: boolean;
    templateId: string;
    templateName: string;
    priceINR: number;
    format: string;
    thumbnailBg: string;
    isBundle: boolean;
  }>({
    isOpen: false,
    templateId: "",
    templateName: "",
    priceINR: SINGLE_TEMPLATE_PRICE_INR,
    format: "digital",
    thumbnailBg: "#18181B",
    isBundle: false,
  });

  // Check auth and cookies on mount
  useEffect(() => {
    async function checkAuthAndPurchases() {
      // 1. Read cookies
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/urpass_unlocked_templates=([^;]+)/);
        if (match && match[1]) {
          const fromCookie = parseUnlockedCookie(match[1]);
          setUnlockedList((prev) => Array.from(new Set([...prev, ...fromCookie])));
        }
      }

      // 2. Check Supabase auth
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setIsAuthenticated(true);
          setCurrentUserEmail(user.email || "");

          // Check if profile has unlocked_templates
          const { data: profile } = await supabase
            .from("profiles")
            .select("unlocked_templates")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profile?.unlocked_templates && Array.isArray(profile.unlocked_templates)) {
            setUnlockedList((prev) =>
              Array.from(new Set([...prev, ...profile.unlocked_templates]))
            );
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    checkAuthAndPurchases();
  }, [isInApp]);

  const categories = [
    "All",
    "College",
    "Hackathon",
    "VIP",
    "Concert",
    "Corporate",
    "Conference",
    "Minimal",
    "Workshop",
    "Sports",
    "Exhibition",
    "Community",
    "Luxury",
  ];

  const filteredTemplates = STUDIO_TEMPLATES.filter((tpl) => {
    const matchesFormat = selectedFormat === "all" || tpl.format === selectedFormat;
    const matchesTier =
      selectedTier === "all" ||
      (selectedTier === "free" && tpl.tier !== "paid") ||
      (selectedTier === "paid" && tpl.tier === "paid");
    const matchesCategory =
      selectedCategory === "All" || tpl.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFormat && matchesTier && matchesCategory && matchesSearch;
  });

  function getFormatBadge(format: string) {
    switch (format) {
      case "printable":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30 backdrop-blur-md">
            <Ticket className="w-3 h-3" />
            Printable Stub
          </span>
        );
      case "badge":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider border border-sky-400/30 backdrop-blur-md">
            <CreditCard className="w-3 h-3" />
            Lanyard Badge
          </span>
        );
      case "digital":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-wider border border-violet-400/30 backdrop-blur-md">
            <Smartphone className="w-3 h-3" />
            Digital Pass
          </span>
        );
    }
  }

  function handleOpenShowcase(tpl: StudioTemplateDefinition) {
    setSelectedShowcaseTemplate(tpl);
  }

  function handleOpenCheckout(tpl: StudioTemplateDefinition) {
    setActiveCheckoutModal({
      isOpen: true,
      templateId: tpl.id,
      templateName: tpl.name,
      priceINR: tpl.priceINR ?? SINGLE_TEMPLATE_PRICE_INR,
      format: tpl.format,
      thumbnailBg: tpl.thumbnailBg,
      isBundle: false,
    });
  }

  function handleOpenBundleCheckout() {
    setActiveCheckoutModal({
      isOpen: true,
      templateId: "all-access-bundle",
      templateName: "All-Access 12-Template Master Pack",
      priceINR: ALL_ACCESS_BUNDLE_PRICE_INR,
      format: "digital",
      thumbnailBg: "#18181B",
      isBundle: true,
    });
  }

  function handleSuccessUnlock(tplId: string) {
    setUnlockedList((prev) => {
      const next = tplId === "all-access-bundle" ? [...prev, "all"] : [...prev, tplId];
      return Array.from(new Set(next));
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* ── All-Access Master Pack Promotion Banner ── */}
      <div className="bg-gradient-to-r from-neutral-950 via-violet-950 to-neutral-900 border border-violet-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/30 text-violet-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            ORGANIZER MASTER PACK
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Unlock All 12 Pro Ticket Designs for Just ₹99
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Get lifetime unlimited commercial usage for all VIP, Neon Concert, Hackathon Terminal, Luxury, and Expo badge templates. Instant activation with native UPI (GPay, PhonePe, Paytm).
          </p>
        </div>

        <div className="shrink-0 relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleOpenBundleCheckout}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
          >
            <span>Unlock All 12 for ₹99</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Toolbar: Search & Filter Controls ── */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tier Switcher (All / Free / Paid) */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setSelectedTier("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTier === "all"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All Designs ({STUDIO_TEMPLATES.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("free")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTier === "free"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Free (6)
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("paid")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTier === "paid"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Pro ₹49 (6)
            </button>
          </div>

          {/* Format Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-2xl w-fit flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedFormat("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedFormat === "all"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All Formats
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("digital")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedFormat === "digital"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Digital
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("badge")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedFormat === "badge"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Badge
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("printable")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedFormat === "printable"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              Printable
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-neutral-950 text-white font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── High-Fidelity Templates Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filteredTemplates.map((template) => {
          const isFree = template.tier !== "paid";
          const isUnlocked = isFree || isPro || isTemplateUnlocked(template.id, unlockedList);

          return (
            <div
              key={template.id}
              onClick={() => handleOpenShowcase(template)}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              {/* Card Top: Photorealistic Ticket Display */}
              <div className="w-full h-80 sm:h-84 bg-gradient-to-b from-neutral-950 to-neutral-900 p-4 sm:p-5 relative flex items-center justify-center select-none overflow-hidden">
                {/* Ambient glow matching template palette */}
                <div
                  className="absolute w-56 h-56 rounded-full blur-2xl opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"
                  style={{
                    backgroundColor:
                      template.thumbnailBg === "#FFFFFF" ? "#6366F1" : template.thumbnailBg,
                  }}
                />

                {/* Price / Status Badge Top Left */}
                <div className="absolute top-3.5 left-3.5 z-20">
                  {isFree ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      FREE
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-300" />
                      ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
                    </span>
                  )}
                </div>

                {/* Format Badge Top Right */}
                <div className="absolute top-3.5 right-3.5 z-20">
                  {getFormatBadge(template.format)}
                </div>

                {/* Realistic Ticket Visual Render */}
                <div className="relative z-10 w-full flex items-center justify-center transform group-hover:scale-[1.03] transition-transform duration-300">
                  <TicketVisualShowcase template={template} mode="card" />
                </div>

                {/* Hover Showcase Overlay Button */}
                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 backdrop-blur-[2px]">
                  <div className="px-4 py-2 rounded-2xl bg-white text-neutral-950 font-black text-xs flex items-center gap-2 shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to Showcase & Preview</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom: Metadata and Direct 1-Click CTAs */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-neutral-950 group-hover:text-violet-600 transition-colors">
                      {template.name}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA Row */}
                <div
                  className="pt-3 border-t border-neutral-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isUnlocked ? (
                    <div className="flex gap-2">
                      <Link
                        href={`/studio?template=${encodeURIComponent(template.id)}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <span>Customize in Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/create-event?template=${encodeURIComponent(template.id)}`}
                        className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs flex items-center justify-center transition-all"
                      >
                        Use in Event
                      </Link>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAuthenticated) {
                          setSelectedShowcaseTemplate(template);
                        } else {
                          handleOpenCheckout(template);
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>Unlock Template — ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Interactive Showcase Popup Modal ── */}
      <TemplateShowcaseModal
        isOpen={Boolean(selectedShowcaseTemplate)}
        onClose={() => setSelectedShowcaseTemplate(null)}
        template={selectedShowcaseTemplate}
        isUnlocked={
          Boolean(
            selectedShowcaseTemplate &&
              (selectedShowcaseTemplate.tier !== "paid" ||
                isPro ||
                isTemplateUnlocked(selectedShowcaseTemplate.id, unlockedList))
          )
        }
        isAuthenticated={isAuthenticated}
        userEmail={currentUserEmail}
        onUnlockClick={(tpl) => {
          setSelectedShowcaseTemplate(null);
          handleOpenCheckout(tpl);
        }}
        onUnlockBundleClick={() => {
          setSelectedShowcaseTemplate(null);
          handleOpenBundleCheckout();
        }}
      />

      {/* ── Razorpay Checkout Sheet Modal ── */}
      <TemplateCheckoutModal
        isOpen={activeCheckoutModal.isOpen}
        onClose={() => setActiveCheckoutModal((prev) => ({ ...prev, isOpen: false }))}
        templateId={activeCheckoutModal.templateId}
        templateName={activeCheckoutModal.templateName}
        priceINR={activeCheckoutModal.priceINR}
        format={activeCheckoutModal.format}
        thumbnailBg={activeCheckoutModal.thumbnailBg}
        isBundle={activeCheckoutModal.isBundle}
        onSuccessUnlock={handleSuccessUnlock}
      />
    </div>
  );
}
