"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import type { StudioQRElement } from "@/lib/studio/types";
import { MIN_QR_SIZE } from "@/lib/studio/types";
import { getContrastRatio } from "@/lib/studio/resolver";
import { AlertTriangle } from "lucide-react";

interface Props {
  element: StudioQRElement;
  passValue?: string;
  ticketId?: string;
  isSelected?: boolean;
}

export default function QRCodeElement({
  element,
  passValue = "https://urpass.space/pass/TEST-10284",
  ticketId = "#URP-10284",
}: Props) {
  const contrast = getContrastRatio(element.fgColor || "#000000", element.bgColor || "#FFFFFF");
  const isTooSmall = element.width < MIN_QR_SIZE || element.height < MIN_QR_SIZE;
  const isPoorContrast = contrast < 4.5;
  const hasSafetyIssue = isTooSmall || isPoorContrast;

  // The actual QR code dimension inside the padding
  const qrInnerSize = Math.max(80, Math.min(element.width, element.height) - (element.showScanLabel ? 42 : 24));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: element.bgColor || "#FFFFFF",
        borderRadius: element.cornerRadius ? `${element.cornerRadius}px` : "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px",
        boxSizing: "border-box",
        position: "relative",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* QR Code Graphic */}
      <div className="flex items-center justify-center">
        <QRCodeSVG
          value={passValue}
          size={qrInnerSize}
          level="M"
          bgColor={element.bgColor || "#FFFFFF"}
          fgColor={element.fgColor || "#000000"}
          style={{ display: "block" }}
        />
      </div>

      {/* Optional Scan Instruction Label */}
      {element.showScanLabel && (
        <span
          className="mt-1.5 text-[9px] font-black tracking-widest uppercase text-center"
          style={{ color: element.fgColor || "#000000", opacity: 0.8 }}
        >
          {element.scanLabelText || "SCAN FOR ENTRY"}
        </span>
      )}

      {/* Optional Attendee ID Label */}
      {element.showAttendeeId && (
        <span
          className="text-[9px] font-mono font-bold tracking-wider text-center"
          style={{ color: element.fgColor || "#000000", opacity: 0.6 }}
        >
          {ticketId}
        </span>
      )}

      {/* Visual Safety Warning Badge (Editor Canvas Only) */}
      {hasSafetyIssue && (
        <div
          className="absolute -top-3 -right-3 z-30 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-none"
          title={isTooSmall ? `QR is too small (<${MIN_QR_SIZE}px)` : `Low contrast (${contrast.toFixed(1)}:1)`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>QR Alert</span>
        </div>
      )}
    </div>
  );
}
