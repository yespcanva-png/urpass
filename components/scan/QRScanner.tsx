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
      {/* Viewfinder */}
      <div
        className="relative w-full overflow-hidden rounded-lg border border-zinc-800 bg-slate-950 transition-colors duration-300"
        style={{
          aspectRatio: "1",
          maxHeight: "min(70vw, 420px)",
        }}
      >
        <div id={SCANNER_ID} className="w-full h-full [&>video]:object-cover" />

        {/* Starting placeholder */}
        {!started && !cameraError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950/90 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/15 bg-white/10">
              <Camera className="h-6 w-6 text-slate-200" />
            </div>
            <p className="text-xs font-medium text-slate-200">Starting camera</p>
            <p className="max-w-[220px] text-center text-[11px] text-slate-400">Point at the ticket QR code</p>
          </div>
        )}

        {/* Camera error */}
        {cameraError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950/95 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-red-500/30 bg-red-500/15">
              <CameraOff className="h-6 w-6 text-red-400" />
            </div>
            <p className="max-w-[260px] text-xs font-medium leading-relaxed text-slate-200">{cameraError}</p>
            <button
              onClick={() => startScanner()}
              className="mt-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-100 transition-colors hover:bg-zinc-800"
            >
              Retry camera
            </button>
          </div>
        )}

        {/* Scanner overlay — only when started */}
        {started && (
          <>
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: "radial-gradient(ellipse 72% 72% at 50% 50%, transparent 48%, rgba(15,23,42,0.45) 100%)",
              }}
            />

            <span
              className="pointer-events-none absolute left-5 top-5 h-9 w-9 rounded-tl-md transition-all duration-300"
              style={{ borderTop: `3px solid ${bracketColor}`, borderLeft: `3px solid ${bracketColor}` }}
            />
            <span
              className="pointer-events-none absolute right-5 top-5 h-9 w-9 rounded-tr-md transition-all duration-300"
              style={{ borderTop: `3px solid ${bracketColor}`, borderRight: `3px solid ${bracketColor}` }}
            />
            <span
              className="pointer-events-none absolute bottom-5 left-5 h-9 w-9 rounded-bl-md transition-all duration-300"
              style={{ borderBottom: `3px solid ${bracketColor}`, borderLeft: `3px solid ${bracketColor}` }}
            />
            <span
              className="pointer-events-none absolute bottom-5 right-5 h-9 w-9 rounded-br-md transition-all duration-300"
              style={{ borderBottom: `3px solid ${bracketColor}`, borderRight: `3px solid ${bracketColor}` }}
            />

            {/* Scan beam */}
            {active && statusVariant === "idle" && (
              <>
                <span
                  className="absolute left-4 right-4 pointer-events-none animate-[scanBeam_1.8s_ease-in-out_infinite]"
	                  style={{
	                    height: "24px",
	                    transform: "translateY(-50%)",
	                    background: "linear-gradient(to bottom, transparent, rgba(37,99,235,0.12) 50%, transparent)",
	                    borderRadius: "4px",
	                  }}
	                />
                <span
                  className="absolute left-6 right-6 pointer-events-none animate-[scanBeam_1.8s_ease-in-out_infinite]"
	                  style={{
	                    height: "2px",
	                    transform: "translateY(-50%)",
	                    background: "linear-gradient(to right, transparent, #2563EB 50%, transparent)",
	                  }}
	                />
              </>
            )}

            {/* Mobile In-camera Torch Toggle */}
            {torchSupported && (
              <button
                type="button"
                onClick={toggleTorch}
	                className={`absolute bottom-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
	                  torchOn
		                    ? "border-amber-500 bg-amber-950/90 text-amber-300"
	                    : "border-white/20 bg-slate-950/80 text-white hover:bg-slate-800"
	                }`}
                title={torchOn ? "Turn flashlight off" : "Turn flashlight on for low-light scanning"}
                aria-label={torchOn ? "Flashlight on" : "Flashlight off"}
              >
	                {torchOn ? (
	                  <Flashlight className="w-5 h-5 fill-current" />
	                ) : (
	                  <FlashlightOff className="h-5 w-5 text-slate-300" />
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
              active ? "bg-emerald-500" : "bg-zinc-500"
            }`}
          />
          <p className="text-[11px] text-zinc-400 font-medium">
            {active
              ? "Scanner active"
              : statusVariant === "verifying"
              ? "Processing pass..."
              : "Detection paused"}
          </p>
        </div>
      )}
    </div>
  );
}
