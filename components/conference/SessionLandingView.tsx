"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Star,
  Ticket,
  Globe,
  Share2,
  Sparkles,
} from "lucide-react";
import type { EventSession } from "@/types/conference";
import { formatSessionTimeRange } from "@/lib/conference/conflict-detection";
import { SESSION_TYPE_CONFIG } from "@/lib/conference/helpers";

interface SessionLandingViewProps {
  session: EventSession;
  eventSlug: string;
  eventName: string;
  initialPassToken?: string | null;
}

export default function SessionLandingView({
  session,
  eventSlug,
  eventName,
  initialPassToken,
}: SessionLandingViewProps) {
  const [passToken, setPassToken] = useState(initialPassToken || "");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conflictMsg, setConflictMsg] = useState<string | null>(null);

  const typeCfg =
    SESSION_TYPE_CONFIG[session.session_type] || SESSION_TYPE_CONFIG.presentation;
  const track = session.track;
  const room = session.room;
  const speakers = (session.speakers || []).map((s) => s.speaker).filter(Boolean);

  async function handleReserve() {
    if (!passToken && !attendeeEmail) {
      const emailInput = prompt("Please enter your registered event email address to reserve:");
      if (!emailInput) return;
      setAttendeeEmail(emailInput);
    }

    setLoading(true);
    setConflictMsg(null);

    try {
      const res = await fetch(`/api/sessions/${session.id}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passToken, email: attendeeEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.conflict) {
          setConflictMsg(data.message || "Schedule Conflict detected.");
          return;
        }
        alert(data.error || "Failed to reserve seat.");
        return;
      }

      setIsReserved(true);
      setIsSaved(true);
      alert(data.message || "Seat reserved successfully!");
    } catch (err: any) {
      alert(err.message || "Reservation failed");
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: session.title,
          text: `Check out "${session.title}" at ${eventName}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Session URL copied to clipboard!");
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0c16] text-white selection:bg-purple-600 selection:text-white font-sans antialiased py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href={`/e/${eventSlug}`}
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {eventName} Agenda
        </Link>

        {/* Conflict Alert Banner */}
        {conflictMsg && (
          <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-200 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{conflictMsg}</span>
          </div>
        )}

        {/* Main Session Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90">
                {typeCfg.label}
              </span>

              {track && (
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: track.colour }}
                >
                  {track.name}
                </span>
              )}

              {session.registration_required && (
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Seat Reservation Required
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="p-2 text-white/50 hover:text-white rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
              title="Share Session"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {session.title}
          </h1>

          {/* Meta Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-[10px] text-white/40 uppercase font-semibold">Date</p>
                <p className="text-xs font-bold text-white">{session.session_date}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-[10px] text-white/40 uppercase font-semibold">Time</p>
                <p className="text-xs font-bold text-white">
                  {formatSessionTimeRange(session.start_time, session.end_time)}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
              <MapPin className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-[10px] text-white/40 uppercase font-semibold">Hall / Room</p>
                <p className="text-xs font-bold text-white truncate">
                  {room ? room.name : "Main Stage"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {session.description && (
            <div className="pt-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                About this Session
              </h2>
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                {session.description}
              </p>
            </div>
          )}

          {/* Speakers Section */}
          {speakers.length > 0 && (
            <div className="pt-4 border-t border-white/[0.08]">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Featured Speakers & Presenters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {speakers.map((sp: any) => (
                  <div
                    key={sp.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3"
                  >
                    {sp.photo ? (
                      <img
                        src={sp.photo}
                        alt={sp.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center font-bold text-white shrink-0">
                        {sp.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white leading-tight">{sp.name}</p>
                      {sp.job_title && (
                        <p className="text-xs text-purple-300 mt-0.5 truncate">{sp.job_title}</p>
                      )}
                      {sp.company && (
                        <p className="text-xs text-white/50 truncate">{sp.company}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Users className="w-4 h-4 text-purple-400" />
              <span>
                Capacity: {session.capacity || room?.capacity || "Unlimited"}
                {session.reservation_count !== undefined && (
                  <span> • {session.reservation_count} currently reserved</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {session.registration_required ? (
                <button
                  onClick={handleReserve}
                  disabled={loading}
                  className={`px-6 py-3 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 ${
                    isReserved
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg"
                  }`}
                >
                  {isReserved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Seat Reserved
                    </>
                  ) : (
                    "Reserve Your Seat"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleReserve}
                  className="px-6 py-3 rounded-xl text-xs font-semibold bg-white text-neutral-900 hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
                >
                  <Star className="w-4 h-4 text-purple-600 fill-current" />
                  Add to My Agenda
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
