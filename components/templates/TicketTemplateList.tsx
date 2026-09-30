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
  Search,
  Eye,
  SlidersHorizontal,
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
      if (typeof document !== "undefined") {
        const match = document.cookie.match(/urpass_unlocked_templates=([^;]+)/);
        if (match && match[1]) {
          const fromCookie = parseUnlockedCookie(match[1]);
          setUnlockedList((prev) => Array.from(new Set([...prev, ...fromCookie])));
        }
      }

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
    const matchesSearch =
      !searchQuery.trim() ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFormat && matchesTier && matchesCategory && matchesSearch;
  });

  function getFormatBadge(format: string) {
    switch (format) {
      case "printable":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-neutral-700 text-[10px] font-semibold border border-neutral-200/90 shadow-2xs backdrop-blur-xs">
            <Ticket className="w-2.5 h-2.5 text-amber-500" />
            Stub Ticket
          </span>
        );
      case "badge":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-neutral-700 text-[10px] font-semibold border border-neutral-200/90 shadow-2xs backdrop-blur-xs">
            <CreditCard className="w-2.5 h-2.5 text-sky-500" />
            Lanyard Badge
          </span>
        );
      case "digital":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-neutral-700 text-[10px] font-semibold border border-neutral-200/90 shadow-2xs backdrop-blur-xs">
            <Smartphone className="w-2.5 h-2.5 text-violet-500" />
            Mobile Wallet
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* ── Canva-Style Header & Filter Controls ── */}
      <div className="space-y-4">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Event Pass & Ticket Templates
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Choose from {STUDIO_TEMPLATES.length} professionally designed passes. Customize colors, logos, and fields in minutes.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900 shadow-2xs"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenBundleCheckout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>All 12 for ₹99</span>
            </button>
          </div>
        </div>

        {/* Filter Segment Bars (Format & Tier) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Format Tabs */}
          <div className="inline-flex items-center p-1 bg-neutral-100 rounded-xl w-fit flex-wrap gap-0.5">
            <button
              type="button"
              onClick={() => setSelectedFormat("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFormat === "all"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All Formats
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("digital")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFormat === "digital"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
              Digital Passes
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("badge")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFormat === "badge"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
              Lanyard Badges
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("printable")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFormat === "printable"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-neutral-500" />
              Printable Stubs
            </button>
          </div>

          {/* Tier Switcher (All / Free / Pro) */}
          <div className="inline-flex items-center p-1 bg-neutral-100 rounded-xl w-fit gap-0.5">
            <button
              type="button"
              onClick={() => setSelectedTier("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTier === "all"
                  ? "bg-white text-neutral-900 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All Pricing
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("free")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTier === "free"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Free ({STUDIO_TEMPLATES.filter((t) => t.tier !== "paid").length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("paid")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTier === "paid"
                  ? "bg-white text-violet-700 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              Pro ₹49 ({STUDIO_TEMPLATES.filter((t) => t.tier === "paid").length})
            </button>
          </div>
        </div>

        {/* Category Pills (Canva-style clean horizontal scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-neutral-900 text-white font-semibold shadow-2xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Canva-Style Proper Grid: 4 Columns on XL, 3 on LG, 2 on SM ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
        {filteredTemplates.map((template) => {
          const isFree = template.tier !== "paid";
          const isUnlocked = isFree || isPro || isTemplateUnlocked(template.id, unlockedList);

          return (
            <div
              key={template.id}
              onClick={() => handleOpenShowcase(template)}
              className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              {/* Card Top: Canva-Style Design Canvas Preview */}
              <div className="w-full h-[280px] bg-[#F4F5F7] group-hover:bg-[#ECEEF1] p-4 relative flex items-center justify-center select-none overflow-hidden border-b border-neutral-100 transition-colors">
                {/* Format Badge Top Left */}
                <div className="absolute top-3 left-3 z-10">
                  {getFormatBadge(template.format)}
                </div>

                {/* Price / Status Badge Top Right */}
                <div className="absolute top-3 right-3 z-10">
                  {isFree ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black tracking-wider uppercase shadow-2xs">
                      FREE
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-2xs flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-white text-[10px] font-bold tracking-wider uppercase shadow-2xs flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-amber-300" />
                      ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
                    </span>
                  )}
                </div>

                {/* The Ticket Pass Graphic (Floats with realistic depth) */}
                <div className="relative z-10 w-full flex items-center justify-center drop-shadow-sm group-hover:drop-shadow-xl group-hover:scale-[1.03] transition-all duration-300">
                  <TicketVisualShowcase
                    template={template}
                    mode="card"
                  />
                </div>

                {/* Canva-Style Hover Action Overlay */}
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4 z-20">
                  <div className="px-4 py-2 rounded-xl bg-white text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-xl transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    <span>{isUnlocked ? "Customize template" : `Unlock template — ₹${template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}`}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-700" />
                  </div>

                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    <Eye className="w-3 h-3" />
                    <span>Quick Preview</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom: Metadata and 1-Click Action */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-neutral-500 capitalize">
                    {template.format === "digital" ? "Mobile Pass" : template.format === "badge" ? "Conference Badge" : "Printable Stub"} · {template.category}
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

      {/* ── Interactive Preview Modal ── */}
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
