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
  X,
  Palette,
  ShieldCheck,
  Download,
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 text-neutral-800 text-[10px] font-bold border border-neutral-200/90 shadow-2xs backdrop-blur-md">
            <Ticket className="w-3 h-3 text-amber-500" />
            Printable Stub
          </span>
        );
      case "badge":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 text-neutral-800 text-[10px] font-bold border border-neutral-200/90 shadow-2xs backdrop-blur-md">
            <CreditCard className="w-3 h-3 text-sky-500" />
            Lanyard Badge
          </span>
        );
      case "digital":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 text-neutral-800 text-[10px] font-bold border border-neutral-200/90 shadow-2xs backdrop-blur-md">
            <Smartphone className="w-3 h-3 text-emerald-600" />
            Mobile Wallet
          </span>
        );
    }
  }

  function getTemplateColorSwatches(id: string): string[] {
    switch (id) {
      case "minimal-monochrome":
        return ["#000000", "#71717A", "#FFFFFF"];
      case "concert-music-fest":
        return ["#0D0B18", "#F43F5E", "#8B5CF6"];
      case "corporate-summit-gala":
        return ["#0A0F1D", "#38BDF8", "#FFFFFF"];
      case "college-fest-badge":
        return ["#3730A3", "#FACC15", "#FFFFFF"];
      case "tech-conf-badge":
        return ["#0F172A", "#10B981", "#64748B"];
      case "hackathon-terminal":
        return ["#050505", "#22C55E", "#14532D"];
      case "vip-all-access":
        return ["#18181B", "#F59E0B", "#FDE047"];
      case "workshop-masterclass":
        return ["#0F766E", "#2DD4BF", "#FFFFFF"];
      case "sports-arena-ticket":
        return ["#1E1B4B", "#FB923C", "#FFFFFF"];
      case "exhibition-trade-expo":
        return ["#1E293B", "#3B82F6", "#FFFFFF"];
      case "community-meetup":
        return ["#4C1D95", "#A855F7", "#F3E8FF"];
      case "dark-obsidian-luxury":
      default:
        return ["#000000", "#D97706", "#FDE68A"];
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── All-Access Master Pack Floating Offer Banner ── */}
      <div className="rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-indigo-950 p-6 sm:p-8 text-white border border-neutral-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>LIMITED ALL-ACCESS MASTER BUNDLE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Unlock All 12 Pro Pass &amp; Ticket Designs for ₹99
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
            Get permanent lifetime access to our entire library of digital passes, lanyard badges, and printable stubs. Instant UPI activation on your URPASS organizer account.
          </p>
        </div>

        <div className="relative z-10 shrink-0 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleOpenBundleCheckout}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform group-hover:scale-[1.02]"
          >
            <Zap className="w-4 h-4 text-neutral-950 fill-neutral-950" />
            <span>Claim Master Pack for ₹99</span>
          </button>
        </div>
      </div>

      {/* ── Studio Search & Filters Control Bar ── */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-600" />
              <span>Browse Template Gallery</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                {filteredTemplates.length} Available
              </span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Production-ready passes with atomic anti-duplicate locks and sub-0.3s camera QR validation.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by event, category or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-neutral-200/90 rounded-xl focus:outline-hidden focus:border-neutral-900 shadow-2xs transition-all"
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
        </div>

        {/* Filter Segments: Format & Pricing Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Format Tabs */}
          <div className="inline-flex items-center p-1 bg-neutral-100/90 rounded-2xl border border-neutral-200/80 w-fit flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setSelectedFormat("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === "all"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              All Formats ({STUDIO_TEMPLATES.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("digital")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === "digital"
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Digital Passes ({STUDIO_TEMPLATES.filter((t) => t.format === "digital").length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("badge")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === "badge"
                  ? "bg-white text-sky-800 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Lanyard Badges ({STUDIO_TEMPLATES.filter((t) => t.format === "badge").length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("printable")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFormat === "printable"
                  ? "bg-white text-amber-800 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              Printable Stubs ({STUDIO_TEMPLATES.filter((t) => t.format === "printable").length})
            </button>
          </div>

          {/* Pricing Tier Tabs */}
          <div className="inline-flex items-center p-1 bg-neutral-100/90 rounded-2xl border border-neutral-200/80 w-fit gap-1">
            <button
              type="button"
              onClick={() => setSelectedTier("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTier === "all"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              All Pricing
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("free")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTier === "free"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Free Forever ({STUDIO_TEMPLATES.filter((t) => t.tier !== "paid").length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTier("paid")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTier === "paid"
                  ? "bg-white text-amber-700 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              Pro ₹49 ({STUDIO_TEMPLATES.filter((t) => t.tier === "paid").length})
            </button>
          </div>
        </div>

        {/* Category Filter Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4-Column High-End Gallery Grid ── */}
      {filteredTemplates.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-neutral-300 bg-white p-8">
          <Palette className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-neutral-900">No templates found</h4>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or switching filters to see all available pass formats.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFormat("all");
              setSelectedTier("all");
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => {
            const isFree = template.tier !== "paid";
            const isUnlocked = isFree || isPro || isTemplateUnlocked(template.id, unlockedList);
            const swatches = getTemplateColorSwatches(template.id);

            return (
              <div
                key={template.id}
                onClick={() => handleOpenShowcase(template)}
                className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-2xl hover:border-neutral-400/80 transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
              >
                {/* Canvas Showcase Container */}
                <div className="w-full h-[300px] bg-[#F7F8FA] group-hover:bg-[#F0F2F5] p-4 relative flex items-center justify-center select-none overflow-hidden border-b border-neutral-100 transition-colors">
                  {/* Floating Format Badge Top-Left */}
                  <div className="absolute top-3 left-3 z-10">
                    {getFormatBadge(template.format)}
                  </div>

                  {/* Floating Price/Tier Badge Top-Right */}
                  <div className="absolute top-3 right-3 z-10">
                    {isFree ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
                        FREE
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-neutral-950 text-white text-[10px] font-black tracking-wider uppercase shadow-xs flex items-center gap-1 border border-neutral-800">
                        <Zap className="w-3 h-3 text-amber-400" />
                        ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}
                      </span>
                    )}
                  </div>

                  {/* Scaled Ticket Visual Showcase */}
                  <div className="relative z-10 w-full flex items-center justify-center transform group-hover:scale-[1.03] transition-transform duration-300 drop-shadow-md group-hover:drop-shadow-2xl">
                    <TicketVisualShowcase template={template} mode="card" />
                  </div>

                  {/* Hover Floating Action Backdrop */}
                  <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-200 flex flex-col items-center justify-center gap-2.5 p-4 z-20">
                    <div className="px-4 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-2xl transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Quick Preview &amp; Test</span>
                    </div>

                    <span className="text-[10px] text-white/90 font-medium bg-black/50 px-2.5 py-1 rounded-lg">
                      Click anywhere to enlarge
                    </span>
                  </div>
                </div>

                {/* Card Meta & 1-Click Action */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-extrabold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {template.name}
                      </h4>
                      {/* Color Palette Swatches */}
                      <div className="flex items-center -space-x-1 shrink-0 ml-2" title="Theme Palette">
                        {swatches.map((color, idx) => (
                          <span
                            key={idx}
                            className="w-3 h-3 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {template.description}
                    </p>
                  </div>

                  {/* Action Button Row */}
                  <div
                    className="pt-2 border-t border-neutral-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isUnlocked ? (
                      <Link
                        href={`/studio?template=${encodeURIComponent(template.id)}`}
                        className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <span>Open in Studio</span>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
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
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-neutral-950" />
                        <span>Unlock Design — ₹{template.priceINR ?? SINGLE_TEMPLATE_PRICE_INR}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
