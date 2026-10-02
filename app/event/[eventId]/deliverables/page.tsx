"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Award,
  ArrowLeft,
  Search,
  Filter,
  Layers,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { EventSponsor, SponsorshipTier, SponsorDeliverablesStatus } from "@/lib/exhibitor-sponsor/types";

const DELIVERABLE_KEYS: { key: keyof SponsorDeliverablesStatus; label: string; description: string }[] = [
  { key: "logoReceived", label: "Vector Logo File", description: "High-resolution SVG/PNG assets" },
  { key: "bannerReceived", label: "Banner & Collateral", description: "Stage banners & booth backdrops" },
  { key: "boothConfirmed", label: "Exhibition Booth", description: "Floor space assigned & confirmed" },
  { key: "emailInclusion", label: "Email Newsletter", description: "Dedicated sponsor section in EDM" },
  { key: "stageBranding", label: "Stage & AV Branding", description: "Plenary screen loops & podium signs" },
  { key: "socialMention", label: "Social Shoutout", description: "LinkedIn & Twitter partner feature" },
];

export default function SponsorDeliverablesPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [sponsors, setSponsors] = useState<EventSponsor[]>([]);
  const [tiers, setTiers] = useState<SponsorshipTier[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTierFilter, setSelectedTierFilter] = useState("all");
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const loadData = () => {
    fetch(`/api/event/${eventId}/sponsors`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.sponsors) setSponsors(d.sponsors);
          if (d.tiers) setTiers(d.tiers);
        }
      });
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleToggleDeliverable = async (
    sponsorId: string,
    key: keyof SponsorDeliverablesStatus,
    currentVal: boolean
  ) => {
    const nextVal = !currentVal;
    setUpdatingKey(`${sponsorId}-${key}`);

    // Optimistic UI update
    setSponsors((prev) =>
      prev.map((s) =>
        s.id === sponsorId
          ? {
              ...s,
              deliverablesStatus: {
                ...s.deliverablesStatus,
                [key]: nextVal,
              },
            }
          : s
      )
    );

    try {
      const res = await fetch(`/api/event/${eventId}/sponsors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_deliverable",
          sponsorId,
          deliverableKey: key,
          deliverableStatus: nextVal,
          staffName: "Deliverables Coordinator",
        }),
      });
      const data = await res.json();
      if (!data.success) {
        // Rollback on failure
        loadData();
      }
    } catch {
      loadData();
    } finally {
      setUpdatingKey(null);
    }
  };

  const filteredSponsors = sponsors.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tierName && s.tierName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTier = selectedTierFilter === "all" || s.tierId === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  const totalPossibleDeliverables = sponsors.length * DELIVERABLE_KEYS.length;
  const totalCompletedDeliverables = sponsors.reduce((sum, s) => {
    const st = s.deliverablesStatus || {};
    return sum + Object.values(st).filter(Boolean).length;
  }, 0);
  const overallCompletionPct =
    totalPossibleDeliverables > 0 ? Math.round((totalCompletedDeliverables / totalPossibleDeliverables) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/event/${eventId}/sponsors-admin`}
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Sponsors
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Contract Fulfillment
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-600" />
            Sponsor Deliverables Fulfillment Matrix
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Real-time verification checklist for partner brand assets, booths, keynote slots, and collateral.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/event/${eventId}/sponsors-admin`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-2xs transition-all"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Manage Partner Profiles
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Overall Fulfillment</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{overallCompletionPct}%</div>
          <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-600 h-1.5 rounded-full transition-all" style={{ width: `${overallCompletionPct}%` }} />
          </div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Completed Assets</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">{totalCompletedDeliverables}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Out of {totalPossibleDeliverables} items</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Pending Deliverables</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {totalPossibleDeliverables - totalCompletedDeliverables}
          </div>
          <div className="text-xs text-neutral-400 mt-0.5">Awaiting partner assets</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Active Partners</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">{sponsors.length}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Sponsors tracked</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sponsor or tier..."
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

      {/* Deliverables Matrix Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 min-w-[200px]">Partner & Tier</th>
                <th className="py-3 px-4 text-center">Progress</th>
                {DELIVERABLE_KEYS.map((col) => (
                  <th key={col.key} className="py-3 px-3 text-center min-w-[130px]" title={col.description}>
                    <div className="text-[11px] font-semibold text-neutral-700">{col.label}</div>
                    <div className="text-[9px] font-normal text-neutral-400">{col.description}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredSponsors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-400">
                    <FileCheck className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    No sponsors matching your filter criteria.
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
                  const completed = Object.values(delivs).filter(Boolean).length;
                  const pct = Math.round((completed / DELIVERABLE_KEYS.length) * 100);

                  return (
                    <tr key={sponsor.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-neutral-900">
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
                            <div className="font-semibold text-neutral-950">{sponsor.name}</div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              {sponsor.tierName || "Custom"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`text-xs font-bold ${
                              pct === 100 ? "text-emerald-700" : pct >= 50 ? "text-neutral-900" : "text-amber-700"
                            }`}
                          >
                            {pct}%
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {completed}/{DELIVERABLE_KEYS.length}
                          </span>
                        </div>
                      </td>

                      {DELIVERABLE_KEYS.map((col) => {
                        const isDone = Boolean(delivs[col.key]);
                        const isUpdating = updatingKey === `${sponsor.id}-${col.key}`;

                        return (
                          <td key={col.key} className="py-3 px-3 text-center">
                            <button
                              disabled={isUpdating}
                              onClick={() => handleToggleDeliverable(sponsor.id, col.key, isDone)}
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
                                isDone
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-2xs"
                                  : "bg-neutral-50 text-neutral-300 border-neutral-200 hover:text-neutral-500 hover:bg-neutral-100"
                              } ${isUpdating ? "opacity-40 animate-pulse" : ""}`}
                              title={`Click to mark ${col.label} as ${isDone ? "Pending" : "Received"}`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-neutral-400" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
