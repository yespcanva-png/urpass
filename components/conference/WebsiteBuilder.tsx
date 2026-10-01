"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  ExternalLink,
  Save,
  Loader2,
  CheckCircle2,
  Eye,
  Sliders,
  Palette,
  Layout,
  Share2,
  Search,
  MapPin,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import type { EventWebsite, WebsiteSectionConfig } from "@/types/conference";

interface WebsiteBuilderProps {
  eventId: string;
  eventName: string;
  initialWebsite: EventWebsite;
}

const DEFAULT_SECTIONS = [
  { key: "hero", label: "Hero Banner & CTA", defaultOrder: 1 },
  { key: "about", label: "About & Highlights", defaultOrder: 2 },
  { key: "agenda", label: "Interactive Schedule & Agenda", defaultOrder: 3 },
  { key: "speakers", label: "Keynote Speakers & Presenters", defaultOrder: 4 },
  { key: "venue", label: "Venue, Parking & Directions", defaultOrder: 5 },
  { key: "sponsors", label: "Sponsors & Partners", defaultOrder: 6 },
  { key: "faq", label: "Frequently Asked Questions", defaultOrder: 7 },
  { key: "tickets", label: "Tickets & Passes CTA", defaultOrder: 8 },
  { key: "contact", label: "Contact & Organiser Info", defaultOrder: 9 },
];

export default function WebsiteBuilder({
  eventId,
  eventName,
  initialWebsite,
}: WebsiteBuilderProps) {
  const [website, setWebsite] = useState<EventWebsite>(initialWebsite);
  const [slug, setSlug] = useState(initialWebsite.slug || "");
  const [customDomain, setCustomDomain] = useState(initialWebsite.custom_domain || "");
  const [theme, setTheme] = useState(initialWebsite.theme || "modern");
  const [primaryColour, setPrimaryColour] = useState(initialWebsite.primary_colour || "#6C63FF");
  const [secondaryColour, setSecondaryColour] = useState(initialWebsite.secondary_colour || "#0e0c16");
  const [heroImage, setHeroImage] = useState(initialWebsite.hero_image || "");
  const [published, setPublished] = useState(initialWebsite.published ?? true);
  const [seoTitle, setSeoTitle] = useState(initialWebsite.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(initialWebsite.seo_description || "");
  const [ctaText, setCtaText] = useState(initialWebsite.cta_text || "Register Now");
  const [footerText, setFooterText] = useState(initialWebsite.footer_text || "");

  const [socialLinks, setSocialLinks] = useState(
    initialWebsite.social_links || { twitter: "", linkedin: "", instagram: "", website: "" }
  );

  const [sectionsConfig, setSectionsConfig] = useState<Record<string, WebsiteSectionConfig>>(() => {
    const base = initialWebsite.sections_config || {};
    const merged: Record<string, WebsiteSectionConfig> = {};
    for (const def of DEFAULT_SECTIONS) {
      merged[def.key] = base[def.key] || { enabled: true, order: def.defaultOrder };
    }
    return merged;
  });

  const [activeTab, setActiveTab] = useState<"sections" | "branding" | "seo">("sections");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleSection(key: string) {
    setSectionsConfig((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key]?.enabled,
      },
    }));
  }

  function moveSection(key: string, direction: "up" | "down") {
    setSectionsConfig((prev) => {
      const keys = Object.keys(prev).sort((a, b) => (prev[a]?.order || 0) - (prev[b]?.order || 0));
      const idx = keys.indexOf(key);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= keys.length) return prev;

      const currentOrder = prev[key]?.order || idx;
      const targetKey = keys[targetIdx];
      const targetOrder = prev[targetKey]?.order || targetIdx;

      return {
        ...prev,
        [key]: { ...prev[key], order: targetOrder },
        [targetKey]: { ...prev[targetKey], order: currentOrder },
      };
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/events/${eventId}/website`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim(),
          custom_domain: customDomain.trim() || null,
          theme,
          primary_colour: primaryColour,
          secondary_colour: secondaryColour,
          hero_image: heroImage.trim() || null,
          published,
          seo_title: seoTitle.trim() || null,
          seo_description: seoDescription.trim() || null,
          sections_config: sectionsConfig,
          social_links: socialLinks,
          cta_text: ctaText.trim() || "Register Now",
          footer_text: footerText.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update website configuration.");
      }

      setWebsite(data.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const sortedSectionKeys = Object.keys(sectionsConfig).sort(
    (a, b) => (sectionsConfig[a]?.order || 0) - (sectionsConfig[b]?.order || 0)
  );

  const previewUrl = `/e/${slug || eventId}`;

  return (
    <div className="space-y-6">
      {/* ── Top Bar ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Event Website Builder
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                published
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-neutral-100 text-neutral-500"
              }`}
            >
              {published ? "Live & Published" : "Draft (Offline)"}
            </span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Public Website & Landing Page
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Public URL:{" "}
            <Link
              href={previewUrl}
              target="_blank"
              className="text-purple-600 hover:underline font-mono"
            >
              urpass.space/e/{slug || eventId}
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={previewUrl}
            target="_blank"
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            View Live Site
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* ── Tabs Navigation ───────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 ${
            activeTab === "sections"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          Sections & Blocks
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 ${
            activeTab === "branding"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Branding & Theme
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5 ${
            activeTab === "seo"
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          URL, Domain & SEO
        </button>
      </div>

      {/* ── TAB 1: SECTIONS & BLOCKS ──────────────────────────── */}
      {activeTab === "sections" && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Website Sections & Hierarchy</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Toggle visibility and change the display order of sections on your public conference page.
            </p>
          </div>

          <div className="space-y-2.5">
            {sortedSectionKeys.map((key, index) => {
              const def = DEFAULT_SECTIONS.find((d) => d.key === key);
              const config = sectionsConfig[key];
              const isEnabled = config?.enabled !== false;

              return (
                <div
                  key={key}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isEnabled
                      ? "bg-neutral-50/70 border-neutral-200"
                      : "bg-neutral-100/40 border-neutral-200/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-xs font-mono font-bold text-neutral-500">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">
                        {def?.label || key.toUpperCase()}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {isEnabled ? "Visible on public site" : "Hidden from attendees"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveSection(key, "up")}
                      disabled={index === 0}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-800 disabled:opacity-30 hover:bg-white"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(key, "down")}
                      disabled={index === sortedSectionKeys.length - 1}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-800 disabled:opacity-30 hover:bg-white"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSection(key)}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors ${
                        isEnabled
                          ? "bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-100"
                          : "bg-neutral-200 text-neutral-600 border-transparent hover:bg-neutral-300"
                      }`}
                    >
                      {isEnabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Primary Call to Action (CTA) Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Register Now / Get Your Pass"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Footer Copyright & Note
              </label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="© 2026 Acme Corp. All rights reserved."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: BRANDING & THEME ───────────────────────────── */}
      {activeTab === "branding" && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-xs space-y-5">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Visual Styling & Brand Colors</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Customize the look and feel of your conference landing page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "modern", label: "Modern Dark", desc: "Sleek dark gradient theme" },
              { id: "minimal", label: "Minimalist Light", desc: "Clean white editorial layout" },
              { id: "vibrant", label: "Vibrant Summit", desc: "Bold purple and neon accents" },
            ].map((t) => (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  theme === t.id
                    ? "border-neutral-900 bg-neutral-50 shadow-xs"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <p className="text-xs font-bold text-neutral-900">{t.label}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Primary Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColour}
                  onChange={(e) => setPrimaryColour(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-200 p-0.5"
                />
                <input
                  type="text"
                  value={primaryColour}
                  onChange={(e) => setPrimaryColour(e.target.value)}
                  className="text-xs font-mono px-3.5 py-2.5 rounded-xl border border-neutral-200 w-32 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Secondary / Background Accent
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColour}
                  onChange={(e) => setSecondaryColour(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-neutral-200 p-0.5"
                />
                <input
                  type="text"
                  value={secondaryColour}
                  onChange={(e) => setSecondaryColour(e.target.value)}
                  className="text-xs font-mono px-3.5 py-2.5 rounded-xl border border-neutral-200 w-32 uppercase"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Hero Banner Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or hosted banner"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Social Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Twitter / X Profile
                </label>
                <input
                  type="text"
                  placeholder="https://x.com/yourhandle"
                  value={socialLinks.twitter || ""}
                  onChange={(e) =>
                    setSocialLinks((prev) => ({ ...prev, twitter: e.target.value }))
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  LinkedIn Company or Event Page
                </label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/company/yourorg"
                  value={socialLinks.linkedin || ""}
                  onChange={(e) =>
                    setSocialLinks((prev) => ({ ...prev, linkedin: e.target.value }))
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-200"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: URL, DOMAIN & SEO ──────────────────────────── */}
      {activeTab === "seo" && (
        <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">URL, Custom Domain & Search Engine Optimization</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Control the public slug, discoverability, and custom CNAME domain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                UrPass Website Slug *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-neutral-100 border border-r-0 border-neutral-200 text-xs text-neutral-500 rounded-l-xl font-mono">
                  urpass.space/e/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 text-sm px-3.5 py-2.5 rounded-r-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Enterprise Custom Domain
              </label>
              <input
                type="text"
                placeholder="e.g. summit.company.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              SEO Page Title
            </label>
            <input
              type="text"
              placeholder={`${eventName} — Official Event Website`}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              SEO Meta Description
            </label>
            <textarea
              rows={2}
              placeholder="Join top industry leaders, keynote speakers, and innovators..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 border-neutral-300"
              />
              <span className="text-xs font-semibold text-neutral-800">
                Publish website publicly (accessible to all attendees)
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
