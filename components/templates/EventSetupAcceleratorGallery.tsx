"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EVENT_SETUP_TEMPLATES,
  ORGANIZATION_TEMPLATES,
  type EventSetupTemplate,
  type EventTemplateCategory,
  type TemplateComplexity,
} from "@/lib/templates/event-setups";
import EventSetupModal from "./EventSetupModal";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Building2,
  GraduationCap,
  Layers,
  DoorOpen,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  Bookmark,
  ChevronDown,
} from "lucide-react";

export default function EventSetupAcceleratorGallery() {
  const router = useRouter();

  // Filter States
  const [activeTab, setActiveTab] = useState<"system" | "organization" | "recent">("system");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [activeModalTemplate, setActiveModalTemplate] = useState<EventSetupTemplate | null>(null);

  const CATEGORIES: EventTemplateCategory[] = [
    "All",
    "Corporate",
    "Conference",
    "Campus",
    "Workshop",
    "Exhibition",
    "Networking",
    "Product Launch",
    "Hackathon",
    "Sports",
    "RSVP",
    "Private / VIP",
    "Paid Event",
    "Internal Employee Event",
    "Multi-Gate Event",
    "High-Volume Event",
  ];

  // Base list depending on active tab
  const baseTemplates =
    activeTab === "organization"
      ? ORGANIZATION_TEMPLATES
      : activeTab === "recent"
      ? EVENT_SETUP_TEMPLATES.slice(0, 3)
      : EVENT_SETUP_TEMPLATES;

  // Filter logic
  const filteredTemplates = baseTemplates.filter((t) => {
    const matchesCategory =
      selectedCategory === "All" ||
      t.category === selectedCategory ||
      t.secondaryCategory === selectedCategory;

    const matchesEventType =
      selectedEventType === "all" ||
      t.config.eventDefaults.eventType === selectedEventType;

    const matchesPricing =
      selectedPricing === "all" ||
      (selectedPricing === "free" && !t.config.paymentConfig.isPaid) ||
      (selectedPricing === "paid" && t.config.paymentConfig.isPaid);

    const matchesComplexity =
      selectedComplexity === "all" || t.complexity === selectedComplexity;

    const matchesSearch =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.chips.some((chip) => chip.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      matchesCategory &&
      matchesEventType &&
      matchesPricing &&
      matchesComplexity &&
      matchesSearch
    );
  });

  const featuredTemplates = EVENT_SETUP_TEMPLATES.filter((t) => t.featured);
  const isDefaultView =
    activeTab === "system" &&
    selectedCategory === "All" &&
    selectedEventType === "all" &&
    selectedPricing === "all" &&
    selectedComplexity === "all" &&
    !searchQuery.trim();

  const standardTemplates = isDefaultView
    ? filteredTemplates.filter((t) => !t.featured)
    : filteredTemplates;

  function handleOpenModal(template: EventSetupTemplate) {
    setActiveModalTemplate(template);
  }

  function handleClearFilters() {
    setSelectedCategory("All");
    setSelectedEventType("all");
    setSelectedPricing("all");
    setSelectedComplexity("all");
    setSearchQuery("");
  }

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 space-y-10">
      {/* ── 1. COMPACT PAGE HEADER (Enterprise B2B SaaS) ── */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-neutral-900 tracking-tight leading-tight">
          Event Templates
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 font-normal">
          Start with a proven event setup and customize it for your organization.
        </p>
        <p className="text-xs sm:text-[13px] text-neutral-400">
          Templates can configure registration, passes, access, notifications and more.
        </p>
      </div>

      {/* ── 2. SECTION TABS: URPASS Templates | Organization Templates | Recently Used ── */}
      <div className="flex items-center justify-between border-b border-neutral-200 gap-4 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("system");
              handleClearFilters();
            }}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer px-2 ${
              activeTab === "system"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <span>URPASS Templates</span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-mono bg-neutral-100 text-neutral-600">
              20
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("organization");
              handleClearFilters();
            }}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer px-2 ${
              activeTab === "organization"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <span>Organization Templates</span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-mono bg-neutral-100 text-neutral-600">
              2
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("recent");
              handleClearFilters();
            }}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer px-2 ${
              activeTab === "recent"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <span>Recently Used</span>
          </button>
        </div>

        {/* Studio Pass Designer Link */}
        <Link
          href="/ticket-templates"
          className="pb-3 text-xs font-medium text-neutral-500 hover:text-neutral-900 whitespace-nowrap transition-colors"
        >
          Browse Ticket Pass Designs →
        </Link>
      </div>

      {/* ── 3. SEARCH & FILTERS UTILITY ROW ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search event templates (e.g. Conference, Fest, Multi-Gate, AGM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-9 text-xs sm:text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900 shadow-2xs transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 pl-3 pr-8 text-xs font-medium bg-white border border-neutral-200 rounded-lg appearance-none cursor-pointer focus:outline-hidden focus:border-neutral-900 shadow-2xs text-neutral-700"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Event Type Dropdown */}
          <div className="relative">
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="h-11 pl-3 pr-8 text-xs font-medium bg-white border border-neutral-200 rounded-lg appearance-none cursor-pointer focus:outline-hidden focus:border-neutral-900 shadow-2xs text-neutral-700"
            >
              <option value="all">All Types</option>
              <option value="conference">Conference</option>
              <option value="fest">Fest / Campus</option>
              <option value="workshop">Workshop</option>
              <option value="exhibition">Exhibition</option>
              <option value="sports">Sports</option>
              <option value="corporate">Corporate</option>
              <option value="vip">VIP / Private</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Free / Paid Dropdown */}
          <div className="relative">
            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              className="h-11 pl-3 pr-8 text-xs font-medium bg-white border border-neutral-200 rounded-lg appearance-none cursor-pointer focus:outline-hidden focus:border-neutral-900 shadow-2xs text-neutral-700"
            >
              <option value="all">Free & Paid</option>
              <option value="free">Free Forever</option>
              <option value="paid">Paid Ticketing</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Complexity Dropdown */}
          <div className="relative">
            <select
              value={selectedComplexity}
              onChange={(e) => setSelectedComplexity(e.target.value)}
              className="h-11 pl-3 pr-8 text-xs font-medium bg-white border border-neutral-200 rounded-lg appearance-none cursor-pointer focus:outline-hidden focus:border-neutral-900 shadow-2xs text-neutral-700"
            >
              <option value="all">All Complexity</option>
              <option value="Simple">Simple</option>
              <option value="Standard">Standard</option>
              <option value="Advanced">Advanced</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== "All" ||
            selectedEventType !== "all" ||
            selectedPricing !== "all" ||
            selectedComplexity !== "all" ||
            searchQuery) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="h-11 px-3 text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── 4. FEATURED EVENT TEMPLATES ROW (Top 3 setups) ── */}
      {isDefaultView && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Featured Operational Setups
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              Ready-to-launch blueprints
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredTemplates.map((template) => (
              <EventTemplateCard
                key={template.id}
                template={template}
                isFeatured
                onPreview={() => handleOpenModal(template)}
                onUse={() => handleOpenModal(template)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── 5. MAIN EVENT TEMPLATE GRID (3 Columns Desktop) ── */}
      <div className="space-y-4">
        {isDefaultView && (
          <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
            <h2 className="text-base font-semibold text-neutral-900">
              All Event Blueprints
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              {standardTemplates.length} setups available
            </span>
          </div>
        )}

        {standardTemplates.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
            <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="text-sm font-semibold text-neutral-800">
              No templates match your filters
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try adjusting your category, event type, or complexity filters.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-2 px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {standardTemplates.map((template) => (
              <EventTemplateCard
                key={template.id}
                template={template}
                onPreview={() => handleOpenModal(template)}
                onUse={() => handleOpenModal(template)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── 6. ENTERPRISE ORGANIZATION TEMPLATES BANNER ── */}
      <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-neutral-700" />
            <h3 className="text-sm font-bold text-neutral-900">
              Custom Organization Templates
            </h3>
          </div>
          <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
            Enterprise teams and university departments can save standardized registration workflows, turnstile gates, and accredited pass designs as reusable organization blueprints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setActiveTab("organization");
          }}
          className="px-4 py-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-900 font-semibold text-xs whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
        >
          View Org Blueprints →
        </button>
      </div>

      {/* ── 7. PREVIEW MODAL ── */}
      <EventSetupModal
        isOpen={Boolean(activeModalTemplate)}
        onClose={() => setActiveModalTemplate(null)}
        template={activeModalTemplate}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// EVENT TEMPLATE CARD COMPONENT
// ────────────────────────────────────────────────────────────────────────────
interface EventTemplateCardProps {
  template: EventSetupTemplate;
  isFeatured?: boolean;
  onPreview: () => void;
  onUse: () => void;
}

function EventTemplateCard({
  template,
  isFeatured = false,
  onPreview,
  onUse,
}: EventTemplateCardProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all duration-150 flex flex-col justify-between group">
      <div className="space-y-3.5">
        {/* Visual Composition Preview Canvas */}
        <div
          onClick={onPreview}
          className="w-full h-44 bg-[#F5F6F7] rounded-xl border border-neutral-200/80 p-3 relative overflow-hidden flex flex-col justify-between cursor-pointer select-none"
        >
          {/* Background Layer: Miniature Event Landing & Form Header */}
          <div className="w-full bg-white rounded-lg border border-neutral-200 p-2.5 shadow-2xs space-y-1.5 opacity-90">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                {template.category}
              </span>
              <span className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-semibold">
                {template.complexity}
              </span>
            </div>
            <h5 className="text-[10px] font-bold text-neutral-900 truncate">
              {template.eventPage.heroTitle}
            </h5>
            {/* Input slots */}
            <div className="space-y-1 pt-0.5">
              <div className="w-3/4 h-2 rounded bg-neutral-100 border border-neutral-200" />
              <div className="w-1/2 h-2 rounded bg-neutral-100 border border-neutral-200" />
            </div>
          </div>

          {/* Overlaid Floating Miniature QR Pass Badge in Bottom-Right */}
          <div className="absolute right-3 bottom-8 w-24 bg-white border border-neutral-300 rounded-lg p-1.5 shadow-md transform rotate-2 group-hover:rotate-0 transition-transform duration-150 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-neutral-900 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
              QR
            </div>
            <div className="min-w-0">
              <span className="text-[7px] font-bold text-neutral-800 block truncate">
                {template.qrPass.attendeeName}
              </span>
              <span className="text-[6px] font-mono text-neutral-400 block truncate">
                {template.qrPass.tier}
              </span>
            </div>
          </div>

          {/* Bottom Strip: Gate & Check-in Indicator */}
          <div className="w-full pt-1.5 border-t border-neutral-200/70 flex items-center justify-between text-[8px] font-mono text-neutral-600">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{template.gateConfig}</span>
            </span>
            <span className="text-neutral-400">{template.version}</span>
          </div>
        </div>

        {/* Template Information */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-neutral-900 tracking-tight leading-snug">
              {template.name}
            </h3>
            {isFeatured && (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 shrink-0">
                Featured
              </span>
            )}
          </div>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {template.subtitle}
          </p>

          {/* Small Capability Summary (max 3-4 labels) */}
          <p className="text-[11px] font-medium text-neutral-500 pt-1">
            {template.chips.slice(0, 4).join(" • ")}
          </p>
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPreview}
          className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors cursor-pointer"
        >
          Preview
        </button>

        <button
          type="button"
          onClick={onUse}
          className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <span>Use Template</span>
          <ArrowRight className="w-3 h-3 text-neutral-400" />
        </button>
      </div>
    </div>
  );
}
