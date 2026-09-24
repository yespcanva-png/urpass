"use client";

import React, { useState } from "react";
import {
  LayoutTemplate,
  Type,
  UserCheck,
  Image as ImageIcon,
  Square,
  QrCode,
  Palette,
  Layers,
  ChevronLeft,
  Plus,
} from "lucide-react";
import type {
  StudioDesign,
  StudioElement,
  TicketFormat,
  DynamicFieldDefinition,
} from "@/lib/studio/types";
import TemplateGallery from "./TemplateGallery";
import FormatSelector from "./FormatSelector";
import DynamicFields from "./DynamicFields";
import AssetUploader from "./AssetUploader";
import LayersPanel from "./LayersPanel";
import type { StudioTemplateDefinition } from "@/lib/studio/templates";

interface Props {
  design: StudioDesign;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onSelectTemplate: (template: StudioTemplateDefinition) => void;
  onSelectFormat: (format: TicketFormat) => void;
  onAddText: (type: "heading" | "subheading" | "body") => void;
  onAddDynamicField: (field: DynamicFieldDefinition) => void;
  onAddImage: (url: string, type: "image" | "background") => void;
  onAddShape: (type: "rect" | "pill" | "circle") => void;
  onAddDivider: () => void;
  onAddQR: () => void;
  onUpdateBackground: (bg: Partial<StudioDesign["background"]>) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onMoveForward: (id: string) => void;
  onMoveBackward: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

type TabType =
  | "templates"
  | "text"
  | "fields"
  | "images"
  | "shapes"
  | "qr"
  | "background"
  | "layers";

export default function StudioSidebar({
  design,
  selectedElementId,
  onSelectElement,
  onSelectTemplate,
  onSelectFormat,
  onAddText,
  onAddDynamicField,
  onAddImage,
  onAddShape,
  onAddDivider,
  onAddQR,
  onUpdateBackground,
  onToggleVisibility,
  onToggleLock,
  onMoveForward,
  onMoveBackward,
  onDuplicateElement,
  onDeleteElement,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("templates");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [templateSubTab, setTemplateSubTab] = useState<"templates" | "blank">("templates");

  const tabs: Array<{ id: TabType; label: string; icon: React.ElementType }> = [
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "fields", label: "Fields", icon: UserCheck },
    { id: "text", label: "Text", icon: Type },
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "shapes", label: "Shapes", icon: Square },
    { id: "qr", label: "QR Code", icon: QrCode },
    { id: "background", label: "Background", icon: Palette },
    { id: "layers", label: "Layers", icon: Layers },
  ];

  return (
    <div className="flex h-full select-none bg-white border-r border-neutral-200">
      {/* 1. Left Vertical Icon Strip */}
      <div className="w-18 border-r border-neutral-200 flex flex-col items-center py-3 gap-1 shrink-0 bg-neutral-50/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isDrawerOpen && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (activeTab === tab.id && isDrawerOpen) {
                  setIsDrawerOpen(false);
                } else {
                  setActiveTab(tab.id);
                  setIsDrawerOpen(true);
                }
              }}
              title={tab.label}
              className={`w-14 py-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? "bg-brand text-white shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Expandable Panel Content */}
      <div
        className={`flex flex-col h-full bg-white overflow-hidden transition-all duration-200 ${
          isDrawerOpen ? "w-80 sm:w-96 border-r border-neutral-100" : "w-0 border-r-0"
        }`}
      >
        <div className="p-3.5 border-b border-neutral-100 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-neutral-900 capitalize">
            {activeTab}
          </h2>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            title="Collapse panel"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* TAB 1: Templates & Start from Blank */}
          {activeTab === "templates" && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTemplateSubTab("templates")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    templateSubTab === "templates"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Browse Templates
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateSubTab("blank")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    templateSubTab === "blank"
                      ? "bg-white text-neutral-900 shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Start from Blank
                </button>
              </div>

              {templateSubTab === "templates" ? (
                <TemplateGallery
                  onSelectTemplate={onSelectTemplate}
                  activeTemplateId={design.name}
                />
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-500">
                    Choose a pass layout format to start with a clean blank canvas:
                  </p>
                  <FormatSelector
                    selectedFormat={design.format}
                    onSelectFormat={onSelectFormat}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Dynamic Fields */}
          {activeTab === "fields" && (
            <DynamicFields onAddField={onAddDynamicField} />
          )}

          {/* TAB 3: Text Blocks */}
          {activeTab === "text" && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500">
                Click to add custom editable text blocks:
              </p>
              <button
                type="button"
                onClick={() => onAddText("heading")}
                className="w-full p-3.5 rounded-xl border border-neutral-200 hover:border-brand hover:bg-brand/5 text-left transition-all"
              >
                <h3 className="text-base font-black text-neutral-900">Add a Heading</h3>
                <p className="text-xs text-neutral-400">Large bold event title</p>
              </button>

              <button
                type="button"
                onClick={() => onAddText("subheading")}
                className="w-full p-3 rounded-xl border border-neutral-200 hover:border-brand hover:bg-brand/5 text-left transition-all"
              >
                <h4 className="text-sm font-bold text-neutral-800">Add a Subheading</h4>
                <p className="text-xs text-neutral-400">Tagline or section header</p>
              </button>

              <button
                type="button"
                onClick={() => onAddText("body")}
                className="w-full p-2.5 rounded-xl border border-neutral-200 hover:border-brand hover:bg-brand/5 text-left transition-all"
              >
                <p className="text-xs font-normal text-neutral-700">Add Body Text</p>
                <p className="text-[11px] text-neutral-400">Notes, instructions, or disclaimers</p>
              </button>
            </div>
          )}

          {/* TAB 4: Images & Artwork */}
          {activeTab === "images" && (
            <AssetUploader onAddImage={onAddImage} />
          )}

          {/* TAB 5: Shapes & Dividers */}
          {activeTab === "shapes" && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Geometric Shapes
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onAddShape("rect")}
                  className="p-3 border border-neutral-200 rounded-xl hover:border-brand hover:bg-brand/5 flex flex-col items-center gap-1.5 text-xs font-semibold text-neutral-800"
                >
                  <div className="w-8 h-6 bg-neutral-200 rounded" />
                  <span>Card / Box</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddShape("pill")}
                  className="p-3 border border-neutral-200 rounded-xl hover:border-brand hover:bg-brand/5 flex flex-col items-center gap-1.5 text-xs font-semibold text-neutral-800"
                >
                  <div className="w-8 h-4 bg-neutral-200 rounded-full" />
                  <span>Badge Pill</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddShape("circle")}
                  className="p-3 border border-neutral-200 rounded-xl hover:border-brand hover:bg-brand/5 flex flex-col items-center gap-1.5 text-xs font-semibold text-neutral-800"
                >
                  <div className="w-6 h-6 bg-neutral-200 rounded-full" />
                  <span>Circle</span>
                </button>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                  Dividers & Lines
                </span>
                <button
                  type="button"
                  onClick={onAddDivider}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 hover:border-brand hover:bg-brand/5 flex items-center justify-between text-xs font-bold text-neutral-800"
                >
                  <span>Insert Horizontal Divider Line</span>
                  <Plus className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: QR Component */}
          {activeTab === "qr" && (
            <div className="space-y-4">
              <div className="p-3 bg-brand/5 border border-brand/20 rounded-xl text-xs text-brand font-medium">
                <strong>Gate Scanner Protected:</strong> The QR code is automatically tied to each attendee’s unique pass. URPASS enforces a minimum scannable size of 140px and high contrast ratio for lightning-fast camera scans.
              </div>

              <button
                type="button"
                onClick={onAddQR}
                className="w-full py-3 rounded-xl bg-brand text-white text-xs font-bold hover:bg-brand/90 flex items-center justify-center gap-2 shadow-xs"
              >
                <QrCode className="w-4 h-4" />
                <span>Center Entry QR Code</span>
              </button>
            </div>
          )}

          {/* TAB 7: Background */}
          {activeTab === "background" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-2">
                  Canvas Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={design.background.color || "#FFFFFF"}
                    onChange={(e) => onUpdateBackground({ color: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={design.background.color || "#FFFFFF"}
                    onChange={(e) => onUpdateBackground({ color: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Layers */}
          {activeTab === "layers" && (
            <LayersPanel
              elements={design.elements}
              selectedElementId={selectedElementId}
              onSelectElement={onSelectElement}
              onToggleVisibility={onToggleVisibility}
              onToggleLock={onToggleLock}
              onMoveForward={onMoveForward}
              onMoveBackward={onMoveBackward}
              onDuplicate={onDuplicateElement}
              onDelete={onDeleteElement}
            />
          )}
        </div>
      </div>
    </div>
  );
}
