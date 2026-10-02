"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  Briefcase,
  Target,
  Calendar,
  Layers,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Shield,
  Download,
} from "lucide-react";
import { Stage3DashboardStats, EventExhibitor, EventSponsor, EventBooth, ExhibitorLead } from "@/lib/exhibitor-sponsor/types";
import { createClient } from "@/lib/supabase/client";

export default function ExhibitorsSponsorsHubPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [stats, setStats] = useState<Stage3DashboardStats>({
    totalExhibitors: 0,
    activeExhibitors: 0,
    totalSponsors: 0,
    totalBooths: 0,
    assignedBooths: 0,
    totalLeadsCaptured: 0,
    hotLeadsCount: 0,
    totalMeetingsRequested: 0,
    confirmedMeetingsCount: 0,
    sponsorImpressions: 0,
  });
  const [exhibitors, setExhibitors] = useState<EventExhibitor[]>([]);
  const [sponsors, setSponsors] = useState<EventSponsor[]>([]);
  const [booths, setBooths] = useState<EventBooth[]>([]);
  const [recentLeads, setRecentLeads] = useState<ExhibitorLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHubData = () => {
    setIsRefreshing(true);
    fetch(`/api/event/${eventId}/stage3`)
      .then((r) => r.json())
      .then((d) => {
        setIsLoading(false);
        setIsRefreshing(false);
        if (d.success) {
          if (d.stats) setStats(d.stats);
          if (d.exhibitors) setExhibitors(d.exhibitors);
          if (d.sponsors) setSponsors(d.sponsors);
          if (d.booths) setBooths(d.booths);
          if (d.recentLeads) setRecentLeads(d.recentLeads);
        }
      })
      .catch(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchHubData();

    const supabase = createClient();
    const channel = supabase
      .channel(`stage3-live-${eventId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "event_exhibitors", filter: `event_id=eq.${eventId}` }, () => {
        fetchHubData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "exhibitor_leads", filter: `event_id=eq.${eventId}` }, () => {
        fetchHubData();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "exhibitor_b2b_meetings", filter: `event_id=eq.${eventId}` }, () => {
        fetchHubData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const hotPct = stats.totalLeadsCaptured > 0 ? Math.round((stats.hotLeadsCount / stats.totalLeadsCaptured) * 100) : 0;
  const boothOccupancyPct = stats.totalBooths > 0 ? Math.round((stats.assignedBooths / stats.totalBooths) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
              STAGE 3 COMMERCIAL SUITE
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 font-mono">
              Live Trade Show &amp; Expo Layer
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Exhibitor, Sponsor &amp; Lead Capture Hub
          </h1>
          <p className="text-sm text-neutral-500">
            Orchestrate trade show booths, self-service exhibitor portals, sponsor tier deliverables, and high-velocity QR lead qualification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/event/${eventId}/directory`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Public Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
          <Link
            href={`/event/${eventId}/lead-retrieval`}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Lead Retrieval &amp; Export</span>
          </Link>
          <button
            onClick={fetchHubData}
            disabled={isRefreshing}
            className="p-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Exhibitor Companies</span>
            <Store className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-neutral-900">{stats.totalExhibitors}</span>
            <span className="text-xs text-neutral-500 font-medium">({stats.activeExhibitors} active)</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            With self-service token portals
          </p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Leads Captured</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{stats.totalLeadsCaptured}</span>
            <span className="text-xs text-neutral-500 font-medium">delegates</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
            <span className="text-emerald-700 font-bold">{hotPct}% Hot Leads</span>
            <span>· Instant qualification</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Booth Allocation</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-neutral-900">{stats.assignedBooths}</span>
            <span className="text-xs text-neutral-500 font-medium">/ {stats.totalBooths} booths</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-neutral-500">
            <span className="text-brand font-bold">{boothOccupancyPct}% Occupancy</span>
            <span>in expo halls</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">B2B Meetings</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-neutral-900">{stats.totalMeetingsRequested}</span>
            <span className="text-xs text-neutral-500 font-medium">({stats.confirmedMeetingsCount} accepted)</span>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500 font-medium">
            Buyer-exhibitor matchmaking
          </p>
        </div>
      </div>

      {/* Stage 3 Corporate Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/event/${eventId}/exhibitors-admin`}
          className="bg-white border border-neutral-200 hover:border-purple-300 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 group-hover:text-purple-700 transition-colors">
              Exhibitors &amp; Booth Staff
            </h3>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Provision exhibitor companies, assign hall booths, generate self-service portal access tokens, and issue staff scanner passes.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-purple-700">
            <span>Manage Exhibitors ({stats.totalExhibitors})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href={`/event/${eventId}/sponsors-admin`}
          className="bg-white border border-neutral-200 hover:border-blue-300 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-700 transition-colors">
              Sponsorship Tiers &amp; Assets
            </h3>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Configure Platinum, Gold, and Silver packages, customize logo placement rules across passes &amp; websites, and track assets.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-blue-700">
            <span>Configure Sponsors ({stats.totalSponsors})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href={`/event/${eventId}/deliverables`}
          className="bg-white border border-neutral-200 hover:border-emerald-300 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors">
              Sponsor Deliverables Matrix
            </h3>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              Fulfillment checklist tracking logos received, banners approved, stage branding, email inclusions, and social mentions.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Fulfillment Checklist</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Two Column Layout: Exhibitors List & Recent Leads Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exhibitors Overview */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Exhibitor Directory</h2>
              <p className="text-xs text-neutral-500">Registered companies exhibiting at this event</p>
            </div>
            <Link
              href={`/event/${eventId}/exhibitors-admin`}
              className="text-xs font-semibold text-brand hover:underline"
            >
              View Full List
            </Link>
          </div>

          {exhibitors.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-200 rounded-2xl space-y-3">
              <Store className="w-8 h-8 text-neutral-400 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-neutral-900">No exhibitors added yet</p>
                <p className="text-xs text-neutral-500">Add commercial booths and issue self-service portal links</p>
              </div>
              <Link
                href={`/event/${eventId}/exhibitors-admin`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-all shadow-xs"
              >
                <span>Add Exhibitor</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Booth</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Staff</th>
                    <th className="py-2.5 px-3">Leads Captured</th>
                    <th className="py-2.5 px-3 text-right">Portal Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {exhibitors.slice(0, 5).map((e) => (
                    <tr key={e.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-neutral-900">{e.companyName}</div>
                        <div className="text-[11px] text-neutral-400">{e.contactEmail}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-700">
                          {e.boothNumber || "Unassigned"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-600">{e.category}</td>
                      <td className="py-3 px-3 text-neutral-600">{e.staffCount || 0}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-emerald-600">{e.leadsCount || 0}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/portal/exhibitor/${e.portalToken}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:underline"
                        >
                          <span>Open Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Live Leads Stream */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-neutral-900">Live Lead Stream</h2>
              <Link
                href={`/event/${eventId}/lead-retrieval`}
                className="text-xs font-semibold text-brand hover:underline"
              >
                All Leads
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-10">
                No delegate leads captured yet today.
              </p>
            ) : (
              <div className="space-y-3">
                {recentLeads.slice(0, 5).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">{lead.attendeeName}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          lead.qualificationRating === "hot"
                            ? "bg-red-100 text-red-700"
                            : lead.qualificationRating === "warm"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {lead.qualificationRating}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">{lead.attendeeEmail}</p>
                    <div className="text-[10px] text-neutral-400 font-mono pt-1">
                      Scanned by {lead.staffName} · {new Date(lead.capturedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <Link
              href={`/api/event/${eventId}/leads?format=csv`}
              className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Export All Leads (CSV)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
