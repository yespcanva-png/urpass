"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Lock, Loader2, AlertCircle, KeyRound, Terminal } from "lucide-react";

interface Props {
  onSuccess: () => void;
}

export default function OpsPinModal({ onSuccess }: Props) {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleDigitChange(index: number, val: string) {
    // Only accept numeric
    const clean = val.replace(/\D/g, "");
    if (!clean && val !== "") return;

    const newPin = [...pin];
    newPin[index] = clean.slice(-1);
    setPin(newPin);
    setError("");

    // Auto-advance
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    const joined = newPin.join("");
    if (joined.length === 6 && !newPin.includes("")) {
      submitPin(joined);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newPin = [...pin];
    for (let i = 0; i < 6; i++) {
      newPin[i] = pasted[i] || "";
    }
    setPin(newPin);
    setError("");

    if (pasted.length === 6) {
      submitPin(pasted);
    } else {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  }

  async function submitPin(pinCode: string) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ops/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinCode }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Incorrect operational PIN.");
        setPin(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("Network error while verifying operational PIN.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090713] flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Background ambient grid and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#090713] to-[#090713]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md bg-[#130f24] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Terminal Header Tag */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>ops-gateway: auth_check</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider">ONLINE</span>
          </div>
        </div>

        {/* Center Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 border border-white/15 flex items-center justify-center shadow-lg mb-5 relative group">
            <Lock className="w-7 h-7 text-white/90 group-hover:scale-105 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center">
              <KeyRound className="w-2.5 h-2.5 text-emerald-300" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            Operations Command Center
          </h1>
          <p className="text-xs text-white/55 max-w-xs leading-relaxed mb-8">
            Enter your 6-digit database security PIN to inspect active users, system health, and live telemetry logs.
          </p>
        </div>

        {/* 6-Digit PIN Inputs */}
        <div className="flex justify-center gap-2.5 sm:gap-3.5 mb-6" onPaste={handlePaste}>
          {pin.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={loading}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold text-white bg-white/5 border border-white/10 rounded-xl focus:outline-hidden focus:border-emerald-400 focus:bg-white/10 focus:ring-2 focus:ring-emerald-400/20 transition-all disabled:opacity-40"
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3.5 py-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={() => submitPin(pin.join(""))}
          disabled={loading || pin.includes("") || pin.join("").length < 6}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-semibold text-neutral-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
              Verifying Security PIN...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Authorize Access
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-white/30 font-mono mt-6">
          Encrypted Session · Verified in PostgreSQL · 8-Hour Token
        </p>
      </div>
    </div>
  );
}
