"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles,
  Palette,
  Layout,
  CheckCircle2,
  Lock,
  ArrowRight,
  Eye,
  Sliders,
  RotateCcw,
  Layers,
  FileText,
  Smartphone,
} from "lucide-react";
import {
  type CustomPassDesign,
  type PassThemePreset,
  type BackgroundPattern,
  type FontFamily,
  type HeaderStyle,
  PASS_DESIGN_PRESETS,
  DEFAULT_PASS_DESIGN,
  darkenHex,
} from "@/lib/pass-design";
import PassPreviewCard from "./PassPreviewCard";
import {
  updateProfilePassDesign,
  updateEventPassDesign,
} from "@/app/actions/pass-designer";

interface PassDesignerProps {
  initialDesign?: CustomPassDesign | null;
  orgDefaultDesign?: CustomPassDesign | null;
  orgName?: string;
  orgLogoUrl?: string;
  isPro: boolean;
  mode?: "profile" | "event";
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  venue?: string;
}

const COLOR_SWATCHES = [
  "#6D28D9", // Violet
  "#0284C7", // Sky Blue
  "#059669", // Emerald
  "#EA580C", // Orange
  "#DC2626", // Red
  "#4F46E5", // Indigo
  "#06B6D4", // Cyan
  "#DB2777", // Pink
  "#18181B", // Zinc / Noir
  "#0D9488", // Teal
  "#D97706", // Amber
  "#7C3AED", // Royal Purple
];

const THEMES: { id: PassThemePreset; label: string; desc: string; icon: string }[] = [
  {
    id: "classic",
    label: "Classic Ticket",
    desc: "Cutout ticket notches, dashed perforation, and official entry badge.",
    icon: "🎫",
  },
  {
    id: "modern",
    label: "Glassmorphism",
    desc: "Translucent frosted card, rounded geometry, and soft glowing accents.",
    icon: "✨",
  },
  {
    id: "badge",
    label: "Conference Badge",
    desc: "Lanyard slot header, hero attendee name, and prominent credential banner.",
    icon: "🏷️",
  },
  {
    id: "minimal",
    label: "Noir Minimal",
    desc: "Swiss typographic simplicity, crisp contrast, and subtle borders.",
    icon: "📐",
  },
  {
    id: "cyber",
    label: "Cyber Matrix",
    desc: "Dark high-tech futuristic layout, glowing neon frame, and mono text.",
    icon: "⚡",
  },
];

const PATTERNS: { id: BackgroundPattern; label: string }[] = [
  { id: "radial", label: "Radial Glow" },
  { id: "mesh", label: "Gradient Mesh" },
  { id: "dots", label: "Dot Matrix" },
  { id: "stripes", label: "Diagonal Stripes" },
  { id: "clean", label: "Solid Clean" },
];

const FONTS: { id: FontFamily; label: string; sample: string }[] = [
  { id: "sans", label: "Modern Sans", sample: "Inter / Clean" },
  { id: "mono", label: "Tech Mono", sample: "Geist / Monospace" },
  { id: "serif", label: "Luxury Serif", sample: "Editorial / Classic" },
];

const HEADER_STYLES: { id: HeaderStyle; label: string }[] = [
  { id: "gradient", label: "Gradient Blend" },
  { id: "solid", label: "Solid Color" },
  { id: "glass", label: "Frosted Glass" },
];

export default function PassDesigner({
  initialDesign,
  orgDefaultDesign,
  orgName = "ACME Events",
  orgLogoUrl = "",
  isPro,
  mode = "profile",
  eventId,
  eventName = "NextGen AI & Cloud Summit 2026",
  eventDate = "Saturday, 24 October 2026 · 10:00 AM",
  venue = "Tech Park Convention Hall, Bangalore",
}: PassDesignerProps) {
  // If event mode and initialDesign is null, it inherits from org
  const [inheritFromOrg, setInheritFromOrg] = useState<boolean>(
    mode === "event" && initialDesign === null
  );

  const activeInitial = initialDesign ?? orgDefaultDesign ?? DEFAULT_PASS_DESIGN;

  const [design, setDesign] = useState<CustomPassDesign>({
    ...DEFAULT_PASS_DESIGN,
    ...activeInitial,
  });

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"presets" | "theme" | "colors" | "typography" | "content">("presets");

  // Handle Preset selection
  function handleSelectPreset(presetDesign: CustomPassDesign) {
    setDesign({ ...presetDesign });
    setSaveSuccess(false);
  }

  // Handle auto-complementary secondary color
  function handlePrimaryColorChange(newColor: string) {
    const isAutoSecondary =
      design.secondaryColor === darkenHex(design.primaryColor, 35) ||
      design.secondaryColor === darkenHex(design.primaryColor, 40);

    setDesign((prev) => ({
      ...prev,
      primaryColor: newColor,
      secondaryColor: isAutoSecondary ? darkenHex(newColor, 35) : prev.secondaryColor,
    }));
  }

  // Save handler
  async function handleSave() {
    if (!isPro) {
      setErrorMessage("Custom Pass Design is exclusive to Pro and higher tier plans.");
      return;
    }

    setErrorMessage("");
    setSaveSuccess(false);

    startTransition(async () => {
      if (mode === "event" && eventId) {
        const res = await updateEventPassDesign(
          eventId,
          inheritFromOrg ? null : design,
          inheritFromOrg
        );
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        }
      } else {
        const res = await updateProfilePassDesign(design);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 4000);
        }
      }
    });
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Non-pro banner if applicable */}
      {!isPro && (
        <div className="w-full bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-300/40 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-neutral-900">
                  Custom Pass Design · Pro Feature
                </h4>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Pro Only
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 max-w-xl">
                Upgrade to Pro to customize ticket themes, brand gradients, background textures,
                monochrome minimalism, conference badge layouts, and custom sponsor copy on every pass.
              </p>
            </div>
          </div>
          <Link
            href="/billing"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-sm"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Header & Mode info */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-brand" />
                  {mode === "event" ? "Event Pass Customizer" : "Global Pass Designer"}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {mode === "event"
                    ? "Customize the attendee ticket passes specifically for this event."
                    : "Configure the default pass theme, colors, and layout for all your events."}
                </p>
              </div>

              {/* Reset to Default Button */}
              <button
                type="button"
                onClick={() => setDesign({ ...DEFAULT_PASS_DESIGN })}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset defaults
              </button>
            </div>

            {/* If event mode, show Inherit toggle */}
            {mode === "event" && (
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5 mb-2 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-900">
                    Use organization default pass design
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    When active, this event inherits your organization-wide pass branding.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={inheritFromOrg}
                  onChange={(e) => setInheritFromOrg(e.target.checked)}
                  className="w-4 h-4 text-brand rounded focus:ring-brand"
                />
              </div>
            )}

            {/* Navigation Tabs */}
            {(!inheritFromOrg || mode === "profile") && (
              <div className="flex border-b border-neutral-100 mt-2 overflow-x-auto gap-1">
                {[
                  { id: "presets", label: "Presets", icon: Sparkles },
                  { id: "theme", label: "Theme", icon: Layout },
                  { id: "colors", label: "Colors", icon: Palette },
                  { id: "typography", label: "Style", icon: Layers },
                  { id: "content", label: "Content", icon: FileText },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                        isActive
                          ? "border-brand text-brand"
                          : "border-transparent text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {(!inheritFromOrg || mode === "profile") && (
            <>
              {/* TAB 1: CURATED PRESETS */}
              {activeTab === "presets" && (
                <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Curated Designer Presets
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      1-click apply professional styles designed for tech conferences, festivals, and VIP summits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PASS_DESIGN_PRESETS.map((p) => {
                      const isSelected =
                        design.theme === p.design.theme &&
                        design.primaryColor.toLowerCase() === p.design.primaryColor.toLowerCase();

                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectPreset(p.design)}
                          className={`p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 transition-all hover:border-neutral-400 ${
                            isSelected
                              ? "border-brand bg-brand/5 ring-2 ring-brand/15"
                              : "border-neutral-200 bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-7 h-7 rounded-lg shrink-0 shadow-xs border border-white/20"
                              style={{
                                background: `linear-gradient(135deg, ${p.design.primaryColor} 0%, ${p.design.secondaryColor} 100%)`,
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-neutral-900">
                                  {p.name}
                                </span>
                                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                                  {p.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                                {p.description}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: THEME SELECTION */}
              {activeTab === "theme" && (
                <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Ticket Card Theme
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Select the architectural layout and cutout styling of the digital ticket.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {THEMES.map((theme) => {
                      const isSelected = design.theme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setDesign((prev) => ({ ...prev, theme: theme.id }))}
                          className={`p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all ${
                            isSelected
                              ? "border-brand bg-brand/5 ring-2 ring-brand/15"
                              : "border-neutral-200 hover:border-neutral-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{theme.icon}</span>
                            <div>
                              <p className="text-xs font-bold text-neutral-900">{theme.label}</p>
                              <p className="text-[11px] text-neutral-500 mt-0.5">
                                {theme.desc}
                              </p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: COLORS & GRADIENTS */}
              {activeTab === "colors" && (
                <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Brand Palette & Gradients
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Customize the primary brand color and secondary gradient depth.
                    </p>
                  </div>

                  {/* Quick Color Swatches */}
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-2">
                      Popular Palette Swatches
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_SWATCHES.map((swatch) => (
                        <button
                          key={swatch}
                          type="button"
                          onClick={() => handlePrimaryColorChange(swatch)}
                          className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 flex items-center justify-center border border-black/10 ${
                            design.primaryColor.toLowerCase() === swatch.toLowerCase()
                              ? "ring-2 ring-offset-2 ring-brand scale-105"
                              : ""
                          }`}
                          style={{ backgroundColor: swatch }}
                        >
                          {design.primaryColor.toLowerCase() === swatch.toLowerCase() && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white drop-shadow" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Color Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-700">
                        Primary Color (Hex)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={design.primaryColor}
                          onChange={(e) => handlePrimaryColorChange(e.target.value)}
                          className="w-10 h-10 rounded-xl border border-neutral-200 cursor-pointer p-0.5 bg-white shrink-0"
                        />
                        <input
                          type="text"
                          value={design.primaryColor}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                              handlePrimaryColorChange(val);
                            }
                          }}
                          className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs font-mono uppercase bg-white focus:outline-brand"
                          maxLength={7}
                        />
                      </div>
                    </div>

                    {/* Secondary Color Picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-neutral-700">
                        Secondary / Gradient Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={design.secondaryColor}
                          onChange={(e) =>
                            setDesign((prev) => ({ ...prev, secondaryColor: e.target.value }))
                          }
                          className="w-10 h-10 rounded-xl border border-neutral-200 cursor-pointer p-0.5 bg-white shrink-0"
                        />
                        <input
                          type="text"
                          value={design.secondaryColor}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                              setDesign((prev) => ({ ...prev, secondaryColor: val }));
                            }
                          }}
                          className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-xs font-mono uppercase bg-white focus:outline-brand"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Header Style */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
                    <label className="text-xs font-semibold text-neutral-700">
                      Header Fill Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {HEADER_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() =>
                            setDesign((prev) => ({ ...prev, headerStyle: style.id }))
                          }
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            design.headerStyle === style.id
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PATTERN & TYPOGRAPHY */}
              {activeTab === "typography" && (
                <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                  {/* Pattern */}
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                      Background Pattern Texture
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PATTERNS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setDesign((prev) => ({ ...prev, pattern: p.id }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                            design.pattern === p.id
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family */}
                  <div className="pt-2 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                      Typography Font Family
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {FONTS.map((font) => (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() =>
                            setDesign((prev) => ({ ...prev, fontFamily: font.id }))
                          }
                          className={`p-3 rounded-xl border text-left transition-all ${
                            design.fontFamily === font.id
                              ? "border-brand bg-brand/5 text-brand"
                              : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                          }`}
                        >
                          <p className="text-xs font-bold">{font.label}</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{font.sample}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="pt-2 border-t border-neutral-100 flex flex-col gap-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-xs font-semibold text-neutral-800">
                          Ambient Accent Glow
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Renders a soft ambient halo matching your brand palette.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={design.accentGlow}
                        onChange={(e) =>
                          setDesign((prev) => ({ ...prev, accentGlow: e.target.checked }))
                        }
                        className="w-4 h-4 text-brand rounded focus:ring-brand"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-xs font-semibold text-neutral-800">
                          QR Code Accent Frame
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Highlights the entry QR code with your brand color border.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={design.showQrBorder}
                        onChange={(e) =>
                          setDesign((prev) => ({ ...prev, showQrBorder: e.target.checked }))
                        }
                        className="w-4 h-4 text-brand rounded focus:ring-brand"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 5: CONTENT & COPY */}
              {activeTab === "content" && (
                <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Pass Text & Custom Copy
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Tailor the badge ribbon title, disclaimers, and optional cover banner.
                    </p>
                  </div>

                  {/* Badge Label */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-700">
                      Badge Ribbon Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VIP DELEGATE, ALL-ACCESS PASS, SPEAKER"
                      value={design.badgeLabel || ""}
                      onChange={(e) =>
                        setDesign((prev) => ({ ...prev, badgeLabel: e.target.value }))
                      }
                      maxLength={32}
                      className="border border-neutral-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-brand"
                    />
                    <p className="text-[11px] text-neutral-400">
                      Appears in the header badge pill across all attendee passes.
                    </p>
                  </div>

                  {/* Footer Note */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-700">
                      Custom Footer Disclaimer or Sponsor Note
                    </label>
                    <textarea
                      placeholder="e.g. Show at registration desk • Valid ID required • Sponsored by Acme"
                      value={design.footerNote || ""}
                      onChange={(e) =>
                        setDesign((prev) => ({ ...prev, footerNote: e.target.value }))
                      }
                      maxLength={160}
                      rows={2}
                      className="border border-neutral-200 rounded-xl p-3 text-xs bg-white focus:outline-brand resize-none"
                    />
                    <p className="text-[11px] text-neutral-400">
                      Displayed on the attendee pass below the entry status strip.
                    </p>
                  </div>

                  {/* Banner Image URL */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-neutral-700">
                      Cover Banner Image URL <span className="text-neutral-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/banner.png"
                      value={design.bannerUrl || ""}
                      onChange={(e) =>
                        setDesign((prev) => ({ ...prev, bannerUrl: e.target.value }))
                      }
                      className="border border-neutral-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-brand"
                    />
                    <p className="text-[11px] text-neutral-400">
                      Direct HTTPS link to an image shown as a header banner on the pass.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Bar */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-500">
              {saveSuccess && (
                <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Custom pass design saved successfully!
                </span>
              )}
              {errorMessage && (
                <span className="text-red-600 font-medium">{errorMessage}</span>
              )}
              {!saveSuccess && !errorMessage && (
                <span>Changes will apply instantly to all newly viewed passes.</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || (!isPro && !inheritFromOrg)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand text-white font-bold text-xs hover:bg-brand/90 transition-all disabled:opacity-50 shadow-sm"
            >
              {isPending ? "Saving..." : "Save Pass Design"}
            </button>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full sticky top-8 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand" />
                Live Pass Preview
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                Mobile View
              </span>
            </div>

            {/* Render Live Pass Preview */}
            <div className="w-full py-4 flex justify-center">
              <PassPreviewCard
                design={inheritFromOrg && orgDefaultDesign ? orgDefaultDesign : design}
                orgName={orgName}
                orgLogoUrl={orgLogoUrl}
                eventName={eventName}
                eventDate={eventDate}
                venue={venue}
                attendeeName="Arun Kumar"
                attendeeEmail="arun.kumar@example.com"
                shortCode="8F42-99B1"
              />
            </div>

            <p className="text-[11px] text-neutral-400 text-center mt-3">
              This preview reflects the real-time design rendered on attendee passes and wallet links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
