"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import type {
  StudioDesign,
  StudioElement,
  StudioTextElement,
  StudioDynamicTextElement,
  StudioImageElement,
  StudioShapeElement,
  StudioDividerElement,
  StudioQRElement,
} from "@/lib/studio/types";
import { MIN_QR_SIZE } from "@/lib/studio/types";
import TextElement from "./elements/TextElement";
import DynamicTextElement from "./elements/DynamicTextElement";
import ImageElement from "./elements/ImageElement";
import ShapeElement from "./elements/ShapeElement";
import DividerElement from "./elements/DividerElement";
import QRCodeElement from "./elements/QRCodeElement";
import { DUMMY_ATTENDEES, type DummyAttendee } from "@/lib/studio/dummy-attendees";
import { ZoomIn, ZoomOut, Maximize2, Magnet } from "lucide-react";

interface Props {
  design: StudioDesign;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: Partial<StudioElement>) => void;
  onDeleteElement: (id: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  activeAttendee?: DummyAttendee;
  snapToGrid?: boolean;
}

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export default function StudioCanvas({
  design,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onUndo,
  onRedo,
  activeAttendee = DUMMY_ATTENDEES[0],
  snapToGrid = true,
}: Props) {
  const [zoom, setZoom] = useState<number>(0.85);
  const [isSnapActive, setIsSnapActive] = useState(snapToGrid);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; elX: number; elY: number } | null>(null);

  const [resizingHandle, setResizingHandle] = useState<ResizeHandle | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    mouseX: number;
    mouseY: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const selectedElement = design.elements.find((el) => el.id === selectedElementId) || null;

  // Auto-fit zoom on mount or when format changes
  useEffect(() => {
    if (design.format === "printable") {
      setZoom(0.75);
    } else if (design.format === "badge") {
      setZoom(0.85);
    } else {
      setZoom(0.9);
    }
  }, [design.format]);

  // Snap coordinate helper
  const snapVal = useCallback(
    (val: number, gridSize = 10) => {
      if (!isSnapActive) return Math.round(val);
      return Math.round(val / gridSize) * gridSize;
    },
    [isSnapActive]
  );

  // Global Keyboard shortcuts (Delete, Arrow Nudge, Undo/Redo)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        return;
      }

      if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
        if (selectedElement?.type !== "qr") {
          e.preventDefault();
          onDeleteElement(selectedElementId);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo?.();
        } else {
          onUndo?.();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        onRedo?.();
      }

      // Arrow keys nudging
      if (selectedElement && !selectedElement.locked) {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowUp") {
          e.preventDefault();
          onUpdateElement({ y: Math.max(0, selectedElement.y - step) });
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          onUpdateElement({ y: selectedElement.y + step });
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          onUpdateElement({ x: Math.max(0, selectedElement.x - step) });
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          onUpdateElement({ x: selectedElement.x + step });
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, selectedElementId, onDeleteElement, onUndo, onRedo, onUpdateElement]);

  // Start element dragging
  function handleElementMouseDown(e: React.MouseEvent, element: StudioElement) {
    e.stopPropagation();
    if (element.locked) {
      onSelectElement(element.id);
      return;
    }

    onSelectElement(element.id);
    setIsDragging(true);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elX: element.x,
      elY: element.y,
    });
  }

  // Start resizing
  function handleResizeMouseDown(e: React.MouseEvent, handle: ResizeHandle) {
    e.stopPropagation();
    if (!selectedElement || selectedElement.locked) return;

    setResizingHandle(handle);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: selectedElement.x,
      y: selectedElement.y,
      width: selectedElement.width,
      height: selectedElement.height,
    });
  }

  // Mouse Move listener for drag & resize
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDragging && dragStart && selectedElement) {
        const deltaX = (e.clientX - dragStart.mouseX) / zoom;
        const deltaY = (e.clientY - dragStart.mouseY) / zoom;

        const rawX = dragStart.elX + deltaX;
        const rawY = dragStart.elY + deltaY;

        const newX = snapVal(Math.max(0, Math.min(design.width - selectedElement.width, rawX)));
        const newY = snapVal(Math.max(0, Math.min(design.height - selectedElement.height, rawY)));

        onUpdateElement({ x: newX, y: newY });
      } else if (resizingHandle && resizeStart && selectedElement) {
        const deltaX = (e.clientX - resizeStart.mouseX) / zoom;
        const deltaY = (e.clientY - resizeStart.mouseY) / zoom;

        const minW = selectedElement.type === "qr" ? MIN_QR_SIZE : 15;
        const minH = selectedElement.type === "qr" ? MIN_QR_SIZE : 10;

        let newX = resizeStart.x;
        let newY = resizeStart.y;
        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;

        if (resizingHandle.includes("e")) {
          newWidth = Math.max(minW, resizeStart.width + deltaX);
        }
        if (resizingHandle.includes("s")) {
          newHeight = Math.max(minH, resizeStart.height + deltaY);
        }
        if (resizingHandle.includes("w")) {
          const possibleW = resizeStart.width - deltaX;
          if (possibleW >= minW) {
            newWidth = possibleW;
            newX = resizeStart.x + deltaX;
          }
        }
        if (resizingHandle.includes("n")) {
          const possibleH = resizeStart.height - deltaY;
          if (possibleH >= minH) {
            newHeight = possibleH;
            newY = resizeStart.y + deltaY;
          }
        }

        // If QR, maintain square aspect ratio
        if (selectedElement.type === "qr") {
          const squareSize = Math.max(newWidth, newHeight);
          newWidth = squareSize;
          newHeight = squareSize;
        }

        onUpdateElement({
          x: snapVal(newX),
          y: snapVal(newY),
          width: snapVal(newWidth),
          height: snapVal(newHeight),
        });
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
      setDragStart(null);
      setResizingHandle(null);
      setResizeStart(null);
    }

    if (isDragging || resizingHandle) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    dragStart,
    resizingHandle,
    resizeStart,
    selectedElement,
    zoom,
    design.width,
    design.height,
    onUpdateElement,
    snapVal,
  ]);

  // Render individual element content
  function renderElement(el: StudioElement) {
    if (el.hidden) return null;

    switch (el.type) {
      case "text":
        return <TextElement element={el as StudioTextElement} isSelected={selectedElementId === el.id} />;
      case "dynamic_text":
        return (
          <DynamicTextElement
            element={el as StudioDynamicTextElement}
            attendee={activeAttendee}
            isSelected={selectedElementId === el.id}
          />
        );
      case "image":
        return <ImageElement element={el as StudioImageElement} isSelected={selectedElementId === el.id} />;
      case "shape":
        return <ShapeElement element={el as StudioShapeElement} isSelected={selectedElementId === el.id} />;
      case "divider":
        return <DividerElement element={el as StudioDividerElement} isSelected={selectedElementId === el.id} />;
      case "qr":
        return (
          <QRCodeElement
            element={el as StudioQRElement}
            passValue={`https://urpass.space/pass/${activeAttendee.ticketId}`}
            ticketId={activeAttendee.ticketId}
            isSelected={selectedElementId === el.id}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-100 overflow-hidden relative">
      {/* Top Canvas Bar (Format info + Zoom / Snap controls) */}
      <div className="h-10 px-4 bg-white/70 backdrop-blur-xs border-b border-neutral-200/80 flex items-center justify-between text-xs text-neutral-600 select-none z-20">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-neutral-800">
            {design.width} × {design.height} px
          </span>
          <span className="text-neutral-300">|</span>
          <span className="text-neutral-500">
            Previewing: <strong className="text-neutral-800 font-bold">{activeAttendee.name}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Snap-to-Grid Toggle */}
          <button
            type="button"
            onClick={() => setIsSnapActive(!isSnapActive)}
            title="Snap to Grid (10px)"
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
              isSnapActive
                ? "bg-brand/10 text-brand font-semibold"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            <span>Snap {isSnapActive ? "ON" : "OFF"}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              title="Zoom Out"
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold w-12 text-center text-neutral-700">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
              title="Zoom In"
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1.0)}
              title="Actual Size 100%"
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white text-[10px] font-bold"
            >
              1:1
            </button>
          </div>
        </div>
      </div>

      {/* Live WYSIWYG Center Canvas Viewport */}
      <div
        className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[#F3F4F6]"
        onClick={() => onSelectElement(null)}
      >
        <div
          ref={canvasRef}
          className="relative shadow-2xl transition-all duration-75 select-none origin-center"
          style={{
            width: `${design.width}px`,
            height: `${design.height}px`,
            backgroundColor: design.background.color || "#FFFFFF",
            transform: `scale(${zoom})`,
            borderRadius: design.format === "digital" ? "24px" : "12px",
            overflow: "hidden",
            boxShadow:
              "0 20px 50px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* Optional Background Image */}
          {design.background.imageUrl && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.background.imageUrl}
                alt="Canvas Background"
                className="w-full h-full object-cover"
                style={{ opacity: design.background.overlayOpacity || 0.15 }}
              />
            </div>
          )}

          {/* Elements Stack */}
          {design.elements.map((el) => {
            const isSelected = selectedElementId === el.id;

            return (
              <div
                key={el.id}
                onMouseDown={(e) => handleElementMouseDown(e, el)}
                style={{
                  position: "absolute",
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  zIndex: el.zIndex || 1,
                  cursor: el.locked ? "default" : isDragging ? "grabbing" : "move",
                }}
                className={`group/el select-none ${
                  isSelected ? "ring-2 ring-brand ring-offset-1 ring-offset-white" : ""
                }`}
              >
                {renderElement(el)}

                {/* Resize Handles (Only for selected element) */}
                {isSelected && !el.locked && (
                  <>
                    {(["nw", "n", "ne", "e", "se", "s", "sw", "w"] as ResizeHandle[]).map((handle) => {
                      let handleStyle: React.CSSProperties = {};
                      if (handle === "nw") handleStyle = { top: -4, left: -4, cursor: "nwse-resize" };
                      if (handle === "n") handleStyle = { top: -4, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" };
                      if (handle === "ne") handleStyle = { top: -4, right: -4, cursor: "nesw-resize" };
                      if (handle === "e") handleStyle = { top: "50%", right: -4, transform: "translateY(-50%)", cursor: "ew-resize" };
                      if (handle === "se") handleStyle = { bottom: -4, right: -4, cursor: "nwse-resize" };
                      if (handle === "s") handleStyle = { bottom: -4, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" };
                      if (handle === "sw") handleStyle = { bottom: -4, left: -4, cursor: "nesw-resize" };
                      if (handle === "w") handleStyle = { top: "50%", left: -4, transform: "translateY(-50%)", cursor: "ew-resize" };

                      return (
                        <div
                          key={handle}
                          onMouseDown={(e) => handleResizeMouseDown(e, handle)}
                          style={{
                            position: "absolute",
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#635BFF",
                            border: "1.5px solid #FFFFFF",
                            borderRadius: "2px",
                            zIndex: 30,
                            ...handleStyle,
                          }}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
