"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  TrendingUp,
  Building,
  Sparkles,
  Download,
  Plus,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Calendar,
  MapPin,
  Check,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import type { CampusDashboardData, CampusEventSummary } from "@/types/campus";
import { exportCampusAnalyticsCSV } from "@/app/actions/campus/analytics";
import { getAcademicYearOptions } from "@/lib/campus/academic-year";

interface Props {
  data: CampusDashboardData;
  selectedYear?: string;
}

export default function CampusDashboardView({ data, selectedYear }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const { institution, kpis, topDepartments, upcomingEvents, recentEvents, trends } = data;

  const academicYearOptions = getAcademicYearOptions();
  const currentFilterYear = selectedYear || institution.current_academic_year;

  function handleYearChange(year: string) {
    startTransition(() => {
      if (year === "all") {
        router.push("/dashboard/campus");
      } else {
        router.push(`/dashboard/campus?year=${encodeURIComponent(year)}`);
      }
    });
  }

  async function handleExportCSV() {
    try {
      setIsExporting(true);
      const csv = await exportCampusAnalyticsCSV(
        institution.id,
        currentFilterYear === "all" ? undefined : currentFilterYear
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${institution.institution_code}_campus_analytics_${currentFilterYear}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  }

  // Calculate maximum value for chart scaling
  const maxTrendVal = Math.max(
    ...trends.map((t) => Math.max(t.registrations, t.attendees)),
    10
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* ── Institution Header & Filters ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 lg:p-8 border border-neutral-200/80 shadow-sm">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-white font-black text-xl"
            style={{ background: "linear-gradient(135deg, #6D28D9, #4c1d95)" }}
          >
            {institution.logo_url ? (
              <img
                src={institution.logo_url}
                alt={institution.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <GraduationCap className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                {institution.name}
              </h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-purple-50 text-brand border border-purple-200">
                {institution.institution_code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                AY {currentFilterYear}
              </span>
              {institution.require_event_approval && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <FileCheck className="w-3 h-3" />
                  Approval Workflow Active
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-500">
              Campus centralized event management, multi-department analytics & student engagement.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Academic Year Filter */}
          <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200">
            <span className="text-xs font-semibold text-neutral-500">Academic Year:</span>
            <select
              value={currentFilterYear}
              onChange={(e) => handleYearChange(e.target.value)}
              disabled={isPending}
              className="bg-transparent text-xs font-bold text-neutral-800 outline-none cursor-pointer"
            >
              <option value="all">All Academic Years</option>
              {academicYearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>

          {/* Create Event CTA */}
          <Link
            href="/dashboard/events/new"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand rounded-xl hover:bg-brand/90 transition-all shadow-md shadow-brand/20"
          >
            <Plus className="w-3.5 h-3.5" />
            New Campus Event
          </Link>
        </div>
      </div>

      {/* ── 7 Overview KPI Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {/* Total Events */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Events</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-brand flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{kpis.totalEvents}</p>
          <span className="text-[11px] text-neutral-400 mt-1">Campus wide</span>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Upcoming</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{kpis.upcomingEvents}</p>
          <span className="text-[11px] text-amber-600 font-medium mt-1">Scheduled</span>
        </div>

        {/* Total Registrations */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Registrations</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">
            {kpis.totalRegistrations.toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1">Total signed up</span>
        </div>

        {/* Total Attendees */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Attendees</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">
            {kpis.totalAttendees.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1">Verified check-ins</span>
        </div>

        {/* Attendance % */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Attendance</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{kpis.attendanceRate}%</p>
          <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(kpis.attendanceRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Active Departments */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Departments</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{kpis.activeDepartments}</p>
          <span className="text-[11px] text-neutral-400 mt-1">Hosting events</span>
        </div>

        {/* Active Clubs */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Clubs & Cells</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 tabular-nums">{kpis.activeClubs}</p>
          <span className="text-[11px] text-neutral-400 mt-1">Active units</span>
        </div>
      </div>

      {/* ── Trends Chart & Top Departments ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registration & Attendance Trends */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 lg:p-7 border border-neutral-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Registration & Attendance Trends</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Comparison of registrations vs verified checked-in attendance
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-brand" />
                <span className="text-neutral-600">Registrations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span className="text-neutral-600">Attendees</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="flex-1 flex flex-col justify-end pt-6 min-h-[220px]">
            <div className="grid grid-flow-col auto-cols-fr gap-4 items-end h-48 border-b border-neutral-100 pb-2">
              {trends.map((t, idx) => {
                const regHeight = (t.registrations / maxTrendVal) * 100;
                const attHeight = (t.attendees / maxTrendVal) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1.5 w-full justify-center h-full">
                      {/* Registration bar */}
                      <div
                        className="w-5 bg-purple-200 group-hover:bg-brand rounded-t-md transition-all relative flex justify-center"
                        style={{ height: `${Math.max(regHeight, 4)}%` }}
                        title={`Registrations: ${t.registrations}`}
                      >
                        {t.registrations > 0 && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 text-[10px] font-bold text-neutral-700 bg-white px-1.5 py-0.5 rounded shadow">
                            {t.registrations}
                          </span>
                        )}
                      </div>
                      {/* Attendees bar */}
                      <div
                        className="w-5 bg-emerald-200 group-hover:bg-emerald-500 rounded-t-md transition-all relative flex justify-center"
                        style={{ height: `${Math.max(attHeight, 4)}%` }}
                        title={`Attendees: ${t.attendees}`}
                      >
                        {t.attendees > 0 && (
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 text-[10px] font-bold text-neutral-700 bg-white px-1.5 py-0.5 rounded shadow">
                            {t.attendees}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-neutral-400 mt-2 truncate w-full text-center">
                      {t.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Departments Ranking */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 lg:p-7 border border-neutral-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Top Departments</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Ranked by participation and event engagement</p>
            </div>
            <Link
              href="/dashboard/campus/departments"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pt-2">
            {topDepartments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-neutral-400">
                <Building className="w-8 h-8 stroke-1 text-neutral-300 mb-2" />
                <p className="text-xs">No department events recorded yet</p>
              </div>
            ) : (
              topDepartments.slice(0, 5).map((dept, index) => (
                <Link
                  key={dept.id}
                  href={`/dashboard/campus/departments/${dept.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50 transition-colors border border-neutral-100 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-neutral-400 w-4 text-center">
                      #{index + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: dept.color || "#6D28D9" }}
                    >
                      {dept.code.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900 group-hover:text-brand transition-colors">
                        {dept.name}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {dept.eventsCount} events · {dept.clubsCount} clubs
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-neutral-900">
                      {dept.registrationsCount.toLocaleString()} regs
                    </p>
                    <div className="flex items-center gap-1.5 justify-end mt-0.5">
                      <div className="w-12 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${Math.min(dept.attendanceRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {dept.attendanceRate}%
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Upcoming & Recent Events Two-Column Grid ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Campus Events */}
        <div className="bg-white rounded-3xl p-6 lg:p-7 border border-neutral-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Upcoming Campus Events</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Scheduled symposiums, seminars and club sessions</p>
            </div>
            <Link
              href="/dashboard/campus/events"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400 border border-dashed border-neutral-200 rounded-2xl">
                <Calendar className="w-8 h-8 stroke-1 text-neutral-300 mb-2" />
                <p className="text-xs font-medium">No upcoming campus events scheduled</p>
                <Link
                  href="/dashboard/events/new"
                  className="mt-3 text-xs font-bold text-brand hover:underline"
                >
                  + Create an event
                </Link>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:border-purple-200 hover:bg-neutral-50/50 transition-all"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-purple-50 text-brand shrink-0">
                      <span className="text-[10px] font-black uppercase">
                        {new Date(event.event_date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-sm font-black leading-none">
                        {new Date(event.event_date).getDate()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-900 truncate">
                        {event.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-neutral-400">
                        {event.department_name && (
                          <span className="font-semibold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                            {event.department_code || event.department_name}
                          </span>
                        )}
                        {event.club_name && (
                          <span className="text-neutral-500">· {event.club_name}</span>
                        )}
                        <span className="flex items-center gap-0.5 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {event.venue}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                    <span className="text-xs font-bold text-neutral-900">
                      {event.registrations_count} registered
                    </span>
                    {event.approval_status === "approved" && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Approved
                      </span>
                    )}
                    {event.approval_status === "pending_approval" && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Events & Turnout */}
        <div className="bg-white rounded-3xl p-6 lg:p-7 border border-neutral-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Recent Campus Events</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Past activities, verified turnout and attendance stats</p>
            </div>
            <Link
              href="/dashboard/campus/events"
              className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recentEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400 border border-dashed border-neutral-200 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 stroke-1 text-neutral-300 mb-2" />
                <p className="text-xs font-medium">No past events recorded yet</p>
              </div>
            ) : (
              recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-neutral-100 hover:border-neutral-200 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold text-xs shrink-0">
                      {event.attendance_rate}%
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-900 truncate">
                        {event.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400">
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        {event.department_code && (
                          <span className="font-semibold text-neutral-600 bg-neutral-100 px-1 py-0.2 rounded text-[10px]">
                            {event.department_code}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <p className="text-xs font-bold text-neutral-800">
                      {event.attendees_count} / {event.registrations_count}
                    </p>
                    <span className="text-[10px] text-neutral-400">attended</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
