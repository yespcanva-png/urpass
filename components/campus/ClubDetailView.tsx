"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  CalendarDays,
  Users,
  CheckCircle2,
  TrendingUp,
  Building,
  ChevronLeft,
  Plus,
  MapPin,
  Clock,
  Mail,
  ChevronRight,
  X,
  FileCheck,
} from "lucide-react";
import type { CampusClubDetailData, CampusRole } from "@/types/campus";
import { inviteCampusMember } from "@/app/actions/campus/members";
import { getAcademicYearOptions } from "@/lib/campus/academic-year";

interface Props {
  data: CampusClubDetailData;
  selectedYear?: string;
}

export default function ClubDetailView({ data, selectedYear }: Props) {
  const router = useRouter();
  const { club, stats, events, organizers } = data;

  const [activeTab, setActiveTab] = useState<"events" | "organizers">("events");
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<CampusRole>("CLUB_ADMIN");
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  const academicYearOptions = getAcademicYearOptions();

  function handleYearChange(year: string) {
    if (year === "all") {
      router.push(`/dashboard/campus/clubs/${club.id}`);
    } else {
      router.push(`/dashboard/campus/clubs/${club.id}?year=${encodeURIComponent(year)}`);
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    setMemberError(null);
    setMemberLoading(true);

    const res = await inviteCampusMember(club.institution_id, {
      invited_email: memberEmail.toLowerCase().trim(),
      role: memberRole,
      club_id: club.id,
      department_id: club.department_id || null,
    });

    setMemberLoading(false);
    if (res.error) {
      setMemberError(res.error);
      return;
    }

    setShowMemberModal(false);
    setMemberEmail("");
    router.refresh();
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Breadcrumb & Club Banner ────────────────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/campus/clubs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-brand transition-colors mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Clubs & Cells
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 lg:p-8 border border-neutral-200/80 shadow-sm">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-white font-black text-xl"
              style={{ backgroundColor: club.color || "#8B5CF6" }}
            >
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  {club.name}
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 text-brand border border-purple-200 capitalize">
                  {club.category.replace("_", " ")}
                </span>
                {club.department && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 flex items-center gap-1">
                    <Building className="w-3 h-3 text-neutral-400" />
                    {club.department.name}
                  </span>
                )}
                {selectedYear && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                    AY {selectedYear}
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-500 max-w-2xl">
                {club.description || "Campus student club hosting technical sessions, hackathons, and activities."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Year filter */}
            <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200">
              <span className="text-xs font-semibold text-neutral-500">Year:</span>
              <select
                value={selectedYear || "all"}
                onChange={(e) => handleYearChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-neutral-800 outline-none cursor-pointer"
              >
                <option value="all">All Years</option>
                {academicYearOptions.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Organizer */}
            <button
              onClick={() => setShowMemberModal(true)}
              className="px-3.5 py-2 text-xs font-bold text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              Add Organizer
            </button>

            {/* Create Event CTA */}
            <Link
              href={`/dashboard/events/new?clubId=${club.id}`}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow-md shadow-brand/20"
            >
              <Plus className="w-3.5 h-3.5" />
              New Club Event
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4 Key Statistics Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Events</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-brand flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-neutral-900 tabular-nums">{stats.eventsCount}</p>
          <span className="text-[11px] text-neutral-400 mt-1">Club hosted</span>
        </div>

        {/* Total Registrations */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Registrations</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-neutral-900 tabular-nums">
            {stats.totalRegistrations.toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1">Signed up participants</span>
        </div>

        {/* Total Check-ins */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Check-Ins</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-neutral-900 tabular-nums">
            {stats.totalCheckIns.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1">Turnout verified</span>
        </div>

        {/* Turnout % */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Turnout Rate</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-neutral-900 tabular-nums">{stats.averageAttendance}%</p>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.averageAttendance, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "events"
              ? "bg-brand text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          Club Events ({events.length})
        </button>

        <button
          onClick={() => setActiveTab("organizers")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "organizers"
              ? "bg-brand text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Club Organizers ({organizers.length})
        </button>
      </div>

      {/* ── Tab Content: Events ─────────────────────────────────────────────── */}
      {activeTab === "events" && (
        <div className="bg-white rounded-3xl p-6 lg:p-7 border border-neutral-200/80 shadow-sm">
          {events.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-200 rounded-2xl">
              <CalendarDays className="w-10 h-10 stroke-1 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-900">No events hosted by this club yet</p>
              <p className="text-xs text-neutral-400 mt-1">Host workshops, seminars, hackathons, or meetings.</p>
              <Link
                href={`/dashboard/events/new?clubId=${club.id}`}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Club Event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Event</th>
                    <th className="pb-3">Date & Venue</th>
                    <th className="pb-3 text-right">Registrations</th>
                    <th className="pb-3 text-right">Check-Ins</th>
                    <th className="pb-3 text-right">Turnout</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-neutral-50/80 transition-colors group">
                      <td className="py-3.5 pl-2 font-bold text-neutral-900">
                        <Link
                          href={`/event/${e.id}`}
                          className="hover:text-brand flex items-center gap-1.5"
                        >
                          {e.name}
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </td>
                      <td className="py-3.5 text-neutral-500">
                        <div>{new Date(e.event_date).toLocaleDateString()}</div>
                        <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {e.venue}
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-bold text-neutral-900 tabular-nums">
                        {e.registrations_count.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right font-bold text-emerald-600 tabular-nums">
                        {e.attendees_count.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right tabular-nums">
                        <span className="font-bold text-neutral-900">{e.attendance_rate}%</span>
                      </td>
                      <td className="py-3.5 text-center">
                        {e.approval_status === "approved" ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Approved
                          </span>
                        ) : e.approval_status === "pending_approval" ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Pending
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                            {e.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab Content: Organizers ─────────────────────────────────────────── */}
      {activeTab === "organizers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Student coordinators, faculty advisors, and scan staff for {club.name}.
            </p>
            <button
              onClick={() => setShowMemberModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Organizer
            </button>
          </div>

          {organizers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-neutral-200">
              <Users className="w-10 h-10 stroke-1 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-neutral-900">No organizers assigned to this club</p>
              <p className="text-xs text-neutral-400 mt-1">Invite student leads, faculty coordinators or scan volunteers.</p>
              <button
                onClick={() => setShowMemberModal(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                Invite Organizer
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {organizers.map((m) => (
                  <div key={m.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold text-xs shrink-0">
                        <Mail className="w-4 h-4 text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-neutral-900">{m.invited_email}</p>
                        <p className="text-[11px] text-neutral-400">
                          Added {new Date(m.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-brand border border-purple-200">
                        {m.role.replace("_", " ")}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Modal: Add Organizer to Club ────────────────────────────────────── */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 relative">
            <button
              onClick={() => setShowMemberModal(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-brand flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Add Club Organizer</h3>
                <p className="text-xs text-neutral-400">Assign a coordinator or student lead to {club.name}</p>
              </div>
            </div>

            {memberError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {memberError}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Organizer Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="studentlead@college.edu or advisor@college.edu"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Role *
                </label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as CampusRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none text-neutral-900"
                >
                  <option value="CLUB_ADMIN">Club Admin (Manage club & events)</option>
                  <option value="ORGANIZER">Organizer (Host club events)</option>
                  <option value="SCANNER">Scanner (Check-in gate attendant only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={memberLoading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow"
                >
                  {memberLoading ? "Adding..." : "Add to Club"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
