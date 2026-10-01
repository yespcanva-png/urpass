"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  DoorOpen,
  TrendingUp,
  Award,
  AlertCircle,
  BarChart2,
  Clock,
  Sparkles,
  Download,
} from "lucide-react";
import type { ConferenceAnalytics } from "@/types/conference";

interface ConferenceAnalyticsWidgetProps {
  eventId: string;
}

export default function ConferenceAnalyticsWidget({ eventId }: ConferenceAnalyticsWidgetProps) {
  const [stats, setStats] = useState<ConferenceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/events/${eventId}/conference-analytics`);
        if (res.ok) {
          const json = await res.json();
          setStats(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [eventId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-xs animate-pulse space-y-4">
        <div className="h-5 w-48 bg-neutral-100 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-neutral-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalSessions === 0) {
    return null; // Only show if event has conference sessions
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 leading-tight">
              Conference & Session Analytics
            </h3>
            <p className="text-xs text-neutral-400">
              Live session check-in velocity, seat reservations, and hall utilisation
            </p>
          </div>
        </div>
        <a
          href={`/api/events/${eventId}/sessions/export-csv`}
          download
          className="px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 rounded-xl transition-colors inline-flex items-center gap-1.5 shrink-0"
          title="Download detailed attendee check-in and check-out logs"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          <span>Export Attendance CSV</span>
        </a>
      </div>

      {/* ── Top Metric Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-neutral-50/70 border border-neutral-100">
          <p className="text-xs font-semibold text-neutral-500">Total Sessions</p>
          <p className="text-xl font-bold text-neutral-900 mt-1">{stats.totalSessions}</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">{stats.totalSpeakers} Speakers</p>
        </div>

        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100/80">
          <p className="text-xs font-semibold text-purple-700">Session Reservations</p>
          <p className="text-xl font-bold text-purple-900 mt-1">{stats.totalReservations}</p>
          <p className="text-[11px] text-purple-600 mt-0.5">Pre-booked seats</p>
        </div>

        <div className="p-4 rounded-xl bg-green-50/50 border border-green-100/80">
          <p className="text-xs font-semibold text-green-700">Session Attendance</p>
          <p className="text-xl font-bold text-green-900 mt-1">{stats.totalCheckIns}</p>
          <p className="text-[11px] text-green-600 mt-0.5">
            Avg {stats.averageSessionAttendance} / session
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/80">
          <p className="text-xs font-semibold text-amber-700">No-Show Rate</p>
          <p className="text-xl font-bold text-amber-900 mt-1">{stats.noShowRate}%</p>
          <p className="text-[11px] text-amber-600 mt-0.5">Reserved vs arrived</p>
        </div>
      </div>

      {/* ── Popular Sessions & Extremes ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.mostPopularSession && (
          <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
              <Award className="w-4 h-4 text-purple-600" />
              Most Popular Session
            </div>
            <p className="text-sm font-bold text-neutral-900 truncate">
              {stats.mostPopularSession.title}
            </p>
            <p className="text-xs text-neutral-500">
              {stats.mostPopularSession.checkIns} attended •{" "}
              {stats.mostPopularSession.reservations} reserved
            </p>
          </div>
        )}

        {stats.leastAttendedSession && (
          <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
              <BarChart2 className="w-4 h-4 text-neutral-400" />
              Least Attended Session
            </div>
            <p className="text-sm font-bold text-neutral-900 truncate">
              {stats.leastAttendedSession.title}
            </p>
            <p className="text-xs text-neutral-500">
              {stats.leastAttendedSession.checkIns} attended •{" "}
              {stats.leastAttendedSession.reservations} reserved
            </p>
          </div>
        )}
      </div>

      {/* ── Room Utilisation Table ────────────────────────────── */}
      {stats.roomUtilisation && stats.roomUtilisation.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Room & Hall Utilisation
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.roomUtilisation.map((r) => (
              <div
                key={r.roomId}
                className="p-3.5 rounded-xl border border-neutral-100 bg-white space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 truncate">{r.roomName}</span>
                  <span className="text-xs font-bold text-purple-700">
                    {r.averageOccupancyPercent}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all"
                    style={{ width: `${Math.min(100, r.averageOccupancyPercent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
                  <span>{r.sessionsCount} sessions</span>
                  <span>{r.capacity} capacity</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Peak Entry Times Distribution ─────────────────────── */}
      {stats.peakEntryTimes && stats.peakEntryTimes.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-neutral-100">
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            Peak Session Entry Distribution
          </h4>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {stats.peakEntryTimes.map((entry, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs flex items-center gap-2"
              >
                <span className="font-semibold text-neutral-700">{entry.timeSlot}</span>
                <span className="text-neutral-400">•</span>
                <span className="font-bold text-purple-600">{entry.count} scans</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
