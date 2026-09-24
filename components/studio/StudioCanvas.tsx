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
  onDuplicateElement?: (id: string) => void;
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
  onDuplicateElement,
  onUndo,
  onRedo,
  activeAttendee = DUMMY_ATTENDEES[0],
  snapToGrid = true,
}: Props) {
  const [zoom, setZoom] = useState<number>(0.85);
  const [isSnapActive, setIsSnapActive] = useState(snapToGrid);

  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasDraggedRef = useRef(false);
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

  // Fit to screen calculation
  const handleFitToScreen = useCallback(() => {
    if (!viewportRef.current) return;
    const paddingX = 96;
    const paddingY = 96;
    const availableWidth = viewportRef.current.clientWidth - paddingX;
    const availableHeight = viewportRef.current.clientHeight - paddingY;
    if (availableWidth > 0 && availableHeight > 0) {
      const scaleX = availableWidth / design.width;
      const scaleY = availableHeight / design.height;
      const bestFit = Math.min(scaleX, scaleY, 1.25);
      setZoom(Number(Math.max(0.35, Math.min(1.5, bestFit)).toFixed(2)));
    }
  }, [design.width, design.height]);

  // Auto-fit zoom on mount or when format changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitToScreen();
    }, 60);
    return () => clearTimeout(timer);
  }, [design.format, handleFitToScreen]);

  // Snap coordinate helper
  const snapVal = useCallback(
    (val: number, gridSize = 10) => {
      if (!isSnapActive) return Math.round(val);
      return Math.round(val / gridSize) * gridSize;
    },
    [isSnapActive]
  );

  // Global Keyboard shortcuts (Delete, Arrow Nudge, Undo/Redo, Duplicate, Deselect)
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

      // Duplicate element shortcut: Cmd+D / Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d" && selectedElementId) {
        e.preventDefault();
        onDuplicateElement?.(selectedElementId);
      }

      // Deselect shortcut: Escape
      if (e.key === "Escape") {
        e.preventDefault();
        onSelectElement(null);
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
  }, [selectedElement, selectedElementId, onDeleteElement, onDuplicateElement, onSelectElement, onUndo, onRedo, onUpdateElement]);

  // Start element dragging
  function handleElementMouseDown(e: React.MouseEvent, element: StudioElement) {
    e.stopPropagation();
    hasDraggedRef.current = false;
    onSelectElement(element.id);
    if (element.locked) {
      return;
    }

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
    hasDraggedRef.current = false;
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

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          hasDraggedRef.current = true;
        }

        const rawX = dragStart.elX + deltaX;
        const rawY = dragStart.elY + deltaY;

        const maxX = Math.max(0, design.width - selectedElement.width);
        const maxY = Math.max(0, design.height - selectedElement.height);

        const newX = snapVal(Math.max(0, Math.min(maxX, rawX)));
        const newY = snapVal(Math.max(0, Math.min(maxY, rawY)));

        onUpdateElement({ x: newX, y: newY });
      } else if (resizingHandle && resizeStart && selectedElement) {
        const deltaX = (e.clientX - resizeStart.mouseX) / zoom;
        const deltaY = (e.clientY - resizeStart.mouseY) / zoom;

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          hasDraggedRef.current = true;
        }

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
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 120);
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

        <div className="flex items-center gap-2.5">
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
          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/60">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              title="Zoom Out"
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold w-11 text-center text-neutral-700">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
              title="Zoom In"
              className="p-1 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFitToScreen}
              title="Fit to Screen"
              className="px-1.5 py-0.5 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white text-[10px] font-bold flex items-center gap-0.5 transition-colors"
            >
              <Maximize2 className="w-2.5 h-2.5" />
              <span>Fit</span>
            </button>
            <button
              type="button"
              onClick={() => setZoom(1.0)}
              title="Actual Size 100%"
              className="px-1.5 py-0.5 rounded text-neutral-600 hover:text-neutral-900 hover:bg-white text-[10px] font-bold transition-colors"
            >
              1:1
            </button>
          </div>
        </div>
      </div>

      {/* Live WYSIWYG Center Canvas Viewport */}
      <div
        ref={viewportRef}
        className="flex-1 overflow-auto p-6 md:p-10 bg-[#F8F9FA] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
        onClick={() => {
          if (hasDraggedRef.current) return;
          onSelectElement(null);
        }}
      >
        <div
          className="m-auto flex items-center justify-center p-6"
          style={{
            minWidth: `${Math.ceil(design.width * zoom) + 48}px`,
            minHeight: "100%",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (hasDraggedRef.current) return;
              onSelectElement(null);
            }
          }}
        >
          <div
            ref={canvasRef}
            className="relative shadow-2xl transition-transform duration-75 select-none shrink-0"
            onClick={(e) => {
              if (hasDraggedRef.current) return;
              e.stopPropagation();
              onSelectElement(null);
            }}
            style={{
              width: `${design.width}px`,
              height: `${design.height}px`,
              backgroundColor: design.background.color || "#FFFFFF",
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              borderRadius: design.format === "digital" ? "24px" : "12px",
              overflow: "hidden",
              boxShadow:
                "0 25px 60px -15px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Format Realism Decoration: Lanyard hole slot for Event Badge */}
            {design.format === "badge" && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-full bg-neutral-200/90 border border-neutral-300 shadow-inner z-20 pointer-events-none" />
            )}

            {/* Format Realism Decoration: Tear-off stub perforation line for Printable Ticket */}
            {design.format === "printable" && (
              <div
                className="absolute top-0 bottom-0 pointer-events-none z-10 flex flex-col justify-between"
                style={{ left: `${Math.round(design.width * 0.72)}px` }}
              >
                <div className="w-5 h-5 rounded-full bg-[#F8F9FA] -translate-x-1/2 -translate-y-1/2 border border-neutral-300/80 shadow-xs" />
                <div className="flex-1 w-px border-r-2 border-dashed border-neutral-300/80 mx-auto" />
                <div className="w-5 h-5 rounded-full bg-[#F8F9FA] -translate-x-1/2 translate-y-1/2 border border-neutral-300/80 shadow-xs" />
              </div>
            )}

            {/* Format Realism Decoration: Mobile speaker notch for Digital Pass */}
            {design.format === "digital" && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-neutral-300/70 z-20 pointer-events-none" />
            )}

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
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(el.id);
                }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
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
    </div>
  );
}
