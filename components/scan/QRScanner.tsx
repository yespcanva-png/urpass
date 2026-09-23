"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera, CameraOff } from "lucide-react";

interface Props {
  onScan: (token: string) => void;
  active: boolean;
}

const SCANNER_ID = "urpass-qr-scanner";

export default function QRScanner({ onScan, active }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [started, setStarted] = useState(false);
  const mountedRef = useRef(true);

  async function startScanner() {
    try {
      if (scannerRef.current) {
        try { await scannerRef.current.stop(); } catch {}
        scannerRef.current.clear();
      }

      const scanner = new Html5Qrcode(SCANNER_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => { if (mountedRef.current) onScan(decodedText); },
        () => {}
      );

      if (mountedRef.current) { setCameraError(""); setStarted(true); }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (mountedRef.current) {
        setCameraError(
          msg.includes("permission")
            ? "Camera permission denied. Allow camera access and try again."
            : "Could not start camera."
        );
        setStarted(false);
      }
    }
  }

  async function stopScanner() {
    if (!scannerRef.current) return;
    try {
      if (await scannerRef.current.getState() === 2) await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch {}
    scannerRef.current = null;
    if (mountedRef.current) setStarted(false);
  }

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!active) {
      stopScanner();
    } else {
      timer = setTimeout(() => {
        startScanner();
      }, 0);
    }
    return () => {
      clearTimeout(timer);
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Viewfinder */}
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-neutral-900"
        style={{
          aspectRatio: "1",
          boxShadow: started ? "0 0 0 1px rgba(109,40,217,0.2), 0 0 40px rgba(109,40,217,0.08)" : undefined,
        }}
      >
        <div id={SCANNER_ID} className="w-full h-full" />

        {/* Starting placeholder */}
        {!started && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Camera className="w-6 h-6 text-neutral-500" />
            </div>
            <p className="text-xs text-neutral-500">Starting camera…</p>
          </div>
        )}

        {/* Camera error */}
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <CameraOff className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">{cameraError}</p>
          </div>
        )}

        {/* Scanner overlay — only when started */}
        {started && (
          <>
            {/* Vignette — dims edges to focus on center */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 72% 72% at 50% 50%, transparent 48%, rgba(0,0,0,0.5) 100%)",
              }}
            />

            {/* Corner brackets — brand colored with pulse */}
            <span
              className="absolute top-5 left-5 w-10 h-10 rounded-tl-xl pointer-events-none animate-[bracketPulse_2.4s_ease-in-out_infinite]"
              style={{ borderTop: "3px solid #7C3AED", borderLeft: "3px solid #7C3AED", filter: "drop-shadow(0 0 5px #6D28D9)" }}
            />
            <span
              className="absolute top-5 right-5 w-10 h-10 rounded-tr-xl pointer-events-none animate-[bracketPulse_2.4s_ease-in-out_infinite]"
              style={{ borderTop: "3px solid #7C3AED", borderRight: "3px solid #7C3AED", filter: "drop-shadow(0 0 5px #6D28D9)", animationDelay: "0.3s" }}
            />
            <span
              className="absolute bottom-5 left-5 w-10 h-10 rounded-bl-xl pointer-events-none animate-[bracketPulse_2.4s_ease-in-out_infinite]"
              style={{ borderBottom: "3px solid #7C3AED", borderLeft: "3px solid #7C3AED", filter: "drop-shadow(0 0 5px #6D28D9)", animationDelay: "0.6s" }}
            />
            <span
              className="absolute bottom-5 right-5 w-10 h-10 rounded-br-xl pointer-events-none animate-[bracketPulse_2.4s_ease-in-out_infinite]"
              style={{ borderBottom: "3px solid #7C3AED", borderRight: "3px solid #7C3AED", filter: "drop-shadow(0 0 5px #6D28D9)", animationDelay: "0.9s" }}
            />

            {/* Scan beam — diffuse glow layer */}
            <span
              className="absolute left-6 right-6 pointer-events-none animate-[scanBeam_2.4s_ease-in-out_infinite]"
              style={{
                height: "24px",
                transform: "translateY(-50%)",
                background: "linear-gradient(to bottom, transparent, rgba(109,40,217,0.18) 50%, transparent)",
                borderRadius: "99px",
              }}
            />
            {/* Scan beam — bright core line */}
            <span
              className="absolute left-10 right-10 pointer-events-none animate-[scanBeam_2.4s_ease-in-out_infinite]"
              style={{
                height: "2px",
                transform: "translateY(-50%)",
                background: "linear-gradient(to right, transparent, #8B5CF6 20%, #6D28D9 50%, #8B5CF6 80%, transparent)",
                boxShadow: "0 0 6px 2px rgba(109,40,217,0.7), 0 0 14px 4px rgba(109,40,217,0.3)",
              }}
            />
          </>
        )}
      </div>

      {/* Status indicator */}
      {started && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <p className="text-xs text-white/60 font-medium">Ready to scan</p>
        </div>
      )}
    </div>
  );
}
