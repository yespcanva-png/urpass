"use client";

import React, { useState, useCallback, useTransition } from "react";
import type {
  StudioDesign,
  StudioElement,
  TicketFormat,
  DynamicFieldDefinition,
  StudioTextElement,
  StudioDynamicTextElement,
  StudioImageElement,
  StudioShapeElement,
  StudioDividerElement,
  StudioQRElement,
} from "@/lib/studio/types";
import { FORMAT_DIMENSIONS, MIN_QR_SIZE } from "@/lib/studio/types";
import { resolveStudioDesign, validateStudioDesign } from "@/lib/studio/resolver";
import { cloneTemplateDesign, createBlankDesign, type StudioTemplateDefinition } from "@/lib/studio/templates";
import { DUMMY_ATTENDEES, type DummyAttendee } from "@/lib/studio/dummy-attendees";
import StudioToolbar from "./StudioToolbar";
import StudioSidebar from "./StudioSidebar";
import StudioCanvas from "./StudioCanvas";
import PropertiesPanel from "./PropertiesPanel";
import PreviewModal from "./PreviewModal";
import TestPassModal from "./TestPassModal";
import { saveStudioDesign } from "@/app/actions/ticket-studio";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface TicketStudioProps {
  initialConfig?: unknown;
  isPro: boolean;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  venue?: string;
  backHref?: string;
  ticketCategories?: Array<{ id: string; name: string }>;
}

export default function TicketStudio({
  initialConfig,
  isPro,
  eventId,
  eventName = "URPASS SUMMIT",
  eventDate = "24 OCT 2026 | 10:00 AM",
  venue = "The Residency, Coimbatore",
  backHref = "/dashboard",
  ticketCategories = [],
}: TicketStudioProps) {
  // Initialize StudioDesign from existing config (version 2 or legacy format)
  const [design, setDesign] = useState<StudioDesign>(() =>
    resolveStudioDesign(initialConfig, null, null, "digital")
  );

  // Undo / Redo History Stack
  const [history, setHistory] = useState<StudioDesign[]>([design]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeAttendee, setActiveAttendee] = useState<DummyAttendee>(DUMMY_ATTENDEES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Modals
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [testPassModalOpen, setTestPassModalOpen] = useState(false);
  const [publishAlert, setPublishAlert] = useState<{ errors: string[] } | null>(null);

  // Push new state to history stack
  const pushHistory = useCallback(
    (newDesign: StudioDesign) => {
      setDesign(newDesign);
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, newDesign];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Undo / Redo actions
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex((idx) => idx - 1);
      setDesign(prev);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex((idx) => idx + 1);
      setDesign(next);
    }
  }, [historyIndex, history]);

  // Template Selection
  function handleSelectTemplate(template: StudioTemplateDefinition) {
    const cloned = cloneTemplateDesign(template);
    setSelectedElementId(null);
    pushHistory(cloned);
  }

  // Format Switch / Blank Canvas
  function handleSelectFormat(format: TicketFormat) {
    const blank = createBlankDesign(format);
    setSelectedElementId(null);
    pushHistory(blank);
  }

  // Add Static Text
  function handleAddText(type: "heading" | "subheading" | "body") {
    let content = "Text block";
    let fontSize = 14;
    let fontWeight: number | string = 500;
    let height = 24;

    if (type === "heading") {
      content = "HEADING TITLE";
      fontSize = 22;
      fontWeight = 800;
      height = 36;
    } else if (type === "subheading") {
      content = "Subheading Description";
      fontSize = 14;
      fontWeight = 600;
      height = 24;
    }

    const newElement: StudioTextElement = {
      id: `text-${Math.random().toString(36).slice(2, 9)}`,
      type: "text",
      name: type === "heading" ? "Heading" : "Text Block",
      content,
      fontFamily: "sans",
      fontSize,
      fontWeight,
      color: "#18181B",
      textAlign: "center",
      x: Math.round(design.width / 2 - 130),
      y: Math.round(design.height / 2 - height / 2),
      width: 260,
      height,
      zIndex: design.elements.length + 1,
    };

    const updated = {
      ...design,
      elements: [...design.elements, newElement],
    };
    setSelectedElementId(newElement.id);
    pushHistory(updated);
  }

  // Add Dynamic Field
  function handleAddDynamicField(field: DynamicFieldDefinition) {
    const newElement: StudioDynamicTextElement = {
      id: `dynamic-${Math.random().toString(36).slice(2, 9)}`,
      type: "dynamic_text",
      name: field.label,
      fieldKey: field.key,
      fallbackText: field.sampleValue,
      fontFamily: "sans",
      fontSize: field.defaultFontSize,
      fontWeight: field.defaultFontWeight,
      color: field.defaultColor,
      textAlign: "center",
      x: Math.round(design.width / 2 - 140),
      y: Math.round(design.height / 2 - 14),
      width: 280,
      height: 28,
      zIndex: design.elements.length + 1,
    };

    const updated = {
      ...design,
      elements: [...design.elements, newElement],
    };
    setSelectedElementId(newElement.id);
    pushHistory(updated);
  }

  // Add Image / Set Background
  function handleAddImage(url: string, type: "image" | "background") {
    if (type === "background") {
      const updated: StudioDesign = {
        ...design,
        background: {
          ...design.background,
          imageUrl: url,
          overlayOpacity: 0.15,
        },
      };
      pushHistory(updated);
      return;
    }

    const newElement: StudioImageElement = {
      id: `img-${Math.random().toString(36).slice(2, 9)}`,
      type: "image",
      name: "Uploaded Image",
      src: url,
      x: Math.round(design.width / 2 - 60),
      y: 40,
      width: 120,
      height: 50,
      objectFit: "contain",
      zIndex: design.elements.length + 1,
    };

    const updated = {
      ...design,
      elements: [...design.elements, newElement],
    };
    setSelectedElementId(newElement.id);
    pushHistory(updated);
  }

  // Add Geometric Shape
  function handleAddShape(shapeType: "rect" | "pill" | "circle") {
    const width = shapeType === "circle" ? 80 : shapeType === "pill" ? 160 : 200;
    const height = shapeType === "circle" ? 80 : shapeType === "pill" ? 32 : 100;

    const newElement: StudioShapeElement = {
      id: `shape-${Math.random().toString(36).slice(2, 9)}`,
      type: "shape",
      name: shapeType === "pill" ? "Badge Pill" : shapeType === "circle" ? "Circle" : "Card Box",
      shapeType,
      fillColor: "#F3F4F6",
      borderColor: "#E5E7EB",
      borderWidth: 1,
      borderRadius: shapeType === "rect" ? 12 : undefined,
      x: Math.round(design.width / 2 - width / 2),
      y: Math.round(design.height / 2 - height / 2),
      width,
      height,
      zIndex: 1, // put behind by default
    };

    const updated = {
      ...design,
      elements: [newElement, ...design.elements],
    };
    setSelectedElementId(newElement.id);
    pushHistory(updated);
  }

  // Add Divider Line
  function handleAddDivider() {
    const newElement: StudioDividerElement = {
      id: `divider-${Math.random().toString(36).slice(2, 9)}`,
      type: "divider",
      name: "Divider Line",
      color: "#E5E7EB",
      thickness: 1,
      style: "solid",
      x: 20,
      y: Math.round(design.height / 2),
      width: design.width - 40,
      height: 1,
      zIndex: design.elements.length + 1,
    };

    const updated = {
      ...design,
      elements: [...design.elements, newElement],
    };
    setSelectedElementId(newElement.id);
    pushHistory(updated);
  }

  // Add or Center QR Component
  function handleAddQR() {
    const existingQrIndex = design.elements.findIndex((el) => el.type === "qr");
    if (existingQrIndex >= 0) {
      // Re-center existing QR
      const existing = design.elements[existingQrIndex] as StudioQRElement;
      const centeredX = Math.round(design.width / 2 - existing.width / 2);
      const updatedElements = [...design.elements];
      updatedElements[existingQrIndex] = {
        ...existing,
        x: centeredX,
      };
      setSelectedElementId(existing.id);
      pushHistory({ ...design, elements: updatedElements });
    } else {
      // Create fresh QR
      const size = 180;
      const newElement: StudioQRElement = {
        id: `qr-${Math.random().toString(36).slice(2, 9)}`,
        type: "qr",
        name: "Entry QR Code",
        size,
        fgColor: "#000000",
        bgColor: "#FFFFFF",
        cornerRadius: 12,
        showScanLabel: true,
        scanLabelText: "SCAN FOR ENTRY",
        showAttendeeId: true,
        contrastSafe: true,
        x: Math.round(design.width / 2 - size / 2),
        y: Math.round(design.height / 2 - size / 2),
        width: size,
        height: size,
        locked: true,
        zIndex: design.elements.length + 1,
      };

      setSelectedElementId(newElement.id);
      pushHistory({ ...design, elements: [...design.elements, newElement] });
    }
  }

  // Update Element Properties
  function handleUpdateElement(updated: Partial<StudioElement>) {
    if (!selectedElementId) return;
    const newElements = design.elements.map((el) => {
      if (el.id === selectedElementId) {
        return { ...el, ...updated } as StudioElement;
      }
      return el;
    });
    pushHistory({ ...design, elements: newElements });
  }

  // Update Background Properties
  function handleUpdateBackground(bg: Partial<StudioDesign["background"]>) {
    pushHistory({
      ...design,
      background: { ...design.background, ...bg },
    });
  }

  // Toggle Visibility
  function handleToggleVisibility(id: string) {
    const newElements = design.elements.map((el) => {
      if (el.id === id) return { ...el, hidden: !el.hidden };
      return el;
    });
    pushHistory({ ...design, elements: newElements });
  }

  // Toggle Lock
  function handleToggleLock(id: string) {
    const newElements = design.elements.map((el) => {
      if (el.id === id) return { ...el, locked: !el.locked };
      return el;
    });
    pushHistory({ ...design, elements: newElements });
  }

  // Move Forward (Higher Z-Index)
  function handleMoveForward(id: string) {
    const idx = design.elements.findIndex((el) => el.id === id);
    if (idx < 0 || idx === design.elements.length - 1) return;
    const newElements = [...design.elements];
    const temp = newElements[idx];
    newElements[idx] = newElements[idx + 1];
    newElements[idx + 1] = temp;
    // Reassign sequential zIndexes
    newElements.forEach((el, i) => (el.zIndex = i + 1));
    pushHistory({ ...design, elements: newElements });
  }

  // Move Backward (Lower Z-Index)
  function handleMoveBackward(id: string) {
    const idx = design.elements.findIndex((el) => el.id === id);
    if (idx <= 0) return;
    const newElements = [...design.elements];
    const temp = newElements[idx];
    newElements[idx] = newElements[idx - 1];
    newElements[idx - 1] = temp;
    newElements.forEach((el, i) => (el.zIndex = i + 1));
    pushHistory({ ...design, elements: newElements });
  }

  // Duplicate Element
  function handleDuplicateElement(id: string) {
    const target = design.elements.find((el) => el.id === id);
    if (!target) return;
    const cloned: StudioElement = {
      ...JSON.parse(JSON.stringify(target)),
      id: `${target.type}-${Math.random().toString(36).slice(2, 9)}`,
      name: `${target.name} (Copy)`,
      x: Math.min(design.width - target.width, target.x + 15),
      y: Math.min(design.height - target.height, target.y + 15),
      zIndex: design.elements.length + 1,
    };
    setSelectedElementId(cloned.id);
    pushHistory({ ...design, elements: [...design.elements, cloned] });
  }

  // Delete Element
  function handleDeleteElement(id: string) {
    const target = design.elements.find((el) => el.id === id);
    if (!target || target.type === "qr") return; // Protect QR
    const newElements = design.elements.filter((el) => el.id !== id);
    setSelectedElementId(null);
    pushHistory({ ...design, elements: newElements });
  }

  // Save Draft Action
  async function handleSaveDraft() {
    setIsSaving(true);
    setSaveError(null);
    setSaveStatus(null);

    try {
      const res = await saveStudioDesign(eventId || null, design, false);
      if (res.error) throw new Error(res.error);
      setSaveStatus("Draft saved successfully.");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save draft";
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  }

  // Publish Design Action
  async function handlePublish() {
    const validation = validateStudioDesign(design);
    if (!validation.valid) {
      setPublishAlert({ errors: validation.errors });
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveStatus(null);

    try {
      const res = await saveStudioDesign(eventId || null, design, true);
      if (res.error) throw new Error(res.error);
      setDesign((prev) => ({ ...prev, isPublished: true }));
      setSaveStatus("Design published! Future passes will use this design.");
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish design";
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  }

  const selectedElement =
    design.elements.find((el) => el.id === selectedElementId) || null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col w-screen h-screen overflow-hidden bg-neutral-100 font-sans">
      {/* 1. Top Studio Toolbar */}
      <StudioToolbar
        design={design}
        eventName={eventName}
        backHref={backHref}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenPreview={() => setPreviewModalOpen(true)}
        onOpenTestPass={() => setTestPassModalOpen(true)}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        ticketCategories={ticketCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Save Notification Toasts */}
      {saveStatus && (
        <div className="absolute top-16 right-4 z-[120] flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {saveError && (
        <div className="absolute top-16 right-4 z-[120] flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* 2. Main 3-Column Desktop Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Column: Sidebar (Tabs + Expandable Drawer) */}
        <StudioSidebar
          design={design}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onSelectTemplate={handleSelectTemplate}
          onSelectFormat={handleSelectFormat}
          onAddText={handleAddText}
          onAddDynamicField={handleAddDynamicField}
          onAddImage={handleAddImage}
          onAddShape={handleAddShape}
          onAddDivider={handleAddDivider}
          onAddQR={handleAddQR}
          onUpdateBackground={handleUpdateBackground}
          onToggleVisibility={handleToggleVisibility}
          onToggleLock={handleToggleLock}
          onMoveForward={handleMoveForward}
          onMoveBackward={handleMoveBackward}
          onDuplicateElement={handleDuplicateElement}
          onDeleteElement={handleDeleteElement}
        />

        {/* Center Column: Interactive Live WYSIWYG Canvas */}
        <StudioCanvas
          design={design}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onUndo={handleUndo}
          onRedo={handleRedo}
          activeAttendee={activeAttendee}
        />

        {/* Right Column: Contextual Properties Inspector */}
        <div className="w-72 lg:w-80 bg-white border-l border-neutral-200 flex flex-col h-full overflow-hidden select-none">
          <PropertiesPanel
            design={design}
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateElement}
            onUpdateBackground={handleUpdateBackground}
            onDuplicateElement={handleDuplicateElement}
            onDeleteElement={handleDeleteElement}
          />
        </div>
      </div>

      {/* 3. Preview Modal */}
      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        design={design}
        activeAttendee={activeAttendee}
        onSelectAttendee={setActiveAttendee}
      />

      {/* 4. Generate Test Pass Modal */}
      <TestPassModal
        isOpen={testPassModalOpen}
        onClose={() => setTestPassModalOpen(false)}
        design={design}
        eventId={eventId}
        eventName={eventName}
      />

      {/* 5. Publish Validation Alert Modal */}
      {publishAlert && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Cannot Publish Pass
                </h3>
                <p className="text-xs text-neutral-500">
                  Please fix the following gate safety issues first:
                </p>
              </div>
            </div>

            <ul className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl p-3.5 space-y-1.5 list-disc pl-7">
              {publishAlert.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPublishAlert(null)}
                className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Back to Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
