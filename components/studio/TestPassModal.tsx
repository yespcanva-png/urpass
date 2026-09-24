"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  QrCode,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
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
  eventId?: string;
  eventName?: string;
}

export default function TestPassModal({
  isOpen,
  onClose,
  design,
  eventId,
  eventName = "URPASS TECH SUMMIT 2026",
}: Props) {
  const [selectedAttendee, setSelectedAttendee] = useState<DummyAttendee>(
    DUMMY_ATTENDEES[0]
  );
  const [testPassToken] = useState<string>(
    () => `TEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  );
  const [copied, setCopied] = useState(false);
  const [simulatedScanResult, setSimulatedScanResult] = useState<string | null>(null);

  if (!isOpen) return null;

  function renderElement(el: StudioDesign["elements"][0]) {
    if (el.hidden) return null;
    switch (el.type) {
      case "text":
        return <TextElement element={el} />;
      case "dynamic_text":
        return <DynamicTextElement element={el} attendee={selectedAttendee} />;
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
            passValue={`https://urpass.space/pass/${testPassToken}`}
            ticketId={selectedAttendee.ticketId}
          />
        );
      default:
        return null;
    }
  }

  function handleSimulateScan() {
    setSimulatedScanResult(
      `✓ PASS VERIFIED · ${selectedAttendee.name} (${selectedAttendee.ticketCategory}) · Gate 1 Turnstile Access Approved`
    );
  }

  function handleCopyPassUrl() {
    const url = `https://urpass.space/pass/${testPassToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Generate Test Pass
              </h3>
              <p className="text-xs text-neutral-500">
                Simulate what an attendee receives on their smartphone or paper ticket.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50">
          {/* Left: Test Pass Preview Box */}
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80"
              style={{
                width: "280px",
                height: `${Math.round(280 * (design.height / design.width))}px`,
                backgroundColor: design.background.color || "#FFFFFF",
              }}
            >
              <div
                className="origin-top-left"
                style={{
                  transform: `scale(${280 / design.width})`,
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

            <span className="text-[11px] font-mono text-neutral-400 mt-3">
              Token: {testPassToken} (Simulated)
            </span>
          </div>

          {/* Right: Attendee Switcher & Verification Sandbox */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                Select Dummy Attendee Profile
              </label>
              <div className="space-y-2">
                {DUMMY_ATTENDEES.map((att) => {
                  const isSelected = selectedAttendee.id === att.id;
                  return (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => {
                        setSelectedAttendee(att);
                        setSimulatedScanResult(null);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all text-xs ${
                        isSelected
                          ? "border-brand bg-brand/5 font-semibold text-brand shadow-2xs"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{att.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                          {att.ticketCategory}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {att.company} · {att.seat}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Gate Scan Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Simulate Gate QR Scan</span>
              </button>

              {simulatedScanResult && (
                <div className="mt-2.5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{simulatedScanResult}</span>
                </div>
              )}
            </div>

            {/* Copy Test URL */}
            <div className="pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={handleCopyPassUrl}
                className="w-full py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "Link Copied!" : "Copy Test Pass URL"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-100 bg-white flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand text-white font-bold text-xs hover:bg-brand/90 transition-colors"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
}
