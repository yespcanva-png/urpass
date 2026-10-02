"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Target,
  Download,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  User,
  Mail,
  Phone,
  Tag,
  FileSpreadsheet,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { ExhibitorLead, EventExhibitor, LeadQualification, LeadFollowUpStatus } from "@/lib/exhibitor-sponsor/types";

export default function LeadRetrievalPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [leads, setLeads] = useState<ExhibitorLead[]>([]);
  const [exhibitors, setExhibitors] = useState<EventExhibitor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exhibitorFilter, setExhibitorFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | LeadQualification>("all");
  const [selectedLead, setSelectedLead] = useState<ExhibitorLead | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);
    Promise.all([
      fetch(`/api/event/${eventId}/leads`).then((r) => r.json()),
      fetch(`/api/event/${eventId}/exhibitors`).then((r) => r.json()),
    ])
      .then(([leadsData, exhData]) => {
        setIsRefreshing(false);
        if (leadsData.success && leadsData.leads) setLeads(leadsData.leads);
        if (exhData.success && exhData.exhibitors) setExhibitors(exhData.exhibitors);
      })
      .catch(() => setIsRefreshing(false));
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleUpdateRating = async (leadId: string, nextRating: LeadQualification) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, qualificationRating: nextRating } : l))
    );
    await fetch(`/api/event/${eventId}/leads`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        updates: { qualificationRating: nextRating },
      }),
    });
  };

  const handleUpdateFollowUp = async (leadId: string, status: LeadFollowUpStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, followUpStatus: status } : l))
    );
    await fetch(`/api/event/${eventId}/leads`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId,
        updates: { followUpStatus: status },
      }),
    });
  };

  const handleExportCsv = () => {
    setIsExporting(true);
    const query = new URLSearchParams();
    if (exhibitorFilter !== "all") query.set("exhibitorId", exhibitorFilter);
    if (ratingFilter !== "all") query.set("rating", ratingFilter);
    query.set("format", "csv");

    window.location.href = `/api/event/${eventId}/leads?${query.toString()}`;
    setTimeout(() => setIsExporting(false), 2000);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.attendeeCompany && l.attendeeCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.notes && l.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesExh = exhibitorFilter === "all" || l.exhibitorId === exhibitorFilter;
    const matchesRating = ratingFilter === "all" || l.qualificationRating === ratingFilter;
    return matchesSearch && matchesExh && matchesRating;
  });

  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.qualificationRating === "hot").length;
  const warmLeads = leads.filter((l) => l.qualificationRating === "warm").length;
  const coldLeads = leads.filter((l) => l.qualificationRating === "cold").length;
  const hotPct = totalLeads > 0 ? Math.round((hotLeads / totalLeads) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300">
              Commercial Intelligence
            </span>
            <span className="text-xs text-neutral-400">Stage 3 Enterprise</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 flex items-center gap-2">
            <Target className="w-6 h-6 text-rose-600" />
            Lead Retrieval & Qualification Center
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Monitor real-time QR lead scans across exhibitor booths, filter high-intent prospects, and export structured CSVs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 shadow-2xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? "Exporting..." : "Download Full CSV"}
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Total Scanned Leads</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">{totalLeads}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Across {exhibitors.length} trade booths</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Hot Leads
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{hotLeads}</div>
          <div className="text-xs text-neutral-400 mt-0.5">{hotPct}% high-priority pipeline</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Warm Inquiries</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{warmLeads}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Evaluating solutions</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">Cold / Awareness</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{coldLeads}</div>
          <div className="text-xs text-neutral-400 mt-0.5">General booth visits</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search attendee, email, company, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={exhibitorFilter}
            onChange={(e) => setExhibitorFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">All Exhibitors</option>
            {exhibitors.map((exh) => (
              <option key={exh.id} value={exh.id}>
                {exh.companyName}
              </option>
            ))}
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as any)}
            className="text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">All Ratings</option>
            <option value="hot">🔥 Hot Only</option>
            <option value="warm">⚡ Warm Only</option>
            <option value="cold">❄️ Cold Only</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Delegate Name</th>
                <th className="py-3 px-4">Exhibitor Booth</th>
                <th className="py-3 px-4">Captured By</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Follow-Up</th>
                <th className="py-3 px-4">Interested Products</th>
                <th className="py-3 px-4">Captured Time</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-neutral-400">
                    <Target className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    No leads recorded matching your criteria. Leads appear in real-time as exhibitor staff scan attendee QR codes.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const exh = exhibitors.find((e) => e.id === lead.exhibitorId);

                  const ratingBadges: Record<LeadQualification, string> = {
                    hot: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
                    warm: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
                    cold: "bg-blue-50 text-blue-700 border-blue-200 font-medium",
                  };

                  return (
                    <tr key={lead.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-950">{lead.attendeeName}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                          <span>{lead.attendeeEmail}</span>
                          {lead.attendeeCompany && (
                            <>
                              <span>•</span>
                              <span className="text-neutral-600">{lead.attendeeCompany}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-neutral-800">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{exh ? exh.companyName : "Exhibitor"}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-600">
                        {lead.staffName || "Staff"}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={lead.qualificationRating}
                          onChange={(e) => handleUpdateRating(lead.id, e.target.value as LeadQualification)}
                          className={`text-xs px-2 py-0.5 rounded border focus:outline-none ${
                            ratingBadges[lead.qualificationRating]
                          }`}
                        >
                          <option value="hot">🔥 Hot</option>
                          <option value="warm">⚡ Warm</option>
                          <option value="cold">❄️ Cold</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={lead.followUpStatus}
                          onChange={(e) => handleUpdateFollowUp(lead.id, e.target.value as LeadFollowUpStatus)}
                          className="text-[11px] bg-neutral-50 border border-neutral-200 rounded px-2 py-0.5 focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="meeting_scheduled">Meeting Set</option>
                          <option value="closed_won">Closed Deal</option>
                          <option value="unqualified">Disqualified</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap max-w-xs">
                          {(lead.interestedProducts || []).slice(0, 2).map((p, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600 truncate max-w-[100px]">
                              {p}
                            </span>
                          ))}
                          {(lead.interestedProducts || []).length > 2 && (
                            <span className="text-[9px] text-neutral-400">
                              +{(lead.interestedProducts || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                        {new Date(lead.capturedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1 text-[11px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-start justify-between gap-2 mb-4 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-950">{selectedLead.attendeeName}</h3>
                <div className="text-xs text-neutral-500">{selectedLead.attendeeCompany || "Independent Delegate"}</div>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  selectedLead.qualificationRating === "hot"
                    ? "bg-rose-100 text-rose-800"
                    : selectedLead.qualificationRating === "warm"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {selectedLead.qualificationRating} lead
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase">Email Address</div>
                  <div className="font-medium text-neutral-900 mt-0.5">{selectedLead.attendeeEmail}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase">Phone Number</div>
                  <div className="font-medium text-neutral-900 mt-0.5">{selectedLead.attendeePhone || "Not provided"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase">Designation / Role</div>
                  <div className="font-medium text-neutral-900 mt-0.5">{selectedLead.attendeeDesignation || "Delegate"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-semibold uppercase">Pass Tier</div>
                  <div className="font-medium text-neutral-900 mt-0.5">{selectedLead.ticketName || "Standard Entry"}</div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-neutral-600 mb-1">Staff Notes & Requirement</div>
                <div className="p-3 bg-white border border-neutral-200 rounded-lg text-neutral-700 whitespace-pre-wrap">
                  {selectedLead.notes || "No custom notes recorded."}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-neutral-600 mb-1">Interested Products / Services</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(selectedLead.interestedProducts || []).map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-neutral-800 font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 flex items-center justify-between">
                <span>Captured by {selectedLead.staffName || "Staff"}</span>
                <span>{new Date(selectedLead.capturedAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-neutral-100">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
