"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Maximize2, X, Sun, Sparkles } from "lucide-react";
import { createWakeLockController } from "@/lib/wake-lock";

interface Props {
  value: string;
  size?: number;
  showGateTip?: boolean;
}

export default function PassQR({ value, size = 180, showGateTip = true }: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const wakeLock = createWakeLockController();
    void wakeLock.request();
    return () => {
      void wakeLock.release();
    };
  }, [fullscreen]);

  return (
    <>
      <div
        onClick={() => setFullscreen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setFullscreen(true);
        }}
        className="group relative bg-white p-4 rounded-2xl inline-block shadow-sm border border-neutral-100 cursor-pointer transition-all hover:shadow-md hover:border-neutral-200 text-center"
        title="Tap to enlarge for gate scan"
      >
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          bgColor="#ffffff"
          fgColor="#0a0a0a"
          style={{ display: "block", margin: "0 auto" }}
        />

        <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/5 rounded-2xl flex items-center justify-center transition-colors pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/80 text-white text-[10px] font-medium px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 shadow-sm">
            <Maximize2 className="w-3 h-3" /> Enlarge
          </span>
        </div>

        {showGateTip && (
          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-medium select-none">
            <Sun className="w-3 h-3 text-amber-500 shrink-0" />
            <span>High brightness for fast scan</span>
          </div>
        )}
      </div>

      {/* Fullscreen Gate Scan Modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 backdrop-blur-sm transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-xs w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gate Entry Ready</span>
            </div>

            <div className="p-2 bg-white rounded-2xl">
              <QRCodeSVG
                value={value}
                size={240}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
                style={{ display: "block" }}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-neutral-800">
                Present this QR code to the entrance scanner
              </p>
              <p className="text-[11px] text-neutral-400">
                Screen is kept awake for fast gate check-in
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
