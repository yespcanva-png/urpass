"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff, Flashlight, FlashlightOff } from "lucide-react";
import type { ScannerState } from "@/lib/scanner-state";

interface Props {
  onScan: (token: string) => void;
  active: boolean;
  statusVariant?: ScannerState;
  torchOn?: boolean;
  onTorchChange?: (on: boolean) => void;
  onTorchSupportedChange?: (supported: boolean) => void;
  facingMode?: "environment" | "user";
  onFacingModeChange?: (mode: "environment" | "user") => void;
  onMultipleCamerasDetected?: (hasMultiple: boolean) => void;
  className?: string;
}

const SCANNER_ID = "urpass-qr-scanner";

export default function QRScanner({
  onScan,
  active,
  statusVariant = "READY",
  torchOn: externalTorchOn,
  onTorchChange,
  onTorchSupportedChange,
  facingMode = "environment",
  onFacingModeChange,
  onMultipleCamerasDetected,
  className = "",
}: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [started, setStarted] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const mountedRef = useRef(true);
  const activeRef = useRef(active);
  const onScanRef = useRef(onScan);
  const statusVariantRef = useRef(statusVariant);
  const currentFacingRef = useRef(facingMode);

  // Keep activeRef in sync without restarting the camera hardware
  useEffect(() => {
    activeRef.current = active;
    onScanRef.current = onScan;
    statusVariantRef.current = statusVariant;
  }, [active, onScan, statusVariant]);

  async function startScanner(targetFacing: "environment" | "user" = facingMode) {
    try {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.getState() === 2) {
            await scannerRef.current.stop();
          }
        } catch {}
        try {
          scannerRef.current.clear();
        } catch {}
      }

      const scanner = new Html5Qrcode(SCANNER_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      });
      scannerRef.current = scanner;

      const handleScanSuccess = (decodedText: string) => {
        if (mountedRef.current && activeRef.current && statusVariantRef.current === "READY") {
          onScanRef.current(decodedText.trim());
        }
      };

      // html5-qrcode strictly requires cameraIdOrConfig to have exactly 1 key when passed as an object
      const cameraFacingConstraint = { facingMode: targetFacing };

      const primaryConfig = {
        fps: 20,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const size = Math.max(50, Math.floor(minEdge * 0.92));
          return {
            width: size,
            height: size,
          };
        },
        videoConstraints: {
          facingMode: targetFacing,
        },
      };

      // Multi-tier camera start for rock-solid mobile compatibility
      try {
        await scanner.start(
          cameraFacingConstraint,
          primaryConfig,
          handleScanSuccess,
          () => {}
        );
      } catch (primaryErr) {
        console.warn("Primary camera stream config failed, trying basic fallback:", primaryErr);
        try {
          // Fallback 1: basic facingMode without resolution/aspectRatio constraints
          await scanner.start(
            cameraFacingConstraint,
            { fps: 20 },
            handleScanSuccess,
            () => {}
          );
        } catch (facingErr) {
          console.warn("FacingMode fallback failed, attempting camera device enumeration:", facingErr);
          // Fallback 2: enumerate physical cameras and pass specific deviceId
          if (typeof Html5Qrcode.getCameras === "function") {
            const cameras = await Html5Qrcode.getCameras();
            if (cameras && cameras.length > 0) {
              const chosenCamera =
                targetFacing === "environment"
                  ? cameras.find((c) => /back|rear|environment/i.test(c.label)) || cameras[cameras.length - 1]
                  : cameras.find((c) => /front|user/i.test(c.label)) || cameras[0];

              await scanner.start(
                chosenCamera.id,
                { fps: 20 },
                handleScanSuccess,
                () => {}
              );
            } else {
              throw facingErr;
            }
          } else {
            throw facingErr;
          }
        }
      }

      // Attempt to apply continuous auto-focus, lock playsinline for iOS, and detect torch capability
      try {
        const videoEl = document.getElementById(SCANNER_ID)?.querySelector("video") as HTMLVideoElement | null;
        if (videoEl) {
          videoEl.setAttribute("playsinline", "true");
          videoEl.setAttribute("webkit-playsinline", "true");
          videoEl.setAttribute("muted", "true");
          videoEl.muted = true;
        }
        const stream = videoEl?.srcObject as MediaStream | null;
        const videoTrack = stream?.getVideoTracks?.()[0];
        if (videoTrack && typeof videoTrack.getCapabilities === "function") {
          const capabilities = videoTrack.getCapabilities() as any;
          if (capabilities && "torch" in capabilities) {
            const supported = Boolean(capabilities.torch);
            setTorchSupported(supported);
            onTorchSupportedChange?.(supported);
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
          msg.includes("permission") || msg.includes("NotAllowedError") || msg.includes("PermissionDeniedError")
            ? "Camera permission denied. Allow camera access and refresh."
            : msg.includes("secure context") || msg.includes("HTTPS") || msg.includes("mediaDevices")
            ? "Camera access requires HTTPS or a supported mobile browser."
            : msg.includes("NotFound") || msg.includes("DevicesNotFoundError")
            ? "No camera found on this device."
            : "Could not initialize camera stream. Tap retry below."
        );
        setStarted(false);
      }
    }
  }

  async function applyTorch(targetTorch: boolean) {
    try {
      const videoEl = document.getElementById(SCANNER_ID)?.querySelector("video") as HTMLVideoElement | null;
      const stream = videoEl?.srcObject as MediaStream | null;
      const videoTrack = stream?.getVideoTracks?.()[0];
      if (!videoTrack) return;

      // @ts-ignore
      await videoTrack.applyConstraints({
        advanced: [{ torch: targetTorch } as any],
      });
      setTorchOn(targetTorch);
      onTorchChange?.(targetTorch);
    } catch (err) {
      console.warn("Failed to apply torch constraint:", err);
    }
  }

  useEffect(() => {
    if (externalTorchOn !== undefined && externalTorchOn !== torchOn) {
      void applyTorch(externalTorchOn);
    }
  }, [externalTorchOn]);

  async function toggleTorch() {
    await applyTorch(!torchOn);
  }

  async function stopScanner() {
    if (!scannerRef.current) return;
    try {
      const videoEl = document.getElementById(SCANNER_ID)?.querySelector("video") as HTMLVideoElement | null;
      const stream = videoEl?.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch {}
        });
      }
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

  // Handle dynamic facingMode switch (front vs rear camera)
  useEffect(() => {
    if (started && facingMode !== currentFacingRef.current) {
      currentFacingRef.current = facingMode;
      void startScanner(facingMode);
    }
  }, [facingMode, started]);

  // Check if multiple cameras are available on this device
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          if (videoInputs.length > 1) {
            onMultipleCamerasDetected?.(true);
          }
        })
        .catch(() => {});
    }
  }, [onMultipleCamerasDetected]);

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

  // Safe visibility recovery: if mobile browser suspended video on tab switch, resume smoothly
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.visibilityState === "visible" && mountedRef.current) {
        try {
          const videoEl = document.getElementById(SCANNER_ID)?.querySelector("video") as HTMLVideoElement | null;
          if (videoEl) {
            if (videoEl.paused) {
              await videoEl.play().catch(() => {});
            }
            const stream = videoEl.srcObject as MediaStream | null;
            const track = stream?.getVideoTracks?.()[0];
            if (!track || track.readyState === "ended") {
              await startScanner();
            }
          }
        } catch {}
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Determine status accent with UrPass electric-violet branding.
  let bracketColor = "#8B5CF6"; // Electric-violet for READY

  if (statusVariant === "PROCESSING") {
    bracketColor = "#A78BFA"; // Soft violet pulse
  } else if (statusVariant === "SUCCESS") {
    bracketColor = "#22C55E";
  } else if (statusVariant === "DUPLICATE") {
    bracketColor = "#F59E0B";
  } else if (statusVariant === "ERROR" || statusVariant === "REJECTED") {
    bracketColor = "#EF4444";
  }

  return (
    <div className={`relative flex flex-col items-center w-full h-full ${className}`}>
      {/* Viewfinder Frame */}
      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-zinc-950 transition-colors duration-300">
        <div id={SCANNER_ID} className="w-full h-full flex items-center justify-center overflow-hidden [&>video]:min-w-full [&>video]:min-h-full [&>video]:w-auto [&>video]:h-auto [&>video]:max-w-none" />

        {/* Starting placeholder */}
        {!started && !cameraError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-950/90 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-950/40">
              <Camera className="h-6 w-6 text-violet-300 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-zinc-200">Starting camera...</p>
            <p className="max-w-[220px] text-center text-[11px] text-zinc-400">Point at the attendee pass QR</p>
          </div>
        )}

        {/* Camera error */}
        {cameraError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-950/98 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/15">
              <CameraOff className="h-6 w-6 text-rose-400" />
            </div>
            <p className="max-w-[260px] text-xs font-semibold leading-relaxed text-zinc-200">{cameraError}</p>
            <button
              onClick={() => startScanner()}
              className="mt-2 rounded-xl border border-violet-500 bg-violet-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-violet-500 cursor-pointer shadow-md shadow-violet-950/40"
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

            {/* Electric-Violet Scan Beam — Only actively animating when READY and decoding */}
            {active && statusVariant === "READY" && (
              <>
                <span
                  className="absolute left-4 right-4 pointer-events-none animate-[scanBeam_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
                  style={{
                    height: "24px",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.22) 50%, transparent)",
                    borderRadius: "6px",
                  }}
                />
                <span
                  className="absolute left-6 right-6 pointer-events-none animate-[scanBeam_1.8s_ease-in-out_infinite] motion-reduce:animate-none"
                  style={{
                    height: "2px",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(to right, transparent, #8B5CF6 50%, transparent)",
                    boxShadow: "0 0 12px #8B5CF6",
                  }}
                />
              </>
            )}
          </>
        )}
      </div>

      {/* Status indicator */}
      {started && (
        <div className="flex items-center gap-2 mt-2 select-none">
          <span
            className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-200 ${
              active ? "bg-emerald-400 animate-pulse motion-reduce:animate-none" : "bg-zinc-600"
            }`}
          />
          <p className="text-[11px] text-zinc-400 font-medium tracking-wide">
            {active
              ? "Scanner ready"
              : statusVariant === "PROCESSING"
              ? "Verifying ticket..."
              : "Result locked"}
          </p>
        </div>
      )}
    </div>
  );
}
