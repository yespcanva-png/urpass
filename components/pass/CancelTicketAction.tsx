"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import {
  requestTicketCancellationAction,
} from "@/app/actions/ticket-cancellation";
import type { EligibilityResult } from "@/lib/cancellation/service";

interface CancelTicketActionProps {
  passToken: string;
  eventName: string;
  applicationStatus: string;
  passStatus: string;
  eligibility: EligibilityResult;
  cancellationToken?: string | null;
}

export default function CancelTicketAction({
  passToken,
  eventName,
  applicationStatus,
  passStatus,
  eligibility,
  cancellationToken,
}: CancelTicketActionProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const isCancelled = applicationStatus === "cancelled" || passStatus === "cancelled";
  const isPendingApproval = applicationStatus === "cancellation_requested";

  // Read-only banner if already cancelled
  if (isCancelled) {
    return (
      <div className="w-full max-w-sm my-4 p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs text-center no-print">
        <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldAlert className="w-4 h-4" />
          Ticket Cancelled
        </div>
        <p className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed">
          This admission pass has been cancelled and is no longer valid for venue entry.
        </p>
        {eligibility.refundPolicyText && (
          <p className="text-[11px] text-rose-500 dark:text-rose-400/80 mt-2 border-t border-rose-200/60 dark:border-rose-900/40 pt-2">
            {eligibility.refundPolicyText}
          </p>
        )}
      </div>
    );
  }

  // Read-only banner if awaiting approval
  if (isPendingApproval) {
    return (
      <div className="w-full max-w-sm my-4 p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 shadow-xs text-center no-print">
        <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
          <Clock className="w-4 h-4" />
          Cancellation Pending Approval
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
          Your cancellation request was submitted and is currently being reviewed by the event organizer.
        </p>
      </div>
    );
  }

  // If not eligible (e.g. self-service disabled, checked in, or deadline passed), do not disturb pass layout
  if (!eligibility.eligible) {
    return null;
  }

  async function handleConfirmCancellation() {
    if (eligibility.policy.requireReason && !reason.trim()) {
      setError("Please provide a brief reason for cancellation.");
      return;
    }
    if (!confirmChecked) {
      setError("Please check the confirmation box to proceed.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await requestTicketCancellationAction({
        passToken,
        reason: reason.trim(),
        cancellationToken: cancellationToken || undefined,
      });

      if (!res.success) {
        setError(res.message || "Failed to cancel ticket. Please try again.");
      } else {
        setResultMessage(res.message);
        router.refresh();
      }
    } catch {
      setError("A connection error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Discreet Trigger Button beneath pass content */}
      <div className="w-full max-w-sm mt-3 text-center no-print">
        <button
          type="button"
          onClick={() => {
            setError("");
            setResultMessage(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors py-1.5 px-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Unable to attend? Cancel ticket</span>
        </button>
      </div>

      {/* Modern Mobile-Friendly Confirmation Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >
          <div
            className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-neutral-200/80 dark:border-neutral-800 transform transition-transform animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="cancel-modal-title"
                    className="text-base font-bold text-neutral-900 dark:text-white"
                  >
                    Cancel Ticket
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[240px]">
                    {eventName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resultMessage ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  Request Recorded
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-xs mx-auto leading-relaxed">
                  {resultMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Policy Notice Box */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 space-y-2 text-xs">
                  {eligibility.deadlineFormatted && (
                    <div className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                      <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Cancellation Deadline:</span>{" "}
                        {eligibility.deadlineFormatted}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Refund Policy:</span>{" "}
                      {eligibility.refundPolicyText}
                    </div>
                  </div>

                  {eligibility.policy.requireOrganizerApproval && (
                    <div className="flex items-start gap-2 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40 p-2 rounded-xl border border-violet-200 dark:border-violet-900/40">
                      <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        Note: Requests require organizer approval before taking effect.
                      </span>
                    </div>
                  )}
                </div>

                {/* Reason Input */}
                <div>
                  <label
                    htmlFor="cancellation-reason"
                    className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5"
                  >
                    Reason for Cancellation{" "}
                    {eligibility.policy.requireReason ? (
                      <span className="text-rose-500">*</span>
                    ) : (
                      <span className="text-neutral-400 font-normal">(Optional)</span>
                    )}
                  </label>
                  <textarea
                    id="cancellation-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. Schedule conflict, travel change..."
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    maxLength={500}
                  />
                </div>

                {/* Explicit Confirmation Checkbox */}
                <label className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>
                    I understand that cancelling my ticket deactivates my QR pass and releases my reserved seat.
                  </span>
                </label>

                {error && (
                  <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {error}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={submitting}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Keep Ticket
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancellation}
                    disabled={submitting || !confirmChecked}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing…</span>
                      </>
                    ) : (
                      <span>Confirm Cancellation</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
