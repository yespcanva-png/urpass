"use client";

import React from "react";
import { Smartphone, Ticket, CreditCard, Check } from "lucide-react";
import type { TicketFormat } from "@/lib/studio/types";
import { FORMAT_DIMENSIONS } from "@/lib/studio/types";

interface Props {
  selectedFormat: TicketFormat;
  onSelectFormat: (format: TicketFormat) => void;
}

export default function FormatSelector({
  selectedFormat,
  onSelectFormat,
}: Props) {
  const formats: Array<{
    id: TicketFormat;
    icon: React.ElementType;
    badge?: string;
  }> = [
    {
      id: "digital",
      icon: Smartphone,
      badge: "Most Popular",
    },
    {
      id: "printable",
      icon: Ticket,
      badge: "Print & Tear",
    },
    {
      id: "badge",
      icon: CreditCard,
      badge: "Conferences",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {formats.map(({ id, icon: Icon, badge }) => {
        const info = FORMAT_DIMENSIONS[id];
        const isSelected = selectedFormat === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectFormat(id)}
            className={`relative text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
              isSelected
                ? "border-brand bg-brand/5 shadow-sm ring-2 ring-brand/20"
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            {badge && (
              <span
                className={`self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                  isSelected
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {badge}
              </span>
            )}

            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">{info.label}</h4>
                <p className="text-[11px] font-mono text-neutral-500">
                  {info.width} × {info.height} px
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              {info.description}
            </p>

            {isSelected && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
