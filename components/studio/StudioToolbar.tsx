"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Eye,
  Send,
  Save,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Ticket,
  CreditCard,
  Loader2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { StudioDesign, TicketFormat } from "@/lib/studio/types";

interface Props {
  design: StudioDesign;
  eventName?: string;
  backHref?: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenPreview: () => void;
  onOpenTestPass: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  ticketCategories?: Array<{ id: string; name: string }>;
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function StudioToolbar({
  design,
  eventName = "URPASS SUMMIT",
  backHref = "/dashboard",
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenPreview,
  onOpenTestPass,
  onSaveDraft,
  onPublish,
  isSaving,
  ticketCategories = [],
  selectedCategory,
  onSelectCategory,
}: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  function getFormatBadge(format: TicketFormat) {
    switch (format) {
      case "printable":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Ticket className="w-3 h-3" />
            Printable Ticket
          </span>
        );
      case "badge":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <CreditCard className="w-3 h-3" />
            Event Badge
          </span>
        );
      case "digital":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
            <Smartphone className="w-3 h-3" />
            Digital Pass
          </span>
        );
    }
  }

  return (
    <header className="h-14 border-b border-neutral-200 bg-white px-4 flex items-center justify-between gap-4 select-none shrink-0 sticky top-0 z-40">
      {/* Left: Back & Event Info */}
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 transition-colors px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 border border-neutral-200/80 bg-neutral-50 shadow-2xs"
          title={`Back to ${backHref.includes("/event/") ? "Event" : "Dashboard"}`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {backHref.includes("/event/") ? "Back to Event" : "Back to Dashboard"}
          </span>
        </Link>

        <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm font-black text-neutral-900 tracking-tight">
            <span>Ticket Studio</span>
          </div>

          {getFormatBadge(design.format)}

          {design.isPublished ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Published
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Center: Ticket Category Target & Undo / Redo */}
      <div className="flex items-center gap-2">
        {ticketCategories.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 text-xs">
            <span className="text-neutral-400 font-medium">Design for:</span>
            <select
              value={selectedCategory || "all"}
              onChange={(e) => onSelectCategory(e.target.value === "all" ? null : e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">● All Ticket Types</option>
              {ticketCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  Tier: {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-0.5 border border-neutral-200 rounded-lg p-0.5 bg-neutral-50">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right: Fullscreen, Preview, Test Pass, Save & Publish */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen Mode"}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-2xs"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />}
          <span className="hidden md:inline">{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
        </button>

        <button
          type="button"
          onClick={onOpenPreview}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-2xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <button
          type="button"
          onClick={onOpenTestPass}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand/30 bg-brand/5 text-xs font-bold text-brand hover:bg-brand/10 transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Generate Test Pass</span>
          <span className="sm:hidden">Test</span>
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={onSaveDraft}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-2xs disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>Save Draft</span>
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={onPublish}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand text-xs font-bold text-white hover:bg-brand/90 transition-colors shadow-xs disabled:opacity-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Publish Design</span>
        </button>
      </div>
    </header>
  );
}
