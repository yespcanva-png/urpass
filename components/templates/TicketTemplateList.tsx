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
  Search,
  X,
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

  function getFormatDisplay(format: string) {
    switch (format) {
      case "printable":
        return "Print";
      case "badge":
        return "Badge";
      case "digital":
      default:
        return "Mobile Pass";
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
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* ── 1. Page Title & Supporting Sentence (No Large Hero) ── */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-neutral-900 tracking-tight leading-tight">
          Templates
        </h1>
        <p className="text-sm sm:text-[15px] text-neutral-500 font-normal mt-2">
          Browse production-ready event passes, conference badges, and printable stubs.
        </p>
      </div>

      {/* ── 2. Compact Search & Filters Utility Row ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
        {/* Search Input (Takes Most of Width) */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates by name, category, or format..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-8 text-xs sm:text-sm bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls: Format, Pricing, Category */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {/* Format Select */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-hidden focus:border-neutral-900 transition-colors cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="digital">Mobile Passes</option>
            <option value="badge">Lanyard Badges</option>
            <option value="printable">Printable Stubs</option>
          </select>

          {/* Pricing Select */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as "all" | "free" | "paid")}
            className="h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-hidden focus:border-neutral-900 transition-colors cursor-pointer"
          >
            <option value="all">All Pricing</option>
            <option value="free">Free Forever</option>
            <option value="paid">₹49 Pro</option>
          </select>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-700 focus:outline-hidden focus:border-neutral-900 transition-colors cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 3. Template Grid (Desktop: 4 columns, Tablet: 2-3, Mobile: 1) ── */}
      {filteredTemplates.length === 0 ? (
        <div className="py-16 text-center rounded-xl border border-neutral-200 bg-white p-8">
          <p className="text-sm font-semibold text-neutral-900">No templates found</p>
          <p className="text-xs text-neutral-500 mt-1">
            Try adjusting your search query or switching filters to see all available templates.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFormat("all");
              setSelectedTier("all");
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 pt-2">
          {filteredTemplates.map((template) => {
            const isFree = template.tier !== "paid";
            const isUnlocked = isFree || isPro || isTemplateUnlocked(template.id, unlockedList);
            const formatDisplay = getFormatDisplay(template.format);
            const price = template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR;

            return (
              <div
                key={template.id}
                className="bg-white border border-neutral-200 rounded-[16px] p-4 flex flex-col justify-between hover:border-neutral-300 hover:shadow-xs transition-all duration-150 group"
              >
                {/* Large Template Preview Area (65–70% of attention, neutral canvas) */}
                <div
                  onClick={() => handleOpenShowcase(template)}
                  className="w-full h-[230px] bg-[#F6F7F8] rounded-xl relative flex items-center justify-center cursor-pointer select-none overflow-hidden border border-neutral-100/80"
                >
                  {/* Scaled Ticket Visual Showcase - Centered, original aspect ratio */}
                  <div className="relative z-10 w-full flex items-center justify-center transform scale-[0.80] sm:scale-[0.82] origin-center drop-shadow-xs">
                    <TicketVisualShowcase template={template} mode="card" />
                  </div>
                </div>

                {/* Below Preview */}
                <div className="pt-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Template Name */}
                    <h3
                      onClick={() => handleOpenShowcase(template)}
                      className="text-[15px] font-semibold text-neutral-900 line-clamp-1 cursor-pointer hover:text-neutral-700 transition-colors"
                    >
                      {template.name}
                    </h3>

                    {/* Small Compact Metadata Row */}
                    <p className="text-xs text-neutral-500 font-normal mt-1">
                      {formatDisplay} • {isFree ? "Free" : isUnlocked ? "Unlocked" : `₹${price}`}
                    </p>
                  </div>

                  {/* Actions: One Primary Action + Optional Secondary Text Action */}
                  <div className="pt-3 mt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                    {isUnlocked ? (
                      <Link
                        href={`/studio?template=${encodeURIComponent(template.id)}`}
                        className="flex-1 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs flex items-center justify-center transition-colors"
                      >
                        Use Template
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
                        className="flex-1 h-9 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
                      >
                        Unlock Template
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenShowcase(template)}
                      className="px-2 py-1 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer shrink-0"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. Small Restrained Bundle Strip (After the Grid) ── */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">
            All templates. One bundle.
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">
            Unlock the complete 12-template collection for ₹99 lifetime access across all your events.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenBundleCheckout}
          className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
        >
          View Bundle
        </button>
      </div>

      {/* Showcase Modal */}
      <TemplateShowcaseModal
        isOpen={Boolean(selectedShowcaseTemplate)}
        onClose={() => setSelectedShowcaseTemplate(null)}
        template={selectedShowcaseTemplate}
        isUnlocked={
          Boolean(selectedShowcaseTemplate) &&
          (selectedShowcaseTemplate?.tier !== "paid" ||
            isPro ||
            isTemplateUnlocked(selectedShowcaseTemplate!.id, unlockedList))
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

      {/* Razorpay Checkout Modal */}
      <TemplateCheckoutModal
        isOpen={activeCheckoutModal.isOpen}
        onClose={() =>
          setActiveCheckoutModal((prev) => ({ ...prev, isOpen: false }))
        }
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
