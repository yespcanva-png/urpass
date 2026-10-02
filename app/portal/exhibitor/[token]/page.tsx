"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Store,
  QrCode,
  Users,
  Target,
  Download,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Search,
  Plus,
  Building2,
  MapPin,
  ExternalLink,
  Edit2,
  Save,
  RefreshCw,
  Tag,
  Phone,
  Mail,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Eye,
  Check,
} from "lucide-react";
import {
  EventExhibitor,
  ExhibitorStaff,
  ExhibitorLead,
  ExhibitorB2BMeeting,
  LeadQualification,
  LeadFollowUpStatus,
} from "@/lib/exhibitor-sponsor/types";

export default function ExhibitorSelfServicePortal() {
  const params = useParams();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exhibitor, setExhibitor] = useState<EventExhibitor | null>(null);
  const [staffList, setStaffList] = useState<ExhibitorStaff[]>([]);
  const [leads, setLeads] = useState<ExhibitorLead[]>([]);
  const [meetings, setMeetings] = useState<ExhibitorB2BMeeting[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<"leads" | "scanner" | "profile" | "staff" | "meetings" | "analytics">("leads");

  // QR Scanner / Lead Capture Modal State
  const [scanInput, setScanInput] = useState("");
  const [scanStaffName, setScanStaffName] = useState("");
  const [scanRating, setScanRating] = useState<LeadQualification>("hot");
  const [scanNotes, setScanNotes] = useState("");
  const [scanProducts, setScanProducts] = useState("");
  const [scanTags, setScanTags] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile Edit State
  const [editCompanyName, setEditCompanyName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editLogoUrl, setEditLogoUrl] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");
  const [editContactPhone, setEditContactPhone] = useState("");
  const [editProducts, setEditProducts] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Staff Modal State
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<any>("booth_staff");
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  // Search in Leads
  const [leadsSearch, setLeadsSearch] = useState("");
  const [leadsFilterRating, setLeadsFilterRating] = useState<"all" | LeadQualification>("all");

  const loadPortalData = () => {
    fetch(`/api/portal/exhibitor/${token}`)
      .then((r) => r.json())
      .then((d) => {
        setIsLoading(false);
        if (d.success) {
          setExhibitor(d.exhibitor);
          setStaffList(d.staff || []);
          setLeads(d.leads || []);
          setMeetings(d.meetings || []);
          setAnalytics(d.analytics);

          if (d.exhibitor) {
            setEditCompanyName(d.exhibitor.companyName || "");
            setEditDescription(d.exhibitor.description || "");
            setEditWebsite(d.exhibitor.websiteUrl || "");
            setEditLogoUrl(d.exhibitor.logoUrl || "");
            setEditContactEmail(d.exhibitor.contactEmail || "");
            setEditContactPhone(d.exhibitor.contactPhone || "");
            setEditProducts((d.exhibitor.productsServices || []).join(", "));
            if (!scanStaffName && d.staff && d.staff.length > 0) {
              setScanStaffName(d.staff[0].name);
            }
          }
        } else {
          setError(d.error || "Invalid exhibitor portal access key.");
        }
      })
      .catch(() => {
        setIsLoading(false);
        setError("Unable to connect to portal service.");
      });
  };

  useEffect(() => {
    loadPortalData();
  }, [token]);

  // Booth Check-In Toggle
  const handleToggleBoothCheckIn = async () => {
    if (!exhibitor) return;
    const nextStatus = !exhibitor.boothCheckedIn;
    setExhibitor({ ...exhibitor, boothCheckedIn: nextStatus });
    await fetch(`/api/portal/exhibitor/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "toggle_booth_checkin",
        checkedIn: nextStatus,
      }),
    });
  };

  // Lead Capture Submission
  const handleCaptureLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exhibitor || !scanInput.trim()) return;

    setIsCapturing(true);
    setCaptureMessage(null);

    try {
      const prodArray = scanProducts
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const tagArray = scanTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/event/${exhibitor.eventId}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exhibitorId: exhibitor.id,
          tokenOrAttendeeId: scanInput.trim(),
          staffName: scanStaffName || exhibitor.name,
          qualificationRating: scanRating,
          notes: scanNotes,
          interestedProducts: prodArray,
          tags: tagArray,
        }),
      });

      const d = await res.json();
      if (d.success) {
        setCaptureMessage({
          type: "success",
          text: `Lead captured successfully: ${d.lead.attendeeName} (${d.lead.attendeeEmail})`,
        });
        setScanInput("");
        setScanNotes("");
        loadPortalData();
      } else {
        setCaptureMessage({
          type: "error",
          text: d.error || "Failed to retrieve attendee pass. Verify QR code or ticket ID.",
        });
      }
    } catch {
      setCaptureMessage({ type: "error", text: "Network error capturing lead." });
    } finally {
      setIsCapturing(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exhibitor) return;

    setIsSavingProfile(true);
    try {
      const prodList = editProducts
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await fetch(`/api/portal/exhibitor/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_profile",
          profile: {
            companyName: editCompanyName,
            description: editDescription,
            websiteUrl: editWebsite,
            logoUrl: editLogoUrl,
            contactEmail: editContactEmail,
            contactPhone: editContactPhone,
            productsServices: prodList,
          },
        }),
      });

      const d = await res.json();
      if (d.success) {
        setExhibitor(d.exhibitor);
        alert("Company profile updated successfully.");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Add Staff Member
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exhibitor) return;

    setIsAddingStaff(true);
    try {
      const res = await fetch(`/api/portal/exhibitor/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_staff",
          staffMember: {
            name: newStaffName,
            email: newStaffEmail,
            phone: newStaffPhone,
            role: newStaffRole,
            canCaptureLeads: true,
          },
        }),
      });

      const d = await res.json();
      if (d.success) {
        setStaffModalOpen(false);
        setNewStaffName("");
        setNewStaffEmail("");
        setNewStaffPhone("");
        loadPortalData();
      }
    } finally {
      setIsAddingStaff(false);
    }
  };

  // Meeting Status Update
  const handleMeetingStatus = async (meetingId: string, status: "accepted" | "declined") => {
    if (!exhibitor) return;
    setMeetings((prev) =>
      prev.map((m) => (m.id === meetingId ? { ...m, status } : m))
    );
    await fetch(`/api/event/${exhibitor.eventId}/meetings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingId, status }),
    });
  };

  // CSV Export
  const handleExportCsv = () => {
    if (!exhibitor) return;
    window.location.href = `/api/event/${exhibitor.eventId}/leads?exhibitorId=${exhibitor.id}&format=csv`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-400 mb-3" />
        <p className="text-sm font-medium text-neutral-400">Authenticating Exhibitor Portal Session...</p>
      </div>
    );
  }

  if (error || !exhibitor) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold">Portal Access Restricted</h2>
          <p className="text-xs text-neutral-400 mt-2 mb-6">{error || "Invalid or revoked portal token."}</p>
          <a
            href="/"
            className="inline-block px-4 py-2 text-xs font-semibold bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.attendeeName.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.attendeeEmail.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      (l.attendeeCompany && l.attendeeCompany.toLowerCase().includes(leadsSearch.toLowerCase()));
    const matchesRating = leadsFilterRating === "all" || l.qualificationRating === leadsFilterRating;
    return matchesSearch && matchesRating;
  });

  const hotLeadsCount = leads.filter((l) => l.qualificationRating === "hot").length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Corporate Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800 flex items-center justify-center font-bold text-sm text-purple-300 shrink-0 overflow-hidden">
              {exhibitor.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={exhibitor.logoUrl} alt={exhibitor.companyName} className="w-full h-full object-contain p-0.5" />
              ) : (
                exhibitor.companyName.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-base tracking-tight">{exhibitor.companyName}</h1>
                {exhibitor.boothNumber && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-neutral-800 text-purple-300 border border-neutral-700">
                    Booth {exhibitor.boothNumber}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400">Exhibitor Self-Service & Lead Retrieval</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleBoothCheckIn}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                exhibitor.boothCheckedIn
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/80"
                  : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700"
              }`}
            >
              {exhibitor.boothCheckedIn ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Booth Active & Open
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  Mark Booth Check-In
                </>
              )}
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-2xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export Leads ({leads.length})
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-neutral-800/80 pt-1">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "leads"
                ? "border-purple-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Captured Leads ({leads.length})
          </button>

          <button
            onClick={() => setActiveTab("scanner")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "scanner"
                ? "border-purple-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-purple-400" />
            Instant QR Lead Scanner
          </button>

          <button
            onClick={() => setActiveTab("meetings")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "meetings"
                ? "border-purple-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Buyer Meetings ({meetings.length})
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "profile"
                ? "border-purple-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Company Profile & Booth
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "staff"
                ? "border-purple-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Booth Staff ({staffList.length})
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "analytics"
                ? "border-purple-500 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Booth Analytics
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* TAB 1: CAPTURED LEADS */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-semibold uppercase text-neutral-400">Total Leads</div>
                <div className="text-2xl font-bold text-white mt-1">{leads.length}</div>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-semibold uppercase text-rose-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-rose-500" /> Hot Leads
                </div>
                <div className="text-2xl font-bold text-rose-400 mt-1">{hotLeadsCount}</div>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-semibold uppercase text-purple-400">Meetings Booked</div>
                <div className="text-2xl font-bold text-purple-300 mt-1">
                  {meetings.filter((m) => m.status === "accepted").length}
                </div>
              </div>
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-semibold uppercase text-neutral-400">Active Staff</div>
                <div className="text-2xl font-bold text-white mt-1">{staffList.length}</div>
              </div>
            </div>

            {/* Leads Search & Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search delegate, email, company..."
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={leadsFilterRating}
                  onChange={(e) => setLeadsFilterRating(e.target.value as any)}
                  className="text-xs bg-neutral-900 border border-neutral-800 text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">All Intent Ratings</option>
                  <option value="hot">🔥 Hot Leads</option>
                  <option value="warm">⚡ Warm Leads</option>
                  <option value="cold">❄️ Cold Leads</option>
                </select>

                <button
                  onClick={() => setActiveTab("scanner")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Scan New Delegate
                </button>
              </div>
            </div>

            {/* Leads List */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-neutral-800/60 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Delegate</th>
                      <th className="py-3 px-4">Rating</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Staff Member</th>
                      <th className="py-3 px-4">Interested In</th>
                      <th className="py-3 px-4">Notes</th>
                      <th className="py-3 px-4 text-right">Captured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-neutral-500">
                          <Target className="w-8 h-8 mx-auto text-neutral-700 mb-2" />
                          No leads captured yet. Click &quot;Scan New Delegate&quot; to begin capturing passes.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{lead.attendeeName}</div>
                            <div className="text-[11px] text-neutral-400">
                              {lead.attendeeEmail} {lead.attendeeCompany ? `• ${lead.attendeeCompany}` : ""}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                lead.qualificationRating === "hot"
                                  ? "bg-rose-950 text-rose-300 border border-rose-800"
                                  : lead.qualificationRating === "warm"
                                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                                  : "bg-blue-950 text-blue-300 border border-blue-800"
                              }`}
                            >
                              {lead.qualificationRating === "hot" ? "🔥 Hot" : lead.qualificationRating}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="capitalize text-[11px] text-neutral-400">
                              {lead.followUpStatus.replace("_", " ")}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-neutral-400">
                            {lead.staffName || "Booth Rep"}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 flex-wrap max-w-xs">
                              {(lead.interestedProducts || []).map((p, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-neutral-400 max-w-xs truncate text-[11px]">
                            {lead.notes || "—"}
                          </td>

                          <td className="py-3 px-4 text-right text-neutral-500 whitespace-nowrap text-[11px]">
                            {new Date(lead.capturedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INSTANT QR SCANNER & INTAKE */}
        {activeTab === "scanner" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Attendee Pass Retrieval Scanner</h2>
                  <p className="text-xs text-neutral-400">
                    Scan delegate badge QR code or enter pass ID to instantly retrieve attendee registration details.
                  </p>
                </div>
              </div>

              {captureMessage && (
                <div
                  className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
                    captureMessage.type === "success"
                      ? "bg-emerald-950/70 border border-emerald-800 text-emerald-300"
                      : "bg-rose-950/70 border border-rose-800 text-rose-300"
                  }`}
                >
                  {captureMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  )}
                  <span>{captureMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleCaptureLead} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Pass Token / Attendee QR Code Content *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Scan camera or paste pass token (e.g. att_123 or pass UUID)"
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Lead Rating</label>
                    <select
                      value={scanRating}
                      onChange={(e) => setScanRating(e.target.value as LeadQualification)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="hot">🔥 Hot (Immediate Buy Intent)</option>
                      <option value="warm">⚡ Warm (Evaluating Solutions)</option>
                      <option value="cold">❄️ Cold (General Awareness)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Booth Rep / Staff</label>
                    <select
                      value={scanStaffName}
                      onChange={(e) => setScanStaffName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                      {staffList.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.role.replace("_", " ")})
                        </option>
                      ))}
                      <option value={exhibitor.name}>{exhibitor.name} (Lead Contact)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Interested Products / Services (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Enterprise Plan, API Integrations, Hardware"
                    value={scanProducts}
                    onChange={(e) => setScanProducts(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Discussion Notes / Next Steps
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Wants demo next Tuesday. Decision maker with budget for Q3."
                    value={scanNotes}
                    onChange={(e) => setScanNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isCapturing}
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCapturing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying Pass & Capturing Lead...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm & Save Lead
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: B2B BUYER MEETINGS */}
        {activeTab === "meetings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Pre-Scheduled B2B Meetings</h2>
                <p className="text-xs text-neutral-400">Incoming buyer meeting requests from delegates and event attendees.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {meetings.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-500">
                  <Calendar className="w-8 h-8 mx-auto text-neutral-700 mb-2" />
                  No B2B meetings requested yet. Delegates browsing your booth directory profile can book 1-on-1 slots.
                </div>
              ) : (
                meetings.map((m) => (
                  <div key={m.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white text-sm">{m.requesterName}</h3>
                        <div className="text-xs text-neutral-400">
                          {m.requesterCompany || "Enterprise Delegate"} • {m.requesterEmail}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          m.status === "accepted"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : m.status === "declined"
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : "bg-amber-950 text-amber-300 border-amber-800"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                      <div className="flex items-center gap-1.5 text-purple-300 font-medium mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(m.proposedTime).toLocaleString()} ({m.durationMinutes} mins)
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {m.location}
                      </div>
                      {m.meetingNotes && (
                        <p className="mt-2 text-neutral-300 pt-2 border-t border-neutral-800">
                          &quot;{m.meetingNotes}&quot;
                        </p>
                      )}
                    </div>

                    {m.status === "pending" && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleMeetingStatus(m.id, "accepted")}
                          className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        >
                          Accept Meeting
                        </button>
                        <button
                          onClick={() => handleMeetingStatus(m.id, "declined")}
                          className="px-3 py-1 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: COMPANY PROFILE */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-1">Company Exhibition Profile</h2>
              <p className="text-xs text-neutral-400 mb-5">
                Keep your company details, digital collateral, and products updated for attendees in the public directory.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Website URL</label>
                    <input
                      type="url"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Logo URL (PNG / SVG)</label>
                    <input
                      type="url"
                      value={editLogoUrl}
                      onChange={(e) => setEditLogoUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={editContactEmail}
                      onChange={(e) => setEditContactEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editContactPhone}
                      onChange={(e) => setEditContactPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Products & Services (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editProducts}
                    onChange={(e) => setEditProducts(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Company Description</label>
                  <textarea
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSavingProfile ? "Saving..." : "Save Company Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: BOOTH STAFF */}
        {activeTab === "staff" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Registered Booth Representatives</h2>
                <p className="text-xs text-neutral-400">Team members authorized to scan delegate passes and represent your booth.</p>
              </div>

              <button
                onClick={() => setStaffModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Staff Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {staffList.map((staff) => (
                <div key={staff.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{staff.name}</h3>
                      <span className="text-[10px] font-mono text-purple-300 uppercase">
                        {staff.role.replace("_", " ")}
                      </span>
                    </div>
                    {staff.isCheckedIn && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Onsite
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-neutral-400 space-y-0.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-neutral-500" />
                      <span>{staff.email}</span>
                    </div>
                    {staff.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-neutral-500" />
                        <span>{staff.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Staff Modal */}
            {staffModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                  <h3 className="text-base font-bold text-white mb-1">Add Booth Staff Member</h3>
                  <p className="text-xs text-neutral-400 mb-4">
                    Register a representative for badge pass assignment and lead retrieval access.
                  </p>

                  <form onSubmit={handleAddStaff} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Staff Name *</label>
                      <input
                        type="text"
                        required
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={newStaffEmail}
                          onChange={(e) => setNewStaffEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={newStaffPhone}
                          onChange={(e) => setNewStaffPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">Role</label>
                      <select
                        value={newStaffRole}
                        onChange={(e) => setNewStaffRole(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="booth_manager">Booth Manager</option>
                        <option value="booth_staff">Booth Staff</option>
                        <option value="sales_rep">Sales Representative</option>
                        <option value="technical_specialist">Technical Specialist</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                      <button
                        type="button"
                        onClick={() => setStaffModalOpen(false)}
                        className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isAddingStaff}
                        className="px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isAddingStaff ? "Adding..." : "Add Staff"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: BOOTH ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Commercial Engagement & ROI</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-semibold uppercase text-neutral-400">Total Scans</div>
                <div className="text-2xl font-bold text-white mt-1">{leads.length}</div>
                <div className="text-xs text-neutral-500 mt-1">Unique attendee interactions</div>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-semibold uppercase text-rose-400">High-Intent Leads</div>
                <div className="text-2xl font-bold text-rose-400 mt-1">
                  {leads.length > 0 ? `${Math.round((hotLeadsCount / leads.length) * 100)}%` : "0%"}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{hotLeadsCount} Hot qualification leads</div>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-semibold uppercase text-purple-400">B2B Meetings</div>
                <div className="text-2xl font-bold text-purple-300 mt-1">{meetings.length}</div>
                <div className="text-xs text-neutral-500 mt-1">Pre-scheduled discussions</div>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                <div className="text-[11px] font-semibold uppercase text-emerald-400">Booth Status</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {exhibitor.boothCheckedIn ? "Active & Open" : "Standby"}
                </div>
                <div className="text-xs text-neutral-500 mt-1">Booth #{exhibitor.boothNumber || "General"}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
