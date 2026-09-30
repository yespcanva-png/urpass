"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EVENT_SETUP_TEMPLATES,
  type EventSetupTemplate,
  type TemplateCategory,
} from "@/lib/templates/event-setups";
import SetupAssetPreview from "./SetupAssetPreview";
import EventSetupModal from "./EventSetupModal";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Sliders,
  ShieldCheck,
  Building2,
  GraduationCap,
  Heart,
  Crown,
  Layers,
  Eye,
  Palette,
  CheckCircle2,
  Ticket,
} from "lucide-react";

export default function EventSetupAcceleratorGallery() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalTemplate, setActiveModalTemplate] = useState<EventSetupTemplate | null>(null);

  const CATEGORY_TABS: TemplateCategory[] = [
    "All",
    "Corporate",
    "Campus",
    "Conferences",
    "Social",
    "Ticketed",
    "Invite Only",
  ];

  const featuredTemplates = EVENT_SETUP_TEMPLATES.filter((t) => t.featured);

  const filteredTemplates = EVENT_SETUP_TEMPLATES.filter((t) => {
    const matchesCategory =
      selectedCategory === "All" ||
      t.category === selectedCategory ||
      t.secondaryCategory === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.chips.some((chip) => chip.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Non-featured or filtered standard list
  const standardTemplates =
    selectedCategory === "All" && !searchQuery.trim()
      ? EVENT_SETUP_TEMPLATES.filter((t) => !t.featured)
      : filteredTemplates;

  function handleUseTemplate(template: EventSetupTemplate) {
    router.push(`/create-event?template=${encodeURIComponent(template.id)}`);
  }

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-12">
      {/* ── 1. INTRO & SEARCH / FILTER ROW (Compact Notion + Linear Style) ── */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-950 tracking-tight leading-tight">
              Templates
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 mt-2 font-medium">
              Launch your event faster with ready-to-use URPASS setups.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search setups (e.g. Conference, Fest, VIP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-white border border-neutral-200/90 rounded-2xl focus:outline-hidden focus:border-neutral-900 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs: All | Corporate | Campus | Conferences | Social | Ticketed | Invite Only */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-neutral-100">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. FEATURED TEMPLATES (3 LARGE CARDS IN ONE ROW) ── */}
      {selectedCategory === "All" && !searchQuery.trim() && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                FEATURED EVENT ACCELERATORS
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              Pre-configured registration + pass + check-in
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-neutral-400/80 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* 16:10 Visual Preview Canvas Area (~65-70% attention) */}
                <div
                  onClick={() => setActiveModalTemplate(template)}
                  className="w-full h-[240px] bg-[#F6F7F9] group-hover:bg-[#EFF1F5] p-4 relative flex items-center justify-center cursor-pointer select-none overflow-hidden border-b border-neutral-100 transition-colors"
                >
                  {/* Floating category badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-white/95 text-neutral-800 text-[10px] font-bold border border-neutral-200/90 shadow-2xs backdrop-blur-md">
                      {template.category}
                    </span>
                  </div>

                  {/* Floating Action Hint */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-brand-200" />
                      FEATURED
                    </span>
                  </div>

                  {/* Scaled Preview */}
                  <div className="relative z-10 w-full flex items-center justify-center transform group-hover:scale-[1.02] transition-transform duration-300">
                    <SetupAssetPreview template={template} assetType="pass" mode="card" />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-all flex items-center justify-center z-20">
                    <div className="px-3.5 py-2 rounded-xl bg-white text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-xl">
                      <Eye className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Preview Complete Setup</span>
                    </div>
                  </div>
                </div>

                {/* Content & Action Area */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-neutral-950 tracking-tight">
                      {template.name}
                    </h3>

                    {/* Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {template.chips.map((chip, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200/80"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-neutral-500 line-clamp-2">
                      <strong className="text-neutral-700 font-semibold">Best for: </strong>
                      {template.bestFor}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveModalTemplate(template)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 3. STANDARD & MIXED-SIZE GRID (4-COLUMN + WIDE CARDS) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              {selectedCategory === "All" && !searchQuery.trim()
                ? "POPULAR EVENT SETUPS"
                : `${selectedCategory.toUpperCase()} SETUPS (${standardTemplates.length})`}
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {standardTemplates.length} Available
          </span>
        </div>

        {standardTemplates.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-neutral-300 bg-white p-8">
            <Palette className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-neutral-900">No setups found</h4>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query or switching categories to see all available event accelerator setups.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standardTemplates.map((template) => {
              const isWide = template.wide && selectedCategory === "All";

              return (
                <div
                  key={template.id}
                  className={`bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-neutral-400/80 transition-all duration-300 flex flex-col justify-between group ${
                    isWide ? "sm:col-span-2 lg:col-span-2" : ""
                  }`}
                >
                  {/* Visual Preview */}
                  <div
                    onClick={() => setActiveModalTemplate(template)}
                    className={`w-full bg-[#F6F7F9] group-hover:bg-[#EFF1F5] p-3.5 relative flex items-center justify-center cursor-pointer select-none overflow-hidden border-b border-neutral-100 transition-colors ${
                      isWide ? "h-[220px]" : "h-[200px]"
                    }`}
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-white/95 text-neutral-800 text-[9px] font-bold border border-neutral-200/90 shadow-2xs">
                        {template.category}
                      </span>
                    </div>

                    <div className="relative z-10 w-full flex items-center justify-center transform group-hover:scale-[1.02] transition-transform duration-300">
                      <SetupAssetPreview template={template} assetType="pass" mode="card" />
                    </div>

                    <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-all flex items-center justify-center z-20">
                      <div className="px-3 py-1.5 rounded-lg bg-white text-neutral-950 font-bold text-[11px] flex items-center gap-1.5 shadow-xl">
                        <Eye className="w-3 h-3 text-neutral-600" />
                        <span>Preview Setup</span>
                      </div>
                    </div>
                  </div>

                  {/* Content & Action Area */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-extrabold text-neutral-950 tracking-tight line-clamp-1">
                        {template.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-1">
                        {template.chips.slice(0, 3).map((chip, idx) => (
                          <span
                            key={idx}
                            className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200/70"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-neutral-500 line-clamp-1">
                        <strong className="text-neutral-700 font-semibold">Best for: </strong>
                        {template.bestFor}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-neutral-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModalTemplate(template)}
                        className="py-2 px-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                        title="Preview Complete Setup"
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template)}
                        className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 4. SPECIAL COLLECTIONS SECTION ── */}
      {selectedCategory === "All" && !searchQuery.trim() && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              SPECIAL COLLECTIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Corporate Collection */}
            <div
              onClick={() => setSelectedCategory("Corporate")}
              className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-lg flex flex-col justify-between space-y-6 cursor-pointer hover:border-neutral-600 transition-all group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-white group-hover:text-brand-200 transition-colors">
                  Corporate
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  B2B conferences, keynotes, trade expos &amp; internal team summits.
                </p>
              </div>
              <span className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse Corporate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Campus Collection */}
            <div
              onClick={() => setSelectedCategory("Campus")}
              className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-lg flex flex-col justify-between space-y-6 cursor-pointer hover:border-neutral-600 transition-all group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-white group-hover:text-brand-200 transition-colors">
                  Campus
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  College fests, 24h hackathons, student symposiums &amp; club events.
                </p>
              </div>
              <span className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse Campus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* RSVP Collection */}
            <div
              onClick={() => setSelectedCategory("Social")}
              className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-lg flex flex-col justify-between space-y-6 cursor-pointer hover:border-neutral-600 transition-all group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                  <Heart className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-white group-hover:text-brand-200 transition-colors">
                  RSVP
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Weddings, private dinners, receptions &amp; intimate community mixers.
                </p>
              </div>
              <span className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse RSVP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Premium / VIP Collection */}
            <div
              onClick={() => setSelectedCategory("Invite Only")}
              className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-lg flex flex-col justify-between space-y-6 cursor-pointer hover:border-neutral-600 transition-all group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10">
                  <Crown className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-white group-hover:text-brand-200 transition-colors">
                  Premium / VIP
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Trustee galas, private dinners, investor retreats &amp; luxury access.
                </p>
              </div>
              <span className="text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse VIP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. TEMPLATE STUDIO SECTION ("Build once, reuse across 50+ events") ── */}
      <section className="rounded-3xl bg-neutral-950 p-8 sm:p-12 text-white border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-xs font-bold border border-white/20">
            <Sliders className="w-3.5 h-3.5 text-brand-200" />
            <span>ENTERPRISE &amp; CAMPUS BUILDER</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Template Studio
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Want to build your own bespoke setup? Use our full-canvas studio to preconfigure custom brand assets, registration fields, approval rules, and gate security permissions. Save once, reuse across 50+ events seamlessly.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                1. BRAND
              </span>
              <p className="text-neutral-200 mt-1 font-medium">Logo, color hex, cover banner</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                2. PASS
              </span>
              <p className="text-neutral-200 mt-1 font-medium">QR placement, credentials, lanyard</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                3. REGISTRATION
              </span>
              <p className="text-neutral-200 mt-1 font-medium">Custom inputs, approval, limits</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                4. ACCESS
              </span>
              <p className="text-neutral-200 mt-1 font-medium">Gates, zones &amp; check-in staff</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/studio"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-neutral-950 font-bold text-xs sm:text-sm hover:bg-neutral-100 transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Palette className="w-4 h-4 text-neutral-900" />
              <span>Launch Template Studio →</span>
            </Link>

            <Link
              href="/create-event"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm border border-neutral-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Start Blank Event</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Canva-Style Modal ── */}
      <EventSetupModal
        isOpen={Boolean(activeModalTemplate)}
        onClose={() => setActiveModalTemplate(null)}
        template={activeModalTemplate}
      />
    </div>
  );
}
