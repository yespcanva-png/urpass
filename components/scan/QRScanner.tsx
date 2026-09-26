"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff } from "lucide-react";

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

      // Attempt to apply continuous auto-focus if supported by the active camera track
      try {
        const videoEl = document.getElementById(SCANNER_ID)?.querySelector("video") as HTMLVideoElement | null;
        const stream = videoEl?.srcObject as MediaStream | null;
        const videoTrack = stream?.getVideoTracks?.()[0];
        if (videoTrack && typeof videoTrack.getCapabilities === "function") {
          const capabilities = videoTrack.getCapabilities() as { focusMode?: string[] };
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

  async function stopScanner() {
    if (!scannerRef.current) return;
    try {
      if ((await scannerRef.current.getState()) === 2) {
        await scannerRef.current.stop();
      }
      scannerRef.current.clear();
    } catch {}
    scannerRef.current = null;
    if (mountedRef.current) setStarted(false);
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

  // Determine glow style based on statusVariant
  let borderGlow = "rgba(109,40,217,0.2)";
  let boxGlow = "rgba(109,40,217,0.08)";
  let bracketColor = "#7C3AED";

  if (statusVariant === "success") {
    borderGlow = "rgba(16,185,129,0.6)";
    boxGlow = "rgba(16,185,129,0.25)";
    bracketColor = "#10B981";
  } else if (statusVariant === "duplicate") {
    borderGlow = "rgba(245,158,11,0.6)";
    boxGlow = "rgba(245,158,11,0.25)";
    bracketColor = "#F59E0B";
  } else if (statusVariant === "error" || statusVariant === "access_denied") {
    borderGlow = "rgba(239,68,68,0.6)";
    boxGlow = "rgba(239,68,68,0.25)";
    bracketColor = "#EF4444";
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Viewfinder */}
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-neutral-900 transition-all duration-300"
        style={{
          aspectRatio: "1",
          boxShadow: started
            ? `0 0 0 2px ${borderGlow}, 0 0 45px ${boxGlow}`
            : undefined,
        }}
      >
        <div id={SCANNER_ID} className="w-full h-full" />

        {/* Starting placeholder */}
        {!started && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950/80 backdrop-blur-sm z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
              <Camera className="w-6 h-6 text-brand" />
            </div>
            <p className="text-xs text-neutral-400 font-medium">Initializing camera…</p>
          </div>
        )}

        {/* Camera error */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center bg-neutral-950/90 z-10">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <CameraOff className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">{cameraError}</p>
            <button
              onClick={() => startScanner()}
              className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Retry Camera
            </button>
          </div>
        )}

        {/* Scanner overlay — only when started */}
        {started && (
          <>
            {/* Vignette — dims edges to focus on center */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)",
              }}
            />

            {/* Corner brackets */}
            <span
              className="absolute top-5 left-5 w-10 h-10 rounded-tl-xl pointer-events-none transition-all duration-300"
              style={{ borderTop: `3px solid ${bracketColor}`, borderLeft: `3px solid ${bracketColor}`, filter: `drop-shadow(0 0 6px ${bracketColor})` }}
            />
            <span
              className="absolute top-5 right-5 w-10 h-10 rounded-tr-xl pointer-events-none transition-all duration-300"
              style={{ borderTop: `3px solid ${bracketColor}`, borderRight: `3px solid ${bracketColor}`, filter: `drop-shadow(0 0 6px ${bracketColor})` }}
            />
            <span
              className="absolute bottom-5 left-5 w-10 h-10 rounded-bl-xl pointer-events-none transition-all duration-300"
              style={{ borderBottom: `3px solid ${bracketColor}`, borderLeft: `3px solid ${bracketColor}`, filter: `drop-shadow(0 0 6px ${bracketColor})` }}
            />
            <span
              className="absolute bottom-5 right-5 w-10 h-10 rounded-br-xl pointer-events-none transition-all duration-300"
              style={{ borderBottom: `3px solid ${bracketColor}`, borderRight: `3px solid ${bracketColor}`, filter: `drop-shadow(0 0 6px ${bracketColor})` }}
            />

            {/* Scan beam — only animated when active */}
            {active && statusVariant === "idle" && (
              <>
                <span
                  className="absolute left-6 right-6 pointer-events-none animate-[scanBeam_1.8s_ease-in-out_infinite]"
                  style={{
                    height: "28px",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(to bottom, transparent, rgba(124,58,237,0.2) 50%, transparent)",
                    borderRadius: "99px",
                  }}
                />
                <span
                  className="absolute left-10 right-10 pointer-events-none animate-[scanBeam_1.8s_ease-in-out_infinite]"
                  style={{
                    height: "2px",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(to right, transparent, #A78BFA 20%, #7C3AED 50%, #A78BFA 80%, transparent)",
                    boxShadow: "0 0 8px 2px rgba(124,58,237,0.8), 0 0 16px 4px rgba(124,58,237,0.4)",
                  }}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Status indicator */}
      {started && (
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              active ? "bg-emerald-400 animate-pulse" : "bg-brand animate-ping"
            }`}
          />
          <p className="text-[11px] text-white/60 font-medium">
            {active ? "High-Speed Scanner Active" : "Processing Pass…"}
          </p>
        </div>
      )}
    </div>
  );
}
