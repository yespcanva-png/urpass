"use client";

import React from "react";
import type { StudioElement } from "@/lib/studio/types";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  QrCode,
  Type,
  Image as ImageIcon,
  Square,
  Minus,
} from "lucide-react";

interface Props {
  elements: StudioElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onMoveForward: (id: string) => void;
  onMoveBackward: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function LayersPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
  onMoveForward,
  onMoveBackward,
  onDuplicate,
  onDelete,
}: Props) {
  // Sort reverse by zIndex so top elements appear at the top of the layers list
  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  function getElementIcon(type: StudioElement["type"]) {
    switch (type) {
      case "qr":
        return <QrCode className="w-3.5 h-3.5 text-neutral-600" />;
      case "dynamic_text":
      case "text":
        return <Type className="w-3.5 h-3.5 text-neutral-600" />;
      case "image":
        return <ImageIcon className="w-3.5 h-3.5 text-neutral-600" />;
      case "shape":
        return <Square className="w-3.5 h-3.5 text-neutral-600" />;
      case "divider":
        return <Minus className="w-3.5 h-3.5 text-neutral-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-neutral-600" />;
    }
  }

  if (elements.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-neutral-400">
        No elements on canvas. Add text, QR, or shapes to begin.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
        <span>Layers ({elements.length})</span>
        <span>Order / Actions</span>
      </div>

      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
        {sortedElements.map((el, index) => {
          const isSelected = selectedElementId === el.id;
          const isTop = index === 0;
          const isBottom = index === sortedElements.length - 1;

          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                isSelected
                  ? "bg-brand/10 border-brand text-brand font-semibold shadow-2xs"
                  : "bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="shrink-0">{getElementIcon(el.type)}</span>
                <span className="truncate text-xs">{el.name}</span>
                {el.type === "qr" && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                    Protected
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center gap-1 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Move Up */}
                <button
                  type="button"
                  disabled={isTop}
                  onClick={() => onMoveForward(el.id)}
                  title="Bring Forward"
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-400"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={isBottom}
                  onClick={() => onMoveBackward(el.id)}
                  title="Send Backward"
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-400"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Lock Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleLock(el.id)}
                  title={el.locked ? "Unlock element" : "Lock element"}
                  className={`p-1 rounded transition-colors ${
                    el.locked ? "text-amber-600 bg-amber-50" : "text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>

                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => onToggleVisibility(el.id)}
                  title={el.hidden ? "Show element" : "Hide element"}
                  className={`p-1 rounded transition-colors ${
                    el.hidden ? "text-neutral-300" : "text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  {el.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => onDuplicate(el.id)}
                  title="Duplicate element"
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Delete (prevent deleting QR code) */}
                {el.type !== "qr" ? (
                  <button
                    type="button"
                    onClick={() => onDelete(el.id)}
                    title="Delete element"
                    className="p-1 rounded text-neutral-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="w-5" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
