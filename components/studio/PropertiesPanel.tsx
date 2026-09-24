"use client";

import React from "react";
import type {
  StudioDesign,
  StudioElement,
  StudioTextElement,
  StudioDynamicTextElement,
  StudioQRElement,
  StudioImageElement,
  StudioShapeElement,
  StudioDividerElement,
} from "@/lib/studio/types";
import { MIN_QR_SIZE } from "@/lib/studio/types";
import { getContrastRatio } from "@/lib/studio/resolver";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Sliders,
} from "lucide-react";

interface Props {
  design: StudioDesign;
  selectedElement: StudioElement | null;
  onUpdateElement: (updated: Partial<StudioElement>) => void;
  onUpdateBackground: (bg: Partial<StudioDesign["background"]>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

const COLOR_SWATCHES = [
  "#000000",
  "#18181B",
  "#FFFFFF",
  "#635BFF",
  "#4F46E5",
  "#0284C7",
  "#059669",
  "#10B981",
  "#F59E0B",
  "#EA580C",
  "#DC2626",
  "#EC4899",
  "#7C3AED",
  "#64748B",
];

export default function PropertiesPanel({
  design,
  selectedElement,
  onUpdateElement,
  onUpdateBackground,
  onDuplicateElement,
  onDeleteElement,
}: Props) {
  // If no element is selected, show Canvas & Background Properties
  if (!selectedElement) {
    return (
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Canvas Settings
          </h3>
          <p className="text-xs text-neutral-500">
            {design.format.toUpperCase()} · {design.width} × {design.height} px
          </p>
        </div>

        {/* Background Color */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-neutral-700 block">
            Ticket Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={design.background.color || "#FFFFFF"}
              onChange={(e) => onUpdateBackground({ color: e.target.value })}
              className="w-9 h-9 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={design.background.color || "#FFFFFF"}
              onChange={(e) => onUpdateBackground({ color: e.target.value })}
              className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-neutral-200 uppercase"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {COLOR_SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => onUpdateBackground({ color: hex })}
                className="w-5 h-5 rounded-md border border-neutral-300 transition-transform hover:scale-110 shadow-2xs"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-600 leading-relaxed">
          💡 Click on any text, QR code, logo, or shape on the canvas to inspect and edit its properties.
        </div>
      </div>
    );
  }

  // Common Position & Geometry
  const renderGeometry = () => (
    <div className="space-y-2 pt-3 border-t border-neutral-100">
      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
        Position & Size
      </span>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="text-[10px] text-neutral-500 font-mono">X</label>
          <input
            type="number"
            value={Math.round(selectedElement.x)}
            onChange={(e) => onUpdateElement({ x: Number(e.target.value) })}
            className="w-full px-2 py-1 border border-neutral-200 rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 font-mono">Y</label>
          <input
            type="number"
            value={Math.round(selectedElement.y)}
            onChange={(e) => onUpdateElement({ y: Number(e.target.value) })}
            className="w-full px-2 py-1 border border-neutral-200 rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 font-mono">W</label>
          <input
            type="number"
            value={Math.round(selectedElement.width)}
            onChange={(e) => onUpdateElement({ width: Math.max(10, Number(e.target.value)) })}
            className="w-full px-2 py-1 border border-neutral-200 rounded-lg text-xs"
          />
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 font-mono">H</label>
          <input
            type="number"
            value={Math.round(selectedElement.height)}
            onChange={(e) => onUpdateElement({ height: Math.max(10, Number(e.target.value)) })}
            className="w-full px-2 py-1 border border-neutral-200 rounded-lg text-xs"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-5 max-h-[calc(100vh-140px)] overflow-y-auto">
      {/* Element Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-brand">
            Selected Element
          </span>
          <h3 className="text-sm font-bold text-neutral-900 truncate max-w-[170px]">
            {selectedElement.name}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdateElement({ locked: !selectedElement.locked })}
            title={selectedElement.locked ? "Unlock" : "Lock"}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              selectedElement.locked
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "border-neutral-200 text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {selectedElement.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => onDuplicateElement(selectedElement.id)}
            title="Duplicate"
            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {selectedElement.type !== "qr" && (
            <button
              type="button"
              onClick={() => onDeleteElement(selectedElement.id)}
              title="Delete"
              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Type-Specific Inspectors ── */}

      {/* 1. Text or Dynamic Text Element */}
      {(selectedElement.type === "text" || selectedElement.type === "dynamic_text") && (
        <div className="space-y-4 text-xs">
          {selectedElement.type === "text" && (
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Text Content</label>
              <textarea
                value={(selectedElement as StudioTextElement).content}
                onChange={(e) => onUpdateElement({ content: e.target.value })}
                rows={2}
                className="w-full p-2 border border-neutral-200 rounded-lg text-xs"
              />
            </div>
          )}

          {selectedElement.type === "dynamic_text" && (
            <div className="p-2.5 bg-brand/5 border border-brand/20 rounded-xl">
              <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                Dynamic Token Field
              </span>
              <p className="font-mono text-xs font-semibold text-neutral-900 mt-0.5">
                {`{{${(selectedElement as StudioDynamicTextElement).fieldKey}}}`}
              </p>
            </div>
          )}

          {/* Typography Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Font Family</label>
              <select
                value={(selectedElement as StudioTextElement).fontFamily || "sans"}
                onChange={(e) => onUpdateElement({ fontFamily: e.target.value })}
                className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs"
              >
                <option value="sans">Modern Sans</option>
                <option value="mono">Monospace</option>
                <option value="serif">Editorial Serif</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Size (px)</label>
              <input
                type="number"
                min={8}
                max={72}
                value={(selectedElement as StudioTextElement).fontSize || 14}
                onChange={(e) => onUpdateElement({ fontSize: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Weight & Alignment */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Weight</label>
              <select
                value={(selectedElement as StudioTextElement).fontWeight || 400}
                onChange={(e) => onUpdateElement({ fontWeight: Number(e.target.value) })}
                className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs"
              >
                <option value={400}>Regular (400)</option>
                <option value={600}>Semibold (600)</option>
                <option value={700}>Bold (700)</option>
                <option value={900}>Black (900)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Alignment</label>
              <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => onUpdateElement({ textAlign: align })}
                    className={`flex-1 py-1.5 flex items-center justify-center transition-colors ${
                      (selectedElement as StudioTextElement).textAlign === align
                        ? "bg-neutral-900 text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {align === "left" && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === "center" && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === "right" && <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="text-[11px] font-bold text-neutral-600 block mb-1">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={(selectedElement as StudioTextElement).color || "#000000"}
                onChange={(e) => onUpdateElement({ color: e.target.value })}
                className="w-8 h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={(selectedElement as StudioTextElement).color || "#000000"}
                onChange={(e) => onUpdateElement({ color: e.target.value })}
                className="flex-1 px-2.5 py-1.5 text-xs font-mono border border-neutral-200 rounded-lg uppercase"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Protected QR Code Inspector */}
      {selectedElement.type === "qr" && (() => {
        const qr = selectedElement as StudioQRElement;
        const contrast = getContrastRatio(qr.fgColor || "#000000", qr.bgColor || "#FFFFFF");
        const isTooSmall = qr.width < MIN_QR_SIZE || qr.height < MIN_QR_SIZE;
        const isContrastSafe = contrast >= 4.5;

        return (
          <div className="space-y-4 text-xs">
            {/* Safety Indicator Banner */}
            <div
              className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                !isTooSmall && isContrastSafe
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {!isTooSmall && isContrastSafe ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>QR Safety Verified</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>QR Check Warning</span>
                  </>
                )}
              </div>
              <ul className="text-[11px] space-y-0.5 pl-5 list-disc opacity-90">
                <li className={isContrastSafe ? "text-green-700" : "text-amber-700 font-bold"}>
                  {isContrastSafe ? "✓ Good contrast ratio" : `⚠ Low contrast (${contrast.toFixed(1)}:1 < 4.5)`}
                </li>
                <li className={!isTooSmall ? "text-green-700" : "text-amber-700 font-bold"}>
                  {!isTooSmall ? "✓ Scannable size (>140px)" : `⚠ Too small (<${MIN_QR_SIZE}px)`}
                </li>
              </ul>
            </div>

            {/* QR Dimensions Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-neutral-700">QR Size</label>
                <span className="font-mono text-neutral-500">{Math.round(qr.width)} × {Math.round(qr.height)} px</span>
              </div>
              <input
                type="range"
                min={MIN_QR_SIZE}
                max={320}
                step={5}
                value={qr.width}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateElement({ width: val, height: val });
                }}
                className="w-full accent-brand cursor-pointer"
              />
              <span className="text-[10px] text-neutral-400">
                Minimum {MIN_QR_SIZE}px enforced for gate scannability.
              </span>
            </div>

            {/* Scan Label Text */}
            <div>
              <label className="flex items-center gap-2 font-bold text-neutral-700 mb-1.5">
                <input
                  type="checkbox"
                  checked={qr.showScanLabel ?? true}
                  onChange={(e) => onUpdateElement({ showScanLabel: e.target.checked })}
                  className="rounded text-brand focus:ring-brand"
                />
                <span>Show scan instruction</span>
              </label>
              {qr.showScanLabel && (
                <input
                  type="text"
                  value={qr.scanLabelText || "SCAN FOR ENTRY"}
                  onChange={(e) => onUpdateElement({ scanLabelText: e.target.value })}
                  placeholder="SCAN FOR ENTRY"
                  className="w-full px-2.5 py-1.5 border border-neutral-200 rounded-lg text-xs"
                />
              )}
            </div>

            {/* Attendee ID */}
            <div>
              <label className="flex items-center gap-2 font-bold text-neutral-700">
                <input
                  type="checkbox"
                  checked={qr.showAttendeeId ?? true}
                  onChange={(e) => onUpdateElement({ showAttendeeId: e.target.checked })}
                  className="rounded text-brand focus:ring-brand"
                />
                <span>Show attendee short ID</span>
              </label>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-neutral-600 block mb-1">QR Code Color</label>
                <input
                  type="color"
                  value={qr.fgColor || "#000000"}
                  onChange={(e) => onUpdateElement({ fgColor: e.target.value })}
                  className="w-full h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-600 block mb-1">Card Background</label>
                <input
                  type="color"
                  value={qr.bgColor || "#FFFFFF"}
                  onChange={(e) => onUpdateElement({ bgColor: e.target.value })}
                  className="w-full h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. Shape Inspector */}
      {selectedElement.type === "shape" && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Shape Type</label>
            <select
              value={(selectedElement as StudioShapeElement).shapeType || "rect"}
              onChange={(e) =>
                onUpdateElement({
                  shapeType: e.target.value as "rect" | "pill" | "circle",
                })
              }
              className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs"
            >
              <option value="rect">Rectangle / Card</option>
              <option value="pill">Pill / Badge</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Fill Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={(selectedElement as StudioShapeElement).fillColor || "#000000"}
                onChange={(e) => onUpdateElement({ fillColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={(selectedElement as StudioShapeElement).fillColor || "#000000"}
                onChange={(e) => onUpdateElement({ fillColor: e.target.value })}
                className="flex-1 px-2.5 py-1.5 text-xs font-mono border border-neutral-200 rounded-lg uppercase"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Border Radius (px)</label>
            <input
              type="number"
              min={0}
              max={64}
              value={(selectedElement as StudioShapeElement).borderRadius || 0}
              onChange={(e) => onUpdateElement({ borderRadius: Number(e.target.value) })}
              className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs"
            />
          </div>
        </div>
      )}

      {/* 4. Image Inspector */}
      {selectedElement.type === "image" && (
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Image Fit</label>
            <select
              value={(selectedElement as StudioImageElement).objectFit || "contain"}
              onChange={(e) =>
                onUpdateElement({
                  objectFit: e.target.value as "contain" | "cover" | "fill",
                })
              }
              className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs"
            >
              <option value="contain">Contain (Keep Proportions)</option>
              <option value="cover">Cover (Fill Container)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Corner Radius</label>
            <input
              type="number"
              min={0}
              max={64}
              value={(selectedElement as StudioImageElement).borderRadius || 0}
              onChange={(e) => onUpdateElement({ borderRadius: Number(e.target.value) })}
              className="w-full px-2 py-1.5 border border-neutral-200 rounded-lg text-xs"
            />
          </div>
        </div>
      )}

      {/* Common Geometry Inspector */}
      {renderGeometry()}
    </div>
  );
}
