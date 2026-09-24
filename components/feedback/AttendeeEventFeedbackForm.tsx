"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Loader2,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Send,
  HeartHandshake,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Check,
} from "lucide-react";
import { submitAttendeeFeedback } from "@/app/actions/event-feedback";
import { type EventFeedbackFormConfig, type FormQuestion } from "@/lib/event-feedback";

interface Props {
  formConfig: EventFeedbackFormConfig;
  event: {
    id: string;
    name: string;
    event_date: string;
    venue: string;
    apply_slug: string | null;
    logo_url: string | null;
  };
  initialEmail?: string;
  initialName?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "Needs Improvement 😕",
  2: "Fair 🙂",
  3: "Good 👍",
  4: "Very Good! 🌟",
  5: "Exceptional! 🚀",
};

export default function AttendeeEventFeedbackForm({
  formConfig,
  event,
  initialEmail = "",
  initialName = "",
}: Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[] | number | boolean>>({});
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const primaryColor = formConfig.theme?.primaryColor || "#6D28D9";
  const questions = formConfig.questions && formConfig.questions.length > 0
    ? formConfig.questions
    : [];

  const handleSingleAnswer = (qId: string, val: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleCheckboxToggle = (qId: string, optionVal: string) => {
    setAnswers((prev) => {
      const current = (prev[qId] as string[]) || [];
      if (current.includes(optionVal)) {
        return { ...prev, [qId]: current.filter((o) => o !== optionVal) };
      } else {
        return { ...prev, [qId]: [...current, optionVal] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate required questions
    for (const q of questions) {
      if (q.required) {
        const ans = answers[q.id];
        if (ans === undefined || ans === null || ans === "") {
          setErrorMessage(`Please answer: "${q.label}"`);
          return;
        }
        if (Array.isArray(ans) && ans.length === 0) {
          setErrorMessage(`Please select at least one option for: "${q.label}"`);
          return;
        }
      }
    }

    if (formConfig.require_attendee_email && (!email || !email.includes("@"))) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (formConfig.require_attendee_name && (!name || name.trim().length === 0)) {
      setErrorMessage("Please provide your name.");
      return;
    }

    // Determine overall rating (check if any question of type rating was answered)
    let derivedRating = 5;
    for (const q of questions) {
      if (q.type === "rating" && typeof answers[q.id] === "number") {
        derivedRating = answers[q.id] as number;
        break;
      }
    }

    // Determine NPS score if present
    let derivedNps: number | null = null;
    for (const q of questions) {
      if (q.type === "nps" && typeof answers[q.id] === "number") {
        derivedNps = answers[q.id] as number;
        break;
      }
    }

    startTransition(async () => {
      try {
        const res = await submitAttendeeFeedback(event.id, {
          attendee_name: name.trim() || undefined,
          attendee_email: email.trim() || undefined,
          rating: derivedRating,
          nps_score: derivedNps,
          answers,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Failed to submit feedback. Please try again.");
        } else {
          setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Failed to submit feedback. Please try again.");
      }
    });
  };

  if (!formConfig.is_enabled) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Feedback Submissions Closed</h1>
        <p className="text-sm text-neutral-500 mb-6">
          The feedback form for <strong>{event.name}</strong> is no longer accepting new responses. Thank you for your interest!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
        >
          Return to URPASS
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    const thankYouHeadline = formConfig.thank_you?.headline || "Thank You for Your Feedback!";
    const thankYouMessage = formConfig.thank_you?.message || `Your response has been delivered directly to the organizers of ${event.name}.`;
    const ctaText = formConfig.thank_you?.ctaText;
    const ctaUrl = formConfig.thank_you?.ctaUrl;

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Response Submitted</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">{thankYouHeadline}</h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto mb-8 leading-relaxed">
          {thankYouMessage}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {ctaUrl && ctaText && (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              <span>{ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {event.apply_slug && (
            <Link
              href={`/apply/${event.apply_slug}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
            >
              <span>View Event Details</span>
            </Link>
          )}
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <span>Powered by URPASS</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Event Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 border"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
                borderColor: `${primaryColor}30`,
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Event Feedback Survey</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight mb-2">
              {formConfig.title || `Share Your Feedback for ${event.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              {formConfig.description || `We'd love to know your thoughts on ${event.name}.`}
            </p>
          </div>
        </div>

        {/* Event Meta Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-100 text-xs text-neutral-600 font-medium">
          <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate max-w-[220px]">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* Main Feedback Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dynamic Questions Render */}
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== "";
          const currentRating = typeof answers[q.id] === "number" ? (answers[q.id] as number) : 0;
          const currentHover = hoveredStars[q.id] || 0;
          const maxStars = q.maxRating || 5;

          return (
            <div
              key={q.id || idx}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-neutral-100 space-y-3"
            >
              <div>
                <label className="block text-sm font-bold text-neutral-900 mb-0.5">
                  {q.label} {q.required && <span className="text-red-500">*</span>}
                </label>
                {q.description && (
                  <p className="text-xs text-neutral-500 mb-3">{q.description}</p>
                )}
              </div>

              {/* 1. STAR RATING */}
              {q.type === "rating" && (
                <div className="flex flex-col items-center justify-center p-5 bg-neutral-50/70 rounded-2xl border border-neutral-100">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => {
                      const active = star <= (currentHover || currentRating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleSingleAnswer(q.id, star)}
                          onMouseEnter={() =>
                            setHoveredStars((prev) => ({ ...prev, [q.id]: star }))
                          }
                          onMouseLeave={() =>
                            setHoveredStars((prev) => ({ ...prev, [q.id]: 0 }))
                          }
                          className="p-1 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-150 ${
                              active
                                ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                : "fill-none text-neutral-300 hover:text-neutral-400"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="h-5 mt-2 flex items-center justify-center">
                    {(currentHover > 0 || currentRating > 0) && (
                      <span className="text-[11px] font-bold text-neutral-700 px-3 py-0.5 rounded-full bg-white shadow-2xs border border-neutral-200/80 animate-in fade-in">
                        {RATING_LABELS[currentHover || currentRating] || `${currentHover || currentRating} Stars`}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 2. SINGLE CHOICE (RADIO) */}
              {q.type === "single_choice" && (
                <div className="space-y-2 pt-1">
                  {(q.options || []).map((opt, optIdx) => {
                    const isSelected = answers[q.id] === opt;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSingleAnswer(q.id, opt)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                            : "bg-neutral-50/60 hover:bg-neutral-100 border-neutral-200/80 text-neutral-800"
                        }`}
                      >
                        <span>{opt}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-white bg-white text-neutral-900" : "border-neutral-300"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-neutral-900" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. MULTIPLE CHOICE (CHECKBOXES) */}
              {q.type === "multiple_choice" && (
                <div className="space-y-2 pt-1">
                  {(q.options || []).map((opt, optIdx) => {
                    const currentList = (answers[q.id] as string[]) || [];
                    const isSelected = currentList.includes(opt);
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleCheckboxToggle(q.id, opt)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                            : "bg-neutral-50/60 hover:bg-neutral-100 border-neutral-200/80 text-neutral-800"
                        }`}
                      >
                        <span>{opt}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isSelected ? "border-white bg-white text-neutral-900" : "border-neutral-300"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-neutral-900 font-bold" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4. SHORT TEXT */}
              {q.type === "text" && (
                <input
                  type="text"
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleSingleAnswer(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full text-xs rounded-xl border border-neutral-200 px-3.5 py-2.5 outline-none focus:border-neutral-900 transition-colors"
                />
              )}

              {/* 5. PARAGRAPH */}
              {q.type === "paragraph" && (
                <textarea
                  rows={3}
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleSingleAnswer(q.id, e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full text-xs rounded-xl border border-neutral-200 p-3.5 outline-none focus:border-neutral-900 transition-colors resize-none placeholder:text-neutral-400"
                />
              )}

              {/* 6. NPS (0-10) */}
              {q.type === "nps" && (
                <div className="pt-2">
                  <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 sm:gap-2 mb-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                      const isSelected = answers[q.id] === score;
                      let colorClass = "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100";
                      if (isSelected) {
                        if (score <= 6) colorClass = "bg-rose-500 text-white border-rose-500 shadow-xs";
                        else if (score <= 8) colorClass = "bg-amber-500 text-white border-amber-500 shadow-xs";
                        else colorClass = "bg-emerald-600 text-white border-emerald-600 shadow-xs";
                      }

                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleSingleAnswer(q.id, score)}
                          className={`h-10 rounded-xl font-bold text-xs border transition-all flex items-center justify-center ${colorClass}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium px-1">
                    <span>{q.scaleStartLabel || "0 = Not likely"}</span>
                    <span>{q.scaleEndLabel || "10 = Extremely likely"}</span>
                  </div>
                </div>
              )}

              {/* 7. YES / NO */}
              {q.type === "yes_no" && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSingleAnswer(q.id, true)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                      answers[q.id] === true
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-neutral-50/60 hover:bg-neutral-100 border-neutral-200 text-neutral-700"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes, Absolutely</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSingleAnswer(q.id, false)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                      answers[q.id] === false
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-neutral-50/60 hover:bg-neutral-100 border-neutral-200 text-neutral-700"
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>No / Not Really</span>
                  </button>
                </div>
              )}

              {/* 8. DROPDOWN */}
              {q.type === "dropdown" && (
                <select
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleSingleAnswer(q.id, e.target.value)}
                  className="w-full text-xs rounded-xl border border-neutral-200 px-3.5 py-2.5 outline-none focus:border-neutral-900 transition-colors bg-white font-medium text-neutral-800"
                >
                  <option value="">-- Select an option --</option>
                  {(q.options || []).map((opt, optIdx) => (
                    <option key={optIdx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}

        {/* Attendee Info Card (Name / Email) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-neutral-900">
              Your Details {formConfig.allow_anonymous && <span className="text-neutral-400 font-normal">(Optional)</span>}
            </h3>
            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>{formConfig.allow_anonymous ? "Anonymous submission allowed" : "Identity required"}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Your Name {formConfig.require_attendee_name && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={formConfig.allow_anonymous ? "Leave blank to stay anonymous" : "Your full name"}
                className="w-full text-xs rounded-xl border border-neutral-200 px-3.5 py-2.5 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Email Address {formConfig.require_attendee_email && <span className="text-red-500">*</span>}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com (optional)"
                className="w-full text-xs rounded-xl border border-neutral-200 px-3.5 py-2.5 outline-none focus:border-neutral-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Your Feedback...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{formConfig.theme?.submitButtonText || "Submit Event Feedback"}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
