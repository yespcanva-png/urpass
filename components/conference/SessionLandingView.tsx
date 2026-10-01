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
  Share2,
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
    <div className="min-h-screen bg-slate-50/50 text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href={`/e/${eventSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {eventName} Agenda
        </Link>

        {/* Conflict Alert Banner */}
        {conflictMsg && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>{conflictMsg}</span>
          </div>
        )}

        {/* Main Session Card */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                {typeCfg.label}
              </span>

              {track && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-md text-neutral-800 bg-neutral-50 border border-neutral-200 inline-flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: track.colour }}
                  />
                  {track.name}
                </span>
              )}

              {session.registration_required && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Seat Reservation Required
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
              title="Share Session"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            {session.title}
          </h1>

          {/* Meta Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Date</p>
                <p className="text-xs font-bold text-neutral-900">{session.session_date}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
              <Clock className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Time</p>
                <p className="text-xs font-bold text-neutral-900">
                  {formatSessionTimeRange(session.start_time, session.end_time)}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <div>
                <p className="text-[10px] text-neutral-400 uppercase font-semibold">Hall / Room</p>
                <p className="text-xs font-bold text-neutral-900 truncate">
                  {room ? room.name : "Main Stage"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {session.description && (
            <div className="pt-2">
              <h2 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                About this Session
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                {session.description}
              </p>
            </div>
          )}

          {/* Speakers Section */}
          {speakers.length > 0 && (
            <div className="pt-4 border-t border-neutral-200/80">
              <h2 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-4">
                Featured Speakers & Presenters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {speakers.map((sp: any) => (
                  <div
                    key={sp.id}
                    className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-start gap-3 shadow-2xs"
                  >
                    {sp.photo ? (
                      <img
                        src={sp.photo}
                        alt={sp.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center font-bold text-white shrink-0 shadow-2xs">
                        {sp.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-900 leading-tight">{sp.name}</p>
                      {sp.job_title && (
                        <p className="text-xs font-semibold text-neutral-600 mt-0.5 truncate">{sp.job_title}</p>
                      )}
                      {sp.company && (
                        <p className="text-xs text-neutral-400 truncate">{sp.company}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <Users className="w-4 h-4 text-neutral-400" />
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
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs"
                  }`}
                >
                  {isReserved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Seat Reserved
                    </>
                  ) : (
                    "Reserve Your Seat"
                  )}
                </button>
              ) : (
                <button
                  onClick={handleReserve}
                  className="px-6 py-3 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 shadow-xs"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
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
