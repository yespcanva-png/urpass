"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Star,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  Mail,
  Loader2,
  CheckCircle2,
  Sliders,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { getEventFeedbackData } from "@/app/actions/event-feedback";
import { type FeedbackAnalyticsStats, type AttendeeFeedbackSubmission } from "@/lib/event-feedback";
import { broadcastPostEventThankYou } from "@/app/actions/event-engagement";

interface Props {
  eventId: string;
  eventName: string;
  applySlug?: string | null;
  approvedCount?: number;
}

export default function EventAttendeeFeedbackCard({
  eventId,
  eventName,
  applySlug,
  approvedCount = 0,
}: Props) {
  const [stats, setStats] = useState<FeedbackAnalyticsStats | null>(null);
  const [recentResponses, setRecentResponses] = useState<AttendeeFeedbackSubmission[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);
  const [isBroadcasting, startBroadcast] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
  const appUrl = mounted && typeof window !== "undefined" ? window.location.origin : defaultAppUrl;
  const publicSlug = applySlug || eventId;
  const feedbackUrl = `${appUrl}/feedback/${publicSlug}`;

  useEffect(() => {
    let mounted = true;
    getEventFeedbackData(eventId).then((res) => {
      if (mounted && res) {
        setStats(res.stats);
        setRecentResponses(res.responses.slice(0, 3));
        setIsEnabled(res.form.is_enabled);
      }
    });
    return () => {
      mounted = false;
    };
  }, [eventId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(feedbackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const whatsappText = `🌟 Thank you for attending *${eventName}*!\n\nWe'd love your candid thoughts so we can make our next event even better.\nPlease take 60 seconds to share your feedback here:\n👉 ${feedbackUrl}`;

  const handleSendPostEventEmail = () => {
    if (approvedCount === 0) {
      alert("No approved attendees found to email.");
      return;
    }
    if (!confirm(`Send thank-you email with feedback link to ${approvedCount} attendees?`)) {
      return;
    }
    setBroadcastStatus(null);
    startBroadcast(async () => {
      const res = await broadcastPostEventThankYou(eventId);
      if (res.error) {
        alert(res.error);
      } else {
        setBroadcastStatus(`Survey emailed to ${res.count ?? 0} attendees!`);
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 mb-6 border border-neutral-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900">Attendee Feedback &amp; Reviews</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isEnabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-neutral-100 text-neutral-500 border-neutral-200"
                }`}
              >
                {isEnabled ? "Form Active" : "Paused"}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Collect post-event feedback, manage custom questions, and analyze ratings from attendees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/event/${eventId}/feedback`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Form Builder &amp; All Reviews</span>
          </Link>
        </div>
      </div>

      {/* Share Link Banner */}
      <div className="mt-4 p-4 rounded-2xl bg-neutral-50/70 border border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide shrink-0">Attendee Link:</span>
          <code suppressHydrationWarning className="text-xs font-semibold text-neutral-800 truncate select-all">{feedbackUrl}</code>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>

          <a
            suppressHydrationWarning
            href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#25D366] hover:opacity-90 transition-opacity"
            title="Share directly via WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <Link
            href={`/feedback/${publicSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50"
            title="Preview attendee form"
          >
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Stats Summary & Recent Responses */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rating Metric */}
        <div className="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase">Average Rating</span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-black text-neutral-900">
                {stats && stats.totalCount > 0 ? stats.averageRating.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-neutral-400 font-semibold">/ 5.0</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  stats && star <= Math.round(stats.averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-neutral-100 text-neutral-200"
                }`}
              />
            ))}
            <span className="text-[11px] text-neutral-500 ml-1">
              ({stats ? stats.totalCount : 0} {stats?.totalCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        {/* NPS & Satisfaction */}
        <div className="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase">Recommendation</span>
            <div className="text-2xl font-black text-neutral-900 mt-1.5">
              {stats && stats.npsScore !== null
                ? stats.npsScore > 0
                  ? `+${stats.npsScore}`
                  : stats.npsScore
                : "—"}
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            {stats && stats.npsScore !== null
              ? `${stats.npsBreakdown.promoters} Promoters · ${stats.npsBreakdown.detractors} Detractors`
              : "Calculated via 0-10 NPS score"}
          </p>
        </div>

        {/* Email Broadcast Action */}
        <div className="p-4 rounded-2xl bg-violet-50/40 border border-violet-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Survey</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Send an appreciation note with the feedback link to all attendees.
            </p>
          </div>

          <div className="mt-3">
            {broadcastStatus && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mb-1.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>{broadcastStatus}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleSendPostEventEmail}
              disabled={isBroadcasting}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-brand hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isBroadcasting && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>{isBroadcasting ? "Sending..." : "Email Attendees"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Latest Reviews Strip */}
      {recentResponses.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Latest Feedback:</span>
            <Link
              href={`/event/${eventId}/feedback`}
              className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-0.5"
            >
              <span>View all responses</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {recentResponses.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-neutral-900 truncate max-w-[120px]">
                      {r.attendee_name || "Anonymous"}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-600 font-bold text-[11px]">
                      <span>{r.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                  <p className="text-neutral-600 line-clamp-2 italic text-[11px]">
                    {r.feedback_text ? `"${r.feedback_text}"` : "No comment left."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
