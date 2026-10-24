"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter,
  BarChart3,
  Globe,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { ALL_MARKETING_PAGES } from "@/lib/seo/pages";
import { updateInquiryStage, InquiryStage } from "@/app/actions/campaigns";

interface OpsCampaignsDashboardProps {
  initialInquiries: any[];
  initialConversions: any[];
}

const STAGE_OPTIONS: { id: InquiryStage; label: string; color: string }[] = [
  { id: "new", label: "New", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "contacted", label: "Contacted", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "qualified", label: "Qualified", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "quotation_sent", label: "Quotation Sent", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "accepted", label: "Quote Accepted", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { id: "payment_pending", label: "Payment Pending", color: "bg-yellow-50 text-yellow-800 border-yellow-200" },
  { id: "paid", label: "Paid", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "setup_in_progress", label: "Setup In Progress", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { id: "client_approved", label: "Client Approved", color: "bg-violet-50 text-violet-700 border-violet-200" },
  { id: "completed", label: "Completed", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "rejected", label: "Rejected", color: "bg-neutral-100 text-neutral-600 border-neutral-300" },
];

export default function OpsCampaignsDashboard({
  initialInquiries,
  initialConversions,
}: OpsCampaignsDashboardProps) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [activeTab, setActiveTab] = useState<"pipeline" | "pages" | "conversions">("pipeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [clusterFilter, setClusterFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const publishedPages = ALL_MARKETING_PAGES.filter((p) => p.status === "published");
  const clusterCounts = {
    festive: publishedPages.filter((p) => p.cluster === "festive").length,
    institutional: publishedPages.filter((p) => p.cluster === "institutional").length,
    recurring: publishedPages.filter((p) => p.cluster === "recurring").length,
    evergreen: publishedPages.filter((p) => p.cluster === "evergreen").length,
  };

  const selfServiceClicks = initialConversions.filter((c) => c.event_name === "self_service_cta_click").length;
  const managedServiceClicks = initialConversions.filter((c) => c.event_name === "managed_service_cta_click").length;

  const handleStageChange = async (inquiryId: string, newStage: InquiryStage) => {
    setUpdatingId(inquiryId);
    try {
      const res = await updateInquiryStage(inquiryId, newStage);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, status: newStage } : item))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inq.organizer_name?.toLowerCase().includes(q) ||
      inq.business_email?.toLowerCase().includes(q) ||
      inq.phone_number?.toLowerCase().includes(q) ||
      inq.event_type?.toLowerCase().includes(q) ||
      inq.city?.toLowerCase().includes(q);

    const matchesCluster = clusterFilter === "all" || inq.content_cluster === clusterFilter;
    return matchesSearch && matchesCluster;
  });

  return (
    <div className="space-y-8">
      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2 text-xs font-bold uppercase tracking-wider">
            <span>Published SEO Pages</span>
            <Globe className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">{publishedPages.length}</div>
          <div className="text-xs text-neutral-500 mt-2 flex items-center gap-1.5">
            <span>Festive: {clusterCounts.festive}</span> •
            <span>Inst: {clusterCounts.institutional}</span> •
            <span>Rec: {clusterCounts.recurring}</span> •
            <span>Evergreen: {clusterCounts.evergreen}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2 text-xs font-bold uppercase tracking-wider">
            <span>Managed Inquiries</span>
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">{inquiries.length}</div>
          <div className="text-xs text-neutral-500 mt-2">
            <span>New: {inquiries.filter((i) => i.status === "new").length}</span> •
            <span> Qualified: {inquiries.filter((i) => i.status === "qualified").length}</span> •
            <span> Paid: {inquiries.filter((i) => i.status === "paid").length}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2 text-xs font-bold uppercase tracking-wider">
            <span>Dual CTA Interactions</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900">{selfServiceClicks + managedServiceClicks}</div>
          <div className="text-xs text-neutral-500 mt-2 flex items-center gap-2">
            <span className="text-neutral-700 font-semibold">Self-Service: {selfServiceClicks}</span>
            <span>•</span>
            <span className="text-violet-700 font-semibold">Managed: {managedServiceClicks}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm">
          <div className="flex items-center justify-between text-neutral-500 mb-2 text-xs font-bold uppercase tracking-wider">
            <span>Search Console & GA4</span>
            <BarChart3 className="w-4 h-4 text-neutral-600" />
          </div>
          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> GA4 Tracking Active (G-E5RNX1BZ0Z)
          </div>
          <div className="text-[11px] text-neutral-500 mt-2">
            Search Console: Manual Property Connected · Direct API: Not configured
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all ${
            activeTab === "pipeline"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Managed Service Pipeline ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all ${
            activeTab === "pages"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          SEO Landing Pages Directory ({publishedPages.length})
        </button>
        <button
          onClick={() => setActiveTab("conversions")}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-all ${
            activeTab === "conversions"
              ? "border-violet-600 text-violet-700"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          First-Party Conversion Log ({initialConversions.length})
        </button>
      </div>

      {/* Tab 1: Pipeline */}
      {activeTab === "pipeline" && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search inquiries by name, city, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-sm outline-none focus:border-violet-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select
                value={clusterFilter}
                onChange={(e) => setClusterFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white outline-none"
              >
                <option value="all">All Clusters</option>
                <option value="festive">Festive Events</option>
                <option value="institutional">Institutional Events</option>
                <option value="recurring">Recurring & Social</option>
                <option value="evergreen">Evergreen Solutions</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Organizer / Contact</th>
                  <th className="px-4 py-3">Event Parameters</th>
                  <th className="px-4 py-3">Package / Scope</th>
                  <th className="px-4 py-3">Source Page</th>
                  <th className="px-4 py-3">Created (IST)</th>
                  <th className="px-4 py-3">Pipeline Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                      No managed service inquiries found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => {
                    const stageConfig = STAGE_OPTIONS.find((s) => s.id === inq.status) || STAGE_OPTIONS[0];
                    const dateFormatted = new Date(inq.created_at).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return (
                      <tr key={inq.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-neutral-900">{inq.organizer_name}</div>
                          <div className="text-neutral-500 mt-0.5">
                            <a href={`mailto:${inq.business_email}`} className="text-violet-600 hover:underline">
                              {inq.business_email}
                            </a>
                            {" • "}
                            <a href={`tel:${inq.phone_number}`} className="text-neutral-600 hover:underline">
                              {inq.phone_number}
                            </a>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="font-medium text-neutral-900">{inq.event_type}</div>
                          <div className="text-neutral-500">
                            {inq.city || "City N/A"} • {inq.expected_attendees || "Guests N/A"}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                            {inq.preferred_package || "Essential"}
                          </span>
                          <span className="text-neutral-500 ml-1.5 capitalize">({inq.event_pricing_type || "free"})</span>
                        </td>

                        <td className="px-4 py-3.5 text-neutral-600 font-mono text-[11px]">
                          /{inq.page_slug || "direct"}
                        </td>

                        <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">
                          {dateFormatted}
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <select
                              value={inq.status}
                              disabled={updatingId === inq.id}
                              onChange={(e) => handleStageChange(inq.id, e.target.value as InquiryStage)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors outline-none cursor-pointer ${stageConfig.color}`}
                            >
                              {STAGE_OPTIONS.map((st) => (
                                <option key={st.id} value={st.id}>
                                  {st.label}
                                </option>
                              ))}
                            </select>
                            {updatingId === inq.id && <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />}
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
      )}

      {/* Tab 2: Published Landing Pages */}
      {activeTab === "pages" && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Landing Page URL</th>
                  <th className="px-4 py-3">Cluster</th>
                  <th className="px-4 py-3">H1 Headline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {publishedPages.map((page, idx) => (
                  <tr key={page.slug} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3 text-neutral-400 font-mono">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-3 font-mono text-violet-700 font-semibold">/{page.slug}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700">
                        {page.cluster}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-900 font-medium max-w-sm truncate">{page.h1}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Published
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://urpass.space/${page.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-neutral-500 hover:text-violet-700"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Conversion Logs */}
      {activeTab === "conversions" && (
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Event Name</th>
                  <th className="px-4 py-3">Source Page</th>
                  <th className="px-4 py-3">Service Model</th>
                  <th className="px-4 py-3">CTA Position</th>
                  <th className="px-4 py-3">UTM Source</th>
                  <th className="px-4 py-3">Timestamp (IST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {initialConversions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                      No conversion events recorded yet.
                    </td>
                  </tr>
                ) : (
                  initialConversions.map((conv) => (
                    <tr key={conv.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-neutral-900">{conv.event_name}</td>
                      <td className="px-4 py-3 font-mono text-neutral-600">/{conv.page_slug}</td>
                      <td className="px-4 py-3 capitalize text-neutral-600">{conv.service_model || "n/a"}</td>
                      <td className="px-4 py-3 text-neutral-500">{conv.cta_position || "default"}</td>
                      <td className="px-4 py-3 text-neutral-500">{conv.utm_source || "direct"}</td>
                      <td className="px-4 py-3 text-neutral-500">
                        {new Date(conv.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
