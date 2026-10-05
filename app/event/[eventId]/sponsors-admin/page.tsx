"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Globe,
  Mail,
  Shield,
  Eye,
  MousePointerClick,
  FileCheck,
  Building2,
  Phone,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { SponsorshipTier, EventSponsor } from "@/lib/exhibitor-sponsor/types";

export default function SponsorsAdminPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [tiers, setTiers] = useState<SponsorshipTier[]>([]);
  const [sponsors, setSponsors] = useState<EventSponsor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTierFilter, setSelectedTierFilter] = useState("all");

  // Sponsor Modal State
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<EventSponsor | null>(null);
  const [sponsorName, setSponsorName] = useState("");
  const [tierId, setTierId] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState({
    homepage: true,
    eventWebsite: true,
    agenda: true,
    session: false,
    email: true,
    badge: false,
    app: true,
  });

  // Tier Modal State
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<SponsorshipTier | null>(null);
  const [tierName, setTierName] = useState("");
  const [tierPrice, setTierPrice] = useState(100000);
  const [tierCurrency, setTierCurrency] = useState("INR");
  const [tierMaxSponsors, setTierMaxSponsors] = useState(4);
  const [tierBenefits, setTierBenefits] = useState("");
  const [tierPlacements, setTierPlacements] = useState({
    homepage: true,
    eventWebsite: true,
    agenda: true,
    session: false,
    email: true,
    badge: false,
    app: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState("");

  const loadData = () => {
    fetch(`/api/event/${eventId}/sponsors`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.tiers) setTiers(d.tiers);
          if (d.sponsors) setSponsors(d.sponsors);
        }
      });
  };

  const handleSeedDefaultTiers = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/event/${eventId}/sponsors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed_default_tiers" }),
      });
      const d = await res.json();
      if (d.success && d.tiers) {
        setTiers(d.tiers);
      }
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoFileSelected = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoUploadError("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    setLogoUploadError("");
    setIsUploadingLogo(true);
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
        reader.onload = (e) => {
          if (e.target?.result) setLogoUrl(e.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setLogoUrl(e.target.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  // Open Sponsor Modal
  const handleOpenAddSponsor = () => {
    setEditingSponsor(null);
    setSponsorName("");
    setTierId(tiers.length > 0 ? tiers[0].id : "");
    setLogoUrl("");
    setWebsiteUrl("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setDescription("");
    setVisibility({
      homepage: true,
      eventWebsite: true,
      agenda: true,
      session: false,
      email: true,
      badge: false,
      app: true,
    });
    setSponsorModalOpen(true);
  };

  const handleOpenEditSponsor = (s: EventSponsor) => {
    setEditingSponsor(s);
    setSponsorName(s.name);
    setTierId(s.tierId || (tiers[0] ? tiers[0].id : ""));
    setLogoUrl(s.logoUrl || "");
    setWebsiteUrl(s.websiteUrl || "");
    setContactName(s.contactName || "");
    setContactEmail(s.contactEmail || "");
    setContactPhone(s.contactPhone || "");
    setDescription(s.description || "");
    setVisibility(
      s.visibilitySettings || {
        homepage: true,
        eventWebsite: true,
        agenda: true,
        session: false,
        email: true,
        badge: false,
        app: true,
      }
    );
    setSponsorModalOpen(true);
  };

  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const selectedTier = tiers.find((t) => t.id === tierId);
      const res = await fetch(`/api/event/${eventId}/sponsors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_sponsor",
          sponsor: {
            id: editingSponsor ? editingSponsor.id : undefined,
            eventId,
            name: sponsorName,
            tierId,
            tierName: selectedTier ? selectedTier.name : "Custom",
            logoUrl,
            websiteUrl,
            contactName,
            contactEmail,
            contactPhone,
            description,
            visibilitySettings: visibility,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSponsorModalOpen(false);
        loadData();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSponsor = async (sponsorId: string) => {
    if (!confirm("Are you sure you want to remove this sponsor?")) return;
    const res = await fetch(`/api/event/${eventId}/sponsors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete_sponsor",
        sponsorId,
      }),
    });
    const d = await res.json();
    if (d.success) loadData();
  };

  // Open Tier Modal
  const handleOpenAddTier = () => {
    setEditingTier(null);
    setTierName("");
    setTierPrice(100000);
    setTierCurrency("INR");
    setTierMaxSponsors(4);
    setTierBenefits("Logo on official website\nExhibition Booth space\nEmail inclusions");
    setTierPlacements({
      homepage: true,
      eventWebsite: true,
      agenda: true,
      session: false,
      email: true,
      badge: false,
      app: true,
    });
    setTierModalOpen(true);
  };

  const handleOpenEditTier = (t: SponsorshipTier) => {
    setEditingTier(t);
    setTierName(t.name);
    setTierPrice(t.price);
    setTierCurrency(t.currency || "INR");
    setTierMaxSponsors(t.maxSponsors);
    setTierBenefits((t.benefits || []).join("\n"));
    setTierPlacements(
      t.logoPlacementRules || {
        homepage: true,
        eventWebsite: true,
        agenda: true,
        session: false,
        email: true,
        badge: false,
        app: true,
      }
    );
    setTierModalOpen(true);
  };

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const benefitsArr = tierBenefits
        .split("\n")
        .map((b) => b.trim())
        .filter(Boolean);

      const res = await fetch(`/api/event/${eventId}/sponsors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_tier",
          tier: {
            id: editingTier ? editingTier.id : undefined,
            eventId,
            name: tierName,
            price: Number(tierPrice),
            currency: tierCurrency,
            maxSponsors: Number(tierMaxSponsors),
            benefits: benefitsArr,
            logoPlacementRules: tierPlacements,
          },
        }),
      });
      const d = await res.json();
      if (d.success) {
        setTierModalOpen(false);
        loadData();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTier = async (tierIdToDelete: string) => {
    if (!confirm("Are you sure you want to delete this sponsorship tier?")) return;
    const res = await fetch(`/api/event/${eventId}/sponsors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete_tier",
        tierId: tierIdToDelete,
      }),
    });
    const d = await res.json();
    if (d.success) loadData();
  };

  const filteredSponsors = sponsors.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.contactName && s.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.tierName && s.tierName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTier = selectedTierFilter === "all" || s.tierId === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  const totalRevenue = sponsors.reduce((acc, s) => {
    const tier = tiers.find((t) => t.id === s.tierId);
    return acc + (tier ? tier.price : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              Commercial Operations
            </span>
            <span className="text-xs text-neutral-400">Stage 3 Enterprise</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            Sponsorship Management & Tiers
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Configure partner tiers, deliverables checklist, placement permissions, and track live engagement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/event/${eventId}/deliverables`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-2xs transition-all"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            Deliverables Tracker
            <ArrowRight className="w-3 h-3 text-neutral-400" />
          </Link>
          <button
            onClick={handleOpenAddTier}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-600" />
            Add Tier
          </button>
          <button
            onClick={handleOpenAddSponsor}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Sponsor
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Active Sponsors</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">{sponsors.length}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Across {tiers.length} defined tiers</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Committed Value</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">₹{totalRevenue.toLocaleString("en-IN")}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Sponsorship contract book</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Digital Impressions</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">
            {sponsors.reduce((sum, s) => sum + (s.pageViews || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400 mt-0.5">Web + Agenda + App views</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Asset Clicks</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">
            {sponsors.reduce((sum, s) => sum + (s.bannerClicks || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-neutral-400 mt-0.5">Direct partner traffic</div>
        </div>
      </div>

      {/* Sponsorship Tiers Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-neutral-700" />
            Configured Sponsorship Packages ({tiers.length})
          </h2>
          {tiers.length > 0 && (
            <button
              onClick={handleOpenAddTier}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Package
            </button>
          )}
        </div>

        {tiers.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-neutral-200 rounded-2xl bg-white p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">No Sponsorship Packages Configured</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-0.5">
                Add custom sponsorship tiers with deliverables and branding rights, or load standard packages.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleOpenAddTier}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Package
              </button>
              <button
                type="button"
                onClick={handleSeedDefaultTiers}
                disabled={isSaving}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Load Standard Packages
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {tiers.map((tier) => {
              const sponsorsInTier = sponsors.filter((s) => s.tierId === tier.id);
              const isFull = sponsorsInTier.length >= tier.maxSponsors;

              return (
                <div
                  key={tier.id}
                  className="p-4 bg-white border border-neutral-200/80 rounded-xl hover:border-neutral-300 transition-all shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm text-neutral-950">{tier.name}</h3>
                        <div className="text-lg font-bold text-neutral-900 mt-1">
                          {tier.currency} {tier.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditTier(tier)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                          title="Edit Tier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTier(tier.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete Tier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isFull
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {sponsorsInTier.length} / {tier.maxSponsors} Taken
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                        Included Deliverables
                      </div>
                      <ul className="space-y-1">
                        {(tier.benefits || []).slice(0, 3).map((b, i) => (
                          <li key={i} className="text-xs text-neutral-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-1.5 flex-wrap">
                    {tier.logoPlacementRules?.homepage && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                        Homepage
                      </span>
                    )}
                    {tier.logoPlacementRules?.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded">
                        Badge
                      </span>
                    )}
                    {tier.logoPlacementRules?.agenda && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded">
                        Agenda
                      </span>
                    )}
                    {tier.logoPlacementRules?.app && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-purple-50 text-purple-800 rounded">
                        App
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sponsor, tier or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedTierFilter}
            onChange={(e) => setSelectedTierFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">All Tiers ({sponsors.length})</option>
            {tiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sponsors Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Sponsor Organization</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Deliverables</th>
                <th className="py-3 px-4">Visibility Placements</th>
                <th className="py-3 px-4">Digital Impressions</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredSponsors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400">
                    <Award className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    No sponsors matching your filter criteria. Click &quot;Add Sponsor&quot; to register a partner.
                  </td>
                </tr>
              ) : (
                filteredSponsors.map((sponsor) => {
                  const delivs = sponsor.deliverablesStatus || {
                    logoReceived: false,
                    bannerReceived: false,
                    boothConfirmed: false,
                    emailInclusion: false,
                    stageBranding: false,
                    socialMention: false,
                  };
                  const completedCount = Object.values(delivs).filter(Boolean).length;
                  const totalDeliverables = Object.keys(delivs).length;

                  return (
                    <tr key={sponsor.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-neutral-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-700 shrink-0 overflow-hidden">
                            {sponsor.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain p-0.5" />
                            ) : (
                              sponsor.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-950 flex items-center gap-1.5">
                              {sponsor.name}
                              {sponsor.websiteUrl && (
                                <a
                                  href={sponsor.websiteUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-neutral-400 hover:text-neutral-700"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate max-w-xs">{sponsor.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          {sponsor.tierName || "Custom"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Link
                          href={`/event/${eventId}/deliverables`}
                          className="group inline-flex items-center gap-2 hover:opacity-80"
                        >
                          <div className="w-16 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-1.5 rounded-full transition-all"
                              style={{ width: `${(completedCount / totalDeliverables) * 100}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-neutral-600 group-hover:text-emerald-700">
                            {completedCount}/{totalDeliverables}
                          </span>
                        </Link>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {sponsor.visibilitySettings?.homepage && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">
                              Home
                            </span>
                          )}
                          {sponsor.visibilitySettings?.agenda && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">
                              Agenda
                            </span>
                          )}
                          {sponsor.visibilitySettings?.badge && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">
                              Badge
                            </span>
                          )}
                          {sponsor.visibilitySettings?.app && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600">
                              App
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-neutral-600" title="Page Views">
                            <Eye className="w-3 h-3 text-neutral-400" />
                            <span>{(sponsor.pageViews || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-600" title="Banner Clicks">
                            <MousePointerClick className="w-3 h-3 text-neutral-400" />
                            <span>{(sponsor.bannerClicks || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-neutral-900 font-medium">{sponsor.contactName || "—"}</div>
                        <div className="text-[11px] text-neutral-400">{sponsor.contactEmail}</div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditSponsor(sponsor)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSponsor(sponsor.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sponsor Intake / Edit Modal */}
      {sponsorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-950 mb-1">
              {editingSponsor ? "Edit Sponsor Profile" : "Register Event Sponsor"}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Add corporate partner details, designate sponsorship tier, and configure digital placement permissions.
            </p>

            <form onSubmit={handleSaveSponsor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Company / Sponsor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud, Intel Technologies"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Sponsorship Tier *</label>
                  <select
                    value={tierId}
                    onChange={(e) => setTierId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    {tiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (₹{t.price.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Sponsor Brand Logo (PNG / SVG / WebP)
                </label>
                {logoUploadError && (
                  <p className="text-[11px] text-rose-600 mb-1.5">{logoUploadError}</p>
                )}
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <div className="relative w-14 h-14 rounded-xl border border-neutral-200 bg-neutral-50 p-1.5 flex items-center justify-center shrink-0">
                      <img src={logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setLogoUrl("")}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : null}
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer transition-colors border border-neutral-200">
                      {isUploadingLogo ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-600" />
                      ) : (
                        <Upload className="w-3.5 h-3.5 text-neutral-600" />
                      )}
                      <span>{isUploadingLogo ? "Uploading..." : logoUrl ? "Change Logo File" : "Upload Logo File"}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        disabled={isUploadingLogo}
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleLogoFileSelected(f);
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or paste https://company.com/logo.png"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full px-3 py-1 text-[11px] bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="Lead POC"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="poc@partner.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91..."
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Description / Tagline</label>
                <textarea
                  rows={2}
                  placeholder="Global cloud computing platform powering enterprise workloads."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">Logo Placement Permissions</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(visibility).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => setVisibility({ ...visibility, [key]: e.target.checked })}
                        className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSponsorModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingSponsor ? "Update Sponsor" : "Register Sponsor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tier Create / Edit Modal */}
      {tierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-950 mb-1">
              {editingTier ? "Edit Sponsorship Tier" : "Create Sponsorship Tier"}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Define partnership tier pricing, allocation cap, and deliverables matrix.
            </p>

            <form onSubmit={handleSaveTier} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Tier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Platinum Title Partner"
                  value={tierName}
                  onChange={(e) => setTierName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Price *</label>
                  <input
                    type="number"
                    required
                    value={tierPrice}
                    onChange={(e) => setTierPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={tierCurrency}
                    onChange={(e) => setTierCurrency(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Max Cap</label>
                  <input
                    type="number"
                    value={tierMaxSponsors}
                    onChange={(e) => setTierMaxSponsors(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Deliverables & Benefits (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={tierBenefits}
                  onChange={(e) => setTierBenefits(e.target.value)}
                  placeholder="Logo on Website&#10;Keynote Stage Mention&#10;400 sq.ft Island Booth"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-2">Default Logo Placements</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(tierPlacements).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => setTierPlacements({ ...tierPlacements, [key]: e.target.checked })}
                        className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setTierModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingTier ? "Update Tier" : "Create Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
