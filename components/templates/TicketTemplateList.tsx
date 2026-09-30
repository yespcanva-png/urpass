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
  Smartphone,
  Ticket,
  CreditCard,
  Check,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
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
    "Minimal",
    "Concert",
    "Corporate",
    "College",
    "Conference",
    "Hackathon",
    "VIP",
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

    return matchesFormat && matchesTier && matchesCategory;
  });

  function getFormatBadge(format: string) {
    switch (format) {
      case "printable":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-900/80 text-neutral-300 text-[10px] font-medium border border-neutral-700/60 backdrop-blur-sm">
            <Ticket className="w-2.5 h-2.5 text-amber-400" />
            Stub
          </span>
        );
      case "badge":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-900/80 text-neutral-300 text-[10px] font-medium border border-neutral-700/60 backdrop-blur-sm">
            <CreditCard className="w-2.5 h-2.5 text-sky-400" />
            Badge
          </span>
        );
      case "digital":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-900/80 text-neutral-300 text-[10px] font-medium border border-neutral-700/60 backdrop-blur-sm">
            <Smartphone className="w-2.5 h-2.5 text-violet-400" />
            Wallet
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ── Minimal Header & Master Pack Action ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Pass & Ticket Templates
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Click any pass to preview or customize directly in Ticket Studio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenBundleCheckout}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer w-fit"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>All-Access Pack: 12 passes for ₹99</span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      </div>

      {/* ── Minimal Segmented Controls: Tier & Format ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tier switcher */}
        <div className="inline-flex items-center p-0.5 bg-neutral-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setSelectedTier("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedTier === "all"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            All ({STUDIO_TEMPLATES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTier("free")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedTier === "free"
                ? "bg-white text-emerald-700 shadow-2xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Free (6)
          </button>
          <button
            type="button"
            onClick={() => setSelectedTier("paid")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedTier === "paid"
                ? "bg-white text-violet-700 shadow-2xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Pro ₹49 (6)
          </button>
        </div>

        {/* Format tabs */}
        <div className="inline-flex items-center p-0.5 bg-neutral-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setSelectedFormat("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFormat === "all"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            All Formats
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat("digital")}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFormat === "digital"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Smartphone className="w-3 h-3 text-neutral-500" />
            Wallet
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat("badge")}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFormat === "badge"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <CreditCard className="w-3 h-3 text-neutral-500" />
            Badge
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat("printable")}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedFormat === "printable"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Ticket className="w-3 h-3 text-neutral-500" />
            Stub
          </button>
        </div>
      </div>

      {/* ── Category Pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-neutral-900 text-white font-medium"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Clean & Aesthetic Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {filteredTemplates.map((template) => {
          const isFree = template.tier !== "paid";
          const isUnlocked = isFree || isPro || isTemplateUnlocked(template.id, unlockedList);

          return (
            <div
              key={template.id}
              onClick={() => handleOpenShowcase(template)}
              className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              {/* Card Top: Sleek Ticket Preview Canvas */}
              <div className="w-full h-76 bg-neutral-950 p-4 relative flex items-center justify-center select-none overflow-hidden">
                {/* Subtle Ambient Glow */}
                <div
                  className="absolute w-44 h-44 rounded-full blur-2xl opacity-15 pointer-events-none group-hover:opacity-30 transition-opacity"
                  style={{
                    backgroundColor:
                      template.thumbnailBg === "#FFFFFF" ? "#6366F1" : template.thumbnailBg,
                  }}
                />

                {/* Price / Status Badge Top Left */}
                <div className="absolute top-3 left-3 z-10">
                  {isFree ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1 backdrop-blur-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      FREE
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30 flex items-center gap-1 backdrop-blur-sm">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold tracking-wider uppercase border border-violet-500/30 flex items-center gap-1 backdrop-blur-sm">
                      <Zap className="w-2.5 h-2.5 text-amber-300" />
                      ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
                    </span>
                  )}
                </div>

                {/* Format Badge Top Right */}
                <div className="absolute top-3 right-3 z-10">
                  {getFormatBadge(template.format)}
                </div>

                {/* Realistic Pass Graphic */}
                <div className="relative z-10 w-full flex items-center justify-center transform group-hover:scale-[1.02] transition-transform duration-200">
                  <TicketVisualShowcase
                    template={template}
                    mode="card"
                  />
                </div>
              </div>

              {/* Card Bottom: Metadata and 1-Click Action */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-violet-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {template.description}
                  </p>
                </div>

                {/* 1-Click Action */}
                <div
                  className="pt-2 border-t border-neutral-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isUnlocked ? (
                    <Link
                      href={`/studio?template=${encodeURIComponent(template.id)}`}
                      className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>Customize in Studio</span>
                      <ArrowRight className="w-3 h-3 text-neutral-400" />
                    </Link>
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
                      className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>Unlock — ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Interactive Sleek Preview Modal ── */}
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
