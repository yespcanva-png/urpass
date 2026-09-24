"use client";

import React, { useState } from "react";
import {
  X,
  Smartphone,
  Printer,
  Maximize2,
  Users,
  Download,
  Scissors,
} from "lucide-react";
import type { StudioDesign } from "@/lib/studio/types";
import { DUMMY_ATTENDEES, type DummyAttendee } from "@/lib/studio/dummy-attendees";
import TextElement from "./elements/TextElement";
import DynamicTextElement from "./elements/DynamicTextElement";
import ImageElement from "./elements/ImageElement";
import ShapeElement from "./elements/ShapeElement";
import DividerElement from "./elements/DividerElement";
import QRCodeElement from "./elements/QRCodeElement";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  design: StudioDesign;
  activeAttendee: DummyAttendee;
  onSelectAttendee: (attendee: DummyAttendee) => void;
}

type DeviceMode = "mobile" | "print" | "actual";

export default function PreviewModal({
  isOpen,
  onClose,
  design,
  activeAttendee,
  onSelectAttendee,
}: Props) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("mobile");

  if (!isOpen) return null;

  function renderElement(el: StudioDesign["elements"][0]) {
    if (el.hidden) return null;
    switch (el.type) {
      case "text":
        return <TextElement element={el} />;
      case "dynamic_text":
        return <DynamicTextElement element={el} attendee={activeAttendee} />;
      case "image":
        return <ImageElement element={el} />;
      case "shape":
        return <ShapeElement element={el} />;
      case "divider":
        return <DividerElement element={el} />;
      case "qr":
        return (
          <QRCodeElement
            element={el}
            passValue={`https://urpass.space/pass/${activeAttendee.ticketId}`}
            ticketId={activeAttendee.ticketId}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Header Controls */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Device Mode Switcher */}
            <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDeviceMode("mobile")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === "mobile"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode("print")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === "print"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / A4</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode("actual")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === "actual"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Actual Size</span>
              </button>
            </div>

            {/* Attendee Preview Switcher (With Long-Name Stress Test) */}
            <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-xl text-xs">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-400 font-medium hidden sm:inline">Preview as:</span>
              <select
                value={activeAttendee.id}
                onChange={(e) => {
                  const matched = DUMMY_ATTENDEES.find((a) => a.id === e.target.value);
                  if (matched) onSelectAttendee(matched);
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                {DUMMY_ATTENDEES.map((att) => (
                  <option key={att.id} value={att.id} className="bg-neutral-900 text-white">
                    {att.name} ({att.ticketCategory})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[#0C0D10]">
          {/* 1. Mobile Phone Mockup Frame */}
          {deviceMode === "mobile" && (
            <div className="relative mx-auto border-4 border-neutral-700 rounded-[44px] p-3 bg-neutral-950 shadow-2xl max-w-[340px]">
              {/* Phone Notch */}
              <div className="w-28 h-4 bg-neutral-800 rounded-full mx-auto mb-3" />

              {/* Pass Card Container */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-lg"
                style={{
                  width: "290px",
                  height: "520px",
                  backgroundColor: design.background.color || "#FFFFFF",
                }}
              >
                <div
                  className="origin-top-left"
                  style={{
                    transform: `scale(${290 / design.width})`,
                    width: `${design.width}px`,
                    height: `${design.height}px`,
                    position: "relative",
                  }}
                >
                  {design.elements.map((el) => (
                    <div
                      key={el.id}
                      style={{
                        position: "absolute",
                        left: `${el.x}px`,
                        top: `${el.y}px`,
                        width: `${el.width}px`,
                        height: `${el.height}px`,
                        zIndex: el.zIndex || 1,
                      }}
                    >
                      {renderElement(el)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="w-28 h-1 bg-neutral-700 rounded-full mx-auto mt-4" />
            </div>
          )}

          {/* 2. Print / A4 Sheet Frame */}
          {deviceMode === "print" && (
            <div className="relative bg-white text-neutral-900 rounded-lg p-8 shadow-2xl max-w-2xl w-full border border-neutral-200">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6 text-xs text-neutral-500">
                <span className="font-mono">URPASS PRINT PASS · A4 SHEET</span>
                <span className="flex items-center gap-1 font-semibold">
                  <Scissors className="w-3.5 h-3.5" /> Cut along dashed border
                </span>
              </div>

              {/* Ticket Container */}
              <div className="flex justify-center">
                <div
                  className="relative rounded-xl overflow-hidden border-2 border-dashed border-neutral-300"
                  style={{
                    width: `${Math.min(560, design.width)}px`,
                    height: `${Math.min(560, design.width) * (design.height / design.width)}px`,
                    backgroundColor: design.background.color || "#FFFFFF",
                  }}
                >
                  <div
                    className="origin-top-left"
                    style={{
                      transform: `scale(${Math.min(560, design.width) / design.width})`,
                      width: `${design.width}px`,
                      height: `${design.height}px`,
                      position: "relative",
                    }}
                  >
                    {design.elements.map((el) => (
                      <div
                        key={el.id}
                        style={{
                          position: "absolute",
                          left: `${el.x}px`,
                          top: `${el.y}px`,
                          width: `${el.width}px`,
                          height: `${el.height}px`,
                          zIndex: el.zIndex || 1,
                        }}
                      >
                        {renderElement(el)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-center text-[10px] text-neutral-400 mt-6 font-mono">
                Present this physical ticket at gate entrance. QR code will be scanned for turnstile validation.
              </p>
            </div>
          )}

          {/* 3. Actual 1:1 Size */}
          {deviceMode === "actual" && (
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl select-none"
              style={{
                width: `${design.width}px`,
                height: `${design.height}px`,
                backgroundColor: design.background.color || "#FFFFFF",
              }}
            >
              {design.elements.map((el) => (
                <div
                  key={el.id}
                  style={{
                    position: "absolute",
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    zIndex: el.zIndex || 1,
                  }}
                >
                  {renderElement(el)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
