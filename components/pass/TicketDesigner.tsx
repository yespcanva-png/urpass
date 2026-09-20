"use client";

import React, { useState, useTransition, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Upload,
  X,
  Eye,
  Smartphone,
  FileText,
  Lock,
  Loader2,
} from "lucide-react";
import {
  type TicketDesignConfig,
  type TicketTemplate,
  DEFAULT_TICKET_DESIGN,
} from "@/lib/pass-design";
import TicketPreview from "./TicketPreview";
import { saveTicketDesign, sendTestTicketEmail } from "@/app/actions/ticket-design";

interface TicketDesignerProps {
  initialConfig?: TicketDesignConfig | null;
  isPro: boolean;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  venue?: string;
  backHref?: string;
}

export default function TicketDesigner({
  initialConfig,
  isPro,
  eventId,
  eventName = "URPASS SUMMIT",
  eventDate = "24 OCT 2026 | 10:00 AM",
  venue = "The Residency, Coimbatore",
  backHref = "/dashboard",
}: TicketDesignerProps) {
  const [config, setConfig] = useState<TicketDesignConfig>({
    ...DEFAULT_TICKET_DESIGN,
    ...(initialConfig || {}),
  });

  const [viewMode, setViewMode] = useState<"mobile" | "pdf">("mobile");
  const [isPending, startTransition] = useTransition();
  const [isPublished, setIsPublished] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [testError, setTestError] = useState("");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // Logo file upload handler (Max 2MB)
  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo image size must be under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setConfig((prev) => ({ ...prev, logoUrl: dataUrl }));
      setIsPublished(false);
    };
    reader.readAsDataURL(file);
  }

  // Background image upload handler (Max 5MB)
  function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Background image size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      setConfig((prev) => ({ ...prev, backgroundImageUrl: dataUrl }));
      setIsPublished(false);
    };
    reader.readAsDataURL(file);
  }

  // Save & Publish
  function handleSaveAndPublish() {
    startTransition(async () => {
      const res = await saveTicketDesign(eventId || null, config);
      if (res?.success) {
        setIsPublished(true);
      } else if (res?.error) {
        alert(res.error);
      }
    });
  }

  // Send Test Ticket
  async function handleSendTest(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmail) return;

    setSendingTest(true);
    setTestError("");
    setTestSuccess(false);

    const res = await sendTestTicketEmail(testEmail, eventName, config);
    setSendingTest(false);

    if (res?.error) {
      setTestError(res.error);
    } else {
      setTestSuccess(true);
      setTimeout(() => {
        setTestModalOpen(false);
        setTestSuccess(false);
      }, 2000);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50/70 pb-20 font-sans">
      {/* ── Top Header ─────────────────────────────────────────────── */}
      <header className="border-b border-neutral-200/80 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors mb-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Event</span>
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 leading-tight">
              Design your ticket
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Create the pass your attendees will receive. Keep it simple and on brand.
            </p>
          </div>

          {/* Top-right actions */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            {isPublished ? (
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Ticket design published</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsPublished(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors border border-neutral-200 bg-white rounded-xl shadow-2xs"
                >
                  Edit Design
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setTestModalOpen(true);
                    setTestSuccess(false);
                    setTestError("");
                  }}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 rounded-xl transition-all hover:bg-neutral-50 shadow-2xs"
                >
                  Send Test
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndPublish}
                  disabled={isPending || !isPro}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-sm hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: "#6D28D9" }}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : !isPro ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock with Pro</span>
                    </>
                  ) : (
                    <span>Save & Publish</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Pro Banner if not Pro */}
      {!isPro && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
          <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-300/40 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-amber-700" />
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                <strong className="text-neutral-900">Custom Ticket Design is a Pro feature.</strong>{" "}
                You can test and preview all customization options in real time. Upgrade to publish custom designs for attendees.
              </p>
            </div>
            <Link
              href="/billing"
              className="shrink-0 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}

      {/* ── Main Two-Column Layout ──────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT — DESIGN (One clean card) ──────────────────────── */}
          <div className="lg:col-span-6 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs flex flex-col gap-6">
            {/* 1. Template */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Template
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: "minimal" as TicketTemplate,
                    label: "Minimal",
                    thumbBg: "bg-white border-neutral-200",
                    accent: "border-neutral-300",
                  },
                  {
                    id: "modern" as TicketTemplate,
                    label: "Modern",
                    thumbBg: "bg-white border-neutral-200",
                    accent: "border-purple-300",
                    bar: true,
                  },
                  {
                    id: "dark" as TicketTemplate,
                    label: "Dark",
                    thumbBg: "bg-neutral-900 border-neutral-800",
                    accent: "border-neutral-700",
                  },
                ].map((t) => {
                  const isSelected = config.template === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setConfig((prev) => ({ ...prev, template: t.id }));
                        setIsPublished(false);
                      }}
                      className={`group flex flex-col items-center p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-[#6D28D9] ring-2 ring-[#6D28D9]/15 bg-neutral-50/50"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      {/* Mini Thumbnail Preview */}
                      <div
                        className={`w-full h-18 rounded-lg border flex flex-col p-1.5 mb-2 shadow-2xs ${t.thumbBg}`}
                      >
                        {t.bar && (
                          <div
                            className="w-full h-1 rounded-xs mb-1"
                            style={{ backgroundColor: config.primaryColor }}
                          />
                        )}
                        <div
                          className={`w-6 h-1 rounded-xs mb-1 ${
                            t.id === "dark" ? "bg-neutral-600" : "bg-neutral-300"
                          }`}
                        />
                        <div
                          className={`w-10 h-1 rounded-xs mb-2 ${
                            t.id === "dark" ? "bg-neutral-400" : "bg-neutral-800"
                          }`}
                        />
                        <div className="mt-auto flex items-center justify-center">
                          <div
                            className={`w-5 h-5 rounded-xs flex items-center justify-center ${
                              t.id === "dark" ? "bg-neutral-800" : "bg-neutral-100"
                            }`}
                          >
                            <div className="w-3 h-3 grid grid-cols-2 grid-rows-2 gap-0.5">
                              <div
                                className={`rounded-xs ${
                                  t.id === "dark" ? "bg-neutral-400" : "bg-neutral-900"
                                }`}
                              />
                              <div className="bg-transparent" />
                              <div className="bg-transparent" />
                              <div
                                className={`rounded-xs ${
                                  t.id === "dark" ? "bg-neutral-400" : "bg-neutral-900"
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? "text-[#6D28D9]" : "text-neutral-700"
                        }`}
                      >
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Brand Color */}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Brand Color
              </label>

              <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => {
                      setConfig((prev) => ({ ...prev, primaryColor: e.target.value }));
                      setIsPublished(false);
                    }}
                    className="w-10 h-10 rounded-xl border border-neutral-200 cursor-pointer p-0.5 bg-white shadow-2xs"
                  />
                </div>

                <div className="relative flex-1 max-w-[160px]">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: config.primaryColor }}
                    />
                  </div>
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                        setConfig((prev) => ({ ...prev, primaryColor: val }));
                        setIsPublished(false);
                      }
                    }}
                    maxLength={7}
                    className="w-full pl-8 pr-3 py-2 text-xs font-mono uppercase border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <span className="text-xs text-neutral-400">
                  Used as accent for badge & ticket highlights
                </span>
              </div>
            </div>

            {/* 3. Logo Upload */}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Logo
              </label>

              {config.logoUrl ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={config.logoUrl}
                      alt="Logo"
                      className="h-8 max-w-[120px] object-contain rounded-md"
                    />
                    <span className="text-xs text-neutral-600 font-medium">Logo uploaded</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((prev) => ({ ...prev, logoUrl: null }));
                      setIsPublished(false);
                    }}
                    className="p-1 rounded-md text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-200 hover:border-neutral-300 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-neutral-50/30 hover:bg-neutral-50"
                >
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center mb-1.5 text-neutral-500">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-neutral-800">Upload logo</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">PNG, JPG — Max 2MB</p>
                </div>
              )}
            </div>

            {/* 4. Show on Ticket Toggles */}
            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Show on Ticket
              </label>

              <div className="flex flex-col divide-y divide-neutral-100">
                {[
                  {
                    key: "showAttendeeName" as const,
                    label: "Attendee name",
                    value: config.showAttendeeName,
                  },
                  {
                    key: "showTicketType" as const,
                    label: "Ticket type",
                    value: config.showTicketType,
                  },
                  {
                    key: "showVenue" as const,
                    label: "Venue",
                    value: config.showVenue,
                  },
                  {
                    key: "showTicketId" as const,
                    label: "Ticket ID",
                    value: config.showTicketId,
                  },
                ].map((item) => (
                  <div key={item.key} className="py-2.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-800">{item.label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.value}
                      onClick={() => {
                        setConfig((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                        setIsPublished(false);
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        item.value ? "bg-[#6D28D9]" : "bg-neutral-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          item.value ? "translate-x-4.5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-neutral-400">
                Event name, date and time are automatically pulled from your event details.
              </p>
            </div>

            {/* 5. Background Image (optional) */}
            <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Background image (optional)
              </label>

              {config.backgroundImageUrl ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={config.backgroundImageUrl}
                      alt="Background"
                      className="w-12 h-8 object-cover rounded-md border border-neutral-200"
                    />
                    <span className="text-xs text-neutral-600 font-medium">
                      Background uploaded
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig((prev) => ({ ...prev, backgroundImageUrl: null }));
                      setIsPublished(false);
                    }}
                    className="p-1 rounded-md text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => bgInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-200 hover:border-neutral-300 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-neutral-50/30 hover:bg-neutral-50"
                >
                  <input
                    ref={bgInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleBgUpload}
                    className="hidden"
                  />
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center mb-1.5 text-neutral-500">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-neutral-800">Upload background</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">PNG, JPG — Max 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT — LIVE PREVIEW ─────────────────────────────────── */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-2xs flex flex-col">
              {/* Preview Header & Switch */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                  Preview
                </h3>

                {/* Mobile | PDF Switch */}
                <div className="flex items-center bg-neutral-100 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setViewMode("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                      viewMode === "mobile"
                        ? "bg-white text-neutral-900 shadow-2xs font-bold"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("pdf")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                      viewMode === "pdf"
                        ? "bg-white text-neutral-900 shadow-2xs font-bold"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Render Center Ticket */}
              <div className="w-full flex items-center justify-center min-h-[480px]">
                <TicketPreview
                  config={config}
                  viewMode={viewMode}
                  eventName={eventName}
                  eventDate={eventDate}
                  venue={venue}
                  attendeeName="Srinithin S"
                  ticketType="VIP PASS"
                  ticketId="#URP-10284"
                  qrValue="URP_x8K2pQ91Lm"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Sticky Mobile Preview Button ────────────────────────────── */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <button
          type="button"
          onClick={() => setMobilePreviewOpen(true)}
          className="w-full py-3.5 px-4 bg-neutral-900 text-white rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm font-bold active:scale-[0.98] transition-transform"
        >
          <Eye className="w-4 h-4" />
          <span>Preview Ticket</span>
        </button>
      </div>

      {/* ── Mobile Full-Screen Preview Modal ─────────────────────────── */}
      {mobilePreviewOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-neutral-50 rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-neutral-900">Live Ticket Preview</h3>
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(false)}
                className="p-1.5 rounded-full bg-neutral-200 text-neutral-600 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <TicketPreview
              config={config}
              viewMode="mobile"
              eventName={eventName}
              eventDate={eventDate}
              venue={venue}
            />

            <button
              type="button"
              onClick={() => setMobilePreviewOpen(false)}
              className="mt-6 w-full py-3 rounded-xl bg-neutral-900 text-white font-bold text-xs"
            >
              Done Previewing
            </button>
          </div>
        </div>
      )}

      {/* ── Send Test Ticket Modal ───────────────────────────────────── */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              Send test ticket
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              We&apos;ll email a sample ticket to this address so you can see how it looks.
            </p>

            {testSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Test ticket sent! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleSendTest} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-neutral-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-neutral-400"
                  />
                  {testError && <p className="text-xs text-red-500 mt-1">{testError}</p>}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTestModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingTest}
                    className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors disabled:opacity-50"
                  >
                    {sendingTest ? "Sending..." : "Send Test"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
