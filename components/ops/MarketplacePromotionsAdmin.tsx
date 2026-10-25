"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Plus,
  Play,
  Pause,
  Archive,
  BarChart2,
  MousePointer,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Loader2,
  X,
  Edit3,
} from "lucide-react";
import type { AdCampaign, AdPlacement, CampaignType, CampaignStatus, AdPerformanceRow } from "@/lib/explore/ads-types";
import {
  saveAdminCampaignAction,
  toggleCampaignStatusAction,
  uploadCampaignCreativeAction,
} from "@/app/actions/explore-ads";
import { EXPLORE_CITIES } from "@/lib/explore/types";

interface Props {
  initialCampaigns: AdCampaign[];
  initialPerformance: AdPerformanceRow[];
}

export default function MarketplacePromotionsAdmin({
  initialCampaigns,
  initialPerformance,
}: Props) {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(initialCampaigns);
  const [selectedPlacement, setSelectedPlacement] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Partial<AdCampaign> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [placement, setPlacement] = useState<AdPlacement>("hero");
  const [campaignType, setCampaignType] = useState<CampaignType>("brand_sponsor");
  const [advertiserName, setAdvertiserName] = useState("");
  const [desktopImageUrl, setDesktopImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [eventId, setEventId] = useState("");
  const [badgeLabel, setBadgeLabel] = useState("Sponsored");
  const [ctaText, setCtaText] = useState("Learn More");
  const [destinationUrl, setDestinationUrl] = useState("/explore");
  const [cityTargeting, setCityTargeting] = useState<string[]>(["All Cities"]);
  const [priority, setPriority] = useState<number>(50);
  const [startsAt, setStartsAt] = useState(new Date().toISOString().split("T")[0]);
  const [endsAt, setEndsAt] = useState("");

  // Aggregate Metrics
  const totalImpressions = campaigns.reduce((acc, c) => acc + (c.impressionsCount || 0), 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + (c.clicksCount || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
  const activeCount = campaigns.filter((c) => c.status === "active").length;

  const openCreateModal = () => {
    setEditingCampaign(null);
    setTitle("");
    setDescription("");
    setPlacement("hero");
    setCampaignType("brand_sponsor");
    setAdvertiserName("");
    setDesktopImageUrl("");
    setMobileImageUrl("");
    setEventId("");
    setBadgeLabel("Sponsored");
    setCtaText("Learn More");
    setDestinationUrl("/explore");
    setCityTargeting(["All Cities"]);
    setPriority(50);
    setStartsAt(new Date().toISOString().split("T")[0]);
    setEndsAt("");
    setIsModalOpen(true);
  };

  const openEditModal = (c: AdCampaign) => {
    setEditingCampaign(c);
    setTitle(c.title);
    setDescription(c.description || "");
    setPlacement(c.placement);
    setCampaignType(c.campaignType);
    setAdvertiserName(c.advertiserName);
    setDesktopImageUrl(c.desktopImageUrl);
    setMobileImageUrl(c.mobileImageUrl || "");
    setEventId(c.eventId || "");
    setBadgeLabel(c.badgeLabel);
    setCtaText(c.ctaText);
    setDestinationUrl(c.destinationUrl);
    setCityTargeting(c.cityTargeting || ["All Cities"]);
    setPriority(c.priority);
    setStartsAt(c.startsAt ? c.startsAt.split("T")[0] : "");
    setEndsAt(c.endsAt ? c.endsAt.split("T")[0] : "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    startTransition(async () => {
      const payload: Partial<AdCampaign> = {
        ...(editingCampaign?.id ? { id: editingCampaign.id } : {}),
        title,
        description,
        placement,
        campaignType,
        advertiserName,
        desktopImageUrl,
        mobileImageUrl: mobileImageUrl.trim() || undefined,
        eventId: eventId.trim() || null,
        badgeLabel,
        ctaText,
        destinationUrl,
        cityTargeting,
        priority: Number(priority),
        startsAt: new Date(`${startsAt}T00:00:00.000Z`).toISOString(),
        endsAt: endsAt ? new Date(`${endsAt}T23:59:59.999Z`).toISOString() : null,
        status: editingCampaign?.status || "draft",
      };

      const res = await saveAdminCampaignAction(payload);
      if (res.success && res.campaign) {
        setStatusMessage({ type: "success", text: "Campaign saved." });
        setIsModalOpen(false);
        // Update local list
        setCampaigns((prev) => {
          const idx = prev.findIndex((c) => c.id === res.campaign!.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = res.campaign!;
            return next;
          }
          return [res.campaign!, ...prev];
        });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to save campaign." });
      }
    });
  };

  const handleToggleStatus = (campId: string, currentStatus: CampaignStatus) => {
    const nextStatus: CampaignStatus = currentStatus === "active" ? "paused" : "active";
    startTransition(async () => {
      const res = await toggleCampaignStatusAction(campId, nextStatus);
      if (res.success) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campId ? { ...c, status: nextStatus } : c))
        );
      }
    });
  };

  const handleUpload = (file: File, mobile: boolean) => {
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      const res = await uploadCampaignCreativeAction(formData);
      if (res.success && res.url) {
        if (mobile) setMobileImageUrl(res.url); else setDesktopImageUrl(res.url);
      } else setStatusMessage({ type: "error", text: res.error || "Upload failed." });
    });
  };

  const filtered = campaigns.filter((c) => {
    if (selectedPlacement === "all") return true;
    return c.placement === selectedPlacement;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight">
                Marketplace Promotions & Campaigns
              </h1>
              <p className="text-xs text-neutral-500">
                Manage promotional banners across UrPass Explore with viewability telemetry and city targeting.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-colors"
          >
            <span>Preview Explore</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Aggregate Performance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Campaigns</span>
            <Layers className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-black text-neutral-900">{activeCount}</p>
          <span className="text-[11px] text-neutral-500">out of {campaigns.length} total</span>
        </div>

        <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Verified Impressions</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-neutral-900">{totalImpressions.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500">50% viewable for 1+ sec</span>
        </div>

        <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">CTA Clicks</span>
            <MousePointer className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-neutral-900">{totalClicks.toLocaleString()}</p>
          <span className="text-[11px] text-neutral-500">Deduplicated clicks</span>
        </div>

        <div className="p-4 rounded-2xl border border-neutral-200 bg-white shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Click-Through</span>
            <BarChart2 className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-neutral-900">{avgCtr}%</p>
          <span className="text-[11px] text-neutral-500">Overall marketplace CTR</span>
        </div>
      </div>

      {/* Placement Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
        {[
          { key: "all", label: "All Placements" },
          { key: "hero", label: "Placement 1: Hero Banner (1920×600)" },
          { key: "top_sidebar", label: "Placement 2: Top Sidebar (600×350)" },
          { key: "in_content", label: "Placement 3: In-Content (1200×280)" },
          { key: "bottom_sidebar", label: "Placement 4: Bottom Sidebar (600×280)" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedPlacement(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedPlacement === tab.key
                ? "bg-violet-600 text-white shadow-xs"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns Table / Cards */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5" aria-label="Placement and city performance">
        <h2 className="text-sm font-bold text-neutral-900">Placement and city performance</h2>
        <p className="mt-1 text-xs text-neutral-500">Deduplicated viewable impressions and ad CTA clicks from the last 90 days.</p>
        {initialPerformance.length ? <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b text-neutral-500"><th className="py-2">Placement</th><th>City</th><th>Impressions</th><th>Clicks</th><th>CTR</th></tr></thead><tbody>{initialPerformance.map(row => <tr key={`${row.placement}-${row.city}`} className="border-b border-neutral-100"><td className="py-2">{row.placement}</td><td>{row.city}</td><td>{row.impressions.toLocaleString()}</td><td>{row.clicks.toLocaleString()}</td><td>{row.impressions ? ((row.clicks / row.impressions) * 100).toFixed(2) : "0.00"}%</td></tr>)}</tbody></table></div> : <p className="mt-4 text-xs text-neutral-500">No viewable ad activity yet.</p>}
      </section>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-neutral-400 text-xs">
            No campaigns configured for this placement. Click &quot;Create Campaign&quot; to add one.
          </div>
        ) : (
          filtered.map((c) => {
            const ctr =
              c.impressionsCount > 0
                ? ((c.clicksCount / c.impressionsCount) * 100).toFixed(2)
                : "0.00";
            return (
              <div
                key={c.id}
                className="p-4 sm:p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-neutral-300"
              >
                <div className="flex items-start gap-4">
                  {/* Creative Thumbnail */}
                  <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image
                      src={c.desktopImageUrl}
                      alt={c.title}
                      fill
                      unoptimized
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-100">
                        {c.placement}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                        {c.badgeLabel || "Sponsored"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          c.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {c.status}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Priority: <strong>{c.priority}</strong>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-1">
                      by {c.advertiserName} • Targets: {c.cityTargeting.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Metrics & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-neutral-400 text-[10px] block uppercase font-bold">Impressions</span>
                      <strong className="text-neutral-800">{c.impressionsCount.toLocaleString()}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 text-[10px] block uppercase font-bold">Clicks</span>
                      <strong className="text-emerald-700 font-bold">{c.clicksCount.toLocaleString()}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 text-[10px] block uppercase font-bold">CTR</span>
                      <strong className="text-neutral-900 font-bold">{ctr}%</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(c.id, c.status)}
                      title={c.status === "active" ? "Pause Campaign" : "Activate Campaign"}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
                        c.status === "active"
                          ? "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
                          : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                      }`}
                    >
                      {c.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(c)}
                      title="Edit Campaign"
                      className="p-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {c.status !== "archived" && <button type="button" title="Archive campaign" onClick={() => startTransition(async () => {
                      const res = await toggleCampaignStatusAction(c.id, "archived");
                      if (res.success) setCampaigns(prev => prev.map(item => item.id === c.id ? { ...item, status: "archived" } : item));
                      else setStatusMessage({ type: "error", text: res.error || "Could not archive campaign." });
                    })} className="p-2 rounded-xl bg-neutral-100 text-neutral-700 border border-neutral-200"><Archive className="w-3.5 h-3.5" /></button>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── CREATE / EDIT CAMPAIGN MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  {editingCampaign?.id ? "Edit Promotional Campaign" : "Create New Promotional Campaign"}
                </h2>
                <p className="text-xs text-neutral-500">
                  Targeted ad delivery across Explore discovery placements.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Campaign Placement *
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  >
                    <option value="hero">Placement 1: Hero Banner (1920×600)</option>
                    <option value="top_sidebar">Placement 2: Top Sidebar (600×350)</option>
                    <option value="in_content">Placement 3: In-Content Banner (1200×280)</option>
                    <option value="bottom_sidebar">Placement 4: Bottom Sidebar (600×280)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Advertiser / Brand Name *
                  </label>
                  <input
                    type="text"
                    value={advertiserName}
                    onChange={(e) => setAdvertiserName(e.target.value)}
                    required
                    placeholder="e.g. RedBull India or TechVentures"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-xs font-bold text-neutral-700">Desktop creative upload
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => { const file = e.target.files?.[0]; if (file) handleUpload(file, false); }} className="mt-1 block w-full text-xs" />
                </label>
                <label className="text-xs font-bold text-neutral-700">Mobile creative upload
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => { const file = e.target.files?.[0]; if (file) handleUpload(file, true); }} className="mt-1 block w-full text-xs" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Bangalore Tech & AI Summit 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Short Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Concise 1-2 sentence pitch..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Desktop Creative URL (High-Res) *
                  </label>
                  <input
                    type="url"
                    value={desktopImageUrl}
                    onChange={(e) => setDesktopImageUrl(e.target.value)}
                    required
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Destination URL (Safe URL) *
                  </label>
                  <input
                    type="text"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    required
                    placeholder="/explore or https://..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-xs font-bold text-neutral-700">Mobile creative URL
                  <input type="url" value={mobileImageUrl} onChange={e => setMobileImageUrl(e.target.value)} placeholder="Optional uploaded mobile image" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs" />
                </label>
                <label className="text-xs font-bold text-neutral-700">Linked approved event ID
                  <input type="text" value={eventId} onChange={e => setEventId(e.target.value)} placeholder="Optional event UUID" className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-xs" />
                </label>
              </div>
              {desktopImageUrl && <div className="grid grid-cols-2 gap-4" aria-label="Creative previews">
                <div><p className="mb-1 text-xs font-semibold">Desktop preview</p><div className="relative aspect-[16/6] rounded-xl overflow-hidden bg-neutral-100"><Image src={desktopImageUrl} alt="Desktop creative preview" fill unoptimized className="object-cover" /></div></div>
                <div><p className="mb-1 text-xs font-semibold">Mobile preview</p><div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100"><Image src={mobileImageUrl || desktopImageUrl} alt="Mobile creative preview" fill unoptimized className="object-cover" /></div></div>
              </div>}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={badgeLabel}
                    onChange={(e) => setBadgeLabel(e.target.value)}
                    placeholder="Sponsored"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Book Tickets"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Priority (1-100)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Campaign Starts (UTC)
                  </label>
                  <input
                    type="date"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Campaign Ends (UTC, inclusive)
                  </label>
                  <input
                    type="date"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </div>

              {/* City Targeting Multi-select */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Target Cities
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {EXPLORE_CITIES.map((c) => {
                    const isSelected = cityTargeting.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          if (c === "All Cities") {
                            setCityTargeting(["All Cities"]);
                          } else {
                            const withoutAll = cityTargeting.filter((x) => x !== "All Cities");
                            if (isSelected) {
                              const next = withoutAll.filter((x) => x !== c);
                              setCityTargeting(next.length > 0 ? next : ["All Cities"]);
                            } else {
                              setCityTargeting([...withoutAll, c]);
                            }
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          isSelected
                            ? "bg-violet-600 text-white"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-colors disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Campaign</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
