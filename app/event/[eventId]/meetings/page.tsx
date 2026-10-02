"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  User,
  Mail,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { ExhibitorB2BMeeting, EventExhibitor, MeetingStatus } from "@/lib/exhibitor-sponsor/types";

export default function B2BMeetingsCoordinationPage() {
  const params = useParams();
  const eventId = params.eventId as string;

  const [meetings, setMeetings] = useState<ExhibitorB2BMeeting[]>([]);
  const [exhibitors, setExhibitors] = useState<EventExhibitor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MeetingStatus>("all");
  const [exhibitorFilter, setExhibitorFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual Meeting Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [targetExhibitorId, setTargetExhibitorId] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterCompany, setRequesterCompany] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [location, setLocation] = useState("Exhibition Booth");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setIsRefreshing(true);
    Promise.all([
      fetch(`/api/event/${eventId}/meetings`).then((r) => r.json()),
      fetch(`/api/event/${eventId}/exhibitors`).then((r) => r.json()),
    ])
      .then(([meetingData, exhData]) => {
        setIsRefreshing(false);
        if (meetingData.success && meetingData.meetings) setMeetings(meetingData.meetings);
        if (exhData.success && exhData.exhibitors) setExhibitors(exhData.exhibitors);
      })
      .catch(() => setIsRefreshing(false));
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleUpdateStatus = async (meetingId: string, nextStatus: MeetingStatus) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status: nextStatus } : m))
    );
    await fetch(`/api/event/${eventId}/meetings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingId,
        status: nextStatus,
      }),
    });
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/event/${eventId}/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exhibitorId: targetExhibitorId,
          requesterName,
          requesterEmail,
          requesterCompany,
          proposedTime,
          durationMinutes: Number(durationMinutes),
          location,
          meetingNotes,
        }),
      });
      const d = await res.json();
      if (d.success) {
        setModalOpen(false);
        loadData();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.requesterCompany && m.requesterCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesExh = exhibitorFilter === "all" || m.exhibitorId === exhibitorFilter;
    return matchesSearch && matchesStatus && matchesExh;
  });

  const totalRequested = meetings.length;
  const totalAccepted = meetings.filter((m) => m.status === "accepted" || m.status === "completed").length;
  const totalPending = meetings.filter((m) => m.status === "pending").length;
  const totalDeclined = meetings.filter((m) => m.status === "declined").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              B2B Matchmaking
            </span>
            <span className="text-xs text-neutral-400">Stage 3 Enterprise</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            B2B Buyer-Exhibitor Meetings
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Coordinate pre-scheduled meetings between qualified enterprise buyers and exhibitor representatives.
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
            onClick={() => {
              setTargetExhibitorId(exhibitors[0]?.id || "");
              setRequesterName("");
              setRequesterEmail("");
              setRequesterCompany("");
              setProposedTime(new Date(Date.now() + 3600000).toISOString().slice(0, 16));
              setDurationMinutes(30);
              setLocation("Exhibition Booth");
              setMeetingNotes("");
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Meetings Requested</div>
          <div className="text-2xl font-bold text-neutral-950 mt-1">{totalRequested}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Buyer-to-exhibitor requests</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Confirmed / Accepted</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{totalAccepted}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Scheduled on calendar</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Pending Review</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{totalPending}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Awaiting exhibitor response</div>
        </div>
        <div className="p-3.5 bg-white border border-neutral-200/80 rounded-xl shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Declined / Closed</div>
          <div className="text-2xl font-bold text-neutral-700 mt-1">{totalDeclined}</div>
          <div className="text-xs text-neutral-400 mt-0.5">Unavailable slots</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search requester, company, or venue..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Enterprise Buyer</th>
                <th className="py-3 px-4">Target Exhibitor</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Topic / Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {filteredMeetings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-neutral-400">
                    <Calendar className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    No B2B meetings found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMeetings.map((meeting) => {
                  const exh = exhibitors.find((e) => e.id === meeting.exhibitorId);

                  const statusBadges: Record<MeetingStatus, string> = {
                    pending: "bg-amber-50 text-amber-800 border-amber-200",
                    accepted: "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
                    completed: "bg-blue-50 text-blue-800 border-blue-200",
                    declined: "bg-rose-50 text-rose-800 border-rose-200",
                    cancelled: "bg-neutral-100 text-neutral-700 border-neutral-200",
                  };

                  return (
                    <tr key={meeting.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-neutral-900">
                        <div className="font-semibold text-neutral-950">{meeting.requesterName}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                          <span>{meeting.requesterEmail}</span>
                          {meeting.requesterCompany && (
                            <>
                              <span>•</span>
                              <span className="text-neutral-600">{meeting.requesterCompany}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-neutral-800">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{exh ? exh.companyName : "Exhibitor"}</span>
                        </div>
                        {exh?.boothNumber && (
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            Booth {exh.boothNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-800 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-1 text-neutral-950">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span>{new Date(meeting.proposedTime).toLocaleDateString()}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {new Date(meeting.proposedTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ({meeting.durationMinutes}m)
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-700">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{meeting.location || "Exhibitor Booth"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            statusBadges[meeting.status] || "bg-neutral-100 text-neutral-800 border-neutral-200"
                          }`}
                        >
                          {meeting.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-500 text-[11px] max-w-xs truncate">
                        {meeting.meetingNotes || "—"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {meeting.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(meeting.id, "accepted")}
                                className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(meeting.id, "declined")}
                                className="px-2 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {meeting.status === "accepted" && (
                            <button
                              onClick={() => handleUpdateStatus(meeting.id, "completed")}
                              className="px-2 py-1 text-[11px] font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                            >
                              Mark Completed
                            </button>
                          )}
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

      {/* Manual Meeting Scheduling Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-950 mb-1">Schedule B2B Meeting</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Coordinate an official meeting slot between an enterprise delegate and exhibitor.
            </p>

            <form onSubmit={handleCreateMeeting} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Target Exhibitor *</label>
                <select
                  required
                  value={targetExhibitorId}
                  onChange={(e) => setTargetExhibitorId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {exhibitors.map((exh) => (
                    <option key={exh.id} value={exh.id}>
                      {exh.companyName} {exh.boothNumber ? `(Booth ${exh.boothNumber})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Buyer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Buyer Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="buyer@enterprise.com"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Buyer Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp / Reliance"
                  value={requesterCompany}
                  onChange={(e) => setRequesterCompany(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Proposed Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Duration (Mins)</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Meeting Location</label>
                <input
                  type="text"
                  placeholder="e.g. Exhibitor Booth / VIP Lounge Suite 3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Discussion Agenda / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Review annual procurement requirements for enterprise cloud migration."
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-2xs transition-all disabled:opacity-50"
                >
                  {isSaving ? "Scheduling..." : "Schedule Meeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
