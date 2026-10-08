"use client";

import { useState } from "react";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Lock,
  X,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import PayUWordmark from "./PayUWordmark";
import {
  savePayUSettings,
  removePayUSettings,
  testPayUCredentials,
} from "@/app/actions/payu-settings";

interface Props {
  canUsePayments: boolean;
  existingMerchantKey: string | null;
  existingEnvironment?: "production" | "sandbox";
}

type CardState = "idle" | "installing" | "form" | "connected";

const inputCls =
  "bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-hidden focus:border-brand focus:bg-white transition-all w-full placeholder:text-neutral-400 font-mono";

export default function PayUCard({
  canUsePayments,
  existingMerchantKey,
  existingEnvironment = "production",
}: Props) {
  const [state, setState] = useState<CardState>(existingMerchantKey ? "connected" : "idle");
  const [merchantKey, setMerchantKey] = useState("");
  const [merchantSalt, setMerchantSalt] = useState("");
  const [environment, setEnvironment] = useState<"production" | "sandbox">(existingEnvironment);
  const [showSalt, setShowSalt] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [connectedKey, setConnectedKey] = useState(existingMerchantKey ?? "");

  async function handleInstall() {
    setState("installing");
    await new Promise((r) => setTimeout(r, 1000));
    setState("form");
  }

  async function handleTest() {
    if (!merchantKey.trim() || !merchantSalt.trim()) {
      setError("Please enter both Merchant Key and Merchant Salt before testing.");
      return;
    }
    setError("");
    setSuccessMsg("");
    setTesting(true);
    const res = await testPayUCredentials(merchantKey.trim(), merchantSalt.trim());
    setTesting(false);
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setError(res.message);
    }
  }

  async function handleSave() {
    setError("");
    setSuccessMsg("");
    setSaving(true);
    const result = await savePayUSettings(
      merchantKey.trim(),
      merchantSalt.trim(),
      environment
    );
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setConnectedKey(merchantKey.trim());
      setMerchantKey("");
      setMerchantSalt("");
      setState("connected");
    }
  }

  async function handleRemove() {
    setRemoving(true);
    setError("");
    const result = await removePayUSettings();
    setRemoving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setConnectedKey("");
      setState("idle");
    }
  }

  /* ── Locked (free plan) ──────────────────────────────────── */
  if (!canUsePayments) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="opacity-40 flex items-center gap-2">
            <PayUWordmark height={22} />
            <Lock className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <span className="text-[10px] font-bold tracking-wide uppercase bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full shrink-0">
            Starter+
          </span>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Accept payments directly into your PayU merchant account via UPI, Credit/Debit Cards, Net Banking, and PayU Wallet.
        </p>
        <Link
          href="/billing"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity self-start bg-neutral-900 shadow-2xs"
        >
          Upgrade to unlock
        </Link>
      </div>
    );
  }

  /* ── Idle: show Install button ───────────────────────────── */
  if (state === "idle") {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <PayUWordmark height={22} />
          <button
            onClick={handleInstall}
            className="shrink-0 text-xs font-bold text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-2xs"
            style={{ background: "#1C1E23" }}
          >
            Install
          </button>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Accept payments directly into your PayU merchant account via UPI, Cards, Net Banking, and Wallets.
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-200" />
          <span className="text-xs text-neutral-400">Not connected</span>
        </div>
      </div>
    );
  }

  /* ── Installing: loading state ───────────────────────────── */
  if (state === "installing") {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 overflow-hidden">
        <div className="p-5 flex flex-col gap-3">
          <PayUWordmark height={22} />
          <p className="text-xs text-neutral-500">Loading PayU integration…</p>
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand" />
            <span className="text-xs text-brand font-medium">Preparing PayU setup…</span>
          </div>
        </div>
        <div className="h-1 bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full animate-pulse"
            style={{ background: "#A6CE39", width: "65%" }}
          />
        </div>
      </div>
    );
  }

  /* ── Form: key entry ─────────────────────────────────────── */
  if (state === "form") {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 overflow-hidden">
        <div className="p-5 flex items-center justify-between gap-3 border-b border-neutral-100">
          <div className="flex flex-col gap-1">
            <PayUWordmark height={22} />
            <p className="text-xs text-neutral-500">Enter your PayU API credentials to connect</p>
          </div>
          <button
            onClick={() => setState("idle")}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-neutral-500 hover:bg-neutral-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800">
              Find your Merchant Key and Salt in the{" "}
              <a
                href="https://dashboard.payu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline inline-flex items-center gap-0.5"
              >
                PayU Merchant Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
              Environment
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as "production" | "sandbox")}
              className={`${inputCls} font-sans`}
            >
              <option value="production">Production (Live Gateway)</option>
              <option value="sandbox">Sandbox / Test Mode</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
              PayU Merchant Key
            </label>
            <input
              type="text"
              placeholder="e.g. 7rnFly or merchant_key"
              value={merchantKey}
              onChange={(e) => setMerchantKey(e.target.value)}
              className={inputCls}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
              PayU Merchant Salt
            </label>
            <div className="relative">
              <input
                type={showSalt ? "text" : "password"}
                placeholder="••••••••••••••••••••••••"
                value={merchantSalt}
                onChange={(e) => setMerchantSalt(e.target.value)}
                className={`${inputCls} pr-10`}
                autoComplete="new-password"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowSalt((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showSalt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {successMsg}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              onClick={handleSave}
              disabled={saving || !merchantKey.trim() || !merchantSalt.trim()}
              className="flex items-center gap-2 text-xs font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 shadow-2xs"
              style={{ background: "#1C1E23" }}
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Connecting…" : "Save & Connect PayU"}
            </button>
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !merchantKey.trim() || !merchantSalt.trim()}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 transition-colors disabled:opacity-50"
            >
              {testing ? "Testing Hash…" : "Test Key & Salt"}
            </button>
            <button
              onClick={() => {
                setState("idle");
                setMerchantKey("");
                setMerchantSalt("");
                setError("");
                setSuccessMsg("");
              }}
              className="text-xs font-medium text-neutral-400 hover:text-neutral-600 px-3 py-2.5"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Connected ───────────────────────────────────────────── */
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-neutral-200/80 p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <PayUWordmark height={22} />
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Connected
        </span>
      </div>
      <p className="text-xs font-mono text-neutral-600 truncate">
        Merchant Key: <span className="font-bold text-neutral-900">{connectedKey}</span>
      </p>
      <p className="text-xs text-neutral-400">
        Attendee payments from your paid events will be processed directly into your PayU account.
      </p>
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <button
          onClick={() => setState("form")}
          className="text-xs font-bold border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Change keys
        </button>
        <button
          onClick={handleRemove}
          disabled={removing}
          className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          {removing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          Disconnect
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
