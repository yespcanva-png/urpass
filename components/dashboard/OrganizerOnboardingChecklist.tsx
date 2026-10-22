"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  Plus,
  Palette,
  Globe,
  QrCode,
  ScanLine,
} from "lucide-react";

interface OrganizerOnboardingChecklistProps {
  firstEventId?: string;
  firstEventSlug?: string;
  hasEvents: boolean;
  isEventActive: boolean;
  totalPasses: number;
  totalCheckedIn: number;
}

const STORAGE_KEY = "urpass_organizer_checklist_minimized";
const DISMISS_KEY = "urpass_organizer_checklist_dismissed";

export default function OrganizerOnboardingChecklist({
  firstEventId,
  firstEventSlug,
  hasEvents,
  isEventActive,
  totalPasses,
  totalCheckedIn,
}: OrganizerOnboardingChecklistProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedMin = localStorage.getItem(STORAGE_KEY);
      if (savedMin === "true") setIsMinimized(true);
      const savedDismiss = localStorage.getItem(DISMISS_KEY);
      if (savedDismiss === "true") setIsDismissed(true);
    } catch {
      // ignore
    }
  }, []);

  const toggleMinimize = () => {
    const next = !isMinimized;
    setIsMinimized(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // ignore
    }
  };

  const steps = [
    {
      id: "create_event",
      title: "1. Create your event",
      desc: "Set event name, venue, schedule, and capacity.",
      completed: hasEvents,
      actionHref: "/create-event",
      actionLabel: hasEvents ? "View Event" : "Create Event",
      icon: Plus,
    },
    {
      id: "customize_pass",
      title: "2. Customize tickets & pass badge",
      desc: "Brand passes in Ticket Studio and configure ticket categories.",
      completed: hasEvents,
      actionHref: firstEventId ? `/studio/${firstEventId}` : "/create-event",
      actionLabel: "Open Studio",
      icon: Palette,
    },
    {
      id: "publish_event",
      title: "3. Publish your registration page",
      desc: "Make your event active to start accepting attendee registrations.",
      completed: isEventActive,
      actionHref: firstEventId ? `/event/${firstEventId}` : "/create-event",
      actionLabel: isEventActive ? "Live Page" : "Publish Event",
      icon: Globe,
    },
    {
      id: "register_attendee",
      title: "4. Register test attendee & get pass",
      desc: "Test the attendee registration flow and receive a digital QR pass.",
      completed: totalPasses > 0,
      actionHref: firstEventId
        ? `/apply/${firstEventSlug || firstEventId}`
        : "/create-event",
      actionLabel: "Open Registration",
      icon: QrCode,
    },
    {
      id: "test_scanner",
      title: "5. Test gate QR check-in",
      desc: "Scan the test QR pass with any smartphone camera to verify entry.",
      completed: totalCheckedIn > 0,
      actionHref: firstEventId ? `/scan/${firstEventId}` : "/scan",
      actionLabel: "Launch Scanner",
      icon: ScanLine,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const allCompleted = completedCount === steps.length;

  // Don't render until client mount to avoid hydration mismatch
  if (!isMounted) return null;
  if (isDismissed) return null;

  return (
    <div className="rounded-2xl border border-violet-200/90 bg-gradient-to-br from-violet-50/70 via-white to-purple-50/40 p-4 sm:p-5 shadow-2xs transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                Event Launch Checklist
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800">
                {completedCount} of {steps.length} completed ({progressPercent}%)
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 hidden sm:block">
              {allCompleted
                ? "All systems ready! Your event operations, ticketing, and scanning are live."
                : "Follow these 5 steps to launch your first event and verify gate check-in."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={toggleMinimize}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100/70 transition-colors cursor-pointer"
            title={isMinimized ? "Expand checklist" : "Collapse checklist"}
          >
            {isMinimized ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100/70 transition-colors cursor-pointer"
            title="Dismiss checklist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-violet-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-violet-600 h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Steps Body */}
      {!isMinimized && (
        <div className="mt-4 pt-3 border-t border-violet-100/80 space-y-2">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border transition-all ${
                  step.completed
                    ? "bg-white/80 border-emerald-100 text-neutral-700"
                    : "bg-white border-violet-100 text-neutral-900 shadow-2xs"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-neutral-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold ${
                        step.completed ? "text-neutral-600 line-through decoration-neutral-300" : "text-neutral-900"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  <Link
                    href={step.actionHref}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      step.completed
                        ? "text-neutral-500 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200"
                        : "text-white bg-violet-700 hover:bg-violet-800 shadow-2xs"
                    }`}
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
