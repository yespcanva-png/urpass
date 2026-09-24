"use client";

import React, { useState } from "react";
import {
  STUDIO_TEMPLATES,
  type StudioTemplateDefinition,
} from "@/lib/studio/templates";
import type { TicketFormat } from "@/lib/studio/types";
import { Sparkles, Smartphone, Ticket, CreditCard, Check } from "lucide-react";

interface Props {
  onSelectTemplate: (template: StudioTemplateDefinition) => void;
  activeTemplateId?: string;
}

export default function TemplateGallery({
  onSelectTemplate,
  activeTemplateId,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");

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
    return matchesCategory && matchesFormat;
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

  return (
    <div className="space-y-4">
      {/* Format Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setSelectedFormat("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedFormat === "all"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          All Formats ({STUDIO_TEMPLATES.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFormat("digital")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedFormat === "digital"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Digital Pass
        </button>
        <button
          type="button"
          onClick={() => setSelectedFormat("printable")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedFormat === "printable"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          Printable Ticket
        </button>
        <button
          type="button"
          onClick={() => setSelectedFormat("badge")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedFormat === "badge"
              ? "bg-white text-neutral-900 shadow-xs"
              : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Event Badge
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
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
          const isSelected = activeTemplateId === template.id;

          return (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`group relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-brand bg-brand/5 ring-2 ring-brand/20 shadow-sm"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Mini Visual Preview Mockup Box */}
              <div
                className="w-full h-36 rounded-xl overflow-hidden relative mb-3 border border-neutral-200/60 flex items-center justify-center p-3 select-none"
                style={{ backgroundColor: template.thumbnailBg }}
              >
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
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-neutral-900 group-hover:text-brand transition-colors">
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

              {/* Tags */}
              <div className="flex items-center gap-1 mt-3 flex-wrap">
                {template.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
