"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  MessageCircle,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Sliders,
  Mail,
  Search,
  Download,
  Trash2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  saveEventFeedbackForm,
  deleteEventFeedback,
} from "@/app/actions/event-feedback";
import {
  type EventFeedbackFormConfig,
  type AttendeeFeedbackSubmission,
  type FeedbackAnalyticsStats,
} from "@/lib/event-feedback";
import { broadcastPostEventThankYou } from "@/app/actions/event-engagement";
import EventFeedbackFormBuilder from "./EventFeedbackFormBuilder";

interface Props {
  eventId: string;
  eventName: string;
  applySlug?: string | null;
  initialForm: EventFeedbackFormConfig;
  initialResponses: AttendeeFeedbackSubmission[];
  initialStats: FeedbackAnalyticsStats;
  approvedCount: number;
}

export default function EventFeedbackManager({
  eventId,
  eventName,
  applySlug,
  initialForm,
  initialResponses,
  initialStats,
  approvedCount,
}: Props) {
  const [activeTab, setActiveTab] = useState<"builder" | "responses">("builder");

  // Form Builder state
  const [formConfig, setFormConfig] = useState<EventFeedbackFormConfig>(initialForm);

  // Responses state
  const [responses, setResponses] = useState<AttendeeFeedbackSubmission[]>(initialResponses);
  const [stats, setStats] = useState<FeedbackAnalyticsStats>(initialStats);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Status & notifications
  const [isSaving, startSaving] = useTransition();
  const [isBroadcasting, startBroadcasting] = useTransition();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Hydration safety: ensure server and initial client render match deterministically
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://urpass.space";
  const appUrl = mounted && typeof window !== "undefined" ? window.location.origin : defaultAppUrl;
  const publicSlug = applySlug || eventId;
  const feedbackUrl = `${appUrl}/feedback/${publicSlug}`;

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(feedbackUrl);
      setCopied(true);
      showToast("Feedback link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Unable to copy to clipboard", "error");
    }
  };

  const whatsappShareText = `🌟 Thank you for being a part of *${eventName}*!\n\nWe'd love your candid thoughts so we can make our next event even better.\nPlease take 60 seconds to share your feedback here:\n👉 ${feedbackUrl}`;

  const handleToggleEnabled = () => {
    const updated = { ...formConfig, is_enabled: !formConfig.is_enabled };
    setFormConfig(updated);
    startSaving(async () => {
      const res = await saveEventFeedbackForm(eventId, updated);
      if (res.success) {
        showToast(updated.is_enabled ? "Feedback form activated!" : "Feedback form paused.");
      } else {
        showToast(res.error || "Failed to update form status", "error");
      }
    });
  };

  const handleSaveForm = () => {
    startSaving(async () => {
      const res = await saveEventFeedbackForm(eventId, formConfig);
      if (res.success) {
        showToast("Form saved successfully!");
      } else {
        showToast(res.error || "Failed to save form", "error");
      }
    });
  };

  const handleDeleteResponse = async (responseId: string) => {
    if (!confirm("Are you sure you want to delete this response?")) return;
    setIsDeleting(responseId);
    try {
      const res = await deleteEventFeedback(eventId, responseId);
      if (res.success) {
        setResponses((prev) => prev.filter((r) => r.id !== responseId));
        setStats((prev) => ({
          ...prev,
          totalCount: Math.max(0, prev.totalCount - 1),
        }));
        showToast("Response removed.");
      } else {
        showToast(res.error || "Failed to delete response", "error");
      }
    } catch {
      showToast("Error deleting response", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBroadcastEmail = () => {
    if (approvedCount === 0) {
      showToast("No approved attendees found to email.", "error");
      return;
    }
    if (!confirm(`Send feedback request email to ${approvedCount} attendees?`)) {
      return;
    }
    startBroadcasting(async () => {
      const res = await broadcastPostEventThankYou(eventId);
      if (res.error) {
        showToast(res.error, "error");
      } else {
        showToast(`Feedback survey emailed to ${res.count ?? 0} attendees!`);
      }
    });
  };

  const handleExportCSV = () => {
    if (responses.length === 0) {
      showToast("No feedback responses to export.", "error");
      return;
    }

    const headers = [
      "Submission ID",
      "Date",
      "Attendee Name",
      "Attendee Email",
      "Overall Rating (1-5)",
      "NPS Score (0-10)",
    ];

    const customQuestions = (formConfig.questions && formConfig.questions.length > 0)
      ? formConfig.questions
      : formConfig.custom_questions || [];

    customQuestions.forEach((q) => headers.push(`"${q.label.replace(/"/g, '""')}"`));

    const rows = responses.map((r) => {
      const row = [
        r.id,
        new Date(r.created_at).toISOString(),
        `"${(r.attendee_name || "").replace(/"/g, '""')}"`,
        `"${(r.attendee_email || "").replace(/"/g, '""')}"`,
        r.rating,
        r.nps_score ?? "",
      ];

      customQuestions.forEach((q) => {
        const val = r.answers?.[q.id];
        const strVal = Array.isArray(val)
          ? val.join("; ")
          : typeof val === "boolean"
          ? val ? "Yes" : "No"
          : val !== undefined && val !== null
          ? String(val)
          : "";
        row.push(`"${strVal.replace(/"/g, '""')}"`);
      });

      return row.join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `feedback-${eventName.toLowerCase().replace(/\s+/g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Feedback CSV exported!");
  };

  // Filtered responses
  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      if (ratingFilter !== "all" && r.rating !== ratingFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = (r.attendee_name || "").toLowerCase().includes(q);
        const emailMatch = (r.attendee_email || "").toLowerCase().includes(q);
        const textMatch = (r.feedback_text || "").toLowerCase().includes(q);
        return nameMatch || emailMatch || textMatch;
      }
      return true;
    });
  }, [responses, ratingFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold shadow-lg border animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === "success"
              ? "bg-neutral-900 text-white border-neutral-800"
              : "bg-red-600 text-white border-red-500"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ── Header Card ── */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Post-Event Suite</span>
              <button
                type="button"
                onClick={handleToggleEnabled}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
                  formConfig.is_enabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200"
                }`}
                title="Click to toggle form active status"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${formConfig.is_enabled ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                <span>{formConfig.is_enabled ? "Accepting Responses" : "Form Paused"}</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Event Feedback Form
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
              Customize questions, share your link with attendees, and track satisfaction ratings in real time.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Link"}</span>
            </button>

            <a
              suppressHydrationWarning
              href={`https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:opacity-90 transition-opacity"
              title="Share via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
              title="Show QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>

            <Link
              href={`/feedback/${publicSlug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
              title="Open public attendee form preview"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview ↗</span>
            </Link>

            {approvedCount > 0 && (
              <button
                type="button"
                onClick={handleBroadcastEmail}
                disabled={isBroadcasting}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-brand bg-brand/10 hover:bg-brand/20 transition-colors disabled:opacity-50"
              >
                {isBroadcasting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                <span>{isBroadcasting ? "Sending..." : "Email Attendees"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Shareable Link Display */}
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 overflow-hidden text-xs text-neutral-500">
          <span className="font-bold text-neutral-400 uppercase text-[10px] tracking-wider shrink-0">Attendee URL:</span>
          <code suppressHydrationWarning className="text-neutral-800 font-mono text-xs truncate select-all">{feedbackUrl}</code>
        </div>
      </div>

      {/* ── 2 Simple Main Tabs: Builder & Responses ── */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "builder"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Form Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("responses")}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "responses"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Responses &amp; Analytics ({responses.length})</span>
          </button>
        </div>

        {activeTab === "builder" && (
          <button
            type="button"
            onClick={handleSaveForm}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors disabled:opacity-50 shadow-xs mb-1"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        )}
      </div>

      {/* ── TAB 1: FORM BUILDER ── */}
      {activeTab === "builder" && (
        <EventFeedbackFormBuilder
          config={formConfig}
          onChange={(updated) => setFormConfig(updated)}
        />
      )}

      {/* ── TAB 2: RESPONSES & ANALYTICS ── */}
      {activeTab === "responses" && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Average Rating</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-neutral-900">
                  {stats.totalCount > 0 ? stats.averageRating.toFixed(1) : "—"}
                </span>
                <span className="text-xs text-neutral-400 font-semibold">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(stats.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-neutral-100 text-neutral-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Responses</span>
              <div className="text-3xl font-black text-neutral-900 mt-2">{stats.totalCount}</div>
              <p className="text-[11px] text-neutral-500 mt-2">
                {approvedCount > 0
                  ? `${Math.round((stats.totalCount / approvedCount) * 100)}% response rate`
                  : "From registered attendees"}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Net Promoter Score</span>
              <div className="text-3xl font-black text-neutral-900 mt-2">
                {stats.npsScore !== null ? (stats.npsScore > 0 ? `+${stats.npsScore}` : stats.npsScore) : "—"}
              </div>
              <p className="text-[11px] text-neutral-500 mt-2">
                {stats.npsScore !== null
                  ? `${stats.npsBreakdown.promoters} Promoters · ${stats.npsBreakdown.detractors} Detractors`
                  : "Calculated from NPS question"}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-xs">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Satisfaction Rate</span>
              <div className="text-3xl font-black text-neutral-900 mt-2">
                {stats.totalCount > 0
                  ? `${Math.round(
                      ((stats.ratingBreakdown[5] + stats.ratingBreakdown[4]) / stats.totalCount) * 100
                    )}%`
                  : "—"}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Positive 4★ &amp; 5★ ratings</span>
              </p>
            </div>
          </div>

          {/* Rating Breakdown Chart */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Rating Breakdown</h3>
            <div className="space-y-2.5 max-w-xl">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingBreakdown[star as 1 | 2 | 3 | 4 | 5] || 0;
                const pct = stats.totalCount > 0 ? Math.round((count / stats.totalCount) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 w-12 font-bold text-neutral-700">
                      <span>{star}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-neutral-500 font-medium">{pct}%</span>
                    <span className="w-8 text-right text-neutral-400 text-[11px]">({count})</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls Bar (Search, Filter, Export) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-100 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews by attendee name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-neutral-200 outline-none focus:border-neutral-900"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setRatingFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                  ratingFilter === "all"
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                All ({responses.length})
              </button>
              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRatingFilter(s)}
                  className={`flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                    ratingFilter === s
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <span>{s}★</span>
                </button>
              ))}

              <button
                type="button"
                onClick={handleExportCSV}
                disabled={responses.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-40 shrink-0 ml-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Response Cards List */}
          {filteredResponses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 shadow-xs">
              <p className="text-sm font-bold text-neutral-700 mb-1">No responses found</p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                {searchQuery || ratingFilter !== "all"
                  ? "Try resetting your search query or star filter."
                  : "Share your form link with attendees to start collecting feedback."}
              </p>
              {(searchQuery || ratingFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setRatingFilter("all");
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResponses.map((r) => {
                const submissionDate = new Date(r.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand font-bold text-xs flex items-center justify-center">
                          {(r.attendee_name || "A").slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-neutral-900">
                              {r.attendee_name || "Anonymous Attendee"}
                            </h4>
                            {r.attendee_email && (
                              <span className="text-[11px] text-neutral-400">&lt;{r.attendee_email}&gt;</span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400">{submissionDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-800 font-bold text-xs">
                          <span>{r.rating} / 5</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>

                        {r.nps_score !== null && r.nps_score !== undefined && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-neutral-100 text-neutral-700">
                            NPS: {r.nps_score}/10
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteResponse(r.id)}
                          disabled={isDeleting === r.id}
                          className="p-1.5 rounded-lg text-neutral-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete response"
                        >
                          {isDeleting === r.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {r.feedback_text && (
                      <p className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100 italic">
                        &ldquo;{r.feedback_text}&rdquo;
                      </p>
                    )}

                    {r.answers && Object.keys(r.answers).length > 0 && (
                      <div className="pt-2 border-t border-neutral-100 space-y-1">
                        {Object.entries(r.answers).map(([qId, ans]) => {
                          if (ans === undefined || ans === null || ans === "") return null;
                          const qObj =
                            formConfig.questions?.find((q) => q.id === qId) ||
                            formConfig.custom_questions?.find((q) => q.id === qId);
                          const qText = qObj ? qObj.label : qId;
                          const displayVal = Array.isArray(ans)
                            ? ans.join(", ")
                            : typeof ans === "boolean"
                            ? ans ? "Yes" : "No"
                            : String(ans);
                          return (
                            <div key={qId} className="text-xs">
                              <span className="font-semibold text-neutral-600">{qText}: </span>
                              <span className="text-neutral-800">{displayVal}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* QR Code Modal for In-Venue Display */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-neutral-100 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-neutral-900 mb-1">Feedback Form QR Code</h3>
            <p className="text-xs text-neutral-500 mb-4">
              Project this on screen or print for attendees to scan and give feedback instantly.
            </p>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 inline-block mb-4">
              <QRCodeSVG
                value={feedbackUrl}
                size={180}
                level="H"
                includeMargin
              />
            </div>

            <p suppressHydrationWarning className="text-[11px] text-neutral-400 break-all mb-4 px-2">
              {feedbackUrl}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
              >
                Copy Link
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-neutral-900 text-white hover:bg-neutral-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
