"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Building2,
  Receipt,
  MapPin,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { updateBillingProfile } from "@/app/actions/auth";
import { validateGstin } from "@/lib/validations/gstin";

interface ProfileFormProps {
  fullName: string;
  email: string;
  initials: string;
  phone?: string | null;
  companyName?: string | null;
  gstin?: string | null;
  billingAddress?: string | null;
}

export default function ProfileForm({
  fullName,
  email,
  initials,
  phone: initialPhone,
  companyName: initialCompanyName,
  gstin: initialGstin,
  billingAddress: initialBillingAddress,
}: ProfileFormProps) {
  const [name, setName] = useState(fullName);
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [companyName, setCompanyName] = useState(initialCompanyName ?? "");
  const [gstin, setGstin] = useState(initialGstin ?? "");
  const [billingAddress, setBillingAddress] = useState(initialBillingAddress ?? "");

  const [initialState, setInitialState] = useState({
    name: fullName,
    phone: initialPhone ?? "",
    companyName: initialCompanyName ?? "",
    gstin: initialGstin ?? "",
    billingAddress: initialBillingAddress ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isDirty =
    name !== initialState.name ||
    phone !== initialState.phone ||
    companyName !== initialState.companyName ||
    gstin !== initialState.gstin ||
    billingAddress !== initialState.billingAddress;

  const currentInitials =
    name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase() || initials;

  const trimmedGstin = gstin.trim().toUpperCase();
  const isGstinValid = !trimmedGstin || validateGstin(trimmedGstin);

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    if (trimmedGstin && !validateGstin(trimmedGstin)) {
      setError("Invalid GSTIN format. Expected 15 characters (e.g. 29ABCDE1234F1Z5).");
      return;
    }

    setLoading(true);
    const result = await updateBillingProfile({
      fullName: name.trim(),
      phone: phone.trim() || null,
      companyName: companyName.trim() || null,
      gstin: trimmedGstin || null,
      billingAddress: billingAddress.trim() || null,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setInitialState({
        name: name.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        gstin: trimmedGstin,
        billingAddress: billingAddress.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    }
  }

  function handleDiscard() {
    setName(initialState.name);
    setPhone(initialState.phone);
    setCompanyName(initialState.companyName);
    setGstin(initialState.gstin);
    setBillingAddress(initialState.billingAddress);
    setError("");
  }

  return (
    <form onSubmit={handleSave} className="px-6 py-6 space-y-6">
      {/* Avatar + name banner */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0 shadow-md"
          style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
        >
          {currentInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-neutral-900 leading-tight truncate">
              {name || "Account Owner"}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand bg-brand-50 border border-brand/20 px-2 py-0.5 rounded-full shrink-0">
              <ShieldCheck className="w-3 h-3 text-brand" /> Organizer
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-0.5 truncate">{email}</p>
          {success && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mt-1.5 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              Profile and billing details updated successfully
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200/80 px-4 py-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Section: Personal Information ────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Personal Information
        </p>

        <div className="space-y-3">
          {/* Full Name */}
          <div className="rounded-xl border border-neutral-200/80 overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-50/80 border-b border-neutral-100">
              <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <label htmlFor="fullName" className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                Full Name
              </label>
            </div>
            <div className="px-3.5 py-2.5 bg-white">
              <input
                id="fullName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full text-sm text-neutral-900 outline-none placeholder:text-neutral-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email Address (Read-only) */}
            <div className="rounded-xl border border-neutral-200/80 overflow-hidden bg-neutral-50/40">
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-neutral-50 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                    Email Address
                  </span>
                </div>
                <span className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Read Only
                </span>
              </div>
              <div className="px-3.5 py-2.5">
                <p className="text-sm text-neutral-500 font-mono select-all truncate">{email}</p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="rounded-xl border border-neutral-200/80 overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-50/80 border-b border-neutral-100">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <label htmlFor="phone" className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                  Phone Number
                </label>
              </div>
              <div className="px-3.5 py-2.5 bg-white">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-sm text-neutral-900 outline-none placeholder:text-neutral-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section: Business Invoicing & Tax Details ───────── */}
      <div className="space-y-3 pt-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Business & Tax Invoicing
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">
            These details will automatically appear on your subscription receipts and official GST tax invoices.
          </p>
        </div>

        <div className="space-y-3">
          {/* Company / Entity Name */}
          <div className="rounded-xl border border-neutral-200/80 overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-50/80 border-b border-neutral-100">
              <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <label htmlFor="companyName" className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                Legal Entity / Company Name
              </label>
            </div>
            <div className="px-3.5 py-2.5 bg-white">
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Technologies Pvt Ltd"
                className="w-full text-sm text-neutral-900 outline-none placeholder:text-neutral-300"
              />
            </div>
          </div>

          {/* GSTIN */}
          <div className="rounded-xl border border-neutral-200/80 overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-neutral-50/80 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <label htmlFor="gstin" className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                  GSTIN (Tax ID)
                </label>
              </div>
              {trimmedGstin.length > 0 && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                    isGstinValid
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : "text-amber-700 bg-amber-50 border border-amber-200"
                  }`}
                >
                  {isGstinValid ? "15-digit valid format" : "Invalid GSTIN"}
                </span>
              )}
            </div>
            <div className="px-3.5 py-2.5 bg-white">
              <input
                id="gstin"
                type="text"
                maxLength={15}
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 29ABCDE1234F1Z5"
                className="w-full text-sm font-mono uppercase text-neutral-900 outline-none placeholder:text-neutral-300"
              />
            </div>
          </div>

          {/* Registered Billing Address */}
          <div className="rounded-xl border border-neutral-200/80 overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-neutral-50/80 border-b border-neutral-100">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <label htmlFor="billingAddress" className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
                Registered Billing Address
              </label>
            </div>
            <div className="px-3.5 py-2 bg-white">
              <textarea
                id="billingAddress"
                rows={3}
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Registered business address, street, city, state, postal code"
                className="w-full text-sm text-neutral-900 outline-none placeholder:text-neutral-300 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions bar ──────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <p className="text-xs text-neutral-400">
          {isDirty ? (
            <span className="text-amber-600 font-medium">Unsaved changes</span>
          ) : (
            <span>All changes saved</span>
          )}
        </p>

        <div className="flex items-center gap-2.5">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              Discard
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !isDirty}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
            style={{ background: "#6D28D9" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
