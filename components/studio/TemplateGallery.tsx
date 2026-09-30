"use client";

import React, { useState, useEffect } from "react";
import {
  STUDIO_TEMPLATES,
  type StudioTemplateDefinition,
  SINGLE_TEMPLATE_PRICE_INR,
} from "@/lib/studio/templates";
import type { TicketFormat } from "@/lib/studio/types";
import { parseUnlockedCookie, isTemplateUnlocked } from "@/lib/studio/purchases";
import TemplateCheckoutModal from "@/components/templates/TemplateCheckoutModal";
import {
  Sparkles,
  Smartphone,
  Ticket,
  CreditCard,
  Check,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface Props {
  onSelectTemplate: (template: StudioTemplateDefinition) => void;
  activeTemplateId?: string;
  isPro?: boolean;
}

export default function TemplateGallery({
  onSelectTemplate,
  activeTemplateId,
  isPro = false,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<"all" | "free" | "paid">("all");
  const [unlockedList, setUnlockedList] = useState<string[]>([]);

  // Checkout Modal State
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    template: StudioTemplateDefinition | null;
  }>({
    isOpen: false,
    template: null,
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/urpass_unlocked_templates=([^;]+)/);
      if (match && match[1]) {
        setUnlockedList(parseUnlockedCookie(match[1]));
      }
    }
  }, []);

  const categories = [
    "All",
    "Minimal",
    "Corporate",
    "Conference",
    "College",
    "Concert",
    "Hackathon",
    "VIP",
    "Workshop",
    "Sports",
    "Exhibition",
    "Community",
    "Luxury",
  ];

  const filteredTemplates = STUDIO_TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === "All" || tpl.category === selectedCategory;
    const matchesFormat =
      selectedFormat === "all" || tpl.format === selectedFormat;
    const matchesTier =
      selectedTier === "all" ||
      (selectedTier === "free" && tpl.tier !== "paid") ||
      (selectedTier === "paid" && tpl.tier === "paid");
    return matchesCategory && matchesFormat && matchesTier;
  });

  function getFormatIcon(format: TicketFormat) {
    switch (format) {
      case "printable":
        return <Ticket className="w-3 h-3" />;
      case "badge":
        return <CreditCard className="w-3 h-3" />;
      case "digital":
      default:
        return <Smartphone className="w-3 h-3" />;
    }
  }

  function handleCardClick(template: StudioTemplateDefinition) {
    const isFree = template.tier !== "paid";
    const isUnlocked = isFree || isTemplateUnlocked(template.id, unlockedList, isPro);

    if (isUnlocked) {
      onSelectTemplate(template);
    } else {
      setCheckoutModal({
        isOpen: true,
        template,
      });
    }
  }

  function handleUnlockSuccess(unlockedId: string) {
    setUnlockedList((prev) => [...prev, unlockedId]);
    if (checkoutModal.template) {
      onSelectTemplate(checkoutModal.template);
    }
  }

  return (
    <div className="space-y-4">
      {/* Tier & Format Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* Tier Filter */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setSelectedTier("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              selectedTier === "all"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            All ({STUDIO_TEMPLATES.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTier("free")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              selectedTier === "free"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Free (6)
          </button>
          <button
            type="button"
            onClick={() => setSelectedTier("paid")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
              selectedTier === "paid"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            ₹49 (6)
          </button>
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setSelectedFormat("all")}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              selectedFormat === "all"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat("digital")}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              selectedFormat === "digital"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            Digital
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat("badge")}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              selectedFormat === "badge"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <CreditCard className="w-3 h-3" />
            Badge
          </button>
          <button
            type="button"
            onClick={() => setSelectedFormat("printable")}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
              selectedFormat === "printable"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Ticket className="w-3 h-3" />
            Stub
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? "bg-neutral-900 text-white font-semibold"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredTemplates.map((template) => {
          const isSelected = activeTemplateId === template.name || activeTemplateId === template.id;
          const isFree = template.tier !== "paid";
          const isUnlocked = isFree || isTemplateUnlocked(template.id, unlockedList, isPro);

          return (
            <div
              key={template.id}
              onClick={() => handleCardClick(template)}
              className={`group relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-violet-600 bg-violet-50/20 ring-2 ring-violet-500/20 shadow-sm"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Mini Visual Preview Mockup Box */}
              <div
                className="w-full h-36 rounded-xl overflow-hidden relative mb-3 border border-neutral-200/60 flex items-center justify-center p-3 select-none"
                style={{ backgroundColor: template.thumbnailBg }}
              >
                {/* Price / Unlocked Tag */}
                <div className="absolute top-2 left-2 z-10">
                  {isFree ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                      FREE
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 text-amber-300" />
                      ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
                    </span>
                  )}
                </div>

                <div
                  className="rounded-lg p-2.5 flex flex-col items-center justify-center text-center shadow-xs border border-white/20 w-full max-w-[200px]"
                  style={{
                    backgroundColor:
                      template.thumbnailBg === "#FFFFFF"
                        ? "#F8FAFC"
                        : "rgba(255, 255, 255, 0.08)",
                    color: template.thumbnailBg === "#FFFFFF" ? "#18181B" : "#FFFFFF",
                  }}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-75">
                    {template.category}
                  </span>
                  <p className="text-xs font-bold truncate max-w-[160px] my-1">
                    {template.name}
                  </p>
                  <div className="w-10 h-10 bg-white/90 rounded border border-neutral-200/40 my-1 flex items-center justify-center text-[7px] font-mono text-neutral-800">
                    [ QR ]
                  </div>
                  <span className="text-[8px] font-mono opacity-60">#URP-PREVIEW</span>
                </div>

                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-violet-600 transition-colors">
                    {template.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 shrink-0">
                    {getFormatIcon(template.format)}
                    {template.format}
                  </span>
                </div>

                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Tags & Action Row */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-1 flex-wrap">
                  {template.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {!isUnlocked && (
                  <span className="text-[10px] text-violet-600 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    Unlock ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Unlocking Paid Templates */}
      {checkoutModal.template && (
        <TemplateCheckoutModal
          isOpen={checkoutModal.isOpen}
          onClose={() => setCheckoutModal({ isOpen: false, template: null })}
          templateId={checkoutModal.template.id}
          templateName={checkoutModal.template.name}
          priceINR={checkoutModal.template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
          format={checkoutModal.template.format}
          thumbnailBg={checkoutModal.template.thumbnailBg}
          onSuccessUnlock={handleUnlockSuccess}
        />
      )}
    </div>
  );
}
