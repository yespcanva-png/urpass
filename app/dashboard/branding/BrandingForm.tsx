"use client";

import { useState } from "react";
import {
  Loader2,
  CheckCircle,
  Palette,
  Image as ImageIcon,
  Type,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
  Check,
} from "lucide-react";
import { updateBranding } from "@/app/actions/branding";

interface Props {
  initial: {
    org_name: string;
    brand_color: string;
    org_logo_url: string;
    hide_urpass_branding: boolean;
  };
  isPro: boolean;
  canHideBranding: boolean;
}

const PRESET_COLORS = [
  { label: "Imperial Purple", hex: "#6D28D9" },
  { label: "Royal Blue", hex: "#2563EB" },
  { label: "Emerald Green", hex: "#059669" },
  { label: "Crimson Red", hex: "#DC2626" },
  { label: "Amber Gold", hex: "#D97706" },
  { label: "Obsidian", hex: "#0F172A" },
];

const inputCls =
  "border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-neutral-900 transition-colors bg-white placeholder:text-neutral-300 w-full";

function darken(hex: string, amount = 40): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = Math.max(0, parseInt(clean.slice(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(clean.slice(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(clean.slice(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function PassPreview({ orgName, brandColor, logoUrl }: { orgName: string; brandColor: string; logoUrl: string }) {
  const dark = darken(brandColor);
  const label = orgName.trim() || "Your Organisation";
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm max-w-xs mx-auto select-none">
      <div className="px-5 pt-5 pb-6" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${dark} 100%)` }}>
        <div className="flex items-center gap-2 mb-3">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="logo" className="w-5 h-5 rounded object-cover" />
          )}
          <span className="text-[9px] font-bold tracking-widest uppercase text-white/60">
            {label} · EVENT PASS
          </span>
        </div>
        <p className="text-base font-bold text-white leading-snug">Annual Tech Summit 2026</p>
        <p className="text-[11px] text-white/60 mt-2">15 September 2026 · 10:00–18:00</p>
        <p className="text-[11px] text-white/60">SRM Institute, Chennai</p>
      </div>
      <div className="px-5 py-4 flex flex-col items-center gap-3">
        <div className="w-full text-center">
          <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-0.5">Attendee</p>
          <p className="text-sm font-bold text-neutral-900">Arun Kumar</p>
          <p className="text-xs text-neutral-400">arun@example.com</p>
        </div>
        <div className="w-20 h-20 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-300 text-xs">
          QR code
        </div>
        <div
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white"
          style={{ background: brandColor }}
        >
          Valid · Show at entrance
        </div>
      </div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
  disabled,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-colors disabled:opacity-40 ${
        enabled ? "bg-neutral-900" : "bg-neutral-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function BrandingForm({ initial, isPro, canHideBranding }: Props) {
  const [hideBranding, setHideBranding] = useState(initial.hide_urpass_branding);
  const [orgName, setOrgName]       = useState(initial.org_name);
  const [brandColor, setBrandColor] = useState(initial.brand_color);
  const [logoUrl, setLogoUrl]       = useState(initial.org_logo_url);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [error, setError]           = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be under 5MB.");
      return;
    }

    setUploadError("");
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/studio/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setLogoUrl(data.url);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) setLogoUrl(ev.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setLogoUrl(ev.target.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const result = await updateBranding({
        org_name: orgName,
        brand_color: brandColor,
        org_logo_url: logoUrl,
        hide_urpass_branding: hideBranding,
      });
      setSaving(false);
      if (result?.error) { setError(result.error); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Failed to update branding settings");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSave} className="flex flex-col gap-5">

        {/* ── Hide URPASS branding toggle ──────────────────── */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-2xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Hide URPASS branding</p>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                When enabled, the &ldquo;Powered by URPASS&rdquo; footer and wordmark are removed from all
                passes, public application forms, and attendee pages.
              </p>
              {hideBranding && (
                <div className="flex items-center gap-1.5 mt-2.5 text-xs font-medium text-green-700">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Branding hidden — attendees see a clean, 100% unbranded experience
                </div>
              )}
            </div>
            <Toggle
              enabled={hideBranding}
              onChange={setHideBranding}
              disabled={!canHideBranding}
            />
          </div>
          {!canHideBranding && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-4">
              Upgrade to Starter or Pro to hide URPASS branding.
            </p>
          )}
        </div>

        {/* ── Custom branding (Pro only) ────────────────────── */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-2xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-800">Custom branding</h2>
            {!isPro ? (
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Pro only
              </span>
            ) : (
              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Pro Unlocked
              </span>
            )}
          </div>

          {/* Org name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-neutral-400" />
              Organisation name
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Innovations / SRM TechFest"
              className={inputCls}
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              maxLength={64}
              disabled={!isPro}
            />
            <p className="text-xs text-neutral-400">
              Shown on passes in place of &ldquo;URPASS&rdquo;. Leave blank to show nothing.
            </p>
          </div>

          {/* Brand colour */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-neutral-400" />
              Brand colour
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-11 h-10 rounded-xl border border-neutral-200 cursor-pointer p-1 bg-white"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                disabled={!isPro}
              />
              <input
                type="text"
                className={`${inputCls} font-mono uppercase w-36`}
                value={brandColor}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  if (/^#[0-9a-fA-F]{0,6}$/.test(val)) setBrandColor(val);
                }}
                maxLength={7}
                disabled={!isPro}
              />
            </div>

            {/* Quick Preset Palette Swatches */}
            {isPro && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-neutral-400 font-medium mr-1">Presets:</span>
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setBrandColor(preset.hex)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      brandColor.toLowerCase() === preset.hex.toLowerCase()
                        ? "border-neutral-900 bg-neutral-100 font-bold text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ background: preset.hex }}
                    />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-neutral-400">
              Used for pass header gradients, ticket badges, buttons, and accent styling.
            </p>
          </div>

          {/* Logo URL / Uploader */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
              Organisation Logo
              <span className="text-neutral-400 font-normal">(optional)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                className={inputCls}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                disabled={!isPro || uploadingLogo}
              />

              {isPro && (
                <label className="shrink-0 px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
                  {uploadingLogo ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                  <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-red-500 mt-0.5">{uploadError}</p>
            )}

            {logoUrl && (
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100 mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="w-8 h-8 rounded-lg object-contain bg-white border border-neutral-200 p-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-800 truncate">Logo active</p>
                  <p className="text-[10px] text-neutral-400 truncate">{logoUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}

            <p className="text-xs text-neutral-400">
              Square PNG or SVG recommended. Displayed next to your organisation name on attendee passes.
            </p>
          </div>
        </div>

        {/* Preview toggle */}
        {isPro && (
          <button
            type="button"
            onClick={() => setPreviewOpen(!previewOpen)}
            className="flex items-center gap-2 text-sm text-brand hover:underline underline-offset-2 self-start"
          >
            {previewOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {previewOpen ? "Hide preview" : "Show pass preview"}
          </button>
        )}

        {previewOpen && isPro && (
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4 text-center">
              Pass preview
            </p>
            <PassPreview orgName={orgName} brandColor={brandColor} logoUrl={logoUrl} />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: "#6D28D9" }}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save branding"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
