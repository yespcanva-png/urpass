"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  STUDIO_TEMPLATES,
  type StudioTemplateDefinition,
  SINGLE_TEMPLATE_PRICE_INR,
  ALL_ACCESS_BUNDLE_PRICE_INR,
} from "@/lib/studio/templates";
import { parseUnlockedCookie, isTemplateUnlocked } from "@/lib/studio/purchases";
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
  Tag,
} from "lucide-react";

export default function TicketTemplateList() {
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [selectedTier, setSelectedTier] = useState<"all" | "free" | "paid">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [unlockedList, setUnlockedList] = useState<string[]>([]);

  // Checkout Modal State
  const [activeModal, setActiveModal] = useState<{
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

  // Load unlocked templates from document cookie on mount
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
            <Ticket className="w-3 h-3" />
            Printable Stub
          </span>
        );
      case "badge":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider border border-sky-200">
            <CreditCard className="w-3 h-3" />
            Conference Badge
          </span>
        );
      case "digital":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wider border border-violet-200">
            <Smartphone className="w-3 h-3" />
            Digital Pass
          </span>
        );
    }
  }

  function handleUnlock(tpl: StudioTemplateDefinition) {
    setActiveModal({
      isOpen: true,
      templateId: tpl.id,
      templateName: tpl.name,
      priceINR: tpl.priceINR ?? SINGLE_TEMPLATE_PRICE_INR,
      format: tpl.format,
      thumbnailBg: tpl.thumbnailBg,
      isBundle: false,
    });
  }

  function handleUnlockBundle() {
    setActiveModal({
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* ── All-Access Master Pack Banner ── */}
      <div className="bg-gradient-to-r from-neutral-950 via-violet-950 to-neutral-900 border border-violet-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/30 text-violet-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            LIMITED LIFETIME BUNDLE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Unlock All 12 Pro Templates for Just ₹99
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Get lifetime unlimited commercial usage for all VIP, Neon Concert, Hackathon Terminal, Luxury, and Expo badge templates. Instant activation with native UPI (GPay, PhonePe, Paytm).
          </p>
        </div>

        <div className="shrink-0 relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleUnlockBundle}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
          >
            <span>Unlock All 12 for ₹99</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Filter Controls Toolbar ── */}
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
              All Templates ({STUDIO_TEMPLATES.length})
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
              Premium ₹49 (6)
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

      {/* ── Templates Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isFree = template.tier !== "paid";
          const isUnlocked = isFree || isTemplateUnlocked(template.id, unlockedList);

          return (
            <div
              key={template.id}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              {/* Card Top: Mockup Preview Box */}
              <div
                className="w-full h-52 p-5 relative flex items-center justify-center select-none overflow-hidden"
                style={{ backgroundColor: template.thumbnailBg }}
              >
                {/* Price Pill Top Left */}
                <div className="absolute top-3.5 left-3.5 z-10">
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
                <div className="absolute top-3.5 right-3.5 z-10">
                  {getFormatBadge(template.format)}
                </div>

                {/* Mini Realistic Pass Silhouette */}
                <div
                  className="rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg border border-white/20 w-full max-w-[240px] transform group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundColor:
                      template.thumbnailBg === "#FFFFFF"
                        ? "#F8FAFC"
                        : "rgba(255, 255, 255, 0.12)",
                    color: template.thumbnailBg === "#FFFFFF" ? "#18181B" : "#FFFFFF",
                  }}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                    {template.category}
                  </span>
                  <div className="text-sm font-black truncate max-w-[200px] mb-2">
                    {template.name}
                  </div>
                  <div className="w-12 h-12 bg-white/95 rounded-xl border border-neutral-200/50 flex items-center justify-center text-[7px] font-mono font-bold text-neutral-900 shadow-xs mb-1">
                    [ QR PASS ]
                  </div>
                  <span className="text-[8px] font-mono opacity-70">Sub-0.3s Camera Scan</span>
                </div>
              </div>

              {/* Card Bottom: Metadata and Action Button */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
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

                {/* Action CTA */}
                <div className="pt-3 border-t border-neutral-100">
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
                      onClick={() => handleUnlock(template)}
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

      {/* Checkout Modal */}
      <TemplateCheckoutModal
        isOpen={activeModal.isOpen}
        onClose={() => setActiveModal((prev) => ({ ...prev, isOpen: false }))}
        templateId={activeModal.templateId}
        templateName={activeModal.templateName}
        priceINR={activeModal.priceINR}
        format={activeModal.format}
        thumbnailBg={activeModal.thumbnailBg}
        isBundle={activeModal.isBundle}
        onSuccessUnlock={handleSuccessUnlock}
      />
    </div>
  );
}
