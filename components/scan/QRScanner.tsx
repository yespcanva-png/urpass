"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff, Flashlight, FlashlightOff } from "lucide-react";

interface Props {
  onScan: (token: string) => void;
  active: boolean;
  statusVariant?: "idle" | "verifying" | "success" | "duplicate" | "error" | "access_denied" | "scanning";
}

const SCANNER_ID = "urpass-qr-scanner";

export default function QRScanner({ onScan, active, statusVariant = "idle" }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [started, setStarted] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const mountedRef = useRef(true);
  const activeRef = useRef(active);

  // Keep activeRef in sync without restarting the camera hardware
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  async function startScanner() {
    try {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.getState() === 2) {
            await scannerRef.current.stop();
          }
        } catch {}
        scannerRef.current.clear();
      }

      const scanner = new Html5Qrcode(SCANNER_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      });
      scannerRef.current = scanner;

      // Request ideal 720p constraints: lowers CPU decode overhead by ~75% vs 4K/1080p, boosting decode speeds to sub-15ms
      const cameraConstraints: MediaTrackConstraints = {
        facingMode: "environment",
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
      };

      await scanner.start(
        cameraConstraints,
        {
          fps: 30,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            return {
              width: Math.floor(minEdge * 0.92),
              height: Math.floor(minEdge * 0.92),
            };
          },
          aspectRatio: 1.0,
          videoConstraints: cameraConstraints,
        },
        (decodedText) => {
          if (mountedRef.current && activeRef.current) {
            onScan(decodedText);
          }
        },
        () => {}
      );

      // Attempt to apply continuous auto-focus and detect torch capability
      try {
        const videoEl = document.getElementById(SCANNER_ID)?.querySelector("video") as HTMLVideoElement | null;
        const stream = videoEl?.srcObject as MediaStream | null;
        const videoTrack = stream?.getVideoTracks?.()[0];
        if (videoTrack && typeof videoTrack.getCapabilities === "function") {
          const capabilities = videoTrack.getCapabilities() as any;
          if (capabilities && "torch" in capabilities) {
            setTorchSupported(Boolean(capabilities.torch));
          }
          if (capabilities?.focusMode?.includes("continuous")) {
            await videoTrack.applyConstraints({
              advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet],
            });
          }
        }
      } catch {}

      if (mountedRef.current) {
        setCameraError("");
        setStarted(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (mountedRef.current) {
        setCameraError(
          msg.includes("permission") || msg.includes("NotAllowedError")
            ? "Camera permission denied. Allow camera access and refresh."
            : "Could not initialize high-speed camera stream."
        );
        setStarted(false);
      }
    }
  }

  async function toggleTorch() {
    try {
      const videoEl = document.getElementById(SCANNER_ID)?.querySelector("video") as HTMLVideoElement | null;
      const stream = videoEl?.srcObject as MediaStream | null;
      const videoTrack = stream?.getVideoTracks?.()[0];
      if (!videoTrack) return;

      const nextTorch = !torchOn;
      // @ts-ignore
      await videoTrack.applyConstraints({
        advanced: [{ torch: nextTorch } as any],
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn("Failed to toggle torch:", err);
    }
  }

  async function stopScanner() {
    if (!scannerRef.current) return;
    try {
      if ((await scannerRef.current.getState()) === 2) {
        await scannerRef.current.stop();
      }
      scannerRef.current.clear();
    } catch {}
    scannerRef.current = null;
    if (mountedRef.current) {
      setStarted(false);
      setTorchOn(false);
      setTorchSupported(false);
    }
  }

  // Mount once and keep stream alive until full unmount
  useEffect(() => {
    mountedRef.current = true;
    const timer = setTimeout(() => {
      startScanner();
    }, 0);

    return () => {
      clearTimeout(timer);
      mountedRef.current = false;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine status accent without neon effects.
  let bracketColor = "#334155";

  if (statusVariant === "success") {
    bracketColor = "#047857";
  } else if (statusVariant === "duplicate") {
    bracketColor = "#B45309";
  } else if (statusVariant === "error" || statusVariant === "access_denied") {
    bracketColor = "#B91C1C";
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Viewfinder — Optimized for mobile screen width and handheld ergonomics */}
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-lg transition-all duration-300"
        style={{
          aspectRatio: "1",
          maxHeight: "min(70vw, 420px)",
        }}
      >
        <div id={SCANNER_ID} className="w-full h-full [&>video]:object-cover" />

        {/* Starting placeholder */}
        {!started && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/85 backdrop-blur-xs z-10 p-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-inner">
              <Camera className="w-7 h-7 text-slate-200 animate-pulse" />
            </div>
            <p className="text-xs text-slate-200 font-medium tracking-wide">Starting high-speed camera…</p>
            <p className="text-[11px] text-slate-400 text-center max-w-[220px]">Point at ticket QR code</p>
          </div>
        )}

        {/* Camera error */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center bg-slate-950/95 z-10">
            <div className="w-13 h-13 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <CameraOff className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-xs text-slate-200 leading-relaxed max-w-[260px] font-medium">{cameraError}</p>
            <button
              onClick={() => startScanner()}
              className="mt-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
            >
              Retry Camera Access
            </button>
          </div>
        )}

        {/* Scanner overlay — only when started */}
        {started && (
          <>
            {/* Darkened vignette around target zone */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 45%, rgba(15,23,42,0.55) 100%)",
              }}
            />

            {/* High-visibility corner brackets */}
            <span
              className="absolute top-4 left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-tl-xl pointer-events-none transition-all duration-300 shadow-xs"
              style={{ borderTop: `3.5px solid ${bracketColor}`, borderLeft: `3.5px solid ${bracketColor}` }}
            />
            <span
              className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-tr-xl pointer-events-none transition-all duration-300 shadow-xs"
              style={{ borderTop: `3.5px solid ${bracketColor}`, borderRight: `3.5px solid ${bracketColor}` }}
            />
            <span
              className="absolute bottom-4 left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-bl-xl pointer-events-none transition-all duration-300 shadow-xs"
              style={{ borderBottom: `3.5px solid ${bracketColor}`, borderLeft: `3.5px solid ${bracketColor}` }}
            />
            <span
              className="absolute bottom-4 right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-br-xl pointer-events-none transition-all duration-300 shadow-xs"
              style={{ borderBottom: `3.5px solid ${bracketColor}`, borderRight: `3.5px solid ${bracketColor}` }}
            />

            {/* Scan beam */}
            {active && statusVariant === "idle" && (
              <>
                <span
                  className="absolute left-4 right-4 pointer-events-none animate-[scanBeam_1.8s_ease-in-out_infinite]"
                  style={{
                    height: "24px",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(to bottom, transparent, rgba(56,189,248,0.15) 50%, transparent)",
                    borderRadius: "4px",
                  }}
                />
                <span
                  className="absolute left-6 right-6 pointer-events-none animate-[scanBeam_1.8s_ease-in-out_infinite]"
                  style={{
                    height: "2px",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(to right, transparent, #38BDF8 50%, transparent)",
                  }}
                />
              </>
            )}

            {/* Mobile In-camera Torch Toggle */}
            {torchSupported && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`absolute bottom-3 right-3 z-20 flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 shadow-md ${
                  torchOn
                    ? "bg-amber-400 text-amber-950 border border-amber-300 shadow-amber-500/20"
                    : "bg-slate-900/80 backdrop-blur-md text-white border border-white/20 hover:bg-slate-800"
                }`}
                title={torchOn ? "Turn flashlight off" : "Turn flashlight on for low-light scanning"}
                aria-label={torchOn ? "Flashlight on" : "Flashlight off"}
              >
                {torchOn ? (
                  <Flashlight className="w-5 h-5 fill-current" />
                ) : (
                  <FlashlightOff className="w-5 h-5 text-slate-300" />
                )}
              </button>
            )}
          </>
        )}
      </div>

      {/* Status indicator */}
      {started && (
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              active ? "bg-emerald-600" : "bg-slate-500"
            }`}
          />
          <p className="text-[11px] text-slate-600 font-medium">
            {active ? "Scanner active" : "Processing pass..."}
          </p>
        </div>
      )}
    </div>
  );
}
